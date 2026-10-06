import { useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { fx } from '../../utils/fx';
import styles from './HiringPath.module.css';

/**
 * What a conversation about working at North looks like, stage by stage, from
 * either side of the table. Pick a stage on the path; flip between "you" and
 * "us" to read what each side does. No roles are open, and no timings are given.
 *
 *   stages: [{ id, name, line, you[], us[], stops }]
 */
export default function HiringPath({ eyebrow, title, intro, stages = [], note }) {
  const [id, setId] = useState(stages[0]?.id);
  const [side, setSide] = useState('you');
  const at = Math.max(0, stages.findIndex((s) => s.id === id));
  const s = stages[at];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('hiring.path')}>
        <ol className={styles.path} style={{ '--n': stages.length, '--at': at }}>
          <span className={styles.line} aria-hidden="true"><i /></span>
          <span className={styles.walker} aria-hidden="true" {...fx('hiring.walker')} />
          {stages.map((st, i) => (
            <li key={st.id}>
              <button type="button" className={clsx(styles.stage, i <= at && styles.past, i === at && styles.here)} aria-current={i === at ? 'step' : undefined} onClick={() => setId(st.id)}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.name}>{st.name}</span>
                <span className={styles.l}>{st.line}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className={styles.detail} key={s.id} {...fx('hiring.detail')}>
          <div className={styles.toggle}>
            <GlideTabs
              panels={false}
              label="Whose side"
              idPrefix="hire-side"
              value={side}
              onChange={setSide}
              tabs={[{ id: 'you', label: 'What you do' }, { id: 'us', label: 'What we do' }]}
              {...fx('hiring.side-toggle')}
            />
          </div>
          <ul className={styles.list}>
            {(side === 'you' ? s.you : s.us).map((x) => <li key={x}>{x}</li>)}
          </ul>
          <p className={styles.stops}><b>If it stops here.</b> {s.stops}</p>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
