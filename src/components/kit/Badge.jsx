import styles from './data.module.css';

/**
 * A short label for the state or kind of a thing: "New", "Beta", "Deprecated".
 * Tones: `neutral`, `red`, `solid`, `outline`, `success`, `warning`. The word is
 * what carries the meaning; the tone only reinforces it. `dot` adds a small mark.
 */
export default function Badge({ children, tone = 'neutral', dot = false, className }) {
  return (
    <span className={`${styles.badge} ${className || ''}`} data-tone={tone}>
      {dot && <i aria-hidden="true" />}
      {children}
    </span>
  );
}
