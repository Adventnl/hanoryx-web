/* Showcase — every page of the showcase, on its own terms.
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/showcase.mjs [slug ...] [--phone] [--quick]
 *
 * The showcase is fifty scroll-driven pages of at least forty components each
 * (src/showcase/pages.js). For every page this checks that
 *
 *   - the page file exists, and no page file is missing from the registry;
 *   - it loads with an h1, no console or page errors and no sideways overflow;
 *   - at least MIN_SPECIMENS specimens render, every one with a name, a size and
 *     something inside it, and no two on the page share a name;
 *   - on its stage the scroll drives it: the published --pin number moves as the
 *     page is scrolled, and the specimen at the middle of the screen changes;
 *   - the sheet (?view=sheet) shows every specimen at once;
 *   - on a phone it falls back to the flow stage and still fits the screen;
 *   - the ending is there and names the page.
 *
 * And across the whole showcase: every specimen name is unique ("new components
 * on every page"), the index lists every page, and the menu reaches them all.
 * --quick skips the phone pass. A slug (or several) limits the run to those pages.
 */
import { existsSync, readdirSync } from 'node:fs';
import { BASE, launch, newContext, pause, reporter, watchErrors } from './lib.mjs';
import { MIN_SPECIMENS, chapters, engines, showcasePages, showcasePath } from '../src/showcase/pages.js';

const args = process.argv.slice(2);
const quick = args.includes('--quick');
const only = args.filter((a) => !a.startsWith('--'));
const pages = only.length ? showcasePages.filter((p) => only.includes(p.slug)) : showcasePages;
const r = reporter('showcase');

/* ---- the registry and the files agree ---- */
{
  const dir = new URL('../src/showcase/pages/', import.meta.url);
  const files = new Set(readdirSync(dir).filter((f) => f.endsWith('.jsx')).map((f) => f.replace(/\.jsx$/, '')));
  const slugs = new Set(showcasePages.map((p) => p.slug));
  const unlisted = [...files].filter((f) => !slugs.has(f));
  const missing = showcasePages.filter((p) => !existsSync(new URL(`${p.slug}.jsx`, dir)) || !existsSync(new URL(`${p.slug}.module.css`, dir))).map((p) => p.slug);
  r.check(`the registry lists ${showcasePages.length} pages with unique slugs`, slugs.size === showcasePages.length);
  r.check('every registry entry names a known chapter and stage', showcasePages.every((p) => chapters.some((c) => c.id === p.chapter) && engines[p.engine]));
  r.check('no page file is missing from the registry', unlisted.length === 0, unlisted.join(', '));
  if (!only.length) r.check('every registry entry has its page file and stylesheet', missing.length === 0, missing.join(', '));
}

const browser = await launch();
const names = new Map(); // lower-case specimen name -> first page that has it

async function specimens(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('[data-spec]')).map((el) => {
    const bed = el.querySelector('.sc-bed');
    const box = bed?.getBoundingClientRect();
    return {
      name: el.querySelector('.sc-name')?.textContent?.trim() || '',
      mode: el.querySelector('.sc-mode')?.textContent?.trim() || '',
      w: Math.round(box?.width || 0),
      h: Math.round(box?.height || 0),
      filled: Boolean(bed && bed.querySelector('*') && (bed.innerText.trim() || bed.querySelector('svg, canvas, button, input, i, b, u, s, span, div, ol, ul, p, output, label'))),
      failed: Boolean(el.querySelector('.sc-fail')),
    };
  }));
}

