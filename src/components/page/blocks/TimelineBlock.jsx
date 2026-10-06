import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Timeline from '../../kit/Timeline';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * Things in the order they happen, down a line. Pass words (phases, steps), not
 * dates, unless the dates are known: this site publishes none it cannot back up.
 *
 *   { type: 'timeline', items: [{ when?, title, body?, done? }], eyebrow?, title?, intro? }
 */
export function TimelineBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <Reveal className={styles.narrow} {...fx('timeline.line')}>
        <Timeline items={block.items} />
      </Reveal>
    </Shell>
  );
}

export default TimelineBlock;
