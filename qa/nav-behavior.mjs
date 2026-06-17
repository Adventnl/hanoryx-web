import { chromium } from 'playwright-core';
const BASE = process.env.QA_BASE || 'http://localhost:5174';
const OUT = new URL('./shots/', import.meta.url).pathname;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1400 } });
await ctx.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch {} });
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
page.on('pageerror', (e) => errs.push('PAGEERR ' + e.message));

const menuOpen = () => page.locator('text=NODE MAP').first().isVisible().catch(() => false);
async function hoverGroup(name) {
  const a = page.locator('nav[aria-label="Primary"] a', { hasText: name }).first();
  const b = await a.boundingBox();
  if (!b) return false;
  // neutral move first so re-hovering the same item fires a fresh mouseenter
  await page.mouse.move(720, 500);
  await pause(60);
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  return true;
}

const R = {};
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await pause(600);

// 1. intent delay: a fast pass should NOT open within ~80ms
await hoverGroup('Systems');
await pause(80);
R['no-instant-open-(intent)'] = !(await menuOpen());
await pause(400);
R['opens-after-dwell'] = await menuOpen();
await page.screenshot({ path: `${OUT}v2-nav-open.png` });

// 2. close on link click + route change
await page.locator('.... ', { hasText: 'x' }); // noop
let child = page.getByRole('link', { name: 'Operational Management' }).first();
if (await child.count()) await child.click();
await pause(600);
R['closed-after-link-click'] = !(await menuOpen());
R['url-after-click'] = page.url();

// 3. close on outside click
await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await pause(400);
await hoverGroup('Systems'); await pause(450);
R['reopened-1'] = await menuOpen();
await page.mouse.click(720, 900);
await pause(300);
R['closed-after-outside-click'] = !(await menuOpen());

// 4. close on Escape
await hoverGroup('Development'); await pause(450);
R['reopened-2'] = await menuOpen();
await page.keyboard.press('Escape');
await pause(300);
R['closed-after-escape'] = !(await menuOpen());

// 5. close on scroll
await hoverGroup('Development'); await pause(450);
R['reopened-3'] = await menuOpen();
await page.mouse.wheel(0, 500);
await pause(300);
R['closed-after-scroll'] = !(await menuOpen());

// 6. single-child group (Contact) should NOT open a panel
await page.evaluate(() => window.scrollTo(0, 0)); await pause(300);
await hoverGroup('Contact'); await pause(500);
R['contact-does-not-open'] = !(await menuOpen());

console.log(JSON.stringify(R, null, 2));
console.log('console errors:', errs.length, errs.slice(0, 5));
await browser.close();
