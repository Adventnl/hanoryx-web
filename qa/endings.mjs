/* Page endings — the content rules for how a page finishes (no browser needed).
 *
 *   node qa/endings.mjs
 *
 * Reads every page's data and checks that:
 *   - no page contains a call-to-action block (the old "go to contact" ending);
 *   - every page except the contact page and the site map ends in a `closer`;
 *   - no two pages end in the same composition;
 *   - every `kind` a page names exists in its registry (a typo renders nothing,
 *     silently), and every composition in the closer registry is the ending of a page;
 *   - every closer carries a tag that says where it sits ("End of …"), a title and a
 *     scene, and its onward links point at real pages;
 *   - the pages' keys, the route list and the page files all agree.
 */
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { reporter } from './lib.mjs';
import { pageRouteKeys, routePath } from '../src/app/routeConfig.js';

register('./ext-loader.mjs', import.meta.url);

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const PAGES = path.join(ROOT, 'src/data/pages');
const SKIP_CLOSER = new Set(['contact', 'sitemap']);
const r = reporter('page endings');

const { closerRegistry } = await import(pathToFileURL(path.join(ROOT, 'src/components/closers/registry.js')).href);
const { signatureRegistry } = await import(pathToFileURL(path.join(ROOT, 'src/components/signatures/registry.js')).href);

const pages = [];
for (const file of fs.readdirSync(PAGES).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  const mod = await import(pathToFileURL(path.join(PAGES, file)).href);
  pages.push({ file, ...mod.default });
}
const keys = new Set(pages.map((p) => p.key));
const routes = new Set(pageRouteKeys.map(routePath));
const real = (to) => routes.has((to || '').split('#')[0].split('?')[0] || '/');

/* the pages, the routes and the files agree */
r.check('every page file has a route, and every route a page file',
  pageRouteKeys.every((k) => keys.has(k)) && pages.every((p) => pageRouteKeys.includes(p.key)),
  [...pageRouteKeys.filter((k) => !keys.has(k)), ...pages.filter((p) => !pageRouteKeys.includes(p.key)).map((p) => p.file)].join(', '));

/* no call to action anywhere */
const withCta = pages.filter((p) => p.blocks.some((b) => b.type === 'cta'));
r.check('no page has a call-to-action block', withCta.length === 0, withCta.map((p) => p.key).join(', '));

/* every page ends in a closer (bar two) and none repeats */
const lastOf = (p) => p.blocks[p.blocks.length - 1];
const noCloser = pages.filter((p) => !SKIP_CLOSER.has(p.key) && lastOf(p).type !== 'closer');
r.check('every page but contact and the site map ends in its own closing composition', noCloser.length === 0, noCloser.map((p) => p.key).join(', '));
const midPage = pages.filter((p) => p.blocks.slice(0, -1).some((b) => b.type === 'closer'));
r.check('a closing composition is only ever the last block', midPage.length === 0, midPage.map((p) => p.key).join(', '));

const endings = pages.filter((p) => lastOf(p).type === 'closer').map((p) => ({ key: p.key, kind: lastOf(p).kind }));
const seen = new Map();
endings.forEach((e) => seen.set(e.kind, [...(seen.get(e.kind) || []), e.key]));
const shared = [...seen.entries()].filter(([, ks]) => ks.length > 1);
r.check(`no two pages share an ending (${endings.length} pages, ${seen.size} different endings)`, shared.length === 0, shared.map(([k, ks]) => `${k}: ${ks.join(' + ')}`).join('; '));

/* registries */
const unknownCloser = endings.filter((e) => !closerRegistry[e.kind]);
r.check('every closing composition a page names exists', unknownCloser.length === 0, unknownCloser.map((e) => `${e.key} -> ${e.kind}`).join(', '));
const dead = Object.keys(closerRegistry).filter((k) => !seen.has(k));
r.check('every closing composition in the registry ends a page', dead.length === 0, dead.join(', '));
const CLOSERS = path.join(ROOT, 'src/components/closers');
const sources = fs.readdirSync(CLOSERS).filter((f) => f.endsWith('.jsx')).map((f) => ({ name: f.replace('.jsx', ''), code: fs.readFileSync(path.join(CLOSERS, f), 'utf8') }));
const registered = new Set(Object.keys(closerRegistry).map((k) => k[0].toUpperCase() + k.slice(1)));
const orphaned = sources.filter((s) => s.name !== 'CloserFrame' && !registered.has(s.name) && !sources.some((o) => o.name !== s.name && new RegExp(`from './${s.name}'`).test(o.code))).map((s) => s.name);
r.check('every closer component is registered, or used by one that is', orphaned.length === 0, orphaned.join(', '));

const sigBlocks = pages.flatMap((p) => p.blocks.filter((b) => b.type === 'signature').map((b) => ({ key: p.key, kind: b.kind })));
const unknownSig = sigBlocks.filter((b) => !signatureRegistry[b.kind]);
r.check(`every signature block names a component that exists (${sigBlocks.length} blocks)`, unknownSig.length === 0, unknownSig.map((b) => `${b.key} -> ${b.kind}`).join(', '));

/* what a closer carries */
const closers = pages.flatMap((p) => p.blocks.filter((b) => b.type === 'closer').map((b) => ({ key: p.key, ...b })));
const bad = [];
closers.forEach((c) => {
  if (!/^End of /.test(c.tag || '')) bad.push(`${c.key}: tag "${c.tag}"`);
  if (!c.title || !c.scene) bad.push(`${c.key}: needs a title and a scene`);
  (c.onward || []).forEach((l) => { if (!real(l.to)) bad.push(`${c.key}: onward link to unknown page ${l.to}`); });
  if (/contact us|get in touch|start a (project|conversation)|talk to us|let.s talk/i.test(`${c.title} ${c.lede}`)) bad.push(`${c.key}: reads like a call to action`);
});
r.check(`every closer has a tag, a title, a scene and working onward links (${closers.length})`, bad.length === 0, bad.slice(0, 4).join(' ; '));

/* every link in a page's data leads somewhere real */
const broken = [];
const walk = (value, where) => {
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${where}[${i}]`));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'to' && typeof v === 'string' && v.startsWith('/') && !real(v)) broken.push(`${where}.to = ${v}`);
      else walk(v, `${where}.${k}`);
    }
  }
};
pages.forEach((p) => walk(p, p.key));
r.check('every internal link written in the page data leads to a real page', broken.length === 0, broken.slice(0, 4).join(' ; '));

r.done();
