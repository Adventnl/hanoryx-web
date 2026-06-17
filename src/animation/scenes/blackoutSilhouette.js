import { registerScene } from '../sceneRegistry';
import { white, accentFn, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp, lerp, easeInOutCubic } from '../easing';

/* A hidden silhouette under redaction. Faint hatched black regions conceal an
   abstract geometric form; a vertical scan line sweeps across and briefly
   reveals the red edge contours where it passes, then re-conceals. */
registerScene('blackout-silhouette', ({ ctx, width, height, quality, reduced, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let shapes = [];     // concealed polygons (the silhouette pieces)
  let edges = [];      // flattened edge segments for reveal sampling
  let hatch = [];      // precomputed hatch line endpoints per shape

  // Deterministic small RNG so the silhouette is stable across resizes.
  const rng = (seed) => {
    let s = seed * 9301 + 49297;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  };

  const buildPolygon = (cx, cy, rBase, sides, jitter, rand) => {
    const pts = [];
    const rot = rand() * TAU;
    for (let i = 0; i < sides; i += 1) {
      const ang = rot + (i / sides) * TAU;
      const r = rBase * (1 - jitter + rand() * jitter * 2);
      pts.push({ x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r * 0.82 });
    }
    return pts;
  };

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] ?? 1;
    const rand = rng(1337);

    // Compose an abstract silhouette from a few overlapping polygons,
    // clustered around centre so it reads as one classified form.
    const count = Math.max(3, Math.round((4 + density * 2) * lerp(0.7, 1, scale)));
    const minDim = Math.min(W, H);
    shapes = [];
    hatch = [];
    edges = [];

    for (let s = 0; s < count; s += 1) {
      const cx = W * (0.32 + rand() * 0.36);
      const cy = H * (0.3 + rand() * 0.4);
      const rBase = minDim * (0.08 + rand() * 0.16);
      const sides = 3 + Math.floor(rand() * 5);
      const poly = buildPolygon(cx, cy, rBase, sides, 0.28, rand);
      shapes.push(poly);

      // Hatch lines clipped roughly to the polygon's bounding box (diagonal).
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < poly.length; i += 1) {
        const p = poly[i];
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
      const step = 7;
      const lines = [];
      for (let d = minX - (maxY - minY); d < maxX; d += step) {
        lines.push({ x1: d, y1: maxY, x2: d + (maxY - minY), y2: minY });
      }
      hatch.push({ lines, bbox: { minX, minY, maxX, maxY } });

      // Flatten edges for the scan reveal (with midpoint for finer sampling).
      for (let i = 0; i < poly.length; i += 1) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        edges.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, mx: (a.x + b.x) * 0.5 });
      }
    }
  };
  build(width, height);

  const fillRegion = () => {
    // Concealing pass: near-black fill + faint white hatch over each shape.
    for (let s = 0; s < shapes.length; s += 1) {
      const poly = shapes[s];
      ctx.beginPath();
      ctx.moveTo(poly[0].x, poly[0].y);
      for (let i = 1; i < poly.length; i += 1) ctx.lineTo(poly[i].x, poly[i].y);
      ctx.closePath();

      ctx.fillStyle = 'rgba(3,3,4,0.85)';
      ctx.fill();

      ctx.save();
      ctx.clip();
      ctx.strokeStyle = white(0.045);
      ctx.lineWidth = 1;
      const h = hatch[s];
      ctx.beginPath();
      for (let i = 0; i < h.lines.length; i += 1) {
        const l = h.lines[i];
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
      }
      ctx.stroke();
      ctx.restore();

      // Faint concealed outline so the form is just barely sensed.
      ctx.strokeStyle = white(0.06);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer, still }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      // Heavy classified base wash across the whole field.
      ctx.fillStyle = 'rgba(2,2,3,0.55)';
      ctx.fillRect(0, 0, W, H);

      fillRegion();

      // Scan position: slow continuous sweep, nudged by pointer parallax.
      const par = pointer && pointer.active ? pointer.nx * 0.06 : 0;
      const phase = still ? 0.5 : ((t * 0.07) % 1.5);
      const scanX = (clamp(phase, 0, 1) + par) * W * 1.12 - W * 0.06;
      const band = Math.max(70, W * 0.07); // reveal half-width

      // Reveal red edge contours only near the scan line, then re-conceal.
      ctx.lineCap = 'round';
      for (let i = 0; i < edges.length; i += 1) {
        const e = edges[i];
        // Proximity of this edge's midpoint to the scan line.
        const d = Math.abs(e.mx - scanX);
        if (d > band) continue;
        const prox = easeInOutCubic(1 - d / band);
        const alpha = prox * 0.26;
        if (alpha < 0.01) continue;
        ctx.strokeStyle = A(alpha);
        ctx.lineWidth = lerp(0.6, 1.6, prox);
        ctx.beginPath();
        ctx.moveTo(e.ax, e.ay);
        ctx.lineTo(e.bx, e.by);
        ctx.stroke();
      }

      // The scan line itself with a soft leading glow.
      const glow = band * 0.7;
      const grad = ctx.createLinearGradient(scanX - glow, 0, scanX + glow, 0);
      grad.addColorStop(0, A(0));
      grad.addColorStop(0.5, A(0.05));
      grad.addColorStop(1, A(0));
      ctx.fillStyle = grad;
      ctx.fillRect(scanX - glow, 0, glow * 2, H);

      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, H);
      ctx.strokeStyle = A(reduced ? 0.22 : 0.32);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    },
    dispose() {
      shapes = null;
      edges = null;
      hatch = null;
    },
  };
});
