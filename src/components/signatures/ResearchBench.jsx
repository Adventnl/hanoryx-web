import { useId, useRef, useState } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { KeyCap } from '../fx/KeyCap';
import { LiveBudget } from './LiveBudget';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './ResearchBench.module.css';

const SPRING = { type: 'spring', stiffness: 520, damping: 38, mass: 0.7 };

/* ---------- 2. a still state for motion ---------- */
function Still() {
  const system = usePrefersReducedMotion();
  const [pretend, setPretend] = useState(false);
  const still = pretend || system;
  return (
    <div className={styles.still}>
      <div className={clsx(styles.orbit, still && styles.frozen)} aria-hidden="true">
        <span className={styles.orbitRing} />
        <span className={styles.orbitDot} />
        <span className={styles.orbitLabel}>PHASE 3 / 4</span>
      </div>
      <div className={styles.stillCopy}>
        <p>
          {still
            ? 'Motion is off. The marker rests where the animation would be, and the label says the same thing in words — nothing is lost.'
            : 'The marker travels the ring and the label reads out its phase. Switch motion off to see the still version.'}
        </p>
        <label className={styles.switchRow}>
          <input type="checkbox" checked={pretend} onChange={(e) => setPretend(e.target.checked)} />
          <span className={styles.switch} aria-hidden="true"><i /></span>
          <span>Pretend motion is reduced</span>
        </label>
        <p className={styles.sysLine}>
          Your system setting: <b>{system ? 'reduce motion' : 'no preference'}</b>
        </p>
      </div>
    </div>
  );
}

/* ---------- 3. a focus ring that glides ---------- */
function Focus() {
  const uid = useId();
  const [active, setActive] = useState(-1);
  const refs = useRef([]);
  const labels = ['Overview', 'Records', 'Reports', 'Settings'];
  const onKeyDown = (event, i) => {
    let next = -1;
    if (event.key === 'ArrowRight') next = (i + 1) % labels.length;
    else if (event.key === 'ArrowLeft') next = (i - 1 + labels.length) % labels.length;
    if (next < 0) return;
    event.preventDefault();
    refs.current[next]?.focus();
  };
  return (
    <div className={styles.focus}>
      <p>
        Press <KeyCap>Tab</KeyCap> to enter the row, then <KeyCap>←</KeyCap> <KeyCap>→</KeyCap> to move. The ring follows the focus instead of jumping.
      </p>
      <div className={styles.row} role="group" aria-label="Focus demonstration" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setActive(-1); }}>
        {labels.map((l, i) => (
          <button
            key={l}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            tabIndex={i === Math.max(active, 0) ? 0 : -1}
            className={styles.item}
            onFocus={() => setActive(i)}
            onPointerEnter={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {active === i && <motion.span layoutId={`${uid}-ring`} className={styles.ring} transition={SPRING} />}
            <span>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const PANELS = { budget: LiveBudget, still: Still, focus: Focus };

/**
 * A small bench of three working studies from this very site. They are live:
 * the numbers in the first are read from this page on this device, the second
 * answers your system's motion setting, the third is a real keyboard row.
 *
 *   experiments: [{ id, label, title, body }]
 */
export default function ResearchBench({ eyebrow, title, intro, experiments, note }) {
  const [id, setId] = useState(experiments[0].id);
  const current = experiments.find((e) => e.id === id);
  const Panel = PANELS[id];
  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('research.bench')}>
        <GlideTabs tabs={experiments.map((e) => ({ id: e.id, label: e.label }))} value={id} onChange={setId} label="Study" idPrefix="bench" />
        <div className={styles.frame} role="tabpanel" id={`bench-panel-${id}`} aria-labelledby={`bench-tab-${id}`}>
          <div className={styles.copy} key={id}>
            <h3>{current.title}</h3>
            <p>{current.body}</p>
          </div>
          <div className={styles.demo} key={`${id}-demo`}><Panel /></div>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
