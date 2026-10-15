/* ============================================================
   SHOWCASE HOOKS — what the stages and the specimens are built from.

   Scroll-linked motion follows the site's rule: JavaScript writes plain numbers
   into CSS custom properties once per frame and CSS does the rest, so a stage
   never re-renders while it moves. The numbers a stage publishes are

     --p    0..1   the whole journey: 0 as the stage enters, 1 as it leaves
     --pin  0..1   while a pinned stage holds the screen (or, for a stage that
                   scrolls normally, where the middle of the screen sits among
                   its specimens)
     --f    float  --pin as a specimen index (0 .. n-1)
     --y    px     how far down the stage the middle of the screen is

   Anything that loops (a spinner, a ticker) runs only while its specimen is on
   screen and never under reduced motion; useLive / useTick do that gating.
   ============================================================ */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useLenis } from '../app/providers/lenis-context';

export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const pad2 = (n) => String(n).padStart(2, '0');
export const lerp = (a, b, t) => a + (b - a) * t;

/** A tiny deterministic generator, so generated shapes are identical on every
 *  render and every machine (and render can stay pure). */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A boolean and a way to flip it: [on, flip, set]. */
export function useToggle(init = false) {
  const [on, setOn] = useState(init);
  const flip = useCallback(() => setOn((v) => !v), []);
  return [on, flip, setOn];
}

/* ---- on-screen gating ----------------------------------------------------- */

let sharedObserver = null;
const watchers = new Map();

/** One IntersectionObserver for every specimen on the page. */
export function observeVisible(el, onChange) {
  if (!el || typeof IntersectionObserver === 'undefined') {
    onChange?.(true);
    return () => {};
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => watchers.get(e.target)?.(e.isIntersecting)),
      { rootMargin: '140px 0px' }
    );
  }
  watchers.set(el, onChange);
  sharedObserver.observe(el);
  return () => {
    watchers.delete(el);
    sharedObserver.unobserve(el);
  };
}

/** True while the specimen this runs inside is on (or near) the screen. */
export const SpecContext = createContext(true);
export const useLive = () => useContext(SpecContext);

/** A counter that advances every `ms` while the specimen is on screen. */
export function useTick(ms = 1000) {
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!live || reduced) return undefined;
    const id = window.setInterval(() => setN((v) => v + 1), ms);
    return () => window.clearInterval(id);
  }, [live, reduced, ms]);
  return n;
}

/** An index that walks a list of `len` items every `ms` while on screen. */
export function useCycle(len, ms = 1600) {
  return useTick(ms) % Math.max(1, len);
}

/* ---- dragging ----------------------------------------------------------------
   One hook for sliders, knobs and faders. It returns the value (0..1), the props
   to spread on the element, and a setter. The element becomes a slider: pointer
   drag, arrow keys, Home/End, and the ARIA a slider needs (give it an aria-label).

     mode 'x'   horizontal position inside the element
     mode 'y'   vertical position, bottom = 0
     mode 'r'   the angle around the element's centre, 0 at lower-left of the sweep
*/
export function useDrag({ mode = 'x', init = 0.5, steps = 0, range = 270, onChange } = {}) {
  const [v, setV] = useState(init);

  const set = useCallback((next) => {
    const c = clamp(next);
    const s = steps ? Math.round(c * steps) / steps : c;
    setV(s);
    if (onChange) onChange(s);
  }, [steps, onChange]);

  const read = (e, el) => {
    const r = el.getBoundingClientRect();
    if (mode === 'x') return (e.clientX - r.left) / r.width;
    if (mode === 'y') return 1 - (e.clientY - r.top) / r.height;
    const deg = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    return (deg + range / 2) / range;
  };

  const bind = {
    role: 'slider',
    tabIndex: 0,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': Math.round(v * 100),
    style: { touchAction: 'none' },
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      set(read(e, e.currentTarget));
    },
    onPointerMove: (e) => {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) set(read(e, e.currentTarget));
    },
    onKeyDown: (e) => {
      const step = { ArrowRight: 0.05, ArrowUp: 0.05, ArrowLeft: -0.05, ArrowDown: -0.05, PageUp: 0.2, PageDown: -0.2 }[e.key];
      if (step !== undefined) { e.preventDefault(); set(v + (steps ? Math.sign(step) / steps : step)); }
      else if (e.key === 'Home') { e.preventDefault(); set(0); }
      else if (e.key === 'End') { e.preventDefault(); set(1); }
    },
  };
  return [v, bind, set];
}

