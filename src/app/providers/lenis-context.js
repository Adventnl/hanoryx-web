import { createContext, useContext } from 'react';

/**
 * Shared access to the Lenis smooth-scroll instance and helpers.
 * Kept in its own module so the provider file exports only a component
 * (keeps React Fast Refresh happy).
 */
export const LenisContext = createContext({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
  getLenis: () => null,
});

export function useLenis() {
  return useContext(LenisContext);
}
