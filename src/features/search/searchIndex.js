/* Builds the search documents from the same page-data files that render the
   site, so what is searchable can never drift from what is on the page.
   Loaded lazily (dynamic import from the palette) — the page data is not part
   of the initial bundle. */
import { pages } from '../../data/pages';
import { routePath } from '../../app/routeConfig';
import { buildDocument } from './searchEngine';

let cached = null;

export function getSearchDocuments() {
  if (!cached) {
    cached = Object.values(pages)
      .map((page) => buildDocument(page, page.path || routePath(page.key)))
      .sort((a, b) => a.to.localeCompare(b.to));
  }
  return cached;
}

/* Shown before the visitor types: a short, curated way in. */
export const suggestedPaths = [
  '/work/musebase',
  '/work/yk-engine',
  '/company/timeline',
  '/systems',
  '/north/motion-systems',
  '/company/careers',
];

export const sectionOrder = ['All', 'Work', 'Systems', 'Development', 'Company', 'Legal'];
