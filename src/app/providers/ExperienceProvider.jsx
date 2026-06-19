import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './lenis-context';
import { setScenesPaused } from '../../animation/sceneBudget';
import { ExperienceContext } from './experience-context';

// The overlay (and its heavy canvas) is only fetched when the user presses Play.
const SystemSynthesisOverlay = lazy(() =>
  import('../../features/experience/SystemSynthesisOverlay')
);

/**
 * ExperienceProvider — owns the full-screen System Synthesis takeover.
 * Opening it pauses every page scene, stops Lenis, locks scroll, and hides the
 * nav/cursor (via the `synthesis-active` document class). Closing restores all
 * of that and refreshes layout. The overlay is lazy-loaded on first open.
 */
export function ExperienceProvider({ children }) {
  const lenis = useLenis();
  const [isSynthesisOpen, setOpen] = useState(false);

  const openSynthesis = useCallback(() => {
    setOpen(true);
    setScenesPaused(true); // page backgrounds stop — the overlay owns the screen
    document.documentElement.classList.add('synthesis-active');
    document.body.classList.add('is-locked');
    lenis.stop();
    // Close any open menus / hover layers.
    window.dispatchEvent(new CustomEvent('hanoryx:overlay-start'));
  }, [lenis]);

  const closeSynthesis = useCallback(() => {
    setOpen(false);
    setScenesPaused(false);
    document.documentElement.classList.remove('synthesis-active');
    document.body.classList.remove('is-locked');
    lenis.start();
    // Let layout settle, then recalc scroll triggers.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      try { ScrollTrigger.refresh(); } catch { /* gsap not ready */ }
    }));
  }, [lenis]);

  const value = useMemo(
    () => ({ isSynthesisOpen, openSynthesis, closeSynthesis }),
    [isSynthesisOpen, openSynthesis, closeSynthesis]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      {isSynthesisOpen && (
        <Suspense fallback={null}>
          <SystemSynthesisOverlay onClose={closeSynthesis} />
        </Suspense>
      )}
    </ExperienceContext.Provider>
  );
}

export default ExperienceProvider;
