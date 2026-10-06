/* Interaction checks — the behaviours people actually touch.
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/interactions.mjs
 *
 *   intro      START begins the music inside the gesture, the navbar audio control
 *              follows, the calibration readout advances to 100%, a rejected play()
 *              is handled, Skip intro still works, the navbar is visible once the
 *              site is revealed and its background eases in on scroll; the page
 *              cannot scroll on the START screen or during the animation, and the
 *              home page opens at its top
 *   search     the overlay is centred and sized sensibly at three widths, does not
 *              jump while typing, finds body copy (highlighted excerpts), and keeps
 *              keyboard navigation, Enter, Escape and click-outside
 *   nav        the first hover over a menu item opens it — including straight after a
 *              scroll, when the smooth-scroll tail is still sending scroll events
 *   keys       ? opens the shortcuts panel (focus moves in and returns), B toggles
 *              blueprint mode and names the marked details
 *   menu       the mobile menu has Search and no Contact
 *   footer     six named columns, the section row's live counts, a working search field
 *              and links; on a phone the columns fold into disclosures that really close
 *   motion     scrolling the Motion Systems page stays smooth and, under reduced
 *              motion, nothing loops forever
 *   contact    the contact page builds a mail link from the chosen type and message
 *   storage    the cookies page reads the real storage and can clear the site's own
 */
import assert from 'node:assert/strict';
import { BASE, launch, newContext, pause, reporter, watchErrors } from './lib.mjs';
import { pageRouteKeys, siteSections } from '../src/app/routeConfig.js';

const r = reporter('interactions');
const real = (errors) => errors.filter((e) => !/CERT|net::ERR|Failed to load resource/i.test(e));
const browser = await launch();

/* ---------------------------- intro: START, audio, calibration, navbar ---------------------------- */
{
  const context = await newContext(browser, { width: 1440, height: 900, boot: 'play' });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pause(1500);
  assert.equal(await page.locator('audio').evaluate((a) => a.paused), true, 'audio must be paused before START');
  await page.getByRole('button', { name: 'START' }).click();

  const samples = [];
  const t0 = Date.now();
  while (Date.now() - t0 < 12000) {
    const s = await page.evaluate(() => {
      const pct = document.querySelector('[class*="percent"]');
      const log = Array.from(document.querySelectorAll('[class*="logLine"]')).map((e) => e.textContent).join('|');
      const audio = document.querySelector('audio');
      const boot = document.querySelector('[role="dialog"][aria-label="System boot sequence"]');
      const nav = document.querySelector('header[data-chrome]');
      return { pct: pct?.textContent || null, calibrationInLog: /CALIBRATION/.test(log), playing: !audio.paused && audio.currentTime > 0, bootGone: !boot, navOpacity: nav ? +getComputedStyle(nav).opacity : null };
    });
    samples.push(s);
    if (s.bootGone) break;
    await pause(200);
  }
  await pause(1600);
  const final = await page.evaluate(() => {
    const nav = document.querySelector('header[data-chrome]');
    const btn = document.querySelector('button[data-audio-status]');
    return { opacity: +getComputedStyle(nav).opacity, top: nav.getBoundingClientRect().top, revealed: nav.dataset.revealed, status: btn.dataset.audioStatus, label: btn.textContent };
  });
  const pcts = samples.map((s) => s.pct).filter(Boolean);
  r.check('calibration readout advances past 0%', pcts.some((p) => /\/\/ (0[1-9]\d?|[1-9]\d\d?)%/.test(p)), pcts.filter((_, i) => i % 6 === 0).join(' > '));
  r.check('calibration readout reaches 100%', pcts.some((p) => /100%/.test(p)));
  r.check('the terminal log is not overwritten by the readout', !samples.some((s) => s.calibrationInLog));
  r.check('START begins audio playback inside the gesture', samples.some((s) => s.playing));
  r.check('navbar audio control follows playback', final.status === 'playing' && /LIVE/.test(final.label), `${final.status} / ${final.label}`);
  r.check('navbar is fully visible once the site is revealed', final.opacity === 1 && final.top >= 0 && final.revealed === 'true', JSON.stringify(final));
  r.check('no errors during the START flow', real(errors).length === 0, real(errors).join(' | '));

  const plate = () => page.evaluate(() => +getComputedStyle(document.querySelector('header[data-chrome] [class*="plate"]')).opacity);
  const before = await plate();
  await page.evaluate(() => window.scrollTo(0, 120));
  const seq = [];
  for (let i = 0; i < 10; i += 1) { seq.push(+(await plate()).toFixed(2)); await pause(60); }
  r.check('navbar background eases in on scroll', before === 0 && seq.some((v) => v > 0.05 && v < 0.95) && seq.at(-1) > 0.9, `0 > ${seq.join(', ')}`);
  await context.close();
}
{
  const context = await newContext(browser, { width: 1280, height: 800, boot: 'play' });
  await context.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('blocked by test', 'NotAllowedError')); });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pause(1200);
  await page.getByRole('button', { name: 'START' }).click();
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await pause(2200);
  const state = await page.evaluate(() => document.querySelector('button[data-audio-status]').dataset.audioStatus);
  r.check('a rejected play() is handled (state blocked, intro continues)', state === 'blocked' && real(errors).length === 0, `${state} ${real(errors).join(' | ')}`);
  await context.close();
}
{
  const context = await newContext(browser, { width: 1280, height: 800, boot: 'play' });
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pause(1200);
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await page.locator('[aria-label="System boot sequence"]').waitFor({ state: 'detached', timeout: 5000 });
  r.check('Skip intro still works', true);
  await context.close();
}

