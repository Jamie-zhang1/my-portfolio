#!/usr/bin/env python3
"""Generate a password-protected, static traffic dashboard from Nginx logs.

The generated HTML keeps full IP addresses inside authenticated, collapsed details only.
"""

from __future__ import annotations

import argparse
import bisect
import gzip
import html
import ipaddress
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urlsplit

try:
    from geoip2.database import Reader as GeoIPReader
except ImportError:
    GeoIPReader = None


LOG_PATTERN = re.compile(
    r'^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+)(?: HTTP/[^\"]+)?" '
    r'(\d{3}) (\S+) "([^\"]*)" "([^\"]*)"'
)
BOT_PATTERN = re.compile(
    r"bot|crawler|spider|slurp|headless|lighthouse|playwright|curl|wget|python|"
    r"go-http|httpclient|postman|insomnia|semrush|ahrefs|uptime|monitor|check|"
    r"scan|zgrab|nmap|masscan|facebookexternalhit|bingpreview|yandex|baidu|"
    r"bytespider|gptbot|claudebot|petalbot|mj12bot|dotbot|applebot|aisearchindex",
    re.IGNORECASE,
)
STATIC_PATTERN = re.compile(
    r"\.(?:js|css|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|pdf|"
    r"txt|xml|json|webmanifest)$",
    re.IGNORECASE,
)
SPAM_REFERRERS = {"aisearchindex.space"}
UNVERIFIED_REFERRERS = {"citizen.org"}
PAGE_LABELS = {
    "/zh": "中文首页",
    "/en": "英文首页",
    "/zh/projects/researchflow-agent": "ResearchFlow Agent 案例",
    "/zh/projects/ai-decision-copilot": "AI 决策助手案例",
    "/zh/projects/proddoc-ai": "ProdDoc AI 案例",
    "/zh/projects/heard-sheep": "Heard Sheep 案例",
    "/zh/try/proddoc-ai": "ProdDoc AI 体验页",
    "/zh/try/decision-copilot": "AI 决策助手体验页",
}
DEFAULT_GEOIP_DB = Path("/usr/local/share/GeoIP/dbip-city-lite.mmdb")
CHINA_REGION_NAMES = {
    "Anhui": "安徽", "Beijing": "北京", "Chongqing": "重庆", "Fujian": "福建",
    "Gansu": "甘肃", "Guangdong": "广东", "Guangxi": "广西", "Guizhou": "贵州",
    "Hainan": "海南", "Hebei": "河北", "Heilongjiang": "黑龙江", "Henan": "河南",
    "Hubei": "湖北", "Hunan": "湖南", "Inner Mongolia": "内蒙古", "Jiangsu": "江苏",
    "Jiangxi": "江西", "Jilin": "吉林", "Liaoning": "辽宁", "Ningxia": "宁夏",
    "Qinghai": "青海", "Shaanxi": "陕西", "Shandong": "山东", "Shanghai": "上海",
    "Shanxi": "山西", "Sichuan": "四川", "Tianjin": "天津", "Tibet": "西藏",
    "Xinjiang": "新疆", "Yunnan": "云南", "Zhejiang": "浙江",
}
OTHER_REGION_NAMES = {"Hesse": "黑森州"}
CHINA_CITY_NAMES = {
    "Beijing": "北京", "Shanghai": "上海", "Guangzhou": "广州", "Shenzhen": "深圳",
    "Nanjing": "南京", "Suzhou": "苏州", "Hangzhou": "杭州", "Chengdu": "成都",
    "Chongqing": "重庆", "Tianjin": "天津", "Wuhan": "武汉", "Xi'an": "西安",
    "Shijiazhuang": "石家庄", "Yangpu (Yangpu Qu)": "杨浦区",
    "Haidian (Haidian Qu)": "海淀区",
    "Jinrongjie (Xicheng District)": "西城区金融街",
}


@dataclass(frozen=True)
class Record:
    timestamp: datetime
    ip: str
    method: str
    path: str
    query: str
    status: int
    referrer: str
    user_agent: str

    @property
    def visitor_key(self) -> tuple[str, str]:
        return (self.ip, self.user_agent)


@dataclass
class Session:
    visitor_key: tuple[str, str]
    pages: list[Record]
    verified: bool

    @property
    def started_at(self) -> datetime:
        return self.pages[0].timestamp


class GeoResolver:
    def __init__(self, database_path: Path):
        self._reader = None
        self._cache: dict[str, tuple[str, str]] = {}
        if GeoIPReader is not None and database_path.is_file():
            try:
                self._reader = GeoIPReader(str(database_path))
            except Exception:
                self._reader = None

    @property
    def available(self) -> bool:
        return self._reader is not None

    def lookup(self, ip: str) -> tuple[str, str]:
        cached = self._cache.get(ip)
        if cached is not None:
            return cached
        try:
            address = ipaddress.ip_address(ip)
            if not address.is_global:
                result = ("本地或保留地址", "本地或保留地址")
            elif self._reader is None:
                result = ("地区库未配置", "未知地区")
            else:
                response = self._reader.city(ip)
                country = (
                    response.country.names.get("zh-CN")
                    or response.country.names.get("en")
                    or response.country.name
                    or response.country.iso_code
                    or ""
                )
                subdivision = response.subdivisions.most_specific
                region = (
                    subdivision.names.get("zh-CN")
                    or subdivision.names.get("en")
                    or subdivision.name
                    or ""
                )
                city = (
                    response.city.names.get("zh-CN")
                    or response.city.names.get("en")
                    or response.city.name
                    or ""
                )
                if response.country.iso_code == "CN":
                    region = CHINA_REGION_NAMES.get(region, region)
                    city = CHINA_CITY_NAMES.get(city, city)
                else:
                    region = OTHER_REGION_NAMES.get(region, region)
                parts: list[str] = []
                for value in (country, region, city):
                    if value and value not in parts:
                        parts.append(value)
                detail = " · ".join(parts) if parts else "未知地区"
                if country and (region or city):
                    bucket = f"{country} · {region or city}"
                else:
                    bucket = country or "未知地区"
                result = (detail, bucket)
        except Exception:
            result = ("未知地区", "未知地区")
        self._cache[ip] = result
        return result

    def close(self) -> None:
        if self._reader is not None:
            self._reader.close()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--portfolio-dir",
        type=Path,
        default=Path("/var/log/portfolio-analytics"),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("/var/www/portfolio-analytics/index.html"),
    )
    parser.add_argument(
        "--geoip-db",
        type=Path,
        default=DEFAULT_GEOIP_DB,
    )
    return parser.parse_args()


def iter_log_paths(log_dir: Path, stem: str) -> list[Path]:
    return sorted(path for path in log_dir.glob(f"{stem}.log*") if path.is_file())


