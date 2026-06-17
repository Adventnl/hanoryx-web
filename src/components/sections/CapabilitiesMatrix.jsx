import { useRef } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { capabilitiesIntro, capabilities } from '../../data/capabilities';
import SectionHeader from '../ui/SectionHeader';
import AnimatedCounter from '../animation/AnimatedCounter';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './CapabilitiesMatrix.module.css';

// Final scaleX targets, derived once from the matrix levels (0–100 -> 0–1).
const LEVELS = capabilities.map((cap) => cap.level / 100);

/**
 * Instrument-panel capabilities matrix. Each row reads as a telemetry channel:
 * mono code, serif label + detail, and a thin meter bar whose fill scales in
 * from the left on scroll, with a red accent glow riding the leading edge.
 */
export function CapabilitiesMatrix() {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const fills = gsap.utils.toArray(`.${styles.fill}`);
      if (!fills.length) return;

      // Reduced motion: snap each fill to its final width, no animation.
      if (reduced) {
        fills.forEach((fill, i) => gsap.set(fill, { scaleX: LEVELS[i] }));
        return;
      }

      gsap.fromTo(
        fills,
        { scaleX: 0 },
        {
          scaleX: (i) => LEVELS[i],
          duration: 1.4,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        }
      );
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <section className={clsx('section', styles.section)}>
      <div className="container">
        <SectionHeader
          eyebrow={capabilitiesIntro.eyebrow}
          title={capabilitiesIntro.title}
          intro={capabilitiesIntro.body}
          size="h1"
        />

        <div ref={ref} className={styles.matrix} role="list">
          {capabilities.map((cap) => (
            <div key={cap.id} className={styles.row} role="listitem">
              <span className={clsx('mono', styles.code)}>{cap.code}</span>

              <div className={styles.info}>
                <h3 className={clsx('heading-3', styles.label)}>{cap.label}</h3>
                <p className={clsx('body-sm', 'text-dim', styles.detail)}>
                  {cap.detail}
                </p>
              </div>

              <div className={styles.meter}>
                <div className={styles.track} aria-hidden="true">
                  <div className={styles.fill}>
                    <span className={styles.edge} />
                  </div>
                </div>
                <AnimatedCounter
                  value={cap.level}
                  suffix="%"
                  className={clsx('mono', styles.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesMatrix;
