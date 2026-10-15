/* ============================================================
   POINTER VARS — an area that publishes where the pointer is as two custom
   properties, --x and --y (0 to 1), so a stylesheet can build an effect from
   them without anything re-rendering as the pointer moves.

   While nobody is pointing (and the specimen is on screen, and motion is not
   reduced) a virtual pointer wanders on a slow curve, so the effect is never
   still; the arrow keys move it by hand and keep it there until the area loses
   focus. Used by the cursors and lenses pages.
   ============================================================ */
import { useCallback, useEffect, useRef } from 'react';
import { clamp, useLive } from './hooks';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/** Returns [ref, bind]: put `ref` on the area and spread `bind` on it. */
export function usePointer(auto = true) {
  const ref = useRef(null);
  const inside = useRef(false);
  const live = useLive();
  const reduced = usePrefersReducedMotion();

  const put = useCallback((x, y) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--x', x.toFixed(4));
    el.style.setProperty('--y', y.toFixed(4));
  }, []);

  useEffect(() => {
    if (!auto || !live || reduced) return undefined;
    let raf = 0;
    let last = 0;
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (inside.current || t - last < 33) return;
      last = t;
      put(0.5 + 0.34 * Math.sin(t / 900), 0.5 + 0.3 * Math.sin(t / 1300 + 1));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto, live, reduced, put]);

  const bind = {
    onPointerMove: (e) => {
      inside.current = true;
      const r = e.currentTarget.getBoundingClientRect();
      put(clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height));
    },
    onPointerLeave: () => { inside.current = false; },
    onBlur: () => { inside.current = false; },
    onKeyDown: (e) => {
      const d = { ArrowLeft: [-0.06, 0], ArrowRight: [0.06, 0], ArrowUp: [0, -0.06], ArrowDown: [0, 0.06] }[e.key];
      if (!d) return;
      e.preventDefault();
      inside.current = true;
      const el = e.currentTarget;
      put(clamp(parseFloat(el.style.getPropertyValue('--x') || 0.5) + d[0]), clamp(parseFloat(el.style.getPropertyValue('--y') || 0.5) + d[1]));
    },
  };
  return [ref, bind];
}

export default usePointer;
