import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';
import { TAU } from '../easing';

/* Angular translucent glass panels — rotated quads with faint white gradient
   fills and crisp edges, drifting and parallaxing as layered glass. */
registerScene('glass-prism', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let panels = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const count = Math.max(3, Math.round(6 * (QUALITY_SCALE[q] ?? 1) * density));
    const span = Math.max(W, H);
    panels = Array.from({ length: count }, (_, i) => {
      const t = (i + 0.5) / count;
      return {
        // depth 0..1 — deeper panels are larger, fainter, parallax more
        depth: t,
        cx: W * (0.12 + Math.random() * 0.76),
        cy: H * (0.12 + Math.random() * 0.76),
        size: span * (0.16 + t * 0.34),
        // parallelogram defined by two edge vectors + a shear
        skew: -0.55 + Math.random() * 1.1,
        ratio: 0.45 + Math.random() * 0.85,
        rot: Math.random() * TAU,
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.012 + Math.random() * 0.02),
        driftX: (Math.random() - 0.5) * 6,
        driftY: (Math.random() - 0.5) * 6,
        phase: Math.random() * TAU,
        accent: i === count - 1,
      };
    });
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      const px = pointer && pointer.active ? pointer.nx : 0;
      const py = pointer && pointer.active ? pointer.ny : 0;

      for (let i = 0; i < panels.length; i += 1) {
        const p = panels[i];
        // slow drift + pointer parallax scaled by depth
        const par = 18 + p.depth * 46;
        const cx = p.cx + Math.sin(t * 0.12 + p.phase) * p.driftX + px * par;
        const cy = p.cy + Math.cos(t * 0.1 + p.phase) * p.driftY + py * par;
        const a = p.rot + t * p.spin;

        // edge vectors of the parallelogram
        const ux = Math.cos(a) * p.size;
        const uy = Math.sin(a) * p.size;
        const va = a + Math.PI / 2 + p.skew;
        const vx = Math.cos(va) * p.size * p.ratio;
        const vy = Math.sin(va) * p.size * p.ratio;

        const x0 = cx - ux * 0.5 - vx * 0.5;
        const y0 = cy - uy * 0.5 - vy * 0.5;
        const x1 = x0 + ux;
        const y1 = y0 + uy;
        const x2 = x1 + vx;
        const y2 = y1 + vy;
        const x3 = x0 + vx;
        const y3 = y0 + vy;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        // faint white linear-gradient fill across one diagonal
        const grad = ctx.createLinearGradient(x0, y0, x2, y2);
        const lit = 0.05 + p.depth * 0.07;
        grad.addColorStop(0, white(lit));
        grad.addColorStop(0.5, white(lit * 0.25));
        grad.addColorStop(1, white(0));
        ctx.fillStyle = grad;
        ctx.fill();

        // 1px edge
        ctx.lineWidth = 1;
        ctx.strokeStyle = p.accent ? A(0) : white(0.1 + p.depth * 0.08);
        ctx.stroke();

        // one red edge accent on the special panel — a single highlighted side
        if (p.accent) {
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = A(0.2 + Math.sin(t * 0.6 + p.phase) * 0.06 + 0.06);
          ctx.stroke();
        }
      }
    },
    dispose() {
      panels = null;
    },
  };
});
