import { useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './RoleLens.module.css';

/** One record, four people. Each role needs a few of the fields and not the rest.
 *  Choose a role and the record rearranges itself: what they need is sharp, what
 *  they do not is tucked away but never gone. An invented record, for illustration. */
export default function RoleLens({ tag, title, lede, record = [], roles = [], onward }) {
  const [role, setRole] = useState(roles[0]?.id);
  const [all, setAll] = useState(false);
  const r = roles.find((x) => x.id === role);
  const needed = record.filter((f) => r.needs.includes(f.id));
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('rolelens.rig')}>
        <div className={styles.roles} role="radiogroup" aria-label="Who is looking">
          {roles.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={role === x.id} className={clsx(styles.role, role === x.id && styles.on)} onClick={() => setRole(x.id)}>
              <b>{x.name}</b><span>{x.asks}</span>
            </button>
          ))}
        </div>
        <div className={styles.record}>
          <header>
            <p className={styles.k}>Order 30211</p>
            <p className={styles.count}><b>{needed.length}</b> of {record.length} fields matter to {r.name.toLowerCase()}</p>
          </header>
          <dl>
            {record.map((f) => {
              const need = r.needs.includes(f.id);
              return (
                <div key={f.id} className={clsx(styles.field, need ? styles.need : styles.rest)} hidden={!need && !all}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              );
            })}
          </dl>
          <button type="button" className={styles.toggle} onClick={() => setAll((a) => !a)} aria-pressed={all}>{all ? 'Hide the rest' : `Show the other ${record.length - needed.length}`}</button>
        </div>
      </div>
    </CloserFrame>
  );
}
