/* ============================================================
   SCENE PRIMITIVES — stateless canvas drawing layers shared by preset scenes.
   Each primitive is a pure function of (ctx, opts); presets compose 1–3 of
   them with their own structure/accent/motion to get a distinct identity.
   Procedural (time/seed driven) so there is no per-instance array state to
   manage and they stay allocation-free in the draw loop.

   Common opts: { w, h, t, color, accent, density, level } where
     w,h     = section pixel size
     t       = time in seconds
     color   = white(alpha) helper result string or a base alpha number
     accent  = accentFn(hex) -> (alpha)=>rgba string
     density = 0.5..1.4 quality/intensity multiplier
   ============================================================ */
import { white } from '../../scenePalette';
import { TAU } from '../../easing';

/* deterministic hash -> 0..1, for stable procedural placement */
export function hash(n) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}
export function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/* ---- GRID: scrolling / perspective line grid ---- */
export function drawGrid(ctx, { w, h, t = 0, cell = 64, alpha = 0.06, scroll = 0, accentEvery = 0, accent }) {
  ctx.lineWidth = 1;
  const ox = ((t * scroll) % cell);
  const oy = ((t * scroll * 0.6) % cell);
  let i = 0;
  for (let x = -cell + ox; x <= w + cell; x += cell, i += 1) {
    ctx.strokeStyle = accentEvery && accent && i % accentEvery === 0 ? accent(alpha * 2) : white(alpha);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  i = 0;
  for (let y = -cell + oy; y <= h + cell; y += cell, i += 1) {
    ctx.strokeStyle = white(alpha);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

/* ---- DOT GRID: lattice of dots with a travelling pulse wave ---- */
export function drawDotGrid(ctx, { w, h, t = 0, cell = 46, alpha = 0.18, accent, pulse = true }) {
  for (let y = cell / 2; y < h; y += cell) {
    for (let x = cell / 2; x < w; x += cell) {
      const d = pulse ? Math.sin(t * 1.6 - (x + y) * 0.01) * 0.5 + 0.5 : 0.5;
      const r = 0.7 + d * 1.4;
      ctx.fillStyle = d > 0.85 && accent ? accent(0.7) : white(alpha * (0.4 + d * 0.6));
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }
  }
}

/* ---- ARCS: concentric rings / partial arcs that rotate ---- */
export function drawArcs(ctx, { cx, cy, t = 0, count = 6, rStep = 30, alpha = 0.1, accent, accentRing = 2, spread = 0.7 }) {
  for (let i = 0; i < count; i += 1) {
    const r = rStep * (i + 1);
    const span = (Math.sin(t * 0.4 + i * 0.7) * 0.5 + 0.5) * TAU * spread + 0.3;
    const rot = t * (i % 2 ? -0.2 : 0.25) + i;
    const isAcc = i === accentRing;
    ctx.beginPath();
    ctx.arc(cx, cy, r, rot, rot + span);
    ctx.lineWidth = isAcc ? 1.6 : 1;
    ctx.strokeStyle = isAcc && accent ? accent(0.32) : white(alpha);
    ctx.stroke();
    const ex = cx + Math.cos(rot + span) * r;
    const ey = cy + Math.sin(rot + span) * r;
    ctx.beginPath();
    ctx.arc(ex, ey, isAcc ? 2.4 : 1.4, 0, TAU);
    ctx.fillStyle = isAcc && accent ? accent(0.9) : white(0.5);
    ctx.fill();
  }
}

/* ---- RADIAL BARS: bars around a circle (audio core / spectrum ring) ---- */
export function drawRadialBars(ctx, { cx, cy, t = 0, count = 64, inner = 60, alpha = 0.5, accent, bands = null, level = 0 }) {
  for (let i = 0; i < count; i += 1) {
    const a = (TAU * i) / count - TAU / 4;
    const v = bands
      ? bands[i % bands.length]
      : 0.18 + (Math.sin(t * 2 + i * 0.4) * 0.5 + 0.5) * 0.4;
    const len = 6 + v * (40 + level * 30);
    const x1 = cx + Math.cos(a) * inner;
    const y1 = cy + Math.sin(a) * inner;
    const x2 = cx + Math.cos(a) * (inner + len);
    const y2 = cy + Math.sin(a) * (inner + len);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = i % 6 === 0 && accent ? accent(0.5 + v * 0.4) : white(alpha * (0.3 + v * 0.7));
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

/* ---- WAVE: stacked horizontal signal waves ---- */
export function drawWave(ctx, { w, h, t = 0, rows = 3, amp = 28, alpha = 0.12, accent, level = 0 }) {
  const step = w > 1200 ? 8 : 6;
  for (let r = 0; r < rows; r += 1) {
    const baseY = (h * (r + 1)) / (rows + 1);
    const ph = t * (0.8 + r * 0.25) + r * 1.4;
    const a = amp * (1 + level) * (1 - r * 0.12);
    ctx.lineWidth = r === 0 ? 1.4 : 1;
    ctx.strokeStyle = r === 0 && accent ? accent(0.4) : white(alpha * (1 - r * 0.2));
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      const p = x / w;
      const y =
        baseY +
        Math.sin(p * TAU * 2.4 + ph) * a +
        Math.sin(p * TAU * 6.1 - ph * 0.7) * a * 0.3;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/* ---- AUDIO WAVE: full-width spectrum/waveform from audio bands ---- */
export function drawAudioWave(ctx, { w, h, t = 0, bands, level = 0, alpha = 0.5, accent, mode = 'bars' }) {
  const n = bands ? bands.length : 40;
  if (mode === 'bars') {
    const gap = 3;
    const bw = (w - gap * (n - 1)) / n;
    for (let i = 0; i < n; i += 1) {
      const v = bands ? bands[i] : 0.1 + (Math.sin(t * 1.4 + i * 0.5) * 0.5 + 0.5) * 0.18;
      const bh = Math.max(2, v * h * 0.6);
      ctx.fillStyle = i % 5 === 0 && accent ? accent(0.6) : white(alpha * (0.4 + v * 0.6));
      ctx.fillRect(i * (bw + gap), h - bh, bw, bh);
      ctx.fillStyle = accent ? accent(0.18) : white(0.1);
      ctx.fillRect(i * (bw + gap), h - bh - 2, bw, 2);
    }
    return;
  }
  // mirrored waveform
  const step = 6;
  const mid = h / 2;
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = accent ? accent(0.5) : white(alpha);
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const i = Math.floor((x / w) * n);
    const v = bands ? bands[i] : 0.1 + (Math.sin(t * 1.6 + i * 0.4) * 0.5 + 0.5) * 0.2;
    const y = mid - (v - 0.2) * h * (0.5 + level);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const i = Math.floor((x / w) * n);
    const v = bands ? bands[i] : 0.1 + (Math.sin(t * 1.6 + i * 0.4) * 0.5 + 0.5) * 0.2;
    const y = mid + (v - 0.2) * h * (0.5 + level);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/* ---- HEX: hexagonal lattice ---- */
export function drawHex(ctx, { w, h, t = 0, size = 34, alpha = 0.08, accent }) {
  const hw = size * Math.sqrt(3);
  let row = 0;
  for (let y = -size; y < h + size; y += size * 1.5, row += 1) {
    const offset = row % 2 ? hw / 2 : 0;
    for (let x = -hw; x < w + hw; x += hw) {
      const cx = x + offset;
      const flick = hash2(Math.round(cx), Math.round(y));
      const lit = (Math.sin(t * 1.2 + flick * TAU) * 0.5 + 0.5) > 0.93;
      ctx.beginPath();
      for (let k = 0; k < 6; k += 1) {
        const a = (TAU * k) / 6 + TAU / 12;
        const px = cx + Math.cos(a) * size * 0.5;
        const py = y + Math.sin(a) * size * 0.5;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = lit && accent ? accent(0.5) : white(alpha);
      ctx.stroke();
    }
  }
}

/* ---- PARTICLES: procedural drifting points (optionally connected) ---- */
export function drawParticles(ctx, { w, h, t = 0, count = 60, alpha = 0.4, accent, connect = false, speed = 1 }) {
  const pts = [];
  for (let i = 0; i < count; i += 1) {
    const sx = hash(i * 1.3);
    const sy = hash(i * 2.7 + 1);
    let x = (sx * w + t * speed * (10 + sx * 20)) % w;
    let y = (sy * h + Math.sin(t * 0.4 + i) * 16) % h;
    if (x < 0) x += w;
    if (y < 0) y += h;
    pts.push([x, y, i]);
    const r = 0.8 + hash(i) * 1.6;
    ctx.fillStyle = i % 9 === 0 && accent ? accent(0.7) : white(alpha * (0.4 + hash(i * 3) * 0.6));
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  if (connect) {
    const maxD = 130;
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD * maxD) {
          const o = (1 - Math.sqrt(d2) / maxD) * 0.12;
          ctx.strokeStyle = white(o);
          ctx.beginPath();
          ctx.moveTo(pts[i][0], pts[i][1]);
          ctx.lineTo(pts[j][0], pts[j][1]);
          ctx.stroke();
        }
      }
    }
  }
  return pts;
}

/* ---- NODES: fixed network of nodes + travelling packets on edges ---- */
export function drawNodes(ctx, { w, h, t = 0, count = 14, alpha = 0.5, accent }) {
  const nodes = [];
  for (let i = 0; i < count; i += 1) {
    const x = (0.1 + hash(i * 5.1) * 0.8) * w + Math.sin(t * 0.3 + i) * 10;
    const y = (0.1 + hash(i * 7.3 + 2) * 0.8) * h + Math.cos(t * 0.25 + i) * 10;
    nodes.push([x, y]);
  }
  ctx.lineWidth = 1;
  for (let i = 0; i < count; i += 1) {
    const j = (i + 1 + Math.floor(hash(i) * 3)) % count;
    ctx.strokeStyle = white(0.06);
    ctx.beginPath();
    ctx.moveTo(nodes[i][0], nodes[i][1]);
    ctx.lineTo(nodes[j][0], nodes[j][1]);
    ctx.stroke();
    // packet
    const f = (t * 0.4 + hash(i) ) % 1;
    const px = nodes[i][0] + (nodes[j][0] - nodes[i][0]) * f;
    const py = nodes[i][1] + (nodes[j][1] - nodes[i][1]) * f;
    if (accent) {
      ctx.fillStyle = accent(0.8);
      ctx.beginPath();
      ctx.arc(px, py, 1.6, 0, TAU);
      ctx.fill();
    }
  }
  for (let i = 0; i < count; i += 1) {
    const pulse = Math.sin(t * 2 + i) * 0.5 + 0.5;
    ctx.fillStyle = white(alpha * (0.5 + pulse * 0.5));
    ctx.beginPath();
    ctx.arc(nodes[i][0], nodes[i][1], 2 + pulse, 0, TAU);
    ctx.fill();
  }
  return nodes;
}

/* ---- CONTOURS: flowing topographic contour bands ---- */
export function drawContours(ctx, { w, h, t = 0, lines = 9, alpha = 0.1, accent }) {
  const step = w > 1200 ? 10 : 8;
  for (let l = 0; l < lines; l += 1) {
    const base = (h * (l + 0.5)) / lines;
    const isAcc = l === Math.floor(lines / 2);
    ctx.lineWidth = isAcc ? 1.4 : 1;
    ctx.strokeStyle = isAcc && accent ? accent(0.3) : white(alpha);
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      const y =
        base +
        Math.sin(x * 0.006 + t * 0.5 + l * 0.6) * 22 +
        Math.sin(x * 0.013 - t * 0.3 + l) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/* ---- RIBBONS: flowing spline ribbons across the field ---- */
export function drawRibbons(ctx, { w, h, t = 0, count = 5, alpha = 0.12, accent }) {
  const step = 14;
  for (let r = 0; r < count; r += 1) {
    const yBase = (h * (r + 0.5)) / count;
    const phase = r * 1.3;
    ctx.lineWidth = 1.5 + r * 0.3;
    ctx.strokeStyle = r % 2 === 0 && accent ? accent(0.22) : white(alpha);
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      const y = yBase + Math.sin(x * 0.004 + t * 0.7 + phase) * (40 + r * 10) + Math.cos(x * 0.01 - t + phase) * 14;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/* ---- VORONOI-ISH: scattered seed cells with nearest-seed shading edges ---- */
export function drawVoronoi(ctx, { w, h, t = 0, seeds = 12, alpha = 0.08, accent }) {
  const pts = [];
  for (let i = 0; i < seeds; i += 1) {
    pts.push([
      (0.08 + hash(i * 3.1) * 0.84) * w + Math.sin(t * 0.3 + i) * 18,
      (0.08 + hash(i * 4.7 + 1) * 0.84) * h + Math.cos(t * 0.27 + i * 1.3) * 18,
    ]);
  }
  ctx.lineWidth = 1;
  for (let i = 0; i < seeds; i += 1) {
    // connect each seed to its 2 nearest -> cell-like web
    const d = pts
      .map((p, j) => [j, (p[0] - pts[i][0]) ** 2 + (p[1] - pts[i][1]) ** 2])
      .filter((e) => e[0] !== i)
      .sort((a, b) => a[1] - b[1]);
    for (let k = 0; k < 2 && k < d.length; k += 1) {
      const j = d[k][0];
      ctx.strokeStyle = white(alpha);
      ctx.beginPath();
      ctx.moveTo(pts[i][0], pts[i][1]);
      ctx.lineTo(pts[j][0], pts[j][1]);
      ctx.stroke();
    }
    ctx.fillStyle = i % 5 === 0 && accent ? accent(0.6) : white(0.3);
    ctx.beginPath();
    ctx.arc(pts[i][0], pts[i][1], 1.6, 0, TAU);
    ctx.fill();
  }
  return pts;
}

/* ---- ISOMETRIC: a field of isometric modules / cubes ---- */
export function drawIsometric(ctx, { w, h, t = 0, size = 40, alpha = 0.1, accent }) {
  const iso = (x, y) => [x - y, (x + y) * 0.5];
  const cols = Math.ceil(w / size) + 4;
  const rows = Math.ceil((h / size) * 2) + 4;
  ctx.save();
  ctx.translate(w * 0.5, h * 0.2);
  for (let gy = 0; gy < rows; gy += 1) {
    for (let gx = -cols; gx < cols; gx += 1) {
      const [ix, iy] = iso(gx * size, gy * size);
      const lift = (Math.sin(t * 1.2 + gx * 0.4 + gy * 0.3) * 0.5 + 0.5);
      const up = lift > 0.8;
      const top = up ? size * 0.4 : 0;
      ctx.strokeStyle = up && accent ? accent(0.4) : white(alpha);
      ctx.lineWidth = 1;
      // top rhombus
      ctx.beginPath();
      ctx.moveTo(ix, iy - top);
      ctx.lineTo(ix + size, iy + size * 0.5 - top);
      ctx.lineTo(ix, iy + size - top);
      ctx.lineTo(ix - size, iy + size * 0.5 - top);
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* ---- REDACTION: rows of redaction bars with occasional reveal flicker ---- */
export function drawRedaction(ctx, { w, h, t = 0, rows = 10, alpha = 0.5, accent }) {
  const rh = h / rows;
  for (let r = 0; r < rows; r += 1) {
    const y = r * rh + rh * 0.3;
    let x = w * 0.06;
    const segs = 3 + Math.floor(hash(r) * 4);
    for (let s = 0; s < segs; s += 1) {
      const bw = (0.05 + hash(r * 3 + s) * 0.16) * w;
      const reveal = (Math.sin(t * 0.8 + r * 0.5 + s) * 0.5 + 0.5) > 0.9;
      ctx.fillStyle = reveal && accent ? accent(0.18) : white(alpha * (0.1 + hash(r + s) * 0.15));
      ctx.fillRect(x, y, bw, rh * 0.34);
      x += bw + w * 0.02;
      if (x > w * 0.9) break;
    }
  }
}

/* ---- GLYPHS: falling glyph/code columns (text rain) ---- */
const GLYPH = '01<>{}[]/\\=+*#%·—|';
export function drawGlyphs(ctx, { w, h, t = 0, cols = 22, alpha = 0.4, accent, fontSize = 12 }) {
  ctx.font = `${fontSize}px var(--font-mono, monospace)`;
  ctx.textBaseline = 'top';
  const cw = w / cols;
  for (let c = 0; c < cols; c += 1) {
    const speed = 30 + hash(c) * 70;
    const head = (t * speed) % (h + 120);
    const len = 6 + Math.floor(hash(c * 2) * 8);
    for (let k = 0; k < len; k += 1) {
      const y = head - k * fontSize * 1.4;
      if (y < -fontSize || y > h) continue;
      const ch = GLYPH[Math.floor(hash2(c, Math.floor(y / 10) + Math.floor(t * 4)) * GLYPH.length)] || '0';
      const fade = 1 - k / len;
      ctx.fillStyle = k === 0 && accent ? accent(0.8) : white(alpha * fade);
      ctx.fillText(ch, c * cw + cw * 0.3, y);
    }
  }
}

/* ---- SCAN: a soft moving scan band ---- */
export function drawScan(ctx, { w, h, t = 0, axis = 'y', alpha = 0.05, accent, speed = 0.12 }) {
  if (axis === 'y') {
    const y = ((t * speed) % 1) * h;
    const g = ctx.createLinearGradient(0, y - 60, 0, y + 60);
    g.addColorStop(0, white(0));
    g.addColorStop(0.5, accent ? accent(alpha * 3) : white(alpha));
    g.addColorStop(1, white(0));
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 60, w, 120);
  } else {
    const x = ((t * speed) % 1) * w;
    const g = ctx.createLinearGradient(x - 60, 0, x + 60, 0);
    g.addColorStop(0, white(0));
    g.addColorStop(0.5, accent ? accent(alpha * 3) : white(alpha));
    g.addColorStop(1, white(0));
    ctx.fillStyle = g;
    ctx.fillRect(x - 60, 0, 120, h);
  }
}

/* ---- RADAR SWEEP: rotating radar wedge over range rings ---- */
export function drawRadar(ctx, { cx, cy, t = 0, radius = 200, rings = 4, alpha = 0.1, accent }) {
  for (let i = 1; i <= rings; i += 1) {
    ctx.strokeStyle = white(alpha);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, (radius / rings) * i, 0, TAU);
    ctx.stroke();
  }
  const a = (t * 0.7) % TAU;
  const g = ctx.createConicGradient ? ctx.createConicGradient(a, cx, cy) : null;
  if (g && accent) {
    g.addColorStop(0, accent(0.25));
    g.addColorStop(0.08, accent(0));
    g.addColorStop(1, accent(0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, a - 0.5, a);
    ctx.closePath();
    ctx.fill();
  }
  // sweep line
  ctx.strokeStyle = accent ? accent(0.6) : white(0.4);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
  ctx.stroke();
}

/* ---- VECTOR FIELD: arrows following a flow angle (optionally pointer-warped) ---- */
export function drawVectorField(ctx, { w, h, t = 0, cell = 54, alpha = 0.18, accent, pointer }) {
  const len = cell * 0.34;
  const p = pointer || {};
  for (let y = cell / 2; y < h; y += cell) {
    for (let x = cell / 2; x < w; x += cell) {
      let a = Math.sin(x * 0.01 + t * 0.6) + Math.cos(y * 0.01 - t * 0.5);
      if (p.active) {
        const dx = x - (p.x || 0);
        const dy = y - (p.y || 0);
        const d = Math.hypot(dx, dy);
        if (d < 220) a += Math.atan2(dy, dx) * (1 - d / 220);
      }
      const ex = x + Math.cos(a) * len;
      const ey = y + Math.sin(a) * len;
      ctx.strokeStyle = white(alpha);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.fillStyle = accent ? accent(0.4) : white(0.3);
      ctx.beginPath();
      ctx.arc(ex, ey, 1, 0, TAU);
      ctx.fill();
    }
  }
}

export { white };
