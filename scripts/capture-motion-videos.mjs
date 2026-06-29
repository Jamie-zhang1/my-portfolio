import { chromium } from "playwright";
import { mkdir, rename, rm, writeFile } from "fs/promises";
import { join } from "path";

const base = process.env.PORTFOLIO_BASE ?? "http://127.0.0.1:3005";
const output = join(process.cwd(), "public", "screenshots", "acceptance", "videos");
await mkdir(output, { recursive: true });

const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ headless: true, executablePath });
const results = [];

async function record(name, fn) {
  const dir = join(output, `.tmp-${name}-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1360, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    acceptDownloads: true,
    permissions: ["clipboard-read", "clipboard-write"],
    recordVideo: { dir, size: { width: 1360, height: 900 } },
  });
  const page = await context.newPage();
  await fn(page);
  await page.waitForTimeout(600);
  const video = page.video();
  await context.close();
  const source = await video.path();
  const target = join(output, `${name}.webm`);
  await rm(target, { force: true });
  await rename(source, target);
  await rm(dir, { recursive: true, force: true });
  results.push({ name, path: target });
}

async function hover(locator, ms = 500) {
  await locator.scrollIntoViewIfNeeded();
  await locator.hover();
  await locator.page().waitForTimeout(ms);
}

await record("home-motion", async (page) => {
  await page.goto(`${base}/zh`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  await hover(page.getByRole("link", { name: "写下一个想法" }), 500);
  for (const card of await page.locator(".workspace-note-entry").all()) {
    await hover(card, 450);
  }
  await page.getByRole("button", { name: "我的作品" }).click();
  await page.waitForTimeout(700);
});

await record("notes-motion", async (page) => {
  await page.goto(`${base}/zh/notes`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.removeItem("jamie-local-notes-v1"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "页面草稿" }).click();
  await page.waitForTimeout(450);
  await page.getByRole("button", { name: "学习笔记" }).click();
  await page.waitForTimeout(450);
  await page.goto(`${base}/zh/notes/idea/new`, { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("给这个想法起个名字").fill("动效验收记录");
  await page.locator("textarea").fill("## 原始想法\n记录按钮、卡片和筛选动效。\n\n## 下一步\n保存后检查反馈。\n");
  await page.getByRole("button", { name: "保存草稿" }).click();
  await page.waitForTimeout(1200);
  await page.goto(`${base}/zh/notes`, { waitUntil: "domcontentloaded" });
  await page.getByText("动效验收记录").waitFor();
  await hover(page.locator(".note-list-card").first(), 500);
  await page.getByRole("button", { name: "复制 Markdown" }).first().click();
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: "导出 Markdown" }).first().click();
  await page.waitForTimeout(900);
});

await record("work-cards-motion", async (page) => {
  await page.goto(`${base}/zh`, { waitUntil: "domcontentloaded" });
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  for (const card of await page.locator("#work .work-card").all()) {
    await hover(card, 500);
  }
  await page.locator("#work .work-card").first().click();
  await page.waitForTimeout(800);
  await page.goto(`${base}/zh`, { waitUntil: "domcontentloaded" });
  await page.locator("#recent").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  for (const row of await page.locator("#recent .recent-row").all()) {
    await hover(row, 450);
  }
  await page.locator("#recent .recent-row").first().click();
  await page.waitForTimeout(700);
});

await record("project-detail-motion", async (page) => {
  await page.goto(`${base}/zh/projects/heard-sheep`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.45)));
  await page.waitForTimeout(700);
  await hover(page.locator(".project-back-fixed .project-back-pill"), 500);
  await hover(page.locator(".prototype-window").first(), 500);
  await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.72)));
  await page.waitForTimeout(600);
  await hover(page.locator(".project-back-fixed .project-back-pill"), 500);
});

await browser.close();
await writeFile(join(output, "motion-video-report.json"), JSON.stringify({ base, generatedAt: new Date().toISOString(), videos: results }, null, 2));
console.log(JSON.stringify({ status: "recorded", base, output, videos: results }, null, 2));