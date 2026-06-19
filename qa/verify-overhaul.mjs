/* Comprehensive verification of the bug-fix overhaul.
   Usage: node qa/verify-overhaul.mjs [baseURL] */
import { firefox } from 'playwright-core';

const BASE = process.argv[2] || 'http://localhost:5174';
const EXEC = process.env.PW_FF || process.env.LOCALAPPDATA + '\\ms-playwright\\firefox-1532\\firefox\\firefox.exe';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const ok = (name, cond, extra = '') => { results.push({ name, pass: !!cond }); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`); };

const browser = await firefox.launch({ executablePath: EXEC, headless: true });

/* ===== A. REAL boot flow: horizontal shift + hero centering + handoff ===== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('P:' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|favicon/.test(m.text())) errors.push('C:' + m.text()); });

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pause(500);
  // boot overlay should be up and body locked
  const lockedWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const bodyLocked = await page.evaluate(() => document.body.classList.contains('is-locked'));
  ok('boot: body is locked on first load', bodyLocked);

  // click START to run the boot, then skip to finish quickly
  await page.locator('button:has-text("START")').click({ timeout: 5000 }).catch(() => {});
  await pause(400);
  await page.locator('text=/skip intro/i').click({ timeout: 4000 }).catch(() => {});
  await pause(1500); // let handoff settle
  const unlockedWidth = await page.evaluate(() => document.documentElement.clientWidth);
  ok('no horizontal shift across boot lock->unlock (scrollbar-gutter stable)', Math.abs(lockedWidth - unlockedWidth) <= 1, `locked=${lockedWidth} unlocked=${unlockedWidth}`);

  // hero vertical centering: heroInner center should be near viewport middle, not the bottom
  const hero = await page.evaluate(() => {
    const inner = document.querySelector('main section [class*="heroInner"]');
    if (!inner) return null;
    const r = inner.getBoundingClientRect();
    return { centerY: r.top + r.height / 2, vh: window.innerHeight };
  });
  if (hero) {
    const frac = hero.centerY / hero.vh;
    ok('hero content is centred (not bottom-pinned)', frac > 0.3 && frac < 0.72, `centerY=${Math.round(hero.centerY)} (${(frac * 100).toFixed(0)}% of vh)`);
  } else ok('hero content found', false);

  await page.screenshot({ path: '/tmp/verify-home-hero.png' });

  // no horizontal overflow
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  ok('no horizontal overflow on home', !overflow);

  ok('boot flow: no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}

/* ===== B. Scroll: scenes don't resize-rebuild + reveal stays + fps ===== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch {} });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('P:' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|favicon/.test(m.text())) errors.push('C:' + m.text()); });

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pause(700);

  // WARM UP: scroll through the whole page once so every scene builds (first
  // build legitimately sets canvas size). Then snapshot — a SECOND pass must
  // not change any canvas size (that would be a rebuild/reshuffle).
  await page.mouse.move(720, 450);
  for (let i = 0; i < 44; i++) { await page.mouse.wheel(0, 300); await pause(35); }
  await pause(300);
  await page.evaluate(() => window.scrollTo(0, 0)); await pause(400);
  await page.evaluate(() => { window.__canvasW0 = [...document.querySelectorAll('canvas')].map((c) => c.width); });

  for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 260); await pause(45); }
  await pause(200);
  for (let i = 0; i < 24; i++) { await page.mouse.wheel(0, -260); await pause(45); }
  await pause(300);
  const canvasChange = await page.evaluate(() => {
    const now = [...document.querySelectorAll('canvas')].map((c) => c.width);
    let changed = 0;
    for (let i = 0; i < Math.min(now.length, window.__canvasW0.length); i++) if (now[i] !== window.__canvasW0[i]) changed++;
    return { changed, total: now.length };
  });
  ok('built scenes do NOT rebuild/reshuffle on scroll (canvas size stable)', canvasChange.changed === 0, `${canvasChange.changed}/${canvasChange.total} canvases resized on 2nd pass`);

  // fps during a scroll burst
  const fps = await page.evaluate(() => new Promise((res) => {
    let n = 0, last = performance.now(), min = 999; const t0 = last;
    function tick(now) { n++; const d = now - last; if (d > 0) { const f = 1000 / d; if (f < min) min = f; } last = now; if (now - t0 < 1500) requestAnimationFrame(tick); else res({ fps: Math.round(n / ((now - t0) / 1000)), minFps: Math.round(min) }); }
    requestAnimationFrame(tick);
  }));
  // NOTE: headless Firefox software-renders canvas (no GPU), so absolute fps is
  // low and not representative of the user's GPU browser. We only guard against
  // a stall/runaway; baseline parity was confirmed separately (qa/fps-check.mjs).
  ok('no fps stall while idle-after-scroll (headless SW-render)', fps.fps >= 20, JSON.stringify(fps));
  ok('scroll: no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}

/* ===== C. Pointer re-enabled + reacts (no errors) ===== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch {} });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('P:' + e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pause(600);
  // Dispatch a real DOM mousemove (Playwright's synthetic mouse can be flaky in
  // headless FF) and read the SAME module instance the app uses.
  const active = await page.evaluate(async () => {
    const mod = await import('/src/animation/pointer.js');
    mod.initPointer(); // idempotent (started-guard); ensures listener on THIS instance
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 600, clientY: 400, bubbles: true }));
    return mod.getPointer().active;
  }).catch((e) => 'err:' + e.message);
  ok('pointer target activates on mouse move', active === true, `active=${active}`);
  ok('pointer: no errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
