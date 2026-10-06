import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import styles from './SymptomRouter.module.css';

/** Start from what is going wrong, not from what the team is called. Choose the
 *  symptom closest to yours and the page names the discipline that deals with it,
 *  why, and where else to look. */
export default function SymptomRouter({ tag, title, lede, symptoms = [], onward }) {
  const [on, setOn] = useState(null);
  const s = symptoms.find((x) => x.id === on);
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('symptom.rig')}>
        <div className={styles.list} role="radiogroup" aria-label="What is going wrong">
          {symptoms.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={on === x.id} className={clsx(styles.sym, on === x.id && styles.on)} onClick={() => setOn(x.id)}>
              <span className={styles.dot} aria-hidden="true" />
              {x.label}
            </button>
          ))}
        </div>
        <div className={styles.route} aria-hidden="true"><i className={clsx(on && styles.live)} /></div>
        <div className={clsx(styles.card, s && styles.ready)} role="status" aria-live="polite" {...fx('symptom.result')}>
          {s ? (
            <>
              <p className={styles.k}>Start with</p>
              <h3>{s.area}</h3>
              <p className={styles.why}>{s.why}</p>
              <div className={styles.links}>
                <Link to={s.to} data-cursor="link" className={styles.go}>Go there <ArrowUpRight size={14} aria-hidden="true" /></Link>
                {s.also && <Link to={s.also.to} data-cursor="link" className={styles.also}>Also: {s.also.label}</Link>}
              </div>
            </>
          ) : (
            <p className={styles.wait}>Choose the symptom that sounds most like yours.</p>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
