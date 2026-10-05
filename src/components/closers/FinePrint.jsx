import { useRef, useState } from 'react';
import clsx from 'clsx';
import { ZoomIn } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePointerField } from '../../hooks/usePointerField';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './FinePrint.module.css';

/** The disclaimers in genuinely tiny type, with a lens that follows the pointer
 *  and reads the line under it at a size you can read. The lens is decoration:
 *  the real text is always present at its real size, and a switch turns the
 *  whole block up to a comfortable size for anyone without a pointer. */
export default function FinePrint({ tag, title, lede, lines = [], onward }) {
  const ref = useRef(null);
  usePointerField(ref);
  const [big, setBig] = useState(false);
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.wrap}>
        <button type="button" className={clsx(shared.btn, big && shared.btnOn)} aria-pressed={big} onClick={() => setBig((v) => !v)} {...fx('fineprint.size-switch')}>
          <ZoomIn size={14} aria-hidden="true" /> {big ? 'Back to fine print' : 'Read it at a normal size'}
        </button>
        <div ref={ref} className={clsx(styles.paper, big && styles.big)} {...fx('fineprint.lens')}>
          <ol className={styles.text}>
            {lines.map((l) => <li key={l}>{l}</li>)}
          </ol>
          <ol className={styles.glass} aria-hidden="true">
            {lines.map((l) => <li key={l}>{l}</li>)}
          </ol>
          <span className={styles.ring} aria-hidden="true" />
        </div>
      </div>
    </CloserFrame>
  );
}
