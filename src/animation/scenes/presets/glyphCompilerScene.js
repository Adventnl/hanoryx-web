import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash, hash2 } from '../primitives';
import { clamp, lerp } from '../../easing';

/* GLYPH COMPILER — scattered mono glyphs drift in space, then snap into neat
   left-aligned rows (compiling), hold as clean labels, then dissolve back to
   scatter. A red caret/scan rides the row that is currently resolving. */
registerScene('glyph-compiler', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let rows = 9, cols = 22, fontSize = 14, colW = 9, lineH = 30, pad = 48, total = 0;

  const build = (w, h) => {
    W = w; H = h;
    const scale = quality === 'static' || quality === 'low' ? 0.7 : quality === 'medium' ? 0.88 : 1;
    fontSize = Math.round(clamp(Math.min(W, H) * 0.022, 11, 16) * scale);
    colW = fontSize * 0.64;
    lineH = fontSize * 2.1;
    pad = Math.round(W * 0.07) + 24;
    rows = clamp(Math.floor((H - pad * 2) / lineH), 4, Math.round(11 * density));
    cols = clamp(Math.floor((W * 0.6) / colW), 10, 30);
    total = rows * cols;
    if (total > 200) { cols = Math.max(10, Math.floor(200 / rows)); total = rows * cols; }
  };
  build(width, height);

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-_.:=<>{}[]#%';

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // compile cycle: scatter -> assemble -> hold -> dissolve
      const cycle = 11;
      const ph = (t % cycle) / cycle;
      // global assembly amount (0 = scattered, 1 = compiled)
      let asm;
      if (ph < 0.32) asm = ph / 0.32;            // assembling
      else if (ph < 0.72) asm = 1;               // holding compiled
      else if (ph < 0.92) asm = 1 - (ph - 0.72) / 0.2; // dissolving
      else asm = 0;                              // scattered
      asm = clamp(asm, 0, 1);

      const left = pad;
      const top = pad + (p.active ? p.ny * 8 : 0);
      ctx.font = `${fontSize}px var(--font-mono, monospace)`;
      ctx.textBaseline = 'middle';

      // rows resolve in sequence top->bottom while assembling
      const px = p.active ? p.nx * 14 : 0;

      for (let r = 0; r < rows; r += 1) {
        const ry = top + r * lineH + lineH * 0.5;
        if (ry > H - pad * 0.5) break;

        // per-row stagger so labels snap into place one after another
        const rowDelay = (r / Math.max(1, rows)) * 0.55;
        const rowAsm = clamp((asm - rowDelay) / (1 - rowDelay + 0.0001), 0, 1);
        const ease = rowAsm * rowAsm * (3 - 2 * rowAsm);

        // declared label length for this row (rest stays scattered noise that fades)
        const len = 5 + Math.floor(hash(r * 5.7 + 0.3) * (cols - 6));
        const isTitle = hash(r * 2.3) > 0.7; // a few rows read as headers

        for (let c = 0; c < cols; c += 1) {
          const inLabel = c < len;
          // home position = neat left-aligned cell
          const hx = left + c * colW + px;
          const hy = ry;
          // scatter position = deterministic drifting cloud
          const sd = hash2(r * 1.7 + 0.1, c * 0.9 + 0.2);
          const sd2 = hash2(c * 1.3 + 0.4, r * 0.7 + 0.6);
          const driftA = (t * 0.25 + sd * 6.283);
          const sx = lerp(left * 0.3, W - colW, sd) + Math.cos(driftA) * 26 * (0.5 + sd2);
          const sy = lerp(pad * 0.5, H - pad * 0.5, sd2) + Math.sin(driftA * 0.8) * 22 * (0.4 + sd);

          // glyph morph: scattered chars cycle fast, settle to a stable char on compile
          const settled = ease > 0.6;
          const gi = settled
            ? Math.floor(hash2(r * 3.1 + c * 0.5, 9.1) * GLYPHS.length)
            : Math.floor((hash2(r + c * 0.01, Math.floor(t * 9) + c) ) * GLYPHS.length);
          const ch = GLYPHS[gi] || '0';

          const x = lerp(sx, hx, ease);
          const y = lerp(sy, hy, ease);

          // alpha: label chars brighten as they home; non-label noise fades out on compile
          let a;
          if (inLabel) {
            a = lerp(0.05, isTitle ? 0.4 : 0.26, ease);
          } else {
            a = (1 - ease) * 0.07; // background noise glyphs recede during compile
            if (a < 0.01) continue;
          }

          // sparse red tokens: a leading sigil + rare accent chars in compiled labels
          const isSigil = inLabel && c === 0 && ease > 0.4;
          const isAccent = inLabel && ease > 0.7 && hash2(r + 0.5, c * 2.1) > 0.945;
          ctx.fillStyle = isSigil ? A(0.6 * ease) : isAccent ? A(0.55) : white(a);
          ctx.fillText(isSigil ? '>' : ch, x, y);
        }

        // red caret/scan on the row currently resolving (its rowAsm crossing mid)
        if (rowAsm > 0.15 && rowAsm < 0.95) {
          const head = left + Math.floor(len * rowAsm) * colW + px;
          const blink = (Math.sin(t * 8) * 0.5 + 0.5) > 0.4 ? 1 : 0.3;
          ctx.fillStyle = A(0.5 * blink);
          ctx.fillRect(head, ry - fontSize * 0.55, colW * 0.8, fontSize * 1.1);
        }
      }

      // faint guide rail on the left margin — the compile target column
      const railA = lerp(0.04, 0.12, asm);
      ctx.strokeStyle = white(railA);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left - 12 + px, top - lineH * 0.4);
      ctx.lineTo(left - 12 + px, Math.min(top + rows * lineH, H - pad * 0.5));
      ctx.stroke();

      // status tick on the rail marking compile progress
      const tickY = lerp(top - lineH * 0.4, Math.min(top + rows * lineH, H - pad * 0.5), clamp(asm, 0, 1));
      ctx.fillStyle = A(0.5 * asm + 0.1);
      ctx.fillRect(left - 16 + px, tickY - 3, 8, 6);
    },
    dispose() {},
  };
});
