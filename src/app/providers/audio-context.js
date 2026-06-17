import { createContext, useContext } from 'react';

/**
 * Shared audio control + analyser access. Lives in its own module so the
 * provider file exports only a component (Fast Refresh friendly).
 *
 * value: {
 *   isPlaying, start(), stop(), toggle(),
 *   bins,                       // number of frequency bins
 *   getFrequencyData(arr),      // fills a Uint8Array, returns true if live
 *   available,                  // Web Audio analyser available
 * }
 */
export const AudioContextRef = createContext({
  isPlaying: false,
  start: () => {},
  stop: () => {},
  toggle: () => {},
  bins: 32,
  getFrequencyData: () => false,
  available: false,
});

export function useAudio() {
  return useContext(AudioContextRef);
}