def parse_logs(paths: list[Path]) -> list[Record]:
    records: list[Record] = []
    for path in paths:
        opener = gzip.open if path.suffix == ".gz" else open
        with opener(path, "rt", encoding="utf-8", errors="replace") as stream:
            for line in stream:
                match = LOG_PATTERN.match(line)
                if not match:
                    continue
                ip, timestamp_text, method, uri, status, _size, referrer, user_agent = (
                    match.groups()
                )
                try:
                    timestamp = datetime.strptime(
                        timestamp_text, "%d/%b/%Y:%H:%M:%S %z"
                    )
                except ValueError:
                    continue
                parsed_uri = urlsplit(uri)
                records.append(
                    Record(
                        timestamp=timestamp,
                        ip=ip,
                        method=method,
                        path=parsed_uri.path,
                        query=parsed_uri.query,
                        status=int(status),
                        referrer=referrer,
                        user_agent=user_agent,
                    )
                )
    records.sort(key=lambda record: record.timestamp)
    return records


def referrer_host(referrer: str) -> str:
    if not referrer or referrer == "-":
        return ""
    try:
        host = (urlsplit(referrer).hostname or "").lower()
    except ValueError:
        return ""
    return host[4:] if host.startswith("www.") else host


def is_human_candidate(record: Record) -> bool:
    return (
        record.method == "GET"
        and 200 <= record.status < 400
        and bool(record.user_agent.strip())
        and not BOT_PATTERN.search(record.user_agent)
        and referrer_host(record.referrer) not in SPAM_REFERRERS
        and "_rsc=" not in record.query
    )


def is_asset(record: Record) -> bool:
    return (
        record.method == "GET"
        and 200 <= record.status < 400
        and (
            record.path.startswith("/_next/static/")
            or "/_next/static/" in record.path
            or bool(re.search(r"\.(?:js|css|woff2?|ttf|otf)$", record.path, re.I))
        )
    )


def is_portfolio_page(record: Record) -> bool:
    path = record.path
    is_route = (
        path in ("/zh", "/zh/", "/en", "/en/")
        or path.startswith("/zh/")
        or path.startswith("/en/")
        or path in ("/try", "/projects", "/notes")
        or path.startswith("/try/")
        or path.startswith("/projects/")
        or path.startswith("/notes/")
    )
    return is_route and not STATIC_PATTERN.search(path) and "/_next/" not in path


def is_sheep_page(record: Record) -> bool:
    path = record.path
    return (
        (path == "/sheep" or path.startswith("/sheep/"))
        and not STATIC_PATTERN.search(path)
        and "/_next/" not in path
    )


def build_sessions(records: list[Record], page_test) -> list[Session]:
    grouped: dict[tuple[str, str], list[Record]] = defaultdict(list)
    for record in records:
        grouped[record.visitor_key].append(record)

    sessions: list[Session] = []
    for visitor_key, events in grouped.items():
        pages = [
            event
            for event in events
            if is_human_candidate(event) and page_test(event)
        ]
        if not pages:
            continue
        asset_times = sorted(
            event.timestamp.timestamp() for event in events if is_asset(event)
        )
        current: list[Record] = []
        page_groups: list[list[Record]] = []
        for page in pages:
            if not current or (page.timestamp - current[-1].timestamp).total_seconds() <= 1800:
                current.append(page)
            else:
                page_groups.append(current)
                current = [page]
        if current:
            page_groups.append(current)

        for page_group in page_groups:
            verified = False
            for page in page_group:
                page_time = page.timestamp.timestamp()
                index = bisect.bisect_left(asset_times, page_time - 30)
                if index < len(asset_times) and asset_times[index] <= page_time + 180:
                    verified = True
                    break
            sessions.append(
                Session(visitor_key=visitor_key, pages=page_group, verified=verified)
            )
    sessions.sort(key=lambda session: session.started_at)
    return sessions


def period_start(now: datetime, days: int) -> datetime:
    day = (now - timedelta(days=days - 1)).date()
    return datetime.combine(day, datetime.min.time(), tzinfo=now.tzinfo)


def summarize(
    sessions: list[Session],
    start: datetime,
    verified_only: bool = True,
    end: datetime | None = None,
) -> dict:
    selected = [
        session
        for session in sessions
        if session.started_at >= start
        and (end is None or session.started_at < end)
        and (session.verified or not verified_only)
    ]
    pages = [page for session in selected for page in session.pages]
    visitors = {session.visitor_key for session in selected}
    pageviews = len(pages)
    session_count = len(selected)
    single_page_sessions = sum(1 for session in selected if len(session.pages) == 1)
    return {
        "visitors": len(visitors),
        "unique_ips": len({visitor[0] for visitor in visitors}),
        "sessions": session_count,
        "pageviews": pageviews,
        "pages_per_session": round(pageviews / session_count, 2) if session_count else 0,
        "single_page_rate": round(single_page_sessions / session_count * 100, 1) if session_count else 0,
    }


def clean_path(path: str) -> str:
    if path.startswith("/sheep/result/record_"):
        return "/sheep/result/:record"
    return path


def page_label(path: str) -> str:
    cleaned = clean_path(path)
    label = PAGE_LABELS.get(cleaned)
    return f"{label} · {cleaned}" if label else cleaned


def external_source(referrer: str) -> str | None:
    host = referrer_host(referrer)
    if not host or host.endswith("heard-sheep.cloud") or host in {
        "localhost",
        "127.0.0.1",
        "62.234.90.78",
    }:
        return None
    if host in SPAM_REFERRERS:
        return None
    if host in UNVERIFIED_REFERRERS:
        return f"{host}（待核验）"
    return host


def comparison_text(current: int, previous: int, previous_label: str) -> str:
    if previous == 0:
        return f"{previous_label}为 0，暂无可比变化"
    delta = current - previous
    percent = delta / previous * 100
    arrow = "↑" if delta > 0 else "↓" if delta < 0 else "→"
    return f"较{previous_label} {arrow}{abs(delta)}（{percent:+.0f}%）"


def daily_series(sessions: list[Session], now: datetime, days: int = 15) -> list[dict]:
    start = period_start(now, days)
    buckets = {
        (start + timedelta(days=offset)).date(): {
            "visitors": set(),
            "sessions": 0,
            "pageviews": 0,
        }
        for offset in range(days)
    }
    for session in sessions:
        if not session.verified or session.started_at < start:
            continue
        day = session.started_at.date()
        if day not in buckets:
            continue
        bucket = buckets[day]
        bucket["visitors"].add(session.visitor_key)
        bucket["sessions"] += 1
        bucket["pageviews"] += len(session.pages)
    return [
        {
            "date": day.isoformat(),
            "label": f"{day.month}/{day.day}",
            "visitors": len(values["visitors"]),
            "sessions": values["sessions"],
            "pageviews": values["pageviews"],
        }
        for day, values in sorted(buckets.items())
    ]


