/* Colour maths for the contrast tools: WCAG relative luminance, contrast ratio,
   and a search for the nearest foreground that passes. Plain functions, no DOM. */

/** '#abc', 'abc', '#aabbcc' -> [r, g, b], or null when it is not a hex colour. */
export function parseHex(value) {
  const h = String(value).trim().replace(/^#/, '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)) return null;
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

export const toHex = (rgb) => `#${rgb.map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('')}`;

const channel = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** The WCAG contrast ratio of two colours, from 1 (identical) to 21 (black on white). */
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function rgbToHsl([r, g, b]) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === R) h = (G - B) / d + (G < B ? 6 : 0);
  else if (max === G) h = (B - R) / d + 2;
  else h = (R - G) / d + 4;
  return [h * 60, s, l];
}

export function hslToRgb([h, s, l]) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/** The closest colour to `fg` (changing only its lightness) that reaches `target` against `bg`,
 *  looking both darker and lighter. Returns { darker, lighter }, either of which may be null. */
export function nearestPassing(fg, bg, target) {
  const [h, s, l] = rgbToHsl(fg);
  const scan = (dir) => {
    for (let step = 0; step <= 100; step += 1) {
      const nl = l + (dir * step) / 100;
      if (nl < 0 || nl > 1) return null;
      const rgb = hslToRgb([h, s, nl]).map(Math.round);
      if (contrastRatio(rgb, bg) >= target) return rgb;
    }
    return null;
  };
  return { darker: scan(-1), lighter: scan(1) };
}
