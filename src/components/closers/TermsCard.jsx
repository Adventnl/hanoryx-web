import { useState } from 'react';
import clsx from 'clsx';
import { Check, Copy, Minus, RotateCw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { TiltSurface } from '../fx/TiltSurface';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './TermsCard.module.css';

/** The terms on a single card that turns over: what you can do on one side,
 *  what not to lean on on the other. Tilts toward the pointer; the flip is a
 *  button, so it works without one. */
export default function TermsCard({ tag, title, lede, can = [], cant = [], onward }) {
  const [back, setBack] = useState(false);
  const [copied, copy] = useCopy();
  const text = `THE TERMS, ON ONE CARD\n\nYou can:\n${can.map((c) => `- ${c}`).join('\n')}\n\nDon't lean on:\n${cant.map((c) => `- ${c}`).join('\n')}`;
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.stage}>
        <TiltSurface tilt={6} glare={false} className={styles.tilt} {...fx('terms.card-tilt')}>
          <div className={clsx(styles.card, back && styles.flipped)} {...fx('terms.card-flip')}>
            <div className={clsx(styles.face, styles.front)} aria-hidden={back}>
              <span className={styles.chip} aria-hidden="true" />
              <p className={styles.kicker}>You can</p>
              <ul>
                {can.map((c) => <li key={c}><Check size={14} aria-hidden="true" />{c}</li>)}
              </ul>
              <span className={styles.stripe} aria-hidden="true" />
            </div>
            <div className={clsx(styles.face, styles.rear)} aria-hidden={!back}>
              <p className={styles.kicker}>Don’t lean on</p>
              <ul>
                {cant.map((c) => <li key={c}><Minus size={14} aria-hidden="true" />{c}</li>)}
              </ul>
              <span className={styles.stripe} aria-hidden="true" />
            </div>
          </div>
        </TiltSurface>
        <div className={styles.controls}>
          <button type="button" className={clsx(shared.btn, shared.btnRed)} onClick={() => setBack((v) => !v)} aria-pressed={back} {...fx('terms.flip-button')}>
            <RotateCw size={14} aria-hidden="true" /> {back ? 'Show what you can do' : 'Turn it over'}
          </button>
          <button type="button" className={shared.btn} onClick={() => copy(text)} {...fx('terms.copy-card')}>
            <Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy as text'}
          </button>
        </div>
      </div>
    </CloserFrame>
  );
}
