/* SPLIT PRISM — the field sliced by several parallel diagonal seams whose offsets
   drift; each pane carries a faint distinct texture (fine lines / dot lattice / blank),
   and a bright edge highlight runs along the seams. A diagonal, faceted shape language. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('split-prism', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let panes = 5;
  let diag = 0;        // diagonal slope: dx over the full height
  let span = 0;        // distance between seams along x at y=0

  const build = (w, h) => {
    W = w;
    H = h;
    const scale = quality === 'low' || quality === 'static' ? 0.6 : quality === 'medium' ? 0.85 : 1;
    panes = clamp(Math.round(5 * scale * density), 3, 8);
    diag = H * 0.5;                      // seams lean to the right going down
    span = (W + diag) / panes;          // even split across the sheared sheet
  };
  build(width, height);

  // x of seam i at vertical position y (0..H), with a slow per-seam drift offset
  const seamX = (i, y, t) => {
    const drift = Math.sin(t * 0.18 + i * 1.3) * (span * 0.16);
    const base = i * span - diag + drift;
    return base + (y / H) * diag;       // shear: shift right as y increases
  };

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const tilt = clamp((p.nx || 0) * 0.5, -0.6, 0.6);

      // each pane gets a stable texture type: 0 = fine lines, 1 = dots, 2 = blank
      const texOf = (i) => Math.floor(hash(i * 3.7 + 1) * 3) % 3;

      // draw each pane: clip to the slanted strip between seam i and seam i+1
      for (let i = 0; i < panes + 1; i += 1) {
        const lx0 = seamX(i, 0, t);
        const lx1 = seamX(i, H, t);
        const rx0 = seamX(i + 1, 0, t);
        const rx1 = seamX(i + 1, H, t);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(lx0, 0);
        ctx.lineTo(rx0, 0);
        ctx.lineTo(rx1, H);
        ctx.lineTo(lx1, H);
        ctx.closePath();
        ctx.clip();

        // faint base tint per pane so facets read as distinct planes
        const tint = 0.012 + hash(i * 1.9) * 0.022;
        ctx.fillStyle = white(tint);
        ctx.fillRect(0, 0, W, H);

        const tex = texOf(i);
        const ang = diag / H;            // slope of the seams (dx per dy)

        if (tex === 0) {
          // fine lines running PARALLEL to the seams (diagonal hatching)
          const lineGap = 26;
          ctx.lineWidth = 1;
          ctx.strokeStyle = white(0.05);
          const start = lx0 - lineGap;
          for (let x = start; x < rx0 + diag + lineGap; x += lineGap) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + diag, H);
            ctx.stroke();
          }
        } else if (tex === 1) {
          // dot lattice with a slow pulse sweeping diagonally
          const cell = 30;
          for (let y = cell * 0.5; y < H; y += cell) {
            for (let x = -cell; x < W + cell; x += cell) {
              const d = Math.sin(t * 1.4 - (x - y * ang) * 0.012) * 0.5 + 0.5;
              const r = 0.7 + d * 1.2;
              ctx.fillStyle = d > 0.9 ? A(0.5) : white(0.05 * (0.4 + d * 0.6));
              ctx.beginPath();
              ctx.arc(x, y, r, 0, TAU);
              ctx.fill();
            }
          }
        }
        // tex === 2: blank pane (just the tint) — gives breathing room

        ctx.restore();
      }

      // seam lines + travelling edge highlight along each seam
      const head = (t * 0.16) % 1.6;     // highlight progress, 0..1 maps down the seam
      for (let i = 1; i < panes + 1; i += 1) {
        const x0 = seamX(i, 0, t);
        const x1 = seamX(i, H, t);

        // the seam line itself — thin and quiet
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.14);
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x1, H);
        ctx.stroke();

        // a bright accent glow that slides down this seam (staggered per seam)
        const hp = (head - i * 0.13 + 1.6) % 1.6;
        if (hp <= 1) {
          const gy = hp * H;
          const gx = lerp(x0, x1, hp);
          const seg = H * 0.18;
          const len = Math.hypot(diag, H);
          const ux = diag / len, uy = H / len;
          const grad = ctx.createLinearGradient(
            gx - ux * seg, gy - uy * seg,
            gx + ux * seg, gy + uy * seg
          );
          grad.addColorStop(0, A(0));
          grad.addColorStop(0.5, A(0.55));
          grad.addColorStop(1, A(0));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(gx - ux * seg, gy - uy * seg);
          ctx.lineTo(gx + ux * seg, gy + uy * seg);
          ctx.stroke();

          // bright core node riding the seam
          ctx.fillStyle = A(0.85);
          ctx.beginPath();
          ctx.arc(gx, gy, 2.2 + Math.sin(t * 5 + i) * 0.5, 0, TAU);
          ctx.fill();
          ctx.strokeStyle = A(0.2);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(gx, gy, 6 + Math.sin(t * 5 + i) * 1.2, 0, TAU);
          ctx.stroke();
        }
      }

      // pointer-driven prism refraction line: a single bright seam tracking the cursor
      if (p.active) {
        const px = p.x || W * 0.5;
        const lead = px + tilt * span * 0.5;
        ctx.strokeStyle = A(0.22);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(lead - diag * 0.5, 0);
        ctx.lineTo(lead + diag * 0.5, H);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
