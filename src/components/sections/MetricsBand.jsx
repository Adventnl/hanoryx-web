import clsx from 'clsx';
import { metrics } from '../../data/company';
import { StatBlock } from '../ui/StatBlock';
import { GlitchLine } from '../ui/GlitchLine';
import { ScrollReveal } from '../animation/ScrollReveal';
import styles from './MetricsBand.module.css';

/**
 * Telemetry metrics band — a bordered instrument strip of animated StatBlocks
 * separated by vertical hairlines. Doubles as the Work "system status band".
 */
export function MetricsBand() {
  return (
    <section className={clsx('section section--tight', styles.band)}>
      <div className="container">
        <ScrollReveal as="div" className={clsx('panel-raised', styles.strip)}>
          {/* Top accent + telemetry eyebrow */}
          <GlitchLine className={styles.accent} />
          <span className={styles.eyebrow}>// SYSTEM STATUS</span>

          <div className={styles.grid}>
            {metrics.map((metric) => (
              <StatBlock
                key={metric.id}
                value={metric.value}
                suffix={metric.suffix}
                decimals={Number.isInteger(metric.value) ? 0 : 1}
                label={metric.label}
                note={metric.note}
                className={styles.cell}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default MetricsBand;
