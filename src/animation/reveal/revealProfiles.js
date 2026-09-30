/* ============================================================
   REVEAL PROFILES — the component entrance vocabulary.

   Each profile is a Framer-Motion variant pair { hidden, show } describing a
   VISUALLY DISTINCT way for a component (box / panel / card / text / list item)
   to come into reality. The whole point of this file: blocks stop sharing one
   bottom-up fade. A block declares a profile per slot (entry / text / item) and
   the renderer animates with it.

   These are one-shot, in-view entrances (not loops) so transforms / clip / a
   little filter are cheap — PROVIDED they leave nothing behind. See
   `withHousekeeping` at the bottom: every profile is wrapped so that once its
   entrance finishes, `filter` / `clip-path` / `will-change` are reset instead of
   staying on the element for the life of the page. Catalogued in
   catalog/inventory.js.
   ============================================================ */
import { EASE, EASE_SMOOTH, SPRING } from './motionProfiles';

const T = (over = {}) => ({ duration: 0.78, ease: EASE, ...over });

const PROFILES = {
  /* ---------- baseline (kept as an explicit fallback only) ---------- */
  fadeUp: {
    hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: T({ duration: 0.9 }) },
  },

  /* ---------- directional slides (text / asides) ---------- */
  slideLeft: {
    hidden: { opacity: 0, x: -52 },
    show: { opacity: 1, x: 0, transition: T() },
  },
  slideRight: {
    hidden: { opacity: 0, x: 52 },
    show: { opacity: 1, x: 0, transition: T() },
  },
  skewIn: {
    hidden: { opacity: 0, x: -44, skewX: '-8deg' },
    show: { opacity: 1, x: 0, skewX: '0deg', transition: T({ duration: 0.7 }) },
  },
  settleDown: {
    hidden: { opacity: 0, y: -40 },
    show: { opacity: 1, y: 0, transition: T({ duration: 0.7 }) },
  },

  /* ---------- masked / scanned reveals ---------- */
  scanX: {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    show: { opacity: 1, clipPath: 'inset(0 0% 0 0)', transition: T({ duration: 0.7 }) },
  },
  scanXReverse: {
    hidden: { opacity: 0, clipPath: 'inset(0 0 0 100%)' },
    show: { opacity: 1, clipPath: 'inset(0 0 0 0%)', transition: T({ duration: 0.7 }) },
  },
  maskUp: {
    hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
    show: { opacity: 1, clipPath: 'inset(0% 0 0 0)', transition: T({ duration: 0.8 }) },
  },
  maskDown: {
    hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    show: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: T({ duration: 0.8 }) },
  },
  curtainSplit: {
    hidden: { opacity: 0, clipPath: 'inset(0 50% 0 50%)' },
    show: { opacity: 1, clipPath: 'inset(0 0% 0 0%)', transition: T({ duration: 0.85 }) },
  },

  /* ---------- depth / scale (rise from behind, not a y-fade) ---------- */
  depthRise: {
    hidden: { opacity: 0, scale: 0.82, y: 14 },
    show: { opacity: 1, scale: 1, y: 0, transition: T({ duration: 0.8 }) },
  },
  zoomThrough: {
    hidden: { opacity: 0, scale: 1.34 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE_SMOOTH } },
  },
  splitY: {
    hidden: { opacity: 0, scaleY: 0.12 },
    show: { opacity: 1, scaleY: 1, transition: T({ duration: 0.7 }) },
  },
  unfoldX: {
    hidden: { opacity: 0, scaleX: 0.12 },
    show: { opacity: 1, scaleX: 1, transition: T({ duration: 0.7 }) },
  },

  /* ---------- spring pops ---------- */
  radialPop: {
    hidden: { opacity: 0, scale: 0.62 },
    show: { opacity: 1, scale: 1, transition: SPRING.pop },
  },
  chipPop: {
    hidden: { opacity: 0, scale: 0.6, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: SPRING.snappy },
  },
  moduleSnap: {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 26 } },
  },

  /* ---------- rotation / 3D (cards, panels) ---------- */
  orbitalCard: {
    hidden: { opacity: 0, scale: 0.84, rotate: -8 },
    show: { opacity: 1, scale: 1, rotate: 0, transition: T({ duration: 0.8 }) },
  },
  riseRotate: {
    hidden: { opacity: 0, y: 42, rotate: -3 },
    show: { opacity: 1, y: 0, rotate: 0, transition: T({ duration: 0.8 }) },
  },
  flipIn: {
    hidden: { opacity: 0, rotateY: -74, transformPerspective: 900 },
    show: { opacity: 1, rotateY: 0, transformPerspective: 900, transition: T({ duration: 0.85 }) },
  },
  terminalOpen: {
    hidden: { opacity: 0, scaleY: 0.06, transformOrigin: 'top' },
    show: { opacity: 1, scaleY: 1, transformOrigin: 'top', transition: { duration: 0.6, ease: EASE_SMOOTH } },
  },

  /* ---------- "into reality" materializations ---------- */
  glassMaterialize: {
    hidden: { opacity: 0, scale: 1.06, filter: 'blur(16px)' },
    show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: T({ duration: 0.9 }) },
  },
  dataMaterialize: {
    hidden: { opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' },
    show: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: T({ duration: 0.85 }) },
  },
  realityAssemble: {
    hidden: { opacity: 0, scale: 1.18, rotate: 3, filter: 'blur(18px)' },
    show: { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)', transition: { duration: 1.0, ease: EASE_SMOOTH } },
  },
  blurFocus: {
    hidden: { opacity: 0, scale: 1.04, filter: 'blur(14px)' },
    show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: T({ duration: 0.7 }) },
  },

  /* ---------- diagonal / redaction ---------- */
  diagonalSlice: {
    hidden: { opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
    show: { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transition: T({ duration: 0.8 }) },
  },
  redactedUnlock: {
    hidden: { opacity: 0.15, clipPath: 'inset(0 0 0 100%)' },
    show: { opacity: 1, clipPath: 'inset(0 0 0 0%)', transition: { duration: 0.7, ease: EASE_SMOOTH } },
  },

  /* ---------- list / step / stat ---------- */
  nodeSequence: {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0, transition: T({ duration: 0.55 }) },
  },
  stepActivate: {
    hidden: { opacity: 0, x: -30, scale: 0.97 },
    show: { opacity: 1, x: 0, scale: 1, transition: T({ duration: 0.6 }) },
  },
  countRise: {
    hidden: { opacity: 0, y: 26, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: T({ duration: 0.7 }) },
  },
  bracketIn: {
    hidden: { opacity: 0, scale: 0.92, y: 12, filter: 'blur(4px)' },
    show: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: T({ duration: 0.75 }) },
  },
  depthStackRise: {
    hidden: { opacity: 0, y: 54, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: T({ duration: 0.85 }) },
  },
  hexCellForm: {
    hidden: { opacity: 0, scale: 0.7, rotate: -6 },
    show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  },
};

