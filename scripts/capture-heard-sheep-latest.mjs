import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const base = "http://127.0.0.1:3001/sheep";
const output = resolve("public/projects/heard-sheep");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
let createdRecordId = null;

await page.goto(base, { waitUntil: "domcontentloaded" });
await page.getByRole("heading", { name: "听到了咩" }).waitFor();
await page.screenshot({ path: join(output, "home-mobile.png") });

await page.getByRole("button", { name: "粘贴文本" }).click();
await page.getByRole("button", { name: "示例文本" }).click();
await page.screenshot({ path: join(output, "input-mobile.png") });
await page.getByRole("button", { name: "确认并生成候选任务" }).click();
await page.waitForURL(/\/result\/[^/]+$/, { timeout: 90000 });
createdRecordId = page.url().split("/result/")[1]?.split(/[?#]/)[0] ?? null;

await page.getByRole("button", { name: "整理文本" }).waitFor({ timeout: 30000 });
await page.waitForTimeout(500);
await page.screenshot({ path: join(output, "analysis-result-mobile.png") });

await page.getByRole("button", { name: "候选任务" }).click();
await page.getByText(/项候选/).waitFor();
await page.screenshot({ path: join(output, "candidate-tasks-mobile.png") });

const selectAll = page.getByRole("button", { name: "全选候选" });
if (await selectAll.count()) await selectAll.click();
const batchAdd = page.getByRole("button", { name: /批量加入/ });
if (await batchAdd.count()) {
  await batchAdd.click();
  await page.getByText(/项已加入任务清单/).waitFor({ timeout: 30000 });
}

await page.goto(`${base}/tasks`, { waitUntil: "domcontentloaded" });
await page.screenshot({ path: join(output, "tasks-with-data-mobile.png") });

await page.goto(`${base}/me`, { waitUntil: "domcontentloaded" });
await page.screenshot({ path: join(output, "me-mobile.png") });

if (createdRecordId) await context.request.delete(`${base}/api/records/${createdRecordId}`);
await context.close();
await browser.close();
console.log(JSON.stringify({ status: "captured", output, createdRecordId }, null, 2));
