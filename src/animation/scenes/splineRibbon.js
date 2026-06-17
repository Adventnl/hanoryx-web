import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';

/* Flowing bezier ribbons drifting across the field — a data stream. */
registerScene('spline-ribbon', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let ribbons = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const count = Math.max(2, Math.round(4 * (QUALITY_SCALE[q] ?? 1) * density));
    ribbons = Array.from({ length: count }, (_, i) => ({
      y: (H / (count + 1)) * (i + 1),
      amp: 30 + Math.random() * 50,
      speed: 0.18 + Math.random() * 0.22,
      phase: Math.random() * 10,
      accent: i === Math.floor(count / 2),
    }));
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      for (let r = 0; r < ribbons.length; r += 1) {
        const rb = ribbons[r];
        const segs = 6;
        ctx.beginPath();
        for (let s = 0; s <= segs; s += 1) {
          const x = (W / segs) * s;
          const y = rb.y + Math.sin(s * 0.9 + t * rb.speed + rb.phase) * rb.amp;
          if (s === 0) ctx.moveTo(x, y);
          else {
            const px = (W / segs) * (s - 1);
            const py = rb.y + Math.sin((s - 1) * 0.9 + t * rb.speed + rb.phase) * rb.amp;
            const cx = (px + x) / 2;
            ctx.bezierCurveTo(cx, py, cx, y, x, y);
          }
        }
        ctx.lineWidth = rb.accent ? 1.6 : 1;
        ctx.strokeStyle = rb.accent ? A(0.22) : white(0.08);
        ctx.stroke();

        // travelling node
        const tx = (t * rb.speed * 60) % W;
        const ty = rb.y + Math.sin((tx / W) * segs * 0.9 + t * rb.speed + rb.phase) * rb.amp;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.2, 0, 6.283);
        ctx.fillStyle = A(0.8);
        ctx.fill();
      }
    },
    dispose() {
      ribbons = null;
    },
  };
});
