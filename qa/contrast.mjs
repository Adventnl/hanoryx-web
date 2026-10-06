/* Text contrast — can the words on every page be read?
 *
 *   QA_BASE=http://127.0.0.1:5173 node qa/contrast.mjs [/route ...] [--phone]
 *   QA_WORKERS=5 …                      pages scanned at once (default 3)
 *
 * axe-core measures contrast only where it can work out the background, which on this site is
 * rarely: the sections sit on animated canvases, gradients and translucent panels. So this
 * script measures it a different way. It walks each page a screen at a time and, for every piece
 * of text that is on screen, takes the colour the browser is really painting it in (opacity and
 * all), composes it over the nearest solid backdrop the element sits on (translucent panels and
 * gradients are stacked; the page's own near-black is the floor), and works out the WCAG contrast
 * ratio. Text must reach 4.5 : 1, or 3 : 1 if it is large (24px, or 18.66px and bold).
 *
 * A reading only counts once the text has been on screen for about a second, so a reveal that is
 * still fading in is not held against the page; a dimmed "not yet" state that stays dim is.
 *
 * What it does not see: the picture the canvases draw behind a block (scene-metrics keeps those
 * calm), text inside images, placeholder text, and anything hidden from assistive technology —
 * decoration that is aria-hidden is exempt, as the guidelines allow. Disabled controls are exempt
 * too. When it fails it prints the kinds of element that fall short, worst first.
 */
import { BASE, launch, newContext, pageRoutes, pause, reporter } from './lib.mjs';

const r = reporter('contrast');
const phone = process.argv.includes('--phone');
const only = process.argv.slice(2).filter((a) => a.startsWith('/'));
const routes = only.length ? only : pageRoutes;
const problems = [];
const groups = new Map(); // kind of element -> where it falls short, across all pages
let measured = 0;
const MIN_TEXTS = 20; // a page that measured fewer than this did not really draw

