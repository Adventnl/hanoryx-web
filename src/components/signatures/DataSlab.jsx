import { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { Odometer } from '../fx/Odometer';
import { fx } from '../../utils/fx';
import styles from './DataSlab.module.css';

/* A window onto a SYNTHETIC data set. Every row is computed from its index in
   your browser — there is no data, no network and no real record behind it. It
   shows how an interface can stay oriented in a very large set; it makes no claim
   about how fast or how large the real system is, and shows no timings. */
const VIEW_ROWS = 10;
const ROW_H = { compact: 32, cozy: 42 };
const MAX_SPACER = 6000000; // px: browsers cap element height, so the scroller is scaled
const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F'];
const STATES = ['Active', 'Dormant', 'New', 'Review'];

const hash = (n) => Math.imul(n + 1, 2654435761) >>> 0;
const fmt = (n) => Number(n).toLocaleString('en-US');

export default function DataSlab({ eyebrow, title, intro, sizes, caption, questions }) {
  const [size, setSize] = useState(sizes[sizes.length - 1].id);
  const [group, setGroup] = useState('all');
  const [density, setDensity] = useState('cozy');
  const [pos, setPos] = useState(0); // float row position in the (filtered) list
  const [selected, setSelected] = useState(null);
  const [jump, setJump] = useState('');
  const scrollerRef = useRef(null);
  const frame = useRef(0);

  const count = sizes.find((s) => s.id === size).value;
  const g = group === 'all' ? null : group;
  const total = g == null ? count : Math.ceil((count - g) / 6);
  const rowH = ROW_H[density];
  const viewH = VIEW_ROWS * rowH;
  const spacer = Math.min(total * rowH, MAX_SPACER);
  const maxScroll = Math.max(1, spacer - viewH);
  const maxFirst = Math.max(0, total - VIEW_ROWS);
  const first = Math.min(maxFirst, Math.floor(pos));
  const frac = pos - first;

  const onScroll = useCallback((event) => {
    const el = event.currentTarget;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const ratio = Math.min(1, Math.max(0, el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)));
      setPos(ratio * Math.max(0, (g == null ? count : Math.ceil((count - g) / 6)) - VIEW_ROWS));
    });
  }, [count, g]);

  // Reset the scroller whenever the set or density changes.
  const reset = (apply) => {
    apply();
    setPos(0);
    setSelected(null);
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
  };

  const goTo = (e) => {
    e.preventDefault();
    const n = Number(String(jump).replace(/[^0-9]/g, ''));
    if (!n || !scrollerRef.current) return;
    const idx = Math.max(0, Math.min(maxFirst, n - 1));
    scrollerRef.current.scrollTo({ top: maxFirst ? (idx / maxFirst) * maxScroll : 0, behavior: 'smooth' });
  };

  const rows = [];
  for (let i = 0; i < VIEW_ROWS + 2; i += 1) {
    const idx = first + i;
    if (idx >= total) break;
    const orig = g == null ? idx : g + idx * 6;
    const h = hash(orig);
    rows.push({ idx, orig, group: GROUPS[orig % 6], state: STATES[h % 4], score: (h >>> 8) % 100 });
  }
  const sel = selected != null ? rows.find((r) => r.orig === selected) : null;

  return (
    <div className={styles.root} {...fx('crm.data-slab')}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />

      <div className={styles.controls}>
        <GlideTabs
          idPrefix="slab-size"
          {...fx('slab.size-tabs')}
          label="Synthetic data set size"
          variant="line"
          value={size}
          onChange={(v) => reset(() => setSize(v))}
          tabs={sizes.map((s) => ({ id: s.id, label: s.label }))}
        />
        <div className={styles.groups} role="group" aria-label="Filter by group">
          {['all', ...GROUPS.map((_, i) => i)].map((v) => (
            <button key={v} type="button" className={clsx(styles.chip, group === v && styles.chipOn)} aria-pressed={group === v} onClick={() => reset(() => setGroup(v))}>
              {v === 'all' ? 'All' : GROUPS[v]}
            </button>
          ))}
        </div>
        <button type="button" className={styles.density} onClick={() => reset(() => setDensity((d) => (d === 'cozy' ? 'compact' : 'cozy')))}>
          {density === 'cozy' ? 'Compact' : 'Comfortable'}
        </button>
      </div>

      <div className={styles.slab}>
        <div className={styles.head} aria-hidden="true">
          <span>Record</span><span>Group</span><span>State</span><span>Score</span>
        </div>

        <div
          ref={scrollerRef}
          className={styles.scroller}
          style={{ height: viewH }}
          onScroll={onScroll}
          tabIndex={0}
          role="region"
          aria-label={`Synthetic rows, ${fmt(total)} in this view. Scroll or use the keyboard.`}
          data-lenis-prevent
          {...fx('slab.virtual-scroller')}
        >
          {/* sticky window first, then a spacer that supplies the scroll distance;
              total scroll height = spacer, so scrollTop maps straight to a row. */}
          <div className={styles.viewport} style={{ height: viewH }}>
            <div className={styles.rows} style={{ transform: `translate3d(0, ${-frac * rowH}px, 0)` }}>
              {rows.map((r) => (
                <button
                  key={r.orig}
                  type="button"
                  tabIndex={-1}
                  className={clsx(styles.row, selected === r.orig && styles.rowOn)}
                  style={{ height: rowH }}
                  onClick={() => setSelected(r.orig)}
                >
                  <span className={styles.id}>{fmt(r.orig + 1)}</span>
                  <span className={styles.group}>{r.group}</span>
                  <span className={clsx(styles.state, styles[`s${r.state}`])}>{r.state}</span>
                  <span className={styles.score}>
                    <span className={styles.bar}><span style={{ transform: `scaleX(${r.score / 100})` }} /></span>
                    <b>{String(r.score).padStart(2, '0')}</b>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: Math.max(0, spacer - viewH) }} aria-hidden="true" />
        </div>

        <div className={styles.rail} aria-hidden="true" {...fx('slab.scroll-thumb')}>
          <span className={styles.thumb} style={{ top: `${maxFirst ? (pos / maxFirst) * 100 : 0}%` }} />
        </div>
      </div>

      <div className={styles.readout}>
        <span className={styles.big} {...fx('slab.row-count')}><Odometer value={total} /> <small>rows in view</small></span>
        <span className={styles.range} role="status" aria-live="polite">
          Showing {fmt(first + 1)}–{fmt(Math.min(total, first + VIEW_ROWS))}
          {sel ? ` · selected record ${fmt(sel.orig + 1)}` : ''}
        </span>
        <form className={styles.jump} onSubmit={goTo} {...fx('slab.jump-form')}>
          <label htmlFor="slab-jump">Jump to row</label>
          <input id="slab-jump" inputMode="numeric" value={jump} onChange={(e) => setJump(e.target.value)} placeholder="e.g. 4201337" />
          <button type="submit">Go</button>
        </form>
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}

      {questions?.length > 0 && (
        <ul className={styles.questions}>
          {questions.map((q) => (
            <li key={q.k}><span>{q.k}</span>{q.v}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
