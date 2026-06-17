/* ISOMETRIC INFRA — a blueprint isometric module field where lit modules sweep
   across in travelling diagonal clusters; a few of the brightest modules extrude
   tall vertical "data columns" that pulse upward. Faint base lattice, sparse red. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawIsometric, hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('isometric-infra', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;

  let size = 40;          // half-width of a rhombus
  let cols = 10;
  let rows = 14;
  let originX = 0;
  let originY = 0;

  const build = (w, h) => {
    W = w;
    H = h;
    const q = quality === 'high' ? 1.15 : quality === 'low' ? 0.8 : quality === 'static' ? 0.7 : 1;
    size = clamp(Math.min(w, h) * 0.06, 24, 52);
    cols = clamp(Math.round(11 * density * q), 6, 16);
    rows = clamp(Math.round(16 * density * q), 8, 22);
    originX = W * 0.5;
    originY = H * 0.16;
  };
  build(width, height);

  // grid cell (gx,gy) -> screen point of the top-rhombus centre
  const iso = (gx, gy, lift = 0) => {
    const x = (gx - gy) * size;
    const y = (gx + gy) * size * 0.5 - lift;
    return [originX + x, originY + y];
  };

  const topFace = (cx, cy) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 0.5);
    ctx.lineTo(cx + size, cy);
    ctx.lineTo(cx, cy + size * 0.5);
    ctx.lineTo(cx - size, cy);
    ctx.closePath();
  };

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // faint underlying isometric lattice for the blueprint substrate
      drawIsometric(ctx, { w: W, h: H, t: t * 0.4, size: size * 1.0, alpha: 0.03, accent: null });

      // travelling cluster centre, sweeping diagonally across the field
      const sweep = (gx, gy) => {
        const cgx = ((t * 0.55) % (cols + 6)) - 3;
        const cgy = (rows * 0.5) + Math.sin(t * 0.35) * (rows * 0.32);
        const d = Math.hypot(gx - cgx, gy - cgy);
        return clamp(1 - d / 3.4, 0, 1);
      };

      // pointer attraction: highlight modules near the cursor
      const pgx = p.active ? ((p.x - originX) / size + (2 * (p.y - originY) / size)) * 0.5 : 0;
      const pgy = p.active ? (-(p.x - originX) / size + (2 * (p.y - originY) / size)) * 0.5 : 0;

      // iterate front-to-back so closer modules + columns overlay correctly.
      // draw order: increasing (gx+gy) draws back-to-front in this projection.
      const lit = [];
      for (let s = 0; s <= cols + rows; s++) {
        for (let gx = 0; gx < cols; gx++) {
          const gy = s - gx;
          if (gy < 0 || gy >= rows) continue;

          const base = hash2(gx, gy);
          const flicker = 0.5 + 0.5 * Math.sin(t * 1.6 + gx * 0.7 - gy * 0.5);
          let glow = sweep(gx, gy) * (0.55 + 0.45 * flicker);

          if (p.active) {
            const pd = Math.hypot(gx - pgx, gy - pgy);
            glow = Math.max(glow, clamp(1 - pd / 2.4, 0, 1) * 0.9);
          }

          const [cx, cy] = iso(gx, gy);

          // base top face: very faint white outline, fill brightens with glow
          if (glow > 0.04) {
            topFace(cx, cy);
            ctx.fillStyle = white(0.015 + 0.09 * glow);
            ctx.fill();
          }
          topFace(cx, cy);
          ctx.lineWidth = 1;
          ctx.strokeStyle = glow > 0.35 ? A(0.18 + 0.5 * glow) : white(0.05 + 0.06 * glow);
          ctx.stroke();

          // bright module core dot when sufficiently lit
          if (glow > 0.45) {
            ctx.fillStyle = A(0.35 + 0.55 * glow);
            ctx.beginPath();
            ctx.arc(cx, cy, 1.6 + 1.8 * glow, 0, TAU);
            ctx.fill();
          }

          // record the strongest modules as candidates for data columns
          if (glow > 0.7 && base > 0.62) lit.push([gx, gy, cx, cy, glow]);
        }
      }

      // a couple of vertical data columns rising from the brightest lit modules
      const maxCols = Math.min(3, lit.length);
      // sort by glow desc without large allocations
      lit.sort((a, b) => b[4] - a[4]);
      for (let i = 0; i < maxCols; i++) {
        const [gx, gy, cx, cy, glow] = lit[i];
        const seed = hash(gx * 31 + gy * 17);
        const colH = (size * 2.6 + seed * size * 3.2) * glow;
        const topX = cx;
        const topY = cy - colH;

        // column shaft: faint white edges with a rising gradient core
        const grad = ctx.createLinearGradient(cx, cy, topX, topY);
        grad.addColorStop(0, A(0.5 * glow));
        grad.addColorStop(1, A(0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(topX, topY);
        ctx.stroke();

        // thin white guide edges flanking the shaft for a structural feel
        ctx.strokeStyle = white(0.07 + 0.1 * glow);
        ctx.beginPath();
        ctx.moveTo(cx - size * 0.5, cy);
        ctx.lineTo(topX - size * 0.5, topY + size * 0.25);
        ctx.moveTo(cx + size * 0.5, cy);
        ctx.lineTo(topX + size * 0.5, topY + size * 0.25);
        ctx.stroke();

        // a small packet travelling up the column
        const pf = (t * 0.6 + seed) % 1;
        const px = lerp(cx, topX, pf);
        const py = lerp(cy, topY, pf);
        ctx.fillStyle = A(0.85 * (1 - pf));
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, TAU);
        ctx.fill();

        // cap marker at the top of the column
        ctx.strokeStyle = A(0.4 * glow);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(topX - size * 0.4, topY + size * 0.2);
        ctx.lineTo(topX, topY);
        ctx.lineTo(topX + size * 0.4, topY + size * 0.2);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
