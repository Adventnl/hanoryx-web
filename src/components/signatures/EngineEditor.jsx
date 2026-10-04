import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Box, Circle, Play, Plus, Square, Trash2 } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { subscribe } from '../../animation/rafScheduler';
import { maxDpr } from '../../animation/motionBudget';
import { useOnScreen } from '../../hooks/useOnScreen';
import { fx } from '../../utils/fx';
import styles from './EngineEditor.module.css';

/* The editor here is an ILLUSTRATION of the idea behind YK Engine's editor and
   player — the same entity/component data authored in one place and run in the
   other. It is a small self-contained demo, not the engine and not engine output. */
const WORLD = { w: 640, h: 400 };
const MAX_ENTITIES = 14;

const SEED = [
  { id: 1, name: 'Hero', kind: 'disc', x: 150, y: 250, size: 38, rot: 0, vx: 70, vy: -42, body: true, tone: 'red' },
  { id: 2, name: 'Crate', kind: 'box', x: 330, y: 200, size: 54, rot: 12, vx: 0, vy: 0, body: false, tone: 'white' },
  { id: 3, name: 'Platform', kind: 'box', x: 470, y: 320, size: 80, rot: 0, vx: -38, vy: 0, body: true, tone: 'white' },
  { id: 4, name: 'Coin', kind: 'disc', x: 250, y: 110, size: 24, rot: 0, vx: 28, vy: 34, body: true, tone: 'red' },
  { id: 5, name: 'Switch', kind: 'box', x: 90, y: 100, size: 30, rot: 0, vx: 0, vy: 0, body: false, tone: 'white' },
];

let nextId = 100;
const clone = (list) => list.map((e) => ({ ...e }));

/* Tracks the rotated-box / disc under a point (world units). */
function hit(list, x, y) {
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const e = list[i];
    const dx = x - e.x;
    const dy = y - e.y;
    if (e.kind === 'disc') {
      if (dx * dx + dy * dy <= (e.size / 2) ** 2) return e.id;
    } else {
      const a = (-e.rot * Math.PI) / 180;
      const lx = dx * Math.cos(a) - dy * Math.sin(a);
      const ly = dx * Math.sin(a) + dy * Math.cos(a);
      if (Math.abs(lx) <= e.size / 2 && Math.abs(ly) <= e.size / 2) return e.id;
    }
  }
  return null;
}