for (const meta of pages) {
  const tag = `${showcasePath(meta.slug)}`;
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  const errors = watchErrors(page);
  const problems = [];

  /* ---- the stage ---- */
  await page.goto(BASE + showcasePath(meta.slug), { waitUntil: 'domcontentloaded' });
  await page.locator('[data-spec]').first().waitFor({ timeout: 20000 }).catch(() => problems.push('no specimens appeared'));
  await pause(1400);
  const info = await page.evaluate(() => ({
    h1: document.querySelector('main h1')?.textContent?.trim() || '',
    title: document.title,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    engine: document.querySelector('section[data-engine]')?.dataset.engine || '',
    frame: document.querySelector('section[data-engine]')?.dataset.frame || '',
    ending: document.querySelector('section[aria-label^="End of"]')?.getAttribute('aria-label') || '',
    endingWords: (document.querySelector('section[aria-label^="End of"]')?.innerText || '').trim().split(/\s+/).length,
  }));
  if (info.h1 !== meta.title) problems.push(`h1 reads "${info.h1}", wanted "${meta.title}"`);
  if (!info.title.startsWith(meta.title)) problems.push(`title is "${info.title}"`);
  if (info.overflow > 2) problems.push(`sideways overflow ${info.overflow}px`);
  if (info.engine !== meta.engine) problems.push(`stage is "${info.engine}", registry says "${meta.engine}"`);
  if (info.frame !== meta.frame) problems.push(`frame is "${info.frame}", registry says "${meta.frame}"`);
  if (info.ending !== `End of ${meta.title}` || info.endingWords < 25) problems.push(`ending: "${info.ending}" (${info.endingWords} words)`);

  const found = await specimens(page);
  if (found.length < MIN_SPECIMENS) problems.push(`only ${found.length} specimens (need ${MIN_SPECIMENS})`);
  const own = new Set();
  for (const s of found) {
    const key = s.name.toLowerCase();
    if (!s.name) problems.push('a specimen has no name');
    else if (own.has(key)) problems.push(`"${s.name}" appears twice on the page`);
    else if (names.has(key)) problems.push(`"${s.name}" is also on ${names.get(key)}`);
    own.add(key);
    if (!names.has(key)) names.set(key, meta.slug);
    if (!s.mode) problems.push(`"${s.name}" has no mode tag`);
    if (s.failed) problems.push(`"${s.name}" failed to draw`);
  }

  /* the scroll drives the stage: --pin moves, and the HUD's index follows */
  const stage = await page.evaluate(() => { const s = document.querySelector('section[data-engine]'); const rect = s.getBoundingClientRect(); return { top: rect.top + scrollY, h: rect.height }; });
  const readPin = () => page.evaluate(() => {
    const el = [...document.querySelectorAll('section[data-engine], section[data-engine] *')].find((e) => e.style && e.style.getPropertyValue('--pin'));
    return el ? Number(el.style.getPropertyValue('--pin')) : null;
  });
  const hud = () => page.evaluate(() => document.querySelector('section[data-engine] [aria-hidden="true"][class*="hud"] span:nth-child(3)')?.textContent?.trim() || '');
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(stage.top + 40));
  await pause(500);
  const pinA = await readPin();
  const hudA = await hud();
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(stage.top + (stage.h - 900) * 0.7));
  await pause(900);
  const pinB = await readPin();
  const hudB = await hud();
  if (pinA === null || pinB === null) problems.push('the stage publishes no --pin');
  else if (!(pinB - pinA > 0.25)) problems.push(`--pin barely moves (${pinA} -> ${pinB})`);
  if (hudA && hudB && hudA === hudB) problems.push(`the readout stays on ${hudA}`);

  /* the page after the stage is the ending: the specimen index buttons are real */
  const chips = await page.locator('section[aria-label^="End of"] ol button').count();
  if (chips !== found.length) problems.push(`the ending lists ${chips} specimens, the stage has ${found.length}`);

  /* ---- the sheet ---- */
  await page.goto(`${BASE}${showcasePath(meta.slug)}?view=sheet`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-spec]').first().waitFor({ timeout: 20000 }).catch(() => {});
  await pause(900);
  const sheet = await specimens(page);
  if (sheet.length !== found.length) problems.push(`the sheet shows ${sheet.length} specimens, the stage ${found.length}`);
  for (const s of sheet) {
    if (s.w < 40 || s.h < 40) problems.push(`"${s.name}" is only ${s.w}×${s.h}`);
    else if (!s.filled) problems.push(`"${s.name}" is empty`);
  }
  const sheetOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (sheetOverflow > 2) problems.push(`the sheet overflows by ${sheetOverflow}px`);

  /* ---- a phone ---- */
  if (!quick) {
    const phone = await newContext(browser, { width: 390, height: 844, mobile: true });
    const p2 = await phone.newPage();
    const e2 = watchErrors(p2);
    await p2.goto(BASE + showcasePath(meta.slug), { waitUntil: 'domcontentloaded' });
    await p2.locator('[data-spec]').first().waitFor({ timeout: 20000 }).catch(() => {});
    await pause(900);
    const ph = await p2.evaluate(() => ({ engine: document.querySelector('section[data-engine]')?.dataset.engine, overflow: document.documentElement.scrollWidth - window.innerWidth, n: document.querySelectorAll('[data-spec]').length }));
    if (ph.engine !== 'flow') problems.push(`a phone gets "${ph.engine}", not flow`);
    if (ph.overflow > 2) problems.push(`phone overflow ${ph.overflow}px`);
    if (ph.n !== found.length) problems.push(`a phone shows ${ph.n} specimens`);
    const wide = await p2.evaluate(() => Array.from(document.querySelectorAll('[data-spec]')).filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1).length);
    if (wide) problems.push(`${wide} specimens spill off a phone screen`);
    const real = (list) => list.filter((e) => !/CERT|net::ERR|Failed to load resource|ERR_/i.test(e));
    if (real(e2).length) problems.push(`phone: ${real(e2)[0].slice(0, 120)}`);
    await phone.close();
  }

  const real = errors.filter((e) => !/CERT|net::ERR|Failed to load resource|ERR_/i.test(e));
  if (real.length) problems.push(`console: ${real[0].slice(0, 160)}`);
  r.check(`${tag}  (${found.length} specimens, ${meta.engine})`, problems.length === 0, problems.slice(0, 4).join(' ; '));
  await context.close();
}

