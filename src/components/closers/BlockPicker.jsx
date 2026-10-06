import { useState } from 'react';
import { Link } from 'react-router-dom';
import CloserFrame from './CloserFrame';
import CodeBlock from '../kit/CodeBlock';
import { fx } from '../../utils/fx';
import styles from './BlockPicker.module.css';

/**
 * “Which block?” Say what you are trying to show and the page names the block
 * that suits it, with the data that makes it, why it fits, and what people
 * usually reach for instead.
 *
 *   intents: [{ id, label, sees, use, why, notThis, sample (a string of the block's data), to? }]
 */
export default function BlockPicker({ tag, title, lede, intents = [], onward }) {
  const [id, setId] = useState(intents[0]?.id);
  const pick = intents.find((x) => x.id === id) || intents[0];

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('blockpicker.rig')}>
        <div className={styles.opts} role="radiogroup" aria-label="What you are trying to show">
          {intents.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={x.id === pick?.id} className={styles.opt} onClick={() => setId(x.id)}>
              <b>{x.label}</b>
              <small>{x.sees}</small>
            </button>
          ))}
        </div>
        {pick && (
          <div className={styles.out} role="status" aria-live="polite">
            <p className={styles.use}>Use the <code>{pick.use}</code> block</p>
            <p className={styles.why}>{pick.why}</p>
            <p className={styles.why}><b>Not this:</b> {pick.notThis}</p>
            <div key={pick.id} className={styles.data} {...fx('blockpicker.data')}>
              <CodeBlock code={pick.sample} language="js" filename={`${pick.use}.js`} />
            </div>
            {pick.to && <p className={styles.why}><Link to={pick.to} data-cursor="link" className={styles.see}>See the {pick.use} block on this page →</Link></p>}
          </div>
        )}
      </div>
    </CloserFrame>
  );
}
