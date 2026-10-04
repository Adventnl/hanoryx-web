import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Check, Lock, LockOpen, RotateCcw } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { fx } from '../../utils/fx';
import styles from './GateWalk.module.css';

/**
 * "Each stage gates the next." Walk a system from intent to release: the
 * runner can only pass a gate once everything that gate asks has been ticked.
 * Passing a gate glides the runner to the next stage; the last one releases.
 * A way of working shown as a game — not a certification and not a record of
 * any real release.
 *
 *   stages: [{ id, title, body, glyph, gates: [string] }]
 */
export default function GateWalk({ eyebrow, title, intro, stages, doneTitle, doneBody, note }) {
  const n = stages.length;
  const [at, setAt] = useState(0); // index of the stage the runner is standing at; n = released
  const [ticked, setTicked] = useState(() => new Set());
  const stage = stages[Math.min(at, n - 1)];
  const released = at >= n;
  const allTicked = useMemo(() => stage.gates.every((_, i) => ticked.has(`${stage.id}:${i}`)), [stage, ticked]);

  const toggle = (i) => setTicked((prev) => {
    const key = `${stage.id}:${i}`;
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });
  const pass = () => { if (allTicked && !released) setAt((a) => a + 1); };
  const reset = () => { setAt(0); setTicked(new Set()); };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="scan" />
      <div className={styles.bench} {...fx('engineering.gate-walk')}>
        <ol className={styles.corridor} style={{ '--n': n, '--at': Math.min(at, n - 1) }} data-released={released ? 'true' : 'false'}>
          <span className={styles.track} aria-hidden="true" {...fx('gate.track-fill')}>
            <span className={styles.fill} style={{ '--fillp': released ? 1 : at / (n - 1) }} />
          </span>
          <span className={styles.runner} aria-hidden="true" {...fx('gate.runner')} />
          {stages.map((s, i) => {
            const state = i < at ? 'passed' : i === at && !released ? 'here' : 'ahead';
            return (
              <li key={s.id} className={clsx(styles.door, styles[state])} {...fx('gate.door')}>
                <span className={styles.lock}>
                  {state === 'passed' ? <Check size={15} aria-hidden="true" /> : state === 'here' ? <LockOpen size={15} aria-hidden="true" /> : <Lock size={15} aria-hidden="true" />}
                </span>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.name}>{s.title}</span>
              </li>
            );
          })}
        </ol>

        <div className={styles.stage} aria-live="polite">
          {released ? (
            <div className={styles.release}>
              <Glyph name="spark" size={44} className={styles.releaseGlyph} />
              <h3>{doneTitle}</h3>
              <p>{doneBody}</p>
              <button type="button" className={styles.reset} onClick={reset}><RotateCcw size={14} aria-hidden="true" /> Walk it again</button>
            </div>
          ) : (
            <>
              <div className={styles.copy} key={stage.id}>
                <Glyph name={stage.glyph} size={34} className={styles.glyph} />
                <span className={styles.step}>STAGE {String(at + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
              </div>
              <fieldset className={styles.gates} key={`${stage.id}-gates`}>
                <legend>The gate asks</legend>
                {stage.gates.map((g, i) => {
                  const on = ticked.has(`${stage.id}:${i}`);
                  return (
                    <label key={g} className={clsx(styles.gate, on && styles.on)}>
                      <input type="checkbox" checked={on} onChange={() => toggle(i)} />
                      <span className={styles.box} aria-hidden="true" {...fx('gate.checkbox')}><Check size={13} strokeWidth={2.6} /></span>
                      <span>{g}</span>
                    </label>
                  );
                })}
                <button type="button" className={styles.pass} onClick={pass} disabled={!allTicked} data-cursor="link" {...fx('gate.pass-button')}>
                  {allTicked ? 'Pass the gate' : `${stage.gates.filter((_, i) => ticked.has(`${stage.id}:${i}`)).length} of ${stage.gates.length} ticked`}
                </button>
              </fieldset>
            </>
          )}
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
