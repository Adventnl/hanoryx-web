import { Sim } from '../Sim';
import { TAU, at, dot, line, pick, prune, rnd, soft, wipe } from '../draw';
import c from './drift.module.css';

/* ============================================================
   43 · DRIFT — particles, stars and rain.
   The still side is a spiral of dots that winds up as the scroll advances.
   Each of the forty-two specimens is a small particle system drawn on its own
   canvas. A system only runs while it is on screen, and under reduced motion it
   draws one settled frame and stops. Where the pointer matters it is the
   pointer (or the arrow keys, with Enter to act), so a keyboard reaches them all.
   ============================================================ */

const ARMS = 3;
function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.spiral}>
        {Array.from({ length: 63 }, (_, k) => <i key={k} style={{ '--a': (k % ARMS) * (360 / ARMS) + k * 14, '--r': 2.2 + k * 0.68, '--s': 0.6 + (k % 5) * 0.22, '--k': k }} />)}
      </div>
      <small>63 PARTICLES · 3 ARMS</small>
    </div>
  );
}

/* ================= the systems ================= */
const SIMS = [];
const add = (name, label, mode, setup, tick) => SIMS.push([name, label, mode, setup, tick]);

/* 01-02 starfields share one engine */
const starSetup = () => ({ s: Array.from({ length: 70 }, () => ({ x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(0.05, 1) })) });
const starTick = (speed, streak) => (S, dt) => {
  wipe(S, 0.35);
  const v = typeof speed === 'function' ? speed(S) : speed;
  S.st.s.forEach((p) => {
    const px = S.w / 2 + (p.x / p.z) * S.w * 0.18;
    const py = S.h / 2 + (p.y / p.z) * S.h * 0.18;
    p.z -= dt * v * 0.3;
    if (p.z <= 0.03 || px < 0 || px > S.w || py < 0 || py > S.h) { p.x = rnd(-1, 1); p.y = rnd(-1, 1); p.z = 1; return; }
    const nx = S.w / 2 + (p.x / p.z) * S.w * 0.18;
    const ny = S.h / 2 + (p.y / p.z) * S.h * 0.18;
    line(S.ctx, px, py, px + (nx - px) * streak, py + (ny - py) * streak, `rgba(255,255,255,${Math.min(1, 1.1 - p.z)})`, 0.6 + (1 - p.z) * 1.2);
  });
};
add('Star drift', 'A starfield drifting past', 'auto', starSetup, starTick(1, 2));
add('Warp speed', 'Stars streaking; the pointer sets the speed', 'hover', starSetup, starTick((S) => (S.in.has ? 0.3 + (S.in.x / S.w) * 5 : 2.2), 6));

/* 03 twinkle */
add('Twinkle sky', 'A sky of twinkling stars', 'auto',
  (S) => ({ s: Array.from({ length: 80 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), r: rnd(0.4, 1.4), p: rnd(0, TAU), f: rnd(1, 3) })) }),
  (S) => { wipe(S); S.st.s.forEach((p) => dot(S.ctx, p.x, p.y, p.r, `rgba(255,255,255,${0.2 + 0.8 * Math.abs(Math.sin(S.t * p.f + p.p))})`)); });

/* 04 galaxy */
add('Galaxy swirl', 'A galaxy with two spiral arms turning', 'auto',
  () => ({ s: Array.from({ length: 200 }, (_, i) => ({ r: Math.pow(Math.random(), 0.7) * 44 + 3, a: (i % 2) * Math.PI + rnd(-0.4, 0.4), j: rnd(-3, 3) })) }),
  (S, dt) => {
    wipe(S, 0.5);
    S.ctx.globalCompositeOperation = 'lighter';
    S.st.s.forEach((p) => {
      p.a += (dt * 1.4) / (0.5 + p.r * 0.05);
      const sw = p.r * 0.09;
      const x = S.w / 2 + Math.cos(p.a + sw) * p.r * 1.8 + p.j;
      const y = S.h / 2 + Math.sin(p.a + sw) * p.r * 0.95 + p.j * 0.5;
      dot(S.ctx, x, y, 0.9, `hsla(${210 - p.r * 3},80%,${70 - p.r * 0.5}%,0.8)`);
    });
    soft(S.ctx, S.w / 2, S.h / 2, 16, 40, 90, 70, 0.8);
  });

/* 05 meteors */
const meteor = (S, x) => S.st.m.push({ x: x ?? rnd(S.w * 0.3, S.w * 1.2), y: rnd(-10, S.h * 0.3), v: rnd(120, 210), l: rnd(18, 34) });
add('Meteor shower', 'A meteor shower; click to send one', 'click',
  () => ({ m: [], n: 0 }),
  (S, dt) => {
    wipe(S, 0.4);
    S.st.n -= dt;
    if (S.st.n <= 0) { meteor(S); S.st.n = rnd(0.3, 0.9); }
    S.poke.splice(0).forEach((p) => meteor(S, p.x + 20));
    S.st.m.forEach((m) => {
      m.x -= m.v * dt * 0.8; m.y += m.v * dt * 0.5;
      const g = S.ctx.createLinearGradient(m.x, m.y, m.x + m.l * 0.85, m.y - m.l * 0.55);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      S.ctx.strokeStyle = g; S.ctx.lineWidth = 1.4; S.ctx.beginPath(); S.ctx.moveTo(m.x, m.y); S.ctx.lineTo(m.x + m.l * 0.85, m.y - m.l * 0.55); S.ctx.stroke();
      if (m.x < -40 || m.y > S.h + 20) m.dead = true;
    });
    prune(S.st.m);
  });

