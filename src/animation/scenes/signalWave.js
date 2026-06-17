import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp, lerp } from '../easing';

/* Oscilloscope signal — a centered horizontal waveform of summed sines that
   scrolls continuously over a faint grid, flanked by two fainter secondary
   waves, with a red leading dot tracing the main trace. */
registerScene('signal-wave', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let step = 8;
  let gridX = 90;
  let amp = 36;
  let ampEased = 0.5;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] ?? 1;
    step = q === 'low' || q === 'static' ? 14 : q === 'medium' ? 10 : 7;
    gridX = clamp(W / Math.max(6, Math.round(12 * scale * density)), 60, 160);
    amp = clamp(Math.min(W, H) * 0.05, 22, 52);
  };
  build(width, height);

  /* Summed-sine signal sample at normalised position p (0..1) and time t. */
  const signal = (p, t, a) =>
    Math.sin(p * TAU * 2.2 + t * 1.3) * a +
    Math.sin(p * TAU * 5.7 - t * 0.9) * (a * 0.34) +
    Math.sin(p * TAU * 11.4 + t * 1.9) * (a * 0.14);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      const midY = H * 0.5;
      const pr = pointer || {};
      const target = pr.active ? clamp(0.5 - pr.ny * 0.55, 0.1, 1) : 0.5;
      ampEased = lerp(ampEased, target, 0.05);
      const a = amp * (0.6 + ampEased);

      /* Faint grid baseline. */
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.035);
      ctx.beginPath();
      for (let gx = (t * 14) % gridX; gx <= W; gx += gridX) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
      }
      const gridY = gridX;
      for (let gy = midY % gridY; gy <= H; gy += gridY) {
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
      }
      ctx.stroke();

      /* Centre axis. */
      ctx.strokeStyle = white(0.06);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(W, midY);
      ctx.stroke();

      /* Secondary fainter waves, offset and slower. */
      for (let s = 0; s < 2; s += 1) {
        const sign = s === 0 ? 1 : -1;
        const ts = t * (0.55 + s * 0.2) + s * 1.7;
        const sa = a * (0.45 - s * 0.12);
        ctx.strokeStyle = white(0.05 - s * 0.015);
        ctx.beginPath();
        for (let x = 0; x <= W; x += step) {
          const y = midY + sign * signal(x / W, ts, sa) + sign * 14;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      /* Main trace. */
      let leadX = 0;
      let leadY = midY;
      ctx.strokeStyle = white(0.22);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let x = 0; x <= W; x += step) {
        const y = midY + signal(x / W, t, a);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        leadX = x;
        leadY = y;
      }
      ctx.stroke();

      /* Red leading dot at the trace head. */
      const glow = 3 + Math.sin(t * 2.4) * 0.8;
      ctx.fillStyle = A(0.12);
      ctx.beginPath();
      ctx.arc(leadX, leadY, glow + 4, 0, TAU);
      ctx.fill();
      ctx.fillStyle = A(0.85);
      ctx.beginPath();
      ctx.arc(leadX, leadY, 2.4, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
