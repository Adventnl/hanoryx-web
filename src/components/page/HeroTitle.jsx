import { Fragment, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useProximity } from '../../hooks/useProximity';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './HeroTitle.module.css';

/**
 * The hero headline. Two motions in sequence, on the same words:
 *  1. entrance — each word rises out of a clipped line, staggered (GSAP);
 *  2. afterwards the words answer the pointer (lift, swell, warm toward red).
 * Once a word has landed its clip is released so the lift can overshoot the
 * line. Touch and reduced motion get the entrance only / plain text.
 */
export function HeroTitle({ text, as: Tag = 'h1', className, delay = 0.1, ...rest }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const words = String(text).split(' ');
  useProximity(ref, { radius: 260, deps: [text] });

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const inners = ref.current.querySelectorAll('[data-knt]');
      const units = ref.current.querySelectorAll('[data-unit]');
      gsap.fromTo(
        inners,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.15,
          delay,
          stagger: 0.075,
          ease: 'power4.out',
          // release the clip once landed so pointer lift can overshoot the line
          onComplete: () => units.forEach((u) => { u.style.overflow = 'visible'; }),
        }
      );
    },
    { scope: ref, dependencies: [reduced, text] }
  );

  return (
    <Tag ref={ref} className={clsx(styles.title, className)} aria-label={String(text)} {...rest}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className={styles.unit} data-unit aria-hidden="true">
            <span data-knt className={styles.inner}>
              <span data-prox className={styles.prox}>{word}</span>
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export default HeroTitle;