/* 06 orbiting dust */
add('Orbiting dust', 'Dust orbiting a centre that follows the pointer', 'hover',
  () => ({ s: Array.from({ length: 60 }, () => ({ r: rnd(8, 42), a: rnd(0, TAU), w: rnd(0.6, 2.2) })) }),
  (S, dt) => {
    wipe(S, 0.25);
    const o = at(S);
    S.st.s.forEach((p) => { p.a += p.w * dt * (1.2 - p.r / 60); dot(S.ctx, o.x + Math.cos(p.a) * p.r * 1.5, o.y + Math.sin(p.a) * p.r * 0.8, 0.9, `hsla(${30 + p.r * 4},90%,70%,0.85)`); });
    soft(S.ctx, o.x, o.y, 9, 40, 100, 70, 0.7);
  });

/* 07 constellation */
add('Star links', 'Stars that link when they come close; the pointer pulls them', 'hover',
  (S) => ({ s: Array.from({ length: 28 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), vx: rnd(-8, 8), vy: rnd(-8, 8) })) }),
  (S, dt) => {
    wipe(S);
    const p0 = S.in.has ? S.in : null;
    S.st.s.forEach((p) => {
      if (p0) { p.vx += (p0.x - p.x) * dt * 0.4; p.vy += (p0.y - p.y) * dt * 0.4; }
      p.vx *= 0.995; p.vy *= 0.995;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0 || p.x > S.w) p.vx *= -1;
      if (p.y < 0 || p.y > S.h) p.vy *= -1;
    });
    const s = S.st.s;
    for (let i = 0; i < s.length; i += 1) {
      for (let j = i + 1; j < s.length; j += 1) {
        const d = Math.hypot(s[i].x - s[j].x, s[i].y - s[j].y);
        if (d < 40) line(S.ctx, s[i].x, s[i].y, s[j].x, s[j].y, `rgba(255,255,255,${(1 - d / 40) * 0.5})`, 0.6);
      }
      dot(S.ctx, s[i].x, s[i].y, 1.5, '#fff');
    }
  });

/* 08 nebula */
add('Nebula puffs', 'Soft clouds of colour drifting', 'auto',
  (S) => ({ s: Array.from({ length: 7 }, (_, i) => ({ x: rnd(0, S.w), y: rnd(0, S.h), r: rnd(30, 52), h: 260 + i * 25, p: rnd(0, TAU) })) }),
  (S) => { wipe(S); S.ctx.globalCompositeOperation = 'lighter'; S.st.s.forEach((p) => soft(S.ctx, p.x + Math.sin(S.t * 0.4 + p.p) * 14, p.y + Math.cos(S.t * 0.3 + p.p) * 8, p.r, p.h, 80, 55, 0.28)); });

/* 09 rain */
const rainSetup = (S) => ({ s: Array.from({ length: 70 }, () => ({ x: rnd(0, S.w + 20), y: rnd(0, S.h), v: rnd(160, 260), l: rnd(6, 12) })), rip: [] });
add('Rain', 'Rain falling at a slant', 'auto', rainSetup, (S, dt) => {
  wipe(S, 0.5);
  S.st.s.forEach((p) => { p.y += p.v * dt; p.x -= p.v * dt * 0.2; if (p.y > S.h) { p.y = -10; p.x = rnd(0, S.w + 20); } line(S.ctx, p.x, p.y, p.x + p.l * 0.2, p.y - p.l, 'rgba(160,200,255,0.55)', 0.8); });
});

/* 10 window rain */
add('Window rain', 'Drops running down glass; click to add one', 'click',
  (S) => ({ d: Array.from({ length: 14 }, () => ({ x: rnd(4, S.w - 4), y: rnd(0, S.h), r: rnd(1.2, 2.6), v: 0, hold: rnd(0, 3) })), t: [] }),
  (S, dt) => {
    wipe(S, 0.2);
    S.poke.splice(0).forEach((p) => S.st.d.push({ x: p.x, y: p.y, r: 3.2, v: 0, hold: 0 }));
    S.st.d.forEach((d) => {
      d.hold -= dt;
      if (d.hold < 0) { d.v = Math.min(60, d.v + 90 * dt * d.r * 0.3); d.y += d.v * dt; if (Math.random() < 0.02) d.hold = rnd(0.2, 1); }
      if (d.v > 5) line(S.ctx, d.x, d.y, d.x, d.y - d.v * 0.3, 'rgba(160,200,255,0.18)', d.r * 0.6);
      dot(S.ctx, d.x, d.y, d.r, 'rgba(190,220,255,0.55)'); dot(S.ctx, d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.35, 'rgba(255,255,255,0.8)');
      if (d.y > S.h + 10) { d.y = -6; d.v = 0; d.hold = rnd(0.5, 3); d.x = rnd(4, S.w - 4); d.r = rnd(1.2, 2.6); }
    });
    if (S.st.d.length > 30) S.st.d.splice(0, S.st.d.length - 30);
  });

/* 11 splash rain */
add('Splash rain', 'Rain that splashes where it lands', 'auto', rainSetup, (S, dt) => {
  wipe(S, 0.4);
  const g = S.h - 8;
  S.st.s.forEach((p) => {
    p.y += p.v * dt; p.x -= p.v * dt * 0.1;
    if (p.y > g) { S.st.rip.push({ x: p.x, r: 0, a: 0.7 }); p.y = -10; p.x = rnd(0, S.w + 10); }
    line(S.ctx, p.x, p.y, p.x + p.l * 0.1, p.y - p.l, 'rgba(160,200,255,0.5)', 0.8);
  });
  S.st.rip.forEach((r) => { r.r += dt * 30; r.a -= dt * 1.4; if (r.a <= 0) r.dead = true; S.ctx.strokeStyle = `rgba(160,200,255,${r.a})`; S.ctx.lineWidth = 0.8; S.ctx.beginPath(); S.ctx.ellipse(r.x, g + 3, r.r, r.r * 0.3, 0, 0, TAU); S.ctx.stroke(); });
  prune(S.st.rip);
  line(S.ctx, 0, g + 3, S.w, g + 3, 'rgba(160,200,255,0.12)');
});

