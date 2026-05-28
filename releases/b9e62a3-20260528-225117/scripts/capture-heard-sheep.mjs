import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "projects", "heard-sheep");
await mkdir(outDir, { recursive: true });

const BASE = process.env.HEARD_SHEEP_BASE ?? "http://127.0.0.1:3001/sheep";
const sampleText =
  "你帮我把这个活动方案再整理一下，明天下午前先给我一个初稿。重点补一下用户画像和预算，竞品案例也可以加两个。预算那里如果没有具体数据，你先按大概范围写，但要标出来。";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 430, height: 930 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});

async function capture(page, name) {
  const frame = page.locator(".phone-frame").first();
  await frame.waitFor({ state: "visible", timeout: 30000 });
  await page.waitForTimeout(450);
  await frame.screenshot({ path: join(outDir, `${name}.png`) });
  console.log(`captured ${name}.png`);
}

async function open(path) {
  const page = await context.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  return page;
}

const home = await open("");
await capture(home, "home-mobile");

await home.getByRole("button", { name: "粘贴转写稿" }).click();
await home.locator("textarea").fill(sampleText);
await capture(home, "input-mobile");

await home.getByRole("button", { name: "确认并生成候选任务" }).click();
await home.waitForURL(/\/result\//, { timeout: 60000 });
await home.waitForLoadState("networkidle");
await capture(home, "analysis-result-mobile");

const resultUrl = home.url();
await home.goto(`${resultUrl.split("?")[0]}?tab=tasks`, { waitUntil: "networkidle" });
await capture(home, "candidate-tasks-mobile");
await home.close();

const tasks = await open("/tasks");
await capture(tasks, "tasks-with-data-mobile");
await tasks.goto(`${BASE}/tasks?filter=done`, { waitUntil: "networkidle" });
await capture(tasks, "tasks-mobile");
await tasks.close();

const recordsResponse = await context.request.get(`${BASE}/api/records`);
const recordsPayload = await recordsResponse.json();
const records = recordsPayload.records ?? recordsPayload;
const recordWithTask = records.find((record) => record.tasks?.length);
if (!recordWithTask) {
  throw new Error("No task data found for task-detail screenshot.");
}
const task = recordWithTask.tasks[0];

const taskDetail = await open(`/task/${task.id}`);
await capture(taskDetail, "task-detail-mobile");
await taskDetail.close();

const history = await open("/history");
await capture(history, "history-mobile");
await history.close();

const me = await open("/me");
await capture(me, "me-mobile");
await me.close();

await browser.close();
