import { useState } from 'react';
import clsx from 'clsx';
import { RotateCcw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './WhichOne.module.css';

/** Three questions, one recommendation. Answer them about the job in front of you
 *  and the helper names the trigger that fits — and why the other two don't. */
export default function WhichOne({ tag, title, lede, questions = [], outcomes = {}, onward }) {
  const [ans, setAns] = useState({});
  const done = questions.every((q) => ans[q.id] !== undefined);
  const key = done ? questions.map((q) => ans[q.id]).join('') : null;
  const out = key ? outcomes[key] || outcomes.default : null;
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('whichone.rig')}>
        <ol className={styles.qs}>
          {questions.map((q, i) => (
            <li key={q.id}>
              <p className={styles.q}><span>{String(i + 1).padStart(2, '0')}</span>{q.text}</p>
              <div className={styles.opts} role="radiogroup" aria-label={q.text}>
                {q.options.map((o, oi) => (
                  <button key={o} type="button" role="radio" aria-checked={ans[q.id] === oi} className={clsx(styles.opt, ans[q.id] === oi && styles.on)} onClick={() => setAns((a) => ({ ...a, [q.id]: oi }))}>{o}</button>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <div className={clsx(styles.result, out && styles.ready)} role="status" aria-live="polite" {...fx('whichone.result')}>
          {out ? (
            <>
              <p className={shared.label}>Reach for</p>
              <p className={styles.name}>{out.name}</p>
              <p className={styles.why}>{out.why}</p>
              <p className={styles.watch}><b>Watch for:</b> {out.watch}</p>
              <button type="button" className={shared.btn} onClick={() => setAns({})}><RotateCcw size={13} aria-hidden="true" /> Ask again</button>
            </>
          ) : (
            <p className={styles.wait}>Answer all three.</p>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
