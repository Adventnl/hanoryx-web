import clsx from 'clsx';
import { company } from '../../data/company';
import { SectionHeader } from '../ui/SectionHeader';
import { DataPanel } from '../ui/DataPanel';
import { Pill } from '../ui/Pill';
import { GlitchLine } from '../ui/GlitchLine';
import { ScrollReveal } from '../animation/ScrollReveal';
import styles from './CompanySignal.module.css';

/* The four operating disciplines, surfaced as restrained mono pills. */
const DISCIPLINES = [
  'Software engineering',
  'Interface design',
  'Automation',
  'Operational architecture',
];

/* Telemetry rows — flavor, not data. Kept in-file and unexported. */
const TELEMETRY = [
  { k: 'MODE', v: 'Build quietly' },
  { k: 'RELEASE', v: 'Deliberate' },
];

/**
 * CompanySignal — the company overview band.
 * A split, editorial layout: anchored serif statement on the left,
 * the signal copy and a disciplines panel on the right.
 */
export function CompanySignal() {
  return (
    <section className={clsx('section', styles.section)}>
      <div className="container">
        <div className={clsx('grid', 'grid--split', styles.grid)}>
          {/* LEFT — anchored statement */}
          <div className={styles.lead}>
            <SectionHeader
              eyebrow={company.signal.eyebrow}
              title={company.signal.title}
              size="h1"
              className={styles.header}
            />
          </div>

          {/* RIGHT — the signal narrative + disciplines */}
          <div className={clsx('stack stack-6', styles.detail)}>
            <ScrollReveal as="div" className={clsx('stack stack-4', styles.copy)} stagger={0.12}>
              {company.signal.body.map((paragraph) => (
                <p key={paragraph} className={clsx('body', styles.para)}>
                  {paragraph}
                </p>
              ))}
            </ScrollReveal>

            <DataPanel label="DISCIPLINES" code="SIG.01" className={styles.panel}>
              <div className={styles.pills}>
                {DISCIPLINES.map((discipline) => (
                  <Pill key={discipline} variant="ghost">
                    {discipline}
                  </Pill>
                ))}
              </div>

              <span className={styles.rule} aria-hidden="true" />

              <dl className={styles.telemetry}>
                {TELEMETRY.map(({ k, v }) => (
                  <div key={k} className={styles.row}>
                    <dt className={clsx('mono', styles.rowKey)}>{k}</dt>
                    <dd className={clsx('mono', styles.rowVal)}>{v}</dd>
                  </div>
                ))}
              </dl>
            </DataPanel>
          </div>
        </div>
      </div>

      <GlitchLine className={styles.divider} />
    </section>
  );
}

export default CompanySignal;
