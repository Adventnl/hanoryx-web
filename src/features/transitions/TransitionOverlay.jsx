import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { setScenesPaused } from '../../animation/sceneBudget';
import { presetFor } from './categoryTransitions';
import styles from './TransitionOverlay.module.css';

/**
 * TransitionOverlay — a short (≈0.6s) bold full-screen sweep on route change.
 * Pure CSS keyframes (GPU transform/clip), pointer-events:none so it NEVER
 * blocks interaction, one-shot, self-unmounting. A different motif per route
 * category. Skipped under reduced motion. Page scenes are briefly paused while
 * the sweep covers the screen so nothing fights for frames.
 */
export function TransitionOverlay() {
  const { pathname } = useLocation();
  const reduced = usePrefersReducedMotion();
  const firstRef = useRef(true);
  const [run, setRun] = useState(null); // { key, preset }

  useEffect(() => {
    if (reduced) return undefined;
    if (firstRef.current) {
      firstRef.current = false; // never play on initial load
      return undefined;
    }
    const preset = presetFor(pathname);
    setRun({ key: pathname + Date.now(), preset });
    setScenesPaused(true);
    window.dispatchEvent(new CustomEvent('hanoryx:overlay-start'));
    const t = setTimeout(() => {
      setRun(null);
      setScenesPaused(false);
    }, 720);
    return () => {
      clearTimeout(t);
      setScenesPaused(false);
    };
  }, [pathname, reduced]);

  if (!run) return null;

  return (
    <div
      key={run.key}
      className={`${styles.overlay} ${styles[run.preset.mod] || ''}`}
      aria-hidden="true"
    >
      <span className={styles.sweep} />
      <span className={styles.beam} />
      <span className={styles.label}>{run.preset.label}</span>
    </div>
  );
}

export default TransitionOverlay;
