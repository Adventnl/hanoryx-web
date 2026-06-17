import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';

/* Flowing contour / topology lines that breathe like terrain. */
registerScene('topographic-lines', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let lines = 0;
  let step = 8;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] ?? 1;
    lines = Math.max(8, Math.round(18 * scale * density));
    step = q === 'low' ? 22 : q === 'medium' ? 16 : 12;
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time }) {
      const t = time * 0.0004;
      ctx.clearRect(0, 0, W, H);
      const gap = H / lines;

      for (let l = 0; l < lines; l += 1) {
        const baseY = l * gap + gap * 0.5;
        const accentLine = l % 5 === 0;
        ctx.beginPath();
        for (let x = 0; x <= W; x += step) {
          const y =
            baseY +
            Math.sin(x * 0.006 + t + l * 0.4) * 18 +
            Math.cos(x * 0.013 - t * 1.4 + l * 0.2) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = accentLine ? 1.1 : 0.8;
        ctx.strokeStyle = accentLine ? A(0.16) : white(0.06);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
