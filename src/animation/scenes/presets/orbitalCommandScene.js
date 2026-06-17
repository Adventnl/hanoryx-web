import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawArcs, hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

/* ORBITAL COMMAND — a single command ring of evenly spaced route nodes with
   short packets routing along inter-node chords and a pulsing accent core. */
registerScene('orbital-command', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cx = W / 2;
  let cy = H / 2;
  let radius = 200;
  let nodeCount = 12;
  let packetCount = 7;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    cx = W / 2;
    cy = H / 2;
    radius = Math.min(W, H) * 0.34;
    const scale = q === 'low' || q === 'static' ? 0.55 : q === 'medium' ? 0.8 : 1;
    nodeCount = Math.max(8, Math.round(13 * scale * density));
    packetCount = Math.max(3, Math.round(9 * scale * density));
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const ox = p.active ? p.nx * 14 : 0;
      const oy = p.active ? p.ny * 14 : 0;
      const ccx = cx + ox;
      const ccy = cy + oy;
      const spin = t * 0.06;

      // faint outer arc system framing the ring
      drawArcs(ctx, {
        cx: ccx,
        cy: ccy,
        t,
        count: 3,
        rStep: radius * 0.42,
        alpha: 0.05,
        accent: A,
        accentRing: 4,
        spread: 0.55,
      });

      // the command ring itself
      ctx.strokeStyle = white(0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ccx, ccy, radius, 0, TAU);
      ctx.stroke();

      // inner guide ring
      ctx.strokeStyle = white(0.05);
      ctx.beginPath();
      ctx.arc(ccx, ccy, radius * 0.62, 0, TAU);
      ctx.stroke();

      // node positions around the ring
      const nx = new Array(nodeCount);
      const ny = new Array(nodeCount);
      const nact = new Array(nodeCount);
      for (let i = 0; i < nodeCount; i += 1) {
        const a = spin + (i / nodeCount) * TAU;
        nx[i] = ccx + Math.cos(a) * radius;
        ny[i] = ccy + Math.sin(a) * radius;
        // each node breathes on its own phase; a couple read as "active" hubs
        const pulse = Math.sin(t * 1.6 + i * 1.3) * 0.5 + 0.5;
        const isHub = hash(i * 7.3) > 0.78;
        nact[i] = isHub ? 0.4 + pulse * 0.6 : 0;

        // tick mark inward from each node
        const a2 = spin + (i / nodeCount) * TAU;
        ctx.strokeStyle = white(0.1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nx[i], ny[i]);
        ctx.lineTo(ccx + Math.cos(a2) * radius * 0.9, ccy + Math.sin(a2) * radius * 0.9);
        ctx.stroke();

        // node marker
        const r = isHub ? 3.2 : 2;
        if (isHub) {
          ctx.fillStyle = A(0.35 + nact[i] * 0.5);
          ctx.beginPath();
          ctx.arc(nx[i], ny[i], r + 3 + nact[i] * 3, 0, TAU);
          ctx.fillStyle = A(0.08 * nact[i]);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(nx[i], ny[i], r, 0, TAU);
          ctx.fillStyle = A(0.5 + nact[i] * 0.4);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(nx[i], ny[i], r, 0, TAU);
          ctx.fillStyle = white(0.4);
          ctx.fill();
        }
      }

      // packets travelling along chords between route nodes
      for (let k = 0; k < packetCount; k += 1) {
        const seed = hash(k * 13.7);
        const cycle = 2.6 + seed * 2.4;
        const phase = (t / cycle + seed) % 1;
        // pick a stable from/to pair that steps over time
        const step = Math.floor(t / cycle + seed * 10);
        const from = (k * 3 + step * 5) % nodeCount;
        let to = (from + 2 + (Math.floor(hash(k + step) * (nodeCount - 3)))) % nodeCount;
        if (to === from) to = (to + 1) % nodeCount;

        const ax = nx[from];
        const ay = ny[from];
        const bx = nx[to];
        const by = ny[to];

        // chord line (faint) bowed slightly toward centre
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const bowx = lerp(mx, ccx, 0.18);
        const bowy = lerp(my, ccy, 0.18);

        ctx.strokeStyle = white(0.04 + 0.04 * Math.sin(phase * Math.PI));
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(bowx, bowy, bx, by);
        ctx.stroke();

        // packet position along the quadratic curve
        const u = phase;
        const iu = 1 - u;
        const px = iu * iu * ax + 2 * iu * u * bowx + u * u * bx;
        const py = iu * iu * ay + 2 * iu * u * bowy + u * u * by;

        // short trailing segment
        const u2 = clamp(u - 0.06, 0, 1);
        const iu2 = 1 - u2;
        const tx = iu2 * iu2 * ax + 2 * iu2 * u2 * bowx + u2 * u2 * bx;
        const ty = iu2 * iu2 * ay + 2 * iu2 * u2 * bowy + u2 * u2 * by;
        const fade = Math.sin(phase * Math.PI);
        ctx.strokeStyle = A(0.55 * fade);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, TAU);
        ctx.fillStyle = A(0.85 * fade);
        ctx.fill();
      }

      // pulsing command core
      const core = Math.sin(t * 1.4) * 0.5 + 0.5;
      const coreR = radius * 0.07;
      ctx.beginPath();
      ctx.arc(ccx, ccy, coreR + 6 + core * 8, 0, TAU);
      ctx.fillStyle = A(0.06 + core * 0.06);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ccx, ccy, coreR, 0, TAU);
      ctx.fillStyle = A(0.85);
      ctx.fill();
      ctx.strokeStyle = white(0.18);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ccx, ccy, coreR + 4 + core * 4, 0, TAU);
      ctx.stroke();
    },
    dispose() {},
  };
});
