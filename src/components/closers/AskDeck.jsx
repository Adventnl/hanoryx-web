import { useState } from 'react';
import clsx from 'clsx';
import { Shuffle } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './AskDeck.module.css';

/** Questions a candidate is welcome to ask, on cards. Turn one to see why it is
 *  a good question to ask — and what a good answer would sound like. */
export default function AskDeck({ tag, title, lede, cards = [], onward }) {
  const [open, setOpen] = useState(() => new Set());
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const toggle = (i) => setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const shuffle = () => setOrder((o) => { const a = [...o]; for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; });
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <ul className={styles.deck} {...fx('askdeck.cards')}>
        {order.map((i, pos) => {
          const c = cards[i];
          const on = open.has(i);
          return (
            <li key={c.q}>
              <button type="button" className={clsx(styles.card, on && styles.flipped)} aria-pressed={on} onClick={() => toggle(i)}>
                <span className={clsx(styles.face, styles.front)} aria-hidden={on}>
                  <span className={styles.n}>{String(pos + 1).padStart(2, '0')}</span>
                  <span className={styles.q}>{c.q}</span>
                  <span className={styles.hint}>Turn over</span>
                </span>
                <span className={clsx(styles.face, styles.rear)} aria-hidden={!on}>
                  <span className={styles.n}>Why ask</span>
                  <span className={styles.a}>{c.why}</span>
                  <span className={styles.good}><b>Listen for:</b> {c.listen}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" className={shared.btn} onClick={shuffle}><Shuffle size={14} aria-hidden="true" /> Shuffle the deck</button>
    </CloserFrame>
  );
}
