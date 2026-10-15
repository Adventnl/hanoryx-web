import { Sim } from '../Sim';
import { TAU, at, dot, line, plot, prune, rnd, vnoise, wipe } from '../draw';
import c from './waves.module.css';

/* ============================================================
   44 · WAVES — ripples, interference and noise.
   The still side is two sets of rings that spread apart as the scroll advances,
   so the pattern where they overlap shifts. Each of the forty-two specimens is
   a wave drawn on its own canvas through the shared Sim engine (Sim.jsx): it
   runs only while on screen, draws one settled frame under reduced motion, and
   where the pointer matters it is the pointer, or the arrow keys with Enter.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.rings} />
      <small>2 SOURCES · 1 PATTERN</small>
    </div>
  );
}

const SIMS = [];
const add = (name, label, mode, setup, tick) => SIMS.push([name, label, mode, setup, tick]);
const none = () => ({});
const mid = (S) => S.h / 2;
const GREEN = '#6ee7b7';
const BLUE = '#60a5fa';
const RED = '#ff6b6b';
/* horizontal position of the pointer as 0..1, or a slow sweep when nobody is pointing */
const px = (S) => (S.in.has ? S.in.x / S.w : 0.5 + Math.sin(S.t * 0.6) * 0.4);
const py = (S) => (S.in.has ? S.in.y / S.h : 0.5 + Math.sin(S.t * 0.8 + 1) * 0.4);

/* 01 */ add('Sine line', 'A sine wave travelling along a line', 'auto', none, (S) => { wipe(S); plot(S, (x) => mid(S) + Math.sin(x * 0.08 - S.t * 3) * S.h * 0.28); });

/* 02 */ add('Wave stack', 'Stacked lines rippling like a signal plot', 'auto', none, (S) => {
  wipe(S);
  for (let r = 0; r < 12; r += 1) {
    const base = 14 + r * 7;
    S.ctx.fillStyle = '#07080a';
    S.ctx.beginPath(); S.ctx.moveTo(0, base);
    for (let x = 0; x <= S.w; x += 2) { const k = Math.exp(-(((x - S.w / 2) / (S.w * 0.22)) ** 2)); S.ctx.lineTo(x, base - k * (8 + vnoise(x * 0.09 + r * 7, S.t * 1.5 + r) * 14)); }
    S.ctx.lineTo(S.w, base + 20); S.ctx.lineTo(0, base + 20); S.ctx.fill();
    S.ctx.strokeStyle = `rgba(255,255,255,${0.35 + r * 0.05})`; S.ctx.lineWidth = 0.9; S.ctx.beginPath();
    for (let x = 0; x <= S.w; x += 2) { const k = Math.exp(-(((x - S.w / 2) / (S.w * 0.22)) ** 2)); const y = base - k * (8 + vnoise(x * 0.09 + r * 7, S.t * 1.5 + r) * 14); if (x === 0) S.ctx.moveTo(x, y); else S.ctx.lineTo(x, y); }
    S.ctx.stroke();
  }
});

/* 03 */ add('Layered swells', 'Four layers of sea sliding at different speeds', 'auto', none, (S) => {
  wipe(S);
  [[0.4, 0.07, 1.0, '#1d4f91'], [0.5, 0.09, 1.6, '#2563a8'], [0.62, 0.06, 2.2, '#3b82c4'], [0.76, 0.08, 3, '#60a5e0']].forEach(([top, f, v, col]) => {
    S.ctx.fillStyle = col; S.ctx.beginPath(); S.ctx.moveTo(0, S.h);
    for (let x = 0; x <= S.w; x += 3) S.ctx.lineTo(x, S.h * top + Math.sin(x * f - S.t * v) * 6);
    S.ctx.lineTo(S.w, S.h); S.ctx.fill();
  });
});

