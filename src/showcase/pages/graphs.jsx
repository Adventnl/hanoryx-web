import { useEffect, useRef, useState } from 'react';
import { useDrag, useLive, rng, clamp } from '../hooks';
import { useScan, useCell, polar, f1 } from '../kit';
import c from './graphs.module.css';

/* ============================================================
   10 · GRAPHS — nodes, trees and flows that grow.
   A spine runs down the middle of the page and specimens branch off it. The disc
   that rides the spine is a graph of its own: thirty-one nodes appear one by one
   as you scroll, each link drawing itself from its parent, and the counters in
   the middle are written by CSS. Everything below is a graph of some kind —
   trees, networks, flows, fractals — drawn from fixed data, so it is the same
   on every render.
   ============================================================ */

/* ---- the growing graph on the spine ---- */
const GROW = (() => {
  const nodes = [{ x: 50, y: 50, parent: -1 }];
  for (let i = 0; i < 6; i += 1) { const [x, y] = polar(50, 50, 17, i * 60 + 20); nodes.push({ x, y, parent: 0 }); }
  for (let i = 0; i < 6; i += 1) {
    for (let k = 0; k < 4; k += 1) { const [x, y] = polar(50, 50, 37 + (k % 2) * 4, i * 60 + 20 + (k - 1.5) * 13); nodes.push({ x, y, parent: 1 + i }); }
  }
  return nodes;
})();

function Visual() {
  return (
    <div className={c.grow} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <g className={c.growTurn}>
          {GROW.map((n, i) => (n.parent < 0 ? null : (
            <line key={`e${i}`} className={c.gEdge} style={{ '--i': i }} pathLength="1" x1={GROW[n.parent].x} y1={GROW[n.parent].y} x2={n.x} y2={n.y} />
          )))}
          {GROW.map((n, i) => <circle key={i} className={c.gNode} data-tier={i === 0 ? 0 : i < 7 ? 1 : 2} style={{ '--i': i }} cx={n.x} cy={n.y} r={i === 0 ? 3.4 : i < 7 ? 2.4 : 1.7} />)}
        </g>
      </svg>
      <p className={c.counts}><span><b className={c.nNodes} />nodes</span><span><b className={c.nLinks} />links</span></p>
    </div>
  );
}

/* ---- helpers ---- */
const layoutTree = (root) => {
  let leaf = 0;
  const nodes = [];
  const walk = (n, depth, parent) => {
    const me = { n, depth, parent, x: 0, kids: [] };
    nodes.push(me);
    if (!n.kids || !n.kids.length) { me.x = leaf; leaf += 1; } else {
      me.kids = n.kids.map((k) => walk(k, depth + 1, me));
      me.x = (me.kids[0].x + me.kids[me.kids.length - 1].x) / 2;
    }
    return me;
  };
  walk(root, 0, null);
  return { nodes, leaves: leaf, depth: Math.max(...nodes.map((d) => d.depth)) };
};

function Legend({ items, hot, setHot, sticky = false }) {
  return (
    <ul className={c.legend}>
      {items.map((name, i) => (
        <li key={name}>
          <button type="button" data-hot={hot === i} onPointerEnter={sticky ? undefined : () => setHot(i)} onPointerLeave={sticky ? undefined : () => setHot(-1)} onFocus={sticky ? undefined : () => setHot(i)} onBlur={sticky ? undefined : () => setHot(-1)} onClick={() => setHot(i)}>
            <b style={{ '--k': i }} />{name}
          </button>
        </li>
      ))}
    </ul>
  );
}

/* a node label: a rounded box with text */
function Box({ x, y, w = 12, h = 5.4, label, hot, ...rest }) {
  return (
    <g className={c.box} data-hot={hot} {...rest}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="1.4" />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central">{label}</text>
    </g>
  );
}

