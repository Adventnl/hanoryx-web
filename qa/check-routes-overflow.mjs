/* Verify no horizontal overflow / no 2nd scrollbar across routes + during the
   route-transition overlay (130vw beams). Usage: node qa/check-routes-overflow.mjs [baseURL] */
import { firefox } from 'playwright-core';
const BASE = process.argv[2] || 'http://localhost:5180';
const EXEC = process.env.PW_FF || process.env.LOCALAPPDATA + '\\ms-playwright\\firefox-1532\\firefox\\firefox.exe';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await firefox.launch({ executablePath: EXEC, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch {} });
const page = await ctx.newPage();
const probe = () => page.evaluate(() => {
  let bars = 0;
  for (const el of document.querySelectorAll('html, body, #root, div, main, section')) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) bars++;
  }
  return { overflow: document.documentElement.scrollWidth - window.innerWidth, cw: document.documentElement.clientWidth, vbars: bars };
});
let pass = true;
await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await pause(700);
for (const [label, link] of [['home->systems', 'Systems'], ['systems->work', 'Work'], ['work->company', 'Company'], ['company->contact', 'Contact']]) {
  await page.locator(`header a:has-text("${link}")`).first().click({ timeout: 4000 }).catch(() => {});
  await pause(250); const mid = await probe(); // during transition overlay
  await pause(700); const settled = await probe();
  const okRow = mid.overflow <= 2 && settled.overflow <= 2 && settled.vbars <= 1;
  if (!okRow) pass = false;
  console.log(`${okRow ? 'PASS' : 'FAIL'} ${label.padEnd(18)} mid{ovf:${mid.overflow},vbars:${mid.vbars}} settled{ovf:${settled.overflow},cw:${settled.cw},vbars:${settled.vbars}}`);
}
await browser.close();
console.log(pass ? '\nALL ROUTES OK' : '\nSOME ROUTES FAILED');
process.exit(pass ? 0 : 1);