/* 04 */ add('Two sources', 'Interference between two wave sources', 'auto', none, (S) => {
  wipe(S);
  const a = [S.w * 0.35 + Math.sin(S.t * 0.5) * 12, S.h / 2]; const b = [S.w * 0.65 - Math.sin(S.t * 0.5) * 12, S.h / 2];
  for (let y = 0; y < S.h; y += 4) for (let x = 0; x < S.w; x += 4) {
    const v = Math.sin(Math.hypot(x - a[0], y - a[1]) * 0.45 - S.t * 4) + Math.sin(Math.hypot(x - b[0], y - b[1]) * 0.45 - S.t * 4);
    const l = (v + 2) / 4; S.ctx.fillStyle = `hsl(205,80%,${8 + l * 62}%)`; S.ctx.fillRect(x, y, 3.4, 3.4);
  }
});

/* 05 */ add('Pointer ripples', 'Rings spreading from the pointer', 'hover', () => ({ r: [], n: 0 }), (S, dt) => {
  wipe(S, 0.3);
  const o = at(S, 1.1);
  S.st.n -= dt; if (S.st.n <= 0) { S.st.r.push({ x: o.x, y: o.y, r: 0, a: 1 }); S.st.n = 0.3; }
  S.st.r.forEach((q) => { q.r += 40 * dt; q.a -= dt * 0.7; if (q.a <= 0) q.dead = true; S.ctx.strokeStyle = `rgba(110,200,255,${q.a})`; S.ctx.lineWidth = 1; S.ctx.beginPath(); S.ctx.arc(q.x, q.y, q.r, 0, TAU); S.ctx.stroke(); });
  prune(S.st.r);
});

/* 06 */ const NW = 44; const NH = 26;
add('Water surface', 'A water surface; click to drop a stone', 'click', () => ({ h: new Float32Array(NW * NH), v: new Float32Array(NW * NH), n: 0 }), (S, dt) => {
  const { h, v } = S.st;
  const drop = (x, y, a = 3) => { const cx = Math.floor((x / S.w) * NW); const cy = Math.floor((y / S.h) * NH); for (let j = -1; j <= 1; j += 1) for (let i = -1; i <= 1; i += 1) { const X = cx + i; const Y = cy + j; if (X > 0 && X < NW - 1 && Y > 0 && Y < NH - 1) h[Y * NW + X] += a; } };
  S.st.n -= dt; if (S.st.n <= 0) { drop(rnd(10, S.w - 10), rnd(10, S.h - 10)); S.st.n = 1.6; }
  S.poke.splice(0).forEach((p) => drop(p.x, p.y, 5));
  for (let y = 1; y < NH - 1; y += 1) for (let x = 1; x < NW - 1; x += 1) { const i = y * NW + x; v[i] += ((h[i - 1] + h[i + 1] + h[i - NW] + h[i + NW]) / 4 - h[i]) * 0.9; v[i] *= 0.985; }
  for (let i = 0; i < h.length; i += 1) h[i] += v[i];
  wipe(S);
  const cw = S.w / NW; const ch = S.h / NH;
  for (let y = 0; y < NH; y += 1) for (let x = 0; x < NW; x += 1) { const z = h[y * NW + x]; S.ctx.fillStyle = `hsl(${205 + z * 6},75%,${Math.max(6, Math.min(80, 22 + z * 14))}%)`; S.ctx.fillRect(x * cw, y * ch, cw + 0.5, ch + 0.5); }
});

/* 07 */ add('Standing wave', 'A string vibrating in a standing wave', 'auto', none, (S) => {
  wipe(S);
  const A = Math.cos(S.t * 4);
  [1, 0.5, 0.25].forEach((k, i) => plot(S, (x) => mid(S) + Math.sin((x / S.w) * Math.PI * 3) * S.h * 0.3 * A * (i ? 1 : 1) * (i === 0 ? 1 : 0), `rgba(110,231,183,${k})`, i ? 1 : 1.8));
  plot(S, (x) => mid(S) - Math.sin((x / S.w) * Math.PI * 3) * S.h * 0.3 * A, 'rgba(110,231,183,0.3)', 1);
  for (let k = 0; k <= 3; k += 1) dot(S.ctx, (k / 3) * S.w, mid(S), 2.4, RED);
});

