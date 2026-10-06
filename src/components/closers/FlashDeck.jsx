import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight, Check, RotateCcw, Shuffle } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { glossary, glossaryAreas } from '../../data/glossary';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './FlashDeck.module.css';

const SIZE = 10;
const deal = (area) => {
  const pool = glossary.filter((g) => area === 'All' || g.area === area);
  const a = pool.map((g) => g.term);
  for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, SIZE);
};

/** Flashcards from the glossary. Read the term, say what it means, turn the card,
 *  and mark whether you had it. At the end, the ones still to learn are listed
 *  with a way to read more. Nothing is saved. */
export default function FlashDeck({ tag, title, lede, onward }) {
  const [area, setArea] = useState('All');
  const [deck, setDeck] = useState(() => deal('All'));
  const [at, setAt] = useState(0);
  const [turned, setTurned] = useState(false);
  const [missed, setMissed] = useState([]);
  const [score, setScore] = useState(0);
  const done = at >= deck.length;
  const card = glossary.find((g) => g.term === deck[at]);

  const start = (next) => { setArea(next); setDeck(deal(next)); setAt(0); setTurned(false); setMissed([]); setScore(0); };
  const mark = (knew) => {
    if (knew) setScore((s) => s + 1); else setMissed((m) => [...m, deck[at]]);
    setTurned(false);
    setAt((n) => n + 1);
  };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('flashdeck.rig')}>
        <div className={styles.chips} role="group" aria-label="Area">
          {['All', ...glossaryAreas].map((a) => <button key={a} type="button" className={clsx(shared.btn, area === a && shared.btnOn)} aria-pressed={area === a} onClick={() => start(a)}>{a}</button>)}
        </div>

        {!done && card ? (
          <div className={styles.stage}>
            <p className={styles.count}>Card {at + 1} of {deck.length}</p>
            <button type="button" className={clsx(styles.card, turned && styles.turned)} onClick={() => setTurned((t) => !t)} aria-pressed={turned} aria-label={turned ? `Definition of ${card.term}. Press to turn back.` : `Term: ${card.term}. Press to see what it means.`} {...fx('flashdeck.card')}>
              {turned ? (
                <span className={styles.back} key="b"><b>{card.term}</b><span>{card.def}</span></span>
              ) : (
                <span className={styles.front} key="f"><small>{card.area}</small><b>{card.term}</b><em>Say it in your own words, then turn the card.</em></span>
              )}
            </button>
            <div className={shared.row}>
              <button type="button" className={shared.btn} onClick={() => mark(false)} disabled={!turned}><RotateCcw size={14} aria-hidden="true" /> Still learning</button>
              <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => mark(true)} disabled={!turned}><Check size={14} aria-hidden="true" /> Knew it</button>
            </div>
          </div>
        ) : (
          <div className={styles.result} role="status" aria-live="polite" {...fx('flashdeck.result')}>
            <p className={styles.score}><b>{score}</b><span> of {deck.length}</span></p>
            {missed.length ? (
              <>
                <p className={shared.label}>Still to learn</p>
                <ul>
                  {missed.map((t) => {
                    const g = glossary.find((x) => x.term === t);
                    return <li key={t}><b>{t}</b><span>{g.def}</span>{g.see && <Link to={`/${g.see}`} data-cursor="link">Read more <ArrowUpRight size={12} aria-hidden="true" /></Link>}</li>;
                  })}
                </ul>
              </>
            ) : (
              <p className={styles.all}>Every card. The glossary has {glossary.length} terms; deal another hand.</p>
            )}
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => start(area)}><Shuffle size={14} aria-hidden="true" /> Deal again</button>
          </div>
        )}
      </div>
    </CloserFrame>
  );
}
