import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import DescriptionList from '../../kit/DescriptionList';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * A fact sheet: labels and their values, in a real description list so that
 * a screen reader pairs each term with its detail.
 *
 *   { type: 'facts', items: [{ term, detail }], stacked?, eyebrow?, title?, intro? }
 */
export function FactsBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <Reveal className={styles.facts} {...fx('facts.sheet')}>
        <DescriptionList items={block.items} stacked={Boolean(block.stacked)} />
      </Reveal>
    </Shell>
  );
}

export default FactsBlock;
