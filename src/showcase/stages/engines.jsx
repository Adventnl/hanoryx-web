import { useCallback, useContext, useRef } from 'react';
import clsx from 'clsx';
import { Specimen } from '../Specimen';
import { StageApiContext, pad2, useStageVars } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import s from './stages.module.css';

/* ============================================================
   STAGES — how a page moves. Each engine takes the same four things
   ({ meta, no, Visual, items }) and lays the specimens out so that the scroll
   itself drives them. They share one idea: useStageVars writes --p / --pin / --f
   (see hooks.js) onto a small part of the tree and CSS turns those numbers into
   transforms. Nothing here animates by itself, and nothing re-renders per frame.

   Pinned engines are a tall track holding a sticky screen; the rest scroll
   normally and keep their still side in a sticky panel. Under a phone width or
   reduced motion a page uses `flow`; `?view=sheet` shows every specimen at once.
   ============================================================ */

/* One specimen, drawn from an items entry: [name, Component, mode]. */
function spec(meta, no, items, i, inert = false) {
  const [name, Comp, mode] = items[i];
  return (
    <Specimen key={name} no={no} i={i} name={name} mode={mode} slug={meta.slug} inert={inert}>
      <Comp />
    </Specimen>
  );
}

/* The readout that sits under the pinned visual: where you are in the page. */
function Hud({ no, items, active }) {
  const name = items[active]?.[0] || '';
  return (
    <div className={s.hud} aria-hidden="true">
      <span className={s.hudNo}>{pad2(no)}.{pad2(active + 1)}</span>
      <span className={s.hudName}>{name}</span>
      <span className={s.hudCount}>{pad2(active + 1)} / {pad2(items.length)}</span>
      <span className={s.hudBar}><i /></span>
    </div>
  );
}

/* The visual gets a box it can size itself in: it draws in container units
   (cqw / cqh / cqmin), so the same piece fits a half screen or a phone band. */
function Visual({ Visual: V }) {
  return <div className={s.visual}><V /></div>;
}

const common = (meta) => ({ 'data-frame': meta.frame, 'data-ground': meta.ground, 'aria-label': `${meta.title}: specimens` });

/* ---------- pinned left / pinned right ---------- */
function Split({ meta, no, Visual: V, items, mirror = false }) {
  const root = useRef(null);
  const panel = useRef(null);
  const active = useStageVars(root, { count: items.length, target: panel });
  return (
    <section ref={root} className={clsx(s.split, mirror && s.mirror, 'sc-reveal')} data-engine={mirror ? 'splitR' : 'split'} {...common(meta)}>
      <div className={s.side}>
        <div ref={panel} className={s.panel}>
          <Visual Visual={V} />
          <Hud no={no} items={items} active={active} />
        </div>
      </div>
      <ol className={s.splitList}>
        {items.map((_, i) => <li key={i}>{spec(meta, no, items, i)}</li>)}
      </ol>
    </section>
  );
}
const SplitR = (props) => <Split {...props} mirror />;

