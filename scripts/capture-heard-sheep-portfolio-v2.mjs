import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const base = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3000";
const output = resolve("output/heard-sheep-showcase-v2");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });

const desktop = await browser.newContext({ viewport: { width: 1566, height: 1080 }, deviceScaleFactor: 1 });
const page = await desktop.newPage();
await page.goto(`${base}/zh`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.locator("#work").screenshot({ path: join(output, "heard-sheep-work-desktop.png") });
await page.locator(".ref-project-card").first().screenshot({ path: join(output, "heard-sheep-card-desktop.png") });
const homeAudit = await page.evaluate(() => ({
  sources: Array.from(document.querySelectorAll(".project-artwork-heard-sheep img")).map((image) => image.currentSrc || image.getAttribute("src")),
  screens: document.querySelectorAll(".heard-sheep-art-screen").length,
  oldPhones: document.querySelectorAll(".heard-sheep-art-phone").length,
}));
await page.goto(`${base}/zh/projects/heard-sheep`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(800);
await page.screenshot({ path: join(output, "heard-sheep-detail-desktop.png"), fullPage: true });
await page.locator(".case-gallery-section").screenshot({ path: join(output, "heard-sheep-detail-gallery-numbers.png") });
const detailAudit = await page.evaluate(() => ({
  versionedImages: Array.from(document.images).map((image) => image.currentSrc || image.src).filter((src) => src.includes("showcase-20260721")),
  oldImages: Array.from(document.images).map((image) => image.currentSrc || image.src).filter((src) => /home-mobile|analysis-result-mobile|candidate-tasks-mobile|tasks-with-data-mobile|me-mobile/.test(src)),
  galleryHeaders: Array.from(document.querySelectorAll(".case-gallery-number")).map((node) => node.textContent?.trim()),
}));
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const mobilePage = await mobile.newPage();
await mobilePage.goto(`${base}/zh`, { waitUntil: "domcontentloaded", timeout: 60000 });
await mobilePage.locator("#work").scrollIntoViewIfNeeded();
await mobilePage.waitForTimeout(800);
await mobilePage.locator("#work").screenshot({ path: join(output, "heard-sheep-work-mobile.png") });
const mobileAudit = await mobilePage.evaluate(() => ({
  viewportWidth: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  sources: Array.from(document.querySelectorAll(".project-artwork-heard-sheep img")).map((image) => image.currentSrc || image.getAttribute("src")),
}));
await mobile.close();

await browser.close();
const report = { homeAudit, detailAudit, mobileAudit };
await writeFile(join(output, "audit.json"), JSON.stringify(report, null, 2));
if (homeAudit.screens !== 6 || homeAudit.oldPhones !== 0 || homeAudit.sources.some((src) => !src.includes("showcase-20260721") && !src.includes("heard-sheep.svg"))) throw new Error("Homepage Heard Sheep artwork is not fully versioned");
if (detailAudit.versionedImages.length < 6 || detailAudit.oldImages.length) throw new Error("Project detail still contains old Heard Sheep paths");
if (detailAudit.galleryHeaders.join(",") !== "01,02,03,04,05,06") throw new Error(`Gallery headers are not numeric-only: ${detailAudit.galleryHeaders.join(",")}`);
if (mobileAudit.scrollWidth > mobileAudit.viewportWidth + 1) throw new Error("Mobile page overflows horizontally");
console.log(JSON.stringify({ status: "passed", output, report }, null, 2));