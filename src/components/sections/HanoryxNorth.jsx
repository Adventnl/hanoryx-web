import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { north } from '../../data/company';
import { SectionHeader } from '../ui/SectionHeader';
import { DataPanel } from '../ui/DataPanel';
import { Button } from '../ui/Button';
import { ScrollReveal } from '../animation/ScrollReveal';
import styles from './HanoryxNorth.module.css';

/**
 * Home preview of Hanoryx North — the engineering division.
 * SectionHeader + a stagger-revealed rail of pillar DataPanels + a CTA.
 * The pillars read as an engineering ledger: mono codes, hairlines, indices.
 */
export function HanoryxNorthPreview() {
  return (
    <section className={clsx('section', styles.section)}>
      {/* Faint engineering rail running down the left edge of the band */}
      <span className={styles.rail} aria-hidden="true" />

      <div className="container">
        <SectionHeader
          eyebrow={north.eyebrow}
          title={north.title}
          intro={north.lead}
          size="h1"
          className={styles.header}
        />

        <ScrollReveal
          className={clsx('grid', 'grid--2', styles.pillars)}
          stagger={0.12}
          y={42}
          start="top 80%"
        >
          {north.pillars.map((pillar, i) => (
            <DataPanel
              key={pillar.id}
              code={pillar.code}
              label={`N.0${i + 1}`}
              interactive
              className={styles.pillar}
            >
              <h3 className={clsx('heading-3', styles.title)}>{pillar.title}</h3>
              <p className={clsx('body-sm', 'text-dim', styles.body)}>{pillar.body}</p>
            </DataPanel>
          ))}
        </ScrollReveal>

        <div className={styles.foot}>
          <span className={clsx('mono', styles.footCode)} aria-hidden="true">
            N.DIVISION // {north.pillars.length} PILLARS
          </span>
          <Button to="/north" variant="primary" icon={ArrowUpRight}>
            Enter Hanoryx North
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HanoryxNorthPreview;
