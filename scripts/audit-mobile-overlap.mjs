import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const output = resolve("output/mobile-overlap-audit");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const cases = [
  { width: 320, height: 568, locale: "zh" },
  { width: 360, height: 640, locale: "zh" },
  { width: 390, height: 844, locale: "zh" },
  { width: 430, height: 932, locale: "zh" },
  { width: 320, height: 568, locale: "en" },
  { width: 390, height: 844, locale: "en" },
];

const reports = [];
for (const testCase of cases) {
  const context = await browser.newContext({ viewport: testCase, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:3000/${testCase.locale}`, { waitUntil: "domcontentloaded" });
  await page.locator(".editorial-portrait").waitFor();
  await page.waitForTimeout(1200);
  const audit = await page.evaluate(() => {
    const selector = [
      ".header-availability", ".mobile-nav button", ".editorial-name-word", ".editorial-profile h2",
      ".hero-collaborate", ".editorial-socials a", ".ref-section-head h2", ".ref-section-head > a",
      ".ref-project-meta h3", ".ref-project-card > p", ".ref-project-link", ".ref-project-rail-controls p", ".ref-project-rail-controls button", ".ref-capability-copy strong",
      ".ref-capability-copy em", ".ref-experience-list h3", ".ref-experience-list p",
      ".ref-contact-canvas h2", ".ref-contact-canvas > p", ".ref-contact-canvas > a",
    ].join(",");
    const items = [...document.querySelectorAll(selector)].filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    }).map((element, index) => {
      const rect = element.getBoundingClientRect();
      return { index, tag: element.tagName, className: element.className, text: element.textContent?.trim().slice(0, 80), rect: { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height } };
    });
    const collisions = [];
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i]; const b = items[j];
        const overlapX = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.x, b.rect.x);
        const overlapY = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.y, b.rect.y);
        if (overlapX > 2 && overlapY > 2) collisions.push({ a: a.text, b: b.text, overlapX, overlapY });
      }
    }
    const hero = document.querySelector(".ref-hero-canvas")?.getBoundingClientRect();
    return { scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, hero: hero ? { height: hero.height } : null, collisions };
  });
  const name = `${testCase.locale}-${testCase.width}x${testCase.height}`;
  await page.screenshot({ path: join(output, `${name}.png`), fullPage: true });
  await page.locator(".mobile-nav button").click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  const menuAudit = await dialog.evaluate((element) => {
    const items = [...element.querySelectorAll("a,button")].filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }).map((item) => {
      const rect = item.getBoundingClientRect();
      return { text: item.textContent?.trim(), rect: { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom } };
    });
    const collisions = [];
    for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i]; const b = items[j];
      const overlapX = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.x, b.rect.x);
      const overlapY = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.y, b.rect.y);
      if (overlapX > 2 && overlapY > 2) collisions.push({ a: a.text, b: b.text, overlapX, overlapY });
    }
    return { collisions };
  });
  await page.screenshot({ path: join(output, `${name}-menu.png`) });
  reports.push({ ...testCase, ...audit, menuCollisions: menuAudit.collisions });
  await context.close();
}
await browser.close();
await writeFile(join(output, "report.json"), JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports, null, 2));
if (reports.some((item) => item.collisions.length || item.menuCollisions.length)) process.exit(1);
