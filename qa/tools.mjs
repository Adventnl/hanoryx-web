/* Tools — the browser tools, the downloads and the search do what they say.
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/tools.mjs
 *
 *   contrast    black on white is 21 : 1; a grey that fails says so and offers a colour that passes
 *   type scale  the CSS follows the base and the ratio
 *   cron        a schedule is read back in English, eight next runs, an error for nonsense
 *   readiness   answering the questions fills in the result, and the checklist downloads
 *   decision    the record downloads as Markdown named after its title
 *   glossary    every term is listed; the search narrows them
 *   downloads   every file on the shelf is built, named as promised, and not empty; the
 *               page list names every page; the JSON parses
 *   search      a distinctive word from each new section finds that section's page
 *   changelog   every chapter of the release notes is on the page
 */
import fs from 'node:fs';
import { register } from 'node:module';
import { BASE, launch, newContext, pause, reporter, watchErrors } from './lib.mjs';
import { pageRouteKeys, routePath } from '../src/app/routeConfig.js';

register('./ext-loader.mjs', import.meta.url);
const { downloads } = await import('../src/data/resources.js');
const { glossary } = await import('../src/data/glossary.js');
const { releases } = await import('../src/data/releases.js');

const r = reporter('tools');
const real = (errors) => errors.filter((e) => !/CERT|net::ERR|Failed to load resource/i.test(e));
const browser = await launch();
const context = await newContext(browser, { width: 1440, height: 900 });
await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
const page = await context.newPage();
const errors = watchErrors(page);
const open = async (route) => {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  await page.locator('main h1').first().waitFor({ timeout: 10000 }).catch(() => {});
  await pause(1500);
};
const text = (selector) => page.locator(selector).first().innerText();

/* ---------------------------- contrast ---------------------------- */
await open('/resources/tools/contrast');
{
  const fg = page.getByLabel('Text colour as hex', { exact: true });
  const bg = page.getByLabel('Background as hex', { exact: true });
  await fg.fill('#000');
  await bg.fill('#fff');
  r.check('contrast: black on white is 21 : 1', /^21\.00/.test(await text('main p[aria-live="polite"]')), await text('main p[aria-live="polite"]'));
  await fg.fill('#777');
  await pause(200);
  const verdicts = await text('[data-fx="contrast.verdicts"]');
  r.check('contrast: #777 on white is 4.48 : 1 and fails body text AA', /^4\.48/.test(await text('main p[aria-live="polite"]')) && /Fails at 4\.5/.test(verdicts) && /Passes at 3/.test(verdicts));
  await page.locator('[data-fx="contrast.nearest"]').getByRole('button', { name: 'Use it' }).first().click();
  await pause(200);
  const after = parseFloat(await text('main p[aria-live="polite"]'));
  r.check('contrast: “Use it” moves to a colour that passes', after >= 4.5, `${after} : 1`);
  await fg.fill('banana');
  r.check('contrast: nonsense gets a plain message, not a crash', await page.locator('main [role="alert"]').first().isVisible());
}

/* ---------------------------- type scale ---------------------------- */
await open('/resources/tools/type-scale');
{
  const css = () => text('pre code');
  r.check('type scale: base 16 at a major third gives 1.25rem for +1', (await css()).includes('--step-1: 1.25rem; /* 20.0px */'), (await css()).split('\n').slice(0, 4).join(' '));
  await page.locator('main select').first().selectOption('1.5');
  await pause(200);
  r.check('type scale: a perfect fifth gives 1.5rem for +1', (await css()).includes('--step-1: 1.5rem; /* 24.0px */'));
  const items = await page.locator('ol[aria-label="The scale, set in type"] li').count();
  r.check('type scale: every step is set in type', items === 8, `${items} steps`);
}

