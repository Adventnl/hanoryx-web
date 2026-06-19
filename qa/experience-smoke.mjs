/* QA: full-screen synthesis overlay + perf/viewport/transition acceptance.
   Usage: node qa/experience-smoke.mjs [baseURL]
   Requires a running preview/dev server (default http://localhost:4173). */
import { chromium } from 'playwright-core';

const BASE = process.argv[2] || 'http://localhost:4173';
const EXEC =
  process.env.PW_CHROME ||
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond, extra });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
};

async function skipBoot(page) {
  await page.locator('text=Skip intro').click({ timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(700);
}

const browser = await chromium.launch({ executablePath: EXEC });

/* ---- desktop ---- */
{
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => errors.push('P:' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/CERT|Failed to load resource/.test(m.text())) errors.push('C:' + m.text());
  });

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await skipBoot(page);

  // viewport fit: first section should ~fill the viewport (no "1.5 blocks")
  const heroH = await page.evaluate(() => {
    const s = document.querySelector('main section');
    return s ? s.getBoundingClientRect().height : 0;
  });
  const vh = await page.evaluate(() => window.innerHeight);
  ok('hero fills viewport (>=92%)', heroH >= vh * 0.92, `hero=${Math.round(heroH)} vh=${vh}`);
  ok('hero not absurdly tall (<140%)', heroH <= vh * 1.4, `hero=${Math.round(heroH)}`);
  await page.screenshot({ path: '/tmp/qa-home-desktop.png' });

  // open synthesis overlay
  await page.locator('text=Play System Sequence').first().click();
  await page.waitForTimeout(900);
  const overlay = page.locator('[role="dialog"][aria-label="System synthesis sequence"]');
  ok('overlay opens', (await overlay.count()) > 0);
  const htmlActive = await page.evaluate(() => document.documentElement.classList.contains('synthesis-active'));
  ok('html.synthesis-active set', htmlActive);
  const bodyLocked = await page.evaluate(() => document.body.classList.contains('is-locked'));
  ok('body scroll locked', bodyLocked);
  const navHidden = await page.evaluate(() => {
    const nav = document.querySelector('header[data-chrome]');
    if (!nav) return false;
    return parseFloat(getComputedStyle(nav).opacity) < 0.05;
  });
  ok('nav hidden during overlay', navHidden);
  ok('no player scrubber', (await page.locator('text=Replay').count()) === 0 && (await page.locator('text=Restart').count()) === 0);
  ok('minimal SKIP present', (await page.locator('button:has-text("SKIP")').count()) > 0);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '/tmp/qa-overlay-mid.png' });

  // skip closes
  await page.locator('button:has-text("SKIP")').click();
  await page.waitForTimeout(600);
  ok('overlay closes on skip', (await overlay.count()) === 0);
  const restored = await page.evaluate(() => !document.documentElement.classList.contains('synthesis-active') && !document.body.classList.contains('is-locked'));
  ok('chrome/scroll restored after skip', restored);

  // removed route -> NotFound
  await page.goto(BASE + '/experience/system-synthesis', { waitUntil: 'networkidle' });
  await skipBoot(page);
  const notFound = await page.evaluate(() => /404|not found|signal lost/i.test(document.body.innerText));
  ok('/experience/system-synthesis removed (404)', notFound);

  // route transition + nav: navigate home -> systems
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await skipBoot(page);
  await page.goto(BASE + '/systems', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  ok('systems route renders', (await page.locator('h1, h2').count()) > 0);

  // fast scroll stress: big jumps, then settle — collect errors
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await skipBoot(page);
  for (let i = 0; i < 12; i += 1) {
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(600);
  ok('fast scroll: no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

  await page.close();
}

/* ---- mobile ---- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  let overflow = false;
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await skipBoot(page);
  overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  ok('mobile: no horizontal overflow', !overflow);
  await page.screenshot({ path: '/tmp/qa-home-mobile.png' });
  await page.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