/* 1 */ const SP_NODES = [[50, 50], [24, 28], [76, 28], [18, 66], [82, 66], [50, 14], [50, 86], [34, 52], [66, 52]];
const SP_EDGES = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 6], [0, 7], [0, 8], [7, 1], [8, 2]];
function SpringGraph() {
  const live = useLive();
  const svg = useRef(null);
  const nodes = useRef(SP_NODES.map(([x, y]) => ({ x, y, vx: 0, vy: 0 })));
  const dots = useRef([]);
  const lines = useRef([]);
  const grab = useRef(-1);
  useEffect(() => {
    if (!live) return undefined;
    let raf = 0;
    const frame = () => {
      const p = nodes.current;
      SP_EDGES.forEach(([a, b]) => {
        const dx = p[b].x - p[a].x;
        const dy = p[b].y - p[a].y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - 24) * 0.03;
        p[a].vx += (dx / d) * f; p[a].vy += (dy / d) * f; p[b].vx -= (dx / d) * f; p[b].vy -= (dy / d) * f;
      });
      for (let i = 0; i < p.length; i += 1) {
        for (let j = i + 1; j < p.length; j += 1) {
          const dx = p[j].x - p[i].x;
          const dy = p[j].y - p[i].y;
          const d = Math.hypot(dx, dy) || 1;
          const f = 90 / (d * d);
          p[i].vx -= (dx / d) * f; p[i].vy -= (dy / d) * f; p[j].vx += (dx / d) * f; p[j].vy += (dy / d) * f;
        }
      }
      p.forEach((n, i) => {
        if (i === grab.current) { n.vx = 0; n.vy = 0; return; }
        n.vx = (n.vx + (50 - n.x) * 0.004) * 0.86;
        n.vy = (n.vy + (50 - n.y) * 0.004) * 0.86;
        n.x = clamp(n.x + n.vx, 5, 95);
        n.y = clamp(n.y + n.vy, 5, 95);
      });
      p.forEach((n, i) => dots.current[i]?.setAttribute('transform', `translate(${n.x.toFixed(2)} ${n.y.toFixed(2)})`));
      SP_EDGES.forEach(([a, b], i) => {
        const l = lines.current[i];
        if (l) { l.setAttribute('x1', p[a].x.toFixed(2)); l.setAttribute('y1', p[a].y.toFixed(2)); l.setAttribute('x2', p[b].x.toFixed(2)); l.setAttribute('y2', p[b].y.toFixed(2)); }
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [live]);
  const toSvg = (e) => {
    const r = svg.current.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100];
  };
  return (
    <div className={c.fig}>
      <svg ref={svg} className={`${c.svg} ${c.spring}`} viewBox="0 0 100 100" onPointerMove={(e) => { if (grab.current >= 0) { const [x, y] = toSvg(e); Object.assign(nodes.current[grab.current], { x: clamp(x, 4, 96), y: clamp(y, 4, 96) }); } }} onPointerUp={() => { grab.current = -1; }} onPointerLeave={() => { grab.current = -1; }}>
        {SP_EDGES.map(([a, b], i) => <line key={i} ref={(el) => { lines.current[i] = el; }} className={c.edge} x1={SP_NODES[a][0]} y1={SP_NODES[a][1]} x2={SP_NODES[b][0]} y2={SP_NODES[b][1]} />)}
        {SP_NODES.map(([x, y], i) => (
          <g key={i} ref={(el) => { dots.current[i] = el; }} transform={`translate(${x} ${y})`}>
            <circle className={c.grab} r="4.6" tabIndex={0} role="button" aria-roledescription="draggable node" aria-label={`Node ${i + 1}, drag it or use the arrow keys`}
              onPointerDown={(e) => { grab.current = i; e.currentTarget.setPointerCapture?.(e.pointerId); }}
              onKeyDown={(e) => { const d = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] }[e.key]; if (d) { e.preventDefault(); nodes.current[i].x += d[0]; nodes.current[i].y += d[1]; } }} />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* 2 */ const ORG = { id: 'a', label: 'Lead', kids: [{ id: 'b', label: 'Team A', kids: [{ id: 'd', label: 'Ana' }, { id: 'e', label: 'Bo' }] }, { id: 'c', label: 'Team B', kids: [{ id: 'f', label: 'Cy' }, { id: 'g', label: 'Di' }, { id: 'h', label: 'Ed' }] }] };
function OrgNode({ node, closed, toggle }) {
  const kids = node.kids || [];
  const shut = closed.includes(node.id);
  return (
    <li>
      {kids.length ? <button type="button" aria-expanded={!shut} onClick={() => toggle(node.id)}>{node.label}<u>{shut ? '+' : '−'}</u></button> : <span>{node.label}</span>}
      {kids.length > 0 && !shut && <ul>{kids.map((k) => <OrgNode key={k.id} node={k} closed={closed} toggle={toggle} />)}</ul>}
    </li>
  );
}
function OrgChart() {
  const [closed, setClosed] = useState([]);
  return (
    <div className={c.org}><ul><OrgNode node={ORG} closed={closed} toggle={(id) => setClosed((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))} /></ul></div>
  );
}

/* 3 */ const FILES = { n: 'project', kids: [{ n: 'src', kids: [{ n: 'components', kids: [{ n: 'Button.jsx' }, { n: 'Card.jsx' }] }, { n: 'pages', kids: [{ n: 'Home.jsx' }] }, { n: 'main.jsx' }] }, { n: 'public', kids: [{ n: 'logo.svg' }] }, { n: 'package.json' }] };
function FileNode({ node, path, depth, open, toggle }) {
  const here = `${path}/${node.n}`;
  const folder = Boolean(node.kids);
  const on = open.includes(here);
  return (
    <li>
      {folder ? <button type="button" style={{ '--d': depth }} aria-expanded={on} onClick={() => toggle(here)}><i data-open={on} />{node.n}</button> : <span style={{ '--d': depth }}><i data-file />{node.n}</span>}
      {folder && on && <ul>{node.kids.map((k) => <FileNode key={k.n} node={k} path={here} depth={depth + 1} open={open} toggle={toggle} />)}</ul>}
    </li>
  );
}
function FileTree() {
  const [open, setOpen] = useState(['/project', '/project/src']);
  return (
    <div className={c.files}><ul><FileNode node={FILES} path="" depth={0} open={open} toggle={(p) => setOpen((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]))} /></ul></div>
  );
}

/* 4 */ const MIND = [['Ideas', ['alpha', 'beta']], ['Tasks', ['one', 'two']], ['People', ['a', 'b']], ['Notes', ['x', 'y']], ['Links', ['p', 'q']], ['Dates', ['m', 'n']]];
function MindMap() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.col} data-hot={hot}>
      <svg className={c.svg} viewBox="0 0 100 80" aria-hidden="true">
        {MIND.map(([name, subs], i) => {
          const a = i * 60 + 30;
          const [bx, by] = polar(50, 40, 20, a);
          return (
            <g key={name} className={c.branch} data-hot={hot === i}>
              <path className={c.edge} d={`M50 40Q${f1((50 + bx) / 2 + (by - 40) * 0.18)} ${f1((40 + by) / 2 - (bx - 50) * 0.18)} ${bx} ${by}`} />
              {subs.map((s, k) => { const [sx, sy] = polar(50, 40, 35, a + (k - 0.5) * 24); return <g key={s}><path className={c.edge} d={`M${bx} ${by}L${sx} ${sy}`} /><circle className={c.nd} cx={sx} cy={sy} r="1.5" /><text className={c.tx} x={sx} y={sy + 4.2} textAnchor="middle">{s}</text></g>; })}
              <Box x={bx} y={by} w={11} label={name} hot={hot === i} />
            </g>
          );
        })}
        <circle className={c.core} cx="50" cy="40" r="4" />
      </svg>
      <Legend items={MIND.map(([n]) => n)} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 5 */ const DEP_N = [['A', 12, 15], ['B', 12, 50], ['C', 12, 85], ['D', 45, 30], ['E', 45, 70], ['F', 80, 22], ['G', 80, 50], ['H', 80, 78]];
const DEP_E = [[0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [3, 6], [4, 6], [4, 7]];
const reach = (start, edges, dir) => {
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const v = stack.pop();
    edges.forEach(([a, b]) => { const [from, to] = dir ? [a, b] : [b, a]; if (from === v && !seen.has(to)) { seen.add(to); stack.push(to); } });
  }
  return seen;
};
function DependencyGraph() {
  const [hot, setHot] = useState(-1);
  const rel = hot < 0 ? new Set() : new Set([...reach(hot, DEP_E, true), ...reach(hot, DEP_E, false)]);
  return (
    <div className={c.col} data-hot={hot}>
      <svg className={c.svg} viewBox="0 0 100 100" aria-hidden="true">
        <defs><marker id="depArrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L6 3L0 6z" className={c.arrow} /></marker></defs>
        {DEP_E.map(([a, b], i) => <path key={i} className={c.edge} data-hot={rel.has(a) && rel.has(b)} markerEnd="url(#depArrow)" d={`M${DEP_N[a][1] + 6} ${DEP_N[a][2]}C${DEP_N[a][1] + 24} ${DEP_N[a][2]} ${DEP_N[b][1] - 24} ${DEP_N[b][2]} ${DEP_N[b][1] - 7} ${DEP_N[b][2]}`} />)}
        {DEP_N.map(([n, x, y], i) => <Box key={n} x={x} y={y} w={10} h={7} label={n} hot={rel.has(i)} />)}
      </svg>
      <Legend items={DEP_N.map(([n]) => `Node ${n}`)} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 6 */ const DECIDE_OUT = ['Go', 'Pause', 'Ship', 'Trim', 'Plan', 'Wait', 'Stop', 'Hold'];
function DecisionTree() {
  const [path, setPath] = useState('');
  const full = path.length === 3;
  const idx = (p) => (1 << p.length) - 1 + (p ? parseInt(p.replace(/Y/g, '0').replace(/N/g, '1'), 2) : 0);
  const onPath = (p) => path.startsWith(p);
  const nodes = [];
  for (let d = 0; d <= 3; d += 1) for (let k = 0; k < 2 ** d; k += 1) { const p = d ? k.toString(2).padStart(d, '0').replace(/0/g, 'Y').replace(/1/g, 'N') : ''; nodes.push({ p, d, x: ((k + 0.5) / 2 ** d) * 100, y: 8 + d * 24 }); }
  return (
    <div className={c.col}>
      <svg className={c.svg} viewBox="0 0 100 86" aria-hidden="true">
        {nodes.filter((n) => n.d > 0).map((n) => { const par = nodes.find((m) => m.p === n.p.slice(0, -1)); return <path key={n.p} className={c.edge} data-hot={onPath(n.p)} d={`M${par.x} ${par.y + 3}C${par.x} ${par.y + 12} ${n.x} ${n.y - 12} ${n.x} ${n.y - 3}`} />; })}
        {nodes.map((n) => <circle key={n.p || 'root'} className={c.nd} data-hot={onPath(n.p)} cx={n.x} cy={n.y} r={n.d === 3 ? 2.6 : 3.2} />)}
        {nodes.filter((n) => n.d === 3).map((n) => <text key={n.p} className={c.tx} x={n.x} y={n.y + 7} textAnchor="middle" data-hot={path === n.p}>{DECIDE_OUT[idx(n.p) - 7]}</text>)}
      </svg>
      <div className={c.pair}>
        <button type="button" disabled={full} onClick={() => setPath(path + 'Y')}>Yes</button>
        <button type="button" disabled={full} onClick={() => setPath(path + 'N')}>No</button>
        <button type="button" onClick={() => setPath('')}>Reset</button>
      </div>
    </div>
  );
}

/* 7 */ const FLOW_N = [['Start', 50, 6], ['Read input', 50, 24], ['Valid?', 50, 44], ['Save', 22, 66], ['Show error', 78, 66], ['Done', 50, 90]];
const FLOW_E = [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 1]];
function FlowchartSteps() {
  const [k, setK] = useState(0);
  const order = [0, 1, 2, 3, 5];
  const cur = order[k % order.length];
  return (
    <div className={c.col}>
      <svg className={c.svg} viewBox="0 0 100 100" aria-hidden="true">
        {FLOW_E.map(([a, b], i) => <path key={i} className={c.edge} data-hot={a === cur || (a === 2 && b === 3 && cur === 3)} d={a === 4 && b === 1 ? 'M78 63V24H62' : `M${FLOW_N[a][1]} ${FLOW_N[a][2] + 3}L${FLOW_N[b][1]} ${FLOW_N[b][2] - 3}`} />)}
        {FLOW_N.map(([n, x, y], i) => (i === 2
          ? <g key={n} className={c.box} data-hot={cur === i}><polygon points={`${x},${y - 6} ${x + 12},${y} ${x},${y + 6} ${x - 12},${y}`} /><text x={x} y={y} textAnchor="middle" dominantBaseline="central">{n}</text></g>
          : <Box key={n} x={x} y={y} w={i === 1 ? 20 : 16} label={n} hot={cur === i} />))}
      </svg>
      <div className={c.pair}><button type="button" onClick={() => setK(k + 1)}>Step</button></div>
    </div>
  );
}

/* 8 */ const RADIAL = layoutTree({ n: 'root', kids: [{ n: 'a', kids: [{ n: 'a1' }, { n: 'a2' }, { n: 'a3' }] }, { n: 'b', kids: [{ n: 'b1', kids: [{ n: 'b1x' }, { n: 'b1y' }] }, { n: 'b2' }] }, { n: 'c', kids: [{ n: 'c1' }, { n: 'c2' }, { n: 'c3' }, { n: 'c4' }] }] });
const radialPos = (d) => (d.depth === 0 ? [50, 50] : polar(50, 50, d.depth * 14, ((d.x + 0.5) / RADIAL.leaves) * 360));
const branchOf = (d) => { let v = d; while (v.parent && v.parent.parent) v = v.parent; return v.parent ? RADIAL.nodes.find((m) => m.parent && !m.parent.parent && m.n === v.n) : null; };
function RadialTree() {
  const [hot, setHot] = useState(-1);
  const tops = RADIAL.nodes.filter((d) => d.depth === 1);
  return (
    <div className={c.col} data-hot={hot}>
      <svg className={c.svg} viewBox="0 0 100 100" aria-hidden="true">
        {[14, 28, 42].map((r) => <circle key={r} className={c.ring} cx="50" cy="50" r={r} />)}
        {RADIAL.nodes.filter((d) => d.parent).map((d, i) => { const [x1, y1] = radialPos(d.parent); const [x2, y2] = radialPos(d); return <line key={i} className={c.edge} data-hot={hot >= 0 && branchOf(d) === tops[hot]} x1={x1} y1={y1} x2={x2} y2={y2} />; })}
        {RADIAL.nodes.map((d, i) => { const [x, y] = radialPos(d); return <circle key={i} className={c.nd} data-hot={hot >= 0 && (d === tops[hot] || branchOf(d) === tops[hot])} cx={x} cy={y} r={d.depth === 0 ? 3.4 : 2} />; })}
      </svg>
      <Legend items={tops.map((d) => `Branch ${d.n.n.toUpperCase()}`)} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 9 */ const DENDRO = [[[0, 1], 1.2], [[2, 3], 1.8], [[4, 5], 2.4], [[6, 7], 2.9], [['m0', 'm1'], 4.6], [['m2', 'm3'], 5.4], [['m4', 'm5'], 8]];
const DENDRO_X = [8, 20, 32, 44, 56, 68, 80, 92];
function DendrogramCut() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.5 });
  const cut = v * 9;
  /* nodes: leaves 0..7, merges m0..m6 with x = mean of children, y = height */
  const pos = {};
  DENDRO_X.forEach((x, i) => { pos[i] = { x, h: 0 }; });
  DENDRO.forEach(([[a, b], h], k) => { pos[`m${k}`] = { x: (pos[a].x + pos[b].x) / 2, h }; });
  const cluster = {};
  let ids = 0;
  const assign = (key, id) => { cluster[key] = id; const k = typeof key === 'string' ? Number(key.slice(1)) : -1; if (k >= 0) DENDRO[k][0].forEach((ch) => assign(ch, id)); };
  for (let k = DENDRO.length - 1; k >= 0; k -= 1) if (!(`m${k}` in cluster) && DENDRO[k][1] <= cut) { assign(`m${k}`, ids); ids += 1; }
  for (let i = 0; i < 8; i += 1) if (!(i in cluster)) { cluster[i] = ids; ids += 1; }
  const Y = (h) => 82 - h * 8;
  return (
    <div className={c.fig}>
      <div className={c.dendro} {...bind} aria-label="Dendrogram, drag the cut line up or down" style={{ ...bind.style, '--v': v }}>
        <svg viewBox="0 0 100 90" aria-hidden="true">
          {DENDRO.map(([[a, b], h], k) => (
            <path key={k} className={c.dLink} data-in={h <= cut} data-k={`m${k}` in cluster ? cluster[`m${k}`] % 5 : -1} d={`M${pos[a].x} ${Y(pos[a].h)}V${Y(h)}H${pos[b].x}V${Y(pos[b].h)}`} />
          ))}
          {DENDRO_X.map((x, i) => <circle key={i} className={c.dLeaf} data-k={cluster[i] % 5} cx={x} cy="82" r="2.2" />)}
        </svg>
        <i />
      </div>
      <p className={c.sub}>{ids} clusters</p>
    </div>
  );
}

/* 10 */ function RingNetwork() {
  const [n, setN] = useState(7);
  const p = Array.from({ length: n }, (_, i) => polar(50, 50, 40, (i / n) * 360));
  return (
    <div className={c.fig}>
      <svg className={c.svgSq} viewBox="0 0 100 100" role="img" aria-label={`${n} nodes joined to each other`}>
        {p.flatMap((a, i) => p.slice(i + 1).map((b, j) => <line key={`${i}-${j}`} className={c.edge} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />))}
        {p.map(([x, y], i) => <circle key={i} className={c.nd} cx={x} cy={y} r="2.6" />)}
      </svg>
      <div className={c.pair}>
        <button type="button" aria-label="Fewer nodes" onClick={() => setN((v) => Math.max(3, v - 1))}>−</button>
        <span className={c.sub}>{n} nodes · {(n * (n - 1)) / 2} links</span>
        <button type="button" aria-label="More nodes" onClick={() => setN((v) => Math.min(14, v + 1))}>+</button>
      </div>
    </div>
  );
}

/* 11 */ function HubSpoke() {
  return (
    <div className={c.fig} role="img" aria-label="A hub sending pulses down eight spokes">
      <svg className={c.svgSq} viewBox="0 0 100 100" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => {
          const [x, y] = polar(50, 50, 40, i * 45);
          return (
            <g key={i}>
              <line className={c.edge} x1="50" y1="50" x2={x} y2={y} />
              <circle className={c.nd} cx={x} cy={y} r="3" />
              <circle className={c.pulse} cx="50" cy="50" r="1.4" style={{ '--dx': x - 50, '--dy': y - 50, animationDelay: `${i * 0.22}s` }} />
            </g>
          );
        })}
        <circle className={c.core} cx="50" cy="50" r="5" />
      </svg>
    </div>
  );
}

/* 12 */ const ROUTE_N = [[10, 30], [34, 14], [34, 56], [62, 30], [84, 14], [88, 52]];
const ROUTE_E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [1, 4]];
const ROUTE = [0, 2, 3, 5];
function PacketRoute() {
  const [n, setN] = useState(1);
  const d = ROUTE.map((i, k) => `${k ? 'L' : 'M'}${ROUTE_N[i][0]} ${ROUTE_N[i][1]}`).join('');
  return (
    <button type="button" className={c.chBtn} aria-label="Packet route, click to send a packet" onClick={() => setN(n + 1)}>
      <svg className={c.svg} viewBox="0 0 100 70" aria-hidden="true">
        {ROUTE_E.map(([a, b], i) => <line key={i} className={c.edge} x1={ROUTE_N[a][0]} y1={ROUTE_N[a][1]} x2={ROUTE_N[b][0]} y2={ROUTE_N[b][1]} />)}
        <path className={c.edge} data-hot d={d} />
        {ROUTE_N.map(([x, y], i) => <circle key={i} className={c.nd} data-hot={ROUTE.includes(i)} cx={x} cy={y} r="3" />)}
        <circle key={n} className={c.packet} r="2.2" style={{ offsetPath: `path("${d}")` }} />
      </svg>
      <span className={c.sub}>packets sent <b>{n}</b></span>
    </button>
  );
}

