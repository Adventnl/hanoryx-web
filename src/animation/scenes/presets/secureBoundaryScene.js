import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, lerp } from '../../easing';

/* SECURE BOUNDARY — a central protected zone ringed by a slowly rotating dashed
   perimeter with a single accent gate aperture; access nodes drift in from
   outside and either thread the gate into the core or deflect off the wall. */
registerScene('secure-boundary', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let cx = W / 2, cy = H / 2, R = 1;
  const agents = [];

  const build = (w, h, q = quality) => {
    W = w; H = h;
    cx = W / 2; cy = H / 2;
    R = Math.min(W, H) * 0.26;
    const scale = q === 'static' || q === 'low' ? 0.5 : q === 'medium' ? 0.78 : 1;
    const count = Math.max(5, Math.round(14 * scale * density));
    agents.length = 0;
    for (let i = 0; i < count; i += 1) {
      agents.push({
        seed: i,
        ang: hash(i * 1.7) * TAU,         // approach direction
        dur: 5 + hash(i * 2.3) * 6,        // seconds per approach cycle
        off: hash(i * 3.1) * 8,            // staggered start
        admit: hash(i * 4.9) < 0.32,       // does it pass the gate?
      });
    }
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const px = cx + (p.active ? p.nx * 12 : 0);
      const py = cy + (p.active ? p.ny * 12 : 0);

      // perimeter rotation + breathing gate position
      const spin = t * 0.18;
      const gateA = spin;                 // gate centre angle on the wall
      const gateHalf = 0.26;              // angular half-width of the gate opening
      const gatePulse = Math.sin(t * 1.6) * 0.5 + 0.5;

      // --- inner protected zone: faint fill ring + crosshair core ---
      ctx.strokeStyle = white(0.05);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py, R * 0.52, 0, TAU);
      ctx.stroke();

      // --- rotating dashed perimeter wall (skip the gate arc) ---
      const segs = 60;
      const seg = TAU / segs;
      for (let s = 0; s < segs; s += 1) {
        const a0 = spin + s * seg;
        // angular distance of this segment's centre to the gate
        let da = ((a0 + seg * 0.5) - gateA + Math.PI) % TAU - Math.PI;
        const inGate = Math.abs(da) < gateHalf;
        if (inGate) continue;             // leave a clean opening at the gate
        const dash = s % 2 === 0;         // dashed look
        if (!dash) continue;
        ctx.strokeStyle = white(0.16);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(px, py, R, a0, a0 + seg * 0.7);
        ctx.stroke();
      }

      // --- gate jambs: two accent ticks marking the aperture edges ---
      for (let k = -1; k <= 1; k += 2) {
        const ja = gateA + k * gateHalf;
        const jx = px + Math.cos(ja) * R;
        const jy = py + Math.sin(ja) * R;
        ctx.strokeStyle = A(0.5);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(jx - Math.cos(ja) * 8, jy - Math.sin(ja) * 8);
        ctx.lineTo(jx + Math.cos(ja) * 8, jy + Math.sin(ja) * 8);
        ctx.stroke();
      }
      // gate aperture glow arc
      ctx.strokeStyle = A(0.18 + gatePulse * 0.22);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, R, gateA - gateHalf, gateA + gateHalf);
      ctx.stroke();

      // --- access agents approaching the boundary ---
      const wallR = R;
      for (let i = 0; i < agents.length; i += 1) {
        const ag = agents[i];
        const phase = ((t + ag.off) % ag.dur) / ag.dur; // 0..1 cycle
        // start far outside, travel inward
        const startR = R * (1.7 + hash(ag.seed * 5.5) * 0.9);
        // direction this agent travels along: aim toward gate if admitted
        const aim = ag.admit
          ? gateA + (hash(ag.seed) - 0.5) * gateHalf * 0.9
          : ag.ang;

        let r;            // current radius of the agent
        let blocked = false;
        if (ag.admit) {
          // straight run from outside, through gate, to near the core
          r = lerp(startR, R * 0.12, phase);
        } else {
          // approach then deflect: bounce off the wall just outside it
          const reach = phase < 0.5 ? phase / 0.5 : 1 - (phase - 0.5) / 0.5;
          r = lerp(startR, wallR + 4, reach);
          blocked = reach > 0.85;
        }

        const ax = px + Math.cos(aim) * r;
        const ay = py + Math.sin(aim) * r;
        const inside = r < wallR - 2;

        // trail line from current pos pointing back outward
        const trailR = r + 18;
        ctx.strokeStyle = ag.admit && inside ? A(0.22) : white(0.07);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(px + Math.cos(aim) * trailR, py + Math.sin(aim) * trailR);
        ctx.stroke();

        // the node itself
        const adm = ag.admit && inside;
        ctx.fillStyle = adm ? A(0.85) : white(0.45);
        ctx.beginPath();
        ctx.arc(ax, ay, adm ? 2.4 : 1.8, 0, TAU);
        ctx.fill();

        // deflection mark: a small white spark when blocked at the wall
        if (blocked) {
          const flick = Math.sin(t * 30 + ag.seed) * 0.5 + 0.5;
          ctx.strokeStyle = white(0.25 + flick * 0.35);
          ctx.lineWidth = 1.2;
          const s = 4;
          ctx.beginPath();
          ctx.moveTo(ax - s, ay - s); ctx.lineTo(ax + s, ay + s);
          ctx.moveTo(ax + s, ay - s); ctx.lineTo(ax - s, ay + s);
          ctx.stroke();
        }
      }

      // --- protected core glyph: rotating square + pulsing centre dot ---
      const cr = 7 + gatePulse * 2;
      const dr = spin * 2;
      ctx.strokeStyle = white(0.22);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let k = 0; k < 4; k += 1) {
        const a = dr + (TAU * k) / 4 + TAU / 8;
        const x = px + Math.cos(a) * cr;
        const y = py + Math.sin(a) * cr;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = A(0.4 + gatePulse * 0.4);
      ctx.beginPath();
      ctx.arc(px, py, 2.4 + gatePulse * 1.2, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
