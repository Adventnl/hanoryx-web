import { useEffect } from 'react';
import { subscribe } from '../animation/rafScheduler';
import { useAudio } from '../app/providers/audio-context';
import { red, white } from '../animation/scenePalette';

/**
 * Drives a small canvas visualizer from real frequency data. Only runs the
 * shared rAF loop while audio is playing; draws a single static frame when
 * paused (no perpetual loop). DPR-capped, cleaned up on unmount.
 */
export function useAudioAnalyzer(canvasRef, { bars = 16 } = {}) {
  const { isPlaying, getFrequencyData, bins } = useAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const data = new Uint8Array(bins);
    const n = Math.min(bars, bins);
    const gap = 2;

    const drawBars = (time) => {
      ctx.clearRect(0, 0, W, H);
      const live = isPlaying && getFrequencyData(data);
      const bw = (W - gap * (n - 1)) / n;
      for (let i = 0; i < n; i += 1) {
        let v;
        if (live) v = data[i] / 255;
        else v = 0.12 + (Math.sin(time * 0.003 + i * 0.55) * 0.5 + 0.5) * 0.12;
        v = Math.max(0.05, Math.min(1, v));
        const bh = v * H;
        ctx.fillStyle = i % 5 === 0 ? red(0.9) : white(0.6);
        ctx.fillRect(i * (bw + gap), H - bh, bw, bh);
      }
    };

    let unsub = null;
    if (isPlaying) {
      unsub = subscribe(drawBars);
    } else {
      drawBars(0);
    }

    return () => {
      if (unsub) unsub();
      ro.disconnect();
    };
  }, [canvasRef, isPlaying, getFrequencyData, bins, bars]);
}

export default useAudioAnalyzer;
