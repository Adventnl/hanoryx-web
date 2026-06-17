/* Math helpers shared by canvas scenes and JS-driven motion. */

export const TAU = Math.PI * 2;

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
export const lerp = (a, b, t) => a + (b - a) * t;
export const mapRange = (v, a1, b1, a2, b2) => a2 + ((v - a1) / (b1 - a1)) * (b2 - a2);

export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

/* Cheap, allocation-free 2D value noise (good enough for organic drift). */
export function pseudoNoise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

/* Smooth flow angle from a position + time — the backbone of flow fields. */
export function flowAngle(x, y, t) {
  return (
    Math.sin(x * 0.0016 + t) * 1.3 +
    Math.cos(y * 0.0016 - t * 0.8) * 1.3 +
    Math.sin((x + y) * 0.001 + t * 0.4)
  );
}
