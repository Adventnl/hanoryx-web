import clsx from 'clsx';
import { manifesto } from '../../data/company';
import { KineticText } from '../animation/KineticText';
import { ScrollReveal } from '../animation/ScrollReveal';
import { SystemGrid } from '../animation/SystemGrid';
import { MarqueeRail } from '../ui/MarqueeRail';
import { GlitchLine } from '../ui/GlitchLine';
import styles from './ManifestoPanel.module.css';

/* The operating vocabulary, drifting beneath the doctrine. In-file, unexported. */
const RAIL_ITEMS = [
  'SYSTEMS',
  'INTERFACES',
  'ORCHESTRATION',
  'AUTOMATION',
  'CONTROL',
  'ARCHITECTURE',
  'TELEMETRY',
];

/**
 * ManifestoPanel — the operating doctrine, stated plainly.
 * A tall, editorial band: a faint system grid behind, a small eyebrow,
 * then the manifesto lines as large serif statements that resolve
 * line-by-line on scroll. The first line lands hardest (kinetic, by word);
 * the remaining lines drift up in a soft stagger. A vocabulary marquee and
 * a closing hairline seal the band.
 */
export function ManifestoPanel() {
  const [first, ...rest] = manifesto.lines;

  return (
    <section className={clsx('section', styles.section)}>
      <SystemGrid nodes={4} className={styles.field} />

      <div className={clsx('container', styles.inner)}>
        {/* Eyebrow — quiet telemetry label anchoring the doctrine. */}
        <ScrollReveal as="div" className={styles.head} y={20} blur={6}>
          <span className={clsx('eyebrow', styles.eyebrow)}>{manifesto.eyebrow}</span>
          <span className={clsx('node-dot', styles.dot)} aria-hidden="true" />
        </ScrollReveal>

        {/* The statements. */}
        <div className={styles.lines}>
          {/* First line — lands hardest: largest scale, kinetic per-word reveal. */}
          <KineticText
            as="p"
            text={first}
            by="word"
            duration={1.05}
            className={clsx('display', styles.lead)}
          />

          {/* Remaining lines — soft, staggered drift. */}
          <ScrollReveal
            as="div"
            className={styles.rest}
            stagger={0.16}
            y={42}
            blur={10}
            start="top 82%"
          >
            {rest.map((line) => (
              <p key={line} className={clsx('heading-1', 'font-serif', styles.line)}>
                {line}
              </p>
            ))}
          </ScrollReveal>
        </div>

        {/* Operating vocabulary, drifting. */}
        <ScrollReveal as="div" className={styles.railWrap} y={28} blur={6} start="top 90%">
          <MarqueeRail items={RAIL_ITEMS} speed={44} className={styles.rail} />
        </ScrollReveal>
      </div>

      <GlitchLine className={styles.divider} />
    </section>
  );
}

export default ManifestoPanel;
