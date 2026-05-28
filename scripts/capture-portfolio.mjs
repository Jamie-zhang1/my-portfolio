import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "screenshots", "portfolio");
await mkdir(outDir, { recursive: true });

const BASE = "http://localhost:3456";

const pages = [
  { name: "home-desktop", url: "/", width: 1440, height: 900 },
  { name: "home-mobile", url: "/", width: 375, height: 812 },
  { name: "proddoc-desktop", url: "/projects/proddoc-ai", width: 1440, height: 900 },
  { name: "proddoc-mobile", url: "/projects/proddoc-ai", width: 375, height: 812 },
  { name: "sheep-desktop", url: "/projects/heard-sheep", width: 1440, height: 900 },
  { name: "sheep-mobile", url: "/projects/heard-sheep", width: 375, height: 812 },
  { name: "copilot-desktop", url: "/projects/decision-copilot", width: 1440, height: 900 },
];

const browser = await chromium.launch({ headless: true });

for (const p of pages) {
  const ctx = await browser.newContext({
    viewport: { width: p.width, height: p.height },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}${p.url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const path = join(outDir, `${p.name}.png`);
  await page.screenshot({ path, fullPage: true });
  console.log(`✓ ${p.name} → ${path}`);
  await ctx.close();
}

await browser.close();
console.log("Done.");
