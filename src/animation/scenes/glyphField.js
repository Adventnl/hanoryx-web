import { registerScene } from '../sceneRegistry';
import { accentFn, white } from '../scenePalette';
import { TAU, clamp, pseudoNoise } from '../easing';
import { QUALITY_SCALE } from '../scenePalette';

/* A sparse grid of abstract glyphs — small geometric marks (+, circles,
   brackets, short bars) that breathe in and out and occasionally swap form,
   like an unknown symbol language slowly writing itself. Mostly faint white
   with the rare red glyph. Low density, calm cadence. */

const GLYPH_COUNT = 5; // plus, ring, bracket, bar, dot-pair

function drawGlyph(ctx, type, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.beginPath();
  switch (type) {
    case 0: // plus / cross
      ctx.moveTo(-r, 0);
      ctx.lineTo(r, 0);
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r);
      break;
    case 1: // ring
      ctx.arc(0, 0, r * 0.82, 0, TAU);
      break;
    case 2: // facing brackets [ ]
      ctx.moveTo(-r * 0.5, -r);
      ctx.lineTo(-r, -r);
      ctx.lineTo(-r, r);
      ctx.lineTo(-r * 0.5, r);
      ctx.moveTo(r * 0.5, -r);
      ctx.lineTo(r, -r);
      ctx.lineTo(r, r);
      ctx.lineTo(r * 0.5, r);
      break;
    case 3: // short bar
      ctx.moveTo(-r, 0);
      ctx.lineTo(r, 0);
      break;
    default: // paired dots / colon
      ctx.moveTo(0, -r * 0.45);
      ctx.arc(0, -r * 0.45, 0.9, 0, TAU);
      ctx.moveTo(0, r * 0.45);
      ctx.arc(0, r * 0.45, 0.9, 0, TAU);
      break;
  }
  ctx.stroke();
  ctx.restore();
}

registerScene('glyph-field', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cells = [];
  let step = 84;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = QUALITY_SCALE[q] || 1;
    // Low density: wide spacing, scaled by quality + density knob.
    step = clamp(96 / (scale * Math.max(0.55, density)), 64, 150);
    cells = [];
    const cols = Math.ceil(W / step) + 1;
    const rows = Math.ceil(H / step) + 1;
    const offX = (W - (cols - 1) * step) * 0.5;
    const offY = (H - (rows - 1) * step) * 0.5;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const n = pseudoNoise(c * 1.7 + 3.1, r * 2.3 + 5.9);
        // Skip a chunk of grid points so the field stays calm and sparse.
        if (n > 0.62) continue;
        const jx = (pseudoNoise(c + 11.1, r + 2.2) - 0.5) * step * 0.18;
        const jy = (pseudoNoise(c + 7.7, r + 8.4) - 0.5) * step * 0.18;
        cells.push({
          x: offX + c * step + jx,
          y: offY + r * step + jy,
          seed: n,
          // Each cell cycles on its own slow phase.
          phase: pseudoNoise(c * 3.3, r * 1.9) * TAU,
          speed: 0.10 + pseudoNoise(c + 0.5, r + 0.5) * 0.10,
          type: Math.floor(pseudoNoise(c * 5.1, r * 4.7) * GLYPH_COUNT) % GLYPH_COUNT,
          swap: Math.floor(pseudoNoise(c * 9.2, r * 6.6) * GLYPH_COUNT) % GLYPH_COUNT,
          rot: pseudoNoise(c + 13.0, r + 17.0) < 0.5 ? 0 : Math.PI / 4,
          // Rare red marks scattered through the field.
          accent: pseudoNoise(c * 2.9 + 0.3, r * 3.7 + 0.8) > 0.955,
        });
      }
    }
  };
  build(width, height);

  const glyphR = () => clamp(step * 0.13, 6, 13);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      const r = glyphR();
      const px = pointer && pointer.active ? (pointer.nx || 0) : 0;
      const py = pointer && pointer.active ? (pointer.ny || 0) : 0;

      for (let i = 0; i < cells.length; i += 1) {
        const g = cells[i];
        // Slow breathing: alpha rises and falls; glyph form swaps at the trough.
        const cyc = (t * g.speed + g.phase) % TAU;
        const breathe = (Math.sin(cyc) + 1) * 0.5; // 0..1
        const visible = breathe * breathe; // ease for soft fade
        if (visible < 0.01) continue;

        // Cross-fade between base form and swap form near full visibility.
        const swapMix = clamp((breathe - 0.55) / 0.45, 0, 1);
        const type = swapMix > 0.5 ? g.swap : g.type;

        // Gentle parallax so the field feels like it has depth.
        const depth = 0.4 + g.seed * 0.6;
        const x = g.x + px * 9 * depth;
        const y = g.y + py * 9 * depth;
        // Faint shimmer of rotation on a couple of glyph kinds.
        const rot = g.rot + (g.type === 0 || g.type === 2 ? 0 : Math.sin(cyc * 0.5) * 0.12);

        const base = 0.05 + visible * 0.18;
        if (g.accent) {
          ctx.strokeStyle = A(clamp(base + 0.04, 0, 0.3));
        } else {
          ctx.strokeStyle = white(base);
        }
        drawGlyph(ctx, type, x, y, r, rot);
      }
    },
    dispose() {
      cells = null;
    },
  };
});
