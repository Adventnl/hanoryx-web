import { useEffect } from 'react';
import { useFinePointer } from './useMediaQuery';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Writes the pointer's position INSIDE an element to CSS variables, so any
 * descendant can respond with pure CSS (transforms, gradients, parallax).
 *
 *   --px / --py   0..1 across the element (0.5 at rest)
 *   --mx / --my   the same position in pixels
 *   data-hot      present while the pointer is over the element
 *
 * No React state, one rAF-throttled write per frame. The variables are
 * registered with @property (styles/fx.css) so a transition on them turns the
 * pointer's jumps into a soft follow — and into a smooth return to rest when
 * the pointer leaves. Does nothing on touch devices or under reduced motion.
 */
export function usePointerField(ref, { enabled = true } = {}) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const active = enabled && fine && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return undefined;
    let frame = 0;
    let last = null;

    const write = () => {
      frame = 0;
      if (!last) return;
      const rect = el.getBoundingClientRect();
      const x = last.clientX - rect.left;
      const y = last.clientY - rect.top;
      el.style.setProperty('--px', (x / rect.width).toFixed(3));
      el.style.setProperty('--py', (y / rect.height).toFixed(3));
      el.style.setProperty('--mx', `${x.toFixed(1)}px`);
      el.style.setProperty('--my', `${y.toFixed(1)}px`);
    };
    const onMove = (event) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onEnter = () => el.setAttribute('data-hot', '');
    const onLeave = () => {
      last = null;
      el.removeAttribute('data-hot');
      el.style.setProperty('--px', '0.5');
      el.style.setProperty('--py', '0.5');
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeAttribute('data-hot');
    };
  }, [ref, active]);
}

export default usePointerField;
