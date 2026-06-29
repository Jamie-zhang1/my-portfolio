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
  p("逻辑学", "训练"),
  p("我尝试了", " 我主要尝试了"),
  p("I tried", " I tried"),
  p("Logic training,", "plus"),
  p("最近", "在改什么"),
  p("项目", "最近更新"),
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
  const response = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
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

async function checkTextareaContains(page, expected, label) {
  const textarea = page.locator("textarea").first();
  await textarea.waitFor();
  try {
    await page.waitForFunction((value) => document.querySelector("textarea")?.value.includes(value), expected, { timeout: 5000 });
  } catch {
    const value = await textarea.inputValue();
    errors.push(`${label}: expected textarea to include ${expected}, got ${value}`);
  }
}
await scanHtmlPaths(["/", "/zh", "/en"]);

const desktop = await browser.newContext({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1, reducedMotion: "no-preference", acceptDownloads: true, permissions: ["clipboard-read", "clipboard-write"] });
const page = await desktop.newPage();
attachObservers(page, "desktop");

await gotoChecked(page, "/zh", "zh home light");
await setTheme(page, "light");
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByRole("heading", { name: "Jamie Zhang" }).waitFor();
await page.getByText("用 vibe coding 把想法做成网页。").waitFor();
for (const label of ["我的作品", "研究方法", "关于我", "联系我"]) {
  await page.locator(".desktop-nav").getByText(label, { exact: true }).waitFor();
}
await page.getByRole("link", { name: "写下一个想法" }).waitFor();
const noteEntryLinks = await page.locator(".workspace-note-entry").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
if (noteEntryLinks.length !== 4 || !noteEntryLinks.every((href) => href?.match(/\/zh\/notes\/(idea|draft|review|learning)\/new/))) errors.push(`note entries: expected 4 zh note links, got ${JSON.stringify(noteEntryLinks)}`);
await page.getByRole("button", { name: "我的作品" }).click();
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
await page.locator("#recent").getByText("02 / 持续更新").waitFor();
await page.locator("#recent").screenshot({ path: join(output, "ongoing-updates-light.png") });
await page.locator("#method").scrollIntoViewIfNeeded();
await page.locator("#method").screenshot({ path: join(output, "method-light.png") });
await page.locator("#method").getByText("拆清楚", { exact: true }).waitFor();
await page.locator("#method").getByText("搭页面", { exact: true }).waitFor();
await page.locator("#about").scrollIntoViewIfNeeded();
await page.locator("#about").screenshot({ path: join(output, "about-light-desktop.png") });
await page.getByText("逻辑训练让我习惯把问题拆成前提、规则、判断和结论。").waitFor();
await page.locator("#contact").getByRole("link", { name: "zhangjiangmin0902@gmail.com" }).waitFor();
await page.locator("#contact").screenshot({ path: join(output, "contact-email-light.png") });

