/* Controls — operate every control on every page and expect nothing to break.
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/controls.mjs [/route ...] [--phone]
 *
 * For each page the script scrolls through it (so every lazy section mounts), then works
 * through the controls inside <main> — buttons, tabs, switches, radios, checkboxes, ranges,
 * selects, text fields — one at a time, the way a person would: click, tick, drag a slider to
 * both ends and the middle, choose the next option, type and clear (see operate.mjs). After
 * each one it checks that nothing threw, no "signal fault" panel replaced the page, and the
 * page did not grow sideways. A control that navigates is followed, and the page is reloaded
 * to carry on. Links are left alone: the smoke test follows those.
 *
 * It is deliberately blunt. The tidy walkthrough a person gives a page finds what is
 * on the screen; this finds the crash behind the third option of the fourth control.
 *
 *   MAX_CONTROLS=60  the most controls operated per page
 */
import { BASE, launch, newContext, pageRoutes, pause, reporter, scrollThrough, watchErrors } from './lib.mjs';
import { operate } from './operate.mjs';

const args = process.argv.slice(2);
const phone = args.includes('--phone');
const only = args.filter((a) => a.startsWith('/'));
const routes = only.length ? only : pageRoutes;
const MAX = Number(process.env.MAX_CONTROLS || 60);
const r = reporter(`controls (${phone ? 'phone' : 'desktop'})`);

const browser = await launch();
const context = await newContext(browser, phone ? { width: 390, height: 844, mobile: true } : { width: 1440, height: 900 });
await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
const page = await context.newPage();
const errors = watchErrors(page);
const path = () => new URL(page.url()).pathname;
let operated = 0;
let skipped = 0;

for (const route of routes) {
  const load = async () => {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await page.locator('main h1, main h2').first().waitFor({ timeout: 10000 }).catch(() => {});
    await pause(600);
    await scrollThrough(page, { step: 700, wait: 60 });
  };
  errors.length = 0;
  await load();
  const here = () => path();
  here.expected = route;
  const result = await operate(page, errors, { scope: 'main', max: MAX, path: here, reload: load });
  operated += result.operated;
  skipped += result.skipped;
  r.check(`${route}  (${result.operated} controls)`, result.problems.length === 0, result.problems.join(' ; '));
}

console.log(`\n${operated} controls operated, ${skipped} skipped (hidden, covered or in the page chrome)`);
await browser.close();
r.done();