/* 13 */ const TEAMS = ['Ash', 'Birch', 'Cedar', 'Dune', 'Elm', 'Fir', 'Gum', 'Holly'];
function Bracket() {
  const [w, setW] = useState([[null, null, null, null], [null, null], [null]]);
  const rounds = [TEAMS, w[0].map((x) => x), w[1].map((x) => x)];
  const pick = (r, m, team) => setW((cur) => cur.map((row, ri) => {
    if (ri < r) return row;
    return row.map((x, mi) => {
      if (ri === r && mi === m) return team;
      if (ri > r && mi === Math.floor(m / 2 ** (ri - r))) return null;
      return x;
    });
  }));
  return (
    <div className={c.bracket}>
      {[0, 1, 2].map((r) => (
        <div key={r} data-r={r}>
          {Array.from({ length: 4 / 2 ** r }, (_, m) => (
            <p key={m}>
              {[0, 1].map((s) => { const t = rounds[r][m * 2 + s]; return <button key={s} type="button" disabled={!t} data-win={t && w[r][m] === t} onClick={() => pick(r, m, t)}>{t || '—'}</button>; })}
            </p>
          ))}
        </div>
      ))}
      <div data-r="3"><p><b>{w[2][0] || '?'}</b></p></div>
    </div>
  );
}

/* 14 */ const COMMITS = [[0, 0, 'init grid'], [1, 0, 'add nodes'], [2, 1, 'try layout'], [3, 0, 'fix edges'], [3, 1, 'tune spacing'], [4, 0, 'merge layout'], [5, 0, 'polish'], [6, 0, 'release']];
const COMMIT_E = [[0, 1], [1, 3], [1, 2], [2, 4], [3, 5], [4, 5], [5, 6], [6, 7]];
function BranchGraph() {
  const [i, bind] = useScan(8, { label: (k) => COMMITS[k][2] });
  const X = (k) => 8 + COMMITS[k][0] * 14;
  const Y = (k) => 14 + COMMITS[k][1] * 16;
  return (
    <div className={c.fig}>
      <div className={c.scanBox} {...bind} aria-label="Branch graph, move along it to read the commits">
        <svg className={c.svg} viewBox="0 0 100 40" aria-hidden="true">
          {COMMIT_E.map(([a, b], k) => <path key={k} className={c.edge} data-lane={COMMITS[b][1]} d={`M${X(a)} ${Y(a)}C${X(a) + 7} ${Y(a)} ${X(b) - 7} ${Y(b)} ${X(b)} ${Y(b)}`} />)}
          {COMMITS.map((m, k) => <circle key={k} className={c.nd} data-hot={k === i} cx={X(k)} cy={Y(k)} r="2.6" />)}
        </svg>
      </div>
      <p className={c.sub}>{i < 0 ? 'Move along the graph' : <>commit <b>{(i * 2654435761 >>> 0).toString(16).slice(0, 7)}</b> · {COMMITS[i][2]}</>}</p>
    </div>
  );
}

