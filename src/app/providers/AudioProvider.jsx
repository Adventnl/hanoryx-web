import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { musicSrc } from '../../utils/assetResolver';
import { STORAGE_KEYS } from '../../utils/constants';
import { subscribe } from '../../animation/rafScheduler';
import { setAudioActive, writeAudioBytes } from '../../animation/audioBridge';
import { AudioContextRef } from './audio-context';

const FFT_SIZE = 64; // -> 32 frequency bins
const TARGET_VOLUME = 0.4;

/**
 * Owns the ambient <audio> element and a single Web Audio graph
 * (MediaElementSource -> AnalyserNode -> destination). The graph is built
 * lazily on the first user gesture (autoplay-safe) and reused for the
 * session. Exposes real frequency data so the visualizer reacts to sound.
 *
 * `status` is the single source of truth for every audio control on the site
 * (navbar, mobile menu, boot). It follows the <audio> element's own events —
 * not just our calls — so the controls stay correct when the browser pauses
 * playback, when the file is still loading, or when a play() request is
 * rejected by the autoplay policy:
 *
 *   idle     nothing playing (default)
 *   loading  play() was requested; waiting for the first audible frame
 *   playing  audible
 *   blocked  the browser refused play() (no user activation); press again
 *   error    the track failed to load
 */
export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const fadeRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [available, setAvailable] = useState(false);
  const isPlaying = status === 'playing';

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

  // Smooth volume ramp so playback eases in/out instead of clicking on.
  const fadeVolume = useCallback((to, seconds, onDone) => {
    const el = audioRef.current;
    if (!el) return;
    if (fadeRef.current) fadeRef.current.kill();
    const proxy = { v: el.volume };
    fadeRef.current = gsap.to(proxy, {
      v: to,
      duration: seconds,
      ease: 'power2.out',
      onUpdate: () => {
        el.volume = Math.max(0, Math.min(1, proxy.v));
      },
      onComplete: () => onDone?.(),
    });
  }, []);

  /**
   * Begin playback. MUST be called synchronously from a user gesture (a click
   * handler) so the browser grants activation. Resolves true when playback
   * started and false when it was refused — it never rejects.
   */
  const start = useCallback(() => {
    const el = audioRef.current;
    if (!el) return Promise.resolve(false);
    ensureGraph();
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    if (fadeRef.current) fadeRef.current.kill();
    el.volume = 0;
    setStatus((s) => (s === 'playing' ? s : 'loading'));

    let request;
    try {
      request = el.play();
    } catch {
      request = Promise.reject(new DOMException('play() threw', 'NotSupportedError'));
    }
    return Promise.resolve(request)
      .then(() => {
        setStatus('playing');
        fadeVolume(TARGET_VOLUME, 1.6);
        try { sessionStorage.setItem(STORAGE_KEYS.audioOn, '1'); } catch { /* ignore */ }
        return true;
      })
      .catch((error) => {
        // AbortError = we paused while play() was pending (user intent) — the
        // `pause` listener already settled the status.
        if (error && error.name === 'AbortError') return false;
        setStatus(error && error.name === 'NotAllowedError' ? 'blocked' : 'error');
        return false;
      });
  }, [ensureGraph, fadeVolume]);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    setStatus('idle');
    try { sessionStorage.setItem(STORAGE_KEYS.audioOn, '0'); } catch { /* ignore */ }
    if (el.paused) return;
    fadeVolume(0, 0.45, () => {
      // A new start() may have raced the fade-out; only pause if still silent.
      if (el.volume <= 0.01) el.pause();
    });
  }, [fadeVolume]);

  const toggle = useCallback(() => {
    if (status === 'playing' || status === 'loading') stop();
    else start();
  }, [status, start, stop]);

  // Keep `status` honest with what the <audio> element is really doing.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return undefined;
    const onPlaying = () => setStatus('playing');
    const onPause = () => setStatus((s) => (s === 'playing' ? 'idle' : s));
    const onError = () => setStatus('error');
    el.addEventListener('playing', onPlaying);
    el.addEventListener('pause', onPause);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('error', onError);
      if (fadeRef.current) fadeRef.current.kill();
    };
  }, []);

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
      status,
      isPlaying,
      start,
      stop,
      toggle,
      bins: FFT_SIZE / 2,
      getFrequencyData,
      available,
    }),
    [status, isPlaying, start, stop, toggle, getFrequencyData, available]
  );

  return (
    <AudioContextRef.Provider value={value}>
      <audio ref={audioRef} src={musicSrc} loop preload="none" crossOrigin="anonymous" />
      {children}
    </AudioContextRef.Provider>
  );
}

export default AudioProvider;
