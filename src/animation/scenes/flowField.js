import { registerScene } from '../sceneRegistry';
import { accentFn, white, QUALITY_SCALE } from '../scenePalette';
import { flowAngle } from '../easing';

/* Optimized particle flow field with pointer displacement. Trails via a low
   alpha fill over the (near-black) section. Density scales with quality. */
registerScene('flow-field', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let ps = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const count = Math.max(24, Math.round(((w * h) / 13000) * (QUALITY_SCALE[q] ?? 1) * density));
    ps = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.4,
      red: Math.random() < 0.05,
    }));
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.00018;
      ctx.fillStyle = 'rgba(2,2,3,0.16)';
      ctx.fillRect(0, 0, W, H);

      const pr = pointer || {};
      const px = pr.active ? pr.x : -9999;
      const py = pr.active ? pr.y : -9999;

      for (let i = 0; i < ps.length; i += 1) {
        const p = ps[i];
        const a = flowAngle(p.x, p.y, t);
        p.x += Math.cos(a) * 0.5;
        p.y += Math.sin(a) * 0.5;

        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) {
          const d = Math.sqrt(d2) || 1;
          p.x += (dx / d) * 1.3;
          p.y += (dy / d) * 1.3;
        }

        if (p.x < -10) p.x = W + 10;
        else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        else if (p.y > H + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = p.red ? A(0.85) : white(0.5);
        ctx.fill();
      }
    },
    dispose() {
      ps = null;
    },
  };
});