/* 08 */ add('Beat pattern', 'Two close notes making a slow beat', 'auto', none, (S) => {
  wipe(S);
  const f = (x) => (Math.sin(x * 0.4 - S.t * 6) + Math.sin(x * 0.44 - S.t * 6.6)) / 2;
  plot(S, (x) => mid(S) - f(x) * S.h * 0.38, GREEN, 1.3, 1);
  plot(S, (x) => mid(S) - Math.cos(x * 0.02 - S.t * 0.3) * S.h * 0.38, 'rgba(255,107,107,0.6)', 1);
  plot(S, (x) => mid(S) + Math.cos(x * 0.02 - S.t * 0.3) * S.h * 0.38, 'rgba(255,107,107,0.6)', 1);
});

/* 09 */ add('Phase shift', 'Two waves; the pointer shifts the phase of one', 'hover', none, (S) => {
  wipe(S);
  const ph = px(S) * TAU;
  plot(S, (x) => mid(S) + Math.sin(x * 0.08 - S.t * 2) * 16, BLUE, 1.2);
  plot(S, (x) => mid(S) + Math.sin(x * 0.08 - S.t * 2 + ph) * 16, RED, 1.2);
  plot(S, (x) => mid(S) + (Math.sin(x * 0.08 - S.t * 2) + Math.sin(x * 0.08 - S.t * 2 + ph)) * 8, 'rgba(255,255,255,0.8)', 1.6);
});

/* 10 */ add('Amplitude', 'A wave whose height follows the pointer', 'hover', none, (S) => { wipe(S); const a = (1 - py(S)) * S.h * 0.45; plot(S, (x) => mid(S) + Math.sin(x * 0.09 - S.t * 3) * a, GREEN, 1.6); line(S.ctx, 0, mid(S) - a, S.w, mid(S) - a, 'rgba(255,255,255,0.15)'); line(S.ctx, 0, mid(S) + a, S.w, mid(S) + a, 'rgba(255,255,255,0.15)'); });

/* 11 */ add('Frequency', 'A wave whose pitch follows the pointer', 'hover', none, (S) => { wipe(S); const f = 0.03 + px(S) * 0.25; plot(S, (x) => mid(S) + Math.sin(x * f - S.t * 3) * S.h * 0.28, BLUE, 1.6); });

/* 12 */ add('Harmonic sum', 'A square wave built from more and more sine waves', 'hover', none, (S) => {
  wipe(S);
  const n = 1 + Math.round(px(S) * 8);
  line(S.ctx, 0, mid(S) - S.h * 0.3, S.w, mid(S) - S.h * 0.3, 'rgba(255,255,255,0.1)'); line(S.ctx, 0, mid(S) + S.h * 0.3, S.w, mid(S) + S.h * 0.3, 'rgba(255,255,255,0.1)');
  plot(S, (x) => { let s = 0; for (let k = 1; k <= n * 2; k += 2) s += Math.sin(k * (x * 0.06 - S.t * 1.5)) / k; return mid(S) - s * S.h * 0.38; }, GREEN, 1.6, 1);
  S.ctx.fillStyle = 'rgba(255,255,255,0.5)'; S.ctx.font = '8px monospace'; S.ctx.fillText(`${n} terms`, 6, 12);
});

/* 13 */ add('Sawtooth build', 'A sawtooth growing from sine waves', 'auto', none, (S) => {
  wipe(S);
  const n = 1 + Math.floor((S.t * 1.2) % 10);
  plot(S, (x) => { let s = 0; for (let k = 1; k <= n; k += 1) s += (k % 2 ? 1 : -1) * Math.sin(k * (x * 0.05 - S.t)) / k; return mid(S) - s * S.h * 0.28; }, '#ffd43b', 1.6, 1);
});

/* 14 */ add('Value noise', 'A noise line scrolling past', 'auto', none, (S) => { wipe(S); plot(S, (x) => S.h * 0.2 + vnoise(x * 0.05 + S.t * 1.5) * S.h * 0.6, '#c084fc', 1.6, 1); plot(S, (x) => S.h * 0.2 + vnoise(x * 0.12 + S.t * 2.5 + 40) * S.h * 0.6, 'rgba(192,132,252,0.35)', 1, 1); });

