import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash, hash2 } from '../primitives';
import { TAU, clamp } from '../../easing';

/* LIQUID GLASS OPERATIONAL — large rounded translucent glass capsules drifting
   and overlapping, with soft white rim highlights, a faint inner sheen and thin
   refraction lines bending through each body. Calm, premium, operational. */
registerScene('liquid-glass-operational', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let capsules = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = q === 'low' || q === 'static' ? 0.55 : q === 'medium' ? 0.8 : 1;
    const count = clamp(Math.round(6 * scale * density), 3, 9);
    const minDim = Math.min(W, H);
    capsules = [];
    for (let i = 0; i < count; i += 1) {
      const r = hash(i * 1.7 + 1);
      const r2 = hash(i * 2.3 + 2);
      const r3 = hash(i * 3.9 + 3);
      capsules.push({
        // base position as a fraction of the canvas (drift added per frame)
        bx: 0.12 + r * 0.76,
        by: 0.14 + r2 * 0.72,
        // capsule body size — large, premium
        len: minDim * (0.22 + r3 * 0.26),
        thick: minDim * (0.1 + r * 0.12),
        // independent drift clocks + amplitudes
        sx: hash2(i, 7) * 0.5 + 0.18,
        sy: hash2(i, 13) * 0.5 + 0.18,
        ax: minDim * (0.03 + r2 * 0.05),
        ay: minDim * (0.03 + r3 * 0.05),
        phx: r * TAU,
        phy: r2 * TAU,
        rot: (r3 - 0.5) * 0.5,
        hot: hash(i * 5.1 + 4) > 0.7,
      });
    }
  };
  build(width, height);

  // capsule (stadium) path centred at (cx,cy), oriented by rot
  const capsulePath = (cx, cy, len, thick, rot) => {
    const r = thick * 0.5;
    const half = Math.max(len * 0.5 - r, 1);
    const ca = Math.cos(rot);
    const sa = Math.sin(rot);
    const ax = cx - half * ca;
    const ay = cy - half * sa;
    const bx = cx + half * ca;
    const by = cy + half * sa;
    // perpendicular for the two flat sides
    const px = -sa * r;
    const py = ca * r;
    ctx.beginPath();
    ctx.moveTo(ax + px, ay + py);
    ctx.lineTo(bx + px, by + py);
    ctx.arc(bx, by, r, Math.atan2(py, px), Math.atan2(-py, -px), false);
    ctx.lineTo(ax - px, ay - py);
    ctx.arc(ax, ay, r, Math.atan2(-py, -px), Math.atan2(py, px), false);
    ctx.closePath();
    return { ax, ay, bx, by, r, px, py };
  };

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const ox = p.active ? p.nx * 14 : 0;
      const oy = p.active ? p.ny * 14 : 0;

      ctx.lineJoin = 'round';

      for (let i = 0; i < capsules.length; i += 1) {
        const c = capsules[i];
        const cx = c.bx * W + Math.sin(t * c.sx + c.phx) * c.ax + ox;
        const cy = c.by * H + Math.cos(t * c.sy + c.phy) * c.ay + oy;
        const rot = c.rot + Math.sin(t * 0.12 + c.phx) * 0.15;
        const breathe = 1 + Math.sin(t * 0.3 + c.phy) * 0.035;
        const len = c.len * breathe;
        const thick = c.thick * breathe;

        const g = capsulePath(cx, cy, len, thick, rot);

        // 1. translucent glass body fill — very faint, builds where capsules overlap
        ctx.fillStyle = white(0.028);
        ctx.fill();

        // 2. soft outer rim outline
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = white(0.16);
        ctx.stroke();

        // 3. bright top-edge highlight: a clipped lighter arc giving the "glass lip"
        ctx.save();
        ctx.clip();
        // inner sheen — a brighter capsule echo offset toward the light (top-left)
        const inset = thick * 0.22;
        capsulePath(
          cx - thick * 0.12,
          cy - thick * 0.12,
          Math.max(len - inset, 2),
          Math.max(thick - inset, 2),
          rot,
        );
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = white(0.12);
        ctx.stroke();

        // 4. faint refraction lines bending across the body
        const refr = 3;
        const ca = Math.cos(rot);
        const sa = Math.sin(rot);
        for (let k = 0; k < refr; k += 1) {
          const f = (k + 1) / (refr + 1);
          const span = (f - 0.5) * thick;
          const offx = -sa * span;
          const offy = ca * span;
          const bend = Math.sin(t * 0.6 + k * 1.3 + c.phx) * thick * 0.14;
          const bx = -sa * bend;
          const by = ca * bend;
          ctx.beginPath();
          ctx.moveTo(g.ax + offx - ca * thick, g.ay + offy - sa * thick);
          ctx.quadraticCurveTo(
            cx + offx + bx,
            cy + offy + by,
            g.bx + offx + ca * thick,
            g.by + offy + sa * thick,
          );
          ctx.lineWidth = 1;
          ctx.strokeStyle = white(0.05);
          ctx.stroke();
        }
        ctx.restore();

        // 5. specular glint dot near the lip + sparse accent core
        const glintR = thick * 0.4;
        const gx = cx - ca * (len * 0.5 - glintR) - sa * (thick * 0.18);
        const gy = cy - sa * (len * 0.5 - glintR) + ca * (thick * 0.18);
        ctx.beginPath();
        ctx.arc(gx, gy, Math.max(glintR * 0.16, 1.4), 0, TAU);
        ctx.fillStyle = white(0.4);
        ctx.fill();

        if (c.hot) {
          const pulse = 0.18 + 0.12 * (0.5 + 0.5 * Math.sin(t * 0.8 + c.phy));
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(thick * 0.12, 2), 0, TAU);
          ctx.fillStyle = A(pulse);
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = A(pulse * 0.6);
          // thin accent rim accent on hot capsules only
          capsulePath(cx, cy, len, thick, rot);
          ctx.stroke();
        }
      }
    },
    dispose() {},
  };
});
