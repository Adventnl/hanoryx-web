import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';

/* Restrained vertical data columns — measured, not a Matrix spam wall. */
registerScene('data-rain', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cols = [];
  let colW = 26;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    colW = q === 'low' ? 40 : q === 'medium' ? 32 : 26;
    const count = Math.max(4, Math.round((w / colW) * 0.4 * (QUALITY_SCALE[q] ?? 1) * density));
    cols = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 18 + Math.random() * 34,
      len: 60 + Math.random() * 140,
      red: Math.random() < 0.1,
    }));
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ delta }) {
      ctx.fillStyle = 'rgba(2,2,3,0.22)';
      ctx.fillRect(0, 0, W, H);
      const dt = Math.min(delta, 40) / 1000;

      for (let i = 0; i < cols.length; i += 1) {
        const c = cols[i];
        c.y += c.speed * dt * 60 * 0.016 * 8;
        if (c.y - c.len > H) {
          c.y = -c.len;
          c.x = Math.random() * W;
        }
        const grad = ctx.createLinearGradient(c.x, c.y - c.len, c.x, c.y);
        const tone = c.red ? A.bind(null) : white;
        grad.addColorStop(0, tone(0));
        grad.addColorStop(1, tone(c.red ? 0.55 : 0.32));
        ctx.fillStyle = grad;
        ctx.fillRect(c.x, c.y - c.len, 1, c.len);
        ctx.beginPath();
        ctx.arc(c.x + 0.5, c.y, 1.4, 0, 6.283);
        ctx.fillStyle = c.red ? A(0.85) : white(0.6);
        ctx.fill();
      }
    },
    dispose() {
      cols = null;
    },
  };
});
