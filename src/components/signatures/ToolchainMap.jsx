import { useState } from 'react';
import clsx from 'clsx';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { ProgressRing } from '../fx/ProgressRing';
import { Glyph } from '../fx/Glyph';
import { fx } from '../../utils/fx';
import styles from './ToolchainMap.module.css';

/**
 * The site's own toolchain as a row of switches. Every stage guards against a
 * kind of problem; switch one off and the ring drops and the problem it would
 * have caught is listed as "could slip through". A way of seeing why each
 * check is there — the commands shown are the real ones used on this site.
 *
 *   stages: [{ id, title, command, glyph, checks, slips }]
 */
export default function ToolchainMap({ eyebrow, title, intro, stages, note }) {
  const [off, setOff] = useState(() => new Set());
  const toggle = (id) => setOff((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const guarded = stages.length - off.size;
  const slipping = stages.filter((s) => off.has(s.id));

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.bench} {...fx('tooling.toolchain-switches')}>
        <ol className={styles.row} style={{ '--n': stages.length }}>
          {stages.map((s, i) => {
            const on = !off.has(s.id);
            return (
              <li key={s.id} className={clsx(styles.stage, !on && styles.off)}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  className={clsx('glyph-host', styles.card)}
                  onClick={() => toggle(s.id)}
                  {...fx('toolchain.switch-card')}
                >
                  <span className={styles.top}>
                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.switch} aria-hidden="true"><i /></span>
                  </span>
                  <Glyph name={s.glyph} size={30} className={styles.glyph} />
                  <span className={styles.name}>{s.title}</span>
                  <code className={styles.cmd}>{s.command}</code>
                  <span className={styles.checks}>{s.checks}</span>
                </button>
                {i < stages.length - 1 && <span className={styles.link} aria-hidden="true" {...fx('toolchain.chain-link')} />}
              </li>
            );
          })}
        </ol>

        <div className={styles.result}>
          <ProgressRing value={guarded / stages.length} size={92} stroke={3.4} label={`${guarded} of ${stages.length} checks switched on`} {...fx('toolchain.guard-ring')}>
            <span className={styles.count}>{guarded}/{stages.length}</span>
          </ProgressRing>
          <div className={styles.slips} aria-live="polite" {...fx('toolchain.slips')}>
            {slipping.length === 0 ? (
              <p className={styles.all}><ShieldCheck size={16} aria-hidden="true" /> Every check is on. Switch one off to see what it was guarding.</p>
            ) : (
              <>
                <p className={styles.warn}><ShieldAlert size={16} aria-hidden="true" /> Could slip through</p>
                <ul>
                  {slipping.map((s) => <li key={s.id}><b>{s.title}</b> {s.slips}</li>)}
                </ul>
              </>
            )}
          </div>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
