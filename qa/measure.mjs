import { chromium } from 'playwright-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
const measure = async (page, ms=2000) => page.evaluate((ms)=>new Promise(res=>{
  let n=0; let last=performance.now(); let min=999; const t0=last;
  function tick(now){ n++; const d=now-last; if(d>0){const f=1000/d; if(f<min)min=f;} last=now; if(now-t0<ms) requestAnimationFrame(tick); else res({fps:Math.round(n/((now-t0)/1000)), minFps:Math.round(min)}); }
  requestAnimationFrame(tick);
}), ms);
const b=await chromium.launch({executablePath:CHROME,headless:true});
const c=await b.newContext({viewport:{width:1440,height:900}});
await c.addInitScript(()=>{try{sessionStorage.setItem('hnx.boot.complete','1')}catch{}});
const p=await c.newPage();
for(const [r,name] of [['/','home'],['/systems','systems'],['/work/musebase','musebase']]){
  await p.goto('http://localhost:5174'+r,{waitUntil:'networkidle'}); await pause(800);
  const top = await measure(p, 2000);
  await p.evaluate(()=>window.scrollTo({top:document.body.scrollHeight*0.4}));
  await pause(400);
  const mid = await measure(p, 2000);
  console.log(name.padEnd(10), 'top:', JSON.stringify(top), ' mid-scroll:', JSON.stringify(mid));
}
await b.close();