/* ---------------------------- intro: the page does not scroll until the home page is shown ---------------------------- */
for (const reduced of [false, true]) {
  const tag = reduced ? 'reduced motion' : 'animated';
  const context = await newContext(browser, { width: 1440, height: 900, boot: 'play', reduced });
  const page = await context.newPage();
  const y = () => page.evaluate(() => Math.round(window.scrollY));
  const bootUp = () => page.locator('[aria-label="System boot sequence"]').count().then((n) => n > 0);
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pause(1500);
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 3000);
  await page.keyboard.press('End');
  await pause(900);
  r.check(`START screen cannot be scrolled (${tag})`, (await y()) === 0, `y=${await y()}`);
  r.check(`START screen locks the page scroller (${tag})`, await page.evaluate(() => getComputedStyle(document.documentElement).overflowY === 'hidden'));
  r.check(`START screen has no ambient-sound note (${tag})`, !(await page.getByText(/ambient sound/i).count()));
  await page.getByRole('button', { name: 'START' }).click();
  let moved = 0;
  for (let i = 0; i < 60 && (await bootUp()); i += 1) {
    await page.mouse.wheel(0, 700);
    if (await bootUp()) moved = Math.max(moved, await y());
    await pause(250);
  }
  r.check(`no scrolling while the intro animation plays (${tag})`, moved === 0, `max y=${moved}`);
  await page.locator('[aria-label="System boot sequence"]').waitFor({ state: 'detached', timeout: 15000 });
  await pause(1500);
  r.check(`the home page opens at its top (${tag})`, (await y()) === 0, `y=${await y()}`);
  await page.mouse.wheel(0, 800);
  await pause(1500);
  r.check(`scrolling works once the intro is gone (${tag})`, (await y()) > 300, `y=${await y()}`);
  await context.close();
}

