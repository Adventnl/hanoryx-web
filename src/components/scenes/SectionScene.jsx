import clsx from 'clsx';
import { SceneCanvas } from './SceneCanvas';
import styles from './SectionScene.module.css';

const INTENSITY_COST = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  hero: 'hero',
};

const INTENSITY_DENSITY = {
  low: 0.7,
  medium: 1,
  high: 1.25,
  hero: 1.4,
};

/**
 * Wraps a section with its own animated scene behind the content. This is how
 * the site avoids one global background: every block declares its own
 * `scene` + `intensity`. The canvas paints behind; content sits above with a
 * stacking context. `contain` keeps each scene's paints isolated.
 *
 * Props:
 *   scene      registered scene name (omit for a plain section)
 *   intensity  'low' | 'medium' | 'high' | 'hero'  (default 'medium')
 *   accent     #hex accent passed to the scene
 *   density    extra density multiplier
 *   fade       soft mask the scene edges (default true)
 *   as         element tag (default 'section')
 */
export function SectionScene({
  scene,
  intensity = 'medium',
  accent = '#ff3333',
  density = 1,
  fade = true,
  as: Tag = 'section',
  className,
  children,
  ...rest
}) {
  return (
    <Tag className={clsx(styles.section, className)} {...rest}>
      {scene && (
        <div className={clsx(styles.sceneLayer, fade && styles.fade)} aria-hidden="true">
          <SceneCanvas
            scene={scene}
            cost={INTENSITY_COST[intensity] || 'medium'}
            density={(INTENSITY_DENSITY[intensity] || 1) * density}
            accent={accent}
          />
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </Tag>
  );
}

export default SectionScene;
