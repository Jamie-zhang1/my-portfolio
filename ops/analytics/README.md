# Private traffic dashboard

The production site exposes a password-protected, server-generated dashboard at
`https://heard-sheep.cloud/analytics/`.

## Data flow

- Nginx writes portfolio traffic to `/var/log/portfolio-analytics/portfolio.log`.
- Requests below `/sheep` go to `/var/log/portfolio-analytics/sheep.log`.
- `portfolio-analytics.timer` regenerates a static HTML dashboard every five
  minutes.
- Nginx Basic Authentication protects the dashboard. Session summaries show
  masked IPs; full IPs appear only after expanding an individual visit inside
  the protected page.
- Dedicated logs rotate daily and are retained for 90 rotations.

## Counting method

The primary portfolio numbers are a conservative estimate. A page session is
counted as verified when the same IP and user-agent pair also loads a JavaScript,
CSS, or font asset close to the page request. This removes many crawlers but can
miss returning visitors whose assets are fully cached. A wider upper-bound count
is shown separately on the dashboard.

## Dashboard details

- Six summary cards include today-versus-yesterday and current-versus-previous
  seven-day comparisons.
- Four compact KPI cards summarize the same 15-day window used by the separate
  daily visitor and pageview bar charts. The period visitor card is deduplicated
  across the full window rather than summing daily visitor counts.
- The daily charts use visible values and axis ticks, followed by a 15-day detail table.
- Page labels combine a readable product name with the underlying route.
- Known referral spam such as `aisearchindex.space` is excluded. Unconfirmed
  domains such as `citizen.org` are explicitly labelled as pending verification.
- The browser refreshes the protected dashboard every five minutes.
- The dashboard uses a dark navigation rail, pale workspace, compact KPI cards,
  and high-contrast blue trend charts, with a horizontal navigation treatment on
  smaller screens.
- Visit details cover the most recent 14 days with no fixed record cap. The first
  10 session summaries show exact timestamps, entry pages, approximate IP location,
  and masked IPs. Zero-second sessions are hidden from this detail list, while raw
  logs and aggregate metrics remain unchanged. Each row expands to show full IP,
  referrer, client, duration, and the page timeline; the remaining 14-day sessions
  stay under an expand-more control.
- IP locations are resolved locally with DB-IP City Lite 2026-07 through
  python3-geoip2; visitor IPs are not sent to a third-party lookup API.
- The geography donut uses verified 14-day sessions as its denominator, shows the
  top five location buckets, and combines the long tail into Other. Legend rows
  retain exact session counts and shares so the circular view is not the only encoding.
- GeoIP locations are approximate network-exit locations and may be affected by
  carriers, proxies, VPNs, and database coverage. The dashboard includes the
  attribution required by the DB-IP Lite CC BY 4.0 license.

## Server files

- Generator: `/usr/local/lib/portfolio-analytics/generate_dashboard.py`
- Output: `/var/www/portfolio-analytics/index.html`
- Authentication: `/etc/nginx/.htpasswd-portfolio-analytics`
- Service: `/etc/systemd/system/portfolio-analytics.service`
- Timer: `/etc/systemd/system/portfolio-analytics.timer`
- Log rotation: `/etc/logrotate.d/portfolio-analytics`
- GeoIP database: /usr/local/share/GeoIP/dbip-city-lite.mmdb

The active site configuration remains
`/etc/nginx/sites-available/heard-sheep-domain`. Always run `nginx -t` before
reloading Nginx.
