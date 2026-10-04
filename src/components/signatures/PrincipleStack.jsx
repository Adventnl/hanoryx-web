import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { fx } from '../../utils/fx';
import styles from './PrincipleStack.module.css';

/**
 * Principles as a deck of cards that stack as you scroll: each card sticks just
 * below the last, so the next one slides over it like a card laid on a pile
 * (pure CSS `position: sticky`). Where the browser supports scroll-driven
 * animation, the buried cards also settle back and dim a touch.
 *
 *   principles: [{ code, title, body, practice, glyph }]
 */
export default function PrincipleStack({ eyebrow, title, intro, principles }) {
  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <ol className={styles.deck} style={{ '--n': principles.length }} {...fx('principles.sticky-deck')}>
        {principles.map((p, i) => (
          <li key={p.code} className={styles.slot} style={{ '--i': i }}>
            <article className={`glyph-host ${styles.card}`}>
              {/* the tab: when later cards lie over this one, this line is what stays visible */}
              <span className={styles.tab} aria-hidden="true" {...fx('principles.tab-line')}><b>{p.code}</b><span>{p.title}</span></span>
              <span className={`ghost-numeral ${styles.num}`} aria-hidden="true" {...fx('principles.ghost-numeral')}>{p.code}</span>
              <div className={styles.body}>
                <Glyph name={p.glyph} size={38} className={styles.glyph} {...fx('principles.card-glyph')} />
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.text}>{p.body}</p>
              </div>
              <div className={styles.practice} {...fx('principles.practice-strip')}>
                <span className={styles.practiceLabel}>In practice</span>
                <p>{p.practice}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