/* ---- the stage -------------------------------------------------------------- */

/** Lets the ending of a page send the stage somewhere: jump(i) scrolls to specimen i.
 *  The stage registers how; the page provides the context (see ShowcasePage). */
const noop = () => {};
export const StageApiContext = createContext({ register: noop, jump: noop });

/**
 * Publishes --p / --pin / --f for a stage (see the top of this file) and returns
 * the index of the specimen at the middle of the screen.
 *
 *   rootRef   the element whose journey is measured
 *   target    where the numbers are written (default: the root). Writing them
 *             on a small subtree keeps style recalculation off the specimens.
 *   pinned    the root is a tall track holding a sticky screen
 *   locate    (vh) => 0..1, for a layout the generic rules cannot read (a
 *             stack of sticky cards reports where they stuck, not where they are)
 *   count     how many specimens
 *   onFrame   ({ p, pin, f }) => void, called after the numbers are written, once
 *             per frame while the page moves: the place for a stage that needs
 *             more than CSS can work out (the canvas camera)
 */
export function useStageVars(rootRef, { count, pinned = false, target, locate, onFrame } = {}) {
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const api = useContext(StageApiContext);
  const [active, setActive] = useState(0);
  const frameRef = useRef(onFrame);
  useEffect(() => { frameRef.current = onFrame; });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const out = (target && target.current) || root;
    const specs = pinned ? [] : Array.from(root.querySelectorAll('[data-spec]'));
    let frame = 0;
    let lastIndex = -1;

    const measure = () => {
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh - r.top) / (r.height + vh));
      let pin;
      if (locate) {
        pin = clamp(locate(vh));
      } else if (pinned) {
        pin = clamp(-r.top / Math.max(1, r.height - vh));
      } else if (specs.length > 1) {
        const a = specs[0].getBoundingClientRect();
        const b = specs[specs.length - 1].getBoundingClientRect();
        const ca = a.top + a.height / 2;
        pin = clamp((vh / 2 - ca) / Math.max(1, b.top + b.height / 2 - ca));
      } else {
        pin = p;
      }
      return { p, pin };
    };

    const write = () => {
      frame = 0;
      const { p, pin } = measure();
      const f = pin * Math.max(0, count - 1);
      out.style.setProperty('--p', p.toFixed(4));
      out.style.setProperty('--pin', pin.toFixed(4));
      out.style.setProperty('--f', f.toFixed(3));
      out.style.setProperty('--y', clamp(window.innerHeight / 2 - root.getBoundingClientRect().top, 0, root.offsetHeight).toFixed(1));
      frameRef.current?.({ p, pin, f });
      const index = Math.round(f);
      if (index !== lastIndex) { lastIndex = index; setActive(index); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(write); };

    frame = requestAnimationFrame(write);
    if (!reduced) {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
    }
    document.fonts?.ready?.then(schedule);

    /* jump(i): where to scroll so that specimen i is the one in the middle */
    const jump = (i) => {
      const r = root.getBoundingClientRect();
      const top = r.top + window.scrollY;
      let y;
      if (pinned) y = top + (count > 1 ? (i / (count - 1)) * Math.max(1, r.height - window.innerHeight) : 0);
      else {
        const el = root.querySelectorAll('[data-spec]')[i];
        if (!el) return;
        const b = el.getBoundingClientRect();
        y = b.top + window.scrollY + b.height / 2 - window.innerHeight / 2;
      }
      lenis.scrollTo(y, { duration: 1.5 });
    };
    api.register(jump);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      api.register(noop);
    };
  }, [rootRef, target, count, pinned, locate, reduced, lenis, api]);

  return active;
}
