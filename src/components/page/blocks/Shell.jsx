import clsx from 'clsx';
import { SectionScene } from '../../scenes/SectionScene';
import styles from './blocks.module.css';

/* Section wrapper: each block owns its own scene background + container, and an
   optional anchor id the ScrollRail can jump to. */
export function Shell({ block, accent, className, children }) {
  return (
    <SectionScene
      id={block.anchor}
      scene={block.scene}
      intensity={block.intensity || (block.scene ? 'medium' : 'low')}
      accent={accent}
      className={clsx('section', styles.block, className)}
    >
      <div className="container">{children}</div>
    </SectionScene>
  );
}

export default Shell;
