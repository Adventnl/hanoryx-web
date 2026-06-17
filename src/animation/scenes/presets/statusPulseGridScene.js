import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash2 } from '../primitives';
import { TAU, clamp } from '../../easing';

/* STATUS PULSE GRID — a system monitor matrix of square status tiles; diagonal
   activation waves sweep across, lighting tiles as they pass; most tiles sit dim,
   a sparse few latch to a red "alert" state. Pointer drags a local hot zone. */
registerScene('status-pulse-grid', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cell = 34;
  let cols = 1;
  let rows = 1;
  let ox = 0;
  let oy = 0;
  let tile = 14;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = q === 'low' || q === 'static' ? 1.5 : q === 'medium' ? 1.15 : 1;
    cell = clamp(Math.min(W, H) / (26 * density) * scale, 26, 64);
    cols = Math.max(3, Math.floor(W / cell) + 2);
    rows = Math.max(3, Math.floor(H / cell) + 2);
    // center the lattice with a small overscan so edges stay covered
    ox = (W - (cols - 1) * cell) / 2;
    oy = (H - (rows - 1) * cell) / 2;
    tile = cell * 0.42;
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const half = tile / 2;

      // diagonal wave phases: two crossing fronts sweeping across the matrix
      const span = cols + rows;
      const front1 = (t * 0.9) % (span + 6);
      const front2 = ((t * 0.55) + span * 0.5) % (span + 6);

      // pointer hot-zone in grid coordinates
      const pgx = p.active ? (p.x - ox) / cell : -999;
      const pgy = p.active ? (p.y - oy) / cell : -999;

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const cx = ox + c * cell;
          const cy = oy + r * cell;
          const diag = c + r;
          const seed = hash2(c * 1.3, r * 1.7);

          // proximity of each sweeping front to this tile's diagonal band
          const d1 = Math.abs(diag - front1);
          const d2 = Math.abs(diag - front2);
          let energy = 0;
          if (d1 < 2.2) energy += (1 - d1 / 2.2);
          if (d2 < 2.2) energy += (1 - d2 / 2.2) * 0.8;

          // a slow per-tile shimmer so the resting field is never fully static
          const idle = 0.5 + Math.sin(t * 1.4 + seed * TAU) * 0.5;
          energy = clamp(energy + idle * 0.08, 0, 1);

          // pointer raises local energy in a soft radius
          if (p.active) {
            const pd = Math.hypot(c - pgx, r - pgy);
            if (pd < 3.5) energy = clamp(energy + (1 - pd / 3.5) * 0.7, 0, 1);
          }

          // sparse alert tiles latch red while a front is overhead
          const isAlert = seed > 0.93 && energy > 0.35;

          // base resting square — thin dim outline
          ctx.lineWidth = 1;
          ctx.strokeStyle = white(0.05 + energy * 0.12);
          ctx.strokeRect(cx - half, cy - half, tile, tile);

          // active fill grows with energy: white core, red for alerts
          if (energy > 0.12) {
            const f = energy * tile * 0.88;
            const fh = f / 2;
            if (isAlert) {
              ctx.fillStyle = A(0.25 + energy * 0.6);
            } else {
              ctx.fillStyle = white(0.06 + energy * 0.28);
            }
            ctx.fillRect(cx - fh, cy - fh, f, f);
          }

          // crisp status pip at the brightest tiles
          if (energy > 0.78) {
            ctx.beginPath();
            ctx.arc(cx, cy, 1.6, 0, TAU);
            ctx.fillStyle = isAlert ? A(0.95) : white(0.85);
            ctx.fill();
          }
        }
      }

      // faint connecting trace along the leading front for "scan line" read
      const fp = front1 % (span + 6);
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.07);
      ctx.beginPath();
      // map the diagonal front to two screen-edge anchor points
      const fx = ox + clamp(fp, 0, cols - 1) * cell;
      const fy = oy + clamp(fp - (cols - 1), 0, rows - 1) * cell;
      ctx.moveTo(fx, oy - cell);
      ctx.lineTo(ox - cell, fy);
      ctx.stroke();
    },
    dispose() {},
  };
});
