/* Focused fps check: idle + during-scroll (the metric the removed fast-scroll
   reveal optimisation would affect). Usage: node qa/fps-check.mjs [baseURL] [tag] */
import { firefox } from 'playwright-core';
const BASE = process.argv[2] || 'http://localhost:5180';
const TAG = process.argv[3] || 'current';
const EXEC = process.env.PW_FF || process.env.LOCALAPPDATA + '\\ms-playwright\\firefox-1532\\firefox\\firefox.exe';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await firefox.launch({ executablePath: EXEC, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch {} });
const page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await pause(800);

const startMeter = () => page.evaluate(() => {
  window.__m = { n: 0, last: performance.now(), min: 999, t0: performance.now() };
  const tick = (now) => { window.__m.n++; const d = now - window.__m.last; if (d > 0) { const f = 1000 / d; if (f < window.__m.min) window.__m.min = f; } window.__m.last = now; window.__m.raf = requestAnimationFrame(tick); };
  window.__m.raf = requestAnimationFrame(tick);
});
const readMeter = () => page.evaluate(() => { cancelAnimationFrame(window.__m.raf); const dt = (performance.now() - window.__m.t0) / 1000; return { fps: Math.round(window.__m.n / dt), min: Math.round(window.__m.min) }; });

// idle
await startMeter(); await pause(1600); const idle = await readMeter();
// during continuous scroll
await page.mouse.move(720, 450);
await startMeter();
for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 320); await pause(50); }
const scrolling = await readMeter();

console.log(`[${TAG}] idle=${JSON.stringify(idle)}  during-scroll=${JSON.stringify(scrolling)}`);
await browser.close();
