/* UNKNOWN SILHOUETTE — a large blacked-out irregular polygon mass sits centre, breathing
   slowly with a faint rim and rare red edge leaks; a sparse corner-bracket scanning frame
   and a column of redacted readout ticks surround it. Withheld, ominous, deliberately blank. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawDotGrid, drawScan, hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('unknown-silhouette', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let verts = 11;
  let ticks = 9;

  const build = (w, h) => {
    W = w;
    H = h;
    const scale = quality === 'low' || quality === 'static' ? 0.7 : quality === 'medium' ? 0.85 : 1;
    verts = Math.max(8, Math.round(12 * scale));
    ticks = Math.max(6, Math.round(10 * scale * density));
  };
  build(width, height);

  // deterministic irregular silhouette: per-vertex angle jitter + radius variance
  const radiusAt = (i) => 0.62 + hash(i * 3.1 + 1.7) * 0.46; // 0.62..1.08 of base
  const angleAt = (i, n) => (i / n) * TAU + (hash(i * 5.3 + 2.1) - 0.5) * (TAU / n) * 0.7;

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      const cx = W * 0.5;
      const cy = H * 0.52;
      const base = Math.min(W, H) * 0.27;

      // faint dot lattice behind everything — the field the object occludes
      drawDotGrid(ctx, { w: W, h: H, t: t * 0.4, cell: 46, alpha: 0.05, accent: A, pulse: 0.25 });

      // breathing: slow primary breath + tiny secondary shudder
      const breath = 1 + Math.sin(t * 0.55) * 0.045 + Math.sin(t * 1.9 + 1.3) * 0.012;
      // pointer subtly leans the mass toward the cursor
      const leanX = p.active ? (p.nx || 0) * base * 0.06 : 0;
      const leanY = p.active ? (p.ny || 0) * base * 0.06 : 0;

      // build the polygon path once
      const pts = [];
      for (let i = 0; i < verts; i += 1) {
        const a = angleAt(i, verts);
        // each vertex breathes slightly out of phase for an organic edge
        const wob = 1 + Math.sin(t * 0.9 + i * 1.7) * 0.02;
        const r = base * radiusAt(i, verts) * breath * wob;
        pts.push([cx + leanX + Math.cos(a) * r, cy + leanY + Math.sin(a) * r * 0.92]);
      }

      const trace = () => {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
      };

      // soft outer halo so the void reads as a mass, not a hole
      const halo = ctx.createRadialGradient(cx, cy, base * 0.5, cx, cy, base * 1.5);
      halo.addColorStop(0, white(0.07));
      halo.addColorStop(1, white(0));
      ctx.fillStyle = halo;
      trace();
      ctx.save();
      ctx.fill();
      ctx.restore();

      // the blacked-out body — fill pure black to occlude the lattice
      ctx.fillStyle = 'rgba(0,0,0,0.96)';
      trace();
      ctx.fill();

      // faint white rim — the only thing defining the silhouette
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.16);
      trace();
      ctx.stroke();

      // rare red edge leaks: a couple of vertices briefly bleed at the rim
      for (let i = 0; i < verts; i += 1) {
        const flick = Math.sin(t * 1.3 + i * 2.6) * 0.5 + 0.5;
        if (flick > 0.97 && hash(i * 7.7 + 3) > 0.5) {
          const [x0, y0] = pts[i];
          const [x1, y1] = pts[(i + 1) % verts];
          ctx.strokeStyle = A(0.2 + (flick - 0.97) * 8);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(lerp(x0, x1, 0.5), lerp(y0, y1, 0.5));
          ctx.stroke();
        }
      }

      // a single dim red core deep inside — the withheld thing, barely registering
      const corePulse = 0.04 + (Math.sin(t * 0.7) * 0.5 + 0.5) * 0.06;
      ctx.fillStyle = A(corePulse);
      ctx.beginPath();
      ctx.arc(cx + leanX, cy + leanY, base * 0.06, 0, TAU);
      ctx.fill();

      // sparse corner-bracket scanning frame around the mass
      const fx = cx - base * 1.35;
      const fy = cy - base * 1.35;
      const fw = base * 2.7;
      const fh = base * 2.7;
      const corner = base * 0.22;
      ctx.strokeStyle = white(0.12);
      ctx.lineWidth = 1;
      const bracket = (x, y, sx, sy) => {
        ctx.beginPath();
        ctx.moveTo(x, y + sy * corner);
        ctx.lineTo(x, y);
        ctx.lineTo(x + sx * corner, y);
        ctx.stroke();
      };
      bracket(fx, fy, 1, 1);
      bracket(fx + fw, fy, -1, 1);
      bracket(fx, fy + fh, 1, -1);
      bracket(fx + fw, fy + fh, -1, -1);

      // vertical scan band sweeping the frame, exposing nothing but its own edge
      drawScan(ctx, { w: W, h: H, t, axis: 'y', alpha: 0.03, accent: A, speed: 0.06 });

      // redacted readout ticks — a right-hand column of blacked-out data rows
      const colX = clamp(fx + fw + base * 0.18, W * 0.5, W - 90);
      const rowH = fh / ticks;
      for (let r = 0; r < ticks; r += 1) {
        const y = fy + r * rowH + rowH * 0.4;
        const bw = (0.04 + hash(r * 4.2 + 9) * 0.05) * Math.min(W, H);
        ctx.fillStyle = white(0.05 + hash(r) * 0.03);
        ctx.fillRect(colX, y, bw, Math.max(2, rowH * 0.22));
        // a rare row flickers a partial red reveal then re-redacts
        const rf = Math.sin(t * 1.1 + r * 3.3) * 0.5 + 0.5;
        if (rf > 0.98 && hash2(r, 2) > 0.45) {
          ctx.fillStyle = A(0.18);
          ctx.fillRect(colX, y, bw * 0.4, Math.max(2, rowH * 0.22));
        }
      }
    },
    dispose() {},
  };
});
