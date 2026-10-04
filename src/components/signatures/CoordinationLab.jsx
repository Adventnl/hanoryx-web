import { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { CompareSlider } from '../fx/CompareSlider';
import { Glyph } from '../fx/Glyph';
import { ScrambleText } from '../fx/ScrambleText';
import { fx } from '../../utils/fx';
import styles from './CoordinationLab.module.css';

/* The coordination lab is an ILLUSTRATION of the idea behind Musebase — many
   things placed in shared time, with access scoped by role — built from
   abstract blocks. It is not product UI, not product data, and not a
   description of any real operation. */
const LANES = ['A', 'B', 'C', 'D'];
const SLOTS = 8;
const INITIAL = [
  { id: 'b1', lane: 0, start: 0, len: 3, tone: 'a' },
  { id: 'b2', lane: 1, start: 2, len: 3, tone: 'b' },
  { id: 'b3', lane: 2, start: 1, len: 2, tone: 'a' },
  { id: 'b4', lane: 3, start: 4, len: 3, tone: 'c' },
  { id: 'b5', lane: 0, start: 5, len: 2, tone: 'b' },
  { id: 'b6', lane: 2, start: 5, len: 3, tone: 'c' },
];
const clash = (a, b) => a.lane === b.lane && a.start < b.start + b.len && b.start < a.start + a.len;

/* Scatter vs aligned arrangements for the before/after slider. */
const SCATTER = INITIAL.map((b, i) => ({ ...b, lane: (i * 3 + 1) % 4, start: (i * 5 + 2) % 6 }));

function Grid({ blocks, children }) {
  return (
    <div className={styles.grid} role="presentation">
      {LANES.map((l, i) => (
        <div key={l} className={styles.lane} style={{ '--lane': i }}>
          <span className={styles.laneName}>{l}</span>
        </div>
      ))}
      {Array.from({ length: SLOTS }, (_, i) => (
        <span key={i} className={styles.tick} style={{ '--slot': i }} aria-hidden="true" />
      ))}
      {blocks.map((b) => (
        <span key={b.id} className={clsx(styles.block, styles[`tone-${b.tone}`])} style={{ '--lane': b.lane, '--start': b.start, '--len': b.len }}>
          {b.id.toUpperCase()}
        </span>
      ))}
      {children}
    </div>
  );
}

/**
 * Musebase foreground: three interactions about one idea.
 *  1. PLACE — drag blocks across lanes and time; overlapping blocks flag, and
 *     "Resolve" glides them apart.
 *  2. COMPARE — the same set scattered vs coordinated, with a slider.
 *  3. ROLES — switch a role lens and watch the same set filter to what that
 *     role can see (a model of role-scoped access).
 */
export default function CoordinationLab({ eyebrow, title, intro, roles, notes }) {
  const [blocks, setBlocks] = useState(INITIAL);
  const [tab, setTab] = useState('place');
  const [role, setRole] = useState(roles[0].id);
  const [resolvedCount, setResolvedCount] = useState(0);
  const gridRef = useRef(null);
  const dragRef = useRef(null);
  const [dragId, setDragId] = useState(null);

  const clashes = useMemo(() => {
    const ids = new Set();
    blocks.forEach((a, i) => blocks.slice(i + 1).forEach((b) => { if (clash(a, b)) { ids.add(a.id); ids.add(b.id); } }));
    return ids;
  }, [blocks]);

  // Snap a block so it is centred on the pointer, clamped to the board.
  const place = (id, clientX, clientY) => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const laneH = rect.height / LANES.length;
    const slotW = rect.width / SLOTS;
    setBlocks((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      const lane = Math.max(0, Math.min(LANES.length - 1, Math.floor((clientY - rect.top) / laneH)));
      const start = Math.max(0, Math.min(SLOTS - b.len, Math.round((clientX - rect.left) / slotW - b.len / 2)));
      return lane === b.lane && start === b.start ? b : { ...b, lane, start };
    }));
  };
  const onPointerDown = (event, id) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = id;
    setDragId(id);
  };
  const onPointerMove = (event) => {
    if (dragRef.current) place(dragRef.current, event.clientX, event.clientY);
  };
  const endDrag = () => {
    dragRef.current = null;
    setDragId(null);
  };

  const resolve = () => {
    // Greedy: sweep by start time; a block that overlaps moves to the first free
    // lane at its slot, or slides later when every lane is taken.
    const next = [];
    [...blocks]
      .sort((a, b) => a.start - b.start || a.id.localeCompare(b.id))
      .forEach((b) => {
        let placed = { ...b };
        let guard = 0;
        while (next.some((o) => clash(o, placed)) && guard < 40) {
          guard += 1;
          const free = LANES.findIndex((_, l) => !next.some((o) => clash(o, { ...placed, lane: l })));
          placed = free >= 0 ? { ...placed, lane: free } : { ...placed, start: Math.min(SLOTS - placed.len, placed.start + 1) };
        }
        next.push(placed);
      });
    setBlocks(blocks.map((b) => next.find((n) => n.id === b.id)));
    setResolvedCount((n) => n + 1);
  };

  const visible = (b) => {
    const r = roles.find((x) => x.id === role);
    return r.sees.includes(b.tone);
  };
  const activeRole = roles.find((r) => r.id === role);

  return (
    <div className={styles.root}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />

      <div className={styles.bar}>
        <GlideTabs
          {...fx('coord.tabs')}
          idPrefix="coord"
          label="Coordination demonstration"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'place', label: 'Place' },
            { id: 'compare', label: 'Compare' },
            { id: 'roles', label: 'Roles' },
          ]}
        />
        <span className={styles.label}>Illustration — abstract blocks, not product data</span>
      </div>

      <div className={styles.stage} {...fx(`musebase.lab-${tab}`)}>
        {tab === 'place' && (
          <div role="tabpanel" id="coord-panel-place" aria-labelledby="coord-tab-place" className={styles.panel}>
            <div className={styles.toolbar}>
              <span className={clsx(styles.status, clashes.size > 0 && styles.alert)} role="status" aria-live="polite">
                <span className={styles.statusDot} />
                {clashes.size > 0 ? `${clashes.size} blocks overlap` : resolvedCount > 0 ? 'Coordinated — no overlaps' : 'No overlaps — drag a block onto another'}
              </span>
              <button type="button" className={styles.resolve} onClick={resolve} disabled={clashes.size === 0} {...fx('coord.resolve')}>
                <Glyph name="loop" size={16} /> Resolve
              </button>
              <button type="button" className={styles.reset} onClick={() => { setBlocks(INITIAL); setResolvedCount(0); }}>Reset</button>
            </div>
            <div ref={gridRef} className={styles.gridWrap}>
              <Grid blocks={[]} />
              {blocks.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  data-cursor="drag"
                  aria-label={`Block ${b.id.toUpperCase()}, lane ${LANES[b.lane]}, slots ${b.start + 1} to ${b.start + b.len}. Drag, or use the arrow keys to move.`}
                  onPointerDown={(e) => onPointerDown(e, b.id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onKeyDown={(e) => {
                    const d = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
                    if (!d) return;
                    e.preventDefault();
                    setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, lane: Math.max(0, Math.min(LANES.length - 1, x.lane + d[0])), start: Math.max(0, Math.min(SLOTS - x.len, x.start + d[1])) } : x)));
                  }}
                  {...fx('coord.draggable-block')}
                  className={clsx(styles.block, styles.drag, styles[`tone-${b.tone}`], clashes.has(b.id) && styles.clash, dragId === b.id && styles.dragging)}
                  style={{ '--lane': b.lane, '--start': b.start, '--len': b.len }}
                >
                  {b.id.toUpperCase()}
                </button>
              ))}
            </div>
            <p className={styles.hint}>Drag, or focus a block and use the arrow keys. Overlaps glow; Resolve glides them apart.</p>
          </div>
        )}

        {tab === 'compare' && (
          <div role="tabpanel" id="coord-panel-compare" aria-labelledby="coord-tab-compare" className={styles.panel}>
            <CompareSlider
              label="Scattered versus coordinated"
              beforeLabel="Scattered"
              afterLabel="Coordinated"
              initial={52}
              before={<div className={styles.cmp}><Grid blocks={SCATTER} /></div>}
              after={<div className={styles.cmp}><Grid blocks={INITIAL} /></div>}
            />
            <p className={styles.hint}>The same six blocks. Drag the handle — left is scattered, right is coordinated.</p>
          </div>
        )}

        {tab === 'roles' && (
          <div role="tabpanel" id="coord-panel-roles" aria-labelledby="coord-tab-roles" className={styles.panel}>
            <div className={styles.roleRow}>
              <GlideTabs idPrefix="roles" panels={false} label="Role lens" variant="line" value={role} onChange={setRole} tabs={roles.map((r) => ({ id: r.id, label: r.label }))} />
            </div>
            <div className={styles.gridWrap}>
              <Grid blocks={[]} />
              {INITIAL.map((b) => (
                <span
                  key={b.id}
                  className={clsx(styles.block, styles[`tone-${b.tone}`], !visible(b) && styles.hidden)}
                  style={{ '--lane': b.lane, '--start': b.start, '--len': b.len }}
                >
                  {visible(b) ? b.id.toUpperCase() : '—'}
                </span>
              ))}
            </div>
            <p className={styles.hint} role="status" aria-live="polite">
              <ScrambleText as="span" text={activeRole.label} trigger={role.length} className={styles.roleName} /> sees {activeRole.sees.length} of 3 kinds of block. {activeRole.note}
            </p>
          </div>
        )}
      </div>

      {notes?.length > 0 && (
        <ul className={styles.notes}>
          {notes.map((n) => (
            <li key={n.k}><span>{n.k}</span>{n.v}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