/* 12-13 snow */
const snowSetup = (S) => ({ s: Array.from({ length: 70 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), r: rnd(0.8, 2.2), v: rnd(10, 30), p: rnd(0, TAU) })) });
add('Snowfall', 'Snow drifting down', 'auto', snowSetup, (S, dt) => {
  wipe(S);
  S.st.s.forEach((p) => { p.y += p.v * dt; p.x += Math.sin(S.t * 1.2 + p.p) * 8 * dt; if (p.y > S.h + 4) { p.y = -4; p.x = rnd(0, S.w); } dot(S.ctx, p.x, p.y, p.r, `rgba(255,255,255,${0.5 + p.r * 0.2})`); });
});
add('Blizzard', 'Snow blown sideways; the pointer sets the wind', 'hover', snowSetup, (S, dt) => {
  wipe(S, 0.5);
  const wind = S.in.has ? (S.in.x / S.w - 0.5) * 260 : Math.sin(S.t * 0.5) * 120;
  S.st.s.forEach((p) => {
    p.x += (wind + Math.sin(S.t + p.p) * 10) * dt * (0.5 + p.r * 0.3); p.y += p.v * dt * 1.4;
    if (p.y > S.h + 4) { p.y = -4; p.x = rnd(0, S.w); }
    if (p.x > S.w + 6) p.x = -6; if (p.x < -6) p.x = S.w + 6;
    line(S.ctx, p.x, p.y, p.x - wind * 0.03, p.y - 2, `rgba(255,255,255,${0.5 + p.r * 0.2})`, p.r);
  });
});

/* 14 mist */
add('Mist drift', 'Banks of mist sliding past', 'auto',
  (S) => ({ s: Array.from({ length: 9 }, () => ({ x: rnd(-20, S.w), y: rnd(S.h * 0.3, S.h), r: rnd(24, 44), v: rnd(4, 12) })) }),
  (S, dt) => { wipe(S); S.st.s.forEach((p) => { p.x += p.v * dt; if (p.x - p.r > S.w) p.x = -p.r; soft(S.ctx, p.x, p.y, p.r, 210, 20, 80, 0.14); }); });

/* 15 lightning */
const bolt = (S, x) => {
  const pts = [[x, 0]];
  let y = 0; let px = x;
  while (y < S.h) { y += rnd(8, 16); px += rnd(-9, 9); pts.push([px, y]); }
  S.st.b = { pts, a: 1 };
  S.st.flash = 0.5;
};
add('Lightning', 'Lightning; click to strike', 'click',
  () => ({ b: null, flash: 0, n: 1 }),
  (S, dt) => {
    wipe(S, 0.5);
    S.st.n -= dt;
    if (S.st.n <= 0) { bolt(S, rnd(S.w * 0.2, S.w * 0.8)); S.st.n = rnd(1.8, 3.6); }
    S.poke.splice(0).forEach((p) => bolt(S, p.x));
    if (S.st.flash > 0) { S.ctx.fillStyle = `rgba(180,200,255,${S.st.flash * 0.6})`; S.ctx.fillRect(0, 0, S.w, S.h); S.st.flash -= dt * 1.6; }
    const b = S.st.b;
    if (b && b.a > 0) {
      S.ctx.strokeStyle = `rgba(220,230,255,${b.a})`; S.ctx.lineWidth = 1.6; S.ctx.shadowColor = '#9db8ff'; S.ctx.shadowBlur = 10;
      S.ctx.beginPath(); b.pts.forEach(([x, y], i) => (i ? S.ctx.lineTo(x, y) : S.ctx.moveTo(x, y))); S.ctx.stroke(); S.ctx.shadowBlur = 0;
      b.a -= dt * 2.4;
    }
  });

/* 16 embers */
add('Embers', 'Embers rising from a fire', 'auto',
  (S) => ({ s: Array.from({ length: 50 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), v: rnd(14, 40), l: rnd(0, 1), r: rnd(0.6, 1.8) })) }),
  (S, dt) => {
    wipe(S, 0.35);
    S.ctx.globalCompositeOperation = 'lighter';
    S.st.s.forEach((p) => { p.y -= p.v * dt; p.x += Math.sin(S.t * 2 + p.v) * 6 * dt; p.l -= dt * 0.35; if (p.l <= 0 || p.y < -4) { p.y = S.h + 4; p.x = rnd(0, S.w); p.l = 1; } dot(S.ctx, p.x, p.y, p.r, `hsla(${12 + p.l * 30},100%,${45 + p.l * 20}%,${p.l})`); });
  });

