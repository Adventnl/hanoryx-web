import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';

/* Layered sine-wave interference field — calm, signal-like horizontal bands. */
registerScene('wave-interference', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let waves = 0;
  let step = 10;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    waves = Math.max(3, Math.round(6 * (QUALITY_SCALE[q] ?? 1) * density));
    step = q === 'low' ? 20 : q === 'medium' ? 14 : 9;
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const pr = pointer || {};
      const amp = 22 + (pr.active ? Math.abs(pr.ny) * 18 : 0);

      for (let i = 0; i < waves; i += 1) {
        const yBase = (H / (waves + 1)) * (i + 1);
        const k = 0.004 + i * 0.0011;
        const speed = 0.6 + i * 0.18;
        ctx.beginPath();
        for (let x = 0; x <= W; x += step) {
          const y =
            yBase +
            Math.sin(x * k + t * speed) * amp +
            Math.sin(x * k * 2.3 - t * speed * 0.7) * (amp * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = i === Math.floor(waves / 2) ? A(0.2) : white(0.07);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
