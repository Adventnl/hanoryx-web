/* TOPOLOGY PULSE — horizontal topographic contour lines crossed by a bright radial
   pulse ring that expands from a slowly drifting emitter, lifting nearby contours. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawContours } from '../primitives';
import { TAU, clamp } from '../../easing';

registerScene('topology-pulse', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let lines = 11;

  const build = (w, h) => {
    W = w;
    H = h;
    const scale = quality === 'low' || quality === 'static' ? 0.6 : quality === 'medium' ? 0.85 : 1;
    lines = Math.max(6, Math.round(13 * scale * density));
  };
  build(width, height);

  // contour height field — must mirror drawContours so the pulse can lift the right rows
  const contourY = (x, l, t) =>
    (H * (l + 0.5)) / lines +
    Math.sin(x * 0.006 + t * 0.5 + l * 0.6) * 22 +
    Math.sin(x * 0.013 - t * 0.3 + l) * 12;

  const PERIOD = 6.2; // seconds per pulse cycle

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // base contour field, faint and white
      drawContours(ctx, { w: W, h: H, t, lines, alpha: 0.085, accent: A });

      // emitter drifts slowly; pointer can steer it when active
      const drift = t * 0.18;
      let ex = W * (0.5 + Math.cos(drift) * 0.32);
      let ey = H * (0.5 + Math.sin(drift * 1.3) * 0.3);
      if (p.active) {
        ex = ex * 0.55 + p.x * 0.45;
        ey = ey * 0.55 + p.y * 0.45;
      }

      const phase = (t % PERIOD) / PERIOD; // 0..1
      const maxR = Math.hypot(W, H) * 0.62;
      const ringR = phase * maxR;
      const ringFade = 1 - phase; // fades as it expands
      const band = 56; // pixel thickness of the lit front

      // lift contour brightness where the pulse front crosses each line
      const step = W > 1200 ? 12 : 9;
      ctx.lineWidth = 1.4;
      for (let l = 0; l < lines; l += 1) {
        ctx.beginPath();
        let drawing = false;
        let peak = 0;
        for (let x = 0; x <= W; x += step) {
          const y = contourY(x, l, t);
          const dist = Math.hypot(x - ex, y - ey);
          const prox = clamp(1 - Math.abs(dist - ringR) / band, 0, 1);
          if (prox > 0.02) {
            if (!drawing) {
              ctx.moveTo(x, y);
              drawing = true;
            } else {
              ctx.lineTo(x, y);
            }
            if (prox > peak) peak = prox;
          } else if (drawing) {
            ctx.stroke();
            ctx.beginPath();
            drawing = false;
          }
        }
        if (drawing) ctx.stroke();
        if (peak > 0) {
          // re-stroke the lit segments brighter; accent only at the brightest front
          ctx.strokeStyle = peak > 0.6 ? A(0.28 * peak * ringFade + 0.06) : white(0.32 * peak * ringFade);
          ctx.stroke();
        }
      }

      // the pulse ring itself — sparse red, thin, fading
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = A(0.32 * ringFade);
      ctx.beginPath();
      ctx.arc(ex, ey, ringR, 0, TAU);
      ctx.stroke();

      // faint trailing echo ring
      const echoR = clamp(ringR - maxR * 0.16, 0, maxR);
      if (echoR > 4) {
        ctx.strokeStyle = white(0.06 * ringFade);
        ctx.beginPath();
        ctx.arc(ex, ey, echoR, 0, TAU);
        ctx.stroke();
      }

      // emitter core
      const corePulse = 0.5 + Math.sin(phase * TAU) * 0.5;
      ctx.fillStyle = A(0.5 + corePulse * 0.4);
      ctx.beginPath();
      ctx.arc(ex, ey, 2 + corePulse * 1.6, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