/* ---------------------------- search overlay ---------------------------- */
for (const [width, height, tag, mobile] of [[1440, 900, 'desktop', false], [390, 844, 'phone', true], [320, 640, 'narrow phone', true]]) {
  const context = await newContext(browser, { width, height, mobile });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto(BASE + '/systems', { waitUntil: 'domcontentloaded' });
  await pause(1800);
  await page.evaluate(() => window.scrollTo(0, 500));
  await pause(300);
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Search Hanoryx Systems' });
  await dialog.waitFor();
  await pause(700);
  const box = await dialog.boundingBox();
  const root = await page.locator('[class*="_root_"]').first().boundingBox();
  r.check(`search is centred and fits (${tag})`, Math.abs(box.x + box.width / 2 - (root.x + root.width / 2)) < 1.5 && box.x >= 0 && box.x + box.width <= width, `x=${Math.round(box.x)} w=${Math.round(box.width)}`);
  r.check(`search is not oversized (${tag})`, box.height < height * 0.86, `${Math.round(box.height)} of ${height}`);
  const input = dialog.getByRole('combobox');
  await input.fill('scheduling');
  await pause(500);
  const after = await dialog.boundingBox();
  r.check(`search does not jump while typing (${tag})`, Math.abs(box.x - after.x) < 1 && Math.abs(box.y - after.y) < 1);
  if (tag === 'desktop') {
    const first = dialog.getByRole('option').first();
    r.check('search finds body copy and highlights it', (await first.locator('mark').count()) > 0 && (await first.textContent()).length > 40);
    await input.fill('');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    r.check('arrow keys move the selection', (await dialog.getByRole('option', { selected: true }).count()) === 1);
    await input.fill('xqzvv');
    await pause(300);
    r.check('an empty state is shown when nothing matches', (await dialog.textContent()).includes('Nothing matches'));
    await input.fill('motion');
    await pause(300);
    await page.keyboard.press('Enter');
    await dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    r.check('Enter opens the result and closes search', !(await dialog.isVisible().catch(() => false)) && /north|lab/.test(page.url()), page.url());
    await page.keyboard.press('Control+k');
    await dialog.waitFor();
    await page.keyboard.press('Escape');
    await pause(500);
    r.check('Escape closes search', !(await dialog.isVisible().catch(() => false)));
    await page.keyboard.press('Control+k');
    await dialog.waitFor();
    await page.mouse.click(20, 400);
    await pause(500);
    r.check('clicking outside closes search', !(await dialog.isVisible().catch(() => false)));
  }
  r.check(`no errors while searching (${tag})`, real(errors).length === 0, real(errors).join(' | '));
  await context.close();
}

/* ---------------------------- navigation: the first hover opens the menu ---------------------------- */
/* The bug this guards: the first time the pointer reached a menu item after a scroll, nothing
   happened, and only a second pass opened it. The smooth-scroll tail kept sending scroll
   events with no pointer movement, and each one cancelled the pending hover-intent. */
{
  const open = (page) => page.evaluate(() => /NODE MAP/.test(document.querySelector('header[data-chrome]')?.textContent || ''));
  const opensWithin = async (page, ms) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { if (await open(page)) return Date.now() - t0; await pause(40); }
    return -1;
  };
  const hoverMenu = async (page, name) => {
    const box = await page.locator('nav[aria-label="Primary"] a', { hasText: name }).first().boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 6 });
  };
  const cases = [
    { tag: 'on a fresh page', scroll: false, settle: 0 },
    { tag: 'straight after scrolling', scroll: true, settle: 0 },
    { tag: '0.6 s after scrolling', scroll: true, settle: 600 },
  ];
  for (const c of cases) {
    const context = await newContext(browser, { width: 1440, height: 900 });
    const page = await context.newPage();
    const errors = watchErrors(page);
    await page.goto(BASE + '/systems', { waitUntil: 'load' });
    await pause(2600);
    await page.mouse.move(720, 500);
    if (c.scroll) {
      for (let i = 0; i < 10; i += 1) { await page.mouse.wheel(0, 240); await pause(40); }
      await pause(1800);
      for (let i = 0; i < 14; i += 1) { await page.mouse.wheel(0, -240); await pause(40); }
      await pause(c.settle);
    }
    await hoverMenu(page, 'Development');
    const took = await opensWithin(page, 1500);
    r.check(`the first hover opens the menu ${c.tag}`, took >= 0, took >= 0 ? `${took} ms` : 'never opened within 1.5 s');
    if (c.scroll && c.settle === 0) {
      await page.mouse.move(720, 420, { steps: 8 });
      await pause(900);
      await hoverMenu(page, 'Work');
      r.check('and a different item opens just as readily afterwards', (await opensWithin(page, 1500)) >= 0);
    }
    r.check(`no errors while using the menu ${c.tag}`, real(errors).length === 0, real(errors).join(' | '));
    await context.close();
  }
}

