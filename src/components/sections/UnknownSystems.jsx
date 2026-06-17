import clsx from 'clsx';
import { Lock } from 'lucide-react';
import { unknownSystems } from '../../data/systems';
import { SectionHeader } from '../ui/SectionHeader';
import { DataPanel } from '../ui/DataPanel';
import { RedactedTag } from '../ui/RedactedTag';
import { Pill } from '../ui/Pill';
import { RedactionReveal } from '../animation/RedactionReveal';
import { ScrollReveal } from '../animation/ScrollReveal';
import styles from './UnknownSystems.module.css';

/* Withheld detail strings — sized blocks that sit behind the redaction bars. */
const WITHHELD = [
  'Designation sealed pending review',
  'Interface signature suppressed',
  'Operating scope under restriction',
];

/**
 * Classified branches — blacked-out silhouettes of systems that exist but
 * are not yet ready to surface. Heavy redaction, one rare red accent.
 */
export function UnknownSystems() {
  return (
    <section className={clsx('section', styles.section)}>
      <div className="container">
        <SectionHeader
          eyebrow="Classified Branches"
          title="Systems below the surface."
          intro="Future modules exist. Detail is withheld until the architecture is ready to hold them."
          size="h1"
        />

        {/* Silhouette grid — auto-fit, collapses to one column on mobile. */}
        <ScrollReveal
          as="ul"
          className={clsx('grid', 'grid--auto', styles.grid)}
          stagger={0.1}
        >
          {unknownSystems.map((item, i) => {
            // Split the label so part reads in the clear, part is blacked out.
            const [lead, ...restWords] = item.label.split(' ');
            const redactedTail = restWords.join(' ');

            return (
              <li key={item.id} className={styles.item}>
                <DataPanel
                  tone="redacted"
                  code={item.code}
                  className={styles.panel}
                >
                  <div className={styles.inner}>
                    {/* Status strip — red used at the threshold, first node only. */}
                    <div className={clsx('cluster', styles.status)}>
                      <RedactedTag label="CLASSIFIED" lock />
                      {i === 0 && <Pill variant="red">RESTRICTED</Pill>}
                    </div>

                    {/* Partly-redacted label: a visible fragment + a black bar. */}
                    <p className={styles.label}>
                      <span className={clsx('font-serif', styles.labelLead)}>
                        {lead}
                      </span>
                      {redactedTail && (
                        <RedactedTag className={styles.labelBar}>
                          {redactedTail}
                        </RedactedTag>
                      )}
                    </p>

                    {/* The one detail that decrypts on scroll — then stays sealed. */}
                    <RedactionReveal
                      as="p"
                      label="DECRYPTING"
                      className={styles.detail}
                    >
                      {WITHHELD[i % WITHHELD.length]}
                    </RedactionReveal>

                    {/* Quiet mono footer — operational note. */}
                    <div className={styles.foot}>
                      <Lock
                        size={11}
                        strokeWidth={1.6}
                        aria-hidden="true"
                        className={styles.footIcon}
                      />
                      <span className={clsx('mono', styles.note)}>{item.note}</span>
                    </div>
                  </div>
                </DataPanel>
              </li>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}

export default UnknownSystems;
