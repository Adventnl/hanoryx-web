import { registerScene } from '../../sceneRegistry';
import { accentFn } from '../../scenePalette';
import { drawGrid, drawArcs, drawParticles } from '../primitives';
import { TAU } from '../../easing';

/* HOME CORE — the cinematic hero composite: a faint scrolling grid, a central
   arc/gate system that breathes, and a sparse particle field drifting over it.
   Pointer nudges the core. The most layered scene in the library. */
registerScene('home-core', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cx = W / 2;
  let cy = H / 2;
  let count = 60;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    cx = W / 2;
    cy = H * 0.5;
    const scale = q === 'low' || q === 'static' ? 0.5 : q === 'medium' ? 0.8 : 1;
    count = Math.round(70 * scale * density);
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const ox = p.active ? p.nx * 16 : 0;
      const oy = p.active ? p.ny * 16 : 0;

      drawGrid(ctx, { w: W, h: H, t, cell: 96, alpha: 0.035, scroll: 4 });

      ctx.save();
      ctx.translate(ox, oy);
      drawArcs(ctx, { cx, cy, t, count: 7, rStep: Math.min(W, H) * 0.06, alpha: 0.08, accent: A, accentRing: 2, spread: 0.7 });
      // core
      ctx.fillStyle = A(0.9);
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, TAU);
      ctx.fill();
      ctx.restore();

      drawParticles(ctx, { w: W, h: H, t, count, alpha: 0.32, accent: A, connect: false, speed: 0.6 });
    },
    dispose() {},
  };
});
