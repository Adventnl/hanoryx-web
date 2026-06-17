import { registerScene } from '../sceneRegistry';
import { white, accentFn } from '../scenePalette';
import { TAU } from '../easing';

/* Rotating radar sweep with concentric rings and bearing ticks. */
registerScene('polar-radar', ({ ctx, width, height, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cx = W / 2;
  let cy = H / 2;
  let R = Math.min(W, H) * 0.46;

  const build = (w, h) => {
    W = w;
    H = h;
    cx = W / 2;
    cy = H / 2;
    R = Math.min(W, H) * 0.46;
  };
  build(width, height);

  const rings = Math.max(3, Math.round(4 * density));

  return {
    resize: (w, h) => build(w, h),
    draw({ time }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      // rings
      for (let i = 1; i <= rings; i += 1) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R * i) / rings, 0, TAU);
        ctx.strokeStyle = white(0.05);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // cross-hairs
      ctx.strokeStyle = white(0.04);
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.stroke();

      // bearing ticks
      for (let a = 0; a < TAU; a += TAU / 36) {
        const x1 = cx + Math.cos(a) * R;
        const y1 = cy + Math.sin(a) * R;
        const x2 = cx + Math.cos(a) * (R - 8);
        const y2 = cy + Math.sin(a) * (R - 8);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = white(0.08);
        ctx.stroke();
      }

      // sweep
      const ang = t * 0.9;
      const grad = ctx.createConicGradient ? ctx.createConicGradient(ang, cx, cy) : null;
      if (grad) {
        grad.addColorStop(0, A(0.28));
        grad.addColorStop(0.08, A(0));
        grad.addColorStop(1, A(0));
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, ang - 0.5, ang);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R);
      ctx.strokeStyle = A(0.5);
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // core
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, TAU);
      ctx.fillStyle = A(0.9);
      ctx.fill();
    },
    dispose() {},
  };
});
