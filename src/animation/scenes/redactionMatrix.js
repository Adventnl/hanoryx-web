import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';

/* A field of black metadata bars with a scan line that briefly "decrypts"
   the bars it passes over — classified / redacted mood. */
registerScene('redaction-matrix', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let bars = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const rows = Math.max(6, Math.round(14 * (QUALITY_SCALE[q] ?? 1)));
    bars = [];
    const rowH = H / rows;
    for (let r = 0; r < rows; r += 1) {
      let x = 12 + Math.random() * 40;
      const y = r * rowH + rowH * 0.4;
      while (x < W - 30) {
        const wBar = 40 + Math.random() * 120 * density;
        bars.push({ x, y, w: wBar, h: 7 });
        x += wBar + 14 + Math.random() * 40;
      }
    }
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const scanX = ((t * 0.12) % 1.4) * W - W * 0.2;

      for (let i = 0; i < bars.length; i += 1) {
        const b = bars[i];
        const lit = b.x < scanX && b.x + b.w > scanX - 120 ? 1 : 0;
        ctx.fillStyle = white(0.05);
        ctx.fillRect(b.x, b.y, b.w, b.h);
        // hatch
        ctx.strokeStyle = white(0.04);
        ctx.lineWidth = 1;
        for (let hx = b.x; hx < b.x + b.w; hx += 6) {
          ctx.beginPath();
          ctx.moveTo(hx, b.y);
          ctx.lineTo(hx - 6, b.y + b.h);
          ctx.stroke();
        }
        if (lit) {
          ctx.fillStyle = A(0.22);
          ctx.fillRect(b.x, b.y, b.w, b.h);
        }
      }

      // scan line
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, H);
      ctx.strokeStyle = A(0.4);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    },
    dispose() {
      bars = null;
    },
  };
});
