import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './CursorField.module.css';

/**
 * Additive cursor accent — a trailing ring + precise dot that follows the
 * pointer and expands over interactive targets. The native cursor stays
 * visible (accessibility). Renders only on fine pointers and not under
 * reduced motion.
 */
export function CursorField() {
  const ring = useRef(null);
  const dot = useRef(null);
  const reduced = usePrefersReducedMotion();
  const enabled =
    !reduced &&
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches;

  useEffect(() => {
    if (!enabled) return undefined;

    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3.out' });
    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power2.out' });

    const move = (e) => {
      ringX(e.clientX); ringY(e.clientY);
      dotX(e.clientX); dotY(e.clientY);
    };
    const over = (e) => {
      const interactive = e.target.closest?.('a, button, [data-cursor], input, textarea');
      ring.current?.classList.toggle(styles.active, Boolean(interactive));
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ring} className={styles.ring} aria-hidden="true" />
      <div ref={dot} className={styles.dot} aria-hidden="true" />
    </>
  );
}

export default CursorField;