def top_items(sessions: list[Session], start: datetime) -> tuple[list, list, list]:
    selected = [
        session for session in sessions if session.verified and session.started_at >= start
    ]
    paths = Counter(
        page_label(page.path) for session in selected for page in session.pages
    )
    sources = Counter()
    direct = 0
    for session in selected:
        source = external_source(session.pages[0].referrer)
        if source:
            sources[source] += 1
        else:
            direct += 1
    if direct:
        sources["直接访问 / 无来源"] = direct
    devices = Counter()
    for visitor_key in {session.visitor_key for session in selected}:
        user_agent = visitor_key[1]
        if re.search(r"ipad|tablet", user_agent, re.I):
            devices["平板"] += 1
        elif re.search(r"mobile|android|iphone", user_agent, re.I):
            devices["移动端"] += 1
        else:
            devices["桌面端"] += 1
    return paths.most_common(12), sources.most_common(8), devices.most_common()


def metric_card(label: str, value: str | int, hint: str, comparison: str = "") -> str:
    icons = (("今日有效访客", "↗"), ("今日页面浏览", "◇"), ("近 7 天访客", "◎"), ("近 7 天会话", "◫"), ("可用期浏览", "▥"))
    icon = next((symbol for prefix, symbol in icons if label.startswith(prefix)), "∿")
    comparison_class = "negative" if "↓" in comparison else "neutral" if "→" in comparison or "暂无" in comparison else "positive"
    comparison_html = (
        f'<p class="metric-comparison {comparison_class}">{html.escape(comparison)}</p>'
        if comparison else '<p class="metric-comparison neutral">当前统计周期</p>'
    )
    return (
        '<article class="metric"><div class="metric-top">'
        f'<span class="metric-icon" aria-hidden="true">{icon}</span>'
        f'<p class="metric-label">{html.escape(label)}</p></div>'
        f'<p class="metric-value">{html.escape(str(value))}</p>'
        f'<p class="metric-hint">{html.escape(hint)}</p>{comparison_html}</article>'
    )

def compact_kpi(label: str, value: str | int, hint: str, comparison: str = "") -> str:
    comparison_class = (
        "negative" if "↓" in comparison
        else "neutral" if "→" in comparison or "暂无" in comparison
        else "positive"
    )
    comparison_html = (
        f'<span class="trend-kpi-change {comparison_class}">{html.escape(comparison)}</span>'
        if comparison else ""
    )
    return (
        '<article class="trend-kpi">'
        f'<span class="trend-kpi-label">{html.escape(label)}</span>'
        f'<strong>{html.escape(str(value))}</strong>'
        f'<span class="trend-kpi-hint">{html.escape(hint)}</span>'
        f'{comparison_html}</article>'
    )


def bar_rows(items: list[tuple[str, int]], empty_text: str) -> str:
    if not items:
        return f'<p class="empty">{html.escape(empty_text)}</p>'
    maximum = max(value for _, value in items) or 1
    total = sum(value for _, value in items) or 1
    rows = []
    for label, value in items:
        width = max(2, round(value / maximum * 100))
        share = value / total * 100
        rows.append(
            '<div class="bar-row">'
            f'<div class="bar-label" title="{html.escape(label)}">{html.escape(label)}</div>'
            '<div class="bar-track">'
            f'<div class="bar-fill" style="width:{width}%"></div>'
            "</div>"
            f'<div class="bar-value"><strong>{value:,}</strong><span>{share:.1f}%</span></div>'
            "</div>"
        )
    return "".join(rows)


