import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const base = process.env.PORTFOLIO_BASE ?? "http://127.0.0.1:3000";
const output = join(process.cwd(), "public", "screenshots", "acceptance");
await mkdir(output, { recursive: true });

const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ headless: true, executablePath });
const errors = [];
const routeResults = [];
const perfResults = [];
const phraseResults = [];
const p = (...parts) => parts.join("");
const banned = [
  p("AI 产品", "实践者"),
  p("AI Product", " Builder"),
  p("AI 产品", "设计"),
  p("产品", "流程"),
  p("产品", "原型"),
  p("前端", "原型"),
  p("可交互", "原型"),
  p("独立", "部署上线"),
  p("AI 产品", "岗位"),
  p("AI ", "实习"),
  p("大模型", "应用岗位"),
  p("Open to AI", " Product Intern"),
  p("LLM Application", " Product Intern"),
  p("AI Product", " Operations Intern"),
  p("product", " prototype"),
  p("testable", " prototype"),
  p("clear flows and", " testable ", "prototypes"),
  p("product", " experiences"),
  p("product", " flow"),
  p("frontend", " prototype"),
  p("case study", " shelf"),
  p("AI Product", " Portfolio"),
  p("Work With", " Me"),
  p("产品", "判断"),
  p("完整", "产品", "流程"),
  p("Product", " Thinking"),
  p("AI ", "Capability"),
  p("Core ", "Interaction"),
  p("My ", "Role"),
  p("User Pain", " Point"),
  p("Market", " Problem"),
  p("Case Study", " Shelf"),
  p("Prototype", " Window"),
  p("Workspace", " Cards"),
  p("Product", " Console"),
  p("PROTOTYPE", " SIGNAL"),
  p("STAND", "BY"),
  p("Heard Sheep", " Demo"),
  p("Heard Sheep", " Workflow"),
  p("human", " signals"),
  p("product", " signal"),
  p("AI product", " ideas"),
  p("JPL", " / 2026"),
  p("Waiting for", " launch"),
  p("做出", "能点"),
  p("能点的", "原型"),
  p("真实", "页面"),
  p("Build a", " clickable"),
];

