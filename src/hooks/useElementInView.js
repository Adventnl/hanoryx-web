import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver wrapper for cheap "is this on screen" reveals.
 *
 * Usage:
 *   const [ref, inView] = useElementInView({ threshold: 0.2, once: true });
 *   <div ref={ref} className={inView ? 'is-visible' : ''} />
 *
 * Options:
 *   threshold   — IO threshold (default 0.15)
 *   rootMargin  — IO rootMargin (default '0px 0px -10% 0px')
 *   once        — stop observing after first intersection (default true)
 */
export function useElementInView(options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -10% 0px',
    once = true,
  } = options;

  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true); // graceful fallback: assume visible
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

export default useElementInView;
