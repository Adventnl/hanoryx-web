import { useState } from 'react';
import clsx from 'clsx';
import { Shuffle } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './ReviewDraw.module.css';

/** A deck of the principles. Draw one and it turns up with a single question to
 *  put to your next design review — the principle as something to ask, not
 *  something to admire. */
export default function ReviewDraw({ tag, title, lede, cards = [], onward }) {
  const reduced = usePrefersReducedMotion();
  const [drawn, setDrawn] = useState(null);
  const [spin, setSpin] = useState(0);
  const draw = () => {
    setSpin((n) => n + 1);
    setDrawn((cur) => {
      let next = Math.floor(Math.random() * cards.length);
      if (next === cur && cards.length > 1) next = (next + 1) % cards.length;
      return next;
    });
  };
  const card = drawn == null ? null : cards[drawn];
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.table} {...fx('draw.table')}>
        <div className={styles.deck} aria-hidden="true">
          {cards.slice(0, 5).map((c, i) => <span key={`${c.title}-${spin}`} style={{ '--i': i }} className={clsx(styles.back, !reduced && spin > 0 && styles.shuffle)} />)}
        </div>
        <div className={styles.slot} role="status" aria-live="polite">
          {card ? (
            <article key={`${drawn}-${spin}`} className={styles.face} {...fx('draw.card')}>
              <p className={styles.num}>{String(drawn + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</p>
              <h3>{card.title}</h3>
              <p className={styles.q}><span>Ask in your next review</span>{card.question}</p>
            </article>
          ) : (
            <p className={styles.empty}>Draw a card.</p>
          )}
        </div>
      </div>
      <button type="button" className={clsx(shared.btn, shared.btnRed)} onClick={draw} {...fx('draw.button')}><Shuffle size={14} aria-hidden="true" /> {card ? 'Draw another' : 'Draw a principle'}</button>
    </CloserFrame>
  );
}
