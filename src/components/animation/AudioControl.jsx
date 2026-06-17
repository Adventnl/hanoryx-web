import clsx from 'clsx';
import styles from './AudioControl.module.css';

/**
 * Presentational audio toggle with an equalizer readout. Stateless — the
 * shell owns the audio element and passes isPlaying / onToggle.
 */
export function AudioControl({ isPlaying, onToggle, className }) {
  return (
    <button
      type="button"
      className={clsx(styles.wrap, isPlaying && styles.playing, className)}
      onClick={onToggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Mute ambient audio' : 'Play ambient audio'}
    >
      <span className={styles.viz} aria-hidden="true">
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </span>
      <span className={styles.text}>AUDIO // {isPlaying ? 'LIVE' : 'MUTED'}</span>
    </button>
  );
}

export default AudioControl;
