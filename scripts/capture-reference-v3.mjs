import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const base = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3000";
const output = resolve("output/reference-v3");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });

const desktop = await browser.newContext({
  viewport: { width: 1566, height: 1080 },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});
const page = await desktop.newPage();
await page.goto(`${base}/zh`, { waitUntil: "networkidle" });
await page.locator(".editorial-portrait img.portrait-color").waitFor();
await page.waitForTimeout(1100);
await page.screenshot({ path: join(output, "desktop-full.png"), fullPage: true });
await page.screenshot({ path: join(output, "desktop-cover.png") });

for (const [id, file] of [["work", "work.png"], ["about", "capability-01.png"], ["experience", "experience.png"], ["contact", "contact.png"]]) {
  const section = page.locator(`#${id}`);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  await section.screenshot({ path: join(output, file) });
}
await page.locator("#about").scrollIntoViewIfNeeded();
await page.locator(".ref-capability-trigger").nth(2).click();
await page.waitForTimeout(700);
await page.locator("#about").screenshot({ path: join(output, "capability-03-active.png") });

const desktopAudit = await page.evaluate(() => {
  const sections = ["#work", "#about", "#experience", "#contact"].map((selector) => {
    const node = document.querySelector(selector);
    const rect = node?.getBoundingClientRect();
    return {
      selector,
      inViewState: node?.getAttribute("data-in-view"),
      width: rect?.width,
      height: rect?.height,
    };
  });
  const capability = Array.from(document.querySelectorAll(".ref-capability-list article")).map((node) => ({
    active: node.classList.contains("is-featured"),
    title: node.querySelector("strong")?.textContent,
    expanded: node.querySelector("button")?.getAttribute("aria-expanded"),
    height: node.getBoundingClientRect().height,
  }));
  return {
    viewportWidth: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    sections,
    capability,
    projectCards: document.querySelectorAll(".ref-project-card").length,
  };
});
await desktop.close();

const mobileResults = [];
for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 430, height: 932 }]) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const mobilePage = await context.newPage();
  await mobilePage.goto(`${base}/zh`, { waitUntil: "networkidle" });
  await mobilePage.locator(".editorial-portrait img.portrait-color").waitFor();
  await mobilePage.waitForTimeout(700);
  if (viewport.width === 390) {
    await mobilePage.screenshot({ path: join(output, "mobile-cover-390.png") });
    await mobilePage.screenshot({ path: join(output, "mobile-full-390.png"), fullPage: true });
    await mobilePage.locator("#about").scrollIntoViewIfNeeded();
    await mobilePage.locator(".ref-capability-trigger").nth(1).click();
    await mobilePage.waitForTimeout(600);
    await mobilePage.locator("#about").screenshot({ path: join(output, "mobile-capability-active.png") });
  }
  const audit = await mobilePage.evaluate(() => {
    const overlap = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const selectors = [".ref-section-head h2", ".ref-project-card h3", ".ref-capability-copy strong", ".ref-experience-list h3", ".ref-contact-canvas h2"];
    const clipped = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)).filter((node) => (
      node.scrollWidth > node.clientWidth + 1
    )).map((node) => ({ selector, text: node.textContent })));
    const controls = Array.from(document.querySelectorAll(".editorial-profile h2, .hero-collaborate, .editorial-socials a, .ref-project-rail-controls p, .ref-project-rail-controls button"));
    const collisions = [];
    for (let index = 0; index < controls.length; index += 1) {
      for (let next = index + 1; next < controls.length; next += 1) {
        const first = controls[index];
        const second = controls[next];
        const sameZone = first.closest(".ref-hero-canvas, .ref-project-rail-controls") === second.closest(".ref-hero-canvas, .ref-project-rail-controls");
        if (sameZone && overlap(first.getBoundingClientRect(), second.getBoundingClientRect())) {
          collisions.push([first.textContent, second.textContent]);
        }
      }
    }
    return {
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      clipped,
      collisions,
    };
  });
  mobileResults.push(audit);
  await context.close();
}

await browser.close();
await writeFile(join(output, "audit.json"), JSON.stringify({ desktopAudit, mobileResults }, null, 2));
console.log(JSON.stringify({ output, desktopAudit, mobileResults }, null, 2));