/* ---------- housekeeping ----------
   Motion leaves the LAST animated value inline on the element. Without this
   every revealed card/paragraph would keep `filter: blur(0px)`,
   `clip-path: inset(0%)` and a `will-change` hint forever — each one a separate
   compositor layer / filter surface (145 layers on the Home page before this).
   The hint is held only while the element is hidden or animating, and
   `transitionEnd` swaps the rest for their "off" values the moment the
   entrance completes. `none` is visually identical to the settled state. */
const WILL_CHANGE_PROP = { opacity: 'opacity', clipPath: 'clip-path', filter: 'filter' };

/* will-change for ONLY the properties a profile actually animates. Declaring
   `transform` for a clip-path-only reveal promotes a transform layer that
   desyncs from the animating clip on Firefox — the reveal "jumps". */
const willChangeFor = (hidden) =>
  [...new Set(Object.keys(hidden).map((key) => WILL_CHANGE_PROP[key] || 'transform'))].join(', ');

function withHousekeeping({ hidden, show }) {
  const done = { willChange: 'auto' };
  if ('filter' in hidden) done.filter = 'none';
  if ('clipPath' in hidden) done.clipPath = 'none';
  return {
    hidden: { ...hidden, willChange: willChangeFor(hidden) },
    show: { ...show, transitionEnd: done },
  };
}

export const revealProfiles = Object.fromEntries(
  Object.entries(PROFILES).map(([name, profile]) => [name, withHousekeeping(profile)])
);

/* Stagger container — generic; per-block tuning via props. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/* Apply a per-instance delay without losing the profile's own easing. */
export function withDelay(variant, delay = 0) {
  if (!delay) return variant;
  return {
    hidden: variant.hidden,
    show: { ...variant.show, transition: { ...(variant.show.transition || {}), delay } },
  };
}
