import { chromium } from 'playwright-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({executablePath:CHROME,headless:true});
const c=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await c.addInitScript(()=>{try{sessionStorage.setItem('hnx.boot.complete','1')}catch{}});
const p=await c.newPage();
const errs=[];
p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
p.on('pageerror',e=>errs.push('PE '+e.message));
for(const r of ['/','/systems/operational-management','/contact']){await p.goto('http://localhost:5174'+r,{waitUntil:'networkidle'}).catch(()=>{});await pause(700);}
await p.screenshot({path:'qa/shots2/reduced-contact.png'});
console.log('reduced-motion console errors:',errs.length, errs.slice(0,3));
await b.close();console.log('done');
