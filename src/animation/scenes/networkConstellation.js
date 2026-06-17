import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';
import { TAU } from '../easing';

/* Connected graph with light physics drift — a constellation / service map.
   Connections use a spatial cap (nearest by distance) to stay cheap. */
registerScene('network-constellation', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let nodes = [];
  let linkDist = 150;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const count = Math.max(14, Math.round(((w * h) / 26000) * (QUALITY_SCALE[q] ?? 1) * density));
    linkDist = q === 'low' ? 120 : 155;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      red: Math.random() < 0.08,
    }));
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ pointer }) {
      ctx.clearRect(0, 0, W, H);
      const pr = pointer || {};
      const px = pr.active ? pr.x : -9999;
      const py = pr.active ? pr.y : -9999;
      const max2 = linkDist * linkDist;

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < max2) {
            const op = (1 - d2 / max2) * 0.16;
            ctx.beginPath();
            ctx.strokeStyle = white(op);
            ctx.lineWidth = 0.7;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const mdx = a.x - px;
        const mdy = a.y - py;
        const near = mdx * mdx + mdy * mdy < 12000;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.red ? 2.4 : 1.6, 0, TAU);
        ctx.fillStyle = a.red || near ? A(0.85) : white(0.5);
        ctx.fill();
      }
    },
    dispose() {
      nodes = null;
    },
  };
});
