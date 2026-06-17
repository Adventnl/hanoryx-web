import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORAGE_KEYS } from '../../utils/constants';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useAudio } from '../../app/providers/audio-context';
import { useLenis } from '../../app/providers/lenis-context';
import { AdvancedNavbar } from '@/features/navigation/AdvancedNavbar';
import { MobileNav } from '@/features/navigation/MobileNav';
import { Footer } from './Footer';
import { ErrorBoundary } from './ErrorBoundary';
import { BootSequence } from '../effects/BootSequence';
import { HanoryxCursor } from '@/features/cursor/HanoryxCursor';
import { ScanlineOverlay } from '../effects/ScanlineOverlay';
import { NoiseOverlay } from '../effects/NoiseOverlay';
import { PerfDebug } from '../effects/PerfDebug';
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
 * lives in AudioProvider; boot START triggers it.
 */
export function SiteShell({ children }) {
  const [booted, setBooted] = useState(readBooted);
  // The boot overlay outlives `booted` by one fade: it stays mounted while it
  // lifts away, then unmounts itself via onExited — so there's no hard cut.
  const [bootMounted, setBootMounted] = useState(() => !readBooted());
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { start: startAudio } = useAudio();
  const lenis = useLenis();
  const { pathname } = useLocation();

  // Close the mobile menu on navigation (render-time adjust, no effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    if (!booted) {
      document.body.classList.add('is-locked');
      lenis.stop();
    } else {
      document.body.classList.remove('is-locked');
      lenis.start();
    }
  }, [booted, lenis]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('is-locked');
      lenis.stop();
    } else if (booted) {
      document.body.classList.remove('is-locked');
      lenis.start();
    }
  }, [menuOpen, booted, lenis]);

  const handleBootComplete = () => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.bootComplete, '1');
    } catch {
      /* storage unavailable */
    }
    setBooted(true);

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

      <NoiseOverlay />
      <ScanlineOverlay />
      <HanoryxCursor />

      <AdvancedNavbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className={styles.content} ref={contentRef}>
        <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>
        <Footer />
      </div>

      {bootMounted && (
        <BootSequence
          onComplete={handleBootComplete}
          onExited={() => setBootMounted(false)}
          onStart={startAudio}
        />
      )}
      {import.meta.env.DEV && <PerfDebug />}
    </div>
  );
}

export default SiteShell;