/* 15 */ const LINES = [['Red line', [[8, 52], [30, 52], [48, 34], [70, 34], [92, 16]]], ['Grey line', [[10, 14], [30, 34], [48, 34], [66, 52], [90, 52]]], ['Dotted line', [[50, 8], [50, 34], [50, 62]]]];
function TransitMap() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.col} data-hot={hot}>
      <svg className={c.svg} viewBox="0 0 100 70" aria-hidden="true">
        {LINES.map(([name, p], i) => (
          <g key={name} className={c.tline} data-i={i} data-hot={hot === i}>
            <path d={p.map(([x, y], k) => `${k ? 'L' : 'M'}${x} ${y}`).join('')} />
            {p.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2" />)}
          </g>
        ))}
        <circle className={c.hub} cx="48" cy="34" r="3.2" />
      </svg>
      <Legend items={LINES.map(([n]) => n)} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 16 */ const NEURAL = [3, 5, 5, 2];
const NEURAL_P = NEURAL.flatMap((n, l) => Array.from({ length: n }, (_, k) => ({ l, k, x: 12 + l * 25.3, y: 50 + (k - (n - 1) / 2) * 15 })));
function NeuralLayers() {
  return (
    <div className={c.fig} role="img" aria-label="A small neural network with signals passing through its layers">
      <svg className={c.svg} viewBox="0 0 100 100" aria-hidden="true">
        {NEURAL_P.flatMap((a, i) => NEURAL_P.filter((b) => b.l === a.l + 1).map((b, j) => <line key={`${i}-${j}`} className={c.edge} style={{ animationDelay: `${(a.l * 0.5 + ((i * 7 + j * 3) % 5) * 0.12).toFixed(2)}s` }} data-fire x1={a.x} y1={a.y} x2={b.x} y2={b.y} />))}
        {NEURAL_P.map((n, i) => <circle key={i} className={c.nd} data-fire style={{ animationDelay: `${n.l * 0.5}s` }} cx={n.x} cy={n.y} r="3.2" />)}
      </svg>
    </div>
  );
}

/* 17 */ const fnv = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; };
const hex = (n) => n.toString(16).padStart(8, '0');
const mine = (i, prev) => { let nonce = 0; while (fnv(`${i}|${prev}|${nonce}`) % 16 !== 0) nonce += 1; return { i, prev, nonce, hash: hex(fnv(`${i}|${prev}|${nonce}`)) }; };
function BlockChain() {
  const [len, setLen] = useState(3);
  const chain = [];
  for (let i = 0; i < len; i += 1) chain.push(mine(i, i ? chain[i - 1].hash : '00000000'));
  return (
    <div className={c.fig}>
      <div className={c.chain}>
        {chain.slice(-3).map((b, k) => (
          <p key={b.i} data-new={k === 2 && len > 3}><em>#{b.i}</em><span>prev {b.prev.slice(0, 5)}</span><span>nonce {b.nonce}</span><b>{b.hash.slice(0, 6)}</b></p>
        ))}
      </div>
      <div className={c.pair}><button type="button" onClick={() => setLen((v) => v + 1)}>Mine a block</button></div>
    </div>
  );
}

/* 18 */ function LinkedList() {
  const [items, setItems] = useState([7, 3, 9]);
  const [rev, setRev] = useState(false);
  const next = useRef(12);
  const list = rev ? [...items].reverse() : items;
  return (
    <div className={c.fig}>
      <div className={c.list} data-rev={rev}>
        <em>head</em>
        {list.map((v) => <span key={v}><b>{v}</b><i /></span>)}
        <u>null</u>
      </div>
      <div className={c.pair}>
        <button type="button" onClick={() => { setItems((a) => [next.current, ...a].slice(0, 6)); next.current += 5; }}>Push</button>
        <button type="button" onClick={() => setItems((a) => a.slice(1))}>Pop</button>
        <button type="button" onClick={() => setRev(!rev)}>Reverse</button>
      </div>
    </div>
  );
}

/* 19 */ function StackQueue() {
  const [n, setN] = useState(3);
  const items = Array.from({ length: n }, (_, i) => i + 1);
  return (
    <div className={c.fig}>
      <div className={c.sq}>
        <div><em>stack</em><span>{items.map((v, i) => <b key={v} data-top={i === n - 1}>{v}</b>)}</span></div>
        <div><em>queue</em><p>{items.map((v, i) => <b key={v} data-top={i === 0}>{v}</b>)}</p></div>
      </div>
      <div className={c.pair}>
        <button type="button" disabled={n >= 5} onClick={() => setN(n + 1)}>Add</button>
        <button type="button" disabled={n <= 0} onClick={() => setN(n - 1)}>Remove</button>
      </div>
    </div>
  );
}

/* 20 */ const HEAP_IN = [42, 17, 63, 8, 25, 51, 4, 36];
const heapPush = (h, v) => { const a = [...h, v]; let i = a.length - 1; while (i > 0 && a[(i - 1) >> 1] > a[i]) { const p = (i - 1) >> 1; [a[p], a[i]] = [a[i], a[p]]; i = p; } return a; };
const heapPop = (h) => {
  if (h.length < 2) return [];
  const a = [h[h.length - 1], ...h.slice(1, -1)];
  let i = 0;
  for (;;) { const l = 2 * i + 1; const r = l + 1; let m = i; if (l < a.length && a[l] < a[m]) m = l; if (r < a.length && a[r] < a[m]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; }
  return a;
};
function HeapTree() {
  const [h, setH] = useState(() => [42, 17, 63].reduce(heapPush, []));
  const [k, setK] = useState(3);
  const pos = (i) => { const d = Math.floor(Math.log2(i + 1)); return [((i + 1 - 2 ** d + 0.5) / 2 ** d) * 100, 10 + d * 24]; };
  return (
    <div className={c.col}>
      <svg className={c.svg} viewBox="0 0 100 66" aria-hidden="true">
        {h.map((_, i) => (i ? (() => { const [x1, y1] = pos((i - 1) >> 1); const [x2, y2] = pos(i); return <line key={`e${i}`} className={c.edge} x1={x1} y1={y1} x2={x2} y2={y2} />; })() : null))}
        {h.map((v, i) => { const [x, y] = pos(i); return <g key={i} className={c.box} data-hot={i === 0}><circle cx={x} cy={y} r="4.6" /><text x={x} y={y} textAnchor="middle" dominantBaseline="central">{v}</text></g>; })}
      </svg>
      <p className={c.sub}>[{h.join(', ')}]</p>
      <div className={c.pair}>
        <button type="button" onClick={() => { setH((a) => heapPush(a, HEAP_IN[k % HEAP_IN.length] + (Math.floor(k / HEAP_IN.length) % 5))); setK(k + 1); }}>Insert</button>
        <button type="button" onClick={() => setH(heapPop)}>Take smallest</button>
      </div>
    </div>
  );
}

/* 21 */ const bstInsert = (t, v) => (!t ? { v, l: null, r: null } : v < t.v ? { ...t, l: bstInsert(t.l, v) } : v > t.v ? { ...t, r: bstInsert(t.r, v) } : t);
function SearchTree() {
  const [text, setText] = useState('50 30 70 20 40 60 80');
  const nums = text.split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n) && n >= 0 && n < 1000).slice(0, 14);
  const root = nums.reduce(bstInsert, null);
  const nodes = [];
  let order = 0;
  const walk = (t, depth, parent) => { if (!t) return; walk(t.l, depth + 1, t); const me = { v: t.v, depth, x: order, parent }; order += 1; nodes.push(me); walk(t.r, depth + 1, t); };
  walk(root, 0, null);
  const byV = Object.fromEntries(nodes.map((n) => [n.v, n]));
  const X = (n) => 8 + (n.x / Math.max(1, order - 1)) * 84;
  const Y = (n) => 10 + n.depth * 14;
  return (
    <div className={c.col}>
      <input className={c.input} value={text} aria-label="Numbers to insert into the search tree" onChange={(e) => setText(e.target.value.replace(/[^0-9 ,]/g, ''))} />
      <svg className={c.svg} viewBox="0 0 100 70" aria-hidden="true">
        {nodes.filter((n) => n.parent).map((n) => <line key={`e${n.v}`} className={c.edge} x1={X(byV[n.parent.v])} y1={Y(byV[n.parent.v])} x2={X(n)} y2={Y(n)} />)}
        {nodes.map((n) => <g key={n.v} className={c.box} data-hot={n.depth === 0}><circle cx={X(n)} cy={Y(n)} r="4.4" /><text x={X(n)} y={Y(n)} textAnchor="middle" dominantBaseline="central">{n.v}</text></g>)}
      </svg>
    </div>
  );
}

