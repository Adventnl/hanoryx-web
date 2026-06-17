// Magnetic vector field: a lattice of arrows that bend toward and swirl around the cursor (or a drifting idle attractor), with a faint expanding accent ripple at the pole.
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawVectorField } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('magnetic-vector', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  const d = clamp(density || 1, 0.5, 1.4);

  // arrow lattice spacing — coarser when static/low so the field reads cleanly
  const baseCell = quality === 'static' || quality === 'low' ? 64
    : quality === 'medium' ? 52 : 44;
  const cell = baseCell / d;

  // grid geometry, recomputed on resize (kept well under ~200 arrows/frame)
  let cols, rows, offX, offY, reach;
  const build = (w, h) => {
    W = w; H = h;
    cols = Math.min(26, Math.max(4, Math.floor(W / cell)));
    rows = Math.min(18, Math.max(3, Math.floor(H / cell)));
    offX = (W - (cols - 1) * cell) / 2;
    offY = (H - (rows - 1) * cell) / 2;
    reach = Math.hypot(W, H) * 0.42; // influence radius of the magnetic pole
  };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // faint backing field for depth — its own subtle ambient flow, no strong warp
      drawVectorField(ctx, { w: W, h: H, t: t * 0.4, cell: cell * 2, alpha: 0.04, accent: A });

      // locate the magnetic pole: cursor when present, otherwise a slow lissajous drift
      let px, py;
      if (p.active) {
        px = (p.nx + 1) * 0.5 * W;
        py = (p.ny + 1) * 0.5 * H;
      } else {
        px = W * (0.5 + 0.32 * Math.sin(t * 0.23));
        py = H * (0.5 + 0.26 * Math.cos(t * 0.31));
      }

      // alternating polarity gives the swirl direction a slow breathing reversal
      const polarity = Math.sin(t * 0.5) >= 0 ? 1 : -1;
      const len = cell * 0.4;

      // arrow lattice — each arrow blends an ambient ripple flow with magnetic pull+swirl
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offX + c * cell;
          const y = offY + r * cell;

          // ambient base angle: travelling wave so the field is alive without a cursor
          let ang = Math.sin(x * 0.012 + t * 0.7) + Math.cos(y * 0.012 - t * 0.6);
          let mag = 1;

          // magnetic influence: radial pull toward pole + tangential swirl around it
          const dx = px - x;
          const dy = py - y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const infl = clamp(1 - dist / reach, 0, 1);
          if (infl > 0) {
            const toward = Math.atan2(dy, dx);
            const tangent = toward + (Math.PI / 2) * polarity;
            // close to the pole the swirl dominates; far out the pull dominates
            const swirlMix = clamp(infl * 1.4, 0, 1);
            const fieldAng = lerp(toward, tangent, swirlMix);
            const w = infl * infl; // sharp falloff -> strong local warp, calm edges
            ang = lerp(ang, fieldAng, w);
            mag = lerp(1, 1.55, w);
          }

          const ex = x + Math.cos(ang) * len * mag;
          const ey = y + Math.sin(ang) * len * mag;

          // arrow shaft — brighter the more aligned to the pole
          ctx.lineWidth = 1;
          ctx.strokeStyle = white(lerp(0.07, 0.24, infl));
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          // arrow head: tiny chevron at the tip
          const back = ang + Math.PI;
          const hl = 3 + infl * 2;
          ctx.strokeStyle = infl > 0.35 ? A(lerp(0.12, 0.5, infl)) : white(0.16);
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(back + 0.4) * hl, ey + Math.sin(back + 0.4) * hl);
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(back - 0.4) * hl, ey + Math.sin(back - 0.4) * hl);
          ctx.stroke();
        }
      }

      // expanding accent ripple at the pole — one looping ring, sparse and premium
      const ripPhase = (t * 0.45) % 1;
      const ripR = ripPhase * reach * 0.6;
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = A((1 - ripPhase) * 0.4);
      ctx.beginPath();
      ctx.arc(px, py, ripR + 2, 0, TAU);
      ctx.stroke();

      // a fainter second ring offset in phase for a steady pulse
      const rip2 = (ripPhase + 0.5) % 1;
      ctx.strokeStyle = white((1 - rip2) * 0.12);
      ctx.beginPath();
      ctx.arc(px, py, rip2 * reach * 0.6 + 2, 0, TAU);
      ctx.stroke();

      // the pole core: red dot with a soft halo
      ctx.fillStyle = A(0.12);
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, TAU);
      ctx.fill();
      ctx.fillStyle = A(0.95);
      ctx.beginPath();
      ctx.arc(px, py, 2.6, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