await gotoChecked(page, "/zh/notes", "zh notes center empty");
await page.getByRole("heading", { name: "记录中心" }).waitFor();
await page.getByText("想法记录 → 页面草稿 → 项目复盘").waitFor();
await page.getByText("学习笔记可关联任意阶段").waitFor();
await page.getByText("显示所有本地记录，按更新时间排序。").waitFor();
await page.getByRole("button", { name: "页面草稿" }).click();
await page.getByText("这里保存已经开始整理页面结构的记录。").waitFor();
await page.getByText("还没有页面草稿。可以从一个想法开始，把它整理成页面结构。").waitFor();
await page.screenshot({ path: join(output, "notes-center-empty-zh.png"), fullPage: true });
await gotoChecked(page, "/zh/notes/idea/new", "zh new note");
await page.getByRole("heading", { name: "记录一个想法" }).waitFor();
await checkTextareaContains(page, "## 原始想法", "zh idea template");
await page.getByPlaceholder("给这个想法起个名字").fill("语音任务整理想法");
await page.getByLabel("关联项目").selectOption("heard-sheep");
await page.locator("textarea").fill("## 原始想法`n继续整理语音输入后的任务拆分方式，先记录，再慢慢补成项目记录。`n`n## 可能用途`n任务卡片整理。`n");
await page.getByPlaceholder("网页想法、AI 工具").fill("网页想法, AI 工具, 待整理");
const fixturePath = join(output, "note-attachment-sample.txt");
await writeFile(fixturePath, "local attachment preview only", "utf8");
await page.locator("input[type=file]").setInputFiles(fixturePath);
await page.screenshot({ path: join(output, "notes-new-zh.png"), fullPage: true });
for (const [type, heading, templateText] of [["draft", "整理一个页面草稿", "## 页面目标"], ["review", "写一段项目复盘", "## 做了什么"], ["learning", "保存一条学习笔记", "## 学到的内容"]]) {
  await gotoChecked(page, `/zh/notes/${type}/new`, `zh ${type} note mode`);
  await page.getByRole("heading", { name: heading }).waitFor();
  await checkTextareaContains(page, templateText, `${type} template`);
}
await gotoChecked(page, "/zh/notes/idea/new", "zh idea note before save");
await page.getByRole("heading", { name: "记录一个想法" }).waitFor();
await page.getByPlaceholder("给这个想法起个名字").fill("语音任务整理想法");
await page.getByLabel("关联项目").selectOption("heard-sheep");
await page.locator("textarea").fill("## 原始想法`n继续整理语音输入后的任务拆分方式。`n`n## 可能用途`n任务卡片整理。`n");
await page.getByPlaceholder("网页想法、AI 工具").fill("网页想法, AI 工具, 待整理");
await page.getByRole("button", { name: "保存草稿" }).click();
await page.getByText("已保存到当前浏览器。", { exact: true }).waitFor();
await page.screenshot({ path: join(output, "notes-save-success-zh.png"), fullPage: true });
await gotoChecked(page, "/zh/notes", "zh notes list");
await page.getByRole("heading", { name: "记录中心" }).waitFor();
await page.getByText("想法记录 → 页面草稿 → 项目复盘").waitFor();
await page.getByText("语音任务整理想法").waitFor();
await page.getByText("关联项目: Heard Sheep").waitFor();
await page.getByText("下一步").first().waitFor();
await page.getByRole("link", { name: /整理成页面草稿/ }).waitFor();
await page.screenshot({ path: join(output, "notes-list-zh.png"), fullPage: true });
await page.getByRole("button", { name: "想法记录" }).click();
await page.getByText("这里是最初的想法池。").waitFor();
await page.getByText("语音任务整理想法").waitFor();
await page.getByRole("button", { name: "复制 Markdown" }).first().click();
await page.getByText("Markdown 已复制。").waitFor();
const copiedMarkdown = await page.evaluate(() => navigator.clipboard.readText());
if (!copiedMarkdown.includes("类型：想法记录") || !copiedMarkdown.includes("关联记录：-")) errors.push(`notes markdown: expected type and relation fields, got ${copiedMarkdown}`);
await page.screenshot({ path: join(output, "notes-markdown-copy-zh.png"), fullPage: true });

await page.getByRole("link", { name: /整理成页面草稿/ }).click();
await page.getByRole("heading", { name: "整理一个页面草稿" }).waitFor();
await page.getByText("第二步 / 从想法整理成页面").waitFor();
await page.locator(".note-source-box").getByText("关联记录").waitFor();
await page.locator(".note-source-box").getByText("语音任务整理想法").waitFor();
await checkTextareaContains(page, "来源想法：语音任务整理想法", "zh idea to draft source");
await page.getByPlaceholder("给这个页面草稿起个名字").fill("首页记录入口结构");
await page.locator("textarea").fill("来源想法：语音任务整理想法\n\n## 页面目标\n把记录入口按想法、草稿、复盘和学习笔记组织起来。\n\n## 页面结构\n入口说明、四类记录和后续动作。\n");
await page.getByRole("button", { name: "保存草稿" }).click();
await page.getByText("已保存到当前浏览器。", { exact: true }).waitFor();
await gotoChecked(page, "/zh/notes", "zh notes list after draft");
await page.getByRole("button", { name: "页面草稿" }).click();
await page.getByText("首页记录入口结构").waitFor();
await page.getByText("关联记录: 语音任务整理想法").waitFor();
await page.getByRole("link", { name: /写项目复盘/ }).click();
await page.getByRole("heading", { name: "写一段项目复盘" }).waitFor();
await page.getByText("第三步 / 做完一轮后回看").waitFor();
await checkTextareaContains(page, "来源草稿：首页记录入口结构", "zh draft to review source");
const draftId = await page.evaluate(() => {
  const notes = JSON.parse(localStorage.getItem("jamie-local-notes-v1") || "[]");
  return notes.find((note) => note.title === "首页记录入口结构")?.id;
});
if (!draftId) errors.push("notes relation: expected saved draft id");
if (draftId) {
  await gotoChecked(page, `/zh/notes/learning/new?from=${draftId}`, "zh learning from draft");
  await page.getByRole("heading", { name: "保存一条学习笔记" }).waitFor();
  await page.getByText("旁支 / 可以关联任意阶段").waitFor();
  await page.locator(".note-source-box").getByText("首页记录入口结构").waitFor();
  await checkTextareaContains(page, "来源草稿：首页记录入口结构", "zh learning source relation");
}
await gotoChecked(page, "/en/notes/idea/new", "en new note");
await page.getByRole("heading", { name: "Capture an idea" }).waitFor();
await checkTextareaContains(page, "## Raw idea", "en idea template");
for (const [type, heading, templateText] of [["draft", "Draft a page structure", "## Page goal"], ["review", "Write a project review", "## What I did"], ["learning", "Save a learning note", "## What I learned"]]) {
  await gotoChecked(page, `/en/notes/${type}/new`, `en ${type} note mode`);
  await page.getByRole("heading", { name: heading }).waitFor();
  await checkTextareaContains(page, templateText, `${type} template`);
}
await gotoChecked(page, "/en/notes/learning/new", "en learning note screenshot");
await page.getByRole("heading", { name: "Save a learning note" }).waitFor();
await page.screenshot({ path: join(output, "notes-new-en.png"), fullPage: true });

