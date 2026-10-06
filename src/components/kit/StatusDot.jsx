import styles from './feedback.module.css';

const WORDS = { ok: 'Operational', warn: 'Degraded', down: 'Down', idle: 'Idle' };

/**
 * A coloured dot with its state spelled out beside it, so the colour is never the
 * only signal. `pulse` makes a live thing breathe (and stops for reduced motion).
 */
export default function StatusDot({ state = 'idle', label, pulse = false, className }) {
  return (
    <span className={`${styles.status} ${className || ''}`} data-state={state} data-pulse={pulse ? '' : undefined}>
      <span className={styles.pip} aria-hidden="true" />
      <span>{label ?? WORDS[state]}</span>
    </span>
  );
}
