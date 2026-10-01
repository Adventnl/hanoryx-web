import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const chrome = [process.env.CHROME_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((file) => file && existsSync(file));
if (!chrome) throw new Error('Set CHROME_PATH to an installed Chromium browser.');
const base = process.env.QA_BASE || 'http://127.0.0.1:5174';
const out = resolve('qa/review');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chrome, headless: true });

async function context(width, height = 900) {
  const browserContext = await browser.newContext({ viewport: { width, height } });
  await browserContext.addInitScript(() => { sessionStorage.setItem('hnx.boot.complete', '1'); });
  return browserContext;
}

const desktop = await context(1440);
const page = await desktop.newPage();
for (const [path, name] of [['/', 'home'], ['/projects', 'projects'], ['/projects/hanoryx-web', 'project-detail'], ['/engineering', 'engineering'], ['/lab', 'lab'], ['/systems/research-systems', 'research-systems'], ['/north/tooling', 'north-tooling'], ['/work/north-console', 'console-study'], ['/company/security', 'security-approach'], ['/company', 'company'], ['/contact', 'contact'], ['/missing-page', '404']]) {
  await page.goto(base + path, { waitUntil: 'domcontentloaded' });
  await page.locator('main h1').first().waitFor();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: resolve(out, `${name}-desktop-settled.png`) });
  if (['/projects', '/projects/hanoryx-web', '/engineering', '/lab'].includes(path)) {
    await page.evaluate(() => scrollTo(0, innerHeight * 0.95));
    await page.waitForTimeout(500);
    await page.screenshot({ path: resolve(out, `${name}-content-desktop.png`) });
  }
  if (path === '/projects' || path === '/projects/hanoryx-web') {
    if (path === '/projects/hanoryx-web') {
      await page.getByRole('region', { name: 'Inside the root.' }).scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: resolve(out, 'project-detail-tree-desktop.png') });
    }
    await page.getByRole('list', { name: 'Connected repositories' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await page.screenshot({ path: resolve(out, `${name}-graph-desktop.png`) });
  }
  if (path === '/engineering') {
    await page.getByRole('group', { name: 'Site architecture layers' }).getByRole('button', { name: /Runtime/ }).click();
    await page.getByRole('link', { name: 'Frame scheduler' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await page.screenshot({ path: resolve(out, 'engineering-architecture-desktop.png') });
  }
  if (path === '/') {
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.48));
    await page.waitForTimeout(600);
    await page.screenshot({ path: resolve(out, 'home-middle-desktop.png') });
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    await page.screenshot({ path: resolve(out, 'home-end-desktop.png') });
  }
}
await page.keyboard.press('Control+k');
await page.waitForTimeout(150);
await page.screenshot({ path: resolve(out, 'command-palette-desktop.png') });
await page.keyboard.press('Escape');
await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Systems/ }).first().hover();
await page.waitForTimeout(350);
await page.screenshot({ path: resolve(out, 'mega-menu-desktop.png') });
await desktop.close();

const mobile = await context(390, 844);
const mobilePage = await mobile.newPage();
for (const [path, name] of [['/', 'home'], ['/projects', 'projects'], ['/projects/hanoryx-web', 'project-detail'], ['/engineering', 'engineering'], ['/lab', 'lab'], ['/systems/research-systems', 'research-systems'], ['/work/north-console', 'console-study']]) {
  await mobilePage.goto(base + path, { waitUntil: 'domcontentloaded' });
  await mobilePage.locator('main h1').first().waitFor();
  await mobilePage.waitForTimeout(1300);
  await mobilePage.screenshot({ path: resolve(out, `${name}-mobile-settled.png`) });
  if (path === '/projects' || path === '/lab') {
    await mobilePage.evaluate(() => scrollTo(0, innerHeight * 0.95));
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: resolve(out, `${name}-content-mobile.png`) });
  }
  if (path === '/projects' || path === '/projects/hanoryx-web') {
    if (path === '/projects/hanoryx-web') {
      await mobilePage.getByRole('region', { name: 'Inside the root.' }).scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(300);
      await mobilePage.screenshot({ path: resolve(out, 'project-detail-tree-mobile.png') });
    }
    await mobilePage.getByRole('list', { name: 'Connected repositories' }).scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(350);
    await mobilePage.screenshot({ path: resolve(out, `${name}-graph-mobile.png`) });
  }
  if (path === '/engineering') {
    await mobilePage.getByRole('group', { name: 'Site architecture layers' }).scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(250);
    await mobilePage.screenshot({ path: resolve(out, 'engineering-architecture-top-mobile.png') });
    await mobilePage.getByRole('group', { name: 'Site architecture layers' }).getByRole('button', { name: /Runtime/ }).click();
    await mobilePage.getByRole('link', { name: 'Frame scheduler' }).scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(350);
    await mobilePage.screenshot({ path: resolve(out, 'engineering-architecture-mobile.png') });
  }
}
await mobilePage.goto(base + '/', { waitUntil: 'domcontentloaded' });
await mobilePage.waitForTimeout(800);
await mobilePage.getByRole('button', { name: 'Open menu' }).click();
await mobilePage.waitForTimeout(350);
await mobilePage.screenshot({ path: resolve(out, 'mobile-nav-open.png') });
await mobile.close();
await browser.close();
console.log('Saved settled desktop and mobile review screenshots to qa/review');