/* 22 */ const TRAV_N = [['A', 50, 10], ['B', 22, 34], ['C', 78, 34], ['D', 10, 62], ['E', 36, 62], ['F', 64, 62], ['G', 90, 62]];
const TRAV_ADJ = { 0: [1, 2], 1: [0, 3, 4], 2: [0, 5, 6], 3: [1], 4: [1], 5: [2], 6: [2] };
const traverse = (mode) => {
  const seen = [0];
  const todo = [0];
  while (todo.length) {
    const v = mode === 'BFS' ? todo.shift() : todo.pop();
    (mode === 'BFS' ? TRAV_ADJ[v] : [...TRAV_ADJ[v]].reverse()).forEach((w) => { if (!seen.includes(w)) { seen.push(w); todo.push(w); } });
  }
  return seen;
};
function TraversalSteps() {
  const [mode, setMode] = useState('BFS');
  const [step, setStep] = useState(2);
  const order = traverse(mode);
  const done = order.slice(0, step);
  return (
    <div className={c.col}>
      <svg className={c.svg} viewBox="0 0 100 74" aria-hidden="true">
        {Object.entries(TRAV_ADJ).flatMap(([a, bs]) => bs.filter((b) => b > Number(a)).map((b) => <line key={`${a}-${b}`} className={c.edge} data-hot={done.includes(Number(a)) && done.includes(b)} x1={TRAV_N[a][1]} y1={TRAV_N[a][2]} x2={TRAV_N[b][1]} y2={TRAV_N[b][2]} />))}
        {TRAV_N.map(([n, x, y], i) => <g key={n} className={c.box} data-hot={done.includes(i)}><circle cx={x} cy={y} r="5" /><text x={x} y={y} textAnchor="middle" dominantBaseline="central">{n}</text></g>)}
      </svg>
      <div className={c.pair}>
        <button type="button" aria-pressed={mode === 'BFS'} onClick={() => { setMode('BFS'); setStep(1); }}>BFS</button>
        <button type="button" aria-pressed={mode === 'DFS'} onClick={() => { setMode('DFS'); setStep(1); }}>DFS</button>
        <button type="button" onClick={() => setStep((s) => (s >= 7 ? 1 : s + 1))}>Step</button>
      </div>
      <p className={c.sub}>{done.map((i) => TRAV_N[i][0]).join(' → ')}</p>
    </div>
  );
}

/* 23 */ const SP_G = [['A', 10, 40], ['B', 32, 14], ['C', 32, 66], ['D', 58, 40], ['E', 80, 14], ['F', 80, 66], ['G', 94, 40]];
const SP_W = [[0, 1, 4], [0, 2, 2], [1, 3, 5], [2, 3, 8], [1, 4, 10], [2, 5, 3], [3, 4, 2], [3, 6, 7], [5, 6, 4], [4, 6, 3]];
const dijkstra = (from, to) => {
  const dist = SP_G.map(() => Infinity);
  const prev = SP_G.map(() => -1);
  const todo = SP_G.map((_, i) => i);
  dist[from] = 0;
  while (todo.length) {
    todo.sort((a, b) => dist[a] - dist[b]);
    const u = todo.shift();
    SP_W.forEach(([a, b, w]) => { const [x, y] = a === u ? [a, b] : b === u ? [b, a] : [-1, -1]; if (x >= 0 && dist[x] + w < dist[y]) { dist[y] = dist[x] + w; prev[y] = x; } });
  }
  const path = [to];
  while (path[0] !== from && prev[path[0]] >= 0) path.unshift(prev[path[0]]);
  return { path, cost: dist[to] };
};
function ShortestPath() {
  const [pair, setPair] = useState([0, 6]);
  const { path, cost } = dijkstra(pair[0], pair[1]);
  const on = (a, b) => path.some((p, i) => i && ((path[i - 1] === a && p === b) || (path[i - 1] === b && p === a)));
  return (
    <div className={c.col}>
      <svg className={c.svg} viewBox="0 0 100 80" aria-hidden="true">
        {SP_W.map(([a, b, w], i) => (
          <g key={i}><line className={c.edge} data-hot={on(a, b)} x1={SP_G[a][1]} y1={SP_G[a][2]} x2={SP_G[b][1]} y2={SP_G[b][2]} /><text className={c.tx} x={(SP_G[a][1] + SP_G[b][1]) / 2} y={(SP_G[a][2] + SP_G[b][2]) / 2 - 1.5} textAnchor="middle">{w}</text></g>
        ))}
        {SP_G.map(([n, x, y], i) => <g key={n} className={c.box} data-hot={path.includes(i)}><circle cx={x} cy={y} r="4.6" /><text x={x} y={y} textAnchor="middle" dominantBaseline="central">{n}</text></g>)}
      </svg>
      <div className={c.pair}>
        <button type="button" onClick={() => setPair(([a, b]) => [(a + 1) % 7 === b ? (a + 2) % 7 : (a + 1) % 7, b])}>From {SP_G[pair[0]][0]}</button>
        <button type="button" onClick={() => setPair(([a, b]) => [a, (b + 1) % 7 === a ? (b + 2) % 7 : (b + 1) % 7])}>To {SP_G[pair[1]][0]}</button>
      </div>
      <p className={c.sub}>cost <b>{cost}</b> · {path.map((i) => SP_G[i][0]).join(' → ')}</p>
    </div>
  );
}

/* 24 */ const SPAN_N = [[18, 14], [50, 8], [82, 18], [14, 52], [46, 44], [78, 56]];
const SPAN_E = [[0, 1, 3], [1, 2, 6], [0, 3, 2], [1, 4, 4], [2, 5, 5], [3, 4, 7], [4, 5, 1], [0, 4, 9]].sort((a, b) => a[2] - b[2]);
function SpanningTree() {
  const [step, setStep] = useState(3);
  const parent = SPAN_N.map((_, i) => i);
  const find = (x) => (parent[x] === x ? x : find(parent[x]));
  const verdicts = SPAN_E.map(([a, b]) => { const ra = find(a); const rb = find(b); if (ra === rb) return false; parent[ra] = rb; return true; });
  return (
    <div className={c.col}>
      <svg className={c.svg} viewBox="0 0 100 66" aria-hidden="true">
        {SPAN_E.map(([a, b, w], i) => (
          <g key={i} className={c.sEdge} data-state={i >= step ? 'todo' : verdicts[i] ? 'kept' : 'skip'}>
            <line x1={SPAN_N[a][0]} y1={SPAN_N[a][1]} x2={SPAN_N[b][0]} y2={SPAN_N[b][1]} />
            <text className={c.tx} x={(SPAN_N[a][0] + SPAN_N[b][0]) / 2} y={(SPAN_N[a][1] + SPAN_N[b][1]) / 2 - 1.5} textAnchor="middle">{w}</text>
          </g>
        ))}
        {SPAN_N.map(([x, y], i) => <circle key={i} className={c.nd} cx={x} cy={y} r="3" />)}
      </svg>
      <div className={c.pair}><button type="button" onClick={() => setStep((s) => (s >= SPAN_E.length ? 0 : s + 1))}>{step >= SPAN_E.length ? 'Start over' : 'Next edge'}</button></div>
      <p className={c.sub}>{step === 0 ? 'no edges yet' : `edge ${step} ${verdicts[step - 1] ? 'kept' : 'skipped (it would close a loop)'}`}</p>
    </div>
  );
}

/* 25 */ const STATES = [['idle', 14, 20], ['loading', 50, 20], ['ready', 86, 20], ['error', 50, 62]];
const TRANS = { idle: { fetch: 'loading' }, loading: { resolve: 'ready', reject: 'error' }, ready: { reset: 'idle' }, error: { retry: 'loading', reset: 'idle' } };
function StateMachine() {
  const [cur, setCur] = useState('idle');
  const [last, setLast] = useState('');
  return (
    <div className={c.col}>
      <svg className={c.svg} viewBox="0 0 100 80" aria-hidden="true">
        <defs><marker id="stArrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L6 3L0 6z" className={c.arrow} /></marker></defs>
        {['M25 20H38', 'M61 20H74', 'M47 24V57', 'M53 57V24', 'M86 16C86 0 14 0 14 15', 'M39 62C14 62 14 42 14 25'].map((d, i) => <path key={i} className={c.edge} markerEnd="url(#stArrow)" d={d} />)}
        {STATES.map(([n, x, y]) => <Box key={n} x={x} y={y} w={22} h={8} label={n} hot={cur === n} />)}
      </svg>
      <div className={c.pair}>
        {Object.keys(TRANS[cur]).map((ev) => <button key={ev} type="button" onClick={() => { setCur(TRANS[cur][ev]); setLast(ev); }}>{ev}</button>)}
      </div>
      <p className={c.sub}>{last ? <>{last} → <b>{cur}</b></> : <>state <b>{cur}</b></>}</p>
    </div>
  );
}