/* 15 */ add('Noise ridges', 'Layers of mountains scrolling at different speeds', 'auto', none, (S) => {
  wipe(S);
  [[0.35, 0.03, 4, 0.32], [0.5, 0.05, 8, 0.5], [0.66, 0.08, 14, 0.75]].forEach(([base, f, v, a]) => {
    S.ctx.fillStyle = `rgba(${40 + a * 60},${50 + a * 70},${90 + a * 100},1)`; S.ctx.beginPath(); S.ctx.moveTo(0, S.h);
    for (let x = 0; x <= S.w; x += 3) S.ctx.lineTo(x, S.h * base + vnoise(x * f + S.t * v * 0.1) * 20);
    S.ctx.lineTo(S.w, S.h); S.ctx.fill();
  });
});

/* 16 */ add('Noise cloud', 'A drifting cloud of two-dimensional noise', 'auto', none, (S) => {
  for (let y = 0; y < S.h; y += 4) for (let x = 0; x < S.w; x += 4) { const v = vnoise(x * 0.04 + S.t * 0.8, y * 0.05 + S.t * 0.3); S.ctx.fillStyle = `hsl(260,60%,${6 + v * v * 62}%)`; S.ctx.fillRect(x, y, 4, 4); }
});

/* 17 */ add('Static', 'Television static', 'auto', none, (S) => { for (let y = 0; y < S.h; y += 3) for (let x = 0; x < S.w; x += 3) { const v = Math.floor(Math.random() * 130); S.ctx.fillStyle = `rgb(${v},${v},${v})`; S.ctx.fillRect(x, y, 3, 3); } });

/* 18 */ add('Sea horizon', 'A sun on the horizon glittering on moving water', 'auto', none, (S) => {
  const g = S.ctx.createLinearGradient(0, 0, 0, S.h * 0.5); g.addColorStop(0, '#1a0f3a'); g.addColorStop(1, '#ff7b54');
  S.ctx.fillStyle = g; S.ctx.fillRect(0, 0, S.w, S.h * 0.5);
  S.ctx.fillStyle = '#ffd9a0'; S.ctx.beginPath(); S.ctx.arc(S.w / 2, S.h * 0.5, 16, Math.PI, 0); S.ctx.fill();
  S.ctx.fillStyle = '#0d1a33'; S.ctx.fillRect(0, S.h * 0.5, S.w, S.h * 0.5);
  for (let r = 0; r < 14; r += 1) { const y = S.h * 0.5 + 3 + r * 3.2 + r * r * 0.12; const w = 6 + r * 4 + Math.sin(S.t * 3 + r) * 4; S.ctx.fillStyle = `rgba(255,190,120,${0.7 - r * 0.04})`; S.ctx.fillRect(S.w / 2 - w / 2 + Math.sin(S.t * 2 + r * 1.7) * 3, y, w, 1.2); }
});

/* 19 */ add('Ripple bars', 'Bars whose heights follow a travelling wave', 'auto', none, (S) => { wipe(S); const n = 24; for (let i = 0; i < n; i += 1) { const h = (0.15 + Math.abs(Math.sin(i * 0.35 - S.t * 3)) * 0.8) * S.h * 0.8; S.ctx.fillStyle = `hsl(${180 + i * 6},80%,60%)`; S.ctx.fillRect(4 + i * ((S.w - 8) / n), (S.h - h) / 2, 3.4, h); } });

/* 20 */ add('Dot swell', 'A grid of dots lifted by a travelling wave', 'auto', none, (S) => { wipe(S); for (let j = 0; j < 8; j += 1) for (let i = 0; i < 18; i += 1) { const x = 10 + i * 9.4; const y = 14 + j * 11 + Math.sin(i * 0.5 - S.t * 3 + j * 0.3) * 4; dot(S.ctx, x, y, 1.4 + Math.sin(i * 0.5 - S.t * 3 + j * 0.3) * 0.6, '#fff'); } });

/* 21 */ add('Dot ripple', 'Dots that swell in rings from the centre', 'auto', none, (S) => { wipe(S); for (let j = 0; j < 12; j += 1) for (let i = 0; i < 22; i += 1) { const x = 8 + i * 7.6; const y = 8 + j * 8; const r = Math.hypot(x - S.w / 2, y - S.h / 2); dot(S.ctx, x, y, 0.4 + Math.max(0, Math.sin(r * 0.18 - S.t * 3)) * 2.4, `hsl(${200 + r},80%,65%)`); } });

