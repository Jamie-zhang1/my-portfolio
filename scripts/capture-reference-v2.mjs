import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const output = resolve("output/reference-v2");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });

const desktop = await browser.newContext({ viewport: { width: 1566, height: 1080 }, deviceScaleFactor: 2 });
const page = await desktop.newPage();
await page.goto("http://127.0.0.1:3000/zh", { waitUntil: "domcontentloaded" });
await page.locator(".editorial-portrait img.portrait-color").waitFor();
await page.waitForTimeout(5000);
const audit = await page.evaluate(() => ({
  title: document.querySelector("h1")?.textContent,
  scrollWidth: document.documentElement.scrollWidth,
  viewportWidth: innerWidth,
  portraitSrc: document.querySelector(".editorial-portrait img.portrait-color")?.getAttribute("src"),
  portraitReveal: (() => { const style = getComputedStyle(document.querySelector(".editorial-portrait img.portrait-color")); return { opacity: style.opacity, animationName: style.animationName, maskPosition: style.maskPosition, maskSize: style.maskSize }; })(),
  boxes: [".ref-hero-canvas", ".editorial-name", ".editorial-portrait", ".editorial-profile", ".editorial-socials"].map((selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return { selector, rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null };
  }),
  text: document.body.innerText.slice(0, 700),
}));
await page.screenshot({ path: join(output, "desktop-cover.png") });
const portraitBox = await page.locator(".editorial-portrait").boundingBox();
if (portraitBox) {
  await page.mouse.move(portraitBox.x + portraitBox.width * .47, portraitBox.y + portraitBox.height * .38, { steps: 14 });
  await page.waitForTimeout(420);
  await page.screenshot({ path: join(output, "desktop-hover-reveal.png") });
}
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.locator("#work").screenshot({ path: join(output, "work.png") });
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const mobilePage = await mobile.newPage();
await mobilePage.goto("http://127.0.0.1:3000/zh", { waitUntil: "domcontentloaded" });
await mobilePage.locator(".editorial-portrait img.portrait-color").waitFor();
await mobilePage.waitForTimeout(5000);
const mobileAudit = await mobilePage.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth }));
await mobilePage.screenshot({ path: join(output, "mobile-cover.png") });
await mobile.close();

await browser.close();
await writeFile(join(output, "audit.json"), JSON.stringify({ audit, mobileAudit }, null, 2));
console.log(JSON.stringify({ audit, mobileAudit, output }, null, 2));