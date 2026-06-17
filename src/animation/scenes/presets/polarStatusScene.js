import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawArcs, drawRadialBars, hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

/* POLAR STATUS — a single instrument dial: a radial tick gauge with a red arc
   that fills to a slowly drifting setpoint, satellite readout dots on an outer
   ring, and a thin sweeping indicator needle. Pointer nudges the setpoint. */
registerScene('polar-status', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cx = W / 2;
  let cy = H / 2;
  let R = 120;
  let ticks = 64;
  let sats = 9;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    cx = W / 2;
    cy = H * 0.5;
    R = Math.min(W, H) * 0.3;
    const scale = q === 'low' || q === 'static' ? 0.55 : q === 'medium' ? 0.8 : 1;
    ticks = Math.max(24, Math.round(72 * scale * density));
    sats = Math.max(6, Math.round(10 * density));
  };
  build(width, height);

  // gauge spans from lower-left, sweeping up and over to lower-right (a 300deg arc)
  const startA = TAU * 0.6;        // -108deg-ish, bottom-left
  const sweepA = TAU * 0.8;        // 288 degrees of travel
  let value = 0.5;                 // smoothed displayed value

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // slowly drifting setpoint, layered sines so it never reads as periodic
      let target = 0.5 + Math.sin(t * 0.23) * 0.28 + Math.sin(t * 0.07 + 1.3) * 0.16;
      if (p.active) target += p.ny * -0.18; // pointer biases the reading
      target = clamp(target, 0.04, 0.98);
      value = lerp(value, target, 0.04);
      const valA = startA + sweepA * value;

      // faint backdrop arcs give depth behind the instrument
      drawArcs(ctx, { cx, cy, t, count: 4, rStep: R * 0.14, alpha: 0.04, accent: A, accentRing: -1, spread: 0.55 });

      // --- TICK GAUGE: radial ticks along the active arc, major ticks longer ---
      for (let i = 0; i <= ticks; i += 1) {
        const f = i / ticks;
        const a = startA + sweepA * f;
        const major = i % 8 === 0;
        const lit = f <= value; // ticks under the current value glow
        const inLen = major ? R * 0.085 : R * 0.045;
        const r0 = R - inLen;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(cx + ca * r0, cy + sa * r0);
        ctx.lineTo(cx + ca * R, cy + sa * R);
        ctx.lineWidth = major ? 1.5 : 1;
        if (lit && major) ctx.strokeStyle = A(0.7);
        else if (lit) ctx.strokeStyle = white(0.22);
        else ctx.strokeStyle = white(major ? 0.16 : 0.06);
        ctx.stroke();
      }

      // --- GAUGE FILL ARC: a clean red arc tracing from start to the value ---
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.78, startA, valA);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = A(0.85);
      ctx.stroke();
      // soft track behind it (the unfilled remainder)
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.78, valA, startA + sweepA);
      ctx.lineWidth = 1;
      ctx.strokeStyle = white(0.07);
      ctx.stroke();

      // value head dot at the end of the fill
      const hx = cx + Math.cos(valA) * R * 0.78;
      const hy = cy + Math.sin(valA) * R * 0.78;
      ctx.beginPath();
      ctx.arc(hx, hy, 3.2, 0, TAU);
      ctx.fillStyle = A(0.95);
      ctx.fill();

      // --- SWEEP INDICATOR: a thin needle that orbits independently of value ---
      const sweep = startA + sweepA * ((t * 0.12) % 1);
      const grad = ctx.createLinearGradient(
        cx,
        cy,
        cx + Math.cos(sweep) * R,
        cy + Math.sin(sweep) * R,
      );
      grad.addColorStop(0, white(0));
      grad.addColorStop(1, white(0.28));
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweep) * R * 0.7, cy + Math.sin(sweep) * R * 0.7);
      ctx.lineWidth = 1;
      ctx.strokeStyle = grad;
      ctx.stroke();

      // --- INNER RADIAL BARS: tiny telemetry stub inside the dial, used sparingly ---
      drawRadialBars(ctx, { cx, cy, t, count: 24, inner: R * 0.18, alpha: 0.14, accent: A });

      // central hub
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, TAU);
      ctx.fillStyle = white(0.7);
      ctx.fill();

      // --- SATELLITE READOUT DOTS: status nodes on an outer ring, one alarming ---
      const ringR = R * 1.18;
      const alarm = Math.floor(t * 0.2) % sats; // which satellite is "active" cycles slowly
      for (let i = 0; i < sats; i += 1) {
        const a = (TAU * i) / sats - TAU / 4 + t * 0.05;
        const sx = cx + Math.cos(a) * ringR;
        const sy = cy + Math.sin(a) * ringR;
        const blink = 0.4 + Math.sin(t * 2 + i * 1.7) * 0.3;
        const isAlarm = i === alarm;
        ctx.beginPath();
        ctx.arc(sx, sy, isAlarm ? 2.6 : 1.6, 0, TAU);
        ctx.fillStyle = isAlarm ? A(0.5 + blink * 0.5) : white(0.12 + hash(i + 3) * 0.18);
        ctx.fill();
        // a short connecting stub back toward the dial
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * R * 1.04, cy + Math.sin(a) * R * 1.04);
        ctx.lineTo(sx, sy);
        ctx.lineWidth = 1;
        ctx.strokeStyle = isAlarm ? A(0.2) : white(0.05);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
