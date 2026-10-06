import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { fx } from '../../../utils/fx';
import styles from './blocks.module.css';

gsap.registerPlugin(ScrollTrigger);

/** Steps on a rail that FILLS as you scroll: a lit line and a travelling token
 *  advance from step to step, and each step brightens as the token reaches it.
 *  One ScrollTrigger writes --p; everything else is CSS. */
export function ProcessBlock({ block, accent }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const n = block.steps.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced) {
      el.style.setProperty('--p', '1');
      return undefined;
    }
    const write = (p) => el.style.setProperty('--p', p.toFixed(4));
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 72%',
      end: 'bottom 58%',
      onUpdate: (self) => write(self.progress),
      onRefresh: (self) => write(self.progress),
    });
    write(trigger.progress);
    return () => trigger.kill();
  }, [reduced]);

  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h1" variant="scan" />
      <ol ref={ref} className={styles.process} style={{ '--n': n }} {...fx('process.scrub-rail')}>
        <span className={styles.railTrack} aria-hidden="true">
          <span className={styles.railFill} />
          <span className={styles.railToken} {...fx('process.rail-token')} />
        </span>
        {block.steps.map((s, i) => (
          <li key={s.title} className={styles.step} style={{ '--i': i }} {...fx('process.step-light')}>
            <span className={styles.stepNode} aria-hidden="true" />
            <span className={styles.stepNum} aria-hidden="true">{s.step}</span>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepBody}>{s.body}</p>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

export default ProcessBlock;
