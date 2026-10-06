import styles from './feedback.module.css';

/**
 * A small "working on it" ring. It is a status message first — the label is
 * announced, and shown unless you pass `hideLabel` — and a picture second. It
 * stops turning for visitors who ask for less motion, and still says what it is.
 */
export default function Spinner({ label = 'Loading', size = '1.6rem', hideLabel = false, className }) {
  return (
    <span className={`${styles.spin} ${className || ''}`} role="status" style={{ '--s': size }}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle className={styles.ring} cx="12" cy="12" r="9" />
        <circle className={styles.arc} cx="12" cy="12" r="9" />
      </svg>
      <span className={hideLabel ? 'sr-only' : undefined}>{label}</span>
    </span>
  );
}
