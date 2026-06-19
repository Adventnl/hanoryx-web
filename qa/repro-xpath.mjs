/* Resolve the user's exact XPath and watch its clipPath/opacity/transform/height
   continuously during real wheel scrolling. */
import { firefox } from 'playwright-core';
const BASE = process.argv[2] || 'http://localhost:5174';
const EXEC = process.env.PW_FF || process.env.LOCALAPPDATA + '\\ms-playwright\\firefox-1532\\firefox\\firefox.exe';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const XPATH = '/html/body/div/div/div[5]/main/section[5]/div[2]/div/div/div[2]/div';

const browser = await firefox.launch({ executablePath: EXEC, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch {} });
const page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await pause(700);

const meta = await page.evaluate((xp) => {
  const r = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const el = r.singleNodeValue;
  if (!el) return { found: false };
  const info = { found: true, tag: el.tagName, cls: (el.className || '').toString(), parentCls: (el.parentElement?.className || '').toString() };
  window.__xel = el;
  window.__xparent = el.parentElement;
  return info;
}, XPATH);
console.log('XPath element:', JSON.stringify(meta, null, 2));
if (!meta.found) { await browser.close(); process.exit(0); }

await page.evaluate(() => {
  const watch = [window.__xel, window.__xparent].filter(Boolean);
  window.__log = [];
  let raf, frame = 0;
  const snap = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { o: +(+cs.opacity).toFixed(2), h: Math.round(r.height), t: cs.transform === 'none' ? 'I' : 'T', cp: cs.clipPath && cs.clipPath !== 'none' ? cs.clipPath.replace(/\s+/g,'').slice(0,30) : 'none' }; };
  const loop = () => {
    frame++;
    if (frame % 3 === 0) window.__log.push({ y: Math.round(window.scrollY), el: snap(watch[0]), par: watch[1] ? snap(watch[1]) : null });
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  window.__stop = () => cancelAnimationFrame(raf);
});

async function wheel(dir, n, dy, gap) { for (let i = 0; i < n; i++) { await page.mouse.wheel(0, dir * dy); await pause(gap); } }
await page.mouse.move(720, 450);
await wheel(1, 40, 200, 45);   // scroll down to & past the section
await pause(200);
await wheel(-1, 14, 240, 50);  // back up
await pause(200);
await wheel(1, 14, 240, 50);   // down again (re-enter)
await pause(300);

const log = await page.evaluate(() => { window.__stop(); return window.__log; });
// Print transitions only (when el snapshot changes) to keep it compact
let prev = '';
const lines = [];
for (const s of log) {
  const key = JSON.stringify(s.el) + '|' + JSON.stringify(s.par);
  if (key !== prev) { lines.push(`y=${String(s.y).padStart(5)} el=${JSON.stringify(s.el)} par=${JSON.stringify(s.par)}`); prev = key; }
}
console.log('\nstate transitions (' + lines.length + ' of ' + log.length + ' frames):');
lines.forEach((l) => console.log('  ' + l));
await browser.close();
