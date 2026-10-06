import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Disclosure from '../../kit/Disclosure';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * Questions and their answers, each one a disclosure: the closed answer is out of
 * the tab order and the reading order, not just out of sight. The first can start open.
 *
 *   { type: 'faq', items: [{ q, a: [string] }], openFirst?, eyebrow?, title?, intro? }
 */
export function FaqBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <Reveal className={styles.faq} {...fx('faq.disclosures')}>
        {block.items.map((item, i) => (
          <Disclosure key={item.q} title={item.q} defaultOpen={Boolean(block.openFirst) && i === 0}>
            <div className={styles.answer}>{(Array.isArray(item.a) ? item.a : [item.a]).map((p) => <p key={p}>{p}</p>)}</div>
          </Disclosure>
        ))}
      </Reveal>
    </Shell>
  );
}

export default FaqBlock;
