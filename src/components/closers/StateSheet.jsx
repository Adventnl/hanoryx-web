import { useState } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './StateSheet.module.css';

const STATES = [
  { id: 'rest', name: 'Resting', says: 'It is there, and it can be used.' },
  { id: 'hover', name: 'Hover', says: 'It will respond if pressed. Pointers only; never the only cue.' },
  { id: 'focus', name: 'Focus', says: 'This is where the keyboard is. Never remove the ring without a better one.' },
  { id: 'press', name: 'Pressed', says: 'Your press registered, before anything else happens.' },
  { id: 'disabled', name: 'Disabled', says: 'Not now, and the page can say why nearby.' },
  { id: 'busy', name: 'Busy', says: 'Working. Pressing again would only queue another.' },
  { id: 'error', name: 'Error', says: 'Something is wrong here, said in words as well as colour.' },
];

/** The seven states every control owns, shown side by side for three controls,
 *  and a live row of the real thing underneath. Tab to it, press it, hover it:
 *  the states above are what you are feeling. */
export default function StateSheet({ tag, title, lede, onward }) {
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const press = () => { setBusy(true); window.setTimeout(() => setBusy(false), 1200); };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.sheet} {...fx('statesheet.sheet')}>
        <div className={styles.head} role="presentation"><span>State</span><span>Button</span><span>Field</span><span>Switch</span></div>
        <ul className={styles.rows}>
          {STATES.map((s) => (
            <li key={s.id} className={styles.row}>
              <div className={styles.name}><b>{s.name}</b><span>{s.says}</span></div>
              <div className={styles.cell} inert aria-hidden="true"><span className={clsx(styles.btn, styles[s.id])}>{s.id === 'busy' && <Loader2 size={13} />}{s.id === 'busy' ? 'Saving' : 'Save'}</span></div>
              <div className={styles.cell} inert aria-hidden="true">
                <span className={clsx(styles.field, styles[s.id])}>{s.id === 'error' ? 'name@' : s.id === 'rest' || s.id === 'disabled' ? 'Email' : 'name@example'}</span>
                {s.id === 'error' && <small className={styles.msg}>Add the part after the @.</small>}
              </div>
              <div className={styles.cell} inert aria-hidden="true"><span className={clsx(styles.sw, styles[s.id])}><i /></span></div>
            </li>
          ))}
        </ul>
        <div className={styles.live}>
          <p className={styles.k}>The real ones. Hover, Tab to, and press them.</p>
          <div className={styles.liveRow}>
            <button type="button" className={styles.realBtn} onClick={press} aria-busy={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button type="button" className={styles.realBtn} disabled>Disabled</button>
            <label className={styles.realField}><span className="sr-only">Email</span><input type="email" placeholder="Email" aria-invalid={false} /></label>
            <label className={styles.realSw}>
              <input type="checkbox" role="switch" checked={on} onChange={(e) => setOn(e.target.checked)} />
              <span aria-hidden="true"><i /></span>
              {on ? 'On' : 'Off'}
            </label>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
