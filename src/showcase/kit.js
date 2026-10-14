/* ============================================================
   SHOWCASE KIT — the small pieces several pages share: pointer-and-keyboard
   hooks for charts and grids, and the geometry helpers behind generated shapes.
   Everything here is pure or a hook; nothing draws.
   ============================================================ */
import { useState } from 'react';
import { clamp, rng } from './hooks';

/* ---- generated data ---- */
export const f1 = (n) => +n.toFixed(1);

/** n values between lo and hi, the same on every render for the same seed. */
export const series = (n, seed, lo = 0.15, hi = 0.95) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => lo + r() * (hi - lo));
};
export const smooth3 = (a) => a.map((v, i) => (v + (a[i - 1] ?? v) + (a[i + 1] ?? v)) / 3);

/* ---- geometry (angles run clockwise from twelve o'clock) ---- */
export const polar = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [f1(cx + Math.sin(a) * r), f1(cy - Math.cos(a) * r)];
};
export const arc = (cx, cy, r, from, to) => {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  return `M${x1} ${y1}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};
export const sector = (cx, cy, r0, r1, a0, a1) => {
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0}A${r1} ${r1} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${big} 0 ${x3} ${y3}Z`;
};
export const pts = (v, w = 100, h = 50, top = 4) => v.map((y, i) => [f1((i * w) / (v.length - 1)), f1(h - y * (h - top))]);
export const poly = (p) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
/** a smooth curve through the points (Catmull-Rom turned into cubic segments) */
export const curve = (p) => p.reduce((d, [x, y], i) => {
  if (!i) return `M${x} ${y}`;
  const [x0, y0] = p[i - 2] || p[i - 1];
  const [x1, y1] = p[i - 1];
  const [x3, y3] = p[i + 1] || p[i];
  return `${d}C${f1(x1 + (x - x0) / 6)} ${f1(y1 + (y - y0) / 6)} ${f1(x - (x3 - x1) / 6)} ${f1(y - (y3 - y1) / 6)} ${x} ${y}`;
}, '');
export const areaOf = (p, h = 50) => `${curve(p)}L${p[p.length - 1][0]} ${h}L${p[0][0]} ${h}Z`;

/* ---- pointer + keyboard ---- */

/** Moving a pointer along an element picks the nth of `n` slices of it (or, with
 *  `edges`, the slice between cumulative 0..1 boundaries); arrow keys do the same.
 *  Returns [index (-1 for none), props to spread on the element]. */
export function useScan(n, { axis = 'x', label, edges } = {}) {
  const [i, setI] = useState(-1);
  const at = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const v = clamp(axis === 'x' ? (e.clientX - r.left) / r.width : (e.clientY - r.top) / r.height, 0, 0.9999);
    setI(edges ? edges.findIndex((x) => v < x) : Math.floor(v * n));
  };
  const bind = {
    role: 'slider',
    tabIndex: 0,
    'aria-valuemin': 0,
    'aria-valuemax': n,
    'aria-valuenow': i + 1,
    'aria-valuetext': i < 0 ? 'nothing selected' : label(i),
    style: { touchAction: axis === 'x' ? 'pan-y' : 'pan-x' },
    onPointerMove: at,
    onPointerDown: at,
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') setI(-1); },
    onBlur: () => setI(-1),
    onKeyDown: (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (d) { e.preventDefault(); setI((k) => clamp(k < 0 ? (d > 0 ? 0 : n - 1) : k + d, 0, n - 1)); }
      if (e.key === 'Escape') setI(-1);
    },
  };
  return [i, bind];
}

/** The same for a grid: [row, col] under the pointer (or the arrow keys), and
 *  `onPick(row, col)` on a click or Enter / Space. Put the props on an element
 *  with `aria-label`; the cells inside are drawn by the caller. */
export function useCell(rows, cols, onPick) {
  const [at, setAt] = useState([-1, -1]);
  const cellOf = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [Math.floor(clamp((e.clientY - r.top) / r.height, 0, 0.9999) * rows), Math.floor(clamp((e.clientX - r.left) / r.width, 0, 0.9999) * cols)];
  };
  const bind = {
    role: 'application',
    'aria-roledescription': 'grid',
    tabIndex: 0,
    style: { touchAction: 'pan-y' },
    onPointerMove: (e) => {
      const [r, k] = cellOf(e);
      setAt((p) => (p[0] === r && p[1] === k ? p : [r, k]));
    },
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') setAt([-1, -1]); },
    onBlur: () => setAt([-1, -1]),
    onClick: onPick ? (e) => { const [r, k] = cellOf(e); setAt([r, k]); onPick(r, k); } : undefined,
    onKeyDown: (e) => {
      const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
      if (d) {
        e.preventDefault();
        setAt(([r, k]) => [clamp(r < 0 ? 0 : r + d[0], 0, rows - 1), clamp(k < 0 ? 0 : k + d[1], 0, cols - 1)]);
      } else if (onPick && (e.key === 'Enter' || e.key === ' ') && at[0] >= 0) {
        e.preventDefault();
        onPick(at[0], at[1]);
      } else if (e.key === 'Escape') setAt([-1, -1]);
    },
  };
  return [at, bind];
}

/** A button that wants to be hovered: hover for a mouse, a tap for touch, Enter for a keyboard. */
export function useHot() {
  const [hot, setHot] = useState(false);
  const bind = {
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') setHot(true); },
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') setHot(false); },
    onPointerDown: (e) => { if (e.pointerType !== 'mouse') setHot((h) => !h); },
    onClick: (e) => { if (e.detail === 0) setHot((h) => !h); },
    onBlur: () => setHot(false),
  };
  return [hot, bind];
}
