import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORAGE_KEYS } from '../../utils/constants';
import { lockScroll } from '../../utils/scrollLock';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useLenis } from '../../app/providers/lenis-context';
import { AdvancedNavbar } from '@/features/navigation/AdvancedNavbar';
import { MobileNav } from '@/features/navigation/MobileNav';
import { Footer } from './Footer';
import { RouteAnnouncer } from './RouteAnnouncer';
import { ErrorBoundary } from './ErrorBoundary';
import { BootSequence } from '../effects/BootSequence';
import { HanoryxCursor } from '@/features/cursor/HanoryxCursor';
import { ScanlineOverlay } from '../effects/ScanlineOverlay';
import { NoiseOverlay } from '../effects/NoiseOverlay';
import { PerfDebug } from '../effects/PerfDebug';
import { GlobalKeys } from '@/features/shortcuts/GlobalKeys';
import { TransitionOverlay } from '@/features/transitions/TransitionOverlay';
import { CommandPalette } from '@/features/search/CommandPalette';
import { ScrollProgress } from '@/features/navigation/ScrollProgress';
import styles from './SiteShell.module.css';

function readBooted() {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.bootComplete) === '1';
  } catch {
    return false;
  }
}

/**
 * Top-level frame. Owns the boot gate, scroll-lock, designed cursor, light
 * global overlays, navigation, and footer. There is NO global animated
 * background — every section declares its own scene (SectionScene). Audio
 * lives in AudioProvider and only starts through the explicit audio control.
 */
export function SiteShell({ children }) {
  const [booted, setBooted] = useState(readBooted);
  // The boot overlay outlives `booted` by one fade: it stays mounted while it
  // lifts away, then unmounts itself via onExited — so there's no hard cut.
  const [bootMounted, setBootMounted] = useState(() => !readBooted());
  const [menuOpen, setMenuOpen] = useState(false);
  // The navbar glides in as the site is revealed. It flips one frame AFTER
  // `booted` so even a returning visitor (booted from the first render) gets
  // the entrance transition instead of the bar simply being there.
  const [navRevealed, setNavRevealed] = useState(false);
  const contentRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const { pathname } = useLocation();

  // Close the mobile menu on navigation (render-time adjust, no effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    if (!booted) return undefined;
    const id = requestAnimationFrame(() => setNavRevealed(true));
    return () => cancelAnimationFrame(id);
  }, [booted]);

  // The page cannot scroll while the intro is on screen — from the START
  // screen through the final fade — so the visitor lands on the top of the home
  // page, never mid-page or on the footer. `html.scroll-locked` holds even when
  // Lenis is absent (reduced motion), and the gate is released only once the
  // overlay has fully lifted.
  useEffect(() => {
    if (!bootMounted) return undefined;
    // A browser restoring an old scroll position must not carry it past the intro.
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const unlock = lockScroll(lenis);
    return () => {
      unlock();
      history.scrollRestoration = 'auto';
    };
  }, [bootMounted, lenis]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('is-locked');
      lenis.stop();
    } else if (!bootMounted) {
      document.body.classList.remove('is-locked');
      lenis.start();
    }
  }, [menuOpen, bootMounted, lenis]);

  // Any full-screen overlay (synthesis / route transition) closes open menus.
  useEffect(() => {
    const onOverlay = () => setMenuOpen(false);
    window.addEventListener('hanoryx:overlay-start', onOverlay);
    return () => window.removeEventListener('hanoryx:overlay-start', onOverlay);
  }, []);

  const handleBootComplete = () => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.bootComplete, '1');
    } catch {
      /* storage unavailable */
    }
    setBooted(true);

    // The home page always opens at its top, whatever happened before START.
    window.scrollTo(0, 0);

    // Rise the site into view as the overlay lifts, instead of snapping it in.
    const el = contentRef.current;
    if (el && !reduced) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 72 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.3,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    } else {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  };

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main">Skip to content</a>
      <RouteAnnouncer />

      <NoiseOverlay />
      <ScanlineOverlay />
      <HanoryxCursor />

      <AdvancedNavbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} revealed={navRevealed} />
      <ScrollProgress />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TransitionOverlay />
      <CommandPalette enabled={booted} />
      <GlobalKeys enabled={booted} />

      <div className={styles.content} ref={contentRef}>
        <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>
        <Footer />
      </div>

      {bootMounted && (
        <BootSequence
          onComplete={handleBootComplete}
          onExited={() => setBootMounted(false)}
        />
      )}
      {import.meta.env.DEV && <PerfDebug />}
    </div>
  );
}

export default SiteShell;
