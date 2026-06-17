import { useRef } from 'react';
import clsx from 'clsx';
import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer';
import styles from './AudioVisualizer.module.css';

/**
 * Canvas frequency visualizer. Reacts to real audio when playing; idles
 * subtly when paused. Size via CSS.
 */
export function AudioVisualizer({ bars = 16, className }) {
  const canvasRef = useRef(null);
  useAudioAnalyzer(canvasRef, { bars });
  return <canvas ref={canvasRef} className={clsx(styles.canvas, className)} aria-hidden="true" />;
}

export default AudioVisualizer;