/* ---------------------------- ? panel and blueprint mode ---------------------------- */
{
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto(BASE + '/company', { waitUntil: 'domcontentloaded' });
  await pause(1800);
  await page.locator('main').click({ position: { x: 5, y: 5 }, force: true }).catch(() => {});
  await page.keyboard.press('?');
  const panel = page.getByRole('dialog', { name: 'Keyboard shortcuts' });
  await panel.waitFor({ timeout: 3000 }).catch(() => {});
  r.check('? opens the shortcuts panel', await panel.isVisible().catch(() => false));
  r.check('focus moves into the panel', await page.evaluate(() => !!document.activeElement?.closest('[data-shortcuts-panel]')));
  await page.keyboard.press('Escape');
  await panel.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  r.check('Escape closes the panel', !(await panel.isVisible().catch(() => false)));
  await page.keyboard.press('b');
  await pause(900);
  const blueprint = await page.evaluate(() => ({ on: document.documentElement.classList.contains('blueprint'), labels: document.querySelectorAll('[class*="BlueprintLayer"], [class*="_label_"]').length, hud: /marked/i.test(document.body.innerText) }));
  r.check('B turns blueprint mode on and names the marked details', blueprint.on && blueprint.hud, JSON.stringify(blueprint));
  await page.keyboard.press('b');
  await pause(300);
  r.check('B turns it off again', !(await page.evaluate(() => document.documentElement.classList.contains('blueprint'))));
  r.check('no errors from the shortcuts', real(errors).length === 0, real(errors).join(' | '));
  await context.close();
}

/* ---------------------------- single-key shortcuts can be turned off ---------------------------- */
{
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto(BASE + '/legal/accessibility', { waitUntil: 'domcontentloaded' });
  await pause(1800);
  const modal = () => page.locator('[role="dialog"][aria-modal="true"]').count();
  await page.locator('main').click({ position: { x: 5, y: 5 }, force: true }).catch(() => {});
  await page.keyboard.press('?');
  await pause(500);
  r.check('? opens the shortcuts panel while the single-key shortcuts are on', (await modal()) === 1);
  await page.keyboard.press('Escape');
  await pause(600);
  const group = page.getByRole('radiogroup', { name: 'Single-key shortcuts' });
  await group.scrollIntoViewIfNeeded();
  await group.getByRole('radio', { name: 'Off' }).click();
  r.check('turning them off in the display preferences marks the page', (await page.evaluate(() => document.documentElement.dataset.keys)) === 'off');
  await page.keyboard.press('?');
  await pause(500);
  r.check('? then does nothing', (await modal()) === 0);
  await page.keyboard.press('b');
  await pause(500);
  r.check('B then does not switch blueprint mode', !(await page.evaluate(() => document.documentElement.classList.contains('blueprint'))));
  await page.keyboard.press('/');
  await pause(500);
  r.check('/ then does not open the search', (await modal()) === 0);
  await page.keyboard.press('Control+k');
  await pause(600);
  r.check('Ctrl + K still opens the search', (await modal()) === 1);
  await page.keyboard.press('Escape');
  await pause(600);
  await group.getByRole('radio', { name: 'On' }).click();
  await page.keyboard.press('?');
  await pause(500);
  r.check('turning them back on brings ? back', (await modal()) === 1);
  r.check('no errors from the preferences', real(errors).length === 0, real(errors).join(' | '));
  await context.close();
}

/* ---------------------------- mobile menu ---------------------------- */
{
  const context = await newContext(browser, { width: 390, height: 844, mobile: true });
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pause(1600);
  await page.getByRole('button', { name: /menu/i }).first().click();
  await pause(900);
  const menu = await page.locator('[role="dialog"]').first().innerText().catch(() => '');
  r.check('the mobile menu has Search and no Contact', /search/i.test(menu) && !/contact/i.test(menu), menu.replace(/\s+/g, ' ').slice(0, 120));
  await context.close();
}

