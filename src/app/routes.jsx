import { Suspense, lazy } from 'react';
import { Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import { pageRouteKeys, redirects, routePath } from './routeConfig';
import { RouteFallback } from '../components/layout/RouteFallback';

/* Route-level code splitting: every page is its own async chunk, so the initial
   bundle never carries the whole site. Every page — home, work, systems,
   development, company, contact, legal — renders through one data-driven
   TemplatePage chunk keyed into data/pages (also the search index's source). */
const loadTemplatePage = () => import('../pages/TemplatePage');
const NotFound = lazy(() => import('../pages/NotFound'));
const TemplatePage = lazy(loadTemplatePage);

/* Every page is the same chunk, so fetch it as soon as the browser is idle:
   the first navigation then never waits on the network. */
if (typeof window !== 'undefined') {
  const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 1200));
  idle(() => { loadTemplatePage(); });
}

/* /projects/:id used to be a public repository profile. Only YK Engine is part
   of the public work now; everything else lands on Work. */
function ProjectRedirect() {
  const { id } = useParams();
  return <Navigate to={id === 'yk-engine' ? '/work/yk-engine' : '/work'} replace />;
}

/**
 * AnimatePresence drives the page-to-page transition; Suspense covers the brief
 * chunk-load window. Retired routes redirect so old links never reach stale
 * content (see routeConfig.redirects).
 */
export function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {pageRouteKeys.map((key) => (
            <Route key={key} path={routePath(key)} element={<TemplatePage routeKey={key} />} />
          ))}

          {redirects.map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="/projects/:id" element={<ProjectRedirect />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AppRoutes;
