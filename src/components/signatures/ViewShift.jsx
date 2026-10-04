import { useId, useMemo, useState } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './ViewShift.module.css';

const SPRING = { type: 'spring', stiffness: 320, damping: 36, mass: 0.9 };

/**
 * One set of records, four surfaces. Switch between Status, Logs, Reporting
 * and Query and each record's marker glides to its place in the new layout
 * (a shared layout animation), so you can follow the same record from a list
 * into a log line, a bar and a table row. The records are synthetic — no real
 * data, and no claim about any real system.
 *
 *   records: [{ id, name, state, time, by }]   states: [{ id, label }]
 *   views:   [{ id, label, note }]
 */
function Dot({ rec, reduced }) {
  return (
    <motion.i
      layoutId={`rec-${rec.id}`}
      {...fx('data.record-dot')}
      className={styles.dot}
      data-state={rec.state}
      transition={reduced ? { duration: 0 } : SPRING}
    />
  );
}

function Status({ records, states, reduced }) {
  const label = Object.fromEntries(states.map((s) => [s.id, s.label]));
  return (
    <ul className={styles.list}>
      {records.map((r) => (
        <li key={r.id}>
          <Dot rec={r} reduced={reduced} />
          <span className={styles.name}>{r.name}</span>
          <span className={styles.badge} data-state={r.state}>{label[r.state]}</span>
          <span className={styles.time}>{r.time}</span>
        </li>
      ))}
    </ul>
  );
}

function Logs({ records, states, reduced }) {
  const label = Object.fromEntries(states.map((s) => [s.id, s.label]));
  return (
    <ul className={clsx(styles.list, styles.mono)}>
      {records.map((r) => (
        <li key={r.id}>
          <Dot rec={r} reduced={reduced} />
          <span className={styles.time}>{r.time}</span>
          <span className={styles.name}>{r.name} → {label[r.state].toLowerCase()}</span>
          <span className={styles.by}>by {r.by}</span>
        </li>
      ))}
    </ul>
  );
}

function Reporting({ records, states, reduced }) {
  const max = Math.max(...states.map((s) => records.filter((r) => r.state === s.id).length));
  return (
    <ul className={styles.bars}>
      {states.map((s) => {
        const group = records.filter((r) => r.state === s.id);
        return (
          <li key={s.id}>
            <span className={styles.barLabel}>{s.label}</span>
            <span className={styles.barTrack} style={{ '--w': `${(group.length / max) * 100}%` }}>
              <span className={styles.barFill}>
                {group.map((r) => <Dot key={r.id} rec={r} reduced={reduced} />)}
              </span>
            </span>
            <span className={styles.barCount}>{group.length}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Query({ records, states, reduced }) {
  const [q, setQ] = useState('');
  const label = Object.fromEntries(states.map((s) => [s.id, s.label]));
  const needle = q.trim().toLowerCase();
  const hits = records.filter((r) => !needle || r.name.toLowerCase().includes(needle) || label[r.state].toLowerCase().includes(needle));
  return (
    <div>
      <label className={styles.search}>
        <span className="sr-only">Filter records</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “review” or “0004”" spellCheck={false} />
        <span className={styles.hits}>{hits.length} / {records.length}</span>
      </label>
      <ul className={styles.list}>
        {records.map((r) => {
          const hit = hits.includes(r);
          return (
            <li key={r.id} className={clsx(!hit && styles.off)}>
              <Dot rec={r} reduced={reduced} />
              <span className={styles.name}>{r.name}</span>
              <span className={styles.badge} data-state={r.state}>{label[r.state]}</span>
              <span className={styles.time}>{r.time}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const VIEW = { status: Status, logs: Logs, reporting: Reporting, query: Query };

export default function ViewShift({ eyebrow, title, intro, records, states, views, note }) {
  const uid = useId();
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState(views[0].id);
  const current = useMemo(() => views.find((v) => v.id === view), [views, view]);
  const Body = VIEW[view];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('data.view-shift')}>
        <div className={styles.top}>
          <GlideTabs tabs={views.map((v) => ({ id: v.id, label: v.label }))} value={view} onChange={setView} label="Surface" idPrefix="view-shift" {...fx('data.surface-tabs')} />
          <span className={styles.tag}>SYNTHETIC RECORDS</span>
        </div>
        <div className={styles.frame} role="tabpanel" id={`view-shift-panel-${view}`} aria-labelledby={`view-shift-tab-${view}`}>
          <p className={styles.viewNote} key={view}>{current.note}</p>
          <LayoutGroup id={uid}>
            <div key={view} className={styles.body}>
              <Body records={records} states={states} reduced={reduced} />
            </div>
          </LayoutGroup>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
