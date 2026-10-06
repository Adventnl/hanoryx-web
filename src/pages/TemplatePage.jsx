import { use } from 'react';
import { loadPage } from '../data/pages';
import { PageTemplate } from '../components/page/PageTemplate';
import NotFound from './NotFound';

/**
 * Renders any data-driven route. The page's data is its own async chunk (see
 * data/pages/index.js) and is read with `use()`, so the route suspends on the
 * shell's fallback until it has arrived. A missing data file degrades to the
 * 404 rather than crashing.
 */
export default function TemplatePage({ routeKey }) {
  const data = use(loadPage(routeKey));
  return data ? <PageTemplate data={data} /> : <NotFound />;
}
