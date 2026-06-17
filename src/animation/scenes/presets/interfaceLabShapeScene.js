import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawDotGrid, hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

/* INTERFACE LAB SHAPE — abstract UI "component" specimens (toolbars, cards,
   toggles) as rounded-rect outlines with corner brackets that snap to a grid
   and periodically resize / rearrange between layout takes. */
registerScene('interface-lab-shape', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cell = 48;
  let cols = 12;
  let rows = 8;
  let originX = 0;
  let originY = 0;
  let compCount = 9;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = q === 'low' || q === 'static' ? 0.6 : q === 'medium' ? 0.82 : 1;
    cell = clamp(Math.min(W, H) / 14, 34, 64);
    cols = Math.max(6, Math.floor((W * 0.78) / cell));
    rows = Math.max(5, Math.floor((H * 0.78) / cell));
    originX = (W - cols * cell) / 2;
    originY = (H - rows * cell) / 2;
    compCount = Math.max(5, Math.round(10 * scale * density));
  };
  build(width, height);

  // deterministic layout "take" for a given component index + take number
  const layout = (i, take) => {
    const s = hash2(i * 3.1 + 1, take * 7.7 + 2);
    const s2 = hash2(i * 5.9 + 3, take * 2.3 + 4);
    const s3 = hash2(i * 1.7 + 5, take * 9.1 + 6);
    // component archetype: 0 toolbar(wide), 1 card(block), 2 toggle(tiny)
    const kind = s3 < 0.32 ? 0 : s3 < 0.72 ? 1 : 2;
    let cw;
    let ch;
    if (kind === 0) {
      cw = 3 + Math.floor(s * 3);
      ch = 1;
    } else if (kind === 1) {
      cw = 2 + Math.floor(s * 2);
      ch = 2 + Math.floor(s2 * 2);
    } else {
      cw = 2;
      ch = 1;
    }
    cw = Math.min(cw, cols - 1);
    ch = Math.min(ch, rows - 1);
    const gx = Math.floor(s2 * (cols - cw));
    const gy = Math.floor(s * (rows - ch));
    return { gx, gy, cw, ch, kind };
  };

  // rounded-rect path with optional corner brackets instead of full border
  const roundRect = (x, y, w, h, r) => {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.arcTo(x + w, y, x + w, y + rr, rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
    ctx.lineTo(x + rr, y + h);
    ctx.arcTo(x, y + h, x, y + h - rr, rr);
    ctx.lineTo(x, y + rr);
    ctx.arcTo(x, y, x + rr, y, rr);
    ctx.closePath();
  };

  const corners = (x, y, w, h, len, alpha) => {
    ctx.strokeStyle = A(alpha);
    ctx.lineWidth = 1.2;
    const L = Math.min(len, w * 0.4, h * 0.4);
    ctx.beginPath();
    // tl
    ctx.moveTo(x, y + L); ctx.lineTo(x, y); ctx.lineTo(x + L, y);
    // tr
    ctx.moveTo(x + w - L, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + L);
    // br
    ctx.moveTo(x + w, y + h - L); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - L, y + h);
    // bl
    ctx.moveTo(x + L, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - L);
    ctx.stroke();
  };

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const ox = p.active ? p.nx * 8 : 0;
      const oy = p.active ? p.ny * 8 : 0;

      // faint snap-grid backplate the specimens align to
      drawDotGrid(ctx, {
        w: W,
        h: H,
        t,
        cell,
        alpha: 0.05,
        accent: A,
        pulse: true,
      });

      // layout take cycles slowly; each component morphs on its own clock
      const cycle = 4.2;
      const take = Math.floor(t / cycle);
      const phase = (t % cycle) / cycle;
      // ease in/out of a settle: fast snap then hold
      const morph = clamp((phase - 0.0) / 0.22, 0, 1);
      const ease = morph * morph * (3 - 2 * morph);

      for (let i = 0; i < compCount; i += 1) {
        const a = layout(i, take);
        const b = layout(i, take + 1);
        // interpolate grid cells then snap to pixel grid
        const gx = lerp(a.gx, b.gx, ease);
        const gy = lerp(a.gy, b.gy, ease);
        const cw = lerp(a.cw, b.cw, ease);
        const ch = lerp(a.ch, b.ch, ease);
        const kind = ease < 0.5 ? a.kind : b.kind;

        const pad = cell * 0.16;
        const x = originX + gx * cell + pad + ox;
        const y = originY + gy * cell + pad + oy;
        const w = cw * cell - pad * 2;
        const h = ch * cell - pad * 2;
        if (w < 6 || h < 6) continue;

        // "settling" flash on the frame just after a rearrange
        const settle = 1 - clamp(morph * 1.4, 0, 1);
        const hot = hash(i * 4.3 + take * 1.7) > 0.7;

        // body outline — white, low alpha
        roundRect(x, y, w, h, 6);
        ctx.strokeStyle = white(0.16 + settle * 0.12);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = white(0.02 + settle * 0.03);
        ctx.fill();

        // corner brackets, slightly hotter while morphing or on hot components
        corners(x, y, w, h, cell * 0.3, 0.18 + settle * 0.4 + (hot ? 0.2 : 0));

        // internal specimen detail per archetype
        if (kind === 0) {
          // toolbar: row of small button slots
          const slots = Math.max(2, Math.round(w / (cell * 0.7)));
          for (let s = 0; s < slots; s += 1) {
            const sx = x + 6 + (s + 0.5) * ((w - 12) / slots);
            ctx.beginPath();
            ctx.arc(sx, y + h / 2, 2, 0, TAU);
            ctx.fillStyle = s === 0 ? A(0.7) : white(0.35);
            ctx.fill();
          }
        } else if (kind === 1) {
          // card: header bar + content lines
          ctx.strokeStyle = white(0.1);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + 6, y + cell * 0.42);
          ctx.lineTo(x + w - 6, y + cell * 0.42);
          ctx.stroke();
          const lines = Math.max(1, Math.floor((h - cell * 0.55) / (cell * 0.32)));
          for (let l = 0; l < lines; l += 1) {
            const ly = y + cell * 0.62 + l * cell * 0.32;
            if (ly > y + h - 6) break;
            const lw = (w - 14) * (0.4 + hash2(i + l, take) * 0.55);
            ctx.strokeStyle = white(0.08);
            ctx.beginPath();
            ctx.moveTo(x + 8, ly);
            ctx.lineTo(x + 8 + lw, ly);
            ctx.stroke();
          }
        } else {
          // toggle: track + knob that slides with state
          const on = hash(i * 8.9 + take) > 0.5;
          const slide = lerp(on ? 0 : 1, on ? 1 : 0, ease);
          const trackY = y + h / 2;
          ctx.strokeStyle = white(0.14);
          ctx.lineWidth = 1;
          roundRect(x + 6, trackY - 4, w - 12, 8, 4);
          ctx.stroke();
          const kx = x + 10 + slide * (w - 20);
          ctx.beginPath();
          ctx.arc(kx, trackY, 3, 0, TAU);
          ctx.fillStyle = on ? A(0.85) : white(0.5);
          ctx.fill();
        }
      }

      // active scan readout: a thin accent caret sweeping the lab gutter
      const sweep = (t * 0.18) % 1;
      const sx = originX + sweep * cols * cell + ox;
      ctx.strokeStyle = A(0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, originY - cell * 0.2 + oy);
      ctx.lineTo(sx, originY + rows * cell + cell * 0.2 + oy);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, originY - cell * 0.2 + oy, 2, 0, TAU);
      ctx.fillStyle = A(0.7);
      ctx.fill();
    },
    dispose() {},
  };
});