/* 22 */ add('Moire lines', 'Two sets of lines turning against each other', 'auto', none, (S) => {
  wipe(S);
  const set = (rot) => { S.ctx.save(); S.ctx.translate(S.w / 2, S.h / 2); S.ctx.rotate(rot); S.ctx.strokeStyle = 'rgba(255,255,255,0.8)'; S.ctx.lineWidth = 0.8; S.ctx.beginPath(); for (let x = -120; x <= 120; x += 6) { S.ctx.moveTo(x, -80); S.ctx.lineTo(x, 80); } S.ctx.stroke(); S.ctx.restore(); };
  set(0); set(Math.sin(S.t * 0.4) * 0.12);
});

/* 23 */ add('Spiral wave', 'A spiral wave turning', 'auto', none, (S) => { for (let y = 0; y < S.h; y += 4) for (let x = 0; x < S.w; x += 4) { const dx = x - S.w / 2; const dy = y - S.h / 2; const v = Math.sin(Math.atan2(dy, dx) * 2 + Math.hypot(dx, dy) * 0.18 - S.t * 3); S.ctx.fillStyle = `hsl(330,80%,${6 + (v + 1) * 30}%)`; S.ctx.fillRect(x, y, 4, 4); } });

/* 24 */ add('Ring pulse', 'Rings expanding from the centre', 'auto', none, (S) => { wipe(S); for (let k = 0; k < 5; k += 1) { const p = ((S.t * 0.5 + k / 5) % 1); S.ctx.strokeStyle = `rgba(255,107,107,${1 - p})`; S.ctx.lineWidth = 1.4; S.ctx.beginPath(); S.ctx.ellipse(S.w / 2, S.h / 2, p * S.w * 0.5, p * S.h * 0.5, 0, 0, TAU); S.ctx.stroke(); } dot(S.ctx, S.w / 2, S.h / 2, 2.4, '#fff'); });

/* 25-26 doppler and mach share an engine */
const moving = (speed) => (S, dt) => {
  wipe(S, 0.5);
  const st = S.st; st.x += speed * dt; if (st.x > S.w + 10) { st.x = -10; st.e = []; }
  st.n -= dt; if (st.n <= 0) { st.e.push({ x: st.x, t: S.t }); st.n = 0.28; }
  st.e.forEach((q) => { const r = (S.t - q.t) * 42; S.ctx.strokeStyle = 'rgba(110,200,255,0.55)'; S.ctx.lineWidth = 0.9; S.ctx.beginPath(); S.ctx.arc(q.x, S.h / 2, r, 0, TAU); S.ctx.stroke(); });
  if (speed > 42) { const a = Math.asin(42 / speed); line(S.ctx, st.x, S.h / 2, st.x - 80 * Math.cos(a), S.h / 2 - 80 * Math.sin(a), 'rgba(255,255,255,0.8)', 1.2); line(S.ctx, st.x, S.h / 2, st.x - 80 * Math.cos(a), S.h / 2 + 80 * Math.sin(a), 'rgba(255,255,255,0.8)', 1.2); }
  dot(S.ctx, st.x, S.h / 2, 3, RED);
};
add('Doppler rings', 'A moving source bunching up its waves ahead', 'auto', () => ({ x: 20, e: [], n: 0 }), moving(18));
add('Mach cone', 'A source outrunning its own waves', 'auto', () => ({ x: 20, e: [], n: 0 }), moving(80));

/* 27 */ add('Quake trace', 'A seismograph pen tracing tremors on moving paper', 'auto', () => ({ y: [], q: 0 }), (S, dt) => {
  wipe(S);
  for (let x = 0; x < S.w; x += 12) line(S.ctx, x - ((S.t * 30) % 12), 0, x - ((S.t * 30) % 12), S.h, 'rgba(255,255,255,0.07)');
  S.st.q = Math.max(0, S.st.q - dt * 1.4); if (Math.random() < 0.012) S.st.q = rnd(0.6, 1);
  S.st.y.push(mid(S) + (Math.random() - 0.5) * (3 + S.st.q * 34)); if (S.st.y.length > S.w / 2) S.st.y.shift();
  S.ctx.strokeStyle = '#6ee7b7'; S.ctx.lineWidth = 1; S.ctx.beginPath(); S.st.y.forEach((y, i) => { const x = S.w - (S.st.y.length - i) * 2; if (i) S.ctx.lineTo(x, y); else S.ctx.moveTo(x, y); }); S.ctx.stroke();
  dot(S.ctx, S.w - 2, S.st.y.at(-1), 2, RED);
});

