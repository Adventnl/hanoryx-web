import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import { templateRouteKeys } from './routeConfig';
import { RouteFallback } from '../components/layout/RouteFallback';

/* Route-level code splitting: every page is its own async chunk, so the initial
   bundle no longer carries all 30 routes + page data + the scene renderer.
   Bespoke pages are wired directly; the rest share one data-driven chunk. */
const Home = lazy(() => import('../pages/Home'));
const Contact = lazy(() => import('../pages/Contact'));
const Timeline = lazy(() => import('../pages/Timeline'));
const NotFound = lazy(() => import('../pages/NotFound'));
const TemplatePage = lazy(() => import('../pages/TemplatePage'));

/**
 * 30 real routes. Bespoke pages (Home, Contact, Timeline, 404) are wired
 * directly; every other route renders through the lazy data-driven TemplatePage,
 * keyed into data/pages. AnimatePresence drives the page-to-page transition;
 * Suspense covers the brief chunk-load window.
 */
export function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/timeline" element={<Timeline />} />

          {templateRouteKeys.map((key) => (
            <Route key={key} path={`/${key}`} element={<TemplatePage routeKey={key} />} />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AppRoutes;
