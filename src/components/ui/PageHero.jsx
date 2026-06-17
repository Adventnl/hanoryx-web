import clsx from 'clsx';
import { KineticText } from '../animation/KineticText';
import { ScrollReveal } from '../animation/ScrollReveal';
import { SystemGrid } from '../animation/SystemGrid';
import styles from './PageHero.module.css';

/**
 * Cinematic inner-page header (used by every page except Home, which has its
 * own HeroSystem). Kinetic serif title over a faint system grid, with mono
 * eyebrow, lead, and a telemetry corner.
 *
 * Props: eyebrow, title, intro, code, status, children, align ('left'|'center')
 */
export function PageHero({ eyebrow, title, intro, code = 'NODE.000', status = 'ONLINE', align = 'left', children }) {
  return (
    <header className={clsx(styles.hero, align === 'center' && styles.center)}>
      <SystemGrid nodes={4} />

      <div className={clsx('container', styles.inner)}>
        {eyebrow && (
          <ScrollReveal as="span" className={clsx('eyebrow', styles.eyebrow)}>
            {eyebrow}
          </ScrollReveal>
        )}

        <KineticText as="h1" by="word" text={title} className={clsx('heading-hero', styles.title)} immediate delay={0.1} />

        {intro && (
          <ScrollReveal as="p" className={clsx('lead', styles.intro)} delay={0.15}>
            {intro}
          </ScrollReveal>
        )}

        {children}
      </div>

      <div className={styles.telemetry} aria-hidden="true">
        <span className={styles.tcode}>{code}</span>
        <span className={styles.tline} />
        <span className={styles.tstatus}>
          <span className={styles.tdot} />
          {status}
        </span>
      </div>
    </header>
  );
}

export default PageHero;
