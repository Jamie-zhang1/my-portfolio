import { chromium } from "playwright";
import { mkdir, rename } from "node:fs/promises";
import { join, resolve } from "node:path";

const base = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3000";
const output = resolve(process.env.PORTFOLIO_MOTION_OUTPUT ?? "output/reference-v2-motion");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1566, height: 1080 },
  recordVideo: { dir: output, size: { width: 1566, height: 1080 } },
  reducedMotion: "no-preference",
});
const page = await context.newPage();
await page.goto(`${base}/zh`, { waitUntil: "domcontentloaded" });
await page.locator(".editorial-portrait img.portrait-color").waitFor({ state: "visible" });
await page.waitForTimeout(6100);
await page.mouse.move(280, 250, { steps: 14 });
await page.mouse.move(675, 570, { steps: 18 });
await page.mouse.move(790, 625, { steps: 18 });
await page.mouse.move(900, 690, { steps: 18 });
await page.waitForTimeout(900);
await page.mouse.move(1120, 480, { steps: 18 });
await page.waitForTimeout(650);
await page.locator(".editorial-socials a").first().hover();
await page.waitForTimeout(650);
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.locator(".ref-project-card").first().hover();
await page.waitForTimeout(700);
await page.locator(".ref-project-grid").evaluate((element) => element.scrollTo({ left: element.scrollWidth * 0.46, behavior: "smooth" }));
await page.waitForTimeout(1200);
await page.locator(".ref-capability-canvas").scrollIntoViewIfNeeded();
await page.waitForTimeout(850);
await page.locator(".ref-capability-list article.is-featured").hover();
await page.waitForTimeout(850);
await page.locator(".ref-experience-canvas").scrollIntoViewIfNeeded();
await page.waitForTimeout(850);
const video = page.video();
await context.close();
const source = await video.path();
const target = join(output, "portfolio-reference-v2.webm");
if (source !== target) await rename(source, target);
await browser.close();
console.log(JSON.stringify({ status: "captured", target }, null, 2));