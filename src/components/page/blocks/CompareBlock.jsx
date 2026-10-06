import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Card from '../../kit/Card';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * Two or three ways of looking at a choice, side by side: what to do and what not
 * to, before and after, this and that. Each column says in words what it is
 * (`label`), so the sides never depend on colour alone.
 *
 *   { type: 'compare', columns: [{ label, title, tone?: 'yes'|'no', items: [string] }], verdict?,
 *     eyebrow?, title?, intro? }
 */
export function CompareBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <RevealGroup className={styles.compare} itemClassName={styles.cell} stagger={0.08} {...fx('compare.columns')}>
        {block.columns.map((col) => (
          <div key={col.title} className={styles.col} data-tone={col.tone}>
            <Card eyebrow={col.label} title={col.title} as="h3" variant={col.tone === 'yes' ? 'accent' : 'raised'}>
              <ul>{col.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </Card>
          </div>
        ))}
      </RevealGroup>
      {block.verdict && <p className={styles.verdict}>{block.verdict}</p>}
    </Shell>
  );
}

export default CompareBlock;
