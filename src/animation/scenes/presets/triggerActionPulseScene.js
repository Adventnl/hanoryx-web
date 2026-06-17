/* TRIGGER ACTION PULSE — trigger nodes on the left fire pulses along rule-lines (some branching)
   to action nodes on the right, which flash red on arrival; a cause-and-effect automation rhythm. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('trigger-action-pulse', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;

  // rules: each links one trigger (left) to one or two actions (right). built deterministically.
  let triggers = [];
  let actions = [];
  let rules = [];

  const build = (w, h) => {
    W = w;
    H = h;
    const scale = quality === 'low' || quality === 'static' ? 0.6 : quality === 'medium' ? 0.85 : 1;
    const nT = Math.max(3, Math.round(4 * scale * density));
    const nA = Math.max(4, Math.round(6 * scale * density));

    const tx = W * 0.16;
    const ax = W * 0.84;
    const padY = H * 0.12;
    const spanY = H - padY * 2;

    triggers = new Array(nT);
    for (let i = 0; i < nT; i += 1) {
      const f = nT === 1 ? 0.5 : i / (nT - 1);
      triggers[i] = {
        x: tx,
        y: padY + spanY * f,
        period: 2.2 + hash(i * 3.7) * 3.4, // seconds between firings
        offset: hash(i * 9.1) * 4,          // stagger so they don't all fire at once
      };
    }

    actions = new Array(nA);
    for (let i = 0; i < nA; i += 1) {
      const f = nA === 1 ? 0.5 : i / (nA - 1);
      actions[i] = {
        x: ax,
        y: padY + spanY * f,
        last: -10, // last arrival time, for flash
      };
    }

    // build rules: each trigger drives 1-2 actions; elbow x sits in a routing channel.
    rules = [];
    for (let i = 0; i < nT; i += 1) {
      const branch = hash(i * 5.3 + 2.1) > 0.55 && nA > 1;
      const a0 = Math.floor(hash(i * 7.7 + 0.4) * nA) % nA;
      const a1 = (a0 + 1 + Math.floor(hash(i * 2.9 + 6.6) * (nA - 1))) % nA;
      const elbow = W * (0.4 + hash(i * 4.1 + 1.7) * 0.18);
      const accentRule = hash(i * 11.3 + 3.3) > 0.62;
      rules.push({ t: i, a: a0, elbow, branch, fork: branch ? a1 : -1, accent: accentRule });
    }
  };
  build(width, height);

  // draw an orthogonal rule path: trigger -> down/up the routing channel -> into the action.
  // returns the cumulative length so we can place a pulse along it by fraction.
  const pathPoints = (tr, ac, elbow) => {
    // [start, channel-enter, channel-exit, end]
    return [
      tr.x, tr.y,
      elbow, tr.y,
      elbow, ac.y,
      ac.x, ac.y,
    ];
  };

  const segLen = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      // pointer warps the routing-channel elbow slightly, nudging the whole rule fabric.
      const warp = p.active ? (p.nx || 0) * W * 0.05 : 0;

      // --- static rule lines (faint white skeleton) ---
      ctx.lineWidth = 1;
      for (let r = 0; r < rules.length; r += 1) {
        const rule = rules[r];
        const tr = triggers[rule.t];
        const targets = rule.branch ? [rule.a, rule.fork] : [rule.a];
        ctx.strokeStyle = white(0.08);
        for (let k = 0; k < targets.length; k += 1) {
          const ac = actions[targets[k]];
          const pts = pathPoints(tr, ac, rule.elbow + warp);
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          ctx.lineTo(pts[2], pts[3]);
          ctx.lineTo(pts[4], pts[5]);
          ctx.lineTo(pts[6], pts[7]);
          ctx.stroke();
        }
      }

      // --- pulses travelling along rules + action flash bookkeeping ---
      for (let r = 0; r < rules.length; r += 1) {
        const rule = rules[r];
        const tr = triggers[rule.t];

        // firing cycle for this trigger
        const cyc = (t + tr.offset) / tr.period;
        const phase = cyc - Math.floor(cyc); // 0..1 within current firing
        const travel = 0.55; // fraction of the period the pulse is in flight
        const inFlight = phase < travel;
        const prog = clamp(phase / travel, 0, 1); // 0..1 along the path
        const eased = prog; // linear travel reads as constant-speed signal

        const targets = rule.branch ? [rule.a, rule.fork] : [rule.a];
        const pulseCol = rule.accent ? A : white;

        for (let k = 0; k < targets.length; k += 1) {
          const ac = actions[targets[k]];
          const pts = pathPoints(tr, ac, rule.elbow + warp);

          // total path length over 3 segments
          const l0 = segLen(pts[0], pts[1], pts[2], pts[3]);
          const l1 = segLen(pts[2], pts[3], pts[4], pts[5]);
          const l2 = segLen(pts[4], pts[5], pts[6], pts[7]);
          const total = l0 + l1 + l2;

          // mark arrival for the action flash
          if (inFlight && eased > 0.985) ac.last = t;

          if (!inFlight) continue;

          // locate pulse position by distance along path
          const d = eased * total;
          let px2, py2;
          if (d <= l0) {
            const f = l0 === 0 ? 0 : d / l0;
            px2 = lerp(pts[0], pts[2], f);
            py2 = lerp(pts[1], pts[3], f);
          } else if (d <= l0 + l1) {
            const f = l1 === 0 ? 0 : (d - l0) / l1;
            px2 = lerp(pts[2], pts[4], f);
            py2 = lerp(pts[3], pts[5], f);
          } else {
            const f = l2 === 0 ? 0 : (d - l0 - l1) / l2;
            px2 = lerp(pts[4], pts[6], f);
            py2 = lerp(pts[5], pts[7], f);
          }

          // lit trail: redraw the path up to the pulse, brighter
          ctx.strokeStyle = pulseCol === A ? A(0.3) : white(0.22);
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          if (d > l0) { ctx.lineTo(pts[2], pts[3]); } else { ctx.lineTo(px2, py2); ctx.stroke(); }
          if (d > l0) {
            if (d > l0 + l1) { ctx.lineTo(pts[4], pts[5]); ctx.lineTo(px2, py2); }
            else { ctx.lineTo(px2, py2); }
            ctx.stroke();
          }

          // pulse head
          ctx.fillStyle = pulseCol(0.95);
          ctx.beginPath();
          ctx.arc(px2, py2, 2.6, 0, TAU);
          ctx.fill();
          // soft halo
          ctx.fillStyle = pulseCol(0.18);
          ctx.beginPath();
          ctx.arc(px2, py2, 5.5, 0, TAU);
          ctx.fill();
        }
      }

      // --- trigger nodes (left): square gates, pulse a ring as they fire ---
      for (let i = 0; i < triggers.length; i += 1) {
        const tr = triggers[i];
        const cyc = (t + tr.offset) / tr.period;
        const phase = cyc - Math.floor(cyc);
        const firing = phase < 0.12;
        const flare = firing ? 1 - phase / 0.12 : 0;

        const s = 7;
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = white(0.5 + flare * 0.4);
        ctx.strokeRect(tr.x - s, tr.y - s, s * 2, s * 2);
        // inner mark
        ctx.fillStyle = firing ? A(0.85) : white(0.3);
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, 2.4, 0, TAU);
        ctx.fill();
        // emission ring on fire
        if (flare > 0) {
          ctx.strokeStyle = A(0.5 * flare);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, s + (1 - flare) * 14, 0, TAU);
          ctx.stroke();
        }
      }

      // --- action nodes (right): circles that flash red on pulse arrival ---
      for (let i = 0; i < actions.length; i += 1) {
        const ac = actions[i];
        const since = t - ac.last;
        const flash = since < 0.5 ? 1 - since / 0.5 : 0;

        ctx.lineWidth = 1.4;
        ctx.strokeStyle = white(0.3 + flash * 0.5);
        ctx.beginPath();
        ctx.arc(ac.x, ac.y, 6, 0, TAU);
        ctx.stroke();

        // filled core flashes red on arrival
        if (flash > 0) {
          ctx.fillStyle = A(0.85 * flash);
          ctx.beginPath();
          ctx.arc(ac.x, ac.y, 3.4, 0, TAU);
          ctx.fill();
          // expanding confirmation ring
          ctx.strokeStyle = A(0.45 * flash);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(ac.x, ac.y, 6 + (1 - flash) * 12, 0, TAU);
          ctx.stroke();
        } else {
          ctx.fillStyle = white(0.18);
          ctx.beginPath();
          ctx.arc(ac.x, ac.y, 1.8, 0, TAU);
          ctx.fill();
        }
      }
    },
    dispose() {},
  };
});
