import { createContext, useContext } from 'react';

/**
 * Shared audio control + analyser access. Lives in its own module so the
 * provider file exports only a component (Fast Refresh friendly).
 *
 * value: {
 *   status,                     // 'idle' | 'loading' | 'playing' | 'blocked' | 'error'
 *   isPlaying,                  // status === 'playing'
 *   start(): Promise<boolean>,  // call from a user gesture; never rejects
 *   stop(), toggle(),
 *   bins,                       // number of frequency bins
 *   getFrequencyData(arr),      // fills a Uint8Array, returns true if live
 *   available,                  // Web Audio analyser available
 * }
 */
export const AudioContextRef = createContext({
  status: 'idle',
  isPlaying: false,
  start: () => Promise.resolve(false),
  stop: () => {},
  toggle: () => {},
  bins: 32,
  getFrequencyData: () => false,
  available: false,
});

export function useAudio() {
  return useContext(AudioContextRef);
}
