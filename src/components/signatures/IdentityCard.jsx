import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import clsx from 'clsx';
import { TiltSurface } from '../fx/TiltSurface';
import { brandLogo } from '../../utils/assetResolver';
import { company } from '../../data/company';
import styles from './IdentityCard.module.css';
import { fx } from '../../utils/fx';

/**
 * Hero object for the Company page: a card that leans toward the pointer and
 * turns over on click / Enter / Space. Front: the mark and status. Back: the
 * company and its development team, each one a link.
 *
 *   back: [{ label, line, to }]
 */
export default function IdentityCard({ back, hint }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <TiltSurface tilt={7} glare={false} className={styles.wrap}>
      <div className={clsx(styles.card, flipped && styles.flipped)} {...fx('identity.flip-card')}>
        <button
          type="button"
          className={clsx(styles.face, styles.front)}
          onClick={() => setFlipped(true)}
          aria-label="Turn the card over"
          tabIndex={flipped ? -1 : 0}
          data-cursor="card"
          data-cursor-label="Flip"
        >
          <span className={clsx('ghost-numeral', styles.watermark)} data-depth="22" aria-hidden="true" {...fx('identity.watermark-drift')}>H</span>
          <img className={styles.mark} src={brandLogo} alt="" data-depth="12" {...fx('identity.mark-parallax')} />
          <span className={styles.name} data-depth="6">{company.name}</span>
          <span className={styles.status} {...fx('identity.status-dot')}><i aria-hidden="true" />{company.status}</span>
          <span className={styles.flip}><RotateCw size={13} strokeWidth={1.5} aria-hidden="true" /> {hint || 'Turn over'}</span>
        </button>
        <div className={clsx(styles.face, styles.back)} aria-hidden={!flipped}>
          <ul className={styles.list} {...(flipped ? fx('identity.back-links') : {})}>
            {back.map((b) => (
              <li key={b.label}>
                <Link to={b.to} tabIndex={flipped ? 0 : -1} className={styles.entry}>
                  <span className={styles.entryLabel}>{b.label}</span>
                  <span className={styles.entryLine}>{b.line}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" className={styles.back2} onClick={() => setFlipped(false)} tabIndex={flipped ? 0 : -1} aria-label="Turn the card back">
            <RotateCw size={13} strokeWidth={1.5} aria-hidden="true" /> Back
          </button>
        </div>
      </div>
    </TiltSurface>
  );
}
