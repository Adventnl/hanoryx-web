import { useCallback, useEffect, useRef, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Controls a single ambient <audio> element.
 * Audio NEVER autoplays — it only starts in response to a user gesture
 * (the boot START button or the audio toggle). Preference persists for
 * the session so navigation does not restart the track.
 *
 * Returns:
 *   audioRef   — attach to an <audio> element
 *   isPlaying  — boolean
 *   start()    — begin playback (call from a user gesture)
 *   stop()     — pause
 *   toggle()   — flip playback state
 */
export function useAudioController({ volume = 0.4 } = {}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    const result = el.play();
    if (result && typeof result.then === 'function') {
      result
        .then(() => {
          setIsPlaying(true);
          try { sessionStorage.setItem(STORAGE_KEYS.audioOn, '1'); } catch { /* ignore */ }
        })
        .catch(() => setIsPlaying(false)); // blocked by autoplay policy — stay muted
    } else {
      setIsPlaying(true);
    }
  }, [volume]);

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

  // Keep the element volume in sync.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return { audioRef, isPlaying, start, stop, toggle };
}

export default useAudioController;
