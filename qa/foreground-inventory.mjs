/* Foreground inventory.
 *
 * Every deliberate foreground detail on the site — a motion moment, an
 * interaction, a data display, a playful control — is marked in the DOM with
 * data-fx="area.name" (see src/utils/fx.js). This script loads every route at
 * desktop width, scrolls it so lazy sections mount, and counts the DISTINCT
 * markers that actually rendered. It is an honest, repeatable count of what is
 * on each page, and it fails when a page falls below the floor — the guard
 * against a page quietly going back to static text over a background.
 *
 *   node qa/foreground-inventory.mjs            table + totals
 *   node qa/foreground-inventory.mjs --json     machine-readable
 *   FLOOR=4 node qa/foreground-inventory.mjs    change the per-page minimum
 */
import { BASE, launch, newContext, pageRoutes, pause, scrollThrough, watchErrors } from './lib.mjs';

const FLOOR = Number(process.env.FLOOR || 4);
const asJson = process.argv.includes('--json');

const browser = await launch();
const context = await newContext(browser, { width: 1440, height: 900 });
const page = await context.newPage();
const errors = watchErrors(page);

const perRoute = [];
const all = new Map(); // marker -> routes it appears on

for (const route of pageRoutes) {
  errors.length = 0;
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  await pause(1500);
  await scrollThrough(page);
  const markers = await page.evaluate(() => Array.from(new Set(Array.from(document.querySelectorAll('[data-fx]')).map((el) => el.getAttribute('data-fx')))).sort());
  perRoute.push({ route, count: markers.length, markers, errors: [...errors] });
  markers.forEach((m) => all.set(m, [...(all.get(m) || []), route]));
}
await browser.close();

const distinct = all.size;
const shared = [...all.values()].filter((routes) => routes.length > 1).length;
const low = perRoute.filter((r) => r.count < FLOOR);

if (asJson) {
  console.log(JSON.stringify({ routes: perRoute, distinct, floor: FLOOR }, null, 2));
} else {
  const width = Math.max(...perRoute.map((r) => r.route.length)) + 2;
  console.log(`${'route'.padEnd(width)}details`);
  perRoute.forEach((r) => console.log(`${r.route.padEnd(width)}${String(r.count).padStart(3)}${r.count < FLOOR ? '   <- below the floor' : ''}${r.errors.length ? `   (${r.errors.length} console errors)` : ''}`));
  const sum = perRoute.reduce((n, r) => n + r.count, 0);
  console.log(`\n${perRoute.length} routes · ${distinct} distinct marked details (${shared} appear on more than one route) · ${sum} placements in total`);
  if (low.length) console.log(`below the floor of ${FLOOR}: ${low.map((r) => r.route).join(', ')}`);
}
if (low.length || perRoute.some((r) => r.errors.length)) process.exitCode = 1;
