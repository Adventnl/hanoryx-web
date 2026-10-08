/* Page data, loaded per route.

   Each file in this folder default-exports a page object { key, title, hero,
   blocks }, and its file name is its key with "/" turned into "-"
   (`legal/privacy` -> legal-privacy.js). Pages are separate async chunks so a
   visitor downloads the long-form text of the page they are reading, not of
   all the pages on the site. Search and directory data is generated at build
   time. Adding a page is: write the file, add its key to `pageRouteKeys` in
   app/routeConfig.js. */
import { pageRouteKeys } from '../../app/routeConfig';

const loaders = import.meta.glob(['./*.js', '!./index.js']);
const fileOf = (key) => `./${key.replace(/\//g, '-')}.js`;
const cache = new Map();

/** A promise for one page's data (null when the key has no file). Cached, so it
 *  can be handed straight to React's `use()`. */
export function loadPage(key) {
  if (!cache.has(key)) {
    const load = loaders[fileOf(key)];
    const request = load ? load().then((mod) => mod.default) : Promise.resolve(null);
    cache.set(key, request.catch((error) => {
      cache.delete(key); // allow a later navigation/search attempt to retry
      throw error;
    }));
  }
  return cache.get(key);
}

/** Start loading the page a link points to (called on hover and focus). */
export function warmPath(pathname) {
  const key = pathname === '/' ? 'home' : pathname.replace(/^\/|\/$/g, '');
  if (pageRouteKeys.includes(key)) {
    // Prefetch is speculative; a later navigation retries and surfaces errors.
    loadPage(key).catch(() => {});
  }
}
