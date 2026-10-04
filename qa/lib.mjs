/* Shared helpers for the browser checks. Point QA_BASE at a running site
   (`npm run dev` -> http://127.0.0.1:5173, or `npm run preview`), and set
   CHROME_PATH if no Chromium is in a standard place. */
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { pageRouteKeys, redirects, routePath } from '../src/app/routeConfig.js';

export const BASE = process.env.QA_BASE || 'http://127.0.0.1:5173';
export const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

export async function launch() {
  const executablePath = CANDIDATES.find((file) => file && existsSync(file));
  if (!executablePath) throw new Error('Set CHROME_PATH to an installed Chromium browser.');
  return chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required', '--ignore-certificate-errors'],
  });
}

/** A browser context. `boot: 'skip'` marks the intro as already played. */
export async function newContext(browser, { width = 1440, height = 900, mobile = false, reduced = false, boot = 'skip' } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  if (boot === 'skip') {
    await context.addInitScript(() => { try { sessionStorage.setItem('hnx.boot.complete', '1'); } catch { /* ignore */ } });
  }
  return context;
}

export function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console.error: ${message.text()}`); });
  return errors;
}

/** Every route that renders a page, as URL paths. */
export const pageRoutes = pageRouteKeys.map(routePath);
export const redirectRoutes = redirects;

/** Scroll the page top to bottom in steps so lazy sections and observers fire. */
export async function scrollThrough(page, { step = 520, wait = 110 } = {}) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewport = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < height - viewport; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await pause(wait);
  }
  await pause(400);
}

export function reporter(title) {
  const results = [];
  return {
    check(name, ok, detail = '') {
      results.push({ name, ok: Boolean(ok), detail });
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
    },
    done() {
      const failed = results.filter((r) => !r.ok);
      console.log(`\n${title}: ${results.length - failed.length}/${results.length} passed`);
      if (failed.length) process.exitCode = 1;
      return failed.length === 0;
    },
  };
}
