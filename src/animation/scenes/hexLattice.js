import { registerScene } from '../sceneRegistry';
import { accentFn, white } from '../scenePalette';
import { TAU } from '../easing';

/* Hexagon lattice with a travelling scan that lights nodes as it passes. */
registerScene('hex-lattice', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cells = [];
  let size = 34;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    size = (q === 'low' ? 46 : q === 'medium' ? 38 : 32) / Math.max(0.6, density);
    cells = [];
    const hw = size * Math.sqrt(3);
    const vh = size * 1.5;
    for (let row = -1; row * vh < H + size; row += 1) {
      for (let col = -1; col * hw < W + size; col += 1) {
        const x = col * hw + (row % 2 ? hw / 2 : 0);
        const y = row * vh;
        cells.push({ x, y, phase: (x + y) * 0.01 });
      }
    }
  };
  build(width, height);

  const hexPath = (x, y, r) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const a = (TAU / 6) * i + Math.PI / 6;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  };

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const scanY = ((t * 0.18) % 1.6) * H - H * 0.3;

      for (let i = 0; i < cells.length; i += 1) {
        const c = cells[i];
        const dist = Math.abs(c.y - scanY);
        const lit = dist < 90 ? 1 - dist / 90 : 0;
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.04 + lit * 0.1);
        hexPath(c.x, c.y, size * 0.52);
        ctx.stroke();
        if (lit > 0.4) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 1.6, 0, TAU);
          ctx.fillStyle = A(lit * 0.8);
          ctx.fill();
        }
      }
    },
    dispose() {
      cells = null;
    },
  };
});
