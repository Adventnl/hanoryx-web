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
 *   node qa/foreground-inventory.mjs --markdown a Markdown report (FOREGROUND-DETAILS.md)
 *   node qa/foreground-inventory.mjs --json     machine-readable
 *   FLOOR=4 node qa/foreground-inventory.mjs    change the per-page minimum
 */
import { BASE, launch, newContext, pageRoutes, pause, scrollThrough, watchErrors } from './lib.mjs';

const FLOOR = Number(process.env.FLOOR || 4);
const asJson = process.argv.includes('--json');
const listIds = process.argv.includes('--ids');
const asMarkdown = process.argv.includes('--markdown');

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

/* things that only exist while open, travelling or playing: the mega menu, the
   search, the shortcuts panel, blueprint mode, the route line and the intro */
const globalIds = new Set();
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await pause(1500);
const collect = async (target = page) => (await target.evaluate(visibleMarkers)).forEach((m) => { if (!all.has(m)) globalIds.add(m); });
await page.mouse.move(640, 420);
await pause(400);
await collect();
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
await page.keyboard.press('b');
await pause(900);
await collect();
await page.keyboard.press('b');
await pause(300);
await page.evaluate(() => document.querySelector('footer a[href="/systems"]')?.click());
await pause(250);
await collect();
await pause(900);

const intro = await (await newContext(browser, { width: 1440, height: 900, boot: 'play' })).newPage();
await intro.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await pause(1500);
await collect(intro);
await intro.locator('[data-fx="boot.start-button"]').click({ timeout: 4000 }).catch(() => {});
await pause(1800);
await collect(intro);

for (const id of globalIds) all.set(id, ['(global)']);
await browser.close();

const distinct = all.size;
const shared = [...all.values()].filter((routes) => routes.length > 1).length;
const low = perRoute.filter((r) => r.count < FLOOR);

if (asMarkdown) {
  const total = perRoute.reduce((n, r) => n + r.count, 0);
  const shared = [...all.entries()].filter(([, routes]) => routes.length > 5 || routes[0] === '(global)');
  const sharedIds = new Set(shared.map(([id]) => id));
  const group = (ids) => {
    const byArea = new Map();
    ids.forEach((id) => byArea.set(id.split('.')[0], [...(byArea.get(id.split('.')[0]) || []), id]));
    return [...byArea.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([area, list]) => `- **${area}** — ${list.map((id) => `\`${id.slice(area.length + 1)}\``).join(' ')}`).join('\n');
  };
  const lines = [
    '# Foreground details',
    '',
    '*Generated by `node qa/foreground-inventory.mjs --markdown`. Do not edit by hand.*',
    '',
    `Every deliberate foreground detail is marked in the DOM with \`data-fx="area.name"\` (press **B** on any page to see them outlined and named). This list is what actually rendered, on screen, when the script visited each page at 1440 px and scrolled it: **${distinct} distinct marked details**, **${total} details across ${perRoute.length} pages** (each page's own list, summed — shared chrome counts on every page it appears on).`,
    '',
    `## Shared — on most pages, or only while open (${shared.length})`,
    '',
    group(shared.map(([id]) => id).sort()),
    '',
    '## By page',
    '',
  ];
  perRoute.forEach((r) => {
    const own = r.markers.filter((id) => !sharedIds.has(id));
    lines.push(`### \`${r.route}\` — ${r.count} on screen, ${own.length} particular to it or a few pages`, '', own.length ? group(own) : '*Only the shared chrome and blocks.*', '');
  });
  console.log(lines.join('\n'));
} else if (asJson) {
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
