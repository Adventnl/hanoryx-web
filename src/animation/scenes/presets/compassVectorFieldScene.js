// Compass vector field: a faint central compass rose with cardinal ticks slowly rotating, and a lattice of small needles all swinging to point along the current heading.
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { TAU, clamp, lerp } from '../../easing';

registerScene('compass-vector', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  const d = clamp(density || 1, 0.5, 1.4);

  // needle lattice spacing — coarser when static/low so the field reads cleanly
  const baseCell = quality === 'static' || quality === 'low' ? 70
    : quality === 'medium' ? 58 : 48;
  const cell = baseCell / d;

  let cols, rows, offX, offY, cx, cy, rose;
  const build = (w, h) => {
    W = w; H = h;
    cols = Math.min(18, Math.max(4, Math.floor(W / cell)));
    rows = Math.min(11, Math.max(3, Math.floor(H / cell)));
    offX = (W - (cols - 1) * cell) / 2;
    offY = (H - (rows - 1) * cell) / 2;
    cx = W / 2;
    cy = H / 2;
    rose = Math.min(W, H) * 0.36; // radius of the central compass rose
  };
  build(width, height);

  // 8 principal points of a compass rose (N at top, clockwise)
  const TICKS = 8;

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // current heading: a slow continuous rotation, nudged toward the pointer when present.
      let heading = t * 0.18;
      if (p.active) {
        const px = (p.nx + 1) * 0.5 * W;
        const py = (p.ny + 1) * 0.5 * H;
        const target = Math.atan2(py - cy, px - cx);
        // blend a fraction toward the bearing of the cursor so the whole field leans that way
        heading = target - Math.PI / 2 + Math.sin(t * 0.4) * 0.05;
      }
      // -PI/2 baseline so heading 0 points "north" (up); add it once here:
      const head = heading - Math.PI / 2;
      const hx = Math.cos(head), hy = Math.sin(head);

      // --- central compass rose: faint outer rings ---
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.07);
      ctx.beginPath();
      ctx.arc(cx, cy, rose, 0, TAU);
      ctx.moveTo(cx + rose * 0.62, cy);
      ctx.arc(cx, cy, rose * 0.62, 0, TAU);
      ctx.stroke();

      // rotating cardinal ticks + diamond petals around the rose
      const spin = t * 0.18;
      for (let i = 0; i < TICKS; i++) {
        const a = spin + (i / TICKS) * TAU - Math.PI / 2;
        const ca = Math.cos(a), sa = Math.sin(a);
        const major = i % 2 === 0; // N/E/S/W are major
        const r0 = rose * 0.62;
        const r1 = rose * (major ? 1 : 0.86);
        ctx.lineWidth = major ? 1.25 : 1;
        ctx.strokeStyle = white(major ? 0.16 : 0.08);
        ctx.beginPath();
        ctx.moveTo(cx + ca * r0, cy + sa * r0);
        ctx.lineTo(cx + ca * r1, cy + sa * r1);
        ctx.stroke();

        // small diamond petal at each major point — drawn as two thin triangle edges
        if (major) {
          const tipx = cx + ca * (rose + 8);
          const tipy = cy + sa * (rose + 8);
          const bx = cx + ca * (rose * 0.9);
          const by = cy + sa * (rose * 0.9);
          const wx = -sa, wy = ca; // perpendicular
          const wd = rose * 0.05;
          ctx.strokeStyle = white(0.12);
          ctx.beginPath();
          ctx.moveTo(tipx, tipy);
          ctx.lineTo(bx + wx * wd, by + wy * wd);
          ctx.lineTo(bx - wx * wd, by - wy * wd);
          ctx.closePath();
          ctx.stroke();
        }
      }

      // --- needle lattice: every needle points along the current heading ---
      const len = cell * 0.32;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offX + c * cell;
          const y = offY + r * cell;

          // each needle lags the master heading slightly by its distance from centre,
          // so the swing ripples outward like a settling compass.
          const dx = x - cx, dy = y - cy;
          const dist = Math.hypot(dx, dy);
          const lag = Math.sin(t * 1.1 - dist * 0.012) * 0.18;
          const ang = head + lag;
          const ux = Math.cos(ang), uy = Math.sin(ang);

          // brightness falls with distance from centre, with a faint radial breathing
          const fall = clamp(1 - dist / (Math.hypot(W, H) * 0.5), 0, 1);
          const glow = 0.06 + fall * 0.12;

          // needle body: south (tail) faint white, north (head) the pointing tip
          const tx = x + ux * len, ty = y + uy * len;       // north tip
          const sx = x - ux * len * 0.7, sy = y - uy * len * 0.7; // south tail
          ctx.lineWidth = 1;
          ctx.strokeStyle = white(glow);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.stroke();

          // north chevron — sparse red only on needles near the rose ring
          const near = clamp(1 - Math.abs(dist - rose) / (rose * 0.45), 0, 1);
          const back = ang + Math.PI;
          const hl = 2.5 + fall * 1.5;
          ctx.strokeStyle = near > 0.5 ? A(lerp(0.1, 0.55, near)) : white(glow + 0.05);
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + Math.cos(back + 0.5) * hl, ty + Math.sin(back + 0.5) * hl);
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + Math.cos(back - 0.5) * hl, ty + Math.sin(back - 0.5) * hl);
          ctx.stroke();
        }
      }

      // --- master needle through the centre: the authoritative heading ---
      const ml = rose * 0.55;
      // tail (south) — dim white
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = white(0.22);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - hx * ml * 0.7, cy - hy * ml * 0.7);
      ctx.stroke();
      // head (north) — red, the single strong accent
      ctx.strokeStyle = A(0.85);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + hx * ml, cy + hy * ml);
      ctx.stroke();
      // arrowhead at the master tip
      const mtx = cx + hx * ml, mty = cy + hy * ml;
      const mback = head + Math.PI;
      ctx.beginPath();
      ctx.moveTo(mtx, mty);
      ctx.lineTo(mtx + Math.cos(mback + 0.45) * 9, mty + Math.sin(mback + 0.45) * 9);
      ctx.moveTo(mtx, mty);
      ctx.lineTo(mtx + Math.cos(mback - 0.45) * 9, mty + Math.sin(mback - 0.45) * 9);
      ctx.stroke();

      // pivot hub
      ctx.fillStyle = A(0.1);
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, TAU);
      ctx.fill();
      ctx.fillStyle = white(0.6);
      ctx.beginPath();
      ctx.arc(cx, cy, 2.4, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
