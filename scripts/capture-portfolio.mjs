import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "screenshots", "portfolio");
await mkdir(outDir, { recursive: true });

const BASE = process.env.PORTFOLIO_BASE ?? "http://127.0.0.1:3456";

const pages = [
  { name: "home-desktop", url: "/", width: 1440, height: 900 },
  { name: "home-mobile", url: "/", width: 375, height: 812 },
  { name: "try-desktop", url: "/try", width: 1440, height: 900 },
  { name: "try-mobile", url: "/try", width: 375, height: 812 },
  { name: "proddoc-desktop", url: "/projects/proddoc-ai", width: 1440, height: 900 },
  { name: "proddoc-mobile", url: "/projects/proddoc-ai", width: 375, height: 812 },
  { name: "sheep-desktop", url: "/projects/heard-sheep", width: 1440, height: 900 },
  { name: "sheep-mobile", url: "/projects/heard-sheep", width: 375, height: 812 },
  { name: "copilot-desktop", url: "/projects/decision-copilot", width: 1440, height: 900 },
  { name: "copilot-mobile", url: "/projects/decision-copilot", width: 375, height: 812 },
];

const browser = await chromium.launch({ headless: true });

async function loadFullPage(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 600;
      const timer = window.setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        total += distance;
        if (total >= scrollHeight) {
          window.clearInterval(timer);
          resolve(undefined);
        }
      }, 120);
    });
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
  await page.waitForFunction(() => window.scrollY === 0);
  await page.waitForTimeout(500);
}

for (const p of pages) {
  const ctx = await browser.newContext({
    viewport: { width: p.width, height: p.height },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}${p.url}`, { waitUntil: "networkidle" });
  await loadFullPage(page);
  const path = join(outDir, `${p.name}.png`);
  await page.screenshot({ path, fullPage: true });
  console.log(`✓ ${p.name} → ${path}`);
  await ctx.close();
}

await browser.close();
console.log("Done.");