/* 28 */ add('Tide chart', 'A tide curve with a marker riding it', 'auto', none, (S) => {
  wipe(S);
  const f = (x) => S.h * 0.5 - (Math.sin(x * 0.045) + 0.4 * Math.sin(x * 0.11 + 1)) * S.h * 0.22;
  S.ctx.fillStyle = 'rgba(96,165,250,0.18)'; S.ctx.beginPath(); S.ctx.moveTo(0, S.h); for (let x = 0; x <= S.w; x += 2) S.ctx.lineTo(x, f(x)); S.ctx.lineTo(S.w, S.h); S.ctx.fill();
  plot(S, f, BLUE, 1.6);
  const mx = ((S.t * 14) % S.w); line(S.ctx, mx, 0, mx, S.h, 'rgba(255,255,255,0.2)'); dot(S.ctx, mx, f(mx), 3, '#fff');
});

/* 29 */ add('Rope wave', 'A rope the pointer shakes at one end', 'hover', () => ({ y: new Float32Array(60), v: new Float32Array(60) }), (S) => {
  const { y, v } = S.st; const n = y.length;
  y[0] = (py(S) - 0.5) * S.h * 0.8;
  for (let i = 1; i < n - 1; i += 1) v[i] += ((y[i - 1] + y[i + 1]) / 2 - y[i]) * 0.5;
  for (let i = 1; i < n - 1; i += 1) { v[i] *= 0.985; y[i] += v[i]; }
  wipe(S);
  S.ctx.strokeStyle = '#ffd43b'; S.ctx.lineWidth = 2; S.ctx.beginPath(); for (let i = 0; i < n; i += 1) { const x = (i / (n - 1)) * S.w; if (i) S.ctx.lineTo(x, mid(S) + y[i]); else S.ctx.moveTo(x, mid(S) + y[i]); } S.ctx.stroke();
  dot(S.ctx, 0, mid(S) + y[0], 3, RED);
});

/* 30 */ add('Pendulum wave', 'A row of pendulums drifting in and out of step', 'auto', none, (S) => {
  wipe(S, 0.25);
  for (let i = 0; i < 14; i += 1) { const x = S.w / 2 + Math.sin(S.t * (1.2 + i * 0.07)) * (S.w * 0.42); dot(S.ctx, x, 10 + i * 6.2, 2.2, `hsl(${i * 24},80%,65%)`); }
});

/* 31 */ add('Wave packet', 'A packet of waves under a bell-shaped envelope', 'auto', none, (S) => {
  wipe(S);
  const cx = ((S.t * 24) % (S.w * 1.6)) - S.w * 0.3;
  const env = (x) => Math.exp(-(((x - cx) / 22) ** 2));
  plot(S, (x) => mid(S) - env(x) * S.h * 0.42, 'rgba(255,255,255,0.2)', 1);
  plot(S, (x) => mid(S) + Math.cos((x - cx) * 0.5 + S.t * 8) * env(x) * S.h * 0.38, GREEN, 1.6, 1);
});

/* 32 */ const CHL = [[2, 3], [3, 4], [1, 4], [4, 5], [3, 5]];
add('Chladni plate', 'Sand settling on the still lines of a vibrating plate; click for another tone', 'click', (S) => ({ m: 0, p: Array.from({ length: 260 }, () => ({ x: Math.random(), y: Math.random() })), w: S.w }), (S) => {
  wipe(S);
  S.poke.splice(0).forEach(() => { S.st.m = (S.st.m + 1) % CHL.length; });
  const [n, m] = CHL[S.st.m];
  S.st.p.forEach((p) => {
    const f = Math.abs(Math.cos(n * Math.PI * p.x) * Math.cos(m * Math.PI * p.y) - Math.cos(m * Math.PI * p.x) * Math.cos(n * Math.PI * p.y));
    const s = f * 0.05;
    p.x = Math.min(1, Math.max(0, p.x + (Math.random() - 0.5) * s)); p.y = Math.min(1, Math.max(0, p.y + (Math.random() - 0.5) * s));
    dot(S.ctx, p.x * S.w, p.y * S.h, 0.9, '#f4e2a8');
  });
});

