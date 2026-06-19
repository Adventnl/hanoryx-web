import { createContext, useContext } from 'react';

/**
 * App-level "experience" state: the full-screen System Synthesis takeover.
 * Kept in its own module so the provider file exports only a component
 * (keeps React Fast Refresh happy).
 */
export const ExperienceContext = createContext({
  isSynthesisOpen: false,
  openSynthesis: () => {},
  closeSynthesis: () => {},
});

export function useExperience() {
  return useContext(ExperienceContext);
}