/* 26 */ function TokenPipeline() {
  return (
    <div className={c.fig} role="img" aria-label="Tokens moving through a three stage pipeline">
      <div className={c.pipe}>
        {['Fetch', 'Parse', 'Store'].map((s) => <span key={s}><b>{s}</b></span>)}
        {Array.from({ length: 6 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.55}s` }} />)}
      </div>
    </div>
  );
}

/* 27 */ function FanOut() {
  return (
    <div className={c.fig} role="img" aria-label="One source fanning out to six listeners">
      <svg className={c.svg} viewBox="0 0 100 70" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => {
          const y = 8 + i * 11;
          return (
            <g key={i}>
              <path className={c.edge} d={`M22 35C50 35 50 ${y} 80 ${y}`} />
              <circle className={c.dot} r="1.6" style={{ offsetPath: `path("M22 35C50 35 50 ${y} 80 ${y}")`, animationDelay: `${i * 0.3}s` }} />
              <circle className={c.nd} cx="84" cy={y} r="3" />
            </g>
          );
        })}
        <circle className={c.core} cx="18" cy="35" r="5" />
      </svg>
    </div>
  );
}

/* 28 */ function Trie() {
  const [text, setText] = useState('tea ten to inn in');
  const words = text.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8);
  const root = { n: '*', kids: [] };
  words.forEach((w) => { let cur = root; [...w].forEach((ch) => { let nx = cur.kids.find((k) => k.n === ch); if (!nx) { nx = { n: ch, kids: [] }; cur.kids.push(nx); } cur = nx; }); });
  const L = layoutTree(root);
  const X = (d) => 8 + (L.depth ? (d.depth / L.depth) * 84 : 0);
  const Y = (d) => 8 + (L.leaves > 1 ? (d.x / (L.leaves - 1)) * 50 : 25);
  return (
    <div className={c.col}>
      <input className={c.input} value={text} aria-label="Words to put in the trie" onChange={(e) => setText(e.target.value.replace(/[^a-zA-Z ]/g, ''))} />
      <svg className={c.svg} viewBox="0 0 100 66" aria-hidden="true">
        {L.nodes.filter((d) => d.parent).map((d, i) => <path key={i} className={c.edge} d={`M${X(d.parent)} ${Y(d.parent)}C${(X(d.parent) + X(d)) / 2} ${Y(d.parent)} ${(X(d.parent) + X(d)) / 2} ${Y(d)} ${X(d)} ${Y(d)}`} />)}
        {L.nodes.map((d, i) => <g key={i} className={c.box} data-hot={d.depth === 0}><circle cx={X(d)} cy={Y(d)} r="3.6" /><text x={X(d)} y={Y(d)} textAnchor="middle" dominantBaseline="central">{d.n.n}</text></g>)}
      </svg>
    </div>
  );
}

/* 29 */ const HUFF = (() => {
  const freq = [['A', 5], ['B', 2], ['R', 2], ['C', 1], ['D', 1]];
  let pool = freq.map(([ch, w]) => ({ ch, w }));
  while (pool.length > 1) {
    pool.sort((a, b) => a.w - b.w);
    const [a, b] = pool;
    pool = [{ w: a.w + b.w, kids: [a, b] }, ...pool.slice(2)];
  }
  const codes = {};
  const walk = (t, code) => { if (t.ch) codes[t.ch] = code; else { walk(t.kids[0], `${code}0`); walk(t.kids[1], `${code}1`); } };
  walk(pool[0], '');
  const nodes = [];
  const place = (t, depth, x0, x1, code) => { const me = { t, depth, x: (x0 + x1) / 2, code }; nodes.push(me); if (t.kids) { const m = (x0 + x1) / 2; place(t.kids[0], depth + 1, x0, m, `${code}0`); place(t.kids[1], depth + 1, m, x1, `${code}1`); } };
  place(pool[0], 0, 4, 96, '');
  return { codes, nodes, names: freq.map(([ch]) => ch) };
})();
function HuffmanTree() {
  const [hot, setHot] = useState(-1);
  const hotCode = hot < 0 ? null : HUFF.codes[HUFF.names[hot]];
  return (
    <div className={c.col} data-hot={hot}>
      <svg className={c.svg} viewBox="0 0 100 66" aria-hidden="true">
        {HUFF.nodes.filter((n) => n.depth).map((n, i) => { const par = HUFF.nodes.find((m) => m.code === n.code.slice(0, -1)); return <line key={i} className={c.edge} data-hot={hotCode !== null && hotCode.startsWith(n.code)} x1={par.x} y1={8 + par.depth * 14} x2={n.x} y2={8 + n.depth * 14} />; })}
        {HUFF.nodes.map((n, i) => <g key={i} className={c.box} data-hot={hotCode !== null && hotCode.startsWith(n.code)}><circle cx={n.x} cy={8 + n.depth * 14} r="4.2" /><text x={n.x} y={8 + n.depth * 14} textAnchor="middle" dominantBaseline="central">{n.t.ch || n.t.w}</text></g>)}
      </svg>
      <Legend items={HUFF.names.map((ch) => `${ch} ${HUFF.codes[ch]}`)} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 30 */ const VENN = [['Set A', 34, 38, 20], ['Set B', 62, 38, 20], ['Set C', 48, 62, 20]];
function VennSets() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.col} data-hot={hot}>
      <svg className={c.svg} viewBox="0 0 100 86" aria-hidden="true">
        {VENN.map(([n, x, y, r], i) => <circle key={n} className={c.venn} data-hot={hot === i} cx={x} cy={y} r={r} />)}
        {[[24, 30, '12'], [72, 30, '9'], [48, 76, '7'], [48, 32, '4'], [36, 55, '3'], [60, 55, '5'], [48, 48, '2']].map(([x, y, t]) => <text key={`${x}${y}`} className={c.tx} x={x} y={y} textAnchor="middle">{t}</text>)}
      </svg>
      <Legend items={VENN.map(([n]) => n)} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 31 */ const MZ_W = 11;
const MZ_H = 7;
const MAZE = (() => {
  const r = rng(31);
  const open = new Set();
  const seen = new Set([0]);
  const stack = [0];
  const key = (a, b) => `${Math.min(a, b)}-${Math.max(a, b)}`;
  while (stack.length) {
    const v = stack[stack.length - 1];
    const x = v % MZ_W;
    const y = Math.floor(v / MZ_W);
    const nb = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => a >= 0 && a < MZ_W && b >= 0 && b < MZ_H && !seen.has(b * MZ_W + a)).map(([a, b]) => b * MZ_W + a);
    if (!nb.length) { stack.pop(); } else { const w = nb[Math.floor(r() * nb.length)]; open.add(key(v, w)); seen.add(w); stack.push(w); }
  }
  const prev = { 0: -1 };
  const q = [0];
  while (q.length) {
    const v = q.shift();
    const x = v % MZ_W;
    const y = Math.floor(v / MZ_W);
    [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach(([a, b]) => { const w = b * MZ_W + a; if (a >= 0 && a < MZ_W && b >= 0 && b < MZ_H && !(w in prev) && open.has(key(v, w))) { prev[w] = v; q.push(w); } });
  }
  const path = [];
  for (let v = MZ_W * MZ_H - 1; v >= 0; v = prev[v]) path.unshift(v);
  const walls = [];
  for (let y = 0; y < MZ_H; y += 1) for (let x = 0; x < MZ_W; x += 1) { const v = y * MZ_W + x; if (x + 1 < MZ_W && !open.has(key(v, v + 1))) walls.push(`M${x + 1} ${y}V${y + 1}`); if (y + 1 < MZ_H && !open.has(key(v, v + MZ_W))) walls.push(`M${x} ${y + 1}H${x + 1}`); }
  return { walls: walls.join(''), path: path.map((v, i) => `${i ? 'L' : 'M'}${(v % MZ_W) + 0.5} ${Math.floor(v / MZ_W) + 0.5}`).join('') };
})();
function MazePath() {
  return (
    <div className={c.fig} role="img" aria-label="A maze with its solution drawing itself">
      <svg className={c.svg} viewBox={`-0.2 -0.2 ${MZ_W + 0.4} ${MZ_H + 0.4}`} aria-hidden="true">
        <rect className={c.mazeFrame} x="0" y="0" width={MZ_W} height={MZ_H} />
        <path className={c.mazeWalls} d={MAZE.walls} />
        <path className={c.mazePath} d={MAZE.path} pathLength="1" />
      </svg>
    </div>
  );
}

/* 32 */ function LinkCurve() {
  const [a, setA] = useState([20, 22]);
  const [b, setB] = useState([78, 58]);
  const [style, setStyle] = useState('curve');
  const box = useRef(null);
  const drag = (set) => ({
    onPointerDown: (e) => e.currentTarget.setPointerCapture?.(e.pointerId),
    onPointerMove: (e) => {
      if (!e.currentTarget.hasPointerCapture?.(e.pointerId)) return;
      const r = box.current.getBoundingClientRect();
      set([clamp(((e.clientX - r.left) / r.width) * 100, 6, 94), clamp(((e.clientY - r.top) / r.height) * 70, 6, 64)]);
    },
  });
  const nudge = (set, p) => (e) => { const d = { ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key]; if (d) { e.preventDefault(); set([clamp(p[0] + d[0], 6, 94), clamp(p[1] + d[1], 6, 64)]); } };
  const mx = (a[0] + b[0]) / 2;
  const d = style === 'curve' ? `M${a[0]} ${a[1]}C${mx} ${a[1]} ${mx} ${b[1]} ${b[0]} ${b[1]}` : style === 'step' ? `M${a[0]} ${a[1]}H${mx}V${b[1]}H${b[0]}` : `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
  return (
    <div className={c.fig}>
      <div ref={box} className={c.linkBox}>
        <svg className={c.svg} viewBox="0 0 100 70" aria-hidden="true"><path className={c.edge} data-hot d={d} /></svg>
        <button type="button" className={c.pin} style={{ left: `${a[0]}%`, top: `${(a[1] / 70) * 100}%` }} aria-label="Start node, drag or use arrow keys" {...drag(setA)} onKeyDown={nudge(setA, a)} />
        <button type="button" className={c.pin} style={{ left: `${b[0]}%`, top: `${(b[1] / 70) * 100}%` }} aria-label="End node, drag or use arrow keys" {...drag(setB)} onKeyDown={nudge(setB, b)} />
      </div>
      <div className={c.pair}>{['curve', 'step', 'line'].map((s) => <button key={s} type="button" aria-pressed={style === s} onClick={() => setStyle(s)}>{s}</button>)}</div>
    </div>
  );
}

/* 33 */ const ARCS = [[0, 3], [1, 5], [2, 4], [0, 8], [4, 9], [6, 9], [3, 7], [5, 8]];
function ArcDiagram() {
  const [i, bind] = useScan(10, { label: (k) => `Node ${k + 1}` });
  const X = (k) => 6 + k * 9.8;
  return (
    <div className={c.fig}>
      <div className={c.scanBox} {...bind} aria-label="Arc diagram, move along the nodes to light their arcs">
        <svg className={c.svg} viewBox="0 0 100 40" aria-hidden="true">
          {ARCS.map(([a, b], k) => <path key={k} className={c.edge} data-hot={a === i || b === i} d={`M${X(a)} 30A${(X(b) - X(a)) / 2} ${(X(b) - X(a)) / 2.4} 0 0 1 ${X(b)} 30`} />)}
          {Array.from({ length: 10 }, (_, k) => <circle key={k} className={c.nd} data-hot={k === i} cx={X(k)} cy="30" r="2.2" />)}
        </svg>
      </div>
    </div>
  );
}

/* 34 */ const ADJ_N = [[50, 12], [84, 34], [74, 72], [26, 72], [16, 34], [50, 44]];
const ADJ_E = [[0, 1], [0, 5], [1, 2], [2, 3], [3, 4], [4, 0], [5, 2], [5, 4]];
function AdjacencyView() {
  const has = (a, b) => ADJ_E.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  const [at, bind] = useCell(6, 6);
  const link = at[0] >= 0 && has(at[0], at[1]);
  return (
    <div className={c.adj}>
      <svg viewBox="0 0 100 84" aria-hidden="true">
        {ADJ_E.map(([a, b], i) => <line key={i} className={c.edge} data-hot={at[0] >= 0 && ((a === at[0] && b === at[1]) || (a === at[1] && b === at[0]))} x1={ADJ_N[a][0]} y1={ADJ_N[a][1]} x2={ADJ_N[b][0]} y2={ADJ_N[b][1]} />)}
        {ADJ_N.map(([x, y], i) => <g key={i} className={c.box} data-hot={i === at[0] || i === at[1]}><circle cx={x} cy={y} r="5" /><text x={x} y={y} textAnchor="middle" dominantBaseline="central">{i + 1}</text></g>)}
      </svg>
      <div className={c.mx} {...bind} aria-label="Adjacency matrix, move over it or use the arrow keys">
        {Array.from({ length: 36 }, (_, i) => <i key={i} data-on={has(Math.floor(i / 6), i % 6)} data-sel={Math.floor(i / 6) === at[0] && i % 6 === at[1]} />)}
      </div>
      <p className={c.sub}>{at[0] < 0 ? 'Move over the matrix' : `${at[0] + 1} – ${at[1] + 1}: ${link ? 'linked' : 'no link'}`}</p>
    </div>
  );
}

/* 35 */ const STARS = (() => { const r = rng(35); return Array.from({ length: 26 }, () => [6 + r() * 88, 6 + r() * 58]); })();
function Constellation() {
  const [p, setP] = useState(null);
  const near = p ? STARS.map(([x, y], i) => ({ i, d: Math.hypot(x - p[0], y - p[1]) })).sort((a, b) => a.d - b.d).slice(0, 4) : [];
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); setP([((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 70]); };
  return (
    <div className={c.fig}>
      <div className={c.scanBox} role="application" aria-label="Constellation, move over it to join the nearest stars" tabIndex={0} style={{ touchAction: 'pan-y' }} onPointerMove={move} onPointerLeave={(e) => { if (e.pointerType === 'mouse') setP(null); }} onBlur={() => setP(null)}
        onKeyDown={(e) => { const d = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, -6], ArrowDown: [0, 6] }[e.key]; if (d) { e.preventDefault(); setP((q) => { const b = q || [50, 35]; return [clamp(b[0] + d[0], 0, 100), clamp(b[1] + d[1], 0, 70)]; }); } }}>
        <svg className={c.svg} viewBox="0 0 100 70" aria-hidden="true">
          {p && near.map((n) => <line key={n.i} className={c.edge} data-hot x1={p[0]} y1={p[1]} x2={STARS[n.i][0]} y2={STARS[n.i][1]} />)}
          {STARS.map(([x, y], i) => <circle key={i} className={c.nd} data-hot={near.some((n) => n.i === i)} cx={x} cy={y} r="1.4" />)}
        </svg>
      </div>
    </div>
  );
}

/* 36 */ const SEQ = ['Client', 'Server', 'Store'];
const SEQ_MSG = [[0, 1, 'request'], [1, 2, 'query'], [2, 1, 'rows'], [1, 0, 'response']];
function SequenceDiagram() {
  const [k, setK] = useState(2);
  const X = (i) => 16 + i * 34;
  return (
    <div className={c.col}>
      <svg className={c.svg} viewBox="0 0 100 62" aria-hidden="true">
        {SEQ.map((n, i) => <g key={n}><Box x={X(i)} y={6} w={20} h={7} label={n} /><line className={c.edge} x1={X(i)} y1="10" x2={X(i)} y2="58" strokeDasharray="1.5 1.5" /></g>)}
        {SEQ_MSG.map(([a, b, t], i) => <g key={i} className={c.msg} data-on={i < k} data-now={i === k - 1}><line x1={X(a)} y1={22 + i * 11} x2={X(b)} y2={22 + i * 11} /><path d={`M${X(b) + (b > a ? -2.4 : 2.4)} ${22 + i * 11 - 1.6}L${X(b)} ${22 + i * 11}L${X(b) + (b > a ? -2.4 : 2.4)} ${22 + i * 11 + 1.6}`} /><text className={c.tx} x={(X(a) + X(b)) / 2} y={22 + i * 11 - 2} textAnchor="middle">{t}</text></g>)}
      </svg>
      <div className={c.pair}><button type="button" onClick={() => setK((v) => (v >= 4 ? 0 : v + 1))}>{k >= 4 ? 'Replay' : 'Next message'}</button></div>
    </div>
  );
}

/* 37 */ const RINGS = [4, 7, 5, 9, 6, 8, 4, 7];
const RING_EDGES = RINGS.reduce((acc, w) => [...acc, acc[acc.length - 1] + w], [0]);
function TreeRings() {
  const [i, setI] = useState(-1);
  const at = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const dist = Math.hypot(((e.clientX - r.left) / r.width - 0.5) * 100, ((e.clientY - r.top) / r.height - 0.5) * 100);
    const k = RING_EDGES.findIndex((edge, idx) => idx > 0 && dist < (edge / RING_EDGES[RING_EDGES.length - 1]) * 48);
    setI(k < 0 ? -1 : k - 1);
  };
  return (
    <div className={c.fig}>
      <div className={c.ringBox} role="slider" tabIndex={0} aria-label="Tree rings, move across them to read the years" aria-valuemin={0} aria-valuemax={RINGS.length} aria-valuenow={i + 1} aria-valuetext={i < 0 ? 'none' : `Year ${i + 1}`} style={{ touchAction: 'pan-y' }}
        onPointerMove={at} onPointerLeave={(e) => { if (e.pointerType === 'mouse') setI(-1); }} onBlur={() => setI(-1)} onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.min(RINGS.length - 1, v + 1)); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.max(0, v - 1)); } }}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          {RINGS.map((w, k) => <circle key={k} className={c.tree} data-hot={k === i} cx="50" cy="50" r={((RING_EDGES[k + 1]) / RING_EDGES[RING_EDGES.length - 1]) * 48 - (w / RING_EDGES[RING_EDGES.length - 1]) * 24} style={{ strokeWidth: (w / RING_EDGES[RING_EDGES.length - 1]) * 48 }} />)}
        </svg>
      </div>
      <p className={c.sub}>{i < 0 ? 'Move across the rings' : <>year <b>{i + 1}</b> · width {RINGS[i]}</>}</p>
    </div>
  );
}

