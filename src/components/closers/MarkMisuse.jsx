import CloserFrame from './CloserFrame';
import { brandLogo } from '../../utils/assetResolver';
import { fx } from '../../utils/fx';
import styles from './MarkMisuse.module.css';

/** The mark, used wrongly six ways and rightly once — each tile carrying the
 *  one-line reason. The wrong versions are real transforms of the real file. */
export default function MarkMisuse({ tag, title, lede, tiles = [], onward }) {
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <ul className={styles.grid} {...fx('misuse.gallery')}>
        {tiles.map((t) => (
          <li key={t.id} className={t.right ? styles.right : styles.wrong}>
            <span className={styles.stage}>
              <img src={brandLogo} alt="" width="84" height="84" style={t.style} />
              {t.right ? <span className={styles.badge}>Correct</span> : <span className={styles.cross} aria-hidden="true" />}
            </span>
            <b>{t.name}</b>
            <span>{t.why}</span>
          </li>
        ))}
      </ul>
    </CloserFrame>
  );
}