/* 17 spark burst */
const burst = (S, x, y, n = 26) => { for (let i = 0; i < n; i += 1) { const a = rnd(0, TAU); const v = rnd(20, 90); S.st.s.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, l: 1, h: rnd(20, 55) }); } };
add('Spark burst', 'Sparks bursting; click to set one off', 'click',
  () => ({ s: [], n: 0 }),
  (S, dt) => {
    wipe(S, 0.3);
    S.ctx.globalCompositeOperation = 'lighter';
    S.st.n -= dt;
    if (S.st.n <= 0) { burst(S, rnd(S.w * 0.2, S.w * 0.8), rnd(S.h * 0.3, S.h * 0.7)); S.st.n = 1.4; }
    S.poke.splice(0).forEach((p) => burst(S, p.x, p.y, 34));
    S.st.s.forEach((p) => { p.vy += 120 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt * 0.9; if (p.l <= 0) p.dead = true; line(S.ctx, p.x, p.y, p.x - p.vx * 0.04, p.y - p.vy * 0.04, `hsla(${p.h},100%,65%,${p.l})`, 1.2); });
    prune(S.st.s);
  });

/* 18 fireworks */
const rocket = (S, x) => S.st.r.push({ x, y: S.h, vy: -rnd(90, 120), h: rnd(0, 360), tx: rnd(S.h * 0.15, S.h * 0.45) });
add('Fireworks', 'Fireworks; click to launch one', 'click',
  () => ({ r: [], s: [], n: 0.3 }),
  (S, dt) => {
    wipe(S, 0.28);
    S.ctx.globalCompositeOperation = 'lighter';
    S.st.n -= dt;
    if (S.st.n <= 0) { rocket(S, rnd(S.w * 0.2, S.w * 0.8)); S.st.n = 1.6; }
    S.poke.splice(0).forEach((p) => rocket(S, p.x));
    S.st.r.forEach((r) => {
      r.y += r.vy * dt; dot(S.ctx, r.x, r.y, 1.2, '#fff');
      if (r.y <= r.tx) { r.dead = true; for (let i = 0; i < 36; i += 1) { const a = (i / 36) * TAU; const v = rnd(30, 50); S.st.s.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, h: r.h }); } }
    });
    S.st.s.forEach((p) => { p.vy += 40 * dt; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt * 0.8; if (p.l <= 0) p.dead = true; dot(S.ctx, p.x, p.y, 1.1, `hsla(${p.h},100%,65%,${p.l})`); });
    prune(S.st.r); prune(S.st.s);
  });

/* 19 sparkler */
add('Sparkler', 'A sparkler that trails the pointer', 'hover',
  () => ({ s: [] }),
  (S, dt) => {
    wipe(S, 0.35);
    S.ctx.globalCompositeOperation = 'lighter';
    const o = at(S, 1.6);
    for (let i = 0; i < 3; i += 1) { const a = rnd(0, TAU); const v = rnd(10, 60); S.st.s.push({ x: o.x, y: o.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1 }); }
    S.st.s.forEach((p) => { p.vy += 60 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt * 1.6; if (p.l <= 0) p.dead = true; dot(S.ctx, p.x, p.y, 0.9, `hsla(${40 + p.l * 20},100%,${60 + p.l * 30}%,${p.l})`); });
    prune(S.st.s);
    soft(S.ctx, o.x, o.y, 8, 45, 100, 80, 0.9);
  });

/* 20 fireflies */
add('Fireflies', 'Fireflies wandering and glowing', 'auto',
  (S) => ({ s: Array.from({ length: 14 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), a: rnd(0, TAU), p: rnd(0, TAU), f: rnd(0.6, 1.6) })) }),
  (S, dt) => {
    wipe(S, 0.3);
    S.ctx.globalCompositeOperation = 'lighter';
    S.st.s.forEach((p) => { p.a += rnd(-1.5, 1.5) * dt * 2; p.x += Math.cos(p.a) * 14 * dt; p.y += Math.sin(p.a) * 14 * dt; if (p.x < 0) p.x += S.w; if (p.x > S.w) p.x -= S.w; if (p.y < 0) p.y += S.h; if (p.y > S.h) p.y -= S.h; soft(S.ctx, p.x, p.y, 9, 70, 100, 60, Math.max(0, Math.sin(S.t * p.f + p.p)) * 0.9); });
  });

/* 21 plasma motes */
add('Plasma motes', 'Glowing motes drawn toward the pointer', 'hover',
  (S) => ({ s: Array.from({ length: 40 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), vx: 0, vy: 0, h: rnd(260, 330) })) }),
  (S, dt) => {
    wipe(S, 0.3);
    S.ctx.globalCompositeOperation = 'lighter';
    const o = at(S, 0.8);
    S.st.s.forEach((p) => { const dx = o.x - p.x; const dy = o.y - p.y; const d = Math.hypot(dx, dy) + 8; p.vx += (dx / d) * 120 * dt + rnd(-6, 6); p.vy += (dy / d) * 120 * dt + rnd(-6, 6); p.vx *= 0.97; p.vy *= 0.97; p.x += p.vx * dt; p.y += p.vy * dt; soft(S.ctx, p.x, p.y, 5, p.h, 100, 65, 0.7); });
  });

/* 22 bubbles */
add('Bubbles', 'Bubbles rising and wobbling', 'auto',
  (S) => ({ s: Array.from({ length: 22 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), r: rnd(2, 7), v: rnd(10, 30), p: rnd(0, TAU) })) }),
  (S, dt) => {
    wipe(S);
    S.st.s.forEach((p) => { p.y -= p.v * dt; if (p.y < -10) { p.y = S.h + 10; p.x = rnd(0, S.w); } const x = p.x + Math.sin(S.t * 1.5 + p.p) * 4; S.ctx.strokeStyle = 'rgba(160,220,255,0.6)'; S.ctx.lineWidth = 0.8; S.ctx.beginPath(); S.ctx.arc(x, p.y, p.r, 0, TAU); S.ctx.stroke(); dot(S.ctx, x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.2, 'rgba(255,255,255,0.7)'); });
  });

