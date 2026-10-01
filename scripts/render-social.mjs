import { readFileSync, existsSync } from 'node:fs';
import { chromium } from 'playwright-core';

const chrome = [process.env.CHROME_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((file) => file && existsSync(file));
if (!chrome) throw new Error('Set CHROME_PATH to an installed Chromium browser.');
const source = readFileSync('public/og-image.svg').toString('base64');
const browser = await chromium.launch({ executablePath: chrome, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<style>html,body{margin:0;background:#020203}img{display:block;width:1200px;height:630px}</style><img alt="" src="data:image/svg+xml;base64,${source}">`);
  await page.locator('img').evaluate((img) => img.decode());
  await page.screenshot({ path: 'public/og-image.png' });
  console.log('Rendered public/og-image.png at 1200×630');
} finally {
  await browser.close();
}
