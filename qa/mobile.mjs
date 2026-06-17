import { chromium } from 'playwright-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({executablePath:CHROME,headless:true});
const c=await b.newContext({viewport:{width:390,height:844}});
await c.addInitScript(()=>{try{sessionStorage.setItem('hnx.boot.complete','1')}catch{}});
const p=await c.newPage();
await p.goto('http://localhost:5174/',{waitUntil:'networkidle'});await pause(500);
const burger=p.getByRole('button',{name:/menu/i}).first();
await burger.click();await pause(700);
await p.screenshot({path:'qa/shots/v2-mobile-open.png'});
// expand a group
const exp=p.getByRole('button',{name:/Toggle Systems/i}).first();
if(await exp.count()){await exp.click();await pause(600);await p.screenshot({path:'qa/shots/v2-mobile-expanded.png'});}
await b.close();console.log('done');
