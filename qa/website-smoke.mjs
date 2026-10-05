/* Website smoke — every page, several widths.
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/website-smoke.mjs
 *
 * For every page route at phone, tablet and desktop widths it checks: the page
 * answers, has a heading, throws no console or page errors, and has no horizontal
 * overflow. At desktop width it also checks the things the site's content rules
 * promise: unique titles, every internal link resolves, no external link other
 * than the YK Engine repository, no mailto outside the contact page, none of the
 * retired wording, a footer that is a directory of the whole site (and leads to
 * far more than the menu does), every page linked from the menu or the footer, a
 * page ending that is its own composition and never a call to contact, a primary
 * navigation without Contact, working redirects, a 404, the favicon files, and
 * the search dialog. At 320 px
 * the sweep runs under reduced motion: nothing may loop forever and the heading
 * must be fully visible. At every width the header's controls must stay inside
 * the viewport (the page can report no overflow while a fixed header spills).
 */
import { BASE, launch, newContext, pageRoutes, redirectRoutes, pause, reporter, watchErrors } from './lib.mjs';
import { directory, navGroups } from '../src/app/routeConfig.js';

const r = reporter('website smoke');
const WIDTHS = [280, 320, 360, 390, 768, 1024, 1440, 1920];
const known = new Set(pageRoutes);
// Claims the site no longer makes. "Hosting" and "public repository" are fine when they name the vendor
// that delivers the files or the one repository YK Engine links to; what is banned is offering hosting,
// talking about public repositories in the plural, and anything that reads like GitHub statistics.
const BANNED = /e-?commerce|\b(?:web|cloud|managed) hosting\b|public repositories|repository count|software engineering\b.*status|\bstars?\b.*\brepos?\b/i;
const NO_CLOSER = new Set(['/contact', '/sitemap']); // the contact details and the directory are their own endings
const CTA = /contact us|get in touch|start a (project|conversation)|talk to us|let.s talk/i;

const browser = await launch();