/* ---- across the showcase ---- */
if (!only.length) {
  r.check(`every specimen name is unique across ${showcasePages.length} pages (${names.size} names)`, true);
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto(BASE + '/showcase', { waitUntil: 'domcontentloaded' });
  await page.locator('main h1').first().waitFor({ timeout: 15000 }).catch(() => {});
  await pause(1200);
  const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('main a[href^="/showcase/"]')).map((a) => a.getAttribute('href')));
  r.check('the index links every page', showcasePages.every((p) => hrefs.includes(showcasePath(p.slug))), `${new Set(hrefs).size} of ${showcasePages.length}`);
  r.check('the index loads cleanly', errors.filter((e) => !/CERT|net::ERR|Failed to load resource|ERR_/i.test(e)).length === 0, errors[0] || '');

  // the wide menu reaches every page, ten chapters of five
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pause(1800);
  const box = await page.locator('nav[aria-label="Primary"] a', { hasText: 'Showcase' }).first().boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 6 });
  await page.locator('[role="tab"]').first().waitFor({ timeout: 4000 }).catch(() => {});
  const tabs = await page.locator('[role="tablist"] [role="tab"]').count();
  r.check('the Showcase menu has a rail of one tab per chapter', tabs === chapters.length, `${tabs} tabs`);
  const seen = new Set();
  for (let i = 0; i < tabs; i += 1) {
    await page.locator('[role="tablist"] [role="tab"]').nth(i).hover();
    await pause(160);
    (await page.locator('[role="tabpanel"] a[href^="/showcase/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))).forEach((h) => seen.add(h));
  }
  r.check('the menu reaches every showcase page', showcasePages.every((p) => seen.has(showcasePath(p.slug))), `${seen.size} of ${showcasePages.length}`);
  await context.close();
}

await browser.close();
r.done();
