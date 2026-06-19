/* Catch the transient SECOND scrollbar during the boot->home handoff.
   Samples width + every element currently showing a vertical scrollbar, at high
   frequency, from START through the handoff. Usage: node qa/repro-scrollbar.mjs [baseURL] */
import { firefox } from 'playwright-core';
const BASE = process.argv[2] || 'http://localhost:5180';
const EXEC = process.env.PW_FF || process.env.LOCALAPPDATA + '\\ms-playwright\\firefox-1532\\firefox\\firefox.exe';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await firefox.launch({ executablePath: EXEC, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await pause(500);

await page.evaluate(() => {
  window.__log = [];
  const sel = (el) => {
    if (el === document.documentElement) return 'html';
    if (el === document.body) return 'body';
    const id = el.id ? '#' + el.id : '';
    const cls = (el.className || '').toString().trim().split(/\s+/).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + id + (cls ? '.' + cls : '');
  };
  const scan = () => {
    const out = [];
    const all = document.querySelectorAll('html, body, #root, div, main, section');
    for (const el of all) {
      const cs = getComputedStyle(el);
      const oy = cs.overflowY;
      // A real vertical scrollbar only exists when overflow-y resolves to
      // auto/scroll AND content exceeds the box. `visible`/`hidden`/`clip`
      // never render a bar.
      const canScroll = oy === 'auto' || oy === 'scroll';
      if (canScroll && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
        out.push(sel(el) + ' oy=' + oy);
      }
    }
    return out;
  };
  let raf;
  const loop = () => {
    window.__log.push({
      t: Math.round(performance.now()),
      cw: document.documentElement.clientWidth,
      bars: scan(),
      booted: document.body.classList.contains('is-locked') ? 'locked' : 'unlocked',
      lenis: document.documentElement.className.includes('lenis-stopped') ? 'stopped' : (document.documentElement.className.includes('lenis') ? 'smooth' : '-'),
    });
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  window.__stop = () => cancelAnimationFrame(raf);
});

await page.locator('button:has-text("START")').click({ timeout: 5000 }).catch(() => {});
await pause(900);
await page.locator('text=/skip intro/i').click({ timeout: 4000 }).catch(() => {});
await pause(2500); // capture through the full handoff + clearProps + refresh

const log = await page.evaluate(() => { window.__stop(); return window.__log; });
// Print only transitions in (cw, bars count, booted, lenis)
let prev = '';
const widths = new Set();
for (const s of log) {
  widths.add(s.cw);
  const key = s.cw + '|' + s.bars.length + '|' + s.booted + '|' + s.lenis + '|' + s.bars.join(',');
  if (key !== prev) {
    console.log(`t=${String(s.t).padStart(6)} cw=${s.cw} ${s.booted} lenis=${s.lenis} bars[${s.bars.length}]: ${s.bars.join(' || ')}`);
    prev = key;
  }
}
console.log('\ndistinct clientWidths observed:', [...widths].sort((a, b) => a - b).join(', '));
const multi = log.filter((s) => s.bars.length > 1);
console.log('frames with >1 scrollbar:', multi.length);
await browser.close();
