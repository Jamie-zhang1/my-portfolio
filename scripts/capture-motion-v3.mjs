import { chromium } from "playwright";
import { mkdir, rename } from "node:fs/promises";
import { join, resolve } from "node:path";

const base = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3000";
const output = resolve("output/reference-v3-motion");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1566, height: 1080 },
  recordVideo: { dir: output, size: { width: 1566, height: 1080 } },
  reducedMotion: "no-preference",
});
const page = await context.newPage();
await page.goto(`${base}/zh`, { waitUntil: "networkidle" });
await page.locator(".editorial-portrait img.portrait-color").waitFor({ state: "visible" });
await page.waitForTimeout(3200);
const portrait = await page.locator(".editorial-portrait").boundingBox();
if (portrait) {
  await page.mouse.move(portrait.x + portrait.width * .39, portrait.y + portrait.height * .34, { steps: 18 });
  await page.mouse.move(portrait.x + portrait.width * .58, portrait.y + portrait.height * .48, { steps: 22 });
}
await page.waitForTimeout(900);
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.locator(".ref-project-card").first().hover();
await page.waitForTimeout(600);
await page.locator(".ref-project-rail-controls button").last().click();
await page.waitForTimeout(900);
await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.locator(".ref-capability-trigger").nth(1).click();
await page.waitForTimeout(800);
await page.locator(".ref-capability-trigger").nth(2).click();
await page.waitForTimeout(800);
await page.locator("#experience").scrollIntoViewIfNeeded();
await page.waitForTimeout(750);
await page.locator(".ref-experience-list article").nth(1).hover();
await page.waitForTimeout(750);
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.locator(".ref-contact-canvas").hover();
await page.waitForTimeout(900);
const video = page.video();
await context.close();
const source = await video.path();
const target = join(output, "portfolio-reference-v3.webm");
if (source !== target) await rename(source, target);
await browser.close();
console.log(JSON.stringify({ status: "captured", target }, null, 2));