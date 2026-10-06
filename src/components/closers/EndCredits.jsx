import clsx from 'clsx';
import CloserFrame from './CloserFrame';
import { useOnScreen } from '../../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './EndCredits.module.css';

/** Roll credits for the company: not people, but the disciplines, the work and
 *  the parts it is made from. It scrolls only while it is on screen, slows to a
 *  stop under the pointer, and is a plain list under reduced motion. */
export default function EndCredits({ tag, title, lede, credits = [], onward }) {
  const [ref, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.2 });
  const reduced = usePrefersReducedMotion();
  const list = (
    <>
      {credits.map((c) => (
        <div key={c.role} className={styles.block}>
          <p className={styles.role}>{c.role}</p>
          {c.names.map((n) => <p key={n} className={styles.name}>{n}</p>)}
        </div>
      ))}
    </>
  );
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div ref={ref} className={clsx(styles.screen, reduced && styles.still)} {...fx('credits.screen')}>
        <div className={styles.reel} style={{ animationPlayState: onScreen && !reduced ? 'running' : 'paused' }} {...fx('credits.reel')}>
          <div>{list}</div>
          <div aria-hidden="true">{list}</div>
        </div>
      </div>
    </CloserFrame>
  );
}