/* 23 bokeh */
add('Bokeh discs', 'Out-of-focus discs of light', 'auto',
  (S) => ({ s: Array.from({ length: 14 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), r: rnd(6, 18), v: rnd(2, 8), h: rnd(0, 60), p: rnd(0, TAU) })) }),
  (S, dt) => { wipe(S); S.ctx.globalCompositeOperation = 'lighter'; S.st.s.forEach((p) => { p.y -= p.v * dt; if (p.y < -p.r) p.y = S.h + p.r; dot(S.ctx, p.x, p.y, p.r, `hsla(${p.h},90%,60%,${0.1 + Math.abs(Math.sin(S.t * 0.6 + p.p)) * 0.14})`); }); });

/* 24 dust motes */
add('Dust motes', 'Dust turning in a shaft of light', 'auto',
  (S) => ({ s: Array.from({ length: 50 }, () => ({ x: rnd(S.w * 0.2, S.w * 0.8), y: rnd(0, S.h), r: rnd(0.4, 1.3), p: rnd(0, TAU) })) }),
  (S, dt) => {
    wipe(S);
    const g = S.ctx.createLinearGradient(S.w * 0.3, 0, S.w * 0.7, S.h); g.addColorStop(0, 'rgba(255,240,200,0.22)'); g.addColorStop(1, 'rgba(255,240,200,0)');
    S.ctx.fillStyle = g; S.ctx.beginPath(); S.ctx.moveTo(S.w * 0.15, 0); S.ctx.lineTo(S.w * 0.55, 0); S.ctx.lineTo(S.w * 0.95, S.h); S.ctx.lineTo(S.w * 0.45, S.h); S.ctx.fill();
    S.st.s.forEach((p) => { p.y += 4 * dt; p.x += Math.sin(S.t * 0.7 + p.p) * 4 * dt; if (p.y > S.h) p.y = 0; dot(S.ctx, p.x, p.y, p.r, `rgba(255,245,210,${0.3 + Math.abs(Math.sin(S.t + p.p)) * 0.6})`); });
  });

/* 25 pollen */
add('Pollen', 'Pollen floating on a breeze', 'auto',
  (S) => ({ s: Array.from({ length: 36 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), p: rnd(0, TAU), r: rnd(0.8, 1.8) })) }),
  (S, dt) => { wipe(S, 0.4); S.st.s.forEach((p) => { p.x += (14 + Math.sin(S.t * 0.8 + p.p) * 10) * dt; p.y += Math.cos(S.t * 1.1 + p.p * 2) * 12 * dt; if (p.x > S.w + 4) p.x = -4; dot(S.ctx, p.x, p.y, p.r, 'rgba(255,224,120,0.85)'); }); });

/* 26 petals */
add('Petal fall', 'Petals turning as they fall', 'auto',
  (S) => ({ s: Array.from({ length: 22 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), a: rnd(0, TAU), v: rnd(10, 24), w: rnd(-2, 2), s: rnd(2.4, 4.4) })) }),
  (S, dt) => {
    wipe(S);
    S.st.s.forEach((p) => { p.y += p.v * dt; p.x += Math.sin(S.t + p.a) * 10 * dt; p.a += p.w * dt; if (p.y > S.h + 6) { p.y = -6; p.x = rnd(0, S.w); } S.ctx.save(); S.ctx.translate(p.x, p.y); S.ctx.rotate(p.a); S.ctx.scale(1, 0.55 + Math.abs(Math.sin(S.t * 1.5 + p.a)) * 0.45); S.ctx.fillStyle = 'rgba(255,170,200,0.85)'; S.ctx.beginPath(); S.ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, TAU); S.ctx.fill(); S.ctx.restore(); });
  });

/* 27 confetti */
const COLS = ['#ff5a5a', '#ffd43b', '#4ade80', '#60a5fa', '#c084fc', '#fff'];
const pop = (S, x, y, n = 30) => { for (let i = 0; i < n; i += 1) { const a = rnd(-Math.PI, 0); const v = rnd(40, 130); S.st.s.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, a: rnd(0, TAU), w: rnd(-8, 8), col: pick(COLS), l: 1 }); } };
add('Confetti', 'Confetti; click to pop more', 'click',
  () => ({ s: [], n: 0.2 }),
  (S, dt) => {
    wipe(S, 0.6);
    S.st.n -= dt;
    if (S.st.n <= 0) { pop(S, rnd(S.w * 0.25, S.w * 0.75), S.h, 24); S.st.n = 1.8; }
    S.poke.splice(0).forEach((p) => pop(S, p.x, p.y, 36));
    S.st.s.forEach((p) => { p.vy += 130 * dt; p.vx *= 0.99; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.w * dt; p.l -= dt * 0.35; if (p.l <= 0 || p.y > S.h + 6) p.dead = true; S.ctx.save(); S.ctx.translate(p.x, p.y); S.ctx.rotate(p.a); S.ctx.scale(1, Math.abs(Math.cos(p.a * 1.5))); S.ctx.fillStyle = p.col; S.ctx.fillRect(-2, -1.2, 4, 2.4); S.ctx.restore(); });
    prune(S.st.s);
  });

/* 28 ash */
add('Ash fall', 'Grey ash settling', 'auto',
  (S) => ({ s: Array.from({ length: 46 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), v: rnd(6, 16), r: rnd(0.8, 2), p: rnd(0, TAU) })) }),
  (S, dt) => { wipe(S); S.st.s.forEach((p) => { p.y += p.v * dt; p.x += Math.sin(S.t * 0.9 + p.p) * 6 * dt; if (p.y > S.h + 4) { p.y = -4; p.x = rnd(0, S.w); } dot(S.ctx, p.x, p.y, p.r, `rgba(190,190,200,${0.25 + Math.abs(Math.sin(S.t * 2 + p.p)) * 0.4})`); }); });

