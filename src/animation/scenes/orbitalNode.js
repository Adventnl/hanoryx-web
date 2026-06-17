import { registerScene } from '../sceneRegistry';
import { accentFn, white, QUALITY_SCALE } from '../scenePalette';
import { TAU } from '../easing';

/* Concentric orbits of nodes circling a core — multi-role / system map feel. */
registerScene('orbital-node', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let rings = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const ringCount = Math.max(3, Math.round(5 * (QUALITY_SCALE[q] ?? 1)));
    const base = Math.min(W, H) * 0.12;
    rings = Array.from({ length: ringCount }, (_, i) => {
      const radius = base + i * (Math.min(W, H) * 0.072);
      const nodes = Math.max(3, Math.round((3 + i) * density));
      return {
        radius,
        speed: (i % 2 ? -1 : 1) * (0.06 + i * 0.012),
        offset: Math.random() * TAU,
        nodes,
        accent: i === 1,
      };
    });
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const pr = pointer || {};
      const cx = W * 0.5 + (pr.active ? pr.nx * 14 : 0);
      const cy = H * 0.5 + (pr.active ? pr.ny * 14 : 0);

      for (let r = 0; r < rings.length; r += 1) {
        const ring = rings[r];
        ctx.beginPath();
        ctx.strokeStyle = white(0.05);
        ctx.lineWidth = 1;
        ctx.arc(cx, cy, ring.radius, 0, TAU);
        ctx.stroke();

        for (let n = 0; n < ring.nodes; n += 1) {
          const ang = ring.offset + t * ring.speed + (n / ring.nodes) * TAU;
          const x = cx + Math.cos(ang) * ring.radius;
          const y = cy + Math.sin(ang) * ring.radius;
          ctx.beginPath();
          ctx.arc(x, y, ring.accent && n === 0 ? 3 : 1.8, 0, TAU);
          ctx.fillStyle = ring.accent && n === 0 ? A(0.9) : white(0.55);
          ctx.fill();
        }
      }

      // core
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, TAU);
      ctx.fillStyle = A(0.9);
      ctx.fill();
    },
    dispose() {
      rings = null;
    },
  };
});
