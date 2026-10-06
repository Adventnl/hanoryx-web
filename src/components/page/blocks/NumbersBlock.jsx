import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Stat from '../../kit/Stat';
import Sparkline from '../../kit/Sparkline';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * A row of figures, each large and labelled, with how it moved in words and, if
 * there is a series, a line beside it. `note` is required in spirit: say where the
 * figures come from, or that they are sample data. This site shows no number it
 * cannot stand behind.
 *
 *   { type: 'numbers', items: [{ label, value, unit?, change?, changeLabel?, series?: [number] }], note,
 *     eyebrow?, title?, intro? }
 */
export function NumbersBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <RevealGroup className={styles.figures} itemClassName={styles.cell} stagger={0.07} {...fx('numbers.figures')}>
        {block.items.map((item) => (
          <div key={item.label} className={styles.figure}>
            <Stat label={item.label} value={item.value} unit={item.unit} change={item.change} changeLabel={item.changeLabel} />
            {item.series?.length > 1 && <Sparkline data={item.series} label={item.label} unit={item.unit} />}
          </div>
        ))}
      </RevealGroup>
      {block.note && <p className={styles.note}>{block.note}</p>}
    </Shell>
  );
}

export default NumbersBlock;
