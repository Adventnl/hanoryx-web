/* PRIVACY QUIET GRID — a calm legal-page grid: a slow faint line grid, an occasional
   soft scan band drifting through long pauses, and a few slow-drifting tick marks that
   tick faintly red at their dwell points. Deliberately minimal, restrained motion. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawGrid, hash } from '../primitives';
import { clamp } from '../../easing';

registerScene('privacy-quiet-grid', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let cell = 72;
  let ticks = 4;

  const build = (w, h) => {
    W = w;
    H = h;
    const scale = quality === 'low' || quality === 'static' ? 0.7 : quality === 'medium' ? 0.88 : 1;
    cell = Math.max(48, Math.round(78 * scale / Math.max(0.7, density)));
    ticks = Math.max(3, Math.round(5 * density));
  };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // base quiet grid — very slow vertical drift, low alpha
      drawGrid(ctx, { w: W, h: H, t, cell, alpha: 0.045, scroll: 1.4, accent: A });

      // occasional scan: long quiet pauses with a single soft pass.
      // cycle period ~24s, the band only travels during a short window each cycle.
      const period = 24;
      const phase = (t % period) / period; // 0..1
      const window = 0.34; // fraction of the cycle the scan is moving
      if (phase < window) {
        const local = phase / window; // 0..1 sweep progress
        const fade = Math.sin(local * Math.PI); // ease in/out at the edges
        const y = local * H;
        const g = ctx.createLinearGradient(0, y - 80, 0, y + 80);
        g.addColorStop(0, white(0));
        g.addColorStop(0.5, white(0.06 * fade));
        g.addColorStop(1, white(0));
        ctx.fillStyle = g;
        ctx.fillRect(0, y - 80, W, 160);
        // a hairline leading edge with the faintest red tint
        ctx.strokeStyle = A(0.08 * fade);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // a couple of slow-drifting tick marks that crawl along grid lines
      ctx.lineWidth = 1;
      for (let k = 0; k < ticks; k += 1) {
        const seed = hash(k * 3.1 + 1);
        const lane = (0.12 + hash(k * 7.7 + 2) * 0.76) * W;
        const speed = 0.012 + seed * 0.018;
        const dir = k % 2 ? -1 : 1;
        let prog = (t * speed + seed) % 1;
        const ty = (dir > 0 ? prog : 1 - prog) * H;

        // dwell: ticks pause and faintly mark every so often along their path
        const dwell = Math.sin(t * 0.5 + k * 1.9) * 0.5 + 0.5;
        const mark = clamp((dwell - 0.92) * 12, 0, 1);

        ctx.strokeStyle = white(0.16);
        ctx.beginPath();
        ctx.moveTo(lane - 5, ty);
        ctx.lineTo(lane + 5, ty);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lane, ty - 5);
        ctx.lineTo(lane, ty + 5);
        ctx.stroke();

        if (mark > 0.01) {
          ctx.fillStyle = A(0.22 * mark);
          ctx.beginPath();
          ctx.arc(lane, ty, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // pointer leaves only the gentlest highlight — a soft cross at its position
      if (p.active) {
        ctx.strokeStyle = white(0.05);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, p.y);
        ctx.lineTo(W, p.y);
        ctx.moveTo(p.x, 0);
        ctx.lineTo(p.x, H);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