/* 29 code rain */
const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺ01234789ABCDEFXYZ'.split('');
add('Code rain', 'Columns of glyphs falling', 'auto',
  (S) => ({ cols: Array.from({ length: Math.floor(S.w / 9) }, () => ({ y: rnd(-S.h, 0), v: rnd(30, 80), ch: [] })) }),
  (S, dt) => {
    wipe(S, 0.2);
    S.ctx.font = '9px monospace';
    S.st.cols.forEach((col, i) => {
      col.y += col.v * dt;
      if (Math.random() < 0.3) col.ch = [pick(GLYPHS), ...col.ch].slice(0, 9);
      col.ch.forEach((g, k) => { S.ctx.fillStyle = k === 0 ? '#e6ffe6' : `rgba(60,220,120,${1 - k / 9})`; S.ctx.fillText(g, i * 9, col.y - k * 9); });
      if (col.y - 80 > S.h) { col.y = rnd(-30, 0); col.v = rnd(30, 80); }
    });
  });

/* 30 data stream */
add('Data stream', 'Packets of data streaming sideways', 'auto',
  (S) => ({ s: Array.from({ length: 26 }, () => ({ x: rnd(0, S.w), y: Math.round(rnd(0, S.h) / 6) * 6, v: rnd(30, 120), l: rnd(6, 20) })) }),
  (S, dt) => { wipe(S, 0.5); S.st.s.forEach((p) => { p.x += p.v * dt; if (p.x - p.l > S.w) { p.x = 0; p.y = Math.round(rnd(0, S.h) / 6) * 6; } const g = S.ctx.createLinearGradient(p.x - p.l, 0, p.x, 0); g.addColorStop(0, 'rgba(96,165,250,0)'); g.addColorStop(1, 'rgba(160,210,255,0.95)'); S.ctx.fillStyle = g; S.ctx.fillRect(p.x - p.l, p.y, p.l, 2); }); });

/* 31 flocking */
add('Flocking', 'A flock that turns together and follows the pointer', 'hover',
  (S) => ({ s: Array.from({ length: 34 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), vx: rnd(-30, 30), vy: rnd(-30, 30) })) }),
  (S, dt) => {
    wipe(S, 0.35);
    const b = S.st.s;
    b.forEach((p) => {
      let ax = 0; let ay = 0; let cx = 0; let cy = 0; let n = 0;
      b.forEach((q) => { if (q === p) return; const dx = q.x - p.x; const dy = q.y - p.y; const d = Math.hypot(dx, dy); if (d < 36) { ax += q.vx; ay += q.vy; cx += q.x; cy += q.y; n += 1; if (d < 10) { p.vx -= dx * 0.4; p.vy -= dy * 0.4; } } });
      if (n) { p.vx += ((ax / n - p.vx) * 0.6 + (cx / n - p.x) * 0.4) * dt * 2; p.vy += ((ay / n - p.vy) * 0.6 + (cy / n - p.y) * 0.4) * dt * 2; }
      if (S.in.has) { p.vx += (S.in.x - p.x) * dt * 0.8; p.vy += (S.in.y - p.y) * dt * 0.8; }
      const sp = Math.hypot(p.vx, p.vy) || 1; const k = Math.min(1.4, Math.max(0.6, 46 / sp)); p.vx *= k > 1 ? 1 + (k - 1) * dt * 3 : 1 - (1 - k) * dt * 3; p.vy *= k > 1 ? 1 + (k - 1) * dt * 3 : 1 - (1 - k) * dt * 3;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0) p.x = S.w; if (p.x > S.w) p.x = 0; if (p.y < 0) p.y = S.h; if (p.y > S.h) p.y = 0;
      const a = Math.atan2(p.vy, p.vx);
      S.ctx.fillStyle = '#fff'; S.ctx.beginPath(); S.ctx.moveTo(p.x + Math.cos(a) * 4, p.y + Math.sin(a) * 4); S.ctx.lineTo(p.x + Math.cos(a + 2.5) * 3, p.y + Math.sin(a + 2.5) * 3); S.ctx.lineTo(p.x + Math.cos(a - 2.5) * 3, p.y + Math.sin(a - 2.5) * 3); S.ctx.fill();
    });
  });

/* 32 swarm */
add('Swarm chase', 'A swarm chasing the pointer', 'hover',
  (S) => ({ s: Array.from({ length: 36 }, (_, i) => ({ x: rnd(0, S.w), y: rnd(0, S.h), k: 0.6 + (i % 6) * 0.35 })) }),
  (S, dt) => { wipe(S, 0.3); const o = at(S, 1.2); S.st.s.forEach((p) => { p.x += (o.x - p.x) * dt * p.k + rnd(-1.2, 1.2); p.y += (o.y - p.y) * dt * p.k + rnd(-1.2, 1.2); dot(S.ctx, p.x, p.y, 1.3, `hsla(${200 + p.k * 40},90%,70%,0.9)`); }); });

/* 33 vortex */
add('Vortex', 'Particles spiralling into the pointer', 'hover',
  () => ({ s: Array.from({ length: 80 }, () => ({ a: rnd(0, TAU), r: rnd(6, 70) })) }),
  (S, dt) => {
    wipe(S, 0.2);
    const o = at(S, 0.7);
    S.st.s.forEach((p) => { p.a += (60 / (p.r + 10)) * dt * 2; p.r -= 8 * dt; if (p.r < 2) { p.r = rnd(50, 80); p.a = rnd(0, TAU); } dot(S.ctx, o.x + Math.cos(p.a) * p.r * 1.4, o.y + Math.sin(p.a) * p.r * 0.8, 1, `hsla(${180 + p.r * 2},90%,70%,${Math.min(1, p.r / 20)})`); });
  });