/* ---------------------------- cron ---------------------------- */
await open('/resources/tools/cron');
{
  const expr = page.getByRole('textbox', { name: /^A schedule/ });
  await expr.fill('*/5 * * * *');
  await pause(200);
  r.check('cron: */5 * * * * reads as every five minutes', /every 5 minutes/i.test(await text('[data-fx="cron.sentence"]')), await text('[data-fx="cron.sentence"]'));
  r.check('cron: eight next runs are listed', (await page.locator('[data-fx="cron.next-runs"] ol li').count()) === 8);
  await page.getByRole('button', { name: 'Every night at 02:15' }).click();
  r.check('cron: a preset fills the box and is read back', (await expr.inputValue()) === '15 2 * * *' && /2:15|02:15/.test(await text('[data-fx="cron.sentence"]')), await text('[data-fx="cron.sentence"]'));
  await page.getByRole('button', { name: 'UTC', exact: true }).click();
  r.check('cron: the time-zone toggle relabels the runs', /UTC/.test(await text('[data-fx="cron.next-runs"]')));
  await expr.fill('61 * * * *');
  await pause(200);
  r.check('cron: an impossible minute is reported', await page.locator('main [role="alert"]').first().isVisible());
  await expr.fill('@weekly');
  await pause(200);
  r.check('cron: @weekly is understood', /sunday|week/i.test(await text('[data-fx="cron.sentence"]')), await text('[data-fx="cron.sentence"]'));
}

/* ---------------------------- readiness check ---------------------------- */
await open('/resources/tools/readiness');
{
  const groups = page.locator('main [role="radiogroup"]');
  const total = await groups.count();
  r.check('readiness: twenty questions', total === 20, `${total} questions`);
  for (let i = 0; i < 6; i += 1) await groups.nth(i).getByRole('radio').first().click();
  await pause(300);
  const early = await text('main [role="status"]');
  r.check('readiness: six answers out of twenty give no verdict yet', /keep going/i.test(early), early.replace(/\s+/g, ' ').slice(0, 100));
  for (let i = 6; i < total; i += 1) await groups.nth(i).getByRole('radio').first().click();
  await pause(300);
  const status = await text('main [role="status"]');
  r.check('readiness: all twenty answered Yes gives the top band', /close to ready/i.test(status) && !/so far|keep going/i.test(status), status.replace(/\s+/g, ' ').slice(0, 100));
  await groups.nth(0).getByRole('radio').nth(2).click();
  await pause(300);
  r.check('readiness: a No is listed first under “To do first”', /to do first/i.test(await text('main aside')));
  const [file] = await Promise.all([page.waitForEvent('download', { timeout: 6000 }), page.getByRole('button', { name: /Download/ }).first().click()]);
  const body = fs.readFileSync(await file.path(), 'utf8');
  r.check('readiness: the checklist downloads as Markdown', file.suggestedFilename() === 'readiness-check.md' && body.length > 200 && body.startsWith('#'), `${file.suggestedFilename()} ${body.length} bytes`);
}

/* ---------------------------- decision record ---------------------------- */
await open('/resources/tools/decision-record');
{
  await page.getByRole('textbox', { name: /^Title/ }).fill('Use a queue for outgoing email');
  await page.getByRole('textbox', { name: /^Decision/ }).fill('We will send email from a queue.');
  const [file] = await Promise.all([page.waitForEvent('download', { timeout: 6000 }), page.getByRole('button', { name: 'Download' }).first().click()]);
  const body = fs.readFileSync(await file.path(), 'utf8');
  r.check('decision record: downloads as Markdown named after the title', file.suggestedFilename() === 'use-a-queue-for-outgoing-email.md' && body.includes('Use a queue for outgoing email') && body.includes('We will send email from a queue.'), `${file.suggestedFilename()}`);
}

/* ---------------------------- glossary ---------------------------- */
await open('/resources/glossary');
{
  const terms = () => page.locator('main button[aria-label^="Copy a link to "]').count();
  r.check(`glossary: all ${glossary.length} terms are listed`, (await terms()) === glossary.length, `${await terms()}`);
  await page.getByPlaceholder('Search terms and meanings…').fill('idempot');
  await pause(300);
  const some = await terms();
  r.check('glossary: the search narrows the list', some >= 1 && some < 12, `${some} terms`);
  r.check('glossary: and finds idempotency', (await page.locator('main').innerText()).toLowerCase().includes('idempoten'));
  await page.getByPlaceholder('Search terms and meanings…').fill('qqqzzz');
  await pause(300);
  r.check('glossary: nothing matching says so', (await terms()) === 0);
}

