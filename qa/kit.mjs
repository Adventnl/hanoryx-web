/* Kit — every component in the interface kit, opened, read and operated.
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/kit.mjs [--phone] [family ...]
 *
 * For each component in data/kit.js the script opens its gallery page (the first one
 * through a deep link, the rest by pressing their name in the list), and checks that
 *   - the gallery shows that component, with its summary, and a live example
 *   - the Usage, Props, Keyboard and Notes tabs each carry what the catalogue says
 *     (the code, one row per prop, one entry per key, one item per note)
 *   - every control inside the live example can be operated without an error,
 *     a fault panel or the page growing sideways
 * Run with --phone to repeat it on a phone viewport.
 */
import { register } from 'node:module';
import { BASE, launch, newContext, pause, reporter, watchErrors } from './lib.mjs';
import { operate } from './operate.mjs';

register('./ext-loader.mjs', import.meta.url);
const { kit, kitFamilies } = await import('../src/data/kit.js');

const args = process.argv.slice(2);
const phone = args.includes('--phone');
const only = args.filter((a) => !a.startsWith('--'));
const families = kitFamilies.filter((f) => !only.length || only.includes(f.id));
const r = reporter(`interface kit (${phone ? 'phone' : 'desktop'})`);

const browser = await launch();
const context = await newContext(browser, phone ? { width: 390, height: 844, mobile: true } : { width: 1440, height: 900 });
await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
const page = await context.newPage();
const errors = watchErrors(page);
const real = (list) => list.filter((e) => !/CERT|net::ERR|Failed to load resource|ERR_/i.test(e));
let controls = 0;

for (const family of families) {
  const items = kit.filter((k) => k.family === family.id);
  const bad = [];
  errors.length = 0;
  await page.goto(`${BASE}${family.to}#${items[0].id}`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-fx="gallery.stage"]').waitFor({ timeout: 15000 });
  await pause(1200);

  for (const [index, item] of items.entries()) {
    errors.length = 0;
    if (index > 0) {
      await page.locator('[data-fx="gallery.list"]').getByRole('button', { name: item.name, exact: true }).click();
      await pause(500);
    }
    const stage = page.locator('[data-fx="gallery.stage"]');
    const heading = (await stage.locator('h3').first().innerText()).trim();
    if (!heading.startsWith(item.name)) { bad.push(`${item.name}: the gallery shows “${heading}”`); continue; }
    if (!(await stage.innerText()).includes(item.summary.slice(0, 40))) bad.push(`${item.name}: summary missing`);

    // the live example has arrived (not still loading) and has something in it
    await page.locator('[data-fx="gallery.preview"] [role="status"]:has-text("Loading the example")').waitFor({ state: 'detached', timeout: 8000 }).catch(() => {});
    const empty = await page.locator('[data-fx="gallery.preview"]').evaluate((el) => !el.innerText.trim() && !el.querySelector('svg, img, input, button'));
    if (empty) bad.push(`${item.name}: the example is empty`);

    // the four tabs say what the catalogue says
    const tabs = stage.getByRole('tab');
    const panel = stage.locator('[role="tabpanel"]:not([hidden])');
    await tabs.filter({ hasText: 'Usage' }).click();
    if (!(await panel.locator('pre code').first().innerText()).includes(item.code.split('\n').pop().slice(0, 12))) bad.push(`${item.name}: usage tab does not show the code`);
    await tabs.filter({ hasText: 'Props' }).click();
    const propRows = await panel.locator('tbody tr').count();
    if (propRows !== item.props.length) bad.push(`${item.name}: ${propRows} prop rows, ${item.props.length} expected`);
    await tabs.filter({ hasText: 'Keyboard' }).click();
    const keyRows = await panel.locator('dl > div').count();
    if (keyRows !== item.keys.length) bad.push(`${item.name}: ${keyRows} key entries, ${item.keys.length} expected`);
    await tabs.filter({ hasText: 'Notes' }).click();
    const noteRows = await panel.locator('li').count();
    if (noteRows !== item.notes.length) bad.push(`${item.name}: ${noteRows} notes, ${item.notes.length} expected`);

    // operate the live example
    const result = await operate(page, errors, { scope: '[data-fx="gallery.preview"]', max: 40 });
    controls += result.operated;
    result.problems.forEach((p) => bad.push(`${item.name}: ${p}`));
    const stray = real(errors);
    if (stray.length) bad.push(`${item.name}: ${stray[0].slice(0, 120)}`);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 2) bad.push(`${item.name}: page ${overflow}px too wide`);
  }
  r.check(`${family.name}: all ${items.length} components`, bad.length === 0, bad.slice(0, 4).join(' ; '));
}

console.log(`\n${controls} controls operated in the live examples`);
await browser.close();
r.done();
