import { useRef } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { timelineIntro, timelineNodes } from '../../data/timeline';
import TimelineNode from '@/components/ui/TimelineNode';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './TimelineSection.module.css';

/**
 * Animated roadmap timeline. A vertical connecting line behind the marker dots
 * "flows like a data stream" — its scaleY is scrubbed from 0 -> 1 as the list
 * passes through the viewport, so the stream fills downward as you read.
 *
 * variant 'preview' (Home) -> first 3 nodes + link to the full timeline.
 * variant 'full'    (Timeline page) -> every node.
 */
export function TimelineSection({ variant = 'full' }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  const isPreview = variant === 'preview';
  const nodes = isPreview ? timelineNodes.slice(0, 3) : timelineNodes;

  useGSAP(
    () => {
      const line = ref.current?.querySelector(`.${styles.line}`);
      const list = ref.current?.querySelector(`.${styles.track}`);
      if (!line || !list) return;

      // Reduced motion: the stream is simply present, full height, unscrubbed.
      if (reduced) {
        gsap.set(line, { scaleY: 1 });
        return;
      }

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [reduced, variant] }
  );

  return (
    <section className={clsx('section', styles.section)}>
      <div className="container">
        <SectionHeader
          eyebrow={timelineIntro.eyebrow}
          title={timelineIntro.title}
          intro={timelineIntro.body}
          size="h1"
        />

        <div ref={ref} className={styles.body}>
          <ul className={styles.track}>
            {/* Flowing data-stream line, centered under the marker dots. */}
            <span className={styles.rail} aria-hidden="true">
              <span className={styles.line} />
            </span>

            {nodes.map((node, i) => (
              <TimelineNode
                key={node.id}
                index={i + 1}
                code={node.code}
                phase={node.phase}
                title={node.title}
                body={node.body}
                status={node.status}
                redacted={node.redacted}
                active={node.status === 'ACTIVE'}
              />
            ))}
          </ul>

          {isPreview && (
            <div className={styles.action}>
              <Button to="/timeline" variant="primary" icon={ArrowUpRight}>
                View full timeline
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
