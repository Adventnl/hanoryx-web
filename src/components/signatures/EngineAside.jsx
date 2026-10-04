import { TiltSurface } from '../fx/TiltSurface';
import { MiniEngine } from './MiniEngine';
import styles from './EngineAside.module.css';

/** Hero object for YK Engine: a framed miniature viewport that leans toward the
 *  pointer. Decoration drawn to evoke an engine viewport — not engine output. */
export default function EngineAside({ caption }) {
  return (
    <TiltSurface tilt={7} className={styles.wrap}>
      <div className={styles.frame}>
        <span className={styles.corner} data-c="tl" />
        <span className={styles.corner} data-c="tr" />
        <span className={styles.corner} data-c="bl" />
        <span className={styles.corner} data-c="br" />
        <MiniEngine count={11} className={styles.view} />
        <span className={styles.tag} data-depth="12">Viewport</span>
      </div>
      {caption && <span className={styles.caption}>{caption}</span>}
    </TiltSurface>
  );
}
