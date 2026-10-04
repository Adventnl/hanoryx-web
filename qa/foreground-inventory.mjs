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
 * Only markers that are actually on screen count: an element that is hidden
 * (display:none, visibility:hidden, no box) is ignored, so a desktop run does
 * not count the mobile burger. Overlays that only exist while open — the mega
 * menu, the command search, the shortcuts panel — are counted separately under
 * "global", by opening each one.
 *
 *   node qa/foreground-inventory.mjs            table + totals
 *   node qa/foreground-inventory.mjs --ids      also list every id by route
 *   node qa/foreground-inventory.mjs --json     machine-readable
 *   FLOOR=4 node qa/foreground-inventory.mjs    change the per-page minimum
 */
import { BASE, launch, newContext, pageRoutes, pause, scrollThrough, watchErrors } from './lib.mjs';

const FLOOR = Number(process.env.FLOOR || 4);
const asJson = process.argv.includes('--json');
const listIds = process.argv.includes('--ids');

/* the ids of every marker that is really rendered right now */
const visibleMarkers = () => Array.from(new Set(
  Array.from(document.querySelectorAll('[data-fx]'))
    .filter((el) => {
      if (!el.getClientRects().length) return false;
      const style = getComputedStyle(el);
      return style.visibility !== 'hidden' && style.display !== 'none';
    })
    .map((el) => el.getAttribute('data-fx'))
)).sort();

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
  const markers = await page.evaluate(visibleMarkers);
  perRoute.push({ route, count: markers.length, markers, errors: [...errors] });
  markers.forEach((m) => all.set(m, [...(all.get(m) || []), route]));
}

/* overlays that only exist while open */
const globalIds = new Set();
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await pause(1500);
const collect = async () => (await page.evaluate(visibleMarkers)).forEach((m) => { if (!all.has(m)) globalIds.add(m); });
const groups = page.locator('header[data-chrome] nav a[aria-haspopup]');
if (await groups.count()) {
  await groups.first().hover();
  await pause(900);
  await collect();
  await page.mouse.move(700, 600);
  await pause(500);
}
await page.keyboard.press('Control+k');
await pause(900);
await collect();
await page.keyboard.press('Escape');
await pause(500);
await page.keyboard.press('?');
await pause(900);
await collect();
await page.keyboard.press('Escape');
await pause(400);
for (const id of globalIds) all.set(id, ['(global)']);
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
  console.log(`(global overlays: ${[...globalIds].sort().join(', ') || 'none'})`);
  console.log(`\n${perRoute.length} routes · ${distinct} distinct marked details (${shared} appear on more than one route) · ${sum} details across the pages (each page's own list, summed)`);
  if (low.length) console.log(`below the floor of ${FLOOR}: ${low.map((r) => r.route).join(', ')}`);
}
if (listIds && !asJson) {
  console.log('\nid -> routes');
  [...all.entries()].sort(([a], [b]) => a.localeCompare(b)).forEach(([id, routes]) => console.log(`${id.padEnd(34)} ${routes.length > 3 ? `${routes.length} routes` : routes.join(' ')}`));
}
if (low.length || perRoute.some((r) => r.errors.length)) process.exitCode = 1;
