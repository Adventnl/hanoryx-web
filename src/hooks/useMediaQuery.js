import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query without effect-driven state (so it is safe
 * under the React 19 lint rules and never causes a cascading render).
 */
export function useMediaQuery(query, serverDefault = false) {
  const subscribe = useCallback(
    (notify) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    [query]
  );
  const getSnapshot = useCallback(
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : serverDefault),
    [query, serverDefault]
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => serverDefault);
}

/** True for a mouse / trackpad (hover-capable, precise). Touch gets simpler, tap-first behaviour. */
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

export default useMediaQuery;
