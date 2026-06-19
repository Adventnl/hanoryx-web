import { firefox } from 'playwright-core';
const EXEC = process.env.PW_FF || process.env.LOCALAPPDATA + '\\ms-playwright\\firefox-1532\\firefox\\firefox.exe';
const BASE = process.argv[2] || 'http://localhost:5180';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await firefox.launch({ executablePath: EXEC, headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch {} });
const p = await ctx.newPage();
await p.goto(BASE + '/', { waitUntil: 'networkidle' });
await pause(900);
await p.screenshot({ path: 'qa/shots/overhaul-hero.png' });
for (let i = 0; i < 26; i++) { await p.mouse.wheel(0, 200); await pause(45); }
await pause(600);
await p.screenshot({ path: 'qa/shots/overhaul-split.png' });
await b.close();
console.log('shots saved');
