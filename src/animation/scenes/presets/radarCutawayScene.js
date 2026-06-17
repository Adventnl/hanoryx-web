/* RADAR CUTAWAY — a quarter radar anchored to the bottom-left corner: range rings
   and bearing spokes clipped to a 90deg wedge, a sweeping arm that paints contacts
   red as it crosses them, with blips that bloom then fade behind the sweep. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawRadar, hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('radar-cutaway', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cx = 0;
  let cy = H;
  let R = 200;
  let rings = 5;
  let blipCount = 7;

  // contacts live in polar coords within the wedge; .fade is the lit afterglow 0..1
  const blips = [];
  const seed = () => {
    blips.length = 0;
    for (let i = 0; i < blipCount; i += 1) {
      blips.push({
        a: hash(i * 1.7 + 0.3) * (TAU / 4),     // bearing inside the quarter
        r: 0.18 + hash(i * 2.9 + 1.1) * 0.78,    // normalised range 0..1
        fade: 0,
        drift: (hash(i * 3.3 + 0.7) - 0.5) * 0.05,
        kind: hash(i * 4.1 + 2.2),               // some contacts are "real", some clutter
      });
    }
  };

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    cx = 0;            // anchor radar origin to bottom-left corner
    cy = H;
    R = Math.min(W, H) * 0.95;
    const scale = q === 'low' || q === 'static' ? 0.6 : q === 'medium' ? 0.85 : 1;
    rings = Math.max(4, Math.round(6 * scale));
    blipCount = Math.max(4, Math.round(8 * density));
    seed();
  };
  build(width, height);

  let sweep = 0;       // current sweep angle 0..TAU/4 (measured up from +x toward -y)
  const wedge = TAU / 4;

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // sweep travels through the quarter then snaps back to the corner edge
      let speed = 0.55;
      if (p.active) speed += clamp(p.nx, -0.4, 0.6) * 0.4; // pointer trims sweep rate
      const prev = sweep;
      sweep = (t * speed) % wedge;
      const wrapped = sweep < prev; // detect the snap-back this frame

      ctx.save();
      // clip everything to the quarter wedge fanning up from the bottom-left corner.
      // angles 0 (along +x, the bottom edge) to -TAU/4 (along -y, the left edge);
      // we work in positive angles measured upward, so map a -> -a when drawing.
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, 0, -wedge, true);
      ctx.closePath();
      ctx.clip();

      // --- RANGE RINGS + BASE RADAR (origin at corner, clipped to the wedge) ---
      drawRadar(ctx, { cx, cy: cy, t: 0, radius: R, rings, alpha: 0.07, accent: A });

      // --- BEARING SPOKES: thin radial guides every ~11deg across the quarter ---
      const spokes = 8;
      for (let i = 0; i <= spokes; i += 1) {
        const a = -wedge * (i / spokes);
        const major = i % 4 === 0;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(major ? 0.1 : 0.035);
        ctx.stroke();
      }

      // --- SWEEP ARM: a soft trailing wedge + a crisp leading edge ---
      const arm = -sweep; // drawing angle (upward into the wedge)
      const g = ctx.createConicGradient
        ? ctx.createConicGradient(arm, cx, cy)
        : null;
      if (g) {
        g.addColorStop(0, A(0.18));
        g.addColorStop(0.06, A(0));
        g.addColorStop(1, A(0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        // trailing arc behind the leading edge (toward angle 0)
        ctx.arc(cx, cy, R, arm + 0.45, arm, true);
        ctx.closePath();
        ctx.fill();
      }
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(arm) * R, cy + Math.sin(arm) * R);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = A(0.7);
      ctx.stroke();

      // --- CONTACTS: bloom when the sweep crosses them, then decay behind it ---
      for (let i = 0; i < blipCount; i += 1) {
        const b = blips[i];
        // slow bearing drift, kept inside the wedge
        b.a += b.drift * 0.016;
        if (b.a < 0.02) b.a = 0.02;
        if (b.a > wedge - 0.02) b.a = wedge - 0.02;

        // illuminate when the leading edge is at this bearing (sweep passing it),
        // or whenever the sweep wraps past the far edge
        const hit = sweep >= b.a && sweep < b.a + 0.06;
        if (hit || (wrapped && b.a > sweep)) b.fade = 1;
        b.fade = lerp(b.fade, 0, 0.018);

        const rr = b.r * R;
        const bx = cx + Math.cos(-b.a) * rr;
        const by = cy + Math.sin(-b.a) * rr;
        const real = b.kind > 0.4;
        const f = b.fade;
        if (f < 0.01) continue;

        if (real) {
          // a returning contact: red core with a faint range halo
          ctx.beginPath();
          ctx.arc(bx, by, 2.4 + f * 1.4, 0, TAU);
          ctx.fillStyle = A(0.35 + f * 0.6);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(bx, by, 6 + (1 - f) * 6, 0, TAU);
          ctx.lineWidth = 1;
          ctx.strokeStyle = A(f * 0.25);
          ctx.stroke();
        } else {
          // clutter: a dim white speck, no halo
          ctx.beginPath();
          ctx.arc(bx, by, 1.4, 0, TAU);
          ctx.fillStyle = white(0.08 + f * 0.25);
          ctx.fill();
        }
      }

      ctx.restore();

      // --- CORNER FRAME: crisp edges defining the cutaway, drawn over the clip ---
      ctx.beginPath();
      ctx.moveTo(cx, cy - R);          // up the left edge
      ctx.lineTo(cx, cy);              // to the corner origin
      ctx.lineTo(cx + R, cy);          // along the bottom edge
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.16);
      ctx.stroke();
      // origin marker
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, TAU);
      ctx.fillStyle = white(0.5);
      ctx.fill();
    },
    dispose() {},
  };
});
