/* Showcase pages load on demand: each is its own chunk (JSX + CSS), named by
   its slug in showcase/pages.js. A page module default-exports
   { Visual, items: [[name, Component, mode], ...] }. */
const modules = import.meta.glob('./pages/*.jsx');
const cache = new Map();

/** A promise for one page's module (null when there is no file for the slug).
 *  Cached, so it can be handed straight to React's `use()`. */
export function loadShowcase(slug) {
  if (!cache.has(slug)) {
    const load = modules[`./pages/${slug}.jsx`];
    const request = load ? load().then((mod) => mod.default) : Promise.resolve(null);
    cache.set(slug, request.catch((error) => {
      cache.delete(slug); // allow a later navigation to retry
      throw error;
    }));
  }
  return cache.get(slug);
}

/** Start loading the page a link points to (called on hover and focus). */
export function warmShowcase(pathname) {
  const match = /^\/showcase\/([\w-]+)\/?$/.exec(pathname);
  if (match) loadShowcase(match[1]).catch(() => {});
}