/* 33 */ add('Cymatics', 'A circular standing wave drawn in dots', 'auto', none, (S) => { wipe(S); for (let y = 2; y < S.h; y += 5) for (let x = 2; x < S.w; x += 5) { const r = Math.hypot(x - S.w / 2, (y - S.h / 2) * 1.5); const v = Math.cos(r * 0.28) * Math.cos(S.t * 3); dot(S.ctx, x, y, 0.5 + Math.abs(v) * 1.7, v > 0 ? '#60a5fa' : '#ff6b6b'); } });

/* 34 */ add('Frequency dial', 'A tuning dial; the pointer picks the frequency', 'hover', none, (S) => {
  wipe(S);
  const f = px(S);
  plot(S, (x) => S.h * 0.38 + Math.sin(x * (0.05 + f * 0.4) - S.t * 4) * 12, GREEN, 1.4);
  for (let i = 0; i <= 20; i += 1) line(S.ctx, 8 + (i / 20) * (S.w - 16), S.h - 18, 8 + (i / 20) * (S.w - 16), S.h - (i % 5 ? 13 : 9), 'rgba(255,255,255,0.4)');
  line(S.ctx, 8 + f * (S.w - 16), S.h - 24, 8 + f * (S.w - 16), S.h - 4, '#ff5a5a', 1.6);
});

/* 35 */ add('Chirp', 'A tone rising in pitch along its length', 'auto', none, (S) => { wipe(S); plot(S, (x) => mid(S) + Math.sin((x * x) * 0.0012 - S.t * 5) * S.h * 0.3, '#ffd43b', 1.4, 1); });

/* 36 */ add('Damped spring', 'A spring-mass oscillation dying away; click to flick it', 'click', () => ({ t0: 0 }), (S) => {
  wipe(S);
  S.poke.splice(0).forEach(() => { S.st.t0 = S.t; });
  const k = S.t - S.st.t0;
  const f = (x) => mid(S) + Math.exp(-(x / S.w) * 3.4) * Math.cos(x * 0.14) * S.h * 0.38;
  plot(S, f, 'rgba(255,255,255,0.18)', 1);
  const kx = ((k * 30) % S.w);
  plot(S, (x) => (x < kx ? f(x) : NaN), '#60a5fa', 1.6);
  dot(S.ctx, kx, f(kx), 3, '#fff');
});

/* 37 */ add('Mesh surface', 'A wireframe surface rolling in perspective', 'auto', none, (S) => {
  wipe(S);
  for (let r = 0; r < 12; r += 1) {
    const z = r / 11; S.ctx.strokeStyle = `rgba(110,200,255,${0.25 + z * 0.65})`; S.ctx.lineWidth = 0.8; S.ctx.beginPath();
    for (let i = 0; i <= 24; i += 1) { const x = S.w / 2 + (i - 12) * (2.6 + z * 4.6); const y = S.h * 0.3 + z * S.h * 0.62 - Math.sin(i * 0.5 + r * 0.45 - S.t * 2) * (2 + z * 7); if (i) S.ctx.lineTo(x, y); else S.ctx.moveTo(x, y); }
    S.ctx.stroke();
  }
});

/* 38 */ add('Contour bands', 'Banded contours of a moving noise field', 'auto', none, (S) => { for (let y = 0; y < S.h; y += 4) for (let x = 0; x < S.w; x += 4) { const v = Math.floor(vnoise(x * 0.035 + S.t * 0.3, y * 0.045 - S.t * 0.2) * 7); S.ctx.fillStyle = `hsl(${170 + v * 22},60%,${12 + v * 8}%)`; S.ctx.fillRect(x, y, 4, 4); } });

