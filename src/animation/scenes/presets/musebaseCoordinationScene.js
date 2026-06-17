import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, clamp } from '../../easing';

/* MUSEBASE COORDINATION — a central core with four module clusters (scheduling,
   communication, records, payment) orbiting on a wide ring; curved links arc
   from core to each cluster and pulse with a travelling packet as coordination
   fires in sequence, lighting that cluster's satellite nodes red. */
registerScene('musebase-coordination', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  let cx = W / 2, cy = H / 2;
  let R = 1;
  const MODULES = 4;
  let satCount = 5;

  const build = (w, h, q = quality) => {
    W = w; H = h;
    cx = W / 2; cy = H / 2;
    R = Math.min(W, H);
    const scale = q === 'low' || q === 'static' ? 0.5 : q === 'medium' ? 0.75 : 1;
    satCount = Math.max(3, Math.round(6 * scale * density));
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      const px = cx + (p.active ? p.nx * 16 : 0);
      const py = cy + (p.active ? p.ny * 16 : 0);

      const ringR = R * 0.34;
      const drift = t * 0.05;

      // faint orbit guide for the module ring
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.05);
      ctx.beginPath();
      ctx.arc(px, py, ringR, 0, TAU);
      ctx.stroke();

      // coordination "tick": which module is currently being addressed
      const period = 1.9;
      const active = Math.floor(t / period) % MODULES;
      const localPhase = (t / period) % 1; // 0..1 within the current module's turn

      for (let m = 0; m < MODULES; m += 1) {
        const baseAng = (m / MODULES) * TAU + drift - Math.PI / 2;
        const wob = Math.sin(t * 0.6 + m * 1.7) * 0.04;
        const ang = baseAng + wob;
        const mxp = px + Math.cos(ang) * ringR;
        const myp = py + Math.sin(ang) * ringR;

        const isActive = m === active;
        // energy peaks mid-turn for the active module, decays otherwise
        const energy = isActive ? Math.sin(localPhase * Math.PI) : 0;

        // curved coordination link: core -> module, bowed perpendicular
        const mxc = (px + mxp) / 2;
        const myc = (py + myp) / 2;
        const perp = ang + Math.PI / 2;
        const bow = ringR * 0.22 * (m % 2 === 0 ? 1 : -1);
        const ctrlX = mxc + Math.cos(perp) * bow;
        const ctrlY = myc + Math.sin(perp) * bow;

        ctx.strokeStyle = isActive ? A(0.12 + energy * 0.4) : white(0.06);
        ctx.lineWidth = isActive ? 1 + energy : 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(ctrlX, ctrlY, mxp, myp);
        ctx.stroke();
        ctx.lineWidth = 1;

        // travelling packet along the active link
        if (isActive) {
          const u = clamp(localPhase, 0, 1);
          const iu = 1 - u;
          const qx = iu * iu * px + 2 * iu * u * ctrlX + u * u * mxp;
          const qy = iu * iu * py + 2 * iu * u * ctrlY + u * u * myp;
          const u2 = clamp(u - 0.07, 0, 1);
          const iu2 = 1 - u2;
          const tx = iu2 * iu2 * px + 2 * iu2 * u2 * ctrlX + u2 * u2 * mxp;
          const ty = iu2 * iu2 * py + 2 * iu2 * u2 * ctrlY + u2 * u2 * myp;
          ctx.strokeStyle = A(0.6 * energy + 0.15);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(qx, qy);
          ctx.stroke();
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(qx, qy, 1.9, 0, TAU);
          ctx.fillStyle = A(0.85);
          ctx.fill();
        }

        // cluster hull ring
        const clusterR = R * 0.052;
        ctx.strokeStyle = isActive ? A(0.18 + energy * 0.3) : white(0.1);
        ctx.beginPath();
        ctx.arc(mxp, myp, clusterR + 2 + energy * 3, 0, TAU);
        ctx.stroke();

        // satellite nodes of this cluster, arranged around the module point
        const satSpin = t * (0.3 + m * 0.05) * (m % 2 === 0 ? 1 : -1);
        for (let s = 0; s < satCount; s += 1) {
          const sa = satSpin + (s / satCount) * TAU + hash(m * 9.1 + s) * 0.5;
          const sr = clusterR * (0.55 + hash(m * 3.3 + s * 1.7) * 0.45);
          const sxp = mxp + Math.cos(sa) * sr;
          const syp = myp + Math.sin(sa) * sr;
          // spoke from cluster centre
          ctx.strokeStyle = isActive ? A(0.08 + energy * 0.18) : white(0.05);
          ctx.beginPath();
          ctx.moveTo(mxp, myp);
          ctx.lineTo(sxp, syp);
          ctx.stroke();
          const lit = isActive && energy > 0.25;
          ctx.fillStyle = lit ? A(0.5 + energy * 0.4) : white(0.4);
          ctx.beginPath();
          ctx.arc(sxp, syp, lit ? 2.2 : 1.6, 0, TAU);
          ctx.fill();
        }

        // cluster core dot
        ctx.fillStyle = isActive ? A(0.8) : white(0.6);
        ctx.beginPath();
        ctx.arc(mxp, myp, isActive ? 3 + energy * 1.5 : 2.4, 0, TAU);
        ctx.fill();
      }

      // central coordination core — breathing rings + accent heart
      const breathe = 0.5 + 0.5 * Math.sin(t * 1.3);
      ctx.strokeStyle = white(0.16);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(px, py, 11 + breathe * 3, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = white(0.07);
      ctx.beginPath();
      ctx.arc(px, py, 18 + breathe * 4, 0, TAU);
      ctx.stroke();
      // pulse halo synced to the active hand-off
      const handoff = Math.sin(localPhase * Math.PI);
      ctx.fillStyle = A(0.06 + handoff * 0.08);
      ctx.beginPath();
      ctx.arc(px, py, 9 + handoff * 10, 0, TAU);
      ctx.fill();
      ctx.fillStyle = A(0.8 + breathe * 0.15);
      ctx.beginPath();
      ctx.arc(px, py, 3.4, 0, TAU);
      ctx.fill();
    },
    dispose() {},
  };
});
