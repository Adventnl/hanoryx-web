/* ERROR / SIGNAL LOST (404) — a near-flat heartbeat trace that twitches, glitches
   and drops out into a dead flatline, intermittent horizontal static bands tear
   across the screen, and a faint radar sweep hunts the void but finds nothing. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawRadar, hash, hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('error-signal-lost', ({ ctx, width, height, quality, accent }) => {
  const A = accentFn(accent);
  let W = width, H = height;
  const cycle = 9; // seconds per signal -> dropout -> search loop
  const build = (w, h) => { W = w; H = h; };
  build(width, height);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      const baseY = H * 0.5;
      const phase = (t % cycle) / cycle;            // 0..1 through the loop
      const alive = clamp(1 - (phase - 0.45) * 6, 0, 1) * clamp(phase * 6, 0, 1); // pulse window
      const drop = clamp((phase - 0.5) * 8, 0, 1);  // dead time after dropout
      const seed = Math.floor(t / cycle);           // glitch seed per loop
      const jitter = (1 - alive) * 0.5 + Math.sin(t * 23) * 0.5 + 0.5;

      // --- faint search radar centred, hunting and finding nothing ---
      ctx.save();
      ctx.globalAlpha = 0.4 + drop * 0.4;
      drawRadar(ctx, { cx: W * 0.5, cy: baseY, t: t * 0.7, radius: Math.min(W, H) * 0.42, rings: 4, alpha: 0.05, accent: A });
      ctx.restore();

      // --- intermittent static / tear bands ---
      const bandCount = quality === 'static' || quality === 'low' ? 3 : 5;
      for (let i = 0; i < bandCount; i += 1) {
        const trig = hash2(seed * 7 + i, Math.floor(t * 5));
        if (trig > 0.78) {
          const by = hash(seed * 3 + i * 11) * H;
          const bh = 2 + hash(i * 5 + seed) * 10;
          const slip = (hash2(i, Math.floor(t * 9)) - 0.5) * 30;
          ctx.fillStyle = white(0.04 + hash(i) * 0.05);
          ctx.fillRect(0, by, W, bh);
          ctx.fillStyle = A(0.12);
          ctx.fillRect(slip, by + bh * 0.4, W, 1.2);
        }
      }

      // --- baseline / dead axis ---
      ctx.strokeStyle = white(0.06);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(W, baseY);
      ctx.stroke();

      // --- the trace: scans L->R; mostly flat, one heartbeat spike, then dropout ---
      const step = W > 1200 ? 5 : 4;
      const spikeX = W * 0.5 + Math.sin(seed) * W * 0.05;
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = white(0.5 - drop * 0.4);
      ctx.beginPath();
      let broke = false;
      for (let x = 0; x <= W; x += step) {
        const fx = x / W;
        let y = baseY;

        // single heartbeat spike near centre, only while alive
        const d = (x - spikeX) / 14;
        if (Math.abs(d) < 3) {
          y -= Math.exp(-d * d) * H * 0.22 * alive;
          y += Math.exp(-(d - 1.2) * (d - 1.2)) * H * 0.09 * alive; // small rebound dip
        }

        // micro line noise that grows as the signal degrades
        y += (hash2(Math.floor(x * 0.5), seed) - 0.5) * (1 + (1 - alive) * 4);

        // dropout: trace tears apart into broken segments on the right side
        if (drop > 0.2 && fx > 0.5 + (1 - drop) * 0.5) {
          const gap = hash2(Math.floor(x / 18), seed * 2) > 0.55 * (1 + drop);
          if (gap) {
            y += (hash2(Math.floor(x / 6), seed) - 0.5) * H * 0.05 * jitter;
            if (!broke) { ctx.moveTo(x, y); broke = true; continue; }
          } else if (broke) {
            ctx.stroke();
            ctx.beginPath();
            broke = false;
          }
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // --- moving read head following the scan, dimming on dropout ---
      const headF = (t * 0.18) % 1;
      const hx = headF * W;
      const onSpike = Math.abs(hx - spikeX) < 18 && alive > 0.4;
      ctx.fillStyle = onSpike ? A(0.9) : white(0.18 * (1 - drop));
      ctx.beginPath();
      ctx.arc(hx, baseY, onSpike ? 3.4 : 2, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = white(0.05 * (1 - drop));
      ctx.beginPath();
      ctx.moveTo(hx, 0);
      ctx.lineTo(hx, H);
      ctx.stroke();

      // --- "NO SIGNAL" red marker pulse during dead time (sparse accent) ---
      if (drop > 0.5) {
        const flick = (Math.sin(t * 11 + seed) * 0.5 + 0.5);
        const r = 4 + flick * 4;
        ctx.strokeStyle = A(0.3 + flick * 0.4);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(W * 0.5, baseY, r + 8, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = A(0.5 + flick * 0.4);
        ctx.beginPath();
        ctx.arc(W * 0.5, baseY, 2.2, 0, TAU);
        ctx.fill();
      }

      // --- pointer-driven local distortion: drags a small spike of static ---
      if (p.active) {
        const py = clamp(p.y || baseY, 0, H);
        ctx.strokeStyle = white(0.1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = (p.x || 0) - 60; x <= (p.x || 0) + 60; x += 4) {
          const n = (hash2(Math.floor(x), Math.floor(t * 8)) - 0.5);
          const fall = clamp(1 - Math.abs(x - (p.x || 0)) / 60, 0, 1);
          const y = lerp(baseY, py, fall) + n * 14 * fall;
          if (x <= (p.x || 0) - 60) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
