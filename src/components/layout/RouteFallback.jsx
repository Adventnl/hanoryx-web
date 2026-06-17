import styles from './RouteFallback.module.css';

/** Minimal loading state shown while a route chunk streams in. Quiet, on-brand,
 *  and short-lived — a pulsing telemetry line rather than a spinner. */
export function RouteFallback() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-live="polite">
      <span className={styles.bar} />
      <span className={styles.code}>LOADING MODULE…</span>
    </div>
  );
}

export default RouteFallback;
