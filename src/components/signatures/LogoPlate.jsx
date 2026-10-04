import { TiltSurface } from '../fx/TiltSurface';
import { musebaseLogo, hasMusebaseLogo } from '../../utils/assetResolver';
import styles from './LogoPlate.module.css';

/**
 * Hero object for the Musebase page: the real mark, set on a light plate like a
 * physical card, in front of two more plates (the mark itself is a stack of
 * planes). The set leans toward the pointer and each plate drifts at its own
 * depth against the tilt. Falls back to a wordmark if the logo asset is absent.
 */
export default function LogoPlate({ caption }) {
  return (
    <TiltSurface tilt={10} glare className={styles.wrap}>
      <span className={styles.back2} data-depth="34" aria-hidden="true" />
      <span className={styles.back1} data-depth="20" aria-hidden="true" />
      <div className={styles.front} data-depth="6">
        {hasMusebaseLogo ? (
          <img src={musebaseLogo} alt="Musebase" className={styles.logo} />
        ) : (
          <span className={styles.word}>Musebase</span>
        )}
      </div>
      {caption && <span className={styles.caption}>{caption}</span>}
    </TiltSurface>
  );
}
