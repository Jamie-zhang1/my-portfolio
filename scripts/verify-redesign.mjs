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
const banned = ["Product Console", "PROTOTYPE SIGNAL", "STANDBY", "Heard Sheep Demo", "Heard Sheep Workflow", "human signals", "messy human signals", "product signal", "AI product ideas", "model capability", "AI product concepts", "AI 产品概念", "JPL / 2026", "Waiting for launch", "做出能点的原型", "能点的原型", "真实页面", "接受操作", "Build a clickable version", "Build a clickable prototype"];

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

async function checkBannedPhrases(page, label) {
  const text = await page.evaluate(() => document.body.innerText);
  const found = banned.filter((phrase) => text.toLowerCase().includes(phrase.toLowerCase()));
  phraseResults.push({ label, found });
  if (found.length) errors.push(`${label}: banned phrases found: ${found.join(", ")}`);
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
const page = await desktop.newPage();
attachObservers(page, "desktop");

await gotoChecked(page, "/zh", "zh home light");
await setTheme(page, "light");
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("heading", { name: "Jamie Zhang" }).waitFor();
await page.getByText("把复杂想法整理成清楚流程，再做成能体验、能验证的原型。").waitFor();
await page.getByRole("button", { name: "进入工作台" }).click();
await page.locator("#workspace").waitFor();
await checkNoOverlay(page, "zh home light");
await checkBannedPhrases(page, "zh home light");
await capturePerf(page, "zh home desktop light");
await page.screenshot({ path: join(output, "zh-home-light-desktop.png"), fullPage: true });
await page.locator(".site-header").screenshot({ path: join(output, "navigation-light.png") });
await page.locator("#work").scrollIntoViewIfNeeded();
await page.locator("#work").screenshot({ path: join(output, "selected-works-light.png") });
await page.locator("#method").scrollIntoViewIfNeeded();
await page.locator("#method").screenshot({ path: join(output, "method-light.png") });
await page.locator("#about").scrollIntoViewIfNeeded();
await page.locator("#about").screenshot({ path: join(output, "about-light-desktop.png") });

await page.getByRole("button", { name: "切换到夜间模式" }).click();
await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
await page.screenshot({ path: join(output, "appearance-toggle-dark.png"), fullPage: false });
await page.screenshot({ path: join(output, "zh-home-dark-desktop.png"), fullPage: true });

await gotoChecked(page, "/en", "en home dark");
await setTheme(page, "dark");
await page.reload({ waitUntil: "networkidle" });
await page.getByText("I turn fuzzy product concepts into clear flows and testable prototypes.").waitFor();
await page.getByText("A light workspace for how I build AI product prototypes.").waitFor();
await checkNoOverlay(page, "en home dark");
await checkBannedPhrases(page, "en home dark");
await capturePerf(page, "en home desktop dark");
await page.screenshot({ path: join(output, "en-home-dark-desktop.png"), fullPage: true });

await page.getByRole("button", { name: "Open command menu" }).click();
await page.getByRole("dialog", { name: "Quick navigation" }).waitFor();
await page.getByText("Switch to Chinese").waitFor();
await page.getByText("Switch to Light").waitFor();
await page.keyboard.press("Escape");

await gotoChecked(page, "/zh/projects/heard-sheep", "zh heard sheep case");
await page.getByText("项目概览", { exact: true }).waitFor();
await page.getByText("项目复盘", { exact: true }).waitFor();
await checkBannedPhrases(page, "zh heard sheep case");
await page.getByRole("button", { name: "Switch to English" }).first().click();
await page.waitForURL(/\/en\/projects\/heard-sheep$/);
routeResults.push({ label: "language switch keep path", path: page.url().replace(base, ""), status: 200, ok: page.url().endsWith("/en/projects/heard-sheep") });
await page.getByText("Overview", { exact: true }).waitFor();
await page.screenshot({ path: join(output, "case-heard-sheep.png"), fullPage: true });

for (const slug of ["proddoc-ai", "ai-decision-copilot"]) {
  await gotoChecked(page, `/en/projects/${slug}`, `en ${slug} case`);
  await page.getByText("Overview", { exact: true }).waitFor();
  await page.getByText("Reflection", { exact: true }).waitFor();
  await checkBannedPhrases(page, `en ${slug} case`);
  await page.screenshot({ path: join(output, `case-${slug}.png`), fullPage: true });
}
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
const mobilePage = await mobile.newPage();
attachObservers(mobilePage, "mobile");
await gotoChecked(mobilePage, "/zh", "zh home mobile light");
await setTheme(mobilePage, "light");
await mobilePage.reload({ waitUntil: "networkidle" });
await mobilePage.getByText("把复杂想法整理成清楚流程，再做成能体验、能验证的原型。").waitFor();
await checkMobileOverflow(mobilePage, "zh home mobile light");
await checkNoOverlay(mobilePage, "zh home mobile light");
await capturePerf(mobilePage, "zh home mobile light");
await mobilePage.screenshot({ path: join(output, "zh-home-mobile-light.png"), fullPage: true });
await mobilePage.locator("#about").scrollIntoViewIfNeeded();
await mobilePage.locator("#about").screenshot({ path: join(output, "about-mobile-light.png") });
await mobilePage.getByRole("button", { name: "打开菜单" }).click();
await mobilePage.getByRole("dialog", { name: "打开菜单" }).waitFor();
await mobilePage.getByRole("button", { name: "切换到夜间模式" }).click();
await mobilePage.waitForFunction(() => document.documentElement.dataset.theme === "dark");
await mobilePage.screenshot({ path: join(output, "mobile-theme-toggle-dark.png"), fullPage: false });
await mobilePage.screenshot({ path: join(output, "zh-home-mobile-dark.png"), fullPage: true });
await mobilePage.locator(".mobile-menu-panel .language-switcher button").nth(1).evaluate((button) => button.click());
await mobilePage.waitForURL(/\/en$/);
await mobilePage.screenshot({ path: join(output, "mobile-menu-language.png"), fullPage: false });
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
    routeResults.push({ label: "route", path, status, ok: status >= 200 && status < 400 });
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