/* 34 gravity wells */
add('Gravity wells', 'Particles orbiting wells; click to place one', 'click',
  (S) => ({ w: [{ x: S.w * 0.5, y: S.h * 0.5 }], s: Array.from({ length: 50 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h), vx: rnd(-20, 20), vy: rnd(-20, 20) })) }),
  (S, dt) => {
    wipe(S, 0.25);
    S.poke.splice(0).forEach((p) => { S.st.w.push({ x: p.x, y: p.y }); if (S.st.w.length > 3) S.st.w.shift(); });
    S.st.s.forEach((p) => {
      S.st.w.forEach((w) => { const dx = w.x - p.x; const dy = w.y - p.y; const d2 = Math.max(100, dx * dx + dy * dy); const f = 9000 / d2; p.vx += (dx / Math.sqrt(d2)) * f * dt; p.vy += (dy / Math.sqrt(d2)) * f * dt; });
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0 || p.x > S.w || p.y < 0 || p.y > S.h) { p.x = rnd(0, S.w); p.y = rnd(0, S.h); p.vx = rnd(-20, 20); p.vy = rnd(-20, 20); }
      dot(S.ctx, p.x, p.y, 1.1, 'rgba(255,255,255,0.85)');
    });
    S.st.w.forEach((w) => { S.ctx.strokeStyle = 'rgba(255,90,90,0.7)'; S.ctx.lineWidth = 1; S.ctx.beginPath(); S.ctx.arc(w.x, w.y, 5, 0, TAU); S.ctx.stroke(); dot(S.ctx, w.x, w.y, 2, '#ff5a5a'); });
  });

/* 35 bouncing balls */
add('Bouncing balls', 'Balls bouncing; click to drop another', 'click',
  (S) => ({ s: Array.from({ length: 3 }, (_, i) => ({ x: S.w * (0.25 + i * 0.25), y: S.h * 0.3, vx: rnd(-30, 30), vy: 0, r: 5 + i * 1.5, h: i * 70 })) }),
  (S, dt) => {
    wipe(S, 0.35);
    S.poke.splice(0).forEach((p) => { S.st.s.push({ x: p.x, y: p.y, vx: rnd(-40, 40), vy: -40, r: rnd(3, 7), h: rnd(0, 360) }); if (S.st.s.length > 9) S.st.s.shift(); });
    S.st.s.forEach((b) => { b.vy += 260 * dt; b.x += b.vx * dt; b.y += b.vy * dt; if (b.y > S.h - b.r) { b.y = S.h - b.r; b.vy *= -0.82; if (Math.abs(b.vy) < 24) b.vy = -rnd(120, 190); } if (b.x < b.r || b.x > S.w - b.r) { b.vx *= -1; b.x = Math.min(S.w - b.r, Math.max(b.r, b.x)); } dot(S.ctx, b.x, b.y, b.r, `hsl(${b.h},80%,62%)`); });
  });

/* 36 spring grid */
add('Spring grid', 'A grid of dots on springs that the pointer pushes away', 'hover',
  (S) => ({ s: Array.from({ length: 40 }, (_, i) => { const x = 12 + (i % 8) * ((S.w - 24) / 7); const y = 12 + Math.floor(i / 8) * ((S.h - 24) / 4); return { ox: x, oy: y, x, y, vx: 0, vy: 0 }; }) }),
  (S, dt) => {
    wipe(S);
    const o = S.in.has ? S.in : { x: -99, y: -99 };
    S.st.s.forEach((p) => {
      const dx = p.x - o.x; const dy = p.y - o.y; const d = Math.hypot(dx, dy) || 1;
      if (d < 34) { p.vx += (dx / d) * (34 - d) * 30 * dt; p.vy += (dy / d) * (34 - d) * 30 * dt; }
      p.vx += (p.ox - p.x) * 40 * dt; p.vy += (p.oy - p.y) * 40 * dt; p.vx *= 0.88; p.vy *= 0.88; p.x += p.vx * dt * 10; p.y += p.vy * dt * 10;
      line(S.ctx, p.ox, p.oy, p.x, p.y, 'rgba(255,255,255,0.12)', 0.6); dot(S.ctx, p.x, p.y, 1.6, '#fff');
    });
  });

/* 37 magnet dust */
add('Iron filings', 'Iron filings turning toward the pointer', 'hover',
  (S) => ({ s: Array.from({ length: 12 * 7 }, (_, i) => ({ x: 8 + (i % 12) * ((S.w - 16) / 11), y: 8 + Math.floor(i / 12) * ((S.h - 16) / 6), a: rnd(0, Math.PI) })) }),
  (S, dt) => {
    wipe(S);
    const o = at(S, 0.9);
    S.st.s.forEach((p) => { const t = Math.atan2(o.y - p.y, o.x - p.x); let d = t - p.a; d = Math.atan2(Math.sin(d), Math.cos(d)); p.a += d * Math.min(1, dt * 6); line(S.ctx, p.x - Math.cos(p.a) * 5, p.y - Math.sin(p.a) * 5, p.x + Math.cos(p.a) * 5, p.y + Math.sin(p.a) * 5, 'rgba(210,214,230,0.8)', 1); });
    dot(S.ctx, o.x, o.y, 3, '#ff5a5a');
  });

