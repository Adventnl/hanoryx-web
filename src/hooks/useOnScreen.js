import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether an element is on screen. Unlike useElementInView (one-shot
 * reveals) this keeps toggling, so loops, canvases and infinite animations can
 * pause the moment they scroll away. State is only set from the observer
 * callback.
 *
 *   const [ref, onScreen] = useOnScreen({ rootMargin: '120px' });
 */
export function useOnScreen({ rootMargin = '80px 0px', threshold = 0 } = {}) {
  const ref = useRef(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => setOnScreen(entries[entries.length - 1].isIntersecting),
      { rootMargin, threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, onScreen];
}

export default useOnScreen;
