import { useState } from 'react';
import clsx from 'clsx';
import { Check, Minus, X } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { GlideTabs } from '../fx/GlideTabs';
import { fx } from '../../utils/fx';
import styles from './CaseExam.module.css';

const STATUS = {
  said: { label: 'Said', icon: Check },
  partly: { label: 'Partly', icon: Minus },
  not: { label: 'Not said', icon: X },
};

/** Six questions to put to any case study, put to this site's own. For each of the
 *  four, the page says plainly what is answered, what is only partly answered and
 *  what is not said at all. A way of showing the limits instead of hiding them. */
export default function CaseExam({ tag, title, lede, questions = [], cases = [], onward }) {
  const [id, setId] = useState(cases[0]?.id);
  const c = cases.find((x) => x.id === id);
  const tally = questions.reduce((t, q) => { const s = c.answers[q.id].status; t[s] = (t[s] || 0) + 1; return t; }, {});
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('caseexam.rig')}>
        <GlideTabs panels={false} label="Case study" idPrefix="ce" value={id} onChange={setId} tabs={cases.map((x) => ({ id: x.id, label: x.name }))} />
        <p className={styles.tally}><span><b>{tally.said || 0}</b> said</span><span><b>{tally.partly || 0}</b> partly</span><span><b>{tally.not || 0}</b> not said</span></p>
        <ol className={styles.qs}>
          {questions.map((q, i) => {
            const a = c.answers[q.id];
            const S = STATUS[a.status];
            return (
              <li key={q.id} className={clsx(styles.q, styles[a.status])}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{q.text}</h3>
                  <p className={styles.why}>{q.why}</p>
                  <p className={styles.say}><span className={styles.badge}><S.icon size={12} aria-hidden="true" />{S.label}</span>{a.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </CloserFrame>
  );
}
