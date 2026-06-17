import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import { templateRouteKeys } from './routeConfig';
import { pages } from '../data/pages';
import { PageTemplate } from '../components/page/PageTemplate';

import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Timeline from '../pages/Timeline';
import NotFound from '../pages/NotFound';

/**
 * 30 real routes. Bespoke pages (Home, Contact, Timeline, 404) are wired
 * directly; every other route renders through the data-driven PageTemplate,
 * keyed into data/pages. A missing data entry degrades to the 404, never a
 * crash. AnimatePresence drives the page-to-page transition.
 */
export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/timeline" element={<Timeline />} />

        {templateRouteKeys.map((key) => (
          <Route
            key={key}
            path={`/${key}`}
            element={pages[key] ? <PageTemplate data={pages[key]} /> : <NotFound />}
          />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
