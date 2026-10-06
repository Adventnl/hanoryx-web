import { useState } from 'react';
import clsx from 'clsx';
import { Check, Eye, RotateCcw, X } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './SpotTheBug.module.css';

/** A review exercise. Read a short piece of code the way a reviewer would, mark
 *  the lines you would stop, and press Check. Each real problem comes back with
 *  why it matters; lines flagged without cause are named too. */
export default function SpotTheBug({ tag, title, lede, lang = 'javascript', lines = [], onward }) {
  const [picked, setPicked] = useState(() => new Set());
  const [done, setDone] = useState(false);
  const flaws = lines.map((l, i) => (l.flaw ? i : -1)).filter((i) => i >= 0);
  const found = flaws.filter((i) => picked.has(i));
  const wrong = [...picked].filter((i) => !lines[i].flaw);
  const toggle = (i) => { if (!done) setPicked((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; }); };
  const reset = () => { setPicked(new Set()); setDone(false); };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('spotbug.rig')}>
        <div className={styles.code} role="group" aria-label={`Code to review, in ${lang}. Mark the lines you would stop.`}>
          {lines.map((l, i) => {
            const isPick = picked.has(i);
            const state = done && l.flaw ? (isPick ? 'hit' : 'miss') : done && isPick ? 'false' : '';
            return (
              <button key={i} type="button" aria-pressed={isPick} className={clsx(styles.line, isPick && styles.picked, state && styles[state])} onClick={() => toggle(i)} disabled={done && !l.flaw && !isPick}>
                <span className={styles.n}>{i + 1}</span>
                <code>{l.text || ' '}</code>
                <span className={styles.mark} aria-hidden="true">{state === 'hit' && <Check size={13} />}{state === 'false' && <X size={13} />}{state === 'miss' && '!'}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.out} aria-live="polite" {...fx('spotbug.result')}>
          {!done ? (
            <>
              <p className={shared.label}>{picked.size} line{picked.size === 1 ? '' : 's'} marked</p>
              <p className={styles.help}>There are <b>{flaws.length}</b> problems in these {lines.length} lines. Mark the ones you would not let through, then check.</p>
              <div className={shared.row}>
                <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => setDone(true)} disabled={!picked.size}><Check size={14} aria-hidden="true" /> Check</button>
                <button type="button" className={shared.btn} onClick={() => { setPicked(new Set(flaws)); setDone(true); }}><Eye size={14} aria-hidden="true" /> Just show me</button>
              </div>
            </>
          ) : (
            <>
              <p className={styles.score}><b>{found.length}</b> of {flaws.length} found{wrong.length ? `, ${wrong.length} flagged without cause` : ''}</p>
              <ul className={styles.notes}>
                {flaws.map((i) => (
                  <li key={i} className={clsx(picked.has(i) ? styles.got : styles.missed)}>
                    <b>Line {i + 1}: {lines[i].flaw.title}</b>
                    <span>{lines[i].flaw.why}</span>
                  </li>
                ))}
              </ul>
              {wrong.length > 0 && <p className={styles.help}>Line{wrong.length > 1 ? 's' : ''} {wrong.map((i) => i + 1).join(', ')} {wrong.length > 1 ? 'are' : 'is'} fine as written. Not every unusual line is a bug.</p>}
              <button type="button" className={shared.btn} onClick={reset}><RotateCcw size={14} aria-hidden="true" /> Try again</button>
            </>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
