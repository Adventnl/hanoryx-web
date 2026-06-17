import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, clamp } from '../../easing';

/* PERMISSION ORBIT — role/permission nodes orbit a central lock core on three
   concentric rings, each rotating at its own rate; a thin radial connector to a
   node blinks red as the node sweeps past the vertical "grant" axis. */
registerScene('permission-orbit', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let cx = W / 2, cy = H / 2;
  let R = 1;
  const rings = [];

  const build = (w, h, q = quality) => {
    W = w; H = h;
    cx = W / 2; cy = H / 2;
    R = Math.min(W, H);
    const scale = q === 'low' || q === 'static' ? 0.55 : q === 'medium' ? 0.8 : 1;
    rings.length = 0;
    const specs = [
      { rad: 0.16, spd: 0.42, n: Math.max(3, Math.round(5 * scale * density)), dir: 1, seed: 11 },
      { rad: 0.27, spd: -0.26, n: Math.max(4, Math.round(8 * scale * density)), dir: -1, seed: 47 },
      { rad: 0.38, spd: 0.17, n: Math.max(5, Math.round(11 * scale * density)), dir: 1, seed: 83 },
    ];
    for (const s of specs) rings.push(s);
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const px = cx + (p.active ? p.nx * 18 : 0);
      const py = cy + (p.active ? p.ny * 18 : 0);

      // faint orbit guide rings
      ctx.lineWidth = 1;
      for (const ring of rings) {
        ctx.strokeStyle = white(0.05);
        ctx.beginPath();
        ctx.arc(px, py, R * ring.rad, 0, TAU);
        ctx.stroke();
      }

      // alignment axis (vertical "grant" line) — faint, the trigger zone
      ctx.strokeStyle = white(0.04);
      ctx.beginPath();
      ctx.moveTo(px, py - R * 0.46);
      ctx.lineTo(px, py - R * 0.04);
      ctx.stroke();

      // orbiting permission nodes
      for (let ri = 0; ri < rings.length; ri += 1) {
        const ring = rings[ri];
        const rr = R * ring.rad;
        for (let i = 0; i < ring.n; i += 1) {
          const base = (i / ring.n) * TAU + hash(ring.seed + i) * 0.4;
          const ang = base + t * ring.spd;
          const nx = px + Math.cos(ang) * rr;
          const ny = py + Math.sin(ang) * rr;

          // alignment: 0 at top (-PI/2), 1 when far — measure angular distance to grant axis
          let d = Math.abs(((ang + Math.PI / 2) % TAU + TAU) % TAU);
          if (d > Math.PI) d = TAU - d;
          const align = clamp(1 - d / 0.22, 0, 1);

          // radial connector — white baseline, blinks red on alignment
          if (align > 0.001) {
            ctx.strokeStyle = A(0.1 + align * 0.55);
            ctx.lineWidth = 1 + align;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(nx, ny);
            ctx.stroke();
            ctx.lineWidth = 1;
          } else {
            ctx.strokeStyle = white(0.045);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(nx, ny);
            ctx.stroke();
          }

          // node mark — small square (permission token)
          const s = 2.4 + ri * 0.4;
          const glow = align > 0.3;
          ctx.fillStyle = glow ? A(0.85) : white(0.55);
          ctx.fillRect(nx - s, ny - s, s * 2, s * 2);
          if (glow) {
            ctx.strokeStyle = A(0.3 * align);
            ctx.strokeRect(nx - s * 2, ny - s * 2, s * 4, s * 4);
          }
        }
      }

      // central lock core — concentric ticks + breathing body
      const breathe = 0.5 + 0.5 * Math.sin(t * 1.3);
      ctx.strokeStyle = white(0.18);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(px, py, 9 + breathe * 2, 0, TAU);
      ctx.stroke();
      // lock shackle hint (arc)
      ctx.strokeStyle = white(0.22);
      ctx.beginPath();
      ctx.arc(px, py - 3, 5, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
      // core dot
      ctx.fillStyle = A(0.75 + breathe * 0.2);
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
