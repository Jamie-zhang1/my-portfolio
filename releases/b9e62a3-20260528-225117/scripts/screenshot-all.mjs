import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const BASE = 'http://localhost:3099';
const OUT = '/home/ubuntu/apps/my-portfolio/current/public/screenshots';

const pages = [
  { name: 'decision-copilot-demo', url: '/try/decision-copilot', fullPage: true },
  { name: 'proddoc-ai-demo', url: '/try/proddoc-ai', fullPage: true },
  { name: 'decision-copilot-project', url: '/projects/decision-copilot', fullPage: true },
  { name: 'proddoc-ai-project', url: '/projects/proddoc-ai', fullPage: true },
  { name: 'homepage', url: '/', fullPage: false },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox'] });

for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}${p.url}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const path = `${OUT}/${p.name}.png`;
  await page.screenshot({ path, fullPage: p.fullPage });
  console.log(`✅ ${p.name} → ${path}`);
  await page.close();
}

await browser.close();
console.log('All screenshots done.');
