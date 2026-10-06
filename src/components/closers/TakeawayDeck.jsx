import { useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './TakeawayDeck.module.css';

/** The few things worth keeping, as a deck you page through. The top card lifts
 *  away to the back; arrow keys work on the deck. */
export default function TakeawayDeck({ tag, title, lede, cards = [], onward }) {
  const [top, setTop] = useState(0);
  const n = cards.length;
  const go = (d) => setTop((t) => (t + d + n) % n);
  const onKey = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } };
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.wrap} {...fx('takeaway.deck')}>
        <div className={styles.deck} tabIndex={0} role="group" aria-roledescription="deck of cards" aria-label={`Takeaway ${top + 1} of ${n}`} onKeyDown={onKey}>
          {cards.map((c, i) => {
            const pos = (i - top + n) % n;
            return (
              <article key={c.title} className={clsx(styles.card, pos === 0 && styles.top)} style={{ '--pos': pos, '--n': n }} aria-hidden={pos !== 0}>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            );
          })}
        </div>
        <div className={styles.ctrl}>
          <button type="button" className={shared.btn} onClick={() => go(-1)} aria-label="Previous takeaway"><ChevronLeft size={14} aria-hidden="true" /></button>
          <span className={styles.dots} aria-hidden="true">{cards.map((c, i) => <i key={c.title} className={clsx(i === top && styles.dot)} />)}</span>
          <button type="button" className={clsx(shared.btn, shared.btnRed)} onClick={() => go(1)} aria-label="Next takeaway"><ChevronRight size={14} aria-hidden="true" /></button>
        </div>
      </div>
    </CloserFrame>
  );
}
