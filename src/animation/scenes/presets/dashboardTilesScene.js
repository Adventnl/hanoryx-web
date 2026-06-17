/* DASHBOARD TILES — a bento grid of varied-size panels, each running a tiny live
   widget (sparkline, mini bars, blinking dot, gauge arc, ticker), while a single
   red focus highlight glides from tile to tile like a roving control cursor. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash, hash2 } from '../primitives';
import { TAU, clamp, lerp, easeInOutSine } from '../../easing';

registerScene('dashboard-tiles', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let tiles = [];
  let margin = 18;
  let gap = 10;

  // bento layout: recursively split the canvas into a small set of tiles
  const buildTiles = () => {
    const inW = W - margin * 2;
    const inH = H - margin * 2;
    const out = [];
    // target tile count scales with quality/density (kept small + premium)
    const target = quality === 'static' || quality === 'low'
      ? 7 : quality === 'medium' ? 10 : Math.round(13 * clamp(density, 0.6, 1.4));

    const split = (x, y, w, h, depth, seed) => {
      const big = Math.min(w, h);
      const tooSmall = big < Math.min(inW, inH) * 0.18;
      if (depth <= 0 || tooSmall || out.length >= target - 1) {
        out.push({ x, y, w, h });
        return;
      }
      const r = hash(seed * 1.7 + depth);
      const horizontal = w >= h ? r < 0.78 : r < 0.22;
      const ratio = 0.36 + hash(seed * 2.3 + depth * 0.7) * 0.28;
      if (horizontal) {
        const a = Math.round(w * ratio);
        split(x, y, a, h, depth - 1, seed + 1.1);
        split(x + a, y, w - a, h, depth - 1, seed + 7.3);
      } else {
        const a = Math.round(h * ratio);
        split(x, y, w, a, depth - 1, seed + 2.9);
        split(x, y + a, w, h - a, depth - 1, seed + 5.5);
      }
    };
    split(0, 0, inW, inH, 5, 3.14);

    // assign a widget kind + per-tile motion seeds, inset by gap
    tiles = out.slice(0, target).map((r, i) => {
      const kind = Math.floor(hash(i * 4.2 + 0.7) * 5); // 0 spark 1 bars 2 dots 3 gauge 4 ticker
      return {
        x: margin + r.x + gap / 2,
        y: margin + r.y + gap / 2,
        w: Math.max(8, r.w - gap),
        h: Math.max(8, r.h - gap),
        kind,
        seed: hash2(i + 1.3, i * 0.9),
        rate: 0.4 + hash(i * 3.1) * 1.6,
        cx: margin + r.x + r.w / 2,
        cy: margin + r.y + r.h / 2,
      };
    });
  };

  const build = (w, h) => {
    W = w;
    H = h;
    margin = clamp(Math.min(W, H) * 0.04, 12, 34);
    gap = clamp(Math.min(W, H) * 0.018, 6, 14);
    buildTiles();
  };
  build(width, height);

  // a small sparkline polyline driven by smooth multi-sine + tile seed
  const sparkY = (i, n, t, seed, rate) => {
    const u = i / (n - 1);
    return (
      Math.sin(u * 6.2 + t * rate + seed * TAU) * 0.5 +
      Math.sin(u * 13.1 - t * rate * 0.6) * 0.28 +
      Math.sin(t * rate * 1.7 + seed * 9.0) * 0.18
    );
  };

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const n = tiles.length;
      if (n === 0) return;

      // focus cursor: hop between tiles on a timed cycle, eased between targets
      const dwell = 1.9;
      const phase = t / dwell;
      const from = Math.floor(phase) % n;
      const to = (from + 1 + (Math.floor(phase / n) % (n - 1))) % n; // skip around
      const k = easeInOutSine(clamp((phase % 1) * 1.35, 0, 1));
      const fa = tiles[from];
      const fb = tiles[to];
      const fx = lerp(fa.x, fb.x, k);
      const fy = lerp(fa.y, fb.y, k);
      const fw = lerp(fa.w, fb.w, k);
      const fh = lerp(fa.h, fb.h, k);

      // pointer can override focus toward the hovered tile
      let pHover = -1;
      if (p.active) {
        for (let i = 0; i < n; i += 1) {
          const ti = tiles[i];
          if (p.x >= ti.x && p.x <= ti.x + ti.w && p.y >= ti.y && p.y <= ti.y + ti.h) {
            pHover = i;
            break;
          }
        }
      }

      for (let i = 0; i < n; i += 1) {
        const ti = tiles[i];
        const focused = i === (pHover >= 0 ? pHover : -1) ||
          (pHover < 0 && (i === from || i === to));
        const x = ti.x;
        const y = ti.y;
        const w = ti.w;
        const h = ti.h;

        // tile frame: faint white outline, dim fill
        ctx.fillStyle = white(0.018);
        ctx.fillRect(x, y, w, h);
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(focused ? 0.18 : 0.07);
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

        // header tick: a short bar + tiny label dot at top-left
        ctx.fillStyle = white(0.12);
        ctx.fillRect(x + 7, y + 7, Math.min(w * 0.4, 34), 2);
        ctx.fillStyle = focused ? A(0.85) : white(0.16);
        ctx.fillRect(x + w - 11, y + 7, 4, 4);

        // widget content region
        const padX = 8;
        const top = y + 16;
        const bx = x + padX;
        const bw = w - padX * 2;
        const bh = y + h - top - 8;
        if (bw < 10 || bh < 8) continue;

        const wn = focused ? A(0.55) : white(0.16);
        const wstrong = focused ? A(0.9) : white(0.3);

        if (ti.kind === 0) {
          // sparkline
          const seg = clamp(Math.floor(bw / 6), 8, 40);
          ctx.beginPath();
          for (let s = 0; s < seg; s += 1) {
            const sx = bx + (s / (seg - 1)) * bw;
            const v = sparkY(s, seg, t, ti.seed, ti.rate);
            const sy = top + bh * 0.5 - v * bh * 0.42;
            if (s === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
          }
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = wstrong;
          ctx.stroke();
          // leading dot
          const lv = sparkY(seg - 1, seg, t, ti.seed, ti.rate);
          ctx.fillStyle = focused ? A(1) : white(0.5);
          ctx.beginPath();
          ctx.arc(bx + bw, top + bh * 0.5 - lv * bh * 0.42, 2.4, 0, TAU);
          ctx.fill();
        } else if (ti.kind === 1) {
          // mini bars
          const cnt = clamp(Math.floor(bw / 7), 4, 16);
          const gw = bw / cnt;
          for (let b = 0; b < cnt; b += 1) {
            const v = 0.2 + (Math.sin(t * ti.rate + b * 0.7 + ti.seed * 9) * 0.5 + 0.5) * 0.8;
            const barH = v * bh;
            ctx.fillStyle = (focused && b === cnt - 1) ? A(0.9) : wn;
            ctx.fillRect(bx + b * gw + 1, top + bh - barH, gw - 2, barH);
          }
        } else if (ti.kind === 2) {
          // pulse dot lattice
          const cell = clamp(Math.min(bw, bh) / 4, 7, 16);
          const cols = Math.max(2, Math.floor(bw / cell));
          const rows = Math.max(1, Math.floor(bh / cell));
          const offx = bx + (bw - cols * cell) / 2 + cell / 2;
          const offy = top + (bh - rows * cell) / 2 + cell / 2;
          for (let r = 0; r < rows; r += 1) {
            for (let c = 0; c < cols; c += 1) {
              const ph = (Math.sin(t * ti.rate * 1.4 - (c + r) * 0.6 + ti.seed * 6) * 0.5 + 0.5);
              const rad = 1 + ph * 2.2;
              const hot = focused && ph > 0.85;
              ctx.fillStyle = hot ? A(0.95) : white(0.1 + ph * 0.28);
              ctx.beginPath();
              ctx.arc(offx + c * cell, offy + r * cell, rad, 0, TAU);
              ctx.fill();
            }
          }
        } else if (ti.kind === 3) {
          // gauge arc
          const gcx = bx + bw / 2;
          const gcy = top + bh * 0.62;
          const gr = Math.min(bw, bh) * 0.45;
          const val = Math.sin(t * ti.rate * 0.7 + ti.seed * 8) * 0.5 + 0.5;
          ctx.lineWidth = 2.2;
          ctx.strokeStyle = white(0.08);
          ctx.beginPath();
          ctx.arc(gcx, gcy, gr, Math.PI * 0.9, Math.PI * 2.1);
          ctx.stroke();
          ctx.strokeStyle = wstrong;
          ctx.beginPath();
          ctx.arc(gcx, gcy, gr, Math.PI * 0.9, Math.PI * 0.9 + val * (Math.PI * 1.2));
          ctx.stroke();
          // needle tip
          const ang = Math.PI * 0.9 + val * (Math.PI * 1.2);
          ctx.fillStyle = focused ? A(1) : white(0.45);
          ctx.beginPath();
          ctx.arc(gcx + Math.cos(ang) * gr, gcy + Math.sin(ang) * gr, 2.2, 0, TAU);
          ctx.fill();
        } else {
          // ticker: scrolling segmented readout rows
          const rowH = clamp(bh / 3, 6, 14);
          const rcount = Math.max(1, Math.floor(bh / rowH));
          for (let r = 0; r < rcount; r += 1) {
            const ry = top + r * rowH + rowH * 0.3;
            const segs = clamp(Math.floor(bw / 10), 2, 8);
            const scroll = (t * ti.rate * 14 + r * 17) % (bw + 20);
            for (let s = 0; s < segs; s += 1) {
              const sx = bx + ((s * (bw / segs) - scroll + bw + 20) % (bw + 20));
              const lit = hash2(s + r * 2.1, Math.floor(t * ti.rate + r) ) > 0.6;
              ctx.fillStyle = (focused && lit) ? A(0.8) : white(lit ? 0.22 : 0.08);
              ctx.fillRect(sx, ry, (bw / segs) * 0.5, 2);
            }
          }
        }
      }

      // roving focus highlight — bright corner brackets sliding tile to tile
      const br = clamp(Math.min(fw, fh) * 0.22, 6, 16);
      ctx.strokeStyle = A(0.9);
      ctx.lineWidth = 1.6;
      const corners = [
        [fx, fy, 1, 1],
        [fx + fw, fy, -1, 1],
        [fx, fy + fh, 1, -1],
        [fx + fw, fy + fh, -1, -1],
      ];
      for (let c = 0; c < 4; c += 1) {
        const [ox, oy, sx, sy] = corners[c];
        ctx.beginPath();
        ctx.moveTo(ox + sx * br, oy);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox, oy + sy * br);
        ctx.stroke();
      }
      // faint focus wash
      ctx.fillStyle = A(0.05 + Math.sin(t * 3) * 0.02 + 0.02);
      ctx.fillRect(fx, fy, fw, fh);
    },
    dispose() {},
  };
});