/* ---------- a live index on the left, one full screen per specimen ---------- */
function Index({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const panel = useRef(null);
  const { jump } = useContext(StageApiContext);
  const active = useStageVars(root, { count: items.length, target: panel });
  return (
    <section ref={root} className={clsx(s.index, 'sc-reveal')} data-engine="index" {...common(meta)}>
      <aside className={s.side}>
        <div ref={panel} className={clsx(s.panel, s.indexPanel)}>
          <Visual Visual={V} />
          <nav className={s.drum} aria-label="Specimens on this page">
            <ol className={s.drumList}>
              {items.map(([name], i) => (
                <li key={name} style={{ '--k': i }}>
                  <button type="button" onClick={() => jump(i)} aria-current={i === active ? 'true' : undefined}>
                    <span>{pad2(i + 1)}</span>{name}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <Hud no={no} items={items} active={active} />
        </div>
      </aside>
      <div className={s.indexMain}>
        {items.map((it, i) => (
          <div key={it[0]} className={s.slot}>
            <span className={s.ghost} aria-hidden="true">{pad2(i + 1)}</span>
            {spec(meta, no, items, i)}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- two columns drifting in opposite directions ---------- */
function Counter({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const view = useRef(null);
  const active = useStageVars(root, { count: items.length, pinned: true, target: view });
  const half = Math.ceil(items.length / 2);
  const column = (from, to, cls) => (
    <ol className={clsx(s.col, cls)}>
      {items.slice(from, to).map((_, j) => <li key={from + j} className={s.cell}>{spec(meta, no, items, from + j)}</li>)}
    </ol>
  );
  return (
    <section ref={root} className={s.counter} style={{ '--rows': half }} data-engine="counter" {...common(meta)}>
      <div ref={view} className={s.pin} data-ground={meta.ground}>
        <div className={s.counterVisual}><Visual Visual={V} /></div>
        {column(0, half, s.colL)}
        {column(half, items.length, s.colR)}
        <Hud no={no} items={items} active={active} />
      </div>
    </section>
  );
}

/* ---------- scrolling down drives a track sideways ---------- */
function Rail({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const view = useRef(null);
  const active = useStageVars(root, { count: items.length, pinned: true, target: view });
  return (
    <section ref={root} className={s.rail} style={{ '--n': items.length }} data-engine="rail" {...common(meta)}>
      <div ref={view} className={s.pin} data-ground={meta.ground}>
        <div className={s.railVisual}><Visual Visual={V} /></div>
        <div className={s.railWindow}>
          <ol className={s.railTrack}>
            {items.map((_, i) => <li key={i}>{spec(meta, no, items, i, Math.abs(i - active) > 2)}</li>)}
          </ol>
        </div>
        <Hud no={no} items={items} active={active} />
      </div>
    </section>
  );
}

/* ---------- specimens pile up like a deck ---------- */
function Stack({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const panel = useRef(null);
  const list = useRef(null);
  // The cards stick, so where they are drawn says nothing about where the reader is:
  // measure the list instead (its padding, then one pitch per card).
  const n = items.length;
  const locate = useCallback(() => {
    const el = list.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const top = parseFloat(cs.paddingTop);
    const pitch = (r.height - top - parseFloat(cs.paddingBottom)) / n;
    return (110 - r.top - top) / pitch / Math.max(1, n - 1);
  }, [n]);
  const active = useStageVars(root, { count: n, target: panel, locate });
  return (
    <section ref={root} className={clsx(s.split, s.stack)} data-engine="stack" {...common(meta)}>
      <div className={s.side}>
        <div ref={panel} className={s.panel}>
          <Visual Visual={V} />
          <Hud no={no} items={items} active={active} />
        </div>
      </div>
      <ol ref={list} className={s.stackList}>
        {items.map((_, i) => <li key={i} style={{ '--k': i }}>{spec(meta, no, items, i)}</li>)}
      </ol>
    </section>
  );
}

/* ---------- a still centre; specimens arrive from both sides ---------- */
function Orbit({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const panel = useRef(null);
  const active = useStageVars(root, { count: items.length, target: panel });
  const side = (parity, cls) => (
    <ol className={clsx(s.orbitCol, cls)}>
      {items.map((_, i) => (i % 2 === parity ? <li key={i}>{spec(meta, no, items, i)}</li> : null))}
    </ol>
  );
  return (
    <section ref={root} className={s.orbit} data-engine="orbit" {...common(meta)}>
      {side(0, s.orbitL)}
      <div className={s.orbitMid}>
        <div ref={panel} className={clsx(s.panel, s.orbitPanel)}>
          <Visual Visual={V} />
          <Hud no={no} items={items} active={active} />
        </div>
      </div>
      {side(1, s.orbitR)}
    </section>
  );
}

/* ---------- a line fills as you scroll; specimens branch from it ---------- */
function Spine({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const rail = useRef(null);
  const active = useStageVars(root, { count: items.length, target: rail });
  return (
    <section ref={root} className={s.spine} data-engine="spine" {...common(meta)}>
      <div ref={rail} className={s.spineRail} aria-hidden="true">
        <i className={s.spineFill} />
        <div className={s.bead}><Visual Visual={V} /></div>
      </div>
      <ol className={s.spineList}>
        {items.map((_, i) => (
          <li key={i} className={clsx(s.branch, i % 2 ? s.right : s.left, i <= active && s.lit)}>
            <span className={s.node} aria-hidden="true" />
            {spec(meta, no, items, i)}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- specimens ride a ring that turns with the page ---------- */
function Wheel({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const view = useRef(null);
  const active = useStageVars(root, { count: items.length, pinned: true, target: view });
  return (
    <section ref={root} className={s.wheel} style={{ '--n': items.length }} data-engine="wheel" {...common(meta)}>
      <div ref={view} className={s.pin} data-ground={meta.ground}>
        <div className={s.sideVisual}><Visual Visual={V} /></div>
        <div className={s.wheelStage}>
          <div className={s.ring}>
            {items.map((_, i) => (
              <div key={i} className={s.facet} style={{ '--k': i }}>{spec(meta, no, items, i, Math.abs(i - active) > 1)}</div>
            ))}
          </div>
        </div>
        <Hud no={no} items={items} active={active} />
      </div>
    </section>
  );
}

/* ---------- the camera moves forward through a column of specimens ---------- */
function Tunnel({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const view = useRef(null);
  const active = useStageVars(root, { count: items.length, pinned: true, target: view });
  return (
    <section ref={root} className={s.tunnel} style={{ '--n': items.length }} data-engine="tunnel" {...common(meta)}>
      <div ref={view} className={s.pin} data-ground={meta.ground}>
        <div className={s.sideVisual}><Visual Visual={V} /></div>
        <div className={s.deepStage}>
          {items.map((_, i) => (
            <div key={i} className={s.deep} style={{ '--k': i }}>{spec(meta, no, items, i, Math.abs(i - active) > 1)}</div>
          ))}
        </div>
        <Hud no={no} items={items} active={active} />
      </div>
    </section>
  );
}

/* ---------- one specimen at a time, cut in by a moving edge ---------- */
function Slides({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const view = useRef(null);
  const active = useStageVars(root, { count: items.length, pinned: true, target: view });
  return (
    <section ref={root} className={s.slides} style={{ '--n': items.length }} data-engine="slides" {...common(meta)}>
      <div ref={view} className={s.pin} data-ground={meta.ground}>
        <div className={s.sideVisual}><Visual Visual={V} /></div>
        <div className={s.slideStage}>
          {items.map((_, i) => (
            <div key={i} className={s.slide} data-ground={meta.ground} style={{ '--k': i, visibility: Math.abs(i - active) > 1 ? 'hidden' : 'visible' }}>
              <span className={s.ghost} aria-hidden="true">{pad2(i + 1)}</span>
              {spec(meta, no, items, i, i !== active)}
            </div>
          ))}
        </div>
        <Hud no={no} items={items} active={active} />
      </div>
    </section>
  );
}

/* ---------- columns at different speeds beside a fixed panel ---------- */
function Columns({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const active = useStageVars(root, { count: items.length });
  const col = (parity, cls) => (
    <ol className={clsx(s.parallax, cls)}>
      {items.map((_, i) => (i % 2 === parity ? <li key={i}>{spec(meta, no, items, i)}</li> : null))}
    </ol>
  );
  return (
    <section ref={root} className={clsx(s.split, s.columns)} data-engine="columns" {...common(meta)}>
      <div className={s.side}>
        <div className={s.panel}>
          <Visual Visual={V} />
          <Hud no={no} items={items} active={active} />
        </div>
      </div>
      <div className={s.columnsMain}>
        {col(0, s.colA)}
        {col(1, s.colB)}
      </div>
    </section>
  );
}

/* ---------- the page pans across a large field along a path ---------- */
function MapStage({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const view = useRef(null);
  const active = useStageVars(root, { count: items.length, pinned: true, target: view });
  const cols = 8;
  return (
    <section ref={root} className={s.map} style={{ '--n': items.length, '--cols': cols, '--rows': Math.ceil(items.length / cols) }} data-engine="map" {...common(meta)}>
      <div ref={view} className={s.pin} data-ground={meta.ground}>
        <div className={s.mapField}>
          <div className={s.world}>
            {items.map((_, i) => {
              /* the path snakes: odd rows run right to left, so the tiles are laid out that way */
              const row = Math.floor(i / cols);
              const col = i % cols;
              return (
                <div key={i} className={s.tile} style={{ gridRow: row + 1, gridColumn: row % 2 ? cols - col : col + 1 }}>
                  {spec(meta, no, items, i, Math.abs(i - active) > 9)}
                </div>
              );
            })}
          </div>
        </div>
        <div className={s.mapHud}>
          <Visual Visual={V} />
          <Hud no={no} items={items} active={active} />
        </div>
      </div>
    </section>
  );
}

/* ---------- rows slide in alternating directions ---------- */
function Rows({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const view = useRef(null);
  const active = useStageVars(root, { count: items.length, pinned: true, target: view });
  const belts = 3;
  const per = Math.ceil(items.length / belts);
  return (
    <section ref={root} className={s.rows} style={{ '--n': items.length, '--per-belt': per }} data-engine="rows" {...common(meta)}>
      <div ref={view} className={s.pin} data-ground={meta.ground}>
        <div className={s.sideVisual}><Visual Visual={V} /></div>
        <div className={s.beltView}>
          {Array.from({ length: belts }, (_, r) => (
            <ol key={r} className={s.belt} style={{ '--r': r }}>
              {items.slice(r * per, (r + 1) * per).map((_, j) => <li key={j}>{spec(meta, no, items, r * per + j)}</li>)}
            </ol>
          ))}
        </div>
        <Hud no={no} items={items} active={active} />
      </div>
    </section>
  );
}

/* ---------- flow: a phone, or reduced motion. The visual rides the top. ---------- */
function Flow({ meta, no, Visual: V, items }) {
  const root = useRef(null);
  const band = useRef(null);
  useStageVars(root, { count: items.length, target: band });
  return (
    <section ref={root} className={s.flow} data-engine="flow" {...common(meta)}>
      <div ref={band} className={s.band}><Visual Visual={V} /></div>
      <ol className={s.flowList}>
        {items.map((_, i) => <li key={i}>{spec(meta, no, items, i)}</li>)}
      </ol>
    </section>
  );
}

/* ---------- the sheet: every specimen at once ---------- */
function Sheet({ meta, no, items }) {
  return (
    <section className={s.sheetWrap} data-engine="sheet" {...common(meta)}>
      <ol className="sc-sheet">
        {items.map((_, i) => <li key={i}>{spec(meta, no, items, i)}</li>)}
      </ol>
    </section>
  );
}

const ENGINES = {
  split: Split, splitR: SplitR, index: Index, counter: Counter, rail: Rail, stack: Stack, orbit: Orbit, spine: Spine,
  wheel: Wheel, tunnel: Tunnel, slides: Slides, columns: Columns, map: MapStage, rows: Rows, flow: Flow, sheet: Sheet,
};

/** Picks the engine for a page: its own, unless the screen or the visitor asks
 *  for the plain one (or the sheet was asked for). */
export function Stage({ meta, no, Visual: V, items, view }) {
  const narrow = useMediaQuery('(max-width: 900px)');
  const reduced = usePrefersReducedMotion();
  const kind = view === 'sheet' ? 'sheet' : narrow || reduced ? 'flow' : ENGINES[view] ? view : meta.engine;
  const Engine = ENGINES[kind] || Flow;
  return <Engine key={kind} meta={meta} no={no} Visual={V} items={items} />;
}

export default Stage;
