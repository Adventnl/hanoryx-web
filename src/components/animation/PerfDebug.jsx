import { useEffect, useRef } from 'react';
import { getFps, getSubscriberCount } from '../../animation/rafScheduler';
import { getMotionState } from '../../animation/motionBudget';
import styles from './PerfDebug.module.css';

/**
 * Development-only performance HUD. Shows live FPS, active rAF subscribers
 * (≈ running scenes/loops), and the current quality tier. Reads values on a
 * 500ms interval and writes them straight to the DOM — no per-frame React
 * state. Never rendered in production builds.
 */
export function PerfDebug() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const id = setInterval(() => {
      const { tier, mobile, reduced } = getMotionState();
      const fps = Math.round(getFps());
      el.textContent = `FPS ${fps} · LOOPS ${getSubscriberCount()} · ${tier.toUpperCase()}${mobile ? '·M' : ''}${reduced ? '·RM' : ''}`;
      el.dataset.warn = fps < 45 ? '1' : '0';
    }, 500);
    return () => clearInterval(id);
  }, []);

  return <div ref={ref} className={styles.hud} aria-hidden="true">FPS — · LOOPS — · —</div>;
}

export default PerfDebug;
