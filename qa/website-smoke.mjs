import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { templateRouteKeys } from '../src/app/routeConfig.js';
import snapshot from '../src/data/github.generated.json' with { type: 'json' };

const base = process.env.QA_BASE || 'http://127.0.0.1:5174';
const chrome = [process.env.CHROME_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((file) => file && existsSync(file));
if (!chrome) throw new Error('Set CHROME_PATH to an installed Chromium browser.');
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const routes = ['/', ...templateRouteKeys.map((key) => `/${key}`), '/timeline', '/contact', '/engineering', '/lab', '/projects', ...snapshot.repositories.map((repo) => `/projects/${repo.id}`), '/missing-page'];
const knownRoutes = new Set(routes.filter((route) => route !== '/missing-page'));
const failures = [];
const titles = new Map();
const screenshots = resolve('qa/review');
mkdirSync(screenshots, { recursive: true });

for (const width of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference' });
  await context.addInitScript(() => { sessionStorage.setItem('hnx.boot.complete', '1'); });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  for (const route of routes) {
    errors.length = 0;
    const response = await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await page.locator('main h1').first().waitFor({ timeout: 10000 }).catch(() => {});
    const state = await page.evaluate(() => ({ title: document.title, heading: document.querySelector('main h1')?.textContent?.trim(), overflow: document.documentElement.scrollWidth - innerWidth }));
    if (!response?.ok() || !state.heading || state.heading === 'Signal Fault' || state.overflow > 2 || errors.length) failures.push({ width, route, status: response?.status(), ...state, errors: [...errors] });
    if (width === 1440) {
      if (titles.has(state.title)) failures.push({ width, route, duplicateTitleWith: titles.get(state.title), title: state.title });
      else titles.set(state.title, route);
      const localLinks = await page.locator('a[href^="/"]').evaluateAll((anchors) => anchors.map((anchor) => new URL(anchor.href).pathname));
      for (const destination of localLinks) if (!knownRoutes.has(destination)) failures.push({ width, route, brokenLink: destination });
    }
    if ((width === 390 || width === 1440) && ['/', '/projects', '/projects/hanoryx-web', '/engineering', '/lab', '/contact', '/missing-page'].includes(route)) {
      const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
      await page.screenshot({ path: resolve(screenshots, `${slug}-${width}.png`), fullPage: false });
    }
  }
  if (width === 1440) {
    await page.goto(base + '/projects', { waitUntil: 'domcontentloaded' });
    await page.getByRole('searchbox', { name: 'Search projects' }).fill('engine');
    const resultText = await page.getByRole('status').first().textContent();
    if (!resultText || resultText.startsWith('0 public')) failures.push({ test: 'project search', resultText });
    await page.keyboard.press('Control+k');
    if (!(await page.getByRole('dialog', { name: 'Search Hanoryx Systems' }).isVisible())) failures.push({ test: 'command palette open' });
    await page.keyboard.press('Escape');
    if (await page.getByRole('dialog', { name: 'Search Hanoryx Systems' }).isVisible()) failures.push({ test: 'command palette escape' });
  }
  await context.close();
}
await browser.close();
console.log(`Visited ${routes.length} routes at 10 widths. Failures: ${failures.length}`);
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