def trend_chart(
    series: list[dict],
    key: str,
    title: str,
    color: str,
    total_value: int | None = None,
    total_label: str = "15 日总计",
) -> str:
    maximum = max((item[key] for item in series), default=0)
    axis_max = max(5, ((maximum + 4) // 5) * 5)
    ticks = [axis_max, round(axis_max * .75), round(axis_max * .5), round(axis_max * .25), 0]
    total = sum(item[key] for item in series) if total_value is None else total_value
    bars = []
    for item in series:
        value = item[key]
        height = round(value / axis_max * 100) if axis_max else 0
        bars.append(
            '<div class="trend-day"><div class="trend-column">'
            f'<span class="trend-value">{value}</span>'
            f'<div class="trend-bar {color}" style="height:{height}%" title="{html.escape(item["date"])}：{value}"></div>'
            f'</div><span class="trend-label">{html.escape(item["label"])}</span></div>'
        )
    axis = "".join(f"<span>{tick}</span>" for tick in ticks)
    return (
        '<article class="trend-card"><div class="trend-heading"><div>'
        '<p class="section-kicker">Traffic trend</p>'
        f'<h3>{html.escape(title)}</h3></div>'
        f'<div class="trend-total"><strong>{total:,}</strong><span>{html.escape(total_label)}</span></div></div>'
        f'<div class="trend-layout"><div class="trend-axis">{axis}</div>'
        f'<div class="trend-scroll"><div class="trend-plot"><div class="trend-bars">{"".join(bars)}</div>'
        '</div></div></div></article>'
    )

def daily_table(series: list[dict]) -> str:
    rows = []
    for item in reversed(series):
        depth = item["pageviews"] / item["sessions"] if item["sessions"] else 0
        rows.append(
            "<tr>"
            f'<td>{html.escape(item["date"])}</td>'
            f'<td>{item["visitors"]}</td>'
            f'<td>{item["sessions"]}</td>'
            f'<td>{item["pageviews"]}</td>'
            f'<td>{depth:.2f}</td>'
            "</tr>"
        )
    return "".join(rows)


def mask_ip(ip: str) -> str:
    if ":" in ip:
        parts = [part for part in ip.split(":") if part]
        return ":".join(parts[:2]) + ":…" if parts else "IPv6：…"
    parts = ip.split(".")
    if len(parts) == 4:
        return f"{parts[0]}.{parts[1]}.*.*"
    return "已脱敏"


def client_label(user_agent: str) -> str:
    browser = "其他浏览器"
    for pattern, name in (
        (r"Edg/([0-9.]+)", "Edge"),
        (r"Chrome/([0-9.]+)", "Chrome"),
        (r"Firefox/([0-9.]+)", "Firefox"),
        (r"Version/([0-9.]+).*Safari", "Safari"),
    ):
        match = re.search(pattern, user_agent)
        if match:
            browser = f"{name} {match.group(1).split('.')[0]}"
            break
    if re.search(r"iphone|ipad|ios", user_agent, re.I):
        system = "iOS"
    elif re.search(r"android", user_agent, re.I):
        system = "Android"
    elif re.search(r"windows", user_agent, re.I):
        system = "Windows"
    elif re.search(r"macintosh|mac os", user_agent, re.I):
        system = "macOS"
    elif re.search(r"linux", user_agent, re.I):
        system = "Linux"
    else:
        system = "未知系统"
    return f"{browser} · {system}"


def format_duration(seconds: int) -> str:
    if seconds < 60:
        return f"{seconds} 秒"
    minutes, remaining = divmod(seconds, 60)
    return f"{minutes} 分 {remaining} 秒"


def geography_donut(
    sessions: list[Session], start: datetime, resolver: GeoResolver
) -> tuple[str, list[dict]]:
    counts = Counter(
        resolver.lookup(session.visitor_key[0])[1]
        for session in sessions
        if session.verified and session.started_at >= start
    )
    total = sum(counts.values())
    if not total:
        return '<p class="empty">最近 14 天暂无可用于地区分析的有效会话。</p>', []

    visible = counts.most_common(5)
    other = total - sum(value for _, value in visible)
    if other:
        visible.append(("其他", other))
    colors = ("#0a24e9", "#6574f7", "#3c8f60", "#d68b33", "#9a5fc5", "#cbd1dc")
    stops = []
    legend = []
    payload = []
    cursor = 0.0
    for index, (label, value) in enumerate(visible):
        share = value / total * 100
        end = cursor + share
        color = colors[index]
        stops.append(f"{color} {cursor:.2f}% {end:.2f}%")
        legend.append(
            '<div class="geo-legend-row">'
            f'<span class="geo-dot" style="background:{color}"></span>'
            f'<span class="geo-name" title="{html.escape(label)}">{html.escape(label)}</span>'
            f'<strong>{value:,}</strong><span>{share:.1f}%</span></div>'
        )
        payload.append({"region": label, "sessions": value, "share": round(share, 1)})
        cursor = end
    chart_label = "，".join(f"{label} {value} 次" for label, value in visible)
    chart = (
        '<div class="geo-layout">'
        f'<div class="donut" role="img" aria-label="近 14 天 IP 地区分布：{html.escape(chart_label)}" '
        f'style="background:conic-gradient({",".join(stops)})">'
        f'<div class="donut-hole"><strong>{total:,}</strong><span>有效会话</span></div></div>'
        f'<div class="geo-legend">{"".join(legend)}</div></div>'
    )
    return chart, payload


def visit_details(
    sessions: list[Session],
    start: datetime,
    resolver: GeoResolver,
    limit: int | None = None,
    preview_limit: int = 10,
) -> tuple[str, str, int, int]:
    eligible = [
        session
        for session in sessions
        if session.verified and session.started_at >= start
    ]
    zero_duration_count = sum(
        session.pages[-1].timestamp <= session.pages[0].timestamp
        for session in eligible
    )
    selected = [
        session
        for session in eligible
        if session.pages[-1].timestamp > session.pages[0].timestamp
    ]
    selected.sort(key=lambda session: session.started_at, reverse=True)
    if limit is not None:
        selected = selected[:limit]
    cards = []
    for session in selected:
        first = session.pages[0]
        last = session.pages[-1]
        source = external_source(first.referrer) or "直接访问 / 无来源"
        location_detail, _location_bucket = resolver.lookup(session.visitor_key[0])
        suspicious = len(session.pages) > 20 or "待核验" in source
        badge = "需复核" if suspicious else "有效会话"
        badge_class = "review" if suspicious else "verified"
        duration = int((last.timestamp - first.timestamp).total_seconds())
        shown_pages = session.pages[:25]
        page_rows = "".join(
            "<tr>"
            f'<td>{page.timestamp.strftime("%H:%M:%S")}</td>'
            f'<td title="{html.escape(page.path)}">{html.escape(page_label(page.path))}</td>'
            f'<td>{page.status}</td>'
            "</tr>"
            for page in shown_pages
        )
        omitted = (
            f'<p class="visit-omitted">另有 {len(session.pages) - len(shown_pages)} 条页面记录未展开显示。</p>'
            if len(session.pages) > len(shown_pages)
            else ""
        )
        cards.append(
            '<details class="visit-item">'
            '<summary class="visit-summary">'
            f'<time>{first.timestamp.strftime("%Y-%m-%d %H:%M:%S")}</time>'
            f'<span class="visit-entry" title="{html.escape(first.path)}">{html.escape(page_label(first.path))}</span>'
            f'<span class="visit-location" title="{html.escape(location_detail)}">{html.escape(location_detail)}</span>'
            f'<code class="masked-ip">{html.escape(mask_ip(session.visitor_key[0]))}</code>'
            f'<span class="visit-badge {badge_class}">{badge}</span>'
            "</summary>"
            '<div class="visit-body">'
            '<dl class="visit-meta">'
            f'<div><dt>完整 IP</dt><dd><code>{html.escape(session.visitor_key[0])}</code></dd></div>'
            f'<div><dt>IP 近似归属地</dt><dd>{html.escape(location_detail)}</dd></div>'
            f'<div><dt>浏览器与系统</dt><dd>{html.escape(client_label(session.visitor_key[1]))}</dd></div>'
            f'<div><dt>访问来源</dt><dd>{html.escape(source)}</dd></div>'
            f'<div><dt>会话时长</dt><dd>{html.escape(format_duration(duration))}</dd></div>'
            f'<div><dt>页面数量</dt><dd>{len(session.pages)} 次浏览 / {len({page.path for page in session.pages})} 个页面</dd></div>'
            "</dl>"
            '<div class="table-wrap"><table class="visit-pages">'
            '<thead><tr><th>具体时间</th><th>访问页面</th><th>状态码</th></tr></thead>'
            f'<tbody>{page_rows}</tbody></table></div>{omitted}'
            "</div></details>"
        )
    if not cards:
        return (
            '<p class="empty">最近 14 天暂无时长大于 0 秒的有效访问明细。</p>',
            "",
            0,
            zero_duration_count,
        )
    return (
        "".join(cards[:preview_limit]),
        "".join(cards[preview_limit:]),
        len(selected),
        zero_duration_count,
    )


def build_html(
    now: datetime,
    coverage_start: datetime | None,
    portfolio_sessions: list[Session],
    sheep_sessions: list[Session],
    geo_resolver: GeoResolver,
) -> str:
    today_start = period_start(now, 1)
    yesterday_start = period_start(now, 2)
    current_7_start = period_start(now, 7)
    previous_7_start = period_start(now, 14)
    trend_15_start = period_start(now, 15)
    previous_15_start = period_start(now, 30)
    previous_7_end = current_7_start
    available_start = max(period_start(now, 30), coverage_start) if coverage_start else period_start(now, 30)
    coverage_days = (now.date() - available_start.date()).days + 1

    today = summarize(portfolio_sessions, today_start)
    yesterday = summarize(portfolio_sessions, yesterday_start, end=today_start)
    current_7 = summarize(portfolio_sessions, current_7_start)
    previous_7 = summarize(portfolio_sessions, previous_7_start, end=previous_7_end)
    trend_15 = summarize(portfolio_sessions, trend_15_start)
    previous_15 = summarize(portfolio_sessions, previous_15_start, end=trend_15_start)
    available = summarize(portfolio_sessions, available_start)
    upper_bound = summarize(portfolio_sessions, available_start, verified_only=False)
    sheep_summary = summarize(sheep_sessions, available_start, verified_only=False)
    paths, sources, devices = top_items(portfolio_sessions, available_start)
    detail_start = period_start(now, 14)
    (
        recent_visits_html,
        older_visits_html,
        recent_visits_count,
        zero_duration_visits_count,
    ) = visit_details(portfolio_sessions, detail_start, geo_resolver)
    geography_html, geography_payload = geography_donut(
        portfolio_sessions, detail_start, geo_resolver
    )
    series = daily_series(portfolio_sessions, now)
    coverage = coverage_start.strftime("%Y-%m-%d %H:%M") if coverage_start else "暂无日志"
    older_visits_count = max(0, recent_visits_count - 10)
    older_visits_block = (
        '<details class="visit-more">'
        f'<summary>展开近 14 天其余 {older_visits_count} 条访问记录</summary>'
        f'<div class="visit-list older">{older_visits_html}</div>'
        '</details>'
        if older_visits_html
        else ""
    )

    cards = "".join(
        [
            metric_card(
                "今日有效访客",
                today["visitors"],
                "近似独立设备",
                comparison_text(today["visitors"], yesterday["visitors"], "昨日"),
            ),
            metric_card(
                "今日页面浏览",
                today["pageviews"],
                "有效会话内浏览",
                comparison_text(today["pageviews"], yesterday["pageviews"], "昨日"),
            ),
            metric_card(
                "近 7 天访客",
                current_7["visitors"],
                "去重后的有效访客",
                comparison_text(current_7["visitors"], previous_7["visitors"], "前 7 天"),
            ),
            metric_card("近 7 天会话", current_7["sessions"], "30 分钟无活动后重算"),
            metric_card(f"可用期浏览（{coverage_days} 天）", available["pageviews"], "当前日志覆盖期"),
            metric_card("平均浏览深度", f'{available["pages_per_session"]:.2f}', "页 / 会话"),
        ]
    )

    trend_cards = "".join(
        [
            compact_kpi(
                "近 15 天去重访客",
                trend_15["visitors"],
                "整个周期按访客标识去重",
                comparison_text(trend_15["visitors"], previous_15["visitors"], "前 15 天"),
            ),
            compact_kpi(
                "近 15 天访问会话",
                trend_15["sessions"],
                "30 分钟无活动后重算",
                comparison_text(trend_15["sessions"], previous_15["sessions"], "前 15 天"),
            ),
            compact_kpi(
                "近 15 天页面浏览",
                trend_15["pageviews"],
                "有效会话内页面请求",
                comparison_text(trend_15["pageviews"], previous_15["pageviews"], "前 15 天"),
            ),
            compact_kpi(
                "平均浏览深度",
                f'{trend_15["pages_per_session"]:.2f}',
                "页 / 会话 · 近 15 天",
            ),
        ]
    )

    payload = {
        "generated_at": now.isoformat(),
        "coverage_start": coverage_start.isoformat() if coverage_start else None,
        "today": today,
        "yesterday": yesterday,
        "current_7_days": current_7,
        "previous_7_days": previous_7,
        "trend_15_days": trend_15,
        "previous_15_days": previous_15,
        "available_period": available,
        "portfolio_upper_bound": upper_bound,
        "sheep_available_period": sheep_summary,
        "daily": series,
        "top_paths": paths,
        "sources": sources,
        "devices": devices,
        "geography_14_days": geography_payload,
        "geography_database_available": geo_resolver.available,
    }

    styles = """
    :root{color-scheme:light;--ink:#0b0d17;--muted:#697386;--muted2:#8d96a8;--line:#e4e7ec;--soft:#edf0f4;--canvas:#f0f2f5;--blue:#0a24e9;--blue2:#152eae;--blueSoft:#edf1ff;--green:#3c8f60;--greenSoft:#e9f6ee;--orangeSoft:#fff2e8;--shadow:0 10px 30px rgba(23,31,56,.055)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--canvas);color:var(--ink);font-family:Inter,"Segoe UI","Microsoft YaHei",system-ui,sans-serif;font-variant-numeric:tabular-nums}a{color:inherit}
    .app-shell{min-height:100vh;display:grid;grid-template-columns:232px minmax(0,1fr)}
    .sidebar{position:sticky;top:0;height:100vh;padding:26px 20px 22px;overflow:auto;display:flex;flex-direction:column;color:#d9deec;background:radial-gradient(circle at 30% 4%,rgba(41,69,211,.28),transparent 29%),linear-gradient(180deg,#101322,#0b0d17 48%,#090b13);border-right:1px solid rgba(255,255,255,.05)}
    .brand{display:flex;align-items:center;gap:12px;padding:0 8px 26px;text-decoration:none}.brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;color:#fff;background:linear-gradient(145deg,#2742f4,#071ab4);box-shadow:0 9px 20px rgba(10,36,233,.34);font-size:12px;font-weight:900}.brand-copy strong,.brand-copy span{display:block}.brand-copy strong{color:#fff;font-size:14px}.brand-copy span{margin-top:3px;color:#7f89a4;font-size:10px;letter-spacing:.11em;text-transform:uppercase}
    .nav-label{margin:12px 11px 9px;color:#59627a;font-size:10px;font-weight:800;letter-spacing:.15em;text-transform:uppercase}.side-nav{display:grid;gap:5px}.side-nav a{position:relative;display:flex;align-items:center;gap:11px;min-height:42px;padding:0 12px;border-radius:10px;color:#8f98af;text-decoration:none;font-size:13px;font-weight:650;transition:.18s}.side-nav a::before{content:"";width:7px;height:7px;border:1.5px solid currentColor;border-radius:2px;transform:rotate(45deg)}.side-nav a:first-child,.side-nav a:hover{color:#fff;background:rgba(255,255,255,.075)}.side-nav a:first-child::after{content:"";position:absolute;left:-20px;width:3px;height:24px;border-radius:0 4px 4px 0;background:#4860ff}
    .sidebar-bottom{margin-top:auto}.sidebar-card{margin-top:24px;padding:16px;border:1px solid rgba(255,255,255,.075);border-radius:14px;background:rgba(255,255,255,.045)}.live-line{display:flex;align-items:center;gap:8px;color:#dce3f5;font-size:12px;font-weight:750}.live-dot{width:7px;height:7px;border-radius:50%;background:#66ce8f;box-shadow:0 0 0 4px rgba(102,206,143,.12)}.sidebar-card p{margin:10px 0 0;color:#707a94;font-size:11px;line-height:1.55}.side-foot{margin:14px 3px 0;color:#4f586f;font-size:10px;line-height:1.55}
    main{min-width:0;width:min(1370px,100%);margin:0 auto;padding:28px 34px 54px}.topbar{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:22px}.breadcrumb{margin:0 0 8px;color:var(--muted2);font-size:11px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}h1{margin:0;font-size:clamp(28px,3vw,40px);letter-spacing:-.045em;line-height:1.08}.subtitle{max-width:680px;margin:9px 0 0;color:var(--muted);font-size:13px;line-height:1.6}
    .header-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding-top:3px}.status-chip{min-height:36px;display:flex;align-items:center;gap:8px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:#fff;color:#4d586d;box-shadow:0 3px 10px rgba(22,30,52,.025);font-size:11px;font-weight:700;white-space:nowrap}.status-chip.live{color:#2b7650;border-color:#dbece2;background:#f9fffb}.status-chip .live-dot{width:6px;height:6px;box-shadow:0 0 0 3px rgba(102,206,143,.11)}
    .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:12px}.metric,.panel,.trend-card{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow)}.metric{position:relative;min-height:148px;padding:17px 18px 16px;overflow:hidden}.metric::after{content:"";position:absolute;right:-24px;top:-34px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(10,36,233,.055),transparent 68%)}.metric-top{display:flex;align-items:center;gap:9px}.metric-icon{width:28px;height:28px;display:grid;place-items:center;flex:0 0 auto;border-radius:8px;color:var(--blue);background:var(--blueSoft);font-size:13px;font-weight:900}.metric-label,.metric-hint,.metric-comparison{margin:0}.metric-label{color:#4e586d;font-size:12px;font-weight:750}.metric-value{margin:13px 0 3px;font-size:32px;font-weight:850;letter-spacing:-.045em;line-height:1}.metric-hint{color:var(--muted2);font-size:10px}.metric-comparison{margin-top:12px;font-size:10px;font-weight:750}.metric-comparison.positive{color:var(--green)}.metric-comparison.negative{color:#c05a52}.metric-comparison.neutral{color:var(--muted2)}
    .panel{padding:20px;min-width:0}.panel-title{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:17px}.panel-title h2,.trend-heading h3{margin:0;font-size:16px;letter-spacing:-.02em}.panel-title span{color:var(--muted2);font-size:10px;text-align:right}.section-kicker{margin:0 0 5px;color:var(--blue);font-size:9px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}
    .trend-section{margin-top:12px;scroll-margin-top:16px}.trend-section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin:0 2px 12px}.trend-section-head h2{margin:0;font-size:18px;letter-spacing:-.025em}.trend-section-head span{color:var(--muted2);font-size:10px}.trend-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.trend-kpi{display:flex;flex-direction:column;min-height:112px;padding:15px 16px;border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:var(--shadow)}.trend-kpi-label{color:#4f5a70;font-size:10px;font-weight:750}.trend-kpi strong{margin-top:9px;font-size:25px;letter-spacing:-.04em}.trend-kpi-hint{margin-top:3px;color:var(--muted2);font-size:9px}.trend-kpi-change{margin-top:auto;padding-top:8px;font-size:9px;font-weight:750}.trend-kpi-change.positive{color:var(--green)}.trend-kpi-change.negative{color:#c05a52}.trend-kpi-change.neutral{color:var(--muted2)}.trend-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}.trend-card{padding:20px 18px 15px;min-width:0;overflow:hidden}.trend-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:20px}.trend-total{text-align:right}.trend-total strong,.trend-total span{display:block}.trend-total strong{font-size:18px;letter-spacing:-.03em}.trend-total span{margin-top:2px;color:var(--muted2);font-size:9px}.trend-layout{display:grid;grid-template-columns:30px minmax(0,1fr);gap:9px}.trend-axis{height:254px;padding-bottom:28px;display:flex;flex-direction:column;justify-content:space-between;color:#9aa2b2;font-size:9px;text-align:right}.trend-scroll{overflow-x:auto;padding-bottom:3px;scrollbar-width:thin}.trend-plot{min-width:520px;height:254px;background:repeating-linear-gradient(to bottom,#e9ecf1 0,#e9ecf1 1px,transparent 1px,transparent 25%)}.trend-bars{height:100%;display:flex;align-items:stretch;gap:5px;padding:0 8px}.trend-day{flex:1;min-width:24px;height:100%;display:flex;flex-direction:column;align-items:center}.trend-column{height:226px;width:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}.trend-value{margin-bottom:5px;color:#505a70;font-size:9px;font-weight:800}.trend-bar{width:min(22px,74%);min-height:3px;border-radius:5px 5px 2px 2px}.trend-bar.blue{background:linear-gradient(180deg,#536aff,var(--blue));box-shadow:0 5px 12px rgba(10,36,233,.12)}.trend-bar.indigo{background:linear-gradient(180deg,#9aa5ff,#6574f7);box-shadow:0 5px 12px rgba(101,116,247,.12)}.trend-label{margin-top:8px;color:var(--muted2);font-size:9px;white-space:nowrap}
    .grid{display:grid;grid-template-columns:1.42fr .58fr;gap:12px;margin-top:12px;scroll-margin-top:16px}.grid-even{grid-template-columns:1fr 1fr}.bar-row{display:grid;grid-template-columns:minmax(130px,1.4fr) minmax(70px,2fr) 52px;gap:10px;align-items:center;margin:13px 0}.bar-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#3e485c;font-size:11px;font-weight:650}.bar-track{height:7px;border-radius:999px;background:#edf0f5;overflow:hidden}.bar-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--blue2),#5267ff)}.bar-value{display:flex;flex-direction:column;align-items:flex-end;color:var(--muted2);font-size:9px}.bar-value strong{color:var(--ink);font-size:11px}
    .table-wrap{overflow-x:auto;border:1px solid var(--soft);border-radius:11px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{padding:11px 13px;border-bottom:1px solid var(--soft);text-align:right;white-space:nowrap}th:first-child,td:first-child{text-align:left}th{color:#737d90;font-size:9px;font-weight:800;background:#f7f8fa}tbody tr:last-child td{border-bottom:0}tbody tr:hover{background:#f8f9fc}.daily-panel{margin-top:12px;scroll-margin-top:16px}
    .visit-panel{margin-top:12px;padding:0;overflow:hidden;scroll-margin-top:16px;border-left:3px solid var(--blue)}.visit-panel>.panel-summary{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;padding:20px}.panel-summary h2{margin:0;font-size:17px;letter-spacing:-.02em}.panel-summary span{margin-left:auto;color:var(--muted2);font-size:10px;font-weight:550;text-align:right}.visit-columns{display:grid;grid-template-columns:152px minmax(190px,1fr) 190px 104px 74px;gap:12px;padding:9px 29px 7px;color:var(--muted2);background:#f7f8fa;border-top:1px solid var(--line);font-size:9px;font-weight:800}.visit-columns span:last-child{text-align:right}.visit-list{padding:9px 16px 16px;background:#fafbfc}.visit-more{margin:0;border-top:1px solid var(--line);background:#fff}.visit-more>summary{list-style:none;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;color:var(--blue2);font-size:11px;font-weight:800}.visit-more>summary::before{content:"+";width:20px;height:20px;display:grid;place-items:center;border-radius:6px;background:var(--blueSoft);font-size:14px}.visit-more[open]>summary::before{content:"−"}.visit-more>.visit-list{border-top:1px solid var(--line)}.visit-summary::-webkit-details-marker,.visit-more>summary::-webkit-details-marker{display:none}.visit-item{margin:8px 0;border:1px solid #e2e6ed;border-radius:11px;background:#fff;overflow:hidden}.visit-summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:152px minmax(190px,1fr) 190px 104px 74px;gap:12px;align-items:center;padding:12px 13px;font-size:10px}.visit-summary:hover{background:#f6f8ff}.visit-entry,.visit-location{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.visit-entry{font-weight:750}.visit-location{color:#4f5b70}.masked-ip{color:#596378}.visit-badge{justify-self:end;padding:4px 7px;border-radius:999px;font-size:9px;font-weight:800}.visit-badge.verified{background:var(--greenSoft);color:var(--green)}.visit-badge.review{background:var(--orangeSoft);color:#a65d22}.visit-body{padding:14px;border-top:1px solid var(--soft);background:#fff}.visit-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:0 0 13px}.visit-meta div{padding:10px;border:1px solid var(--soft);border-radius:9px;background:#f8f9fb;min-width:0}.visit-meta dt{color:var(--muted2);font-size:9px;font-weight:750}.visit-meta dd{margin:5px 0 0;font-size:10px;overflow-wrap:anywhere}.visit-pages td:nth-child(2),.visit-pages th:nth-child(2){text-align:left}.visit-omitted{margin:10px 0 0;color:var(--muted);font-size:10px}
    .geo-panel{margin-top:12px;scroll-margin-top:16px}.geo-layout{display:grid;grid-template-columns:240px minmax(0,1fr);gap:34px;align-items:center;max-width:760px;margin:5px auto 8px}.donut{width:210px;aspect-ratio:1;border-radius:50%;display:grid;place-items:center}.donut-hole{width:126px;aspect-ratio:1;display:grid;place-content:center;text-align:center;border-radius:50%;background:#fff;box-shadow:0 0 0 1px var(--soft)}.donut-hole strong{font-size:30px;letter-spacing:-.04em}.donut-hole span{margin-top:5px;color:var(--muted2);font-size:10px}.geo-legend{display:grid;gap:7px}.geo-legend-row{display:grid;grid-template-columns:10px minmax(120px,1fr) 42px 48px;gap:9px;align-items:center;padding:7px 0;border-bottom:1px solid var(--soft);font-size:10px}.geo-dot{width:8px;height:8px;border-radius:50%}.geo-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#445066}.geo-legend-row strong{text-align:right}.geo-legend-row>span:last-child{text-align:right;color:var(--muted2)}.geo-note{margin:15px 0 0;color:var(--muted2);font-size:9px;line-height:1.6}.geo-note a{color:var(--blue2)}
    code{font-family:"Cascadia Mono",Consolas,monospace;font-size:.95em}.quality{margin-top:12px;background:#fff;border-left:3px solid var(--blue);scroll-margin-top:16px}.quality p{margin:9px 0;color:#626c7f;font-size:11px;line-height:1.7}.pill{display:inline-block;padding:5px 9px;border-radius:7px;background:var(--blueSoft);color:var(--blue2);font-size:9px;font-weight:850}.empty{color:var(--muted);font-size:11px}details{margin-top:12px}summary{cursor:pointer;color:var(--muted);font-size:11px}pre{overflow:auto;padding:14px;background:#0b0d17;color:#dce3f5;border-radius:10px;font-size:10px}.dashboard-foot{margin:18px 2px 0;display:flex;justify-content:space-between;gap:16px;color:#929aaa;font-size:9px}
    @media(max-width:1100px){.app-shell{grid-template-columns:200px minmax(0,1fr)}main{padding-left:24px;padding-right:24px}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.trend-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.grid{grid-template-columns:1fr}}
    @media(max-width:820px){.app-shell{display:block}.sidebar{position:sticky;z-index:5;height:auto;min-height:0;padding:12px 18px;flex-direction:row;align-items:center;gap:16px;overflow-x:auto;background:#0b0d17}.brand{flex:0 0 auto;padding:0}.brand-mark{width:34px;height:34px}.brand-copy span,.nav-label,.sidebar-bottom{display:none}.side-nav{display:flex;flex:0 0 auto;gap:4px}.side-nav a{min-height:34px;padding:0 10px;font-size:11px;white-space:nowrap}.side-nav a::before,.side-nav a:first-child::after{display:none}main{width:100%;padding-top:24px}.trend-grid,.grid-even{grid-template-columns:1fr}.visit-meta{grid-template-columns:1fr 1fr}}
    @media(max-width:620px){main{padding:20px 10px 38px}.topbar{display:block}.header-actions{justify-content:flex-start;margin-top:14px}.status-chip{min-height:32px;padding:0 9px}.metrics{grid-template-columns:1fr 1fr;gap:8px}.metric{min-height:142px;padding:14px}.metric-value{font-size:28px}.metric-label{font-size:10px}.panel,.trend-card{padding:15px}.panel-title{align-items:flex-start}.bar-row{grid-template-columns:minmax(105px,1.25fr) minmax(65px,1fr) 46px;gap:7px}.visit-panel>.panel-summary{padding:16px 14px;align-items:flex-start}.visit-panel>.panel-summary span{max-width:150px}.visit-columns{display:none}.visit-list{padding:7px}.visit-summary{grid-template-columns:1fr 88px;gap:8px}.visit-summary time,.visit-entry,.visit-location{grid-column:1}.visit-summary time{grid-row:1}.visit-entry{grid-row:2}.visit-location{grid-row:3}.visit-summary .masked-ip,.visit-badge{grid-column:2}.visit-summary .masked-ip{grid-row:1}.visit-badge{grid-row:2}.visit-meta{grid-template-columns:1fr}.geo-layout{grid-template-columns:1fr;gap:18px}.donut{width:190px;margin:auto}.geo-legend-row{grid-template-columns:10px minmax(100px,1fr) 36px 42px}.dashboard-foot{display:block;line-height:1.7}}
    """

    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="300">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>Heard Sheep · 访问统计</title>
  <style>{styles}</style>
</head>
<body>
<div class="app-shell">
  <aside class="sidebar" aria-label="统计页导航">
    <a class="brand" href="#overview">
      <span class="brand-mark">HS</span>
      <span class="brand-copy"><strong>Heard Sheep</strong><span>Analytics</span></span>
    </a>
    <p class="nav-label">工作台</p>
    <nav class="side-nav">
      <a href="#overview">数据总览</a><a href="#trend">流量趋势</a>
      <a href="#content">页面表现</a><a href="#details">时间 / IP / 网页</a>
      <a href="#geography">地区分布</a><a href="#sources">来源与应用</a><a href="#quality">统计口径</a>
    </nav>
    <div class="sidebar-bottom">
      <div class="sidebar-card">
        <div class="live-line"><span class="live-dot"></span>数据服务正常</div>
        <p>服务器每 5 分钟重新汇总访问日志，本页届时自动刷新。</p>
      </div>
      <p class="side-foot">Private dashboard<br>仅限密码验证后访问</p>
    </div>
  </aside>
  <main>
    <header class="topbar" id="overview">
      <div>
        <p class="breadcrumb">Dashboard / Traffic overview</p>
        <h1>访问分析</h1>
        <p class="subtitle">Heard Sheep 作品集主站与 /sheep 独立应用的服务器端访问数据。</p>
      </div>
      <div class="header-actions">
        <span class="status-chip live"><span class="live-dot"></span>实时日志正常</span>
        <span class="status-chip">更新 {now.strftime('%m-%d %H:%M:%S')}</span>
        <span class="status-chip">覆盖起点 {coverage}</span>
      </div>
    </header>
    <section class="metrics" aria-label="核心指标">{cards}</section>
    <section class="panel visit-panel" id="details">
      <div class="panel-summary">
        <div><p class="section-kicker">Recent sessions</p><h2>访问详情：时间、IP 与网页</h2></div>
        <span>近 14 天展示 {recent_visits_count} 次非 0 秒会话 · 已隐藏 {zero_duration_visits_count} 次 0 秒会话</span>
      </div>
      <div class="visit-columns"><span>具体时间</span><span>入口网页</span><span>IP 近似归属地</span><span>脱敏 IP</span><span>状态</span></div>
      <div class="visit-list">{recent_visits_html}</div>
      {older_visits_block}
    </section>
    <section class="panel geo-panel" id="geography">
      <div class="panel-title">
        <div><p class="section-kicker">Geographic distribution</p><h2>近 14 天 IP 地区分布</h2></div>
        <span>按有效会话统计 · 前 5 个地区 + 其他</span>
      </div>
      {geography_html}
      <p class="geo-note">IP 归属地来自本地城市库，只表示网络出口的大致位置，不等同于 GPS 实时位置。<a href="https://db-ip.com" rel="noreferrer">IP Geolocation by DB-IP</a></p>
    </section>
    <section class="trend-section" id="trend">
      <div class="trend-section-head">
        <div><p class="section-kicker">Traffic overview</p><h2>近 15 天流量趋势</h2></div>
        <span>汇总卡片与下方每日柱状图使用同一时间窗口</span>
      </div>
      <div class="trend-kpis">{trend_cards}</div>
      <div class="trend-grid">
        {trend_chart(series, 'visitors', '每日有效访客', 'blue', trend_15['visitors'], '15 日去重访客')}
        {trend_chart(series, 'pageviews', '每日页面浏览', 'indigo', trend_15['pageviews'], '15 日页面浏览')}
      </div>
    </section>
    <div class="grid" id="content">
      <section class="panel">
        <div class="panel-title"><div><p class="section-kicker">Content performance</p><h2>可用期热门页面</h2></div><span>名称、路径、浏览量与占比</span></div>
        {bar_rows(paths, '暂无有效页面访问')}
      </section>
      <section class="panel">
        <div class="panel-title"><div><p class="section-kicker">Audience</p><h2>访问设备</h2></div><span>按有效访客标识</span></div>
        {bar_rows(devices, '暂无设备数据')}
      </section>
    </div>
    <section class="panel daily-panel">
      <div class="panel-title"><div><p class="section-kicker">Daily breakdown</p><h2>最近 15 天每日明细</h2></div><span>访客、会话、浏览与深度</span></div>
      <div class="table-wrap"><table>
        <thead><tr><th>日期</th><th>有效访客</th><th>会话</th><th>页面浏览</th><th>页 / 会话</th></tr></thead>
        <tbody>{daily_table(series)}</tbody>
      </table></div>
    </section>
    <div class="grid grid-even" id="sources">
      <section class="panel">
        <div class="panel-title"><div><p class="section-kicker">Acquisition</p><h2>访问来源</h2></div><span>已过滤已知垃圾引荐</span></div>
        {bar_rows(sources, '目前均为直接访问或无可靠来源信息')}
      </section>
      <section class="panel">
        <div class="panel-title"><div><p class="section-kicker">Sub application</p><h2>/sheep 独立应用</h2></div><span>宽松口径</span></div>
        {bar_rows([('访客标识', sheep_summary['visitors']),('访问会话', sheep_summary['sessions']),('页面浏览', sheep_summary['pageviews'])], '暂无 /sheep 访问')}
      </section>
    </div>
    <section class="panel quality" id="quality">
      <span class="pill">统计口径与数据质量</span>
      <p>主指标要求同一 IP 与浏览器标识在页面请求附近实际加载脚本或样式，用于减少机器人和伪装抓取。缓存命中的回访可能未被计入，因此这是可信下限，不是精确人数。</p>
      <p>已过滤 <strong>aisearchindex.space</strong> 等已知引荐垃圾来源；<strong>citizen.org</strong> 暂标为“待核验”，不视为已确认获客来源。</p>
      <p>当前可用期宽松口径上限：{upper_bound['visitors']:,} 个访客标识、{upper_bound['sessions']:,} 次会话、{upper_bound['pageviews']:,} 次页面请求。访问详情仅统计最近 14 天；完整 IP 只存在于密码保护页面的逐条折叠内容中。</p>
      <p>IP 地区使用服务器本地 DB-IP City Lite 2026-07 数据库推断，可能受运营商出口、代理、VPN 和数据库覆盖率影响。</p>
      <p>访问详情列表隐藏会话时长为 0 秒的记录，但原始日志、顶部汇总指标和地区分布仍保留这些可能的单页真实访问。</p>
      <details><summary>展开机器可读摘要</summary><pre>{html.escape(json.dumps(payload, ensure_ascii=False, indent=2))}</pre></details>
    </section>
    <footer class="dashboard-foot"><span>Heard Sheep · Private Analytics</span><span>服务器端日志统计 · 页面每 5 分钟自动刷新</span></footer>
  </main>
</div>
</body>
</html>
    """


def main() -> None:
    args = parse_args()
    portfolio_records = parse_logs(iter_log_paths(args.portfolio_dir, "portfolio"))
    sheep_records = parse_logs(iter_log_paths(args.portfolio_dir, "sheep"))
    portfolio_sessions = build_sessions(portfolio_records, is_portfolio_page)
    sheep_sessions = build_sessions(sheep_records, is_sheep_page)
    timestamps = [
        record.timestamp for record in portfolio_records + sheep_records
    ]
    now = datetime.now().astimezone()
    geo_resolver = GeoResolver(args.geoip_db)
    try:
        output = build_html(
            now=now,
            coverage_start=min(timestamps) if timestamps else None,
            portfolio_sessions=portfolio_sessions,
            sheep_sessions=sheep_sessions,
            geo_resolver=geo_resolver,
        )
    finally:
        geo_resolver.close()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(".html.tmp")
    temporary.write_text(output, encoding="utf-8")
    temporary.replace(args.output)


if __name__ == "__main__":
    main()
