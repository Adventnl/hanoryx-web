import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { drawWave, hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

/* CONTACT TRANSMISSION — concentric ping rings emit outward from a source point
   at timed intervals over faint carrier waves, with a few drifting signal motes. */
registerScene('contact-transmission', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width;
  let H = height;
  let cx = W * 0.32;
  let cy = H / 2;
  let maxR = 320;
  let ringCount = 5;
  let moteCount = 14;
  let waveRows = 3;

  const build = (w, h, q = quality) => {
    W = w;
    H = h;
    cx = W * 0.32;
    cy = H * 0.5;
    maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.04;
    const scale = q === 'low' || q === 'static' ? 0.55 : q === 'medium' ? 0.8 : 1;
    ringCount = Math.max(3, Math.round(6 * scale * density));
    moteCount = Math.max(5, Math.round(16 * scale * density));
    waveRows = q === 'static' ? 2 : 3;
  };
  build(width, height);

  return {
    resize: (w, h, q) => build(w, h, q),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};
      // source drifts toward the pointer when present
      const scx = p.active ? lerp(cx, clamp(p.x || cx, 0, W), 0.4) : cx;
      const scy = p.active ? lerp(cy, clamp(p.y || cy, 0, H), 0.4) : cy;

      // faint carrier waves running underneath the field
      drawWave(ctx, {
        w: W,
        h: H,
        t,
        rows: waveRows,
        amp: 16,
        alpha: 0.05,
        accent: A,
      });

      // baseline / horizon guide through the source
      ctx.strokeStyle = white(0.05);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scy);
      ctx.lineTo(W, scy);
      ctx.stroke();

      // concentric transmission rings emitted at intervals (sonar pings)
      const interval = 1.5;
      const travel = maxR / 3.2; // px per second outward
      for (let i = 0; i < ringCount; i += 1) {
        // staggered birth time per ring so pings march outward
        const birth = i * interval;
        const age = ((t - birth) % (ringCount * interval) + ringCount * interval) % (ringCount * interval);
        const r = age * travel;
        if (r > maxR || r < 2) continue;
        const life = clamp(1 - r / maxR, 0, 1);
        const fade = life * life;
        // ring body — mostly white, faint
        ctx.lineWidth = 1 + fade * 0.6;
        ctx.strokeStyle = white(0.04 + fade * 0.16);
        ctx.beginPath();
        ctx.arc(scx, scy, r, 0, TAU);
        ctx.stroke();
        // a single accent leading-edge arc segment on each ring crest
        const seg = lerp(0.5, 0.16, fade);
        const a0 = t * 0.5 + i * 1.7;
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = A(0.45 * fade);
        ctx.beginPath();
        ctx.arc(scx, scy, r, a0, a0 + seg);
        ctx.stroke();
        // crest marker travelling along that arc
        const mx = scx + Math.cos(a0 + seg) * r;
        const my = scy + Math.sin(a0 + seg) * r;
        ctx.fillStyle = A(0.7 * fade);
        ctx.beginPath();
        ctx.arc(mx, my, 1.6, 0, TAU);
        ctx.fill();
      }

      // drifting signal motes pulled gently toward the source
      for (let m = 0; m < moteCount; m += 1) {
        const seed = hash(m * 4.1);
        const seed2 = hash(m * 7.7 + 3);
        const ang = seed * TAU + t * (0.04 + seed2 * 0.05) * (m % 2 ? 1 : -1);
        const orbit = (0.22 + seed2 * 0.72) * maxR;
        // slow breathing radius so motes ride the transmission outward/in
        const breathe = Math.sin(t * 0.5 + m * 1.3) * 0.08 + 1;
        const mr = orbit * breathe;
        const x = scx + Math.cos(ang) * mr;
        const y = scy + Math.sin(ang) * mr * 0.78;
        if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
        const tw = Math.sin(t * 2 + m * 2.1) * 0.5 + 0.5;
        const r = 0.8 + seed * 1.3;
        const hot = seed2 > 0.82;
        ctx.fillStyle = hot ? A(0.4 + tw * 0.5) : white(0.18 + tw * 0.32);
        ctx.beginPath();
        ctx.arc(x, y, r + tw * 0.8, 0, TAU);
        ctx.fill();
        // faint tether back toward the source for the hot motes
        if (hot) {
          ctx.strokeStyle = A(0.08 * tw);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(lerp(x, scx, 0.4), lerp(y, scy, 0.4));
          ctx.stroke();
        }
      }

      // emitting source — pulsing core with halo synced to ping interval
      const phase = (t % interval) / interval;
      const emit = Math.pow(1 - phase, 2);
      ctx.beginPath();
      ctx.arc(scx, scy, 6 + emit * 14, 0, TAU);
      ctx.fillStyle = A(0.05 + emit * 0.1);
      ctx.fill();
      ctx.strokeStyle = white(0.16);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(scx, scy, 7 + emit * 5, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(scx, scy, 3, 0, TAU);
      ctx.fillStyle = A(0.85);
      ctx.fill();
    },
    dispose() {},
  };
});
