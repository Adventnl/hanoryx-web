import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle, Check, RotateCcw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './ExposureDesk.module.css';

const MARK = { never: 'Never leaves', own: 'Their own only', yes: 'Fine to show' };

/** Design what a customer portal shows. Each field of an order says what the
 *  usual rule is; switch fields on and off and the preview changes, with a warning
 *  for anything that should never leave the building. An invented order. */
export default function ExposureDesk({ tag, title, lede, fields = [], onward }) {
  const [on, setOn] = useState(() => new Set(fields.filter((f) => f.rule === 'yes').map((f) => f.id)));
  const toggle = (id) => setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const risky = useMemo(() => fields.filter((f) => on.has(f.id) && f.rule === 'never'), [fields, on]);
  const shown = fields.filter((f) => on.has(f.id));
  const hiddenOwn = fields.filter((f) => f.rule === 'own' && !on.has(f.id)).length;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('exposure.rig')}>
        <ul className={styles.fields}>
          {fields.map((f) => (
            <li key={f.id}>
              <label className={clsx(styles.row, on.has(f.id) && styles.on, on.has(f.id) && f.rule === 'never' && styles.bad)}>
                <input type="checkbox" checked={on.has(f.id)} onChange={() => toggle(f.id)} />
                <span className={styles.sw} aria-hidden="true"><i /></span>
                <span className={styles.name}><b>{f.label}</b><small>{f.why}</small></span>
                <span className={clsx(styles.rule, styles[f.rule])}>{MARK[f.rule]}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className={styles.side}>
          <article className={styles.preview} aria-label="What the customer would see" {...fx('exposure.preview')}>
            <p className={shared.label}>What the customer sees</p>
            <h3>Your order</h3>
            {shown.length ? <dl>{shown.map((f) => <div key={f.id}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl> : <p className={styles.empty}>Nothing yet. A portal that shows nothing is safe and useless.</p>}
          </article>
          <div className={clsx(styles.verdict, risky.length && styles.warn)} role="status" aria-live="polite">
            {risky.length ? <><AlertTriangle size={15} aria-hidden="true" /><p><b>{risky.length} field{risky.length > 1 ? 's' : ''} should never leave:</b> {risky.map((f) => f.label.toLowerCase()).join(', ')}.</p></> : <><Check size={15} aria-hidden="true" /><p>Nothing here that should stay inside.{hiddenOwn ? ` ${hiddenOwn} field${hiddenOwn > 1 ? 's' : ''} that a customer may see for their own order ${hiddenOwn > 1 ? 'are' : 'is'} still hidden.` : ''}</p></>}
          </div>
          <button type="button" className={shared.btn} onClick={() => setOn(new Set(fields.filter((f) => f.rule !== 'never').map((f) => f.id)))}><RotateCcw size={14} aria-hidden="true" /> Use the usual rule</button>
        </div>
      </div>
    </CloserFrame>
  );
}
