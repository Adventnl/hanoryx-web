import { chromium } from 'playwright-core';
const BASE = process.env.QA_BASE || 'http://localhost:5174';
const OUT = new URL('./shots/', import.meta.url).pathname;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch {} });
const page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await pause(700);

// Hover the nav group whose text is exactly "Systems" inside the primary nav
const sys = page.locator('nav[aria-label="Primary"] a', { hasText: 'Systems' }).first();
const box = await sys.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await pause(500);
}
await page.screenshot({ path: `${OUT}nav-menu-open-real.png` });
const visible = await page.locator('text=NODE MAP').first().isVisible().catch(() => false);
console.log('menu visible after hover:', visible);
await browser.close();
