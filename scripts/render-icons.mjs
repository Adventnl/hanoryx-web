/* Renders the favicon set from public/favicon.svg — the company mark, the same
   artwork as the navbar logo (src/assets/HS.jpg). Needs a Chromium browser:
   set CHROME_PATH if it is not in a standard location.

     node scripts/render-icons.mjs

   Writes public/favicon-32.png, public/favicon.ico (16/32/48),
   public/apple-touch-icon.png (180, square corners — iOS rounds them itself)
   and public/icon-512.png. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { chromium } from 'playwright-core';

const chrome = [
  process.env.CHROME_PATH,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((file) => file && existsSync(file));
if (!chrome) throw new Error('Set CHROME_PATH to an installed Chromium browser.');

const svg = readFileSync('public/favicon.svg', 'utf8');
const square = svg.replace(' rx="120"', '');
const toDataUrl = (markup) => `data:image/svg+xml;base64,${Buffer.from(markup).toString('base64')}`;

const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
async function render(markup, size) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(`<style>html,body{margin:0;background:transparent}img{display:block;width:${size}px;height:${size}px}</style><img alt="" src="${toDataUrl(markup)}">`);
  await page.locator('img').evaluate((img) => img.decode());
  const png = await page.screenshot({ omitBackground: true, type: 'png' });
  await page.close();
  return png;
}

/* PNG-in-ICO: a 6-byte header, one 16-byte entry per image, then the PNG files. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

try {
  const sizes = [16, 32, 48];
  const rendered = await Promise.all(sizes.map(async (size) => ({ size, png: await render(svg, size) })));
  writeFileSync('public/favicon-32.png', rendered.find((r) => r.size === 32).png);
  writeFileSync('public/favicon.ico', ico(rendered));
  writeFileSync('public/apple-touch-icon.png', await render(square, 180));
  writeFileSync('public/icon-512.png', await render(svg, 512));
  console.log('Rendered favicon-32.png, favicon.ico, apple-touch-icon.png and icon-512.png from public/favicon.svg');
} finally {
  await browser.close();
}
