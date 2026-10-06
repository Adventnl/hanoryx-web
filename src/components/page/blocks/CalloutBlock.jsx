import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Callout from '../../kit/Callout';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * A remark set apart from the page around it: a note, a tip, a warning. Use it
 * for the one thing a reader must not miss (an honest limit, an open question)
 * rather than for decoration.
 *
 *   { type: 'callout', tone: 'note'|'tip'|'warning'|'danger', heading?, body: [string], list?: [string],
 *     eyebrow?, title?, scene? }
 */
export function CalloutBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent} className={styles.slim}>
      {(block.eyebrow || block.title) && <SectionHeader eyebrow={block.eyebrow} title={block.title} size="h2" />}
      <Reveal profile="glassMaterialize" className={styles.narrow} {...fx('callout.remark')}>
        <Callout tone={block.tone} title={block.heading}>
          <div className={styles.calloutBody}>
            {block.body?.map((p) => <p key={p}>{p}</p>)}
            {block.list?.length > 0 && <ul>{block.list.map((li) => <li key={li}>{li}</li>)}</ul>}
          </div>
        </Callout>
      </Reveal>
    </Shell>
  );
}

export default CalloutBlock;
