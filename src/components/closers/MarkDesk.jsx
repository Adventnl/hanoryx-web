import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './MarkDesk.module.css';

const TONE = { yes: 'Yes', maybe: 'Ask first', no: 'No' };

/** A desk that answers "may I…?". Pick a use from the list (arrow keys move
 *  between them); a verdict is stamped onto the slip with the one line that
 *  explains it and, where there is one, the page to read next. */
export default function MarkDesk({ tag, title, lede, cases = [], onward }) {
  const [id, setId] = useState(cases[0]?.id);
  const refs = useRef({});
  const current = cases.find((c) => c.id === id) || cases[0];

  const onKey = (event) => {
    const i = cases.findIndex((c) => c.id === id);
    let n = -1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') n = (i + 1) % cases.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') n = (i - 1 + cases.length) % cases.length;
    else if (event.key === 'Home') n = 0;
    else if (event.key === 'End') n = cases.length - 1;
    if (n < 0) return;
    event.preventDefault();
    setId(cases[n].id);
    refs.current[cases[n].id]?.focus();
  };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.desk}>
        <div className={styles.list} role="radiogroup" aria-label="What would you like to do?" onKeyDown={onKey} {...fx('markdesk.options')}>
          {cases.map((c) => (
            <button
              key={c.id}
              ref={(el) => { refs.current[c.id] = el; }}
              type="button"
              role="radio"
              aria-checked={c.id === id}
              tabIndex={c.id === id ? 0 : -1}
              className={clsx(styles.opt, c.id === id && styles.on)}
              onClick={() => setId(c.id)}
            >
              <span>{c.label}</span>
              <i className={clsx(styles.dot, styles[c.tone])} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className={styles.slip} role="status" aria-live="polite" {...fx('markdesk.verdict-stamp')}>
          <p className={shared.label}>The desk says</p>
          <div key={current.id} className={clsx(styles.stamp, styles[current.tone])}>{TONE[current.tone]}</div>
          <p className={styles.line}>{current.line}</p>
          {current.next && (
            <Link to={current.next.to} className={styles.next} data-cursor="link">{current.next.label} <ArrowUpRight size={14} aria-hidden="true" /></Link>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
