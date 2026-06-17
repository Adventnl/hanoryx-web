import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import Home from '../pages/Home';
import Systems from '../pages/Systems';
import HanoryxNorth from '../pages/HanoryxNorth';
import Work from '../pages/Work';
import Timeline from '../pages/Timeline';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

/**
 * Route table wrapped in AnimatePresence so each page can run an exit
 * transition before the next mounts (see PageTransition).
 */
export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/systems" element={<Systems />} />
        <Route path="/north" element={<HanoryxNorth />} />
        <Route path="/work" element={<Work />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