/** Runs in the page: measure everything currently on screen, keep the worst reading per element. */
function measureVisible() {
  const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = ([red, green, blue]) => 0.2126 * lin(red) + 0.7152 * lin(green) + 0.0722 * lin(blue);
  const parse = (value) => {
    const m = value.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
    }
    const c = value.match(/color\(srgb ([^)]+)\)/); // what the browser reports for color-mix()
    if (c) {
      const p = c[1].split(/[ /]+/).filter(Boolean).map(Number);
      return { rgb: [p[0] * 255, p[1] * 255, p[2] * 255], a: p.length > 3 ? p[3] : 1 };
    }
    return null;
  };
  /** A gradient background, taken as the average of its stops — close enough to tell paper from glass. */
  const gradient = (value) => {
    if (!value.includes('gradient(')) return null;
    const stops = (value.match(/rgba?\([^)]+\)/g) || []).map(parse).filter(Boolean);
    if (!stops.length) return null;
    const mean = (f) => stops.reduce((sum, x) => sum + f(x), 0) / stops.length;
    return { rgb: [mean((x) => x.rgb[0]), mean((x) => x.rgb[1]), mean((x) => x.rgb[2])], a: mean((x) => x.a) };
  };
  const over = (top, a, under) => top.map((v, i) => v * a + under[i] * (1 - a));
  const floor = [8, 9, 11];

  /** The colour behind an element: translucent layers stacked on the first solid one (or the floor). */
  const backdrop = (el) => {
    const layers = [];
    let base = floor;
    for (let node = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      for (const bg of [gradient(style.backgroundImage), parse(style.backgroundColor)]) {
        if (bg && bg.a > 0) layers.push(bg);
      }
      const solid = layers.findIndex((layer) => layer.a >= 0.97);
      if (solid !== -1) { base = layers[solid].rgb; layers.length = solid; break; }
    }
    return layers.reduceRight((under, layer) => over(layer.rgb, layer.a, under), base);
  };

  const SETTLE = 900; // ms an element must have been on screen before a reading counts
  const kind = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? `.${el.className.split(' ')[0].replace(/_[a-z0-9]{5,}_\d+$/i, '')}` : ''}`;
  const seen = (window.__contrastSeen ||= new Map());
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const text = walker.currentNode.nodeValue.trim();
    const el = walker.currentNode.parentElement;
    if (text.length < 2 || !el) continue;
    if (el.closest('[aria-hidden="true"], [hidden], script, style, noscript, .sr-only, [inert], :disabled, [aria-disabled="true"]')) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2 || rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility !== 'visible' || cs.display === 'none') continue;
    let opacity = 1;
    for (let node = el; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
    if (opacity < 0.02) continue; // not revealed yet — it will be measured when it is
    const svg = el instanceof SVGElement;
    const colour = parse(svg ? cs.fill : cs.color);
    if (!colour) continue;
    const alpha = colour.a * opacity * (svg ? Number(cs.fillOpacity) : 1);
    const back = backdrop(el);
    const ink = over(colour.rgb, alpha, back);
    const [hi, lo] = [lum(ink), lum(back)].sort((a, b) => b - a);
    const ratio = (hi + 0.05) / (lo + 0.05);
    const px = parseFloat(cs.fontSize);
    const large = px >= 24 || (px >= 18.66 && Number.parseInt(cs.fontWeight, 10) >= 700);
    const need = large ? 3 : 4.5;
    const was = seen.get(el);
    const now = performance.now();
    if (!was) {
      // first sighting: a reveal may still be running, so this reading does not count yet
      seen.set(el, { since: now, ratio: Infinity, need, px, text: text.slice(0, 40), name: kind(el) });
    } else if (now - was.since > SETTLE && ratio < was.ratio) {
      Object.assign(was, { ratio, need, px });
    }
  }
}

/** One page: walk it a screen at a time, then return what fell short. */
async function scan(page, route) {
  await page.goto(BASE + route, { waitUntil: 'load' });
  // wait for the page to draw: a busy machine can take a while to mount the first screen
  await page.locator('main h1, main h2').first().waitFor({ timeout: 20000 }).catch(() => {});
  await pause(900);
  const viewport = await page.evaluate(() => window.innerHeight);
  await page.evaluate(() => { window.__contrastSeen = new Map(); });
  // the page grows as its lazy sections mount, so the height is read again at every step
  for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += Math.round(viewport * 0.7)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await pause(600);
    await page.evaluate(measureVisible); // note what is on screen
    await pause(1000);
    await page.evaluate(measureVisible); // and measure it, once it has settled
  }
  return page.evaluate(() => {
    const rows = [...window.__contrastSeen.values()];
    const settled = rows.filter((x) => x.ratio !== Infinity);
    return { total: settled.length, bad: settled.filter((x) => x.ratio < x.need).map((x) => ({ ...x, ratio: Math.round(x.ratio * 100) / 100 })) };
  });
}

const WORKERS = Math.max(1, Math.min(Number(process.env.QA_WORKERS) || 3, routes.length));
const browser = await launch();
const queue = [...routes];
const results = new Map();
await Promise.all(Array.from({ length: WORKERS }, async () => {
  const context = await newContext(browser, phone ? { width: 390, height: 844, mobile: true } : { width: 1440, height: 900 });
  const page = await context.newPage();
  for (let route = queue.shift(); route; route = queue.shift()) {
    results.set(route, await scan(page, route));
    const found = results.get(route);
    console.log(`${String(found.bad.length).padStart(4)} / ${String(found.total).padStart(4)}  ${route}`);
  }
  await context.close();
}));

for (const route of routes) {
  const found = results.get(route);
  measured += found.total;
  if (found.total < MIN_TEXTS) problems.push(`${route}: only ${found.total} pieces of text were measured, so the page did not draw`);
  if (!found.bad.length) continue;
  const byName = new Map();
  for (const row of found.bad) {
    const entry = byName.get(row.name) || { n: 0, min: 99, sample: row.text, px: row.px };
    entry.n += 1; entry.min = Math.min(entry.min, row.ratio);
    byName.set(row.name, entry);
    const g = groups.get(row.name) || { n: 0, min: 99, sample: row.text, px: row.px, pages: new Set() };
    g.n += 1; g.min = Math.min(g.min, row.ratio); g.pages.add(route);
    groups.set(row.name, g);
  }
  const summary = [...byName.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 4).map(([name, e]) => `${name} ×${e.n} (${e.min}:1, ${Math.round(e.px)}px, “${e.sample}”)`).join('; ');
  problems.push(`${route}: ${found.bad.length} of ${found.total} — ${summary}`);
}

r.check(`text on ${routes.length} page${routes.length === 1 ? '' : 's'} reaches its contrast (${measured} pieces of text measured${phone ? ', phone' : ''})`, problems.length === 0, problems.length ? `${problems.length} page(s) fall short` : '');
problems.slice(0, 12).forEach((p) => console.log('  ·', p));
if (groups.size) {
  console.log('\nBy kind of element, worst first:');
  [...groups.entries()].sort((a, b) => b[1].n - a[1].n).forEach(([name, g]) => console.log(`  ${String(g.n).padStart(4)} × ${name}  ${g.min}:1  ${Math.round(g.px)}px  on ${g.pages.size} page${g.pages.size === 1 ? '' : 's'} (${[...g.pages].slice(0, 3).join(', ')})  “${g.sample}”`));
}
await browser.close();
r.done();
