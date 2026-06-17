import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { musicSrc } from '../../utils/assetResolver';
import { STORAGE_KEYS } from '../../utils/constants';
import { subscribe } from '../../animation/rafScheduler';
import { setAudioActive, writeAudioBytes } from '../../animation/audioBridge';
import { AudioContextRef } from './audio-context';

const FFT_SIZE = 64; // -> 32 frequency bins

/**
 * Owns the ambient <audio> element and a single Web Audio graph
 * (MediaElementSource -> AnalyserNode -> destination). The graph is built
 * lazily on the first user gesture (autoplay-safe) and reused for the
 * session. Exposes real frequency data so the visualizer reacts to sound.
 */
export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [available, setAvailable] = useState(false);

  const ensureGraph = useCallback(() => {
    if (ctxRef.current || !audioRef.current) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return; // graceful: visualizer falls back to idle animation
    try {
      const ctx = new AC();
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      setAvailable(true);
    } catch {
      /* MediaElementSource can throw if reused; stay in fallback mode */
    }
  }, []);

  const start = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    ensureGraph();
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    el.volume = 0.4;
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        setIsPlaying(true);
        try { sessionStorage.setItem(STORAGE_KEYS.audioOn, '1'); } catch { /* ignore */ }
      }).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
    }
  }, [ensureGraph]);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    setIsPlaying(false);
    try { sessionStorage.setItem(STORAGE_KEYS.audioOn, '0'); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  const getFrequencyData = useCallback((arr) => {
    const analyser = analyserRef.current;
    if (!analyser) return false;
    analyser.getByteFrequencyData(arr);
    return true;
  }, []);

  // Feed the shared audio bridge so any canvas scene can react to the spectrum.
  useEffect(() => {
    if (!isPlaying) {
      setAudioActive(false);
      return undefined;
    }
    const buf = new Uint8Array(FFT_SIZE / 2);
    const unsub = subscribe(() => {
      const analyser = analyserRef.current;
      if (!analyser) {
        setAudioActive(false);
        return;
      }
      analyser.getByteFrequencyData(buf);
      writeAudioBytes(buf);
    });
    return () => {
      unsub();
      setAudioActive(false);
    };
  }, [isPlaying]);

  const value = useMemo(
    () => ({
      isPlaying,
      start,
      stop,
      toggle,
      bins: FFT_SIZE / 2,
      getFrequencyData,
      available,
    }),
    [isPlaying, start, stop, toggle, getFrequencyData, available]
  );

  return (
    <AudioContextRef.Provider value={value}>
      <audio ref={audioRef} src={musicSrc} loop preload="none" crossOrigin="anonymous" />
      {children}
    </AudioContextRef.Provider>
  );
}

export default AudioProvider;
