/* Canvas-side colour palette mirroring the CSS tokens. Canvas can't read CSS
   variables cheaply per frame, so scenes use these helpers. */

export const PALETTE = {
  void: '#020203',
  black: '#050505',
  white: '#ffffff',
  red: '#ff3333',
  redBright: '#ff4d4d',
};

export const white = (a = 1) => `rgba(255,255,255,${a})`;
export const red = (a = 1) => `rgba(255,51,51,${a})`;

/* Parse a #rrggbb accent into an rgba() helper so scenes honour per-section
   accents while defaulting to the system red. */
export function accentFn(hex = '#ff3333') {
  let r = 255;
  let g = 51;
  let b = 51;
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (m) {
    const int = parseInt(m[1], 16);
    r = (int >> 16) & 255;
    g = (int >> 8) & 255;
    b = int & 255;
  }
  return (a = 1) => `rgba(${r},${g},${b},${a})`;
}

/* Quality -> a particle/segment multiplier scenes apply to their density. */
export const QUALITY_SCALE = {
  static: 0.6,
  low: 0.5,
  medium: 0.8,
  high: 1,
};
