import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';

/* PCB-like traces with pulses travelling along right-angle paths. */
registerScene('circuit-trace', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let traces = [];

  const makeTrace = () => {
    const pts = [];
    let x = Math.random() * W;
    let y = Math.random() * H;
    const segs = 3 + Math.floor(Math.random() * 4);
    pts.push({ x, y });
    for (let s = 0; s < segs; s += 1) {
      if (Math.random() < 0.5) x += (Math.random() - 0.5) * 220;
      else y += (Math.random() - 0.5) * 180;
      pts.push({ x, y });
    }
    return { pts, t: Math.random(), speed: 0.15 + Math.random() * 0.25, red: Math.random() < 0.18 };
  };

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const count = Math.max(6, Math.round(14 * (QUALITY_SCALE[q] ?? 1) * density));
    traces = Array.from({ length: count }, makeTrace);
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ delta }) {
      ctx.clearRect(0, 0, W, H);
      const dt = Math.min(delta, 40) / 1000;

      for (let i = 0; i < traces.length; i += 1) {
        const tr = traces[i];
        // static trace
        ctx.beginPath();
        ctx.moveTo(tr.pts[0].x, tr.pts[0].y);
        for (let p = 1; p < tr.pts.length; p += 1) ctx.lineTo(tr.pts[p].x, tr.pts[p].y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.06);
        ctx.stroke();

        // junctions
        for (let p = 0; p < tr.pts.length; p += 1) {
          ctx.beginPath();
          ctx.arc(tr.pts[p].x, tr.pts[p].y, 1.4, 0, 6.283);
          ctx.fillStyle = white(0.18);
          ctx.fill();
        }

        // pulse
        tr.t += dt * tr.speed;
        if (tr.t > 1) tr.t -= 1;
        const seg = tr.t * (tr.pts.length - 1);
        const idx = Math.floor(seg);
        const f = seg - idx;
        const a = tr.pts[idx];
        const b = tr.pts[Math.min(idx + 1, tr.pts.length - 1)];
        const px = a.x + (b.x - a.x) * f;
        const py = a.y + (b.y - a.y) * f;
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, 6.283);
        ctx.fillStyle = tr.red ? A(0.95) : white(0.85);
        ctx.fill();
      }
    },
    dispose() {
      traces = null;
    },
  };
});
