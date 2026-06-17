import clsx from 'clsx';
import { useAudio } from '../../app/providers/audio-context';
import { AudioVisualizer } from './AudioVisualizer';
import styles from './AudioSignalButton.module.css';

/**
 * Compact audio control for the navbar: a live frequency visualizer + state
 * readout. Toggles the shared ambient audio. Real Web Audio analyser drives
 * the bars; falls back to a subtle idle animation when paused/unavailable.
 */
export function AudioSignalButton({ className }) {
  const { isPlaying, toggle } = useAudio();

  return (
    <button
      type="button"
      data-cursor="audio"
      className={clsx(styles.btn, isPlaying && styles.live, className)}
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Mute ambient signal' : 'Play ambient signal'}
    >
      <span className={styles.viz}>
        <AudioVisualizer bars={14} />
      </span>
      <span className={styles.label}>
        AUDIO<span className={styles.sep}>//</span>
        <span className={styles.state}>{isPlaying ? 'LIVE' : 'IDLE'}</span>
      </span>
    </button>
  );
}

export default AudioSignalButton;
