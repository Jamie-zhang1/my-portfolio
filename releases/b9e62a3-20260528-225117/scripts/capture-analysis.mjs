import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "screenshots", "demos");
await mkdir(outDir, { recursive: true });

const BASE = process.env.PORTFOLIO_BASE ?? "http://127.0.0.1:3099";

const browser = await chromium.launch({ headless: true });

// Capture decision copilot with analysis view
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(`${BASE}/try/decision-copilot`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

// Click the first case to show analysis
const firstCase = page.locator("button").filter({ hasText: "作品集网站" }).first();
if (await firstCase.isVisible()) {
  await firstCase.click();
  await page.waitForTimeout(800);
}

// Scroll to load full content
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let total = 0;
    const distance = 400;
    const timer = window.setInterval(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollBy(0, distance);
      total += distance;
      if (total >= scrollHeight) {
        window.clearInterval(timer);
        resolve(undefined);
      }
    }, 100);
  });
});
await page.waitForTimeout(500);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(500);

const path1 = join(outDir, "decision-copilot-analysis-desktop.png");
await page.screenshot({ path: path1, fullPage: true });
console.log(`✓ decision-copilot-analysis-desktop → ${path1}`);
await ctx.close();

// Capture proddoc-ai with generated content
const ctx2 = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page2 = await ctx2.newPage();
await page2.goto(`${BASE}/try/proddoc-ai`, { waitUntil: "networkidle" });
await page2.waitForTimeout(1000);

// Click generate button
const genBtn = page2.locator("button").filter({ hasText: "生成示例文档" }).first();
if (await genBtn.isVisible()) {
  await genBtn.click();
  await page2.waitForTimeout(1500); // Wait for generation animation
}

await page2.evaluate(async () => {
  await new Promise((resolve) => {
    let total = 0;
    const distance = 400;
    const timer = window.setInterval(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollBy(0, distance);
      total += distance;
      if (total >= scrollHeight) {
        window.clearInterval(timer);
        resolve(undefined);
      }
    }, 100);
  });
});
await page2.waitForTimeout(500);
await page2.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page2.waitForTimeout(500);

const path2 = join(outDir, "proddoc-ai-generated-desktop.png");
await page2.screenshot({ path: path2, fullPage: true });
console.log(`✓ proddoc-ai-generated-desktop → ${path2}`);
await ctx2.close();

await browser.close();
console.log("Done.");
