import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { TAU, clamp, lerp } from '../../easing';

/* CLIENT PORTAL GATE — two concentric iris rings of arc blades that rhythmically
   open (gaps widen) then re-seal like an aperture, a rotating radial scan beam
   sweeps the field, and a locked diamond core glyph blinks red on each seal. */
registerScene('client-portal-gate', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let cx = W / 2, cy = H / 2, R = 1;
  const rings = [];

  const build = (w, h, q = quality) => {
    W = w; H = h;
    cx = W / 2; cy = H / 2;
    R = Math.min(W, H);
    const scale = q === 'static' || q === 'low' ? 0.6 : q === 'medium' ? 0.82 : 1;
    rings.length = 0;
    // inner + outer aperture rings; blades = arc segments evenly spaced
    rings.push({ rad: 0.2, blades: Math.max(5, Math.round(7 * scale * density)), spin: 0.22, dir: 1, phase: 0 });
    rings.push({ rad: 0.34, blades: Math.max(7, Math.round(11 * scale * density)), spin: -0.14, dir: -1, phase: Math.PI });
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const px = cx + (p.active ? p.nx * 14 : 0);
      const py = cy + (p.active ? p.ny * 14 : 0);

      // aperture cycle: 0 = sealed (gaps closed), 1 = fully open (gaps wide)
      const open = clamp(Math.sin(t * 0.75) * 0.5 + 0.5, 0, 1);
      const sealed = 1 - open;

      // faint full guide ring at outer extent
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.05);
      ctx.beginPath();
      ctx.arc(px, py, R * 0.42, 0, TAU);
      ctx.stroke();

      // iris blade rings — each blade is an arc with a gap that breathes with `open`
      for (let ri = 0; ri < rings.length; ri += 1) {
        const ring = rings[ri];
        const rr = R * ring.rad;
        const seg = TAU / ring.blades;
        // gap fraction of each segment widens as aperture opens
        const gap = lerp(0.06, 0.62, open) * seg;
        const arcLen = seg - gap;
        const rot = ring.phase + t * ring.spin * ring.dir;
        ctx.lineWidth = ri === 0 ? 2 : 1.6;
        for (let b = 0; b < ring.blades; b += 1) {
          const a0 = rot + b * seg + gap * 0.5;
          const a1 = a0 + arcLen;
          ctx.strokeStyle = white(0.16 + sealed * 0.1);
          ctx.beginPath();
          ctx.arc(px, py, rr, a0, a1);
          ctx.stroke();
          // blade leading-edge tick
          const ex = px + Math.cos(a1) * rr;
          const ey = py + Math.sin(a1) * rr;
          ctx.fillStyle = white(0.4);
          ctx.beginPath();
          ctx.arc(ex, ey, 1.4, 0, TAU);
          ctx.fill();
        }
      }

      // rotating radial scan beam (conic wedge) sweeping the aperture interior
      const sa = (t * 0.85) % TAU;
      const beamR = R * 0.4;
      if (ctx.createConicGradient) {
        const g = ctx.createConicGradient(sa, px, py);
        g.addColorStop(0, A(0.22));
        g.addColorStop(0.06, A(0));
        g.addColorStop(1, A(0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.arc(px, py, beamR, sa - 0.45, sa);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = A(0.45);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(sa) * beamR, py + Math.sin(sa) * beamR);
      ctx.stroke();

      // locked core glyph — rotating diamond + cross-hairs, red when sealed
      const lockGlow = sealed * sealed; // sharp flash near full seal
      const cr = 11 + sealed * 4;
      const dr = sa * 0.5;
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = white(0.2 + lockGlow * 0.3);
      ctx.beginPath();
      for (let k = 0; k < 4; k += 1) {
        const a = dr + (TAU * k) / 4;
        const x = px + Math.cos(a) * cr;
        const y = py + Math.sin(a) * cr;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // inner shackle hint (lock arc) above core
      ctx.strokeStyle = white(0.22);
      ctx.beginPath();
      ctx.arc(px, py - 2, 4.2, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();

      // core dot — pulses red on seal
      ctx.fillStyle = A(0.45 + lockGlow * 0.5);
      ctx.beginPath();
      ctx.arc(px, py, 3 + lockGlow * 1.5, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
