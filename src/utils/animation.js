/* ============================================================
   ANIMATION UTILITIES — GSAP-friendly helpers (no JSX)
   ============================================================ */

/* Imperative reduced-motion check for non-hook contexts. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Split a string into an array of { char, isSpace } for kinetic text. */
export function splitChars(text) {
  return Array.from(String(text)).map((char) => ({
    char,
    isSpace: char === ' ',
  }));
}

/* Split a string into words (keeps spaces) for line/word reveals. */
export function splitWords(text) {
  return String(text).split(/(\s+)/).filter(Boolean);
}

/* Standard scroll-reveal vars used across ScrollReveal-style components. */
export const REVEAL_FROM = {
  y: 36,
  opacity: 0,
  filter: 'blur(8px)',
};
export const REVEAL_TO = {
  y: 0,
  opacity: 1,
  filter: 'blur(0px)',
  ease: 'power3.out',
  duration: 1.1,
};

/* Clamp helper. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* Linear interpolation. */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* Map a value from one range to another. */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + clamp(t, 0, 1) * (outMax - outMin);
}

/* Format a number for animated counters (keeps decimals tidy). */
export function formatCount(value, decimals = 0) {
  return Number(value).toFixed(decimals);
}
