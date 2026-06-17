import { chromium } from 'playwright-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
const OUT=new URL('./shots2/',import.meta.url).pathname;
import fs from 'node:fs'; fs.mkdirSync(OUT,{recursive:true});
const routes=[['/','home'],['/systems','systems'],['/systems/operational-management','op-mgmt'],['/systems/commerce-infrastructure','commerce'],['/north/motion-systems','motion'],['/north','north'],['/work','work'],['/work/musebase','musebase'],['/company/status','status'],['/timeline','timeline'],['/contact','contact'],['/legal/privacy','privacy'],['/zzz','404']];
const b=await chromium.launch({executablePath:CHROME,headless:true});
const c=await b.newContext({viewport:{width:1440,height:900}});
await c.addInitScript(()=>{try{sessionStorage.setItem('hnx.boot.complete','1')}catch{}});
const p=await c.newPage();
const errs={};
p.on('console',m=>{if(m.type()==='error'){(errs[p.url()]=errs[p.url()]||[]).push(m.text());}});
p.on('pageerror',e=>{(errs[p.url()]=errs[p.url()]||[]).push('PAGEERR '+e.message);});
for(const [r,n] of routes){await p.goto('http://localhost:5174'+r,{waitUntil:'networkidle'}).catch(()=>{});await pause(1100);await p.screenshot({path:`${OUT}${n}.png`});}
await b.close();
console.log('console errors:',JSON.stringify(errs,null,1));
console.log('shots done');
