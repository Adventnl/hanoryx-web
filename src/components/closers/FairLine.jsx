import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './FairLine.module.css';

/** Eight things a visitor might do. Call each one fine or not fine; the answer
 *  is revealed with the policy's reasoning, and a running tally shows how your
 *  reading compares. */
export default function FairLine({ tag, title, lede, cases = [], onward }) {
  const [answers, setAnswers] = useState({});
  const done = Object.keys(answers).length;
  const right = useMemo(() => cases.filter((c) => answers[c.id] !== undefined && answers[c.id] === c.fine).length, [answers, cases]);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.meter} {...fx('fairline.tally')}>
        <span className={shared.label}>Your reading vs the policy</span>
        <div className={styles.bar} role="img" aria-label={`${right} of ${done} answered match the policy`}>
          {cases.map((c) => (
            <span key={c.id} className={clsx(styles.seg, answers[c.id] !== undefined && (answers[c.id] === c.fine ? styles.hit : styles.miss))} />
          ))}
        </div>
        <span className={styles.score}>{done === 0 ? 'Decide on each' : `${right} / ${done} match`}</span>
      </div>
      <ul className={styles.cases}>
        {cases.map((c, i) => {
          const a = answers[c.id];
          const answered = a !== undefined;
          return (
            <li key={c.id} className={clsx(styles.case, answered && styles.answered, answered && (c.fine ? styles.isFine : styles.isNot))} {...fx('fairline.case-card')}>
              <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.text}>{c.text}</p>
              {!answered ? (
                <div className={styles.choices} role="group" aria-label={`Is this fine? ${c.text}`}>
                  <button type="button" className={shared.btn} onClick={() => setAnswers((s) => ({ ...s, [c.id]: true }))}><Check size={13} aria-hidden="true" /> Fine</button>
                  <button type="button" className={shared.btn} onClick={() => setAnswers((s) => ({ ...s, [c.id]: false }))}><X size={13} aria-hidden="true" /> Not fine</button>
                </div>
              ) : (
                <p className={styles.verdict} role="status">
                  <b>{c.fine ? 'Fine' : 'Not fine'}</b>
                  <span className={a === c.fine ? styles.yes : styles.no}>{a === c.fine ? 'You read it the same way.' : 'The policy reads it the other way.'}</span>
                  {c.why}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {done > 0 && (
        <button type="button" className={shared.btn} onClick={() => setAnswers({})}>Start again</button>
      )}
    </CloserFrame>
  );
}
