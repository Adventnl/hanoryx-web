import { chromium } from 'playwright-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
const hud = (p)=>p.evaluate(()=>{const el=[...document.querySelectorAll('div')].find(d=>/SCENES/.test(d.textContent||''));return el?el.textContent:'(no hud)';});
const b=await chromium.launch({executablePath:CHROME,headless:true});
const c=await b.newContext({viewport:{width:1440,height:900}});
await c.addInitScript(()=>{try{sessionStorage.setItem('hnx.boot.complete','1')}catch{}});
const p=await c.newPage();
await p.goto('http://localhost:5174/',{waitUntil:'networkidle'});await pause(1200);
console.log('home idle   :', await hud(p));
// scroll through the whole page in steps, sample the cap
let maxScenes=0;
for(let i=1;i<=6;i++){await p.evaluate((f)=>window.scrollTo(0,document.body.scrollHeight*f),i/6);await pause(500);const t=await hud(p);const m=t.match(/SCENES (\d+)/);if(m)maxScenes=Math.max(maxScenes,+m[1]);}
console.log('home scroll : max active scenes =', maxScenes);
await p.goto('http://localhost:5174/systems',{waitUntil:'networkidle'});await pause(1000);
console.log('systems idle:', await hud(p));
await b.close();
