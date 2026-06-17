import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawScan, hash, hash2 } from '../primitives';
import { clamp, lerp } from '../../easing';

/* TOOLING CONSOLE — a faint terminal: a prompt with a blinking caret, left-aligned
   mono glyph lines that type in char-by-char, and a command-palette box that slides
   in from the right then retracts, its top entry highlighted red. */
registerScene('tooling-console', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let pad = 40, lineH = 22, fontSize = 13, rows = 12, cols = 60;

  const build = (w, h) => {
    W = w; H = h;
    const scale = quality === 'static' || quality === 'low' ? 0.7 : quality === 'medium' ? 0.88 : 1;
    fontSize = Math.round(clamp(Math.min(W, H) * 0.02, 11, 15) * scale);
    lineH = fontSize * 1.7;
    pad = Math.round(W * 0.06) + 20;
    rows = clamp(Math.floor((H - pad * 2) / lineH), 4, Math.round(14 * density));
    cols = clamp(Math.floor((W * 0.55) / (fontSize * 0.62)), 20, 80);
  };
  build(width, height);

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-_.:>$%#abcdefghijklmnopqrstuvwxyz';

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // faint ambient scan band drifting down the console
      drawScan(ctx, { w: W, h: H, t, axis: 'y', alpha: 0.02, accent: A, speed: 0.05 });

      const left = pad;
      const top = pad + (p.active ? p.ny * 6 : 0);
      const colW = fontSize * 0.62;
      const cycle = 4.2;             // seconds to fully type one line
      ctx.font = `${fontSize}px var(--font-mono, monospace)`;
      ctx.textBaseline = 'middle';

      // active typing line index advances over time; lines above are "committed"
      const active = Math.floor(t / cycle) % rows;
      const phase = (t % cycle) / cycle; // 0..1 within current line

      for (let r = 0; r < rows; r += 1) {
        const y = top + r * lineH + lineH * 0.5;
        if (y > H - pad * 0.5) break;

        // each row gets a deterministic length & whether it's a prompt or output
        const isPrompt = hash(r * 3.1) > 0.45;
        const len = 8 + Math.floor(hash2(r, 5) * (cols - 12));

        // how much of this row is revealed
        let reveal;
        if (r < active) reveal = 1;                 // already typed
        else if (r > active) reveal = 0;            // not started
        else reveal = clamp(phase * 1.15, 0, 1);    // currently typing
        if (reveal <= 0) continue;

        let x = left;
        // prompt sigil
        if (isPrompt) {
          ctx.fillStyle = A(r === active ? 0.7 : 0.4);
          ctx.fillText('>', x, y);
          x += colW * 2;
        } else {
          ctx.fillStyle = white(0.12);
          ctx.fillText('·', x, y);
          x += colW * 2;
        }

        const shown = Math.floor(len * reveal);
        const baseAlpha = isPrompt ? 0.28 : 0.16;
        const fade = r < active ? 0.62 : 1;  // committed lines dim slightly
        for (let c = 0; c < shown; c += 1) {
          const gi = Math.floor(hash2(r * 1.7 + c * 0.9, 11 + c) * GLYPHS.length);
          const ch = GLYPHS[gi] || '0';
          // sparse red tokens at deterministic positions
          const isAccent = isPrompt && hash2(r + 0.5, c) > 0.93;
          ctx.fillStyle = isAccent ? A(0.55 * fade) : white(baseAlpha * fade);
          ctx.fillText(ch, x + c * colW, y);
        }

        // blinking caret on the active line, at the typed head
        if (r === active) {
          const blink = (Math.sin(t * 7) * 0.5 + 0.5) > 0.45 ? 1 : 0.15;
          const cx = x + shown * colW + 1;
          ctx.fillStyle = A(0.5 * blink + 0.1);
          ctx.fillRect(cx, y - fontSize * 0.55, colW * 0.85, fontSize * 1.1);
        }
      }

      // outer console frame
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.06);
      ctx.strokeRect(left - 14, top - 14, W - (left - 14) - pad * 0.4, Math.min(rows, Math.floor((H - top) / lineH)) * lineH + 10);

      // command-palette box: slides in from the right, dwells, retracts
      const palCycle = 9;
      const pp = (t % palCycle) / palCycle;
      // slide-in 0..0.18, hold .18..0.7, slide-out .7..0.88
      let s;
      if (pp < 0.18) s = pp / 0.18;
      else if (pp < 0.7) s = 1;
      else if (pp < 0.88) s = 1 - (pp - 0.7) / 0.18;
      else s = 0;
      s = clamp(s, 0, 1);
      const ease = s * s * (3 - 2 * s);

      if (ease > 0.01) {
        const palW = clamp(W * 0.28, 180, 320);
        const entryH = lineH;
        const entries = clamp(4, 4, rows);
        const palH = entryH * (entries + 0.6) + 16;
        const palX = lerp(W + 20, W - palW - pad * 0.5, ease);
        const palY = top + lineH * 0.5;

        ctx.save();
        ctx.globalAlpha = ease;
        // panel
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(palX, palY, palW, palH);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = white(0.18);
        ctx.strokeRect(palX, palY, palW, palH);

        // search field line at top
        ctx.fillStyle = white(0.04);
        ctx.fillRect(palX + 8, palY + 8, palW - 16, entryH * 0.7);
        ctx.fillStyle = A(0.6);
        ctx.fillText('>', palX + 14, palY + 8 + entryH * 0.35);

        // palette entries; first is selected (red bar + brighter text)
        ctx.textBaseline = 'middle';
        for (let e = 0; e < entries; e += 1) {
          const ey = palY + entryH * (e + 1) + 12;
          const sel = e === (Math.floor(t * 0.8) % entries);
          if (sel) {
            ctx.fillStyle = A(0.14);
            ctx.fillRect(palX + 4, ey - entryH * 0.45, palW - 8, entryH * 0.9);
            ctx.fillStyle = A(0.9);
            ctx.fillRect(palX + 4, ey - entryH * 0.45, 2.5, entryH * 0.9);
          }
          const elen = 6 + Math.floor(hash(e * 4.4) * 14);
          for (let c = 0; c < elen; c += 1) {
            const gi = Math.floor(hash2(e * 2.2, c) * GLYPHS.length);
            const ch = GLYPHS[gi] || '0';
            ctx.fillStyle = sel ? white(0.7) : white(0.22);
            ctx.fillText(ch, palX + 16 + c * colW * 0.85, ey);
          }
        }
        ctx.restore();
      }
    },
    dispose() {},
  };
});
