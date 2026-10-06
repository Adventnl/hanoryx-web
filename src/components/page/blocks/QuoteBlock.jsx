import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Quote from '../../kit/Quote';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * A pull quote with its source. Only words someone really said, with their say-so
 * — this site quotes its own principles, not testimonials.
 *
 *   { type: 'quote', quote, cite, context?, eyebrow? }
 */
export function QuoteBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent} className={styles.slim}>
      {block.eyebrow && <SectionHeader eyebrow={block.eyebrow} size="h2" />}
      <Reveal profile="zoomThrough" className={styles.quoteWrap} {...fx('quote.pull')}>
        <Quote cite={block.cite}>{block.quote}</Quote>
        {block.context && <p className={styles.context}>{block.context}</p>}
      </Reveal>
    </Shell>
  );
}

export default QuoteBlock;