/* 38 */ function FractalTree() {
  const [v, bind] = useDrag({ init: 0.4 });
  const spread = 12 + v * 46;
  const lines = [];
  const grow = (x, y, len, ang, depth) => {
    const x2 = x + Math.sin((ang * Math.PI) / 180) * len;
    const y2 = y - Math.cos((ang * Math.PI) / 180) * len;
    lines.push(`M${f1(x)} ${f1(y)}L${f1(x2)} ${f1(y2)}`);
    if (depth > 0) { grow(x2, y2, len * 0.72, ang - spread, depth - 1); grow(x2, y2, len * 0.72, ang + spread, depth - 1); }
  };
  grow(50, 96, 20, 0, 7);
  return (
    <div className={c.fig}>
      <svg className={c.svgSq} viewBox="0 0 100 100" role="img" aria-label="A fractal tree"><path className={c.fractal} d={lines.join('')} /></svg>
      <div className={c.slide} {...bind} aria-label="Branch angle, drag to change it" style={{ ...bind.style, '--v': v }}><i /></div>
      <p className={c.sub}>angle <b>{Math.round(spread)}°</b></p>
    </div>
  );
}

/* 39 */ const koch = (level) => {
  let pts = [[4, 70], [96, 70]];
  for (let n = 0; n < level; n += 1) {
    const out = [];
    pts.forEach((p, i) => {
      if (i === pts.length - 1) { out.push(p); return; }
      const q = pts[i + 1];
      const dx = (q[0] - p[0]) / 3;
      const dy = (q[1] - p[1]) / 3;
      const a = [p[0] + dx, p[1] + dy];
      const b = [p[0] + 2 * dx, p[1] + 2 * dy];
      const peak = [a[0] + dx * 0.5 + dy * 0.866, a[1] + dy * 0.5 - dx * 0.866];
      out.push(p, a, peak, b);
    });
    pts = out;
  }
  return pts;
};
function KochCurve() {
  const [level, setLevel] = useState(3);
  const p = koch(level);
  return (
    <button type="button" className={c.chBtn} aria-label={`Koch curve at level ${level}. Click for the next level`} onClick={() => setLevel((v) => (v + 1) % 6)}>
      <svg className={c.svg} viewBox="0 0 100 80" aria-hidden="true"><path className={c.fractal} d={p.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('')} /></svg>
      <span className={c.sub}>level <b>{level}</b> · {4 ** level} segments</span>
    </button>
  );
}

