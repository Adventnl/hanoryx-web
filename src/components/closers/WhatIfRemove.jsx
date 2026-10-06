import { useState } from 'react';
import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './WhatIfRemove.module.css';

/** Pull one part out of the stack and see what goes with it. A way of asking how
 *  much each dependency really carries. The judgements are ours; the file counts
 *  were taken when the page was written. */
export default function WhatIfRemove({ tag, title, lede, parts = [], onward }) {
  const [out, setOut] = useState(null);
  const part = parts.find((p) => p.id === out);
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('whatif.rig')}>
        <ol className={styles.stack} aria-label="The stack. Choose a part to take out.">
          {parts.map((p) => (
            <li key={p.id}>
              <button type="button" aria-pressed={out === p.id} className={clsx(styles.part, out === p.id && styles.gone)} onClick={() => setOut(out === p.id ? null : p.id)}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.kind}>{p.kind}</span>
                <span className={styles.state} aria-hidden="true">{out === p.id ? 'removed' : 'in place'}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className={clsx(styles.card, part && styles.ready)} role="status" aria-live="polite" {...fx('whatif.result')}>
          {part ? (
            <>
              <p className={styles.k}>Without {part.name}</p>
              <h3>{part.headline}</h3>
              <dl>
                <div><dt>What stops</dt><dd>{part.stops}</dd></div>
                <div><dt>What carries on</dt><dd>{part.keeps}</dd></div>
                <div><dt>To replace it</dt><dd><b>{part.effort}.</b> {part.how}</dd></div>
                {part.files != null && <div><dt>Where it is used</dt><dd>{part.files} source file{part.files === 1 ? '' : 's'}, counted when this page was written.</dd></div>}
              </dl>
            </>
          ) : (
            <p className={styles.wait}>Choose a part to take out.</p>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
