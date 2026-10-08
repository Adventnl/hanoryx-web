import { useEffect } from 'react';
import { useFinePointer } from './useMediaQuery';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Pointer-proximity engine. Finds every `[data-prox]` unit inside `ref` and
 * keeps a CSS variable --k (0..1) on each: 1 under the cursor, easing to 0 at
 * `radius` px (smoothstep falloff). A single rAF loop runs only while a unit is
 * still moving; positions are measured once on enter and again only if the page
 * scrolls, never per pointer move. Does nothing on touch devices or under
 * reduced motion. `deps` re-binds when the units change.
 */
export function useProximity(ref, { radius = 220, deps = [] } = {}) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return undefined;
    const units = [...root.querySelectorAll('[data-prox]')];
    if (!units.length) return undefined;
    const state = new Float32Array(units.length);
    let centers = [];
    let pointer = null;
    let frame = 0;
    let measuredScroll = -1;

    const measure = () => {
      centers = units.map((u) => {
        const r = u.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
      measuredScroll = window.scrollY;
    };

    const tick = () => {
      frame = 0;
      if (pointer && Math.abs(window.scrollY - measuredScroll) > 1) measure();
      let moving = false;
      for (let i = 0; i < units.length; i += 1) {
        let target = 0;
        if (pointer) {
          const d = Math.hypot(pointer.x - centers[i][0], pointer.y - centers[i][1]);
          const t = Math.max(0, 1 - d / radius);
          target = t * t * (3 - 2 * t);
        }
        const next = state[i] + (target - state[i]) * 0.2;
        if (Math.abs(next - target) < 0.004) {
          if (state[i] !== target) units[i].style.setProperty('--k', target.toFixed(3));
          state[i] = target;
        } else {
          state[i] = next;
          units[i].style.setProperty('--k', next.toFixed(3));
          moving = true;
        }
      }
      if (moving) frame = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onEnter = (e) => {
      measure();
      pointer = { x: e.clientX, y: e.clientY };
      kick();
    };
    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      kick();
    };
    const onLeave = () => {
      pointer = null;
      kick();
    };
    const onScroll = () => {
      if (pointer) kick();
    };

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      units.forEach((u) => u.style.removeProperty('--k'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled, radius, ...deps]);
}

export default useProximity;