await gotoChecked(page, "/zh", "zh home before dark toggle");
await setTheme(page, "light");
await page.getByRole("button", { name: "切换到夜间模式" }).click();
await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
await page.screenshot({ path: join(output, "appearance-toggle-dark.png"), fullPage: false });
await page.screenshot({ path: join(output, "zh-home-dark-desktop.png"), fullPage: true });

await gotoChecked(page, "/en", "en home light");
await setTheme(page, "light");
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByText("I use vibe coding to turn ideas into web pages.").waitFor();
await page.getByText("AI tool experiments and web pages.").waitFor();
await page.getByText("Logic training, plus a little web practice.").waitFor();
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
await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.55)));
await page.waitForTimeout(300);
if (!(await page.locator(".project-back-fixed .project-back-pill").isVisible())) errors.push("project back: zh desktop sticky back button not visible after scroll");
await page.locator(".project-back-fixed .project-back-pill").screenshot({ path: join(output, "project-back-sticky-zh.png") });
await checkBannedPhrases(page, "zh heard sheep note");
await page.getByRole("button", { name: "Switch to English" }).first().click();
await page.waitForURL(/\/en\/projects\/heard-sheep$/);
routeResults.push({ label: "language switch keep path", path: page.url().replace(base, ""), status: 200, ok: page.url().endsWith("/en/projects/heard-sheep") });
await page.getByText("Project Note", { exact: true }).waitFor();
await page.getByText("Back to Work").waitFor();
await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.55)));
await page.waitForTimeout(300);
if (!(await page.locator(".project-back-fixed .project-back-pill").isVisible())) errors.push("project back: en desktop sticky back button not visible after scroll");
await page.locator(".project-back-fixed .project-back-pill").click();
await page.waitForURL(/\/en#work$/);
await gotoChecked(page, "/en/projects/heard-sheep", "en heard sheep after back check");
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
await mobilePage.reload({ waitUntil: "domcontentloaded" });
await mobilePage.getByText("用 vibe coding 把想法做成网页。").waitFor();
await checkMobileOverflow(mobilePage, "zh home mobile light");
await checkNoOverlay(mobilePage, "zh home mobile light");
await checkBannedPhrases(mobilePage, "zh home mobile light");
await capturePerf(mobilePage, "zh home mobile light");
await mobilePage.screenshot({ path: join(output, "zh-home-mobile-light.png"), fullPage: true });
await mobilePage.goto(`${base}/zh/projects/proddoc-ai`, { waitUntil: "domcontentloaded" });
await mobilePage.locator(".project-back-mobile").getByRole("link", { name: "返回" }).waitFor();
await mobilePage.locator(".project-back-mobile").screenshot({ path: join(output, "project-back-mobile.png"), fullPage: false });
await gotoChecked(mobilePage, "/zh", "zh home mobile after project back check");
await setTheme(mobilePage, "light");
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
const routePaths = ["/", "/zh", "/en", "/zh/notes", "/en/notes", "/zh/notes/new", "/en/notes/new", "/zh/notes/idea/new", "/zh/notes/draft/new", "/zh/notes/review/new", "/zh/notes/learning/new", "/en/notes/idea/new", "/en/notes/draft/new", "/en/notes/review/new", "/en/notes/learning/new", "/zh/projects/heard-sheep", "/en/projects/heard-sheep", "/zh/projects/proddoc-ai", "/en/projects/proddoc-ai", "/zh/projects/ai-decision-copilot", "/en/projects/ai-decision-copilot"];
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