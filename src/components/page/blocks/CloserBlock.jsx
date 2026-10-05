import { Suspense } from 'react';
import clsx from 'clsx';
import { SectionScene } from '../../scenes/SectionScene';
import { closerRegistry } from '../../closers/registry';
import styles from './blocks.module.css';

/** The last block of a page: a composition that plays the page out (see
 *  closers/). Reserves its height while the chunk loads so nothing jumps. */
export function CloserBlock({ block, accent }) {
  const Closer = closerRegistry[block.kind];
  if (!Closer) return null;
  return (
    <SectionScene
      as="section"
      id={block.anchor}
      scene={block.scene}
      intensity="low"
      accent={accent}
      className={clsx('section', styles.closer)}
      aria-label={block.tag || 'End of page'}
    >
      <div className="container">
        <Suspense fallback={<div style={{ minHeight: block.minHeight || 360 }} />}>
          <Closer {...block} />
        </Suspense>
      </div>
    </SectionScene>
  );
}

export default CloserBlock;
