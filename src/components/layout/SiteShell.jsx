import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { musicSrc } from '../../utils/assetResolver';
import { STORAGE_KEYS } from '../../utils/constants';
import { useAudioController } from '../../hooks/useAudioController';
import { useLenis } from '../../app/providers/lenis-context';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { BootSequence } from '../animation/BootSequence';
import { FlowFieldCanvas } from '../animation/FlowFieldCanvas';
import { CursorField } from '../animation/CursorField';
import { ScanlineOverlay } from '../animation/ScanlineOverlay';
import { NoiseOverlay } from '../animation/NoiseOverlay';
import styles from './SiteShell.module.css';

function readBooted() {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.bootComplete) === '1';
  } catch {
    return false;
  }
}

/**
 * Top-level frame. Owns the boot gate, ambient audio, scroll-lock, the
 * living background, overlays, navigation, and footer. Pages render through
 * `children`. The full boot sequence plays at most once per session.
 */
export function SiteShell({ children }) {
  const [booted, setBooted] = useState(readBooted);
  const [menuOpen, setMenuOpen] = useState(false);
  const { audioRef, isPlaying, start: startAudio, toggle: toggleAudio } = useAudioController({ volume: 0.4 });
  const lenis = useLenis();
  const { pathname } = useLocation();

  // Close the mobile menu on navigation — React's render-time state
  // adjustment (no effect needed, no extra commit).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // Scroll-lock during boot.
  useEffect(() => {
    if (!booted) {
      document.body.classList.add('is-locked');
      lenis.stop();
    } else {
      document.body.classList.remove('is-locked');
      lenis.start();
    }
  }, [booted, lenis]);

  // Scroll-lock while the mobile menu is open.
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
      /* storage unavailable — boot just won't be remembered */
    }
    setBooted(true);
    // The page was scroll-locked during boot; recompute trigger positions
    // now that the real layout is in place.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main">Skip to content</a>
      <audio ref={audioRef} src={musicSrc} loop preload="none" />

      <FlowFieldCanvas />
      <ScanlineOverlay />
      <NoiseOverlay />
      <CursorField />

      <Navbar
        isPlaying={isPlaying}
        onToggleAudio={toggleAudio}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
      />
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isPlaying={isPlaying}
        onToggleAudio={toggleAudio}
      />

      <div className={styles.content}>
        {children}
        <Footer />
      </div>

      {!booted && <BootSequence onComplete={handleBootComplete} onStart={startAudio} />}
    </div>
  );
}

export default SiteShell;
