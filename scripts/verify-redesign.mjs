import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { join } from "path";

const base = process.env.PORTFOLIO_BASE ?? "http://127.0.0.1:3456";
const output = join(process.cwd(), "public", "screenshots", "redesign");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const errors = [];

async function observe(page, label) {
  page.on("pageerror", (error) => errors.push(`${label}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${label}: ${message.text()}`);
  });
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await desktop.newPage();
await observe(page, "desktop");
await page.goto(`${base}/en`, { waitUntil: "networkidle" });
await page.locator("h1").filter({ hasText: "messy" }).waitFor();
await page.screenshot({ path: join(output, "home-desktop.png"), fullPage: false });

await page.locator(".product-card-toggle").filter({ hasText: "ProdDoc AI" }).click();
await page.locator(".product-card.is-expanded").filter({ hasText: "ProdDoc AI" }).getByRole("link", { name: "View case study" }).waitFor();

await page.locator("#lab").scrollIntoViewIfNeeded();
await page.locator("#lab-request").fill("比较先做语音输入还是图片识别，给出决策建议");
await page.getByRole("button", { name: "Run product flow" }).click();
await page.getByText("Decision brief", { exact: true }).waitFor({ timeout: 5000 });
await page.screenshot({ path: join(output, "lab-desktop.png"), fullPage: false });

await page.getByRole("button", { name: "Open command menu" }).click();
await page.getByRole("dialog", { name: "Quick navigation" }).waitFor();
await page.keyboard.press("Escape");

await page.goto(`${base}/en/projects/heard-sheep`, { waitUntil: "networkidle" });
for (const section of ["Overview", "Problem", "Solution", "My Role", "Core Flow", "Key Interaction", "AI Capability", "Tech Stack", "What I Built", "Reflection", "DEMO & GITHUB"]) {
  await page.getByText(section, { exact: false }).first().waitFor();
}
await page.screenshot({ path: join(output, "case-study-desktop.png"), fullPage: false });
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const mobilePage = await mobile.newPage();
await observe(mobilePage, "mobile");
await mobilePage.goto(`${base}/en`, { waitUntil: "networkidle" });
await mobilePage.locator("h1").filter({ hasText: "messy" }).waitFor();
const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (overflow) errors.push("mobile: horizontal overflow detected");
await mobilePage.screenshot({ path: join(output, "home-mobile.png"), fullPage: false });
await mobilePage.goto(`${base}/en/projects/proddoc-ai`, { waitUntil: "networkidle" });
await mobilePage.getByText("Overview", { exact: true }).waitFor();
await mobilePage.screenshot({ path: join(output, "case-study-mobile.png"), fullPage: false });
await mobile.close();

await browser.close();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("redesign verification passed");