for (const width of WIDTHS) {
  const context = await newContext(browser, { width, height: 900, reduced: width === 320 });
  const page = await context.newPage();
  const errors = watchErrors(page);
  const problems = [];
  const titles = new Map();
  const externals = new Map();
  const mailtos = [];
  const endingProblems = [];

  for (const route of pageRoutes) {
    errors.length = 0;
    const response = await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await page.locator('main h1, main h2').first().waitFor({ timeout: 10000 }).catch(() => {});
    await pause(width === 1440 ? 500 : 250);
    const state = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector('main h1')?.textContent?.trim() || '',
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      text: document.querySelector('main')?.innerText || '',
      hrefs: Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')),
      looping: document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity).length,
      ending: (() => {
        const sections = Array.from(document.querySelectorAll('main section'));
        const closer = document.querySelector('main section[aria-label^="End of"]');
        return {
          has: Boolean(closer),
          after: closer ? sections.slice(sections.indexOf(closer) + 1).filter((x) => !closer.contains(x)).length : 0,
          words: closer ? closer.innerText.trim().split(/\s+/).length : 0,
          contact: closer ? Array.from(closer.querySelectorAll('a[href]')).some((a) => /^\/contact/.test(a.getAttribute('href'))) : false,
          text: closer ? closer.innerText : '',
        };
      })(),
      headingOpacity: (() => {
        const h = document.querySelector('main h1');
        return h ? Math.min(...[h, ...h.querySelectorAll('*')].map((e) => Number(getComputedStyle(e).opacity))) : 0;
      })(),
    }));
    if (width === 320) {
      if (state.looping) problems.push(`${route}: ${state.looping} looping animations under reduced motion`);
      if (state.headingOpacity < 0.99) problems.push(`${route}: heading not fully visible under reduced motion (${state.headingOpacity})`);
    }
    if (!response?.ok() || !state.heading || state.overflow > 2 || errors.length) {
      problems.push(`${route}: ${[!response?.ok() && `status ${response?.status()}`, !state.heading && 'no h1', state.overflow > 2 && `overflow ${state.overflow}px`, errors.length && errors.slice(0, 2).join(' | ')].filter(Boolean).join(', ')}`);
    }
    if (width === 1440) {
      if (titles.has(state.title)) problems.push(`${route}: duplicate title with ${titles.get(state.title)}`);
      else titles.set(state.title, route);
      state.hrefs.forEach((href) => {
        if (href.startsWith('/')) {
          const path = href.split('#')[0].split('?')[0] || '/';
          if (!known.has(path)) problems.push(`${route}: link to unknown page ${href}`);
        } else if (/^https?:/.test(href)) externals.set(href, [...(externals.get(href) || []), route]);
        else if (href.startsWith('mailto:')) mailtos.push(route);
      });
      if (BANNED.test(state.text)) problems.push(`${route}: banned wording found (${state.text.match(BANNED)[0]})`);
      if (!NO_CLOSER.has(route)) {
        const e = state.ending;
        if (!e.has) endingProblems.push(`${route}: no closing composition`);
        else if (e.after) endingProblems.push(`${route}: ${e.after} section(s) after the ending`);
        else if (e.words < 25) endingProblems.push(`${route}: ending has only ${e.words} words`);
        else if (e.contact || CTA.test(e.text)) endingProblems.push(`${route}: ending reads as a call to contact`);
      }
    }
  }
  r.check(`every page loads cleanly at ${width}px${width === 320 ? ' (reduced motion)' : ''}`, problems.length === 0, problems.slice(0, 4).join(' ; '));

  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pause(900);
  const fit = await page.evaluate(() => {
    const parts = Array.from(document.querySelectorAll('header[data-chrome] a, header[data-chrome] button')).filter((el) => el.getBoundingClientRect().width > 0);
    return { left: Math.round(Math.min(...parts.map((el) => el.getBoundingClientRect().left))), right: Math.round(Math.max(...parts.map((el) => el.getBoundingClientRect().right))), vw: window.innerWidth };
  });
  r.check(`header controls fit inside the viewport at ${width}px`, fit.left >= 8 && fit.right <= fit.vw - 8, JSON.stringify(fit));

  if (width === 1440) {
    const outside = [...externals.entries()].filter(([href]) => !/github\.com\/Adventnl\/YK-Engine$/.test(href) && !/fonts\.(googleapis|gstatic)\.com/.test(href));
    r.check('no external link except the YK Engine repository', outside.length === 0, outside.map(([h, rs]) => `${h} on ${rs[0]}`).join(', '));
    const yk = [...externals.entries()].filter(([href]) => /YK-Engine/.test(href));
    r.check('the YK Engine repository is linked only from its own page', yk.every(([, rs]) => rs.every((x) => x === '/work/yk-engine')), JSON.stringify(yk));
    r.check('no mailto link outside the contact page', mailtos.every((x) => x === '/contact'), [...new Set(mailtos)].join(', '));
    r.check('every page ends in its own composition, never a call to contact', endingProblems.length === 0, endingProblems.slice(0, 4).join(' ; '));
    const linked = new Set(directory.map((d) => d.to));
    const orphans = pageRoutes.filter((p) => p !== '/' && !linked.has(p));
    r.check('every page is linked from the menu or the footer', orphans.length === 0, orphans.join(', '));

    /* footer directory + navigation */
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await pause(1200);
    const footerLinks = await page.locator('footer a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    const footerPages = new Set(footerLinks.map((h) => h.split('#')[0]));
    const menuPages = new Set(navGroups.flatMap((g) => [g.to, ...g.children.map((c) => c.to)]));
    const beyondMenu = [...footerPages].filter((p) => !menuPages.has(p));
    r.check('footer is a directory of at least 50 real pages', footerPages.size >= 50 && [...footerPages].every((h) => known.has(h)), `${footerPages.size} pages from ${footerLinks.length} links`);
    r.check('footer leads to at least 40 pages the menu does not', beyondMenu.length >= 40, `${beyondMenu.length} beyond the menu`);
    r.check('footer links to a dedicated contact page', footerLinks.includes('/contact'));
    r.check('footer carries the legal row', ['/legal/privacy', '/legal/terms', '/legal/cookies', '/legal/accessibility'].every((p) => footerLinks.includes(p)));
    const navText = await page.locator('header[data-chrome]').innerText();
    r.check('primary navigation has no Contact', !/contact/i.test(navText), navText.replace(/\s+/g, ' ').slice(0, 120));
    r.check('header chrome says Live, not "Software engineering"', /live/i.test(navText) && !/software engineering/i.test(navText));

    /* redirects */
    const bad = [];
    for (const [from, to] of redirectRoutes) {
      await page.goto(BASE + from, { waitUntil: 'domcontentloaded' });
      await pause(300);
      if (new URL(page.url()).pathname !== to) bad.push(`${from} -> ${new URL(page.url()).pathname} (wanted ${to})`);
    }
    r.check('retired routes redirect to their new homes', bad.length === 0, bad.join(' ; '));
    await page.goto(BASE + '/projects/anything', { waitUntil: 'domcontentloaded' });
    await pause(300);
    r.check('/projects/:id lands on Work', new URL(page.url()).pathname === '/work');

    /* 404 */
    await page.goto(BASE + '/definitely-not-a-page', { waitUntil: 'domcontentloaded' });
    await pause(1200);
    r.check('unknown paths show the 404 with nearby pages', /signal lost/i.test(await page.locator('main').innerText()) && (await page.locator('main a[href^="/"]').count()) >= 3);

    /* favicon files */
    const icons = await page.evaluate(() => Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')).map((l) => l.getAttribute('href')));
    const statuses = await Promise.all(icons.map(async (href) => (await page.request.get(BASE + href)).status()));
    r.check('favicon links all resolve', icons.length >= 3 && statuses.every((s) => s === 200), icons.map((h, i) => `${h}:${statuses[i]}`).join(' '));

    /* search */
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await pause(1200);
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: 'Search Hanoryx Systems' });
    await dialog.waitFor({ timeout: 4000 }).catch(() => {});
    r.check('Ctrl+K opens the search', await dialog.isVisible().catch(() => false));
    await page.keyboard.press('Escape');
  }
  await context.close();
}

await browser.close();
r.done();
