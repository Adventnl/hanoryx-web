/* NODE COMPRESSION — scattered nodes breathe inward to a centred ordered ring lattice
   then disperse; connector lines thicken and brighten at peak compression, red core. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('node-compression', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let N = 56;
  let cx = W / 2, cy = H / 2;

  // per-node deterministic params: scattered home, ordered ring slot
  let scat = [];
  let order = [];

  const build = (w, h) => {
    W = w;
    H = h;
    cx = W / 2;
    cy = H / 2;
    const scale = quality === 'low' || quality === 'static' ? 0.55 : quality === 'medium' ? 0.8 : 1;
    N = Math.max(20, Math.min(110, Math.round(64 * scale * density)));

    scat = new Array(N);
    order = new Array(N);
    const ring0 = Math.min(W, H) * 0.07;
    const ringStep = Math.min(W, H) * 0.052;
    // assign nodes into concentric rings to form the ordered system
    let placed = 0;
    let ringIdx = 0;
    while (placed < N) {
      const cap = 5 + ringIdx * 5; // nodes this ring can hold
      const rr = ring0 + ringIdx * ringStep;
      const n = Math.min(cap, N - placed);
      for (let k = 0; k < n; k += 1) {
        const ang = (k / n) * TAU + ringIdx * 0.6;
        order[placed] = { r: rr, a: ang };
        const hx = hash(placed * 2.17 + 1.3);
        const hy = hash(placed * 3.91 + 7.7);
        scat[placed] = {
          x: lerp(W * 0.06, W * 0.94, hx),
          y: lerp(H * 0.08, H * 0.92, hy),
          ph: hash(placed * 5.3) * TAU,
        };
        placed += 1;
      }
      ringIdx += 1;
    }
  };
  build(width, height);

  const PERIOD = 7.4; // seconds per breathe cycle
  const px = new Float32Array(110);
  const py = new Float32Array(110);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // centre tracks pointer slightly when active
      let ccx = cx, ccy = cy;
      if (p.active) {
        ccx = lerp(cx, p.x, 0.4);
        ccy = lerp(cy, p.y, 0.4);
      }

      // compression factor: 0 = scattered, 1 = fully ordered. eased smooth breathing.
      const phase = (t % PERIOD) / PERIOD;
      const raw = 0.5 - 0.5 * Math.cos(phase * TAU); // 0..1..0
      const c = raw * raw * (3 - 2 * raw); // smoothstep -> crisp hold at extremes
      const rot = t * 0.12; // whole ordered system rotates slowly

      // resolve every node position into px/py
      for (let i = 0; i < N; i += 1) {
        const o = order[i];
        const s = scat[i];
        // ordered target (rotating ring slot)
        const ox = ccx + Math.cos(o.a + rot) * o.r;
        const oy = ccy + Math.sin(o.a + rot) * o.r;
        // scattered drift wobble
        const wob = 8 + 6 * (1 - c);
        const sx = s.x + Math.cos(t * 0.5 + s.ph) * wob;
        const sy = s.y + Math.sin(t * 0.4 + s.ph * 1.3) * wob;
        px[i] = lerp(sx, ox, c);
        py[i] = lerp(sy, oy, c);
      }

      // connector lines — only between near neighbours; strengthen with compression
      const connectDist = Math.min(W, H) * (0.1 + 0.06 * c);
      const cd2 = connectDist * connectDist;
      const lineAlpha = lerp(0.018, 0.16, c);
      ctx.lineWidth = lerp(0.6, 1.15, c);
      ctx.strokeStyle = white(lineAlpha);
      ctx.beginPath();
      for (let i = 0; i < N; i += 1) {
        for (let j = i + 1; j < N; j += 1) {
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          const d2 = dx * dx + dy * dy;
          if (d2 < cd2) {
            ctx.moveTo(px[i], py[i]);
            ctx.lineTo(px[j], py[j]);
          }
        }
      }
      ctx.stroke();

      // a few spokes from centre to inner nodes flare red at peak compression
      if (c > 0.55) {
        const fl = clamp((c - 0.55) / 0.45, 0, 1);
        ctx.strokeStyle = A(0.1 * fl);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < N; i += 1) {
          if (order[i].r < Math.min(W, H) * 0.16) {
            ctx.moveTo(ccx, ccy);
            ctx.lineTo(px[i], py[i]);
          }
        }
        ctx.stroke();
      }

      // nodes — small white dots; inner ones tinge red as the system locks in
      const innerR = Math.min(W, H) * 0.12;
      for (let i = 0; i < N; i += 1) {
        const o = order[i];
        const isCore = o.r < innerR;
        const dotR = 1 + (isCore ? c * 1.2 : c * 0.5);
        if (isCore && c > 0.4) {
          ctx.fillStyle = A(lerp(0.18, 0.6, c));
        } else {
          ctx.fillStyle = white(lerp(0.22, 0.46, c));
        }
        ctx.beginPath();
        ctx.arc(px[i], py[i], dotR, 0, TAU);
        ctx.fill();
      }

      // central core appears as the cluster orders itself
      const coreA = clamp((c - 0.3) / 0.7, 0, 1);
      if (coreA > 0) {
        const pulse = 0.6 + 0.4 * Math.sin(t * 2.2);
        ctx.fillStyle = A(0.55 * coreA);
        ctx.beginPath();
        ctx.arc(ccx, ccy, (1.6 + pulse * 1.8) * coreA + 0.5, 0, TAU);
        ctx.fill();
        // faint containment ring at full compression
        ctx.strokeStyle = A(0.14 * coreA);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ccx, ccy, innerR * (0.9 + 0.1 * pulse), 0, TAU);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