/* ---------------------------- downloads ---------------------------- */
await open('/resources/downloads');
{
  const bad = [];
  for (const d of downloads) {
    const card = page.locator('li', { hasText: d.title }).filter({ has: page.getByRole('button', { name: /Download/ }) }).first();
    try {
      await card.scrollIntoViewIfNeeded({ timeout: 3000 });
      const [file] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), card.getByRole('button', { name: /Download/ }).click()]);
      const body = fs.readFileSync(await file.path(), 'utf8');
      if (file.suggestedFilename() !== d.file) bad.push(`${d.id}: named ${file.suggestedFilename()}, promised ${d.file}`);
      else if (body.length < (d.file.endsWith('.csv') ? 60 : 120)) bad.push(`${d.id}: only ${body.length} bytes`);
      else if (d.file.endsWith('.json')) JSON.parse(body);
      else if (d.file.endsWith('.csv') && body.split('\n')[0].split(',').length < 4) bad.push(`${d.id}: the header row has fewer than four columns`);
      if (d.id === 'pages') {
        const missing = pageRouteKeys.map(routePath).filter((p) => !body.includes(p));
        if (missing.length) bad.push(`pages: ${missing.length} pages missing from the list (${missing.slice(0, 3).join(', ')})`);
      }
      if (d.id === 'glossary' && !body.includes(glossary[0].term)) bad.push('glossary: first term missing');
    } catch (error) {
      bad.push(`${d.id}: ${String(error.message).split('\n')[0].slice(0, 90)}`);
    }
  }
  r.check(`downloads: all ${downloads.length} files build, are named as promised and are not empty`, bad.length === 0, bad.slice(0, 3).join(' ; '));
}

/* ---------------------------- changelog ---------------------------- */
await open('/resources/changelog');
{
  const body = await text('main');
  const missing = releases.filter((c) => !body.includes(c.title));
  r.check(`changelog: all ${releases.length} chapters are on the page`, missing.length === 0, missing.map((c) => c.title).join(', '));
}

/* ---------------------------- search finds the new sections ---------------------------- */
await open('/');
{
  const asks = [
    ['webhooks', '/systems/integrations'],
    ['idempotency', '/insights/idempotency'],
    ['cookies', '/legal/cookies'],
    ['vulnerability', '/trust/disclosure'],
    ['cron', '/resources/tools/cron'],
    ['type scale', '/resources/tools/type-scale'],
    ['hiring process', '/company/hiring'],
    ['glossary', '/resources/glossary'],
    ['lifecycle', '/systems/lifecycle'],
    ['case study', '/work/how-to-read'],
    ['design tokens', '/north/design-tokens'],
    ['retention', '/legal/retention'],
    ['capabilities', '/systems/capabilities'],
    ['licences', '/trust/licences'],
    ['press', '/company/press'],
    ['readiness', '/resources/tools/readiness'],
  ];
  const dialog = page.getByRole('dialog', { name: 'Search Hanoryx Systems' });
  const missed = [];
  for (const [query, want] of asks) {
    await page.keyboard.press('Control+k');
    await dialog.waitFor({ timeout: 4000 });
    await dialog.getByRole('combobox').fill(query);
    await pause(450);
    const paths = await dialog.locator('[class*="rowPath"]').allInnerTexts();
    if (!paths.slice(0, 5).includes(want)) missed.push(`“${query}” → ${paths.slice(0, 3).join(', ') || 'nothing'} (wanted ${want})`);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    await pause(150);
  }
  r.check(`search: a distinctive word finds each new section's page in the top five (${asks.length} tried)`, missed.length === 0, missed.slice(0, 3).join(' ; '));
}

r.check('no errors from any of the tools', real(errors).length === 0, real(errors).slice(0, 3).join(' | '));
await browser.close();
r.done();
