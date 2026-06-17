import { chromium } from 'playwright-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
const routes=['/','/systems','/systems/operational-management','/systems/commerce-infrastructure','/systems/automation','/systems/internal-platforms','/systems/data-interfaces','/systems/client-portals','/systems/research-systems','/north','/north/engineering','/north/interface-lab','/north/motion-systems','/north/architecture','/north/tooling','/work','/work/commerce-system-i','/work/musebase','/work/north-console','/work/unknown-system-03','/work/experimental-interface-program','/company','/company/principles','/company/security','/company/status','/timeline','/contact','/legal/privacy','/legal/terms','/nope-404'];
const b=await chromium.launch({executablePath:CHROME,headless:true});
const c=await b.newContext({viewport:{width:1440,height:900}});
await c.addInitScript(()=>{try{sessionStorage.setItem('hnx.boot.complete','1')}catch{}});
const p=await c.newPage();
const errs={};
p.on('console',m=>{if(m.type()==='error'){(errs[p.url()]=errs[p.url()]||[]).push(m.text());}});
p.on('pageerror',e=>{(errs[p.url()]=errs[p.url()]||[]).push('PE '+e.message);});
let ok=0;
for(const r of routes){await p.goto('http://localhost:5174'+r,{waitUntil:'networkidle'}).catch(()=>{});await pause(450);ok++;}
await b.close();
console.log('routes visited:',ok,'/',routes.length);
console.log('routes with console errors:',Object.keys(errs).length);
console.log(JSON.stringify(errs,null,1));
