import { Fragment, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './KineticText.module.css';

/**
 * Split-text reveal. Each character (or word) rises out of a clipped line
 * with a staggered cadence — the signature "kinetic" headline motion.
 * Pure CSS spans, no paid SplitText plugin. Accessible: the visible spans
 * are aria-hidden and the original string is exposed via aria-label.
 *
 * Props:
 *   text       string to animate (required)
 *   as         element tag (default 'span')
 *   by         'char' | 'word' (default 'char')
 *   stagger    per-unit stagger (auto if omitted)
 *   duration   per-unit duration (default 0.9)
 *   immediate  play on mount instead of on scroll (default false)
 *   delay      initial delay (default 0)
 *   start      ScrollTrigger start (default 'top 88%')
 */
export function KineticText({
  text = '',
  as: Tag = 'span',
  by = 'char',
  stagger,
  duration = 0.9,
  immediate = false,
  delay = 0,
  start = 'top 88%',
  className,
}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const isWord = by === 'word';
  const tokens = isWord ? String(text).split(' ') : Array.from(String(text));
  const autoStagger = stagger ?? (isWord ? 0.05 : 0.02);

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const inners = ref.current.querySelectorAll('[data-knt]');
      if (!inners.length) return;

      const tween = {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'power3.out',
        stagger: autoStagger,
      };
      if (!immediate) {
        tween.scrollTrigger = { trigger: ref.current, start };
      }
      gsap.fromTo(inners, { yPercent: 115, opacity: 0 }, tween);
    },
    { scope: ref, dependencies: [reduced, text] }
  );

  return (
    <Tag ref={ref} className={clsx(styles.kinetic, className)} aria-label={String(text)}>
      {tokens.map((token, i) => {
        if (isWord) {
          return (
            <Fragment key={i}>
              <span className={styles.unit} aria-hidden="true">
                <span data-knt className={styles.inner}>{token}</span>
              </span>
              {i < tokens.length - 1 ? ' ' : null}
            </Fragment>
          );
        }
        if (token === ' ') return <Fragment key={i}>{' '}</Fragment>;
        return (
          <span key={i} className={styles.unit} aria-hidden="true">
            <span data-knt className={styles.inner}>{token}</span>
          </span>
        );
      })}
    </Tag>
  );
}

export default KineticText;