export default function EngineEditor({ eyebrow, title, intro, caption }) {
  const [entities, setEntities] = useState(() => clone(SEED));
  const [selected, setSelected] = useState(1);
  const [mode, setMode] = useState('editor'); // 'editor' | 'player'
  const [exportState, setExportState] = useState('idle'); // idle | running | done
  const [exportStep, setExportStep] = useState(0);
  const [stats, setStats] = useState({ ms: 16.7, fps: 60 });

  const [hostRef, onScreen] = useOnScreen({ rootMargin: '120px 0px' });
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const simRef = useRef(clone(SEED)); // the live (mutating) world
  const snapRef = useRef(null); // authored snapshot taken at Play
  const dirty = useRef(true);
  const dragRef = useRef(null);
  const modeRef = useRef('editor');
  const selRef = useRef(1);
  const framesRef = useRef(new Float32Array(96));
  const frameIdx = useRef(0);

  // keep refs readable by the frame loop without re-subscribing it
  useEffect(() => { modeRef.current = mode; dirty.current = true; }, [mode]);
  useEffect(() => { selRef.current = selected; dirty.current = true; }, [selected]);

  const sync = useCallback(() => setEntities(clone(simRef.current)), []);

  // ---- drawing ----
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = maxDpr();
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    const s = W / WORLD.w;
    ctx.setTransform(dpr * s, 0, 0, dpr * s, 0, 0);
    ctx.clearRect(0, 0, WORLD.w, WORLD.h);
    // grid
    ctx.lineWidth = 1 / s;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    for (let x = 0; x <= WORLD.w; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, WORLD.h); }
    for (let y = 0; y <= WORLD.h; y += 40) { ctx.moveTo(0, y); ctx.lineTo(WORLD.w, y); }
    ctx.stroke();
    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath();
    ctx.moveTo(0, WORLD.h - 0.5); ctx.lineTo(WORLD.w, WORLD.h - 0.5);
    ctx.moveTo(0.5, 0); ctx.lineTo(0.5, WORLD.h);
    ctx.stroke();

    simRef.current.forEach((e) => {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate((e.rot * Math.PI) / 180);
      const red = e.tone === 'red';
      ctx.fillStyle = red ? 'rgba(255,51,51,0.2)' : 'rgba(255,255,255,0.08)';
      ctx.strokeStyle = red ? 'rgba(255,51,51,0.85)' : 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.4 / s;
      if (e.kind === 'disc') {
        ctx.beginPath(); ctx.arc(0, 0, e.size / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(e.size / 2, 0); ctx.stroke();
      } else {
        ctx.fillRect(-e.size / 2, -e.size / 2, e.size, e.size);
        ctx.strokeRect(-e.size / 2, -e.size / 2, e.size, e.size);
      }
      ctx.restore();
    });

    // selection frame + gizmo (editor chrome — hidden while the player runs)
    const sel = simRef.current.find((e) => e.id === selRef.current);
    if (sel && modeRef.current === 'editor') {
      const r = sel.size / 2 + 8;
      ctx.save();
      ctx.translate(sel.x, sel.y);
      ctx.strokeStyle = 'rgba(255,51,51,0.95)';
      ctx.fillStyle = 'rgba(255,51,51,0.95)';
      ctx.lineWidth = 1 / s;
      ctx.strokeRect(-r, -r, r * 2, r * 2);
      [[-r, -r], [r, -r], [-r, r], [r, r]].forEach(([dx, dy]) => ctx.fillRect(dx - 3, dy - 3, 6, 6));
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(r + 20, 0);
      ctx.moveTo(0, 0); ctx.lineTo(0, -r - 20);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r + 20, 0); ctx.lineTo(r + 13, -4); ctx.lineTo(r + 13, 4); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -r - 20); ctx.lineTo(-4, -r - 13); ctx.lineTo(4, -r - 13); ctx.fill();
      ctx.restore();
    }
  }, []);

  const drawGraph = useCallback(() => {
    const canvas = graphRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = maxDpr();
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (canvas.width !== Math.round(W * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const f = framesRef.current;
    const bw = W / f.length;
    // 16.7ms budget line
    const ty = H - (16.7 / 40) * H;
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(W, ty); ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < f.length; i += 1) {
      const v = f[(frameIdx.current + i) % f.length];
      const h = Math.min(H, (v / 40) * H);
      ctx.fillStyle = v > 24 ? 'rgba(255,51,51,0.9)' : 'rgba(255,255,255,0.45)';
      ctx.fillRect(i * bw, H - h, Math.max(1, bw - 0.5), h);
    }
  }, []);

  // ---- simulation + frame loop (only while on screen) ----
  useEffect(() => {
    if (!onScreen) return undefined;
    let last = 0;
    let counter = 0;
    let acc = 0;
    let accN = 0;
    const unsub = subscribe((now) => {
      if (last) {
        const dt = Math.min(now - last, 100);
        framesRef.current[frameIdx.current % framesRef.current.length] = dt;
        frameIdx.current += 1;
        acc += dt;
        accN += 1;
        if (modeRef.current === 'player') {
          const sec = dt / 1000;
          simRef.current.forEach((e) => {
            if (!e.body) return;
            e.x += e.vx * sec;
            e.y += e.vy * sec;
            e.rot += e.vx * sec * 0.6;
            const half = e.size / 2;
            if (e.x < half || e.x > WORLD.w - half) { e.vx *= -1; e.x = Math.max(half, Math.min(WORLD.w - half, e.x)); }
            if (e.y < half || e.y > WORLD.h - half) { e.vy *= -1; e.y = Math.max(half, Math.min(WORLD.h - half, e.y)); }
          });
          dirty.current = true;
        }
        counter += 1;
        if (counter % 3 === 0) drawGraph();
        if (counter % 12 === 0 && accN) {
          const avg = acc / accN;
          setStats({ ms: avg, fps: 1000 / avg });
          if (modeRef.current === 'player') sync();
          acc = 0;
          accN = 0;
        }
      }
      last = now;
      if (dirty.current) {
        dirty.current = false;
        draw();
      }
    });
    return unsub;
  }, [onScreen, draw, drawGraph, sync]);

  // ---- editing ----
  const toWorld = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * WORLD.w, y: ((event.clientY - rect.top) / rect.height) * WORLD.h };
  };
  const onPointerDown = (event) => {
    const p = toWorld(event);
    const id = hit(simRef.current, p.x, p.y);
    setSelected(id);
    selRef.current = id;
    dirty.current = true;
    if (id && modeRef.current === 'editor') {
      const e = simRef.current.find((x) => x.id === id);
      dragRef.current = { id, dx: e.x - p.x, dy: e.y - p.y };
      canvasRef.current.setPointerCapture(event.pointerId);
    }
  };
  const onPointerMove = (event) => {
    const d = dragRef.current;
    if (!d) return;
    const p = toWorld(event);
    const e = simRef.current.find((x) => x.id === d.id);
    if (!e) return;
    e.x = Math.max(0, Math.min(WORLD.w, p.x + d.dx));
    e.y = Math.max(0, Math.min(WORLD.h, p.y + d.dy));
    dirty.current = true;
  };
  const onPointerUp = () => {
    if (dragRef.current) sync();
    dragRef.current = null;
  };
  const onKeyDown = (event) => {
    const e = simRef.current.find((x) => x.id === selRef.current);
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      removeSelected();
      return;
    }
    if (!e || modeRef.current !== 'editor') return;
    const step = event.shiftKey ? 10 : 2;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!d) return;
    event.preventDefault();
    e.x = Math.max(0, Math.min(WORLD.w, e.x + d[0]));
    e.y = Math.max(0, Math.min(WORLD.h, e.y + d[1]));
    dirty.current = true;
    sync();
  };

  const addEntity = (kind) => {
    if (simRef.current.length >= MAX_ENTITIES) return;
    nextId += 1;
    const n = simRef.current.filter((e) => e.kind === kind).length + 1;
    const e = { id: nextId, name: `${kind === 'disc' ? 'Disc' : 'Box'} ${n}`, kind, x: 120 + ((nextId * 53) % 400), y: 80 + ((nextId * 37) % 240), size: kind === 'disc' ? 30 : 42, rot: 0, vx: ((nextId * 17) % 90) - 45, vy: ((nextId * 29) % 70) - 35, body: true, tone: nextId % 2 ? 'white' : 'red' };
    simRef.current.push(e);
    setSelected(e.id);
    selRef.current = e.id;
    dirty.current = true;
    sync();
  };
  function removeSelected() {
    if (modeRef.current !== 'editor') return;
    const i = simRef.current.findIndex((x) => x.id === selRef.current);
    if (i < 0) return;
    simRef.current.splice(i, 1);
    const nextSel = simRef.current[Math.min(i, simRef.current.length - 1)];
    setSelected(nextSel ? nextSel.id : null);
    selRef.current = nextSel ? nextSel.id : null;
    dirty.current = true;
    sync();
  }
  const patch = (key, value) => {
    const e = simRef.current.find((x) => x.id === selRef.current);
    if (!e || Number.isNaN(value)) return;
    e[key] = value;
    dirty.current = true;
    sync();
  };

  const play = () => {
    snapRef.current = clone(simRef.current);
    setMode('player');
  };
  const stop = () => {
    if (snapRef.current) simRef.current = clone(snapRef.current);
    setMode('editor');
    dirty.current = true;
    sync();
  };

  const runExport = () => {
    if (exportState === 'running') return;
    setExportState('running');
    setExportStep(0);
    [0, 1, 2].forEach((i) => window.setTimeout(() => setExportStep(i + 1), 650 * (i + 1)));
    window.setTimeout(() => setExportState('done'), 650 * 3 + 200);
  };
  const exportLabels = ['Gather project', 'Package', 'Ready'];

  const sel = entities.find((e) => e.id === selected);
  const playing = mode === 'player';

  return (
    <div ref={hostRef} className={styles.root}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />

      <div className={clsx(styles.window, playing && styles.playing)} {...fx('yk.editor-window')}>
        <div className={styles.titlebar}>
          <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
          <span className={styles.titleText}>{playing ? 'Player' : 'Editor'} — illustration</span>
          <div className={styles.modes} role="group" aria-label="Run mode" {...fx('editor.mode-switch')}>
            <button type="button" className={clsx(styles.modeBtn, !playing && styles.modeOn)} onClick={stop} aria-pressed={!playing}>
              <Square size={13} strokeWidth={1.6} aria-hidden="true" /> Editor
            </button>
            <button type="button" className={clsx(styles.modeBtn, playing && styles.modeOn)} onClick={play} aria-pressed={playing}>
              <Play size={13} strokeWidth={1.6} aria-hidden="true" /> Player
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <aside className={clsx(styles.panel, styles.hier)} aria-label="Hierarchy">
            <div className={styles.panelHead}>
              <span>Hierarchy</span>
              <span className={styles.count}>{entities.length}/{MAX_ENTITIES}</span>
            </div>
            <ul className={styles.list} {...fx('yk.hierarchy-list')}>
              {entities.map((e) => (
                <li key={e.id}>
                  <button type="button" className={clsx(styles.item, e.id === selected && styles.itemOn)} onClick={() => { setSelected(e.id); selRef.current = e.id; dirty.current = true; }}>
                    {e.kind === 'disc' ? <Circle size={13} strokeWidth={1.5} aria-hidden="true" /> : <Box size={13} strokeWidth={1.5} aria-hidden="true" />}
                    <span>{e.name}</span>
                    {e.body && <i className={styles.tag}>Body</i>}
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.actions} {...fx('editor.entity-actions')}>
              <button type="button" onClick={() => addEntity('box')} disabled={playing || entities.length >= MAX_ENTITIES}><Plus size={13} aria-hidden="true" /> Box</button>
              <button type="button" onClick={() => addEntity('disc')} disabled={playing || entities.length >= MAX_ENTITIES}><Plus size={13} aria-hidden="true" /> Disc</button>
              <button type="button" onClick={removeSelected} disabled={playing || !sel} aria-label="Delete selected"><Trash2 size={13} aria-hidden="true" /></button>
            </div>
          </aside>

          <div className={styles.viewport}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              tabIndex={0}
              role="application"
              aria-label="Scene viewport. Click to select an entity, drag to move it, arrow keys nudge the selection, Delete removes it."
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              data-cursor="drag"
              {...fx('editor.viewport-canvas')}
            />
            <span className={styles.vpLabel}>{playing ? 'Running — same data, no editor chrome' : 'Authoring — select, drag, add'}</span>
          </div>

          <aside className={clsx(styles.panel, styles.insp)} aria-label="Inspector">
            <div className={styles.panelHead}><span>Inspector</span></div>
            {sel ? (
              <div className={styles.fields} {...fx('yk.inspector-fields')}>
                <label className={styles.field}><span>Name</span>
                  <input type="text" value={sel.name} disabled={playing} onChange={(e) => patch('name', e.target.value)} />
                </label>
                <div className={styles.group}>Transform</div>
                <label className={styles.field}><span>X</span>
                  <input type="number" value={Math.round(sel.x)} disabled={playing} onChange={(e) => patch('x', e.target.valueAsNumber)} />
                </label>
                <label className={styles.field}><span>Y</span>
                  <input type="number" value={Math.round(sel.y)} disabled={playing} onChange={(e) => patch('y', e.target.valueAsNumber)} />
                </label>
                <label className={styles.field}><span>Rotation</span>
                  <input type="number" value={Math.round(sel.rot)} disabled={playing} onChange={(e) => patch('rot', e.target.valueAsNumber)} />
                </label>
                <div className={styles.group}>Sprite</div>
                <label className={styles.field}><span>Size</span>
                  <input type="number" min="12" max="120" value={Math.round(sel.size)} disabled={playing} onChange={(e) => patch('size', Math.max(12, Math.min(120, e.target.valueAsNumber)))} />
                </label>
                <label className={clsx(styles.field, styles.check)}><span>Body</span>
                  <input type="checkbox" checked={sel.body} disabled={playing} onChange={(e) => patch('body', e.target.checked)} />
                </label>
              </div>
            ) : (
              <p className={styles.empty}>Nothing selected. Click an entity in the viewport.</p>
            )}
          </aside>
        </div>

        <div className={styles.footer}>
          <div className={styles.profiler} {...fx('yk.profiler-graph')}>
            <span className={styles.profLabel}>Profiler</span>
            <canvas ref={graphRef} className={styles.graph} aria-hidden="true" />
            <span className={styles.profVal}>{stats.ms.toFixed(1)} ms · {Math.round(stats.fps)} fps</span>
          </div>
          <span className={styles.note}>Measured from this demo, in your browser.</span>
          <div className={styles.export} {...fx('yk.export-run')}>
            <button type="button" className={styles.exportBtn} onClick={runExport} disabled={exportState === 'running'}>
              {exportState === 'running' ? exportLabels[Math.min(exportStep, 2)] : exportState === 'done' ? 'Export again' : 'Export'}
            </button>
            <span className={styles.exportTrack} aria-hidden="true">
              <span className={styles.exportFill} style={{ transform: `scaleX(${exportState === 'done' ? 1 : exportStep / 3})` }} />
            </span>
            <span className={styles.exportState} role="status" aria-live="polite">
              {exportState === 'done' ? 'Ready — illustration only' : exportState === 'running' ? `${exportLabels[Math.min(exportStep, 2)]}…` : 'Illustration'}
            </span>
          </div>
        </div>
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
