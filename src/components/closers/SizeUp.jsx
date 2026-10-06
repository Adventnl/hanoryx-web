import { useState } from 'react';
import clsx from 'clsx';
import { RotateCcw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './SizeUp.module.css';

/** How big is it, really? Five questions about a system, each a judgement, and
 *  the page says what shape of work that adds up to: a focused tool, a platform
 *  or a programme, with what changes at each size. It gives a shape, not a
 *  price and not a duration. */
export default function SizeUp({ tag, title, lede, questions = [], bands = [], onward }) {
  const [ans, setAns] = useState({});
  const done = questions.every((q) => ans[q.id] !== undefined);
  const score = questions.reduce((n, q) => n + (ans[q.id] !== undefined ? q.options[ans[q.id]].points : 0), 0);
  const band = [...bands].sort((a, b) => b.min - a.min).find((b) => score >= b.min);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('sizeup.rig')}>
        <ol className={styles.qs}>
          {questions.map((q, i) => (
            <li key={q.id}>
              <p className={styles.q}><span>{String(i + 1).padStart(2, '0')}</span>{q.text}</p>
              <div className={styles.opts} role="radiogroup" aria-label={q.text}>
                {q.options.map((o, oi) => (
                  <button key={o.label} type="button" role="radio" aria-checked={ans[q.id] === oi} className={clsx(styles.opt, ans[q.id] === oi && styles.on)} onClick={() => setAns((a) => ({ ...a, [q.id]: oi }))}>{o.label}</button>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <div className={clsx(styles.card, done && styles.ready)} role="status" aria-live="polite" {...fx('sizeup.result')}>
          {done && band ? (
            <>
              <p className={shared.label}>The shape of it</p>
              <h3>{band.name}</h3>
              <p className={styles.sum}>{band.summary}</p>
              <dl>
                <div><dt>What changes at this size</dt><dd><ul>{band.changes.map((c) => <li key={c}>{c}</li>)}</ul></dd></div>
                <div><dt>Decide first</dt><dd><ul>{band.first.map((c) => <li key={c}>{c}</li>)}</ul></dd></div>
              </dl>
              <button type="button" className={shared.btn} onClick={() => setAns({})}><RotateCcw size={14} aria-hidden="true" /> Start again</button>
            </>
          ) : (
            <p className={styles.wait}>{Object.keys(ans).length} of {questions.length} answered. Answer all of them for a shape.</p>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