/* 38 flow field */
add('Flow field', 'Particles following a curling field', 'auto',
  (S) => ({ s: Array.from({ length: 80 }, () => ({ x: rnd(0, S.w), y: rnd(0, S.h) })) }),
  (S, dt) => {
    wipe(S, 0.08);
    S.st.s.forEach((p) => { const a = (Math.sin(p.x * 0.035 + S.t * 0.3) + Math.cos(p.y * 0.04 - S.t * 0.2)) * Math.PI; const nx = p.x + Math.cos(a) * 34 * dt; const ny = p.y + Math.sin(a) * 34 * dt; line(S.ctx, p.x, p.y, nx, ny, 'rgba(110,200,255,0.8)', 0.9); p.x = nx; p.y = ny; if (p.x < 0 || p.x > S.w || p.y < 0 || p.y > S.h || Math.random() < 0.004) { p.x = rnd(0, S.w); p.y = rnd(0, S.h); } });
  });

/* 39 smoke */
add('Smoke wisps', 'Smoke rising and spreading', 'auto',
  () => ({ s: [], n: 0 }),
  (S, dt) => {
    wipe(S, 0.5);
    S.st.n -= dt;
    if (S.st.n <= 0) { S.st.s.push({ x: S.w / 2 + rnd(-4, 4), y: S.h + 6, r: 4, l: 1, d: rnd(-8, 8) }); S.st.n = 0.12; }
    S.st.s.forEach((p) => { p.y -= 22 * dt; p.x += (p.d + Math.sin(S.t + p.y * 0.05) * 6) * dt; p.r += 12 * dt; p.l -= dt * 0.35; if (p.l <= 0) p.dead = true; soft(S.ctx, p.x, p.y, p.r, 220, 8, 70, p.l * 0.16); });
    prune(S.st.s);
  });

/* 40 sand */
add('Sand stream', 'A stream of sand building a pile', 'auto',
  () => ({ s: [], pile: 2, n: 0 }),
  (S, dt) => {
    wipe(S);
    S.st.n -= dt;
    if (S.st.n <= 0) { S.st.s.push({ x: S.w / 2 + rnd(-1, 1), y: 0, v: rnd(80, 120) }); S.st.n = 0.02; }
    const top = S.h - S.st.pile;
    S.st.s.forEach((p) => { p.y += p.v * dt; if (p.y >= top) { p.dead = true; S.st.pile += 0.05; if (S.st.pile > S.h * 0.8) S.st.pile = 2; } else dot(S.ctx, p.x, p.y, 0.8, '#e8c98a'); });
    prune(S.st.s);
    S.ctx.fillStyle = '#c9a86a'; S.ctx.beginPath(); S.ctx.moveTo(S.w / 2 - S.st.pile * 1.6, S.h); S.ctx.lineTo(S.w / 2, top); S.ctx.lineTo(S.w / 2 + S.st.pile * 1.6, S.h); S.ctx.fill();
  });

/* 41 glitter */
add('Glitter', 'Glitter sparkling around the pointer', 'hover',
  () => ({ s: [] }),
  (S, dt) => {
    wipe(S, 0.4);
    S.ctx.globalCompositeOperation = 'lighter';
    const o = at(S, 1.4);
    if (Math.random() < 0.7) S.st.s.push({ x: o.x + rnd(-24, 24), y: o.y + rnd(-18, 18), l: 1, s: rnd(2, 5), h: rnd(30, 330) });
    S.st.s.forEach((p) => { p.l -= dt * 1.4; if (p.l <= 0) p.dead = true; const k = Math.sin(p.l * Math.PI) * p.s; S.ctx.fillStyle = `hsla(${p.h},100%,75%,${p.l})`; S.ctx.beginPath(); S.ctx.moveTo(p.x, p.y - k); S.ctx.lineTo(p.x + k * 0.22, p.y - k * 0.22); S.ctx.lineTo(p.x + k, p.y); S.ctx.lineTo(p.x + k * 0.22, p.y + k * 0.22); S.ctx.lineTo(p.x, p.y + k); S.ctx.lineTo(p.x - k * 0.22, p.y + k * 0.22); S.ctx.lineTo(p.x - k, p.y); S.ctx.lineTo(p.x - k * 0.22, p.y - k * 0.22); S.ctx.fill(); });
    prune(S.st.s);
  });

/* 42 pond ripples */
add('Pond ripples', 'Raindrops making rings on a pond', 'auto',
  () => ({ s: [], n: 0 }),
  (S, dt) => {
    wipe(S, 0.4);
    S.st.n -= dt;
    if (S.st.n <= 0) { S.st.s.push({ x: rnd(10, S.w - 10), y: rnd(10, S.h - 10), r: 0, a: 1 }); S.st.n = rnd(0.3, 0.8); }
    S.st.s.forEach((p) => { p.r += 24 * dt; p.a -= dt * 0.55; if (p.a <= 0) p.dead = true; for (let k = 0; k < 3; k += 1) { S.ctx.strokeStyle = `rgba(150,210,255,${Math.max(0, p.a - k * 0.25)})`; S.ctx.lineWidth = 0.8; S.ctx.beginPath(); S.ctx.ellipse(p.x, p.y, Math.max(0, p.r - k * 5), Math.max(0, (p.r - k * 5) * 0.4), 0, 0, TAU); S.ctx.stroke(); } });
    prune(S.st.s);
  });

const items = SIMS.map(([name, label, mode, setup, tick]) => [name, function System() { return <Sim label={label} mode={mode} setup={setup} tick={tick} />; }, mode]);

export default { Visual, items };
