import clsx from 'clsx';
import { useAudio } from '../../app/providers/audio-context';
import { AudioVisualizer } from './AudioVisualizer';
import styles from './AudioSignalButton.module.css';

const LABEL = {
  idle: 'IDLE',
  loading: 'LOADING',
  playing: 'LIVE',
  blocked: 'TAP TO PLAY',
  error: 'UNAVAILABLE',
};

const ARIA = {
  idle: 'Play ambient signal',
  loading: 'Loading ambient signal — press to cancel',
  playing: 'Mute ambient signal',
  blocked: 'Playback was blocked by the browser — press to try again',
  error: 'Ambient signal could not load — press to retry',
};

/**
 * Compact audio control for the navbar: a live frequency visualizer + state
 * readout. It mirrors the shared AudioProvider `status`, which follows the
 * <audio> element itself, so it is correct after START on the intro, after the
 * browser pauses playback, and after a rejected play request.
 */
export function AudioSignalButton({ className }) {
  const { status, isPlaying, toggle } = useAudio();

  return (
    <button
      type="button"
      data-cursor="audio"
      data-audio-status={status}
      className={clsx(styles.btn, isPlaying && styles.live, status === 'loading' && styles.loading, (status === 'blocked' || status === 'error') && styles.alert, className)}
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={ARIA[status] || ARIA.idle}
      title={ARIA[status] || ARIA.idle}
    >
      <span className={styles.viz}>
        <AudioVisualizer bars={14} />
      </span>
      <span className={styles.label}>
        AUDIO<span className={styles.sep}>//</span>
        <span key={status} className={styles.state}>{LABEL[status] || LABEL.idle}</span>
      </span>
    </button>
  );
}

export default AudioSignalButton;
