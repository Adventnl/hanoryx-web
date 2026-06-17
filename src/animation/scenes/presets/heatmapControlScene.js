import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash2 } from '../primitives';
import { TAU, clamp } from '../../easing';

/* HEATMAP CONTROL — a dashboard heatmap: a tight grid of cells lit by several
   smooth gaussian "activity" blobs drifting across the field; warmth fades cell
   to cell, and only the hottest cells latch a sparse red accent outline. */
registerScene('heatmap-control', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cell = 26;
  let cols = 1;
  let rows = 1;
  let ox = 0;
  let oy = 0;
  let pad = 2;

  // count of drifting heat sources scales gently with quality
  const blobCount = quality === 'static' || quality === 'low' ? 3 : quality === 'medium' ? 4 : 5;
  const blobs = [];
  for (let i = 0; i < blobCount; i += 1) {
    blobs.push({
      sx: hash2(i + 1.3, i * 2.1),       // drift phase seeds
      sy: hash2(i * 1.7, i + 4.4),
      sp: 0.18 + hash2(i + 9.1, i * 3.3) * 0.22, // speed
      rad: 0.22 + hash2(i * 5.5, i + 2.2) * 0.18, // radius in screen fraction
      hot: hash2(i + 7.7, i * 6.6),       // base contribution weight
    });
  }

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = q === 'low' || q === 'static' ? 1.6 : q === 'medium' ? 1.2 : 1;
    cell = clamp(Math.min(W, H) / (30 * density) * scale, 18, 48);
    cols = Math.max(4, Math.floor(W / cell) + 1);
    rows = Math.max(4, Math.floor(H / cell) + 1);
    ox = (W - cols * cell) / 2;
    oy = (H - rows * cell) / 2;
    pad = Math.max(1.5, cell * 0.1);
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // resolve blob centres for this frame (lissajous drift in screen space)
      const cxs = blobs.map((b) =>
        (0.5 + Math.sin(t * b.sp + b.sx * TAU) * 0.42) * W);
      const cys = blobs.map((b) =>
        (0.5 + Math.cos(t * b.sp * 0.83 + b.sy * TAU) * 0.42) * H);
      const r2s = blobs.map((b) => {
        const r = b.rad * Math.min(W, H);
        return r * r;
      });

      const innerW = cell - pad;

      for (let r = 0; r < rows; r += 1) {
        const cy = oy + r * cell + cell / 2;
        for (let c = 0; c < cols; c += 1) {
          const cx = ox + c * cell + cell / 2;

          // accumulate gaussian falloff from every drifting source
          let heat = 0;
          for (let i = 0; i < blobs.length; i += 1) {
            const dx = cx - cxs[i];
            const dy = cy - cys[i];
            const d2 = dx * dx + dy * dy;
            heat += blobs[i].hot * Math.exp(-d2 / r2s[i]);
          }

          // pointer paints a soft warm patch under the cursor
          if (p.active) {
            const pdx = cx - p.x;
            const pdy = cy - p.y;
            const pr = cell * 4;
            heat += 0.9 * Math.exp(-(pdx * pdx + pdy * pdy) / (pr * pr));
          }

          // faint per-cell shimmer so the cold field never reads dead
          const seed = hash2(c * 1.1, r * 1.9);
          heat += (0.5 + Math.sin(t * 1.6 + seed * TAU) * 0.5) * 0.05;
          heat = clamp(heat, 0, 1);

          // cold cells: bare grid tick; warm cells: filled white tile
          const x = cx - innerW / 2;
          const y = cy - innerW / 2;

          if (heat < 0.1) {
            // resting lattice — a dim hairline cell
            ctx.strokeStyle = white(0.04);
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, innerW, innerW);
          } else {
            ctx.fillStyle = white(0.05 + heat * 0.34);
            ctx.fillRect(x, y, innerW, innerW);
          }

          // hottest cells latch a sparse red accent outline (the "alerts")
          if (heat > 0.78) {
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = A(0.35 + (heat - 0.78) / 0.22 * 0.55);
            ctx.strokeRect(x - 0.5, y - 0.5, innerW + 1, innerW + 1);
            if (heat > 0.92) {
              ctx.fillStyle = A(0.5);
              const cdot = innerW * 0.28;
              ctx.fillRect(cx - cdot / 2, cy - cdot / 2, cdot, cdot);
            }
          }
        }
      }
    },
    dispose() {},
  };
});
