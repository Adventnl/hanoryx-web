import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './ProjectRhythm.module.css';

/**
 * How a piece of work moves, as a stepper you can walk (or let walk itself).
 * Each phase says what it produces, what gets decided in it, who is in the
 * room, and the one question that has to be answered before moving on.
 *
 *   phases: [{ id, name, purpose, produces[], decides[], who: 'you'|'both'|'north', gate }]
 */
export default function ProjectRhythm({ eyebrow, title, intro, phases = [], note }) {
  const reduced = usePrefersReducedMotion();
  const [at, setAt] = useState(0);
  const [auto, setAuto] = useState(false);
  const holdRef = useRef(false);
  const refs = useRef([]);
  const p = phases[at];
  const last = phases.length - 1;

  useEffect(() => {
    if (!auto || reduced) return undefined;
    const id = window.setInterval(() => { if (!holdRef.current) setAt((a) => (a + 1) % phases.length); }, 3200);
    return () => window.clearInterval(id);
  }, [auto, reduced, phases.length]);

  const onKey = (event) => {
    let n = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') n = Math.min(last, at + 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') n = Math.max(0, at - 1);
    else if (event.key === 'Home') n = 0;
    else if (event.key === 'End') n = last;
    if (n < 0) return;
    event.preventDefault();
    setAuto(false);
    setAt(n);
    refs.current[n]?.focus();
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} onPointerEnter={() => { holdRef.current = true; }} onPointerLeave={() => { holdRef.current = false; }} {...fx('rhythm.stepper')}>
        <div className={styles.rail} role="radiogroup" aria-label="Phase of the work" onKeyDown={onKey} style={{ '--n': phases.length, '--at': at }}>
          <span className={styles.track} aria-hidden="true"><span className={styles.fill} /></span>
          <span className={styles.walker} aria-hidden="true" {...fx('rhythm.walker')} />
          {phases.map((ph, i) => (
            <button
              key={ph.id}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={i === at}
              tabIndex={i === at ? 0 : -1}
              className={clsx(styles.stop, i <= at && styles.reached, i === at && styles.here)}
              onClick={() => { setAuto(false); setAt(i); }}
            >
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.name}>{ph.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.panel} role="region" aria-live="polite" aria-label={`${p.name}: detail`} key={p.id} {...fx('rhythm.detail')}>
          <div className={styles.lead}>
            <h3>{p.name}</h3>
            <p>{p.purpose}</p>
            <div className={styles.who} aria-label={`In the room: ${p.who === 'both' ? 'you and Hanoryx North' : p.who === 'you' ? 'you' : 'Hanoryx North'}`} {...fx('rhythm.who-strip')}>
              <span className={clsx(styles.badge, (p.who === 'you' || p.who === 'both') && styles.badgeOn)}>You</span>
              <span className={styles.link} aria-hidden="true" />
              <span className={clsx(styles.badge, (p.who === 'north' || p.who === 'both') && styles.badgeOn)}>Hanoryx North</span>
            </div>
          </div>
          <div className={styles.col}>
            <p className={styles.kicker}>Produces</p>
            <ul>{p.produces.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className={styles.col}>
            <p className={styles.kicker}>Decided here</p>
            <ul>{p.decides.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className={styles.gate} {...fx('rhythm.gate')}>
            <p className={styles.kicker}>To move on, answer</p>
            <p className={styles.q}>{p.gate}</p>
          </div>
        </div>

        <div className={styles.controls}>
          <button type="button" className={styles.btn} onClick={() => { setAt((a) => Math.max(0, a - 1)); setAuto(false); }} disabled={at === 0}>Back</button>
          <button type="button" className={styles.btn} onClick={() => { setAt((a) => Math.min(last, a + 1)); setAuto(false); }} disabled={at === last}>Next phase</button>
          {!reduced && (
            <button type="button" className={clsx(styles.btn, auto && styles.on)} onClick={() => setAuto((v) => !v)} aria-pressed={auto} {...fx('rhythm.autoplay')}>
              {auto ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />} {auto ? 'Pause' : 'Walk me through'}
            </button>
          )}
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