/* 39 */ add('Boat wake', 'A boat leaving a V-shaped wake', 'auto', none, (S) => {
  wipe(S);
  const bx = (S.t * 26) % (S.w + 60) - 20; const by = S.h * 0.5;
  for (let k = 1; k <= 6; k += 1) { const d = k * 11; [-1, 1].forEach((s) => line(S.ctx, bx - d * 1.6, by + s * d * 0.8, bx - d * 1.6 - 14, by + s * d * 0.8 + s * 3 + Math.sin(S.t * 3 + k) * 1.5, `rgba(180,220,255,${0.7 - k * 0.1})`, 1)); }
  S.ctx.fillStyle = '#fff'; S.ctx.beginPath(); S.ctx.moveTo(bx + 8, by); S.ctx.lineTo(bx - 6, by - 4); S.ctx.lineTo(bx - 6, by + 4); S.ctx.fill();
});

/* 40 */ add('Pressure wave', 'Particles bunching and thinning as a sound wave passes', 'auto', none, (S) => {
  wipe(S);
  for (let r = 0; r < 5; r += 1) for (let i = 0; i < 48; i += 1) { const x0 = 4 + i * ((S.w - 8) / 47); const x = x0 + Math.sin(x0 * 0.1 - S.t * 4) * 4; dot(S.ctx, x, 14 + r * 17, 1.5, `rgba(255,255,255,${0.5 + Math.sin(x0 * 0.1 - S.t * 4 + 1.57) * 0.35})`); }
});

/* 41 */ add('Slit tank', 'A wave front passing two slits; click to move the slits', 'click', () => ({ gap: 0 }), (S) => {
  wipe(S, 0.5);
  S.poke.splice(0).forEach(() => { S.st.gap = 1 - S.st.gap; });
  const bx = S.w * 0.36; const g = S.st.gap ? 0.3 : 0.16;
  for (let k = 0; k < 4; k += 1) { const x = ((S.t * 30 + k * 18) % 72) * (bx / 72); line(S.ctx, x, 0, x, S.h, 'rgba(110,200,255,0.45)', 1); }
  S.ctx.fillStyle = '#3a3b42'; [[0, S.h * (0.5 - g) - 3], [S.h * (0.5 - g) + 3, S.h * (0.5 + g) - 3], [S.h * (0.5 + g) + 3, S.h]].forEach(([a, b]) => S.ctx.fillRect(bx - 2, a, 4, b - a));
  [S.h * (0.5 - g), S.h * (0.5 + g)].forEach((y) => { for (let k = 0; k < 6; k += 1) { const r = ((S.t * 30 + k * 12) % 72) * 0.9; S.ctx.strokeStyle = `rgba(110,200,255,${0.5 - r / 140})`; S.ctx.lineWidth = 0.9; S.ctx.beginPath(); S.ctx.arc(bx, y, r, -Math.PI / 2, Math.PI / 2); S.ctx.stroke(); } });
});

/* 42 */ add('Phasor trace', 'A turning arrow drawing a sine wave', 'auto', () => ({ y: [] }), (S, dt) => {
  wipe(S);
  const cx = 30; const R = 22; const a = S.t * 2.4;
  const px0 = cx + Math.cos(a) * R; const py0 = mid(S) - Math.sin(a) * R;
  S.ctx.strokeStyle = 'rgba(255,255,255,0.25)'; S.ctx.lineWidth = 1; S.ctx.beginPath(); S.ctx.arc(cx, mid(S), R, 0, TAU); S.ctx.stroke();
  line(S.ctx, cx, mid(S), px0, py0, '#fff', 1.4); dot(S.ctx, px0, py0, 2.6, RED);
  S.st.y.unshift(py0); if (S.st.y.length > S.w - 60) S.st.y.pop();
  line(S.ctx, px0, py0, 60, py0, 'rgba(255,107,107,0.4)', 0.8);
  S.ctx.strokeStyle = RED; S.ctx.lineWidth = 1.4; S.ctx.beginPath(); S.st.y.forEach((y, i) => { if (i) S.ctx.lineTo(60 + i * (dt ? 1 : 1), y); else S.ctx.moveTo(60, y); }); S.ctx.stroke();
});

export default {
  Visual,
  items: SIMS.map(([name, label, mode, setup, tick]) => [name, function Wave() { return <Sim label={label} mode={mode} setup={setup} tick={tick} />; }, mode]),
};
