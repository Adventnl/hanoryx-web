import clsx from 'clsx';
import { projects } from '../../data/systems';
import { musebaseLogo, hasMusebaseLogo } from '../../utils/assetResolver';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { DataPanel } from '../ui/DataPanel';
import { RedactedTag } from '../ui/RedactedTag';
import { Pill } from '../ui/Pill';
import { ScrollReveal } from '../animation/ScrollReveal';
import { RedactionReveal } from '../animation/RedactionReveal';
import styles from './ProjectCodex.module.css';

/**
 * Work page — the Project Codex.
 * A controlled record of selected systems. Public systems render as Cards;
 * the featured Musebase gets slight emphasis without dominating. Classified
 * systems render as blacked-out, silhouette DataPanels with redaction bars.
 */
export function ProjectCodex() {
  return (
    <section className={clsx('section', styles.section)}>
      <div className="container">
        <SectionHeader
          eyebrow="Project Codex"
          title="Selected systems."
          intro="A controlled record. Some active, some withheld."
          size="h1"
        />

        {/* Auto-fit codex grid; collapses to one column on mobile. */}
        <ScrollReveal className={clsx('grid', 'grid--auto', styles.grid)} stagger={0.08}>
          {projects.map((p) =>
            p.classified ? (
              <DataPanel
                key={p.id}
                code={p.code}
                tone="redacted"
                interactive
                className={styles.redactedCard}
              >
                <RedactedTag label="CLASSIFIED" lock />

                {/* Blacked-out silhouette name — sized to the real name. */}
                <RedactionReveal as="span" label="LOCKED" className={styles.silhouette}>
                  {p.name}
                </RedactionReveal>

                <p className={clsx('body', styles.restricted)}>{p.summary}</p>

                <span className={clsx('mono', styles.note)}>// RESTRICTED DETAIL</span>
              </DataPanel>
            ) : (
              <Card
                key={p.id}
                code={p.code}
                label={p.type}
                title={
                  p.featured && hasMusebaseLogo ? (
                    <img src={musebaseLogo} alt="Musebase" className={styles.featuredLogo} />
                  ) : (
                    p.name
                  )
                }
                description={p.summary}
                status={p.status}
                interactive
                className={clsx(p.featured && styles.featured)}
              >
                {p.featured && (
                  <Pill variant="red" dot className={styles.featuredFlag}>
                    Featured system
                  </Pill>
                )}
              </Card>
            )
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}

export default ProjectCodex;
