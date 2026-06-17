/* COMMERCE PIPELINE — horizontal lanes carry small order tokens left to right
   through vertical stage gates; a soft scan band sweeps across, and the rare
   flagged order glows red. A logistics/order-flow shape language, no grid. */
import { registerScene } from '../../sceneRegistry';
import { white } from '../../scenePalette';
import { accentFn } from '../../scenePalette';
import { drawScan, hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('commerce-pipeline', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;

  let lanes = 4;
  let gates = 5;
  let perLane = 7;
  let laneYs = [];
  let gateXs = [];

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    const scale = q === 'low' || q === 'static' ? 0.55 : q === 'medium' ? 0.8 : 1;
    lanes = H < 360 ? 3 : 4;
    gates = clamp(Math.round(5 * density), 3, 7);
    perLane = clamp(Math.round(8 * scale * density), 3, 12);

    laneYs = [];
    const top = H * 0.18;
    const span = H * 0.64;
    for (let i = 0; i < lanes; i++) {
      laneYs.push(top + (span * (i + 0.5)) / lanes);
    }
    gateXs = [];
    const left = W * 0.08;
    const gspan = W * 0.84;
    for (let g = 0; g < gates; g++) {
      gateXs.push(left + (gspan * (g + 0.5)) / gates);
    }
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      const trackLeft = W * 0.04;
      const trackRight = W * 0.96;
      const trackLen = trackRight - trackLeft;

      // background scan sweep — faint, restrained
      drawScan(ctx, { w: W, h: H, t, axis: 'x', alpha: 0.04, accent: A, speed: 0.08 });

      // lane rails
      ctx.lineWidth = 1;
      for (let i = 0; i < lanes; i++) {
        const y = laneYs[i];
        ctx.strokeStyle = white(0.06);
        ctx.beginPath();
        ctx.moveTo(trackLeft, y);
        ctx.lineTo(trackRight, y);
        ctx.stroke();

        // lane entry/exit caps
        ctx.strokeStyle = white(0.12);
        ctx.beginPath();
        ctx.moveTo(trackLeft, y - 5);
        ctx.lineTo(trackLeft, y + 5);
        ctx.moveTo(trackRight, y - 5);
        ctx.lineTo(trackRight, y + 5);
        ctx.stroke();
      }

      // stage gates — vertical ticks spanning the lanes, with a brief activation flash
      const gateTop = laneYs[0] - H * 0.06;
      const gateBot = laneYs[lanes - 1] + H * 0.06;
      for (let g = 0; g < gates; g++) {
        const gx = gateXs[g];
        const phase = (t * 0.5 + g * 0.27) % 1;
        const fire = phase < 0.12 ? 1 - phase / 0.12 : 0;
        ctx.strokeStyle = white(0.1 + 0.18 * fire);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gx, gateTop);
        ctx.lineTo(gx, gateBot);
        ctx.stroke();

        // gate head/foot notch
        ctx.strokeStyle = white(0.16);
        ctx.beginPath();
        ctx.moveTo(gx - 4, gateTop);
        ctx.lineTo(gx + 4, gateTop);
        ctx.moveTo(gx - 4, gateBot);
        ctx.lineTo(gx + 4, gateBot);
        ctx.stroke();

        if (fire > 0.02) {
          ctx.strokeStyle = A(0.35 * fire);
          ctx.beginPath();
          ctx.moveTo(gx, gateTop);
          ctx.lineTo(gx, gateBot);
          ctx.stroke();
        }
      }

      // order tokens flowing left -> right through the gates
      const sz = clamp(Math.min(W, H) * 0.012, 4, 9);
      const speedBase = 0.045;
      for (let i = 0; i < lanes; i++) {
        const y = laneYs[i];
        const laneSpeed = speedBase * (0.8 + 0.4 * hash(i + 1));
        const laneSeed = hash(i * 13 + 3);
        for (let k = 0; k < perLane; k++) {
          const offset = (k + laneSeed) / perLane;
          let prog = (t * laneSpeed + offset) % 1;
          // stutter at each gate to feel like processing
          const gateIdx = Math.floor(prog * gates);
          const local = prog * gates - gateIdx;
          const eased = local < 0.18 ? lerp(0, 0.18, (1 - Math.cos((local / 0.18) * TAU)) * 0.5 + local) : local;
          prog = (gateIdx + clamp(eased, 0, 1)) / gates;

          const x = trackLeft + prog * trackLen;
          const flagged = hash2(i * 31 + 7, k * 17 + 5) > 0.86;
          const flash = flagged ? 0.6 + 0.4 * Math.sin(t * 6 + k) : 0;

          // token trail
          ctx.strokeStyle = flagged ? A(0.18) : white(0.08);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - sz * 2.2, y);
          ctx.lineTo(x - sz * 0.7, y);
          ctx.stroke();

          // token square
          const h2 = sz * 0.5;
          if (flagged) {
            ctx.fillStyle = A(0.55 + 0.35 * flash);
            ctx.fillRect(x - h2, y - h2, sz, sz);
            ctx.strokeStyle = A(0.9);
            ctx.lineWidth = 1;
            ctx.strokeRect(x - h2 - 1.5, y - h2 - 1.5, sz + 3, sz + 3);
          } else {
            ctx.fillStyle = white(0.7);
            ctx.fillRect(x - h2, y - h2, sz, sz);
            ctx.strokeStyle = white(0.18);
            ctx.lineWidth = 1;
            ctx.strokeRect(x - h2, y - h2, sz, sz);
          }
        }
      }

      // pointer readout — a faint vertical inspection line snapped near lanes
      if (p.active) {
        const px = clamp(p.x, trackLeft, trackRight);
        ctx.strokeStyle = white(0.1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, gateTop - 6);
        ctx.lineTo(px, gateBot + 6);
        ctx.stroke();
        ctx.fillStyle = A(0.5);
        ctx.beginPath();
        ctx.arc(px, gateTop - 6, 2.2, 0, TAU);
        ctx.fill();
      }
    },
    dispose() {},
  };
});