/* 40 */ const tri = (x, y, s, level, out) => {
  if (!level) { out.push(`M${f1(x)} ${f1(y)}L${f1(x + s)} ${f1(y)}L${f1(x + s / 2)} ${f1(y - s * 0.866)}Z`); return; }
  tri(x, y, s / 2, level - 1, out); tri(x + s / 2, y, s / 2, level - 1, out); tri(x + s / 4, y - (s / 2) * 0.866, s / 2, level - 1, out);
};
function Sierpinski() {
  const [level, setLevel] = useState(4);
  const out = [];
  tri(4, 88, 92, level, out);
  return (
    <button type="button" className={c.chBtn} aria-label={`Sierpinski triangle at level ${level}. Click for the next level`} onClick={() => setLevel((v) => (v + 1) % 7)}>
      <svg className={c.svg} viewBox="0 0 100 92" aria-hidden="true"><path className={c.fill} d={out.join('')} /></svg>
      <span className={c.sub}>level <b>{level}</b> · {3 ** level} triangles</span>
    </button>
  );
}

/* 41 */ const PED = layoutTree({ n: 'You', kids: [{ n: 'P1', kids: [{ n: 'G1', kids: [{ n: 'H1' }, { n: 'H2' }] }, { n: 'G2', kids: [{ n: 'H3' }, { n: 'H4' }] }] }, { n: 'P2', kids: [{ n: 'G3', kids: [{ n: 'H5' }, { n: 'H6' }] }, { n: 'G4', kids: [{ n: 'H7' }, { n: 'H8' }] }] }] });
function LineageTree() {
  const [hot, setHot] = useState(-1);
  const X = (d) => 6 + (d.depth / 3) * 80;
  const Y = (d) => 5 + (d.x / (PED.leaves - 1)) * 50;
  const tops = PED.nodes.filter((d) => d.depth === 1);
  const inBranch = (d) => { let v = d; while (v && v.depth > 1) v = v.parent; return v; };
  return (
    <div className={c.col} data-hot={hot}>
      <svg className={c.svg} viewBox="0 0 100 62" aria-hidden="true">
        {PED.nodes.filter((d) => d.parent).map((d, i) => <path key={i} className={c.edge} data-hot={hot >= 0 && inBranch(d) === tops[hot]} d={`M${X(d.parent)} ${Y(d.parent)}C${(X(d.parent) + X(d)) / 2} ${Y(d.parent)} ${(X(d.parent) + X(d)) / 2} ${Y(d)} ${X(d)} ${Y(d)}`} />)}
        {PED.nodes.map((d, i) => <Box key={i} x={X(d) + 3} y={Y(d)} w={9} h={5} label={d.n.n} hot={hot >= 0 && (d === tops[hot] || inBranch(d) === tops[hot])} />)}
      </svg>
      <Legend items={['Side one', 'Side two']} hot={hot} setHot={setHot} />
    </div>
  );
}

/* 42 */ const CASC = [[14, 20], [38, 12], [62, 22], [86, 14], [24, 48], [50, 42], [76, 50], [14, 72], [40, 70], [66, 74], [90, 66], [52, 60]];
const CASC_E = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 5], [5, 6], [4, 7], [4, 8], [5, 11], [6, 10], [8, 11], [9, 11], [9, 10], [8, 9], [11, 6]];
function CascadeNodes() {
  const [origin, setOrigin] = useState(5);
  const [run, setRun] = useState(0);
  const dist = { [origin]: 0 };
  const q = [origin];
  while (q.length) { const v = q.shift(); CASC_E.forEach(([a, b]) => { const w = a === v ? b : b === v ? a : -1; if (w >= 0 && !(w in dist)) { dist[w] = dist[v] + 1; q.push(w); } }); }
  return (
    <div className={c.fig}>
      <div className={c.cascBox}>
        <svg className={c.svg} viewBox="0 0 100 86" aria-hidden="true">
          {CASC_E.map(([a, b], i) => <line key={i} className={c.edge} x1={CASC[a][0]} y1={CASC[a][1]} x2={CASC[b][0]} y2={CASC[b][1]} />)}
        </svg>
        {CASC.map(([x, y], i) => (
          <button key={`${i}-${run}`} type="button" className={c.casc} data-origin={i === origin} style={{ left: `${x}%`, top: `${(y / 86) * 100}%`, '--d': dist[i] }} aria-label={`Node ${i + 1}, click to start a cascade from here`} onClick={() => { setOrigin(i); setRun(run + 1); }} />
        ))}
      </div>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Spring graph', SpringGraph, 'drag'], ['Org chart', OrgChart, 'click'], ['File tree', FileTree, 'click'], ['Mind map', MindMap, 'hover'],
    ['Dependency graph', DependencyGraph, 'hover'], ['Decision tree', DecisionTree, 'click'], ['Flowchart steps', FlowchartSteps, 'click'], ['Radial tree', RadialTree, 'hover'],
    ['Dendrogram cut', DendrogramCut, 'drag'], ['Ring network', RingNetwork, 'click'], ['Hub and spoke', HubSpoke, 'auto'], ['Packet route', PacketRoute, 'click'],
    ['Tournament bracket', Bracket, 'click'], ['Branch graph', BranchGraph, 'hover'], ['Transit map', TransitMap, 'hover'], ['Neural layers', NeuralLayers, 'auto'],
    ['Block chain', BlockChain, 'click'], ['Linked list', LinkedList, 'click'], ['Stack and queue', StackQueue, 'click'], ['Heap tree', HeapTree, 'click'],
    ['Search tree', SearchTree, 'type'], ['Traversal steps', TraversalSteps, 'click'], ['Shortest path', ShortestPath, 'click'], ['Spanning tree', SpanningTree, 'click'],
    ['State machine', StateMachine, 'click'], ['Token pipeline', TokenPipeline, 'auto'], ['Fan-out', FanOut, 'auto'], ['Trie', Trie, 'type'],
    ['Huffman tree', HuffmanTree, 'hover'], ['Venn sets', VennSets, 'hover'], ['Maze path', MazePath, 'auto'], ['Link curve', LinkCurve, 'drag'],
    ['Arc diagram', ArcDiagram, 'hover'], ['Adjacency view', AdjacencyView, 'hover'], ['Constellation', Constellation, 'hover'], ['Sequence diagram', SequenceDiagram, 'click'],
    ['Tree rings', TreeRings, 'hover'], ['Fractal tree', FractalTree, 'drag'], ['Koch curve', KochCurve, 'click'], ['Sierpinski', Sierpinski, 'click'],
    ['Lineage tree', LineageTree, 'hover'], ['Cascade nodes', CascadeNodes, 'click'],
  ],
};
