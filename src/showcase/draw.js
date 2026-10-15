/* Small canvas drawing helpers shared by the particle and wave pages. */
export const TAU = Math.PI * 2;
export const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const wipe = (S, a = 1) => { S.ctx.globalCompositeOperation = 'source-over'; S.ctx.fillStyle = `rgba(7,8,10,${a})`; S.ctx.fillRect(0, 0, S.w, S.h); };
export const dot = (ctx, x, y, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
export const soft = (ctx, x, y, r, h, s, l, a) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `hsla(${h},${s}%,${l}%,${a})`);
  g.addColorStop(1, `hsla(${h},${s}%,${l}%,0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
};
export const line = (ctx, x1, y1, x2, y2, col, w = 1) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
/* where the pointer is, or a slow wander when nobody is pointing */
export const at = (S, k = 1) => (S.in.has ? S.in : { x: S.w / 2 + Math.sin(S.t * 0.9 * k) * S.w * 0.3, y: S.h / 2 + Math.sin(S.t * 1.3 * k + 1) * S.h * 0.25 });
export const prune = (a) => { for (let i = a.length - 1; i >= 0; i -= 1) if (a[i].dead) a.splice(i, 1); };

/* a polyline of y = f(x) across the canvas */
export const plot = (S, f, col = '#6ee7b7', w = 1.4, step = 2) => {
  const { ctx } = S;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let x = 0; x <= S.w + step; x += step) { const y = f(x); if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
  ctx.stroke();
};

/* smooth value noise in one or two dimensions, 0 to 1 */
const hash = (x, y) => { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
const ease = (t) => t * t * (3 - 2 * t);
export const vnoise = (x, y = 0) => {
  const xi = Math.floor(x); const yi = Math.floor(y); const xf = ease(x - xi); const yf = ease(y - yi);
  const a = hash(xi, yi); const b = hash(xi + 1, yi); const c = hash(xi, yi + 1); const d = hash(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
};
