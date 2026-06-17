import { pages } from '../data/pages';
import { PageTemplate } from '../components/page/PageTemplate';
import NotFound from './NotFound';

/**
 * Renders any data-driven route. Lazily loaded as one chunk so all page data +
 * the PageTemplate/PageBlocks renderer stay out of the initial bundle. A
 * missing data key degrades to the 404 rather than crashing.
 */
export default function TemplatePage({ routeKey }) {
  const data = pages[routeKey];
  return data ? <PageTemplate data={data} /> : <NotFound />;
}
