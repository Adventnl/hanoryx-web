import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Glyph } from '../fx/Glyph';
import { workItems } from '../../data/work';
import styles from './CaseDeck.module.css';

/**
 * Hero object for the Work page: the four case studies as a deck of files. At
 * rest they sit stacked with a slight fan; hover the deck and the cards spread
 * out one by one, and the card under the pointer lifts. Each is a real link.
 */
export default function CaseDeck() {
  return (
    <div className={styles.deck}>
      {workItems.map((w, i) => (
        <Link key={w.id} to={w.to} className={`glyph-host ${styles.card}`} style={{ '--i': i, '--n': workItems.length }} data-cursor="card">
          <span className={styles.top}>
            <span className={styles.code}>{w.code}</span>
            <Glyph name={w.glyph} size={26} />
          </span>
          <span className={styles.name}>{w.name}</span>
          <span className={styles.kind}>{w.kind}</span>
          <span className={styles.tier}>{w.tier === 'primary' ? 'Primary' : 'Supporting'} <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" /></span>
        </Link>
      ))}
    </div>
  );
}
