import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { presetFor, labelFor } from './categoryTransitions';
import styles from './TransitionOverlay.module.css';

const DURATION_MS = 1000;

/**
 * Route "current". Navigating does not cover the screen. A thin red line (with a
 * soft wash trailing behind it and the destination written at its end) travels
 * across the viewport while the old page eases out and the new one eases in, so
 * there is always something moving and never a blank frame. Pure CSS transform
 * + opacity, no blur and no filter, pointer-events: none, one-shot, and skipped
 * under reduced motion. The motif's direction follows the section being entered.
 */
export function TransitionOverlay() {
  const { pathname } = useLocation();
  const reduced = usePrefersReducedMotion();
  const previousPath = useRef(pathname);
  const [run, setRun] = useState(null); // { key, preset, label }

  useEffect(() => {
    if (previousPath.current === pathname) return undefined;
    previousPath.current = pathname;
    window.dispatchEvent(new CustomEvent('hanoryx:overlay-start'));
    if (reduced) return undefined;
    const kickoff = window.setTimeout(() => setRun({ key: `${pathname}-${performance.now()}`, preset: presetFor(pathname), label: labelFor(pathname) }), 0);
    const done = window.setTimeout(() => setRun(null), DURATION_MS + 80);
    return () => {
      window.clearTimeout(kickoff);
      window.clearTimeout(done);
    };
  }, [pathname, reduced]);

  if (!run) return null;

  return (
    <div key={run.key} className={`${styles.overlay} ${styles[run.preset.mod] || ''}`} aria-hidden="true">
      <span className={styles.rider}>
        <span className={styles.wash} />
        <span className={styles.line} />
        <span className={styles.label}>{run.label}</span>
      </span>
    </div>
  );
}

export default TransitionOverlay;
