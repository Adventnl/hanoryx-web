import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, active] where `active` is true while the element is in (or
 * near) the viewport. Used to pause offscreen scenes and gate reveals.
 * `once` keeps it true after the first intersection (for content reveals).
 */
export function useViewportActive({ rootMargin = '200px', threshold = 0, once = false } = {}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (once) io.disconnect();
        } else if (!once) {
          setActive(false);
        }
      },
      { rootMargin, threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, active];
}

export default useViewportActive;
