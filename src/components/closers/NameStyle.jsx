import { useState } from 'react';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './NameStyle.module.css';

/** How to write the name: four quick choices, each answered the moment you make
 *  it, and a one-line style summary at the end. */
export default function NameStyle({ tag, title, lede, questions = [], summary, onward }) {
  const [picked, setPicked] = useState({});
  const done = Object.keys(picked).length === questions.length;
  const right = questions.filter((q) => picked[q.id] === q.answer).length;
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <ol className={styles.qs} {...fx('namestyle.questions')}>
        {questions.map((q, i) => {
          const p = picked[q.id];
          return (
            <li key={q.id} className={clsx(styles.q, p !== undefined && styles.answered)}>
              <p className={styles.prompt}><span>{String(i + 1).padStart(2, '0')}</span>{q.prompt}</p>
              <div className={styles.opts} role="group" aria-label={q.prompt}>
                {q.options.map((o, oi) => {
                  const state = p === undefined ? '' : oi === q.answer ? styles.ok : oi === p ? styles.bad : styles.dim;
                  return (
                    <button key={o} type="button" className={clsx(styles.opt, state)} disabled={p !== undefined} onClick={() => setPicked((s) => ({ ...s, [q.id]: oi }))}>
                      {p !== undefined && oi === q.answer && <Check size={13} aria-hidden="true" />}
                      {p !== undefined && oi === p && oi !== q.answer && <X size={13} aria-hidden="true" />}
                      {o}
                    </button>
                  );
                })}
              </div>
              {p !== undefined && <p className={styles.why} role="status">{q.why}</p>}
            </li>
          );
        })}
      </ol>
      {done && (
        <div className={styles.sum} role="status" {...fx('namestyle.summary')}>
          <p className={shared.label}>{right} of {questions.length} — the style in one line</p>
          <p>{summary}</p>
          <button type="button" className={shared.btn} onClick={() => setPicked({})}>Try again</button>
        </div>
      )}
    </CloserFrame>
  );
}
