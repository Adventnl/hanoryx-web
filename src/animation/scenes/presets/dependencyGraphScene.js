/* DEPENDENCY GRAPH — modules in left-to-right layers wired by directed edges (a build DAG);
   a build wave sweeps left to right, compiling each layer: edges fill and node cores ignite in order. */
import { registerScene } from '../../sceneRegistry';
import { accentFn, white } from '../../scenePalette';
import { hash2 } from '../primitives';
import { TAU, clamp, lerp } from '../../easing';

registerScene('dependency-graph', ({ ctx, width, height, quality, accent, density }) => {
  const A = accentFn(accent);
  let W = width, H = height;

  let layers = 5;        // number of left-to-right dependency layers
  let cols = [];         // per-layer node arrays: {x, y, seed}
  let edges = [];        // {a:[li,ni], b:[lj,nj], cx} where cx is mid x for ordering

  const build = (w, h) => {
    W = w;
    H = h;
    const scale = quality === 'static' || quality === 'low' ? 0.65 : quality === 'medium' ? 0.85 : 1;
    layers = Math.max(4, Math.round(6 * scale));

    cols = [];
    const marginX = W * 0.1;
    const span = W - marginX * 2;
    for (let l = 0; l < layers; l += 1) {
      // sources thinner, middle layers fatter — DAG silhouette
      const t = l / (layers - 1);
      const fan = 0.5 + Math.sin(t * Math.PI) * 0.5; // 0.5..1
      const n = Math.max(2, Math.round((2 + fan * 4) * density));
      const lx = marginX + span * t;
      const nodes = [];
      for (let i = 0; i < n; i += 1) {
        const jitter = (hash2(l + 1, i + 1) - 0.5) * (H / (n + 1)) * 0.5;
        const ny = (H * (i + 1)) / (n + 1) + jitter;
        nodes.push({ x: lx, y: ny, seed: hash2(l * 7.3 + 1, i * 3.1 + 2) });
      }
      cols.push(nodes);
    }

    // directed edges: each node depends on 1-2 nodes in the previous layer
    edges = [];
    for (let l = 1; l < layers; l += 1) {
      const prev = cols[l - 1];
      const cur = cols[l];
      for (let i = 0; i < cur.length; i += 1) {
        const fanIn = 1 + Math.floor(hash2(l * 5 + 1, i * 9 + 3) * 2); // 1 or 2
        for (let k = 0; k < fanIn; k += 1) {
          const j = Math.floor(hash2(l + k * 11, i + k * 17) * prev.length) % prev.length;
          const a = prev[j];
          const b = cur[i];
          edges.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: (a.x + b.x) * 0.5 });
        }
      }
    }
  };
  build(width, height);

  const PERIOD = 7.0; // seconds for the build wave to cross the field

  return {
    resize: (w, h) => build(w, h),
    draw({ time, pointer }) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, W, H);
      const p = pointer || {};

      const marginX = W * 0.1;
      const left = marginX;
      const right = W - marginX;
      // build front sweeps left->right then loops
      const phase = (t % PERIOD) / PERIOD;
      let frontX = lerp(left - W * 0.08, right + W * 0.08, phase);
      const band = W * 0.14; // width of the active compile band

      // ---- EDGES: directed, dim until the front passes their midpoint ----
      for (let e = 0; e < edges.length; e += 1) {
        const ed = edges[e];
        // gentle vertical breathing so the lattice feels alive
        const sway = Math.sin(t * 0.5 + ed.cx * 0.01) * 3;
        const ax = ed.ax, ay = ed.ay + sway;
        const bx = ed.bx, by = ed.by + sway;
        const lit = clamp(1 - Math.abs(ed.cx - frontX) / band, 0, 1);
        const built = frontX > ed.cx ? 1 : 0; // already compiled stays faintly drawn

        ctx.lineWidth = lit > 0.5 ? 1.4 : 1;
        ctx.strokeStyle = lit > 0.4
          ? A(0.12 + lit * 0.3)
          : white(0.045 + built * 0.03);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        // slight curve control toward the target for an organic DAG look
        const mx = (ax + bx) * 0.5;
        ctx.bezierCurveTo(mx, ay, mx, by, bx, by);
        ctx.stroke();

        // travelling compile packet riding the lit edge
        if (lit > 0.15) {
          const f = clamp((frontX - ed.cx + band) / (band * 2), 0, 1);
          const px = lerp(ax, bx, f);
          const py = lerp(ay, by, f) + (by - ay) * 0; // along curve approx
          ctx.fillStyle = A(0.5 + lit * 0.5);
          ctx.beginPath();
          ctx.arc(px, py, 1 + lit * 1.4, 0, TAU);
          ctx.fill();
        }
      }

      // ---- NODES: ignite as the front reaches their layer x ----
      for (let l = 0; l < cols.length; l += 1) {
        const nodes = cols[l];
        for (let i = 0; i < nodes.length; i += 1) {
          const nd = nodes[i];
          const sway = Math.sin(t * 0.5 + nd.x * 0.01) * 3;
          const x = nd.x;
          const y = nd.y + sway;
          const lit = clamp(1 - Math.abs(x - frontX) / (band * 0.7), 0, 1);
          const built = frontX > x;

          // module outline — small square (a compiled unit)
          const s = 3.2 + lit * 1.8;
          ctx.lineWidth = 1;
          ctx.strokeStyle = lit > 0.3 ? A(0.3 + lit * 0.4) : white(built ? 0.16 : 0.1);
          ctx.strokeRect(x - s, y - s, s * 2, s * 2);

          // node core: white idle, red ignition pulse as the front hits
          const pulse = lit * (0.6 + Math.sin(t * 6 + nd.seed * TAU) * 0.4);
          if (lit > 0.05) {
            ctx.fillStyle = A(0.4 + pulse * 0.5);
            ctx.beginPath();
            ctx.arc(x, y, 1.4 + pulse * 2.2, 0, TAU);
            ctx.fill();
            // ignition halo ring at the moment of compile
            if (lit > 0.6) {
              ctx.strokeStyle = A(0.25 * (lit - 0.6) * 2.5);
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(x, y, s * 2 + lit * 4, 0, TAU);
              ctx.stroke();
            }
          } else {
            ctx.fillStyle = white(built ? 0.5 : 0.28);
            ctx.beginPath();
            ctx.arc(x, y, 1.3, 0, TAU);
            ctx.fill();
          }
        }
      }

      // ---- BUILD FRONT: vertical scan line, sparse red ----
      const g = ctx.createLinearGradient(frontX - band * 0.5, 0, frontX + band * 0.5, 0);
      g.addColorStop(0, white(0));
      g.addColorStop(0.5, A(0.1));
      g.addColorStop(1, white(0));
      ctx.fillStyle = g;
      ctx.fillRect(frontX - band * 0.5, 0, band, H);

      ctx.strokeStyle = A(0.28);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(frontX, 0);
      ctx.lineTo(frontX, H);
      ctx.stroke();

      // pointer probe: lift the nearest node's layer subtly (interactive inspect)
      if (p.active) {
        ctx.strokeStyle = white(0.08);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 26 + Math.sin(t * 3) * 4, 0, TAU);
        ctx.stroke();
      }
    },
    dispose() {},
  };
});