function attachObservers(page, label) {
  page.on("pageerror", (error) => errors.push(`${label}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("webpack-hmr")) errors.push(`${label}: ${message.text()}`);
  });
  page.on("response", (response) => {
    const status = response.status();
    const url = response.url();
    if (status >= 500) errors.push(`${label}: HTTP ${status} ${url}`);
  });
}

async function gotoChecked(page, path, label) {
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  const status = response?.status() ?? 0;
  routeResults.push({ label, path, status, ok: status >= 200 && status < 400 });
  if (status < 200 || status >= 400) errors.push(`${label}: expected 2xx/3xx for ${path}, got ${status}`);
}

async function checkNoOverlay(page, label) {
  const overlay = await page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay").count();
  if (overlay) errors.push(`${label}: framework error overlay visible`);
  const hasContent = await page.evaluate(() => document.body.innerText.trim().length > 100);
  if (!hasContent) errors.push(`${label}: page appears blank`);
}

async function capturePerf(page, label) {
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = Object.fromEntries(performance.getEntriesByType("paint").map((entry) => [entry.name, Math.round(entry.startTime)]));
    return {
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      load: nav ? Math.round(nav.loadEventEnd) : null,
      transferSize: performance.getEntriesByType("resource").reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      paint,
    };
  });
  perfResults.push({ label, ...metrics });
}

async function checkMobileOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) errors.push(`${label}: horizontal overflow detected`);
}

async function setTheme(page, mode) {
  await page.evaluate((nextMode) => {
    localStorage.setItem("jamie-theme-mode", nextMode);
    const resolved = nextMode === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : nextMode;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = nextMode;
    document.documentElement.style.colorScheme = resolved;
  }, mode);
}


async function scanHtmlPaths(paths) {
  for (const path of paths) {
    const response = await fetch(`${base}${path}`, { redirect: "follow" });
    const html = await response.text();
    const found = banned.filter((phrase) => html.toLowerCase().includes(phrase.toLowerCase()));
    phraseResults.push({ label: `html ${path}`, found, finalUrl: response.url, status: response.status });
    if (found.length) errors.push(`html ${path}: banned phrases found: ${found.join(", ")}`);
    if (path === "/" && !response.url.endsWith("/zh")) errors.push(`root redirect: expected / to end at /zh, got ${response.url}`);
  }
}
async function checkBannedPhrases(page, label) {
  const text = await page.evaluate(() => document.body.innerText);
  const found = banned.filter((phrase) => text.toLowerCase().includes(phrase.toLowerCase()));
  phraseResults.push({ label, found });
  if (found.length) errors.push(`${label}: banned phrases found: ${found.join(", ")}`);
}

await scanHtmlPaths(["/", "/zh", "/en"]);

const desktop = await browser.newContext({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
const page = await desktop.newPage();
attachObservers(page, "desktop");

await gotoChecked(page, "/zh", "zh home light");
await setTheme(page, "light");
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("heading", { name: "Jamie Zhang" }).waitFor();
await page.getByText("用 vibe coding 把想法做成网页。").waitFor();
for (const label of ["我的作品", "研究方法", "关于我", "联系我"]) {
  await page.locator(".desktop-nav").getByText(label, { exact: true }).waitFor();
}
await page.getByRole("button", { name: "浏览这个空间" }).click();
await page.locator("#work").waitFor();
await checkNoOverlay(page, "zh home light");
await checkBannedPhrases(page, "zh home light");
await capturePerf(page, "zh home desktop light");
await page.screenshot({ path: join(output, "zh-home-light-desktop.png"), fullPage: true });
await page.locator(".site-header").screenshot({ path: join(output, "navigation-light.png") });
await page.locator("#work").scrollIntoViewIfNeeded();
await page.locator("#work").screenshot({ path: join(output, "selected-works-light.png") });
const cardLinks = await page.locator("#work .work-card").evaluateAll((cards) => cards.map((card) => card.getAttribute("href")));
if (cardLinks.length !== 3 || !cardLinks.every(Boolean)) errors.push(`work cards: expected 3 clickable cards, got ${JSON.stringify(cardLinks)}`);
await page.locator("#recent").scrollIntoViewIfNeeded();
await page.locator("#recent").screenshot({ path: join(output, "recent-revisions-light.png") });
await page.locator("#method").scrollIntoViewIfNeeded();
await page.locator("#method").screenshot({ path: join(output, "method-light.png") });
await page.locator("#method").getByText("拆清楚", { exact: true }).waitFor();
await page.locator("#method").getByText("搭页面", { exact: true }).waitFor();
await page.locator("#about").scrollIntoViewIfNeeded();
await page.locator("#about").screenshot({ path: join(output, "about-light-desktop.png") });
await page.getByText("逻辑学硕士在读").waitFor();

await page.getByRole("button", { name: "切换到夜间模式" }).click();
await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
await page.screenshot({ path: join(output, "appearance-toggle-dark.png"), fullPage: false });
await page.screenshot({ path: join(output, "zh-home-dark-desktop.png"), fullPage: true });

await gotoChecked(page, "/en", "en home light");
await setTheme(page, "light");
await page.reload({ waitUntil: "networkidle" });
await page.getByText("I use vibe coding to turn ideas into web pages.").waitFor();
await page.getByText("AI tool experiments and web pages.").waitFor();
await checkNoOverlay(page, "en home light");
await checkBannedPhrases(page, "en home light");
await capturePerf(page, "en home desktop light");
await page.screenshot({ path: join(output, "en-home-light-desktop.png"), fullPage: true });

await page.getByRole("button", { name: "Open command menu" }).click();
await page.getByRole("dialog", { name: "Quick navigation" }).waitFor();
await page.getByText("Switch to Chinese").waitFor();
await page.getByText("Switch to Dark").waitFor();
await page.keyboard.press("Escape");

await gotoChecked(page, "/zh/projects/heard-sheep", "zh heard sheep note");
await page.getByText("项目记录", { exact: true }).waitFor();
await page.getByText("复盘", { exact: true }).waitFor();
await checkBannedPhrases(page, "zh heard sheep note");
await page.getByRole("button", { name: "Switch to English" }).first().click();
await page.waitForURL(/\/en\/projects\/heard-sheep$/);
routeResults.push({ label: "language switch keep path", path: page.url().replace(base, ""), status: 200, ok: page.url().endsWith("/en/projects/heard-sheep") });
await page.getByText("Project Note", { exact: true }).waitFor();
await page.screenshot({ path: join(output, "project-heard-sheep.png"), fullPage: true });

for (const slug of ["proddoc-ai", "ai-decision-copilot"]) {
  await gotoChecked(page, `/en/projects/${slug}`, `en ${slug} note`);
  await page.getByText("Project Note", { exact: true }).waitFor();
  await page.getByText("Reflection", { exact: true }).waitFor();
  await checkBannedPhrases(page, `en ${slug} note`);
  await page.screenshot({ path: join(output, `project-${slug}.png`), fullPage: true });
}
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
const mobilePage = await mobile.newPage();
attachObservers(mobilePage, "mobile");
await gotoChecked(mobilePage, "/zh", "zh home mobile light");
await setTheme(mobilePage, "light");
await mobilePage.reload({ waitUntil: "networkidle" });
await mobilePage.getByText("用 vibe coding 把想法做成网页。").waitFor();
await checkMobileOverflow(mobilePage, "zh home mobile light");
await checkNoOverlay(mobilePage, "zh home mobile light");
await checkBannedPhrases(mobilePage, "zh home mobile light");
await capturePerf(mobilePage, "zh home mobile light");
await mobilePage.screenshot({ path: join(output, "zh-home-mobile-light.png"), fullPage: true });
await mobilePage.getByRole("button", { name: "打开菜单" }).click();
await mobilePage.getByRole("dialog", { name: "打开菜单" }).waitFor();
await mobilePage.locator(".mobile-menu-panel nav a").first().waitFor();
const firstMobileNav = await mobilePage.locator(".mobile-menu-panel nav a").first().innerText();
if (!firstMobileNav.includes("我的作品")) errors.push(`mobile nav: expected first item to include 我的作品, got ${firstMobileNav}`);
await mobilePage.screenshot({ path: join(output, "mobile-navigation-light.png"), fullPage: false });
await mobilePage.getByRole("button", { name: "切换到夜间模式" }).click();
await mobilePage.waitForFunction(() => document.documentElement.dataset.theme === "dark");
await mobilePage.screenshot({ path: join(output, "zh-home-mobile-dark.png"), fullPage: true });
await mobile.close();

const apiContext = await browser.newContext();
const apiPage = await apiContext.newPage();
attachObservers(apiPage, "routes");
const routePaths = ["/", "/zh", "/en", "/zh/projects/heard-sheep", "/en/projects/heard-sheep", "/zh/projects/proddoc-ai", "/en/projects/proddoc-ai", "/zh/projects/ai-decision-copilot", "/en/projects/ai-decision-copilot"];
if (!/127\.0\.0\.1|localhost/.test(base)) routePaths.push("/sheep");
for (const path of routePaths) {
  try {
    const response = await apiPage.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 20000 });
    const status = response?.status() ?? 0;
    routeResults.push({ label: "route", path, status, finalUrl: apiPage.url(), ok: status >= 200 && status < 400 });
    if (path === "/" && !apiPage.url().endsWith("/zh")) errors.push(`route: expected / to resolve to /zh, got ${apiPage.url()}`);
    if (status < 200 || status >= 400) errors.push(`route: expected 2xx/3xx for ${path}, got ${status}`);
  } catch (error) {
    errors.push(`route: failed to load ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
await apiContext.close();

await writeFile(join(output, "acceptance-report.json"), JSON.stringify({ base, generatedAt: new Date().toISOString(), routes: routeResults, performance: perfResults, bannedPhraseScan: phraseResults, errors }, null, 2));
await browser.close();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ status: "passed", base, output, routes: routeResults, performance: perfResults, bannedPhraseScan: phraseResults }, null, 2));