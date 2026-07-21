import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const base = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3000";
const output = resolve(process.env.PORTFOLIO_QA_OUTPUT ?? "output/reference-v3-qa");
await mkdir(output, { recursive: true });
const errors = [];
const routes = [];
const consoleErrors = [];

function observe(page, label) {
  page.on("pageerror", (error) => consoleErrors.push(`${label}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("favicon")) consoleErrors.push(`${label}: ${message.text()}`);
  });
}

async function checkRoute(context, path, expected = 200) {
  const page = await context.newPage();
  const response = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  const status = response?.status() ?? 0;
  routes.push({ path, status, finalUrl: page.url() });
  if (expected === 404 ? status !== 404 : status < 200 || status >= 400) errors.push(`${path}: expected ${expected}, got ${status}`);
  await page.close();
}

const browser = await chromium.launch({ headless: true });
const api = await browser.newContext();
for (const path of ["/zh", "/en", "/zh/projects/heard-sheep", "/zh/projects/researchflow-agent", "/zh/projects/proddoc-ai", "/zh/projects/ai-decision-copilot"]) await checkRoute(api, path);
for (const path of ["/zh/notes", "/zh/notes/idea/new", "/en/notes"]) await checkRoute(api, path, 404);
await api.close();

const desktop = await browser.newContext({ viewport: { width: 1566, height: 1080 }, deviceScaleFactor: 2, reducedMotion: "no-preference" });
const page = await desktop.newPage();
observe(page, "desktop");
await page.goto(`${base}/zh`, { waitUntil: "domcontentloaded" });
await page.getByRole("heading", { name: "Jamie Zhang" }).waitFor();
await page.locator(".editorial-portrait img.portrait-color").waitFor();
await page.waitForTimeout(1500);
const desktopAudit = await page.evaluate(() => {
  const rectOf = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
  };
  const portrait = document.querySelector(".editorial-portrait img.portrait-color");
  const monoPortrait = document.querySelector(".editorial-portrait img.portrait-mono");
  const hoverPortrait = document.querySelector(".editorial-portrait img.portrait-hover-color");
  const hairPortrait = document.querySelector(".editorial-portrait img.portrait-hair-tone");
  const track = document.querySelector(".ref-project-grid");
  return {
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
    h1Count: document.querySelectorAll("h1").length,
    h1Text: document.querySelector("h1")?.textContent,
    bodyText: document.body.innerText,
    projectArtworkCount: document.querySelectorAll(".project-artwork").length,
    heardScreenCount: document.querySelectorAll(".heard-sheep-art-screen").length,
    portraitSrc: portrait instanceof HTMLImageElement ? portrait.currentSrc : null,
    portraitFilter: portrait ? getComputedStyle(portrait).filter : null,
    portraitAnimation: portrait ? getComputedStyle(portrait).animationName : null,
    portraitMask: portrait ? getComputedStyle(portrait).maskImage : null,
    monoPortraitFilter: monoPortrait ? getComputedStyle(monoPortrait).filter : null,
    hoverPortraitMask: hoverPortrait ? getComputedStyle(hoverPortrait).maskImage : null,
    hairPortraitFilter: hairPortrait ? getComputedStyle(hairPortrait).filter : null,
    hairPortraitOpacity: hairPortrait ? getComputedStyle(hairPortrait).opacity : null,
    canvas: rectOf(".ref-hero-canvas"),
    name: rectOf(".editorial-name"),
    portrait: rectOf(".editorial-portrait"),
    profile: rectOf(".editorial-profile"),
    socials: rectOf(".editorial-socials"),
    projectTrack: track ? { clientWidth: track.clientWidth, scrollWidth: track.scrollWidth } : null,
    experienceAnchor: Boolean(document.querySelector("#experience")),
    contactCanvas: rectOf(".ref-contact-canvas"),
    navHrefs: Array.from(document.querySelectorAll(".desktop-nav a")).map((item) => item.getAttribute("href")),
    projectHrefs: Array.from(document.querySelectorAll(".ref-project-card")).map((item) => item.getAttribute("href")),
    gmailHrefs: Array.from(document.querySelectorAll(`a[href^="https://mail.google.com/mail/"]`)).map((item) => item.getAttribute("href")),
  };
});
if (desktopAudit.scrollWidth > desktopAudit.viewportWidth + 1) errors.push(`desktop overflow: ${desktopAudit.scrollWidth}/${desktopAudit.viewportWidth}`);
if (desktopAudit.h1Count !== 1 || desktopAudit.h1Text !== "JAMIEZHANG") errors.push(`desktop h1: ${desktopAudit.h1Count}/${desktopAudit.h1Text}`);
if (desktopAudit.bodyText.includes("????")) errors.push("Chinese copy contains replacement question marks");
if (!desktopAudit.portraitSrc?.includes("jamie-hero-cutout-hd.png") || !desktopAudit.portraitSrc.includes("q=95")) errors.push(`portrait source: ${desktopAudit.portraitSrc}`);
if (!desktopAudit.portraitFilter?.includes("saturate(1.2)") || !desktopAudit.monoPortraitFilter?.includes("contrast(1.12)")) errors.push(`portrait treatment: ${desktopAudit.portraitFilter}/${desktopAudit.monoPortraitFilter}`);
if (desktopAudit.hoverPortraitMask === "none") errors.push(`portrait hover mask: ${desktopAudit.hoverPortraitMask}`);
if (!desktopAudit.hairPortraitFilter?.includes("brightness(0.42)") || Number(desktopAudit.hairPortraitOpacity) < .6) errors.push(`portrait hair tone: ${desktopAudit.hairPortraitFilter}/${desktopAudit.hairPortraitOpacity}`);
if (desktopAudit.portraitAnimation !== "ref-face-color-reveal" || desktopAudit.portraitMask === "none") errors.push(`portrait reveal: ${desktopAudit.portraitAnimation}/${desktopAudit.portraitMask}`);
if (desktopAudit.projectArtworkCount !== 8) errors.push(`project artwork count: ${desktopAudit.projectArtworkCount}`);
if (desktopAudit.heardScreenCount !== 6) errors.push(`heard sheep screen count: ${desktopAudit.heardScreenCount}`);
if (!desktopAudit.projectTrack || desktopAudit.projectTrack.scrollWidth <= desktopAudit.projectTrack.clientWidth) errors.push("project track is not horizontally scrollable");
if (!desktopAudit.experienceAnchor) errors.push("experience anchor missing");
if (!desktopAudit.canvas || desktopAudit.canvas.x > 22 || desktopAudit.canvas.y > 36 || desktopAudit.canvas.width < desktopAudit.viewportWidth - 44) errors.push(`hero canvas geometry: ${JSON.stringify(desktopAudit.canvas)}`);
if (!desktopAudit.contactCanvas || Math.abs(desktopAudit.contactCanvas.width - desktopAudit.canvas.width) > 2) errors.push(`contact canvas width: ${JSON.stringify(desktopAudit.contactCanvas)}`);
if (desktopAudit.navHrefs?.join("|") !== "/zh#work|/zh#about|/zh#experience|/zh#contact") errors.push(`navigation hrefs: ${desktopAudit.navHrefs}`);
if (desktopAudit.projectHrefs?.length !== 4 || desktopAudit.projectHrefs.some((href) => !href?.startsWith("/zh/projects/"))) errors.push(`project hrefs: ${desktopAudit.projectHrefs}`);
if (!desktopAudit.gmailHrefs?.length || desktopAudit.gmailHrefs.some((href) => !href?.includes("to=zhangjiangmin0902%40gmail.com"))) errors.push(`gmail hrefs: ${desktopAudit.gmailHrefs}`);
const portraitBox = await page.locator(".editorial-portrait").boundingBox();
if (!portraitBox) {
  errors.push("portrait hover target missing");
}
if (portraitBox) {
  await page.mouse.move(portraitBox.x + portraitBox.width * .48, portraitBox.y + portraitBox.height * .38, { steps: 12 });
  await page.waitForTimeout(360);
}
const hoverAudit = await page.evaluate(() => {
  const canvas = document.querySelector(".ref-hero-canvas");
  const hoverLayer = document.querySelector(".portrait-hover-color");
  const style = hoverLayer ? getComputedStyle(hoverLayer) : null;
  return {
    active: canvas?.hasAttribute("data-portrait-hover") ?? false,
    opacity: style?.opacity ?? null,
    revealX: canvas instanceof HTMLElement ? canvas.style.getPropertyValue("--portrait-reveal-x") : null,
    revealY: canvas instanceof HTMLElement ? canvas.style.getPropertyValue("--portrait-reveal-y") : null,
  };
});
if (!hoverAudit.active || Number(hoverAudit.opacity) < .95 || !hoverAudit.revealX || !hoverAudit.revealY) errors.push(`portrait hover interaction: ${JSON.stringify(hoverAudit)}`);
await page.screenshot({ path: join(output, "desktop-hover-reveal.png") });
await page.screenshot({ path: join(output, "desktop-cover.png") });
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.locator("#work").screenshot({ path: join(output, "selected-work.png") });
await page.locator(".ref-capability-canvas").screenshot({ path: join(output, "capability.png") });
await page.locator(".ref-capability-trigger").nth(1).click();
await page.waitForTimeout(520);
const capabilityAudit = await page.locator(".ref-capability-list article").evaluateAll((items) => items.map((item) => ({
  active: item.classList.contains("is-featured"),
  expanded: item.querySelector("button")?.getAttribute("aria-expanded"),
})));
if (!capabilityAudit[1]?.active || capabilityAudit[1]?.expanded !== "true") errors.push(`capability interaction: ${JSON.stringify(capabilityAudit)}`);
await page.locator(".ref-experience-canvas").screenshot({ path: join(output, "experience.png") });

const casePage = await desktop.newPage();
observe(casePage, "heard-sheep-case");
await casePage.goto(`${base}/zh/projects/heard-sheep`, { waitUntil: "domcontentloaded" });
const caseAudit = await casePage.evaluate(() => {
  const header = document.querySelector(".site-header")?.getBoundingClientRect();
  const hero = document.querySelector(".case-hero-window")?.getBoundingClientRect();
  const gallery = Array.from(document.querySelectorAll(".case-gallery.is-mobile-gallery figure")).map((item) => item.getBoundingClientRect());
  const demo = document.querySelector('.case-actions a[href="/sheep"]');
  const heroImage = document.querySelector(".case-hero-image.is-mobile-product img");
  return {
    headerHeroOverlap: header && hero ? Math.max(0, header.bottom - hero.top) : null,
    galleryCount: gallery.length,
    galleryRows: new Set(gallery.map((item) => Math.round(item.y))).size,
    demoHref: demo?.getAttribute("href") ?? null,
    demoTarget: demo?.getAttribute("target") ?? null,
    heroObjectPosition: heroImage ? getComputedStyle(heroImage).objectPosition : null,
  };
});
if (caseAudit.headerHeroOverlap !== 0) errors.push(`case header overlap: ${caseAudit.headerHeroOverlap}`);
if (caseAudit.galleryCount !== 6 || caseAudit.galleryRows !== 1) errors.push(`case gallery layout: ${JSON.stringify(caseAudit)}`);
if (caseAudit.demoHref !== "/sheep" || caseAudit.demoTarget !== "_blank") errors.push(`heard sheep demo link: ${JSON.stringify(caseAudit)}`);
if (caseAudit.heroObjectPosition !== "50% 0%") errors.push(`heard sheep hero position: ${caseAudit.heroObjectPosition}`);
const legacySheep = await desktop.request.get(`${base}/zh/sheep`, { maxRedirects: 0 });
if (legacySheep.status() !== 308 || legacySheep.headers().location !== "/sheep") errors.push(`legacy sheep redirect: ${legacySheep.status()}/${legacySheep.headers().location}`);
await casePage.screenshot({ path: join(output, "heard-sheep-detail-fixed.png"), fullPage: false });
await casePage.close();
await desktop.close();

const reduced = await browser.newContext({ viewport: { width: 1200, height: 800 }, reducedMotion: "reduce" });
const reducedPage = await reduced.newPage();
await reducedPage.goto(`${base}/zh`, { waitUntil: "domcontentloaded" });
await reducedPage.locator(".editorial-portrait img.portrait-color").waitFor();
const reducedOpacity = await reducedPage.locator(".editorial-portrait").evaluate((element) => getComputedStyle(element).opacity);
if (reducedOpacity !== "1") errors.push(`reduced motion portrait opacity: ${reducedOpacity}`);
await reduced.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "no-preference" });
const mobilePage = await mobile.newPage();
observe(mobilePage, "mobile");
await mobilePage.goto(`${base}/zh`, { waitUntil: "domcontentloaded" });
await mobilePage.locator(".editorial-portrait img.portrait-color").waitFor();
await mobilePage.waitForTimeout(1200);
const mobileAudit = await mobilePage.evaluate(() => {
  const tools = document.querySelector(".header-tools")?.getBoundingClientRect();
  const portrait = document.querySelector(".editorial-portrait img.portrait-color");
  return {
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
    headerToolsX: tools?.x ?? null,
    portraitSrc: portrait instanceof HTMLImageElement ? portrait.currentSrc : null,
  };
});
if (mobileAudit.scrollWidth > mobileAudit.viewportWidth + 1) errors.push(`mobile overflow: ${mobileAudit.scrollWidth}/${mobileAudit.viewportWidth}`);
if ((mobileAudit.headerToolsX ?? 0) < 300) errors.push(`mobile menu is not right aligned: ${mobileAudit.headerToolsX}`);
if (!mobileAudit.portraitSrc?.includes("q=95")) errors.push(`mobile portrait source: ${mobileAudit.portraitSrc}`);
await mobilePage.screenshot({ path: join(output, "mobile-cover.png") });
await mobilePage.getByRole("button", { name: "打开菜单" }).click();
await mobilePage.getByRole("dialog", { name: "打开菜单" }).waitFor();
await mobilePage.screenshot({ path: join(output, "mobile-menu.png") });
await mobile.close();


const darkMobile = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: "dark" });
await darkMobile.addInitScript(() => localStorage.setItem("jamie-theme-mode", "dark"));
const darkPage = await darkMobile.newPage();
observe(darkPage, "dark-mobile");
await darkPage.goto(`${base}/zh`, { waitUntil: "domcontentloaded" });
await darkPage.locator(".editorial-portrait img.portrait-mono").waitFor();
await darkPage.waitForTimeout(800);
const darkAudit = await darkPage.evaluate(() => {
  const portrait = document.querySelector(".editorial-portrait")?.getBoundingClientRect();
  const mono = document.querySelector(".portrait-mono");
  const canvas = document.querySelector(".ref-hero-canvas");
  const profile = document.querySelector(".editorial-profile")?.getBoundingClientRect();
  const socials = document.querySelector(".editorial-socials")?.getBoundingClientRect();
  return {
    theme: document.documentElement.dataset.theme,
    viewportWidth: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    canvasBackground: canvas ? getComputedStyle(canvas).backgroundColor : null,
    portraitFilter: mono ? getComputedStyle(mono).filter : null,
    portrait: portrait ? { x: portrait.x, y: portrait.y, width: portrait.width, height: portrait.height } : null,
    profile: profile ? { x: profile.x, y: profile.y, width: profile.width, height: profile.height } : null,
    profileContentRight: Math.max(...Array.from(document.querySelectorAll(".editorial-profile h2, .editorial-profile .hero-collaborate")).map((item) => item.getBoundingClientRect().right)),
    socials: socials ? { x: socials.x, y: socials.y, width: socials.width, height: socials.height } : null,
  };
});
if (darkAudit.theme !== "dark") errors.push(`dark theme state: ${darkAudit.theme}`);
if (darkAudit.scrollWidth > darkAudit.viewportWidth + 1) errors.push(`dark mobile overflow: ${darkAudit.scrollWidth}/${darkAudit.viewportWidth}`);
if (!darkAudit.portraitFilter?.includes("contrast(1.22)") || !darkAudit.portraitFilter.includes("brightness(1.08)")) errors.push(`dark portrait treatment: ${darkAudit.portraitFilter}`);
if (!darkAudit.portrait || darkAudit.portrait.x < -30 || darkAudit.portrait.x + darkAudit.portrait.width > darkAudit.viewportWidth + 30) errors.push(`dark portrait geometry: ${JSON.stringify(darkAudit.portrait)}`);
if (darkAudit.socials && darkAudit.profileContentRight > darkAudit.socials.x - 6) errors.push(`dark mobile controls overlap: ${JSON.stringify({ profileContentRight: darkAudit.profileContentRight, socials: darkAudit.socials })}`);
await darkPage.screenshot({ path: join(output, "mobile-dark-cover.png"), fullPage: true });
await darkMobile.close();
await browser.close();
errors.push(...consoleErrors.filter((item) => !item.includes("webpack-hmr")));
const report = { base, generatedAt: new Date().toISOString(), routes, desktopAudit, hoverAudit, capabilityAudit, mobileAudit, darkAudit, caseAudit, reducedOpacity, consoleErrors, errors };
await writeFile(join(output, "qa-report.json"), JSON.stringify(report, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(JSON.stringify({ status: "passed", output, routes, desktopAudit, hoverAudit, capabilityAudit, mobileAudit, darkAudit, caseAudit, reducedOpacity }, null, 2));
