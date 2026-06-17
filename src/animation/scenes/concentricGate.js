import { registerScene } from '../sceneRegistry';
import { white, accentFn } from '../scenePalette';
import { TAU } from '../easing';

/* Concentric gate rings that draw open in staggered arcs — portal / hero core. */
registerScene('concentric-gate', ({ ctx, width, height, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cx = W / 2;
  let cy = H / 2;
  let maxR = Math.min(W, H) * 0.48;

  const build = (w, h) => {
    W = w;
    H = h;
    cx = W / 2;
    cy = H / 2;
    maxR = Math.min(W, H) * 0.48;
  };
  build(width, height);

  const ringCount = Math.max(4, Math.round(7 * density));

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const pr = pointer || {};
      const ox = pr.active ? pr.nx * 10 : 0;
      const oy = pr.active ? pr.ny * 10 : 0;

      for (let i = 0; i < ringCount; i += 1) {
        const r = (maxR / ringCount) * (i + 1);
        const span = (Math.sin(t * 0.4 + i * 0.7) * 0.5 + 0.5) * TAU * 0.7 + 0.3;
        const rot = t * (i % 2 ? -0.2 : 0.2) + i;
        const accentRing = i === 2;
        ctx.beginPath();
        ctx.arc(cx + ox, cy + oy, r, rot, rot + span);
        ctx.lineWidth = accentRing ? 1.6 : 1;
        ctx.strokeStyle = accentRing ? A(0.3) : white(0.08);
        ctx.stroke();

        // endpoint node
        const ex = cx + ox + Math.cos(rot + span) * r;
        const ey = cy + oy + Math.sin(rot + span) * r;
        ctx.beginPath();
        ctx.arc(ex, ey, accentRing ? 2.6 : 1.6, 0, TAU);
        ctx.fillStyle = accentRing ? A(0.9) : white(0.5);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(cx + ox, cy + oy, 4, 0, TAU);
      ctx.fillStyle = A(0.9);
      ctx.fill();
    },
    dispose() {},
  };
});
