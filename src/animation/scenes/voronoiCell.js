import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp } from '../easing';

/* Computational cell field — jittered sites drift and connect to their
   2–3 nearest neighbours, approximating Voronoi cell walls without the cost
   of a full diagram. A few accent sites pulse red. Neighbour search is
   capped to the K closest candidates so cost stays roughly linear. */
registerScene('voronoi-cell', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let sites = [];
  /* Reusable scratch for the per-site nearest-neighbour scan (no per-frame
     allocation in the hot loop). Holds {idx, d2} for the K best candidates. */
  const K = 3;
  const bestIdx = new Int32Array(K);
  const bestD2 = new Float32Array(K);

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] ?? 1;
    const count = Math.max(8, Math.round(24 * scale * density));
    sites = new Array(count);
    for (let i = 0; i < count; i += 1) {
      const ang = Math.random() * TAU;
      const spd = 0.06 + Math.random() * 0.05;
      sites[i] = {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        red: Math.random() < 0.12,
        phase: Math.random() * TAU,
      };
    }
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      ctx.clearRect(0, 0, W, H);
      const n = sites.length;
      const t = time * 0.001;
      const pr = pointer || {};
      const px = pr.active ? pr.x : -9999;
      const py = pr.active ? pr.y : -9999;

      // Advance drift with soft edge wrap-around (sites re-enter, no jitter pop).
      for (let i = 0; i < n; i += 1) {
        const s = sites[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -20) s.x = W + 20;
        else if (s.x > W + 20) s.x = -20;
        if (s.y < -20) s.y = H + 20;
        else if (s.y > H + 20) s.y = -20;
      }

      // Cell walls: for each site, find its K nearest and draw faint links.
      ctx.lineWidth = 0.7;
      for (let i = 0; i < n; i += 1) {
        const a = sites[i];
        for (let k = 0; k < K; k += 1) {
          bestIdx[k] = -1;
          bestD2[k] = Infinity;
        }
        for (let j = 0; j < n; j += 1) {
          if (j === i) continue;
          const b = sites[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          // Insertion into the small sorted K-best buffer (cheap, capped cost).
          if (d2 < bestD2[K - 1]) {
            let pos = K - 1;
            while (pos > 0 && d2 < bestD2[pos - 1]) {
              bestD2[pos] = bestD2[pos - 1];
              bestIdx[pos] = bestIdx[pos - 1];
              pos -= 1;
            }
            bestD2[pos] = d2;
            bestIdx[pos] = j;
          }
        }
        for (let k = 0; k < K; k += 1) {
          const j = bestIdx[k];
          if (j < 0 || j < i) continue; // draw each pair once (j>i)
          const b = sites[j];
          // Fade with distance and fade outermost neighbour for a soft mesh.
          const d = Math.sqrt(bestD2[k]);
          const op = clamp(1 - d / 320, 0, 1) * (k === 2 ? 0.06 : 0.12);
          if (op <= 0.005) continue;
          const isRed = a.red || b.red;
          ctx.strokeStyle = isRed ? A(op * 1.4) : white(op);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Site dots, with a slow pulse on accent sites and pointer highlight.
      for (let i = 0; i < n; i += 1) {
        const s = sites[i];
        const mdx = s.x - px;
        const mdy = s.y - py;
        const near = mdx * mdx + mdy * mdy < 14000;
        if (s.red) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + s.phase);
          const r = 1.6 + pulse * 1.4;
          ctx.beginPath();
          ctx.arc(s.x, s.y, r, 0, TAU);
          ctx.fillStyle = A(0.18 + pulse * 0.22);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, near ? 1.9 : 1.3, 0, TAU);
          ctx.fillStyle = near ? A(0.7) : white(0.32);
          ctx.fill();
        }
      }
    },
    dispose() {
      sites = null;
    },
  };
});
