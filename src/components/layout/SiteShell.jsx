import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORAGE_KEYS } from '../../utils/constants';
import { useAudio } from '../../app/providers/audio-context';
import { useLenis } from '../../app/providers/lenis-context';
import { AdvancedNavbar } from '../navigation/AdvancedNavbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { BootSequence } from '../animation/BootSequence';
import { HanoryxCursor } from '../cursor/HanoryxCursor';
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
 * Top-level frame. Owns the boot gate, scroll-lock, designed cursor, light
 * global overlays, navigation, and footer. There is NO global animated
 * background — every section declares its own scene (SectionScene). Audio
 * lives in AudioProvider; boot START triggers it.
 */
export function SiteShell({ children }) {
  const [booted, setBooted] = useState(readBooted);
  const [menuOpen, setMenuOpen] = useState(false);
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
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main">Skip to content</a>

      <NoiseOverlay />
      <ScanlineOverlay />
      <HanoryxCursor />

      <AdvancedNavbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className={styles.content}>
        {children}
        <Footer />
      </div>

      {!booted && <BootSequence onComplete={handleBootComplete} onStart={startAudio} />}
    </div>
  );
}

export default SiteShell;
