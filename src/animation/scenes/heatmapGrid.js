import { registerScene } from '../sceneRegistry';
import { accentFn, white, QUALITY_SCALE } from '../scenePalette';
import { TAU, clamp, lerp } from '../easing';

/* Operational heatmap: a grid of cells whose intensity pulses as a sum of
   slow sine waves over position + time. Bright cells take a faint red tint,
   dim cells stay barely-there white. Several waves drift across the grid at
   different angles/speeds so hot zones bloom and migrate continuously. */
registerScene('heatmap-grid', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cols = 0;
  let rows = 0;
  let cell = 40;
  let gap = 2;
  /* Per-cell normalized centre coordinates (0..1), reused every frame. */
  let cx = null;
  let cy = null;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] || 1;
    /* Cell size grows when quality/density drop so we paint fewer rects. */
    const base = 34 / clamp(scale * density, 0.4, 1.4);
    cell = clamp(base, 26, 60);
    gap = cell < 36 ? 2 : 3;
    cols = Math.max(2, Math.ceil(W / cell));
    rows = Math.max(2, Math.ceil(H / cell));
    const n = cols * rows;
    cx = new Float32Array(n);
    cy = new Float32Array(n);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const i = r * cols + c;
        cx[i] = cols > 1 ? c / (cols - 1) : 0.5;
        cy[i] = rows > 1 ? r / (rows - 1) : 0.5;
      }
    }
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);

      /* A faint pointer-driven warm focus that nudges nearby cells hotter. */
      const px = pointer && pointer.active ? (pointer.nx + 1) * 0.5 : -1;
      const py = pointer && pointer.active ? (pointer.ny + 1) * 0.5 : -1;
      const hasPtr = px >= 0;

      const cw = W / cols;
      const ch = H / rows;
      const rw = cw - gap;
      const rh = ch - gap;

      /* Three drifting waves at different orientations/speeds — their sum is
         the operational "load" field that blooms and migrates across cells. */
      const a1 = t * 0.18;
      const a2 = -t * 0.12;
      const a3 = t * 0.07;
      const k1x = Math.cos(a1) * 5.2;
      const k1y = Math.sin(a1) * 5.2;
      const k2x = Math.cos(a2) * 3.1;
      const k2y = Math.sin(a2) * 3.1;
      const k3x = Math.cos(a3) * 8.4;
      const k3y = Math.sin(a3) * 8.4;

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const i = r * cols + c;
          const u = cx[i];
          const v = cy[i];

          /* Sum of sines of (position + time) -> -1..1, remapped to 0..1. */
          let s =
            Math.sin(u * k1x + v * k1y + t * 0.9) +
            Math.sin(u * k2x + v * k2y - t * 0.6) +
            Math.sin((u + v) * k3x - (u - v) * k3y + t * 0.3);
          let intensity = (s / 3) * 0.5 + 0.5;

          /* Soft hotspot under the pointer. */
          if (hasPtr) {
            const dx = u - px;
            const dy = v - py;
            const d2 = dx * dx + dy * dy;
            intensity += Math.exp(-d2 * 18) * 0.4;
          }
          intensity = clamp(intensity, 0, 1);

          const x = c * cw + gap * 0.5;
          const y = r * ch + gap * 0.5;

          /* Dim cells: faint white fill. Bright cells: blend toward red. */
          const heat = intensity * intensity; /* bias toward darker baseline */
          const baseA = lerp(0.03, 0.13, intensity);

          ctx.fillStyle = white(baseA);
          ctx.fillRect(x, y, rw, rh);

          if (heat > 0.45) {
            /* Red tint scales with how hot the cell is, kept subtle. */
            const hot = (heat - 0.45) / 0.55;
            ctx.fillStyle = A(hot * 0.16);
            ctx.fillRect(x, y, rw, rh);

            /* The very hottest cells get a thin glowing core. */
            if (hot > 0.7) {
              const cxp = x + rw * 0.5;
              const cyp = y + rh * 0.5;
              const cr = Math.min(rw, rh) * 0.18 * hot;
              ctx.fillStyle = A((hot - 0.7) * 0.7);
              ctx.beginPath();
              ctx.arc(cxp, cyp, cr, 0, TAU);
              ctx.fill();
            }
          }
        }
      }

      /* A single faint scan band sweeping vertically to read as a live probe. */
      const bandY = ((t * 0.04) % 1) * H;
      ctx.fillStyle = white(0.025);
      ctx.fillRect(0, bandY, W, ch);
    },
    dispose() {
      cx = null;
      cy = null;
    },
  };
});