/* ---------------------------- footer: a directory that leads somewhere ---------------------------- */
{
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto(BASE + '/company/faq', { waitUntil: 'domcontentloaded' });
  await pause(1800);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await pause(1400);
  const footer = page.locator('footer');
  const titles = (await footer.locator('nav[aria-label="Footer"] h2').allInnerTexts()).map((t) => t.replace(/^\s*\d+\s*/, '').trim().toLowerCase());
  r.check('the footer has six named columns', JSON.stringify(titles) === JSON.stringify(['company', 'insights', 'resources', 'development', 'trust', 'legal']), titles.join(', '));
  const groups = await footer.locator('nav[aria-label="Footer"] h3').count();
  r.check('each column is split into named groups', groups >= 10, `${groups} groups`);

  const counts = await footer.locator('nav[aria-label="Sections of the site"] a').evaluateAll((as) => as.map((a) => [a.firstChild.textContent.trim(), Number(a.querySelector('i').textContent)]));
  const expected = siteSections.map((s) => [s.label, pageRouteKeys.filter(s.test).length]);
  r.check('the section row counts the pages in each section', JSON.stringify(counts) === JSON.stringify(expected), JSON.stringify(counts));
  r.check('the footer states how many pages the site has', new RegExp(`\\b${pageRouteKeys.length} pages\\b`, 'i').test(await footer.innerText()), `${pageRouteKeys.length} expected`);
  r.check('the legal row carries the six short links', (await footer.locator('ul[aria-label="Legal"] a').count()) === 6);
  r.check('the "new on the site" strip lists the latest chapters', (await footer.locator('a').filter({ hasText: /^Ch\. \d/ }).count()) >= 2);

  await footer.getByRole('button', { name: /open the site search/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Search Hanoryx Systems' });
  await dialog.waitFor({ timeout: 4000 }).catch(() => {});
  r.check('the footer’s search field opens the search', await dialog.isVisible().catch(() => false));
  await page.keyboard.press('Escape');
  await pause(500);

  await footer.locator('a[href="/resources/glossary"]').first().click();
  await page.waitForURL('**/resources/glossary', { timeout: 6000 }).catch(() => {});
  // the old page's heading is still there while it leaves, so wait for the new page to set its title
  await page.waitForFunction(() => /glossary/i.test(document.title), null, { timeout: 8000 }).catch(() => {});
  r.check('a footer link opens its page', new URL(page.url()).pathname === '/resources/glossary' && /glossary/i.test(await page.title()), `${page.url()} · ${await page.title()}`);
  r.check('no errors from the footer', real(errors).length === 0, real(errors).join(' | '));
  await context.close();
}
{
  const context = await newContext(browser, { width: 390, height: 844, mobile: true });
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pause(1800);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await pause(1400);
  const footer = page.locator('footer');
  const toggles = footer.locator('nav[aria-label="Footer"] button[aria-expanded]');
  r.check('on a phone the six columns are disclosures, all closed', (await toggles.count()) === 6 && (await toggles.evaluateAll((bs) => bs.every((b) => b.getAttribute('aria-expanded') === 'false'))));
  const hiddenLink = () => footer.locator('#footer-legal a').first().evaluate((a) => ({ visibility: getComputedStyle(a).visibility, height: a.closest('[id="footer-legal"]').getBoundingClientRect().height }));
  const closed = await hiddenLink();
  r.check('a closed column is out of the tab order, not only clipped', closed.visibility === 'hidden' && closed.height < 2, JSON.stringify(closed));
  const legal = toggles.filter({ hasText: 'Legal' });
  await legal.click();
  await pause(900);
  const opened = await hiddenLink();
  r.check('opening a column shows its links', (await legal.getAttribute('aria-expanded')) === 'true' && opened.visibility === 'visible' && opened.height > 60, JSON.stringify(opened));
  await toggles.filter({ hasText: 'Trust' }).click();
  await pause(900);
  r.check('opening another closes the first', (await legal.getAttribute('aria-expanded')) === 'false');
  await context.close();
}

/* ---------------------------- motion: smooth scroll, reduced motion ---------------------------- */
{
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  await page.goto(BASE + '/north/motion-systems', { waitUntil: 'domcontentloaded' });
  await pause(2200);
  await page.evaluate(() => {
    const m = { frames: [], last: performance.now(), run: true };
    window.__m = m;
    const tick = (now) => { if (!m.run) return; m.frames.push(now - m.last); m.last = now; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.mouse.move(720, 450);
  const t0 = Date.now();
  while (Date.now() - t0 < 6000) { await page.mouse.wheel(0, 90); await pause(16); }
  const stats = await page.evaluate(() => {
    const f = window.__m.frames.slice(2).sort((a, b) => a - b);
    const sum = f.reduce((a, b) => a + b, 0);
    return { fps: +(f.length / (sum / 1000)).toFixed(1), p95: +f[Math.floor(f.length * 0.95)].toFixed(1), slow: f.filter((x) => x > 50).length };
  });
  // a software-rendered headless browser is a pessimistic floor, not a target
  r.check('Motion Systems scrolls smoothly', stats.fps >= 40 && stats.slow <= 6, JSON.stringify(stats));
  await context.close();
}
{
  const context = await newContext(browser, { width: 1280, height: 800, reduced: true });
  const page = await context.newPage();
  await page.goto(BASE + '/company', { waitUntil: 'domcontentloaded' });
  await pause(2500);
  const looping = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity).length);
  r.check('nothing loops forever under reduced motion', looping === 0, `${looping} running infinite animations`);
  await context.close();
}

/* ---------------------------- contact studio ---------------------------- */
{
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  await page.goto(BASE + '/contact?type=careers', { waitUntil: 'domcontentloaded' });
  await pause(1800);
  const studio = page.locator('[data-fx="contact.studio"]');
  r.check('?type=careers preselects Careers', /Careers/.test(await studio.locator('[role=radio][aria-checked=true]').innerText()));
  await studio.getByRole('button', { name: 'I build…' }).click();
  await studio.getByRole('radio', { name: /Systems & platforms/ }).click();
  const href = await studio.getByRole('link', { name: /mail app/ }).getAttribute('href');
  r.check('the mail link carries the chosen subject and the starter line', /^mailto:[^?]+\?subject=Systems%20%26%20platforms&body=I%20build/.test(href), href.slice(0, 100));
  await context.close();
}

/* ---------------------------- storage inspector ---------------------------- */
{
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  await page.goto(BASE + '/legal/cookies', { waitUntil: 'domcontentloaded' });
  await pause(1500);
  const panel = page.locator('[data-fx="cookies.storage-inspector"]');
  await panel.scrollIntoViewIfNeeded(); // the inspector only polls while it is on screen
  await page.evaluate(() => sessionStorage.setItem('hnx.audio.on', '1'));
  await pause(2200);
  r.check('the inspector lists what the browser really holds', /hnx\.audio\.on/.test(await panel.innerText()));
  await panel.getByRole('button', { name: /Clear the site/ }).click();
  await pause(700);
  r.check('"Clear" removes only the site’s own items', !/hnx\.audio\.on/.test(await panel.innerText()));
  await context.close();
}

/* ---------------------------- route changes are announced ---------------------------- */
{
  const context = await newContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto(BASE + '/legal', { waitUntil: 'domcontentloaded' });
  await pause(1800);
  const region = page.locator('[data-route-announcer]');
  r.check('there is one polite status region for page changes, and it starts empty', (await region.count()) === 1 && (await region.getAttribute('role')) === 'status' && (await region.innerText()) === '');
  const link = page.locator('main a[href="/legal/privacy"]').first();
  await link.scrollIntoViewIfNeeded();
  await link.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => (document.querySelector('[data-route-announcer]')?.textContent || '').trim() !== '', null, { timeout: 6000 }).catch(() => {});
  const said = (await region.innerText()).trim();
  r.check('after a page change the new page’s title is announced', said === (await page.title()) && /Privacy/.test(said), JSON.stringify(said));
  r.check('focus moves to the main region when the link that was used has gone', await page.evaluate(() => document.activeElement?.id === 'main'));
  await page.goBack();
  await page.waitForFunction(() => /Legal/.test(document.title) && !/Privacy/.test(document.title), null, { timeout: 6000 }).catch(() => {});
  await pause(2000);
  r.check('going back announces the page it returns to', /Legal/.test((await region.innerText()).trim()) && !/Privacy/.test((await region.innerText()).trim()), JSON.stringify((await region.innerText()).trim()));
  r.check('page changes raise no errors', real(errors).length === 0, real(errors).slice(0, 2).join(' | '));
  await context.close();
}

await browser.close();
r.done();
