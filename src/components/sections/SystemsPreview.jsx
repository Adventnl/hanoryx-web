import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { systemsIntro, systemCategories, musebase } from '../../data/systems';
import { musebaseLogo, hasMusebaseLogo } from '../../utils/assetResolver';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { DataPanel } from '../ui/DataPanel';
import { Pill } from '../ui/Pill';
import { Button } from '../ui/Button';
import { ScrollReveal } from '../animation/ScrollReveal';
import styles from './SystemsPreview.module.css';

/**
 * Systems showcase. Two variants:
 *   preview — first four categories + a "view all" affordance (Home)
 *   full    — all seven categories + a compact featured Musebase panel (Systems)
 */
export function SystemsPreview({ variant = 'preview' }) {
  const isFull = variant === 'full';
  const categories = isFull ? systemCategories : systemCategories.slice(0, 4);

  return (
    <section className={clsx('section', styles.section)}>
      <div className="container">
        <SectionHeader
          eyebrow={systemsIntro.eyebrow}
          title={systemsIntro.title}
          intro={systemsIntro.body}
          size="h1"
        />

        {/* Category grid — auto-fit, collapses to one column on mobile. */}
        <ScrollReveal className={clsx('grid', 'grid--auto', styles.grid)} stagger={0.08}>
          {categories.map((cat) => (
            <Card
              key={cat.id}
              code={cat.code}
              title={cat.title}
              description={cat.summary}
              tags={cat.tags}
              status={cat.status}
              to="/systems"
              interactive
            />
          ))}
        </ScrollReveal>

        {isFull ? (
          /* Featured Musebase — one compact panel, deliberately understated. */
          <ScrollReveal className={styles.featured}>
            <DataPanel label="FEATURED SYSTEM" code={musebase.code} className={styles.mbPanel}>
              <div className={styles.mbGrid}>
                <div className={styles.mbIdentity}>
                  {hasMusebaseLogo ? (
                    <img src={musebaseLogo} alt="Musebase" className={styles.mblogo} />
                  ) : (
                    <span className={clsx('font-serif', styles.mbWordmark)}>MUSEBASE</span>
                  )}
                  <div className={clsx('cluster', styles.mbMeta)}>
                    <span className={clsx('mono', styles.mbType)}>{musebase.type}</span>
                    <Pill variant="red" dot>{musebase.status}</Pill>
                  </div>
                  <p className={clsx('body', 'measure', styles.mbSummary)}>{musebase.summary}</p>
                </div>

                <dl className={styles.mbModules}>
                  {musebase.modules.map((m) => (
                    <div key={m.k} className={styles.mbRow}>
                      <dt className={clsx('mono', styles.mbKey)}>{m.k}</dt>
                      <dd className={styles.mbVal}>{m.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </DataPanel>
          </ScrollReveal>
        ) : (
          <ScrollReveal className={styles.cta}>
            <Button to="/systems" variant="primary" icon={ArrowUpRight}>
              View all systems
            </Button>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

export default SystemsPreview;
