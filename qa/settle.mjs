import { chromium } from 'playwright-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({executablePath:CHROME,headless:true});
const c=await b.newContext({viewport:{width:1440,height:1000}});
await c.addInitScript(()=>{try{sessionStorage.setItem('hnx.boot.complete','1')}catch{}});
const p=await c.newPage();
await p.goto('http://localhost:5174/',{waitUntil:'networkidle'});await pause(600);
const a=p.locator('nav[aria-label="Primary"] a',{hasText:'Systems'}).first();
const box=await a.boundingBox();
await p.mouse.move(box.x+box.width/2, box.y+box.height/2);
await pause(1200);
await p.screenshot({path:'/Users/adventnl/hanoryx-web/qa/shots/v2-nav-settled.png'});
// also hover a deep child to test selector swing
const ch=p.getByRole('link',{name:'Research Systems'}).first();
if(await ch.count()){const cb=await ch.boundingBox(); await p.mouse.move(cb.x+10, cb.y+5); await pause(700);}
await p.screenshot({path:'/Users/adventnl/hanoryx-web/qa/shots/v2-nav-selector.png'});
await b.close();
console.log('done');
