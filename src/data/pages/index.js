/* Page data, loaded per route.

   Each file in this folder default-exports a page object { key, title, hero,
   blocks }, and its file name is its key with "/" turned into "-"
   (`legal/privacy` -> legal-privacy.js). Pages are separate async chunks so a
   visitor downloads the long-form text of the page they are reading, not of
   all the pages on the site; the search index and the directory ask for the
   whole set only when they are used. Adding a page is: write the file, add
   its key to `pageRouteKeys` in app/routeConfig.js. */
import { pageRouteKeys } from '../../app/routeConfig';

const loaders = import.meta.glob(['./*.js', '!./index.js']);
const fileOf = (key) => `./${key.replace(/\//g, '-')}.js`;
const cache = new Map();

/** A promise for one page's data (null when the key has no file). Cached, so it
 *  can be handed straight to React's `use()`. */
export function loadPage(key) {
  if (!cache.has(key)) {
    const load = loaders[fileOf(key)];
    cache.set(key, load ? load().then((mod) => mod.default) : Promise.resolve(null));
  }
  return cache.get(key);
}

/** Every page, as { key: data }. Used by the search index and the directory. */
export function loadAllPages() {
  return Promise.all(pageRouteKeys.map(loadPage)).then((list) =>
    Object.fromEntries(list.filter((page) => page?.key).map((page) => [page.key, page]))
  );
}

const idle = (fn) => (typeof window !== 'undefined' && window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 4000 }) : window.setTimeout(fn, 300));

/** Quietly fetch every page's data, one per idle slot, so navigation never
 *  waits on the network. */
export function warmPages() {
  const queue = [...pageRouteKeys];
  const next = () => {
    const key = queue.shift();
    if (key) loadPage(key).finally(() => idle(next));
  };
  idle(next);
}

/** Start loading the page a link points to (called on hover and focus). */
export function warmPath(pathname) {
  const key = pathname === '/' ? 'home' : pathname.replace(/^\/|\/$/g, '');
  if (pageRouteKeys.includes(key)) loadPage(key);
}
