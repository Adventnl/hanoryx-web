import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ArrowLink } from '../fx/ArrowLink';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './ChronologyStrip.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * A compact, horizontal preview of the company chronology. A line draws as the
 * strip scrolls into view and the phase nodes light in turn (--p, one
 * ScrollTrigger, CSS derives each node's state); the last node is the live one.
 * Every phase is a real link when it points at a case study.
 */
export default function ChronologyStrip({ eyebrow, title, intro, phases, linkLabel }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const n = phases.length;

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
      start: 'top 82%',
      end: 'top 30%',
      onUpdate: (self) => write(self.progress),
      onRefresh: (self) => write(self.progress),
    });
    write(trigger.progress);
    return () => trigger.kill();
  }, [reduced]);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <ol ref={ref} className={styles.strip} style={{ '--n': n }} {...fx('chronology.strip')}>
        <span className={styles.line} aria-hidden="true" {...fx('chronology.line-draw')}><span className={styles.fill} /></span>
        {phases.map((phase, i) => {
          const body = (
            <>
              <span className={styles.node} aria-hidden="true" data-live={phase.live ? 'true' : 'false'} />
              <Glyph name={phase.glyph} size={26} className={styles.glyph} />
              <span className={styles.code}>{phase.code}</span>
              <span className={styles.title}>{phase.title}</span>
              <span className={styles.head}>{phase.headline}</span>
            </>
          );
          return (
            <li key={phase.id} className={styles.item} style={{ '--i': i }} {...fx('chronology.phase-node')}>
              {phase.to ? <Link to={phase.to} className={`glyph-host ${styles.cell}`}>{body}</Link> : <div className={`glyph-host ${styles.cell}`}>{body}</div>}
            </li>
          );
        })}
      </ol>
      <div className={styles.more}>
        <ArrowLink to="/company/timeline">{linkLabel || 'Open the full timeline'}</ArrowLink>
      </div>
    </div>
  );
}
