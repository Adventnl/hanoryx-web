import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { LenisContext } from './lenis-context';

/**
 * Smooth, "river-like" scrolling via Lenis, wired into the GSAP ticker so
 * ScrollTrigger and Lenis share one clock. Disabled entirely under
 * reduced-motion (native scroll takes over). Scrolls to top and refreshes
 * triggers on every route change so pinned/scrubbed sections recalc cleanly.
 */
export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    if (reduced) return undefined; // honor reduced-motion: native scroll

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });
    lenisRef.current = instance;

    instance.on('scroll', ScrollTrigger.update);
    const onTick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Reset scroll + recalc triggers on navigation.
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Stable API — reads the live instance via ref, so no re-render needed.
  const value = useMemo(
    () => ({
      getLenis: () => lenisRef.current,
      scrollTo: (target, opts) => {
        if (lenisRef.current) lenisRef.current.scrollTo(target, opts);
        else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
        else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth' });
      },
      stop: () => lenisRef.current && lenisRef.current.stop(),
      start: () => lenisRef.current && lenisRef.current.start(),
    }),
    []
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export default LenisProvider;
