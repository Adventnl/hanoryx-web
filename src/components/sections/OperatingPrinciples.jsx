import clsx from 'clsx';
import { operatingPrinciples } from '../../data/company';
import SectionHeader from '../ui/SectionHeader';
import DataPanel from '../ui/DataPanel';
import ScrollReveal from '../animation/ScrollReveal';
import styles from './OperatingPrinciples.module.css';

/**
 * Numbered-list doctrine grid. Reusable for company operating principles
 * ({index,title,body}) or North engineering principles ({code,title,body}).
 * The marker reads item.index || item.code so both shapes render cleanly.
 *
 * Props:
 *   principles  array of { id?, index|code, title, body } (defaults to company doctrine)
 *   eyebrow     mono label above the title
 *   title       serif heading
 *   intro       optional lead paragraph
 */
export function OperatingPrinciples({
  principles = operatingPrinciples,
  eyebrow = 'Operating Principles',
  title = 'Controlled by design.',
  intro,
}) {
  return (
    <section className={clsx('section', styles.section)}>
      <div className="container">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          size="h1"
        />

        {/* Stagger the cards in as the grid enters view. */}
        <ScrollReveal
          className={clsx('grid', 'grid--auto', styles.grid)}
          stagger={0.08}
          y={28}
        >
          {principles.map((item, i) => {
            const marker = item.index || item.code;
            return (
              <DataPanel
                key={item.id || marker || i}
                interactive
                code={marker}
                className={styles.card}
              >
                <span className={styles.marker} aria-hidden="true">
                  {marker}
                </span>
                <h3 className={clsx('heading-3', styles.title)}>{item.title}</h3>
                <p className={clsx('body-sm', styles.body)}>{item.body}</p>
              </DataPanel>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}

export default OperatingPrinciples;
