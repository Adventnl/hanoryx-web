import clsx from 'clsx';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { company } from '../../data/company';
import { KineticText } from '../animation/KineticText';
import { ScrollReveal } from '../animation/ScrollReveal';
import { SystemGrid } from '../animation/SystemGrid';
import { Button } from '../ui/Button';
import { Pill } from '../ui/Pill';
import styles from './HeroSystem.module.css';

/**
 * HOME hero — a living system at rest. Full-viewport stage with a drifting
 * SystemGrid + faint radial behind, bottom-left content, and cinematic
 * telemetry decoration at the edges. The global background canvas shows
 * through the mostly-transparent surface.
 */
export function HeroSystem() {
  return (
    <section className={clsx('stage', styles.hero)}>
      {/* Background field — drifting grid + faint radial bloom */}
      <SystemGrid nodes={5} className={styles.grid} />
      <div className={styles.radial} aria-hidden="true" />

      {/* Corner telemetry — top */}
      <div className={clsx('mono', styles.cornerTop)} aria-hidden="true">
        <span>SYS.OP // LN.026</span>
        <span className={styles.cornerTopRight}>{company.locationCode}</span>
      </div>

      {/* Vertical telemetry rail, right edge */}
      <div className={clsx('telemetry-v', styles.rail)} aria-hidden="true">
        {company.division} — STANDING BY
      </div>

      {/* Primary content, bottom-left */}
      <div className={clsx('container', styles.inner)}>
        <div className={clsx('cluster', styles.eyebrowRow)}>
          <Pill variant="red" dot>
            {company.status}
          </Pill>
          <span className={clsx('mono', styles.eyebrowCode)}>{company.locationCode}</span>
        </div>

        <KineticText
          text={company.hero.title}
          as="h1"
          by="char"
          immediate
          className={clsx('display', styles.title)}
        />

        <ScrollReveal as="div" delay={0.15}>
          <h2 className={clsx('heading-2', 'font-serif', styles.line)}>
            {company.hero.line}
          </h2>
        </ScrollReveal>

        <ScrollReveal as="div" delay={0.3}>
          <p className={clsx('lead', styles.sub)}>{company.hero.sub}</p>
        </ScrollReveal>

        <ScrollReveal as="div" delay={0.45}>
          <div className={clsx('cluster', styles.ctas)}>
            <Button to="/systems" variant="primary" icon={ArrowUpRight}>
              Enter systems
            </Button>
            <Button to="/contact" variant="outline">
              Open a channel
            </Button>
          </div>
        </ScrollReveal>
      </div>

      {/* Scroll cue — bottom, with a thin pulsing vertical line */}
      <div className={styles.scrollCue} aria-hidden="true">
        <span className={clsx('mono', styles.scrollLabel)}>SCROLL</span>
        <span className={styles.scrollLine} />
        <ArrowDown size={12} strokeWidth={1.5} className={styles.scrollArrow} />
      </div>
    </section>
  );
}

export default HeroSystem;
