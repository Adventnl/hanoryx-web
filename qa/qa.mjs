import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:5174';
const OUT = new URL('./shots/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const routes = [
  ['/', 'home'],
  ['/systems', 'systems'],
  ['/systems/operational-management', 'systems-operational'],
  ['/north', 'north'],
  ['/north/motion-systems', 'north-motion'],
  ['/work', 'work'],
  ['/work/musebase', 'work-musebase'],
  ['/timeline', 'timeline'],
  ['/contact', 'contact'],
  ['/company', 'company'],
  ['/company/status', 'company-status'],
  ['/legal/privacy', 'legal-privacy'],
  ['/this-route-does-not-exist', '404'],
];

const log = [];
const errors = {};

function pause(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
// Skip the boot gate so QA sees actual pages.
await ctx.addInitScript(() => {
  try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch { /* */ }
});

const page = await ctx.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') {
    const u = page.url();
    (errors[u] = errors[u] || []).push(m.text());
  }
});
page.on('pageerror', (e) => {
  const u = page.url();
  (errors[u] = errors[u] || []).push('PAGEERROR: ' + e.message);
});

for (const [route, name] of routes) {
  await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch(() => {});
  await pause(900);
  // top screenshot
  await page.screenshot({ path: `${OUT}${name}-top.png` });
  // mid scroll for the longer pages
  if (['home', 'systems', 'work', 'contact'].includes(name)) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
    await pause(700);
    await page.screenshot({ path: `${OUT}${name}-mid.png` });
    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(300);
  }
  log.push(`shot ${name} (${route})`);
}

// ---- NAV INTERACTION TESTS (desktop) ----
await page.goto(BASE + '/', { waitUntil: 'networkidle' }).catch(() => {});
await pause(700);

async function megaVisible() {
  // RadialMegaMenu wrap: look for the node-map text or panel
  return page.evaluate(() => {
    const txt = Array.from(document.querySelectorAll('*')).some((el) =>
      /NODE MAP/.test(el.textContent || '') && el.offsetParent !== null
    );
    return txt;
  });
}

const navTests = {};

// Hover a multi-child group (Systems)
const systemsLink = page.getByRole('link', { name: /Systems/ }).first();
await systemsLink.hover().catch(() => {});
await pause(400);
navTests['hover-opens'] = await megaVisible();
await page.screenshot({ path: `${OUT}nav-hover-open.png` });

// Click a menu link -> menu should close + route changes
const menuChild = page.getByRole('link', { name: /Operational Management/ }).first();
if (await menuChild.count()) {
  await menuChild.click().catch(() => {});
  await pause(700);
}
navTests['after-link-click-still-open'] = await megaVisible();
navTests['after-link-click-url'] = page.url();
await page.screenshot({ path: `${OUT}nav-after-link-click.png` });

// Re-open then click OUTSIDE
await page.goto(BASE + '/', { waitUntil: 'networkidle' }).catch(() => {});
await pause(500);
await page.getByRole('link', { name: /Systems/ }).first().hover().catch(() => {});
await pause(400);
const openedForOutside = await megaVisible();
await page.mouse.click(720, 700); // body area
await pause(400);
navTests['outside-click-opened-first'] = openedForOutside;
navTests['after-outside-click-still-open'] = await megaVisible();
await page.screenshot({ path: `${OUT}nav-after-outside-click.png` });

// Re-open then Escape
await page.getByRole('link', { name: /Development/ }).first().hover().catch(() => {});
await pause(400);
const openedForEsc = await megaVisible();
await page.keyboard.press('Escape');
await pause(400);
navTests['escape-opened-first'] = openedForEsc;
navTests['after-escape-still-open'] = await megaVisible();

// Re-open then SCROLL
await page.getByRole('link', { name: /Development/ }).first().hover().catch(() => {});
await pause(400);
const openedForScroll = await megaVisible();
await page.mouse.wheel(0, 400);
await pause(400);
navTests['scroll-opened-first'] = openedForScroll;
navTests['after-scroll-still-open'] = await megaVisible();

// ---- MOBILE NAV ----
const mpage = await ctx.newPage();
await mpage.goto(BASE + '/', { waitUntil: 'networkidle' }).catch(() => {});
await mpage.setViewportSize({ width: 390, height: 844 });
await pause(600);
await mpage.screenshot({ path: `${OUT}mobile-home.png` });
const burger = mpage.getByRole('button', { name: /menu/i }).first();
if (await burger.count()) {
  await burger.click().catch(() => {});
  await pause(600);
  await mpage.screenshot({ path: `${OUT}mobile-nav-open.png` });
}

await browser.close();

// ---- REPORT ----
const report = { navTests, errorsByUrl: errors, log };
fs.writeFileSync(`${OUT}report.json`, JSON.stringify(report, null, 2));
console.log('=== NAV TESTS ===');
console.log(JSON.stringify(navTests, null, 2));
console.log('=== CONSOLE ERRORS ===');
console.log(JSON.stringify(errors, null, 2));
console.log('shots written to', OUT);
