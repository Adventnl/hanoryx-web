/* ============================================================
   CONSTANTS — shared JS-side values (mirror of CSS tokens)
   ============================================================ */

export const ROUTES = {
  home: '/',
  systems: '/systems',
  north: '/north',
  work: '/work',
  timeline: '/timeline',
  contact: '/contact',
};

export const STORAGE_KEYS = {
  bootComplete: 'hnx.boot.complete',
  audioOn: 'hnx.audio.on',
};

/* GSAP easings (string form) mirroring the CSS easing tokens. */
export const EASE = {
  out: 'power3.out',
  smooth: 'power4.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
};

/* Motion (framer) transition presets. */
export const SPRING = {
  soft: { type: 'spring', stiffness: 120, damping: 22, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 320, damping: 30 },
};

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.4,
};

export const BREAKPOINTS = {
  mobile: 720,
  tablet: 1024,
};

/* Default flow-field / particle configuration. */
export const FLOW_FIELD = {
  desktopCount: 80,
  mobileCount: 28,
  connectionDistance: 150,
  pointerRadius: 200,
  baseSpeed: 0.08,
};
