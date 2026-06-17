import { registerScene } from '../sceneRegistry';
import { accentFn, white, QUALITY_SCALE } from '../scenePalette';
import { flowAngle, clamp } from '../easing';

/* Vector direction field: a fixed grid of short arrow segments whose angles
   track flowAngle(x,y,t) and rotate smoothly, like compasses leaning into an
   invisible current. Faint white, sparse red. Cells are static; only angles
   animate — no per-frame allocation. */
registerScene('vector-compass', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cells = [];
  let len = 8;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] ?? 1;
    /* Larger spacing on low quality / low density -> fewer arrows. */
    const spacing = clamp(74 / (scale * Math.sqrt(density)), 46, 132);
    len = spacing * 0.34;

    const cols = Math.max(2, Math.floor(W / spacing));
    const rows = Math.max(2, Math.floor(H / spacing));
    const ox = (W - (cols - 1) * spacing) * 0.5;
    const oy = (H - (rows - 1) * spacing) * 0.5;

    cells = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = ox + c * spacing;
        const y = oy + r * spacing;
        cells.push({
          x,
          y,
          a: 0,
          /* Sparse red accents on a deterministic scatter. */
          red: ((r * 31 + c * 17) % 23) === 0,
          /* Slight per-cell phase so the field shimmers rather than locks. */
          phase: (x * 0.0007 + y * 0.0011),
        });
      }
    }
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      ctx.clearRect(0, 0, W, H);
      const t = time * 0.00012;

      const pr = pointer || {};
      const pActive = pr.active;
      const pnx = pActive ? clamp(pr.nx || 0, -1, 1) : 0;
      const pny = pActive ? clamp(pr.ny || 0, -1, 1) : 0;
      /* Pointer biases the field angle a touch (resolution-independent). */
      const pAng = Math.atan2(pny, pnx);
      const pBias = pActive ? 0.32 : 0;

      const half = len * 0.5;
      const head = len * 0.26;

      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      for (let i = 0; i < cells.length; i += 1) {
        const cell = cells[i];
        let a = flowAngle(cell.x, cell.y, t + cell.phase);
        if (pBias) {
          /* Nudge toward pointer direction without snapping. */
          a += Math.sin(pAng - a) * pBias;
        }
        cell.a = a;

        const dx = Math.cos(a);
        const dy = Math.sin(a);
        const tx = cell.x + dx * half;
        const ty = cell.y + dy * half;
        const bx = cell.x - dx * half;
        const by = cell.y - dy * half;

        ctx.strokeStyle = cell.red ? A(0.22) : white(0.12);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(tx, ty);
        /* Small arrowhead so direction reads. */
        const wx = -dy * head;
        const wy = dx * head;
        ctx.moveTo(tx - dx * head + wx, ty - dy * head + wy);
        ctx.lineTo(tx, ty);
        ctx.lineTo(tx - dx * head - wx, ty - dy * head - wy);
        ctx.stroke();

        ctx.fillStyle = cell.red ? A(0.3) : white(0.16);
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.red ? 1.3 : 0.9, 0, 6.283);
        ctx.fill();
      }
    },
    dispose() {
      cells = null;
    },
  };
});
