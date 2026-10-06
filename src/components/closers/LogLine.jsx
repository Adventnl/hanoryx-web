import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './LogLine.module.css';

/** Write one audit entry. Fill in who, what, to what and why; the server's
 *  part (time, request, source) is added for you, and the entry comes out as a
 *  structured line you can copy. Nothing is stored. */
export default function LogLine({ tag, title, lede, onward }) {
  const [f, setF] = useState({ who: 'agent_4417', did: 'order.refund', what: 'order_30211', why: 'Item arrived damaged; ticket 8812', before: 'paid', after: 'refunded' });
  const [copied, copy] = useCopy();
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const line = useMemo(() => JSON.stringify({
    at: new Date().toISOString(),
    actor: f.who,
    action: f.did,
    target: f.what,
    change: { from: f.before, to: f.after },
    reason: f.why,
    request: 'req_9f3a2c',
    source: 'support-console',
  }, null, 2), [f]);

  const field = (k, label, hint) => (
    <label className={styles.field}>
      <span>{label}</span>
      <input value={f[k]} onChange={set(k)} spellCheck={false} autoComplete="off" />
      <small>{hint}</small>
    </label>
  );

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('logline.rig')}>
        <div className={styles.form}>
          {field('who', 'Who', 'The authenticated actor, from the server, never from the request body.')}
          {field('did', 'Did what', 'A stable verb, so entries can be counted and searched.')}
          {field('what', 'To what', 'The record, by id.')}
          <div className={styles.pair}>
            {field('before', 'From', 'The value before.')}
            {field('after', 'To', 'The value after.')}
          </div>
          {field('why', 'Why', 'A reason a person can read, or a link to where one lives.')}
        </div>
        <div className={styles.out} {...fx('logline.entry')}>
          <p className={shared.label}>The entry</p>
          <pre tabIndex={0}><code>{line}</code></pre>
          <p className={styles.auto}>Added by the server, not by you: <b>at</b>, <b>request</b>, <b>source</b>.</p>
          <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => copy(line)}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy the entry'}</button>
        </div>
      </div>
    </CloserFrame>
  );
}
