import styles from './feedback.module.css';

/**
 * The shape of content that has not arrived yet. Purely decorative, so it is
 * hidden from assistive technology — pair it with a live "loading" message
 * (a Spinner with `hideLabel`) wherever the wait matters.
 *
 *   <Skeleton width="60%" height="1rem" />      one block
 *   <Skeleton lines={3} />                      a short paragraph
 */
export default function Skeleton({ width = '100%', height = '1rem', lines, className }) {
  if (lines) {
    return (
      <span className={`${styles.skelStack} ${className || ''}`} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => <span key={i} className={styles.skel} style={{ width: i === lines - 1 ? '62%' : '100%', height }} />)}
      </span>
    );
  }
  return <span className={`${styles.skel} ${className || ''}`} style={{ width, height }} aria-hidden="true" />;
}
