import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './ScrollWords.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * A passage that lights up word by word as you scroll through it — reading
 * pace becomes scroll pace. One ScrollTrigger writes a single --p (0..1) onto
 * the element; every word derives its own opacity from --p and its index in
 * CSS, so there is no per-word JS. Wrap a word in *asterisks* to give it the
 * accent when lit. Reduced motion shows the whole passage lit.
 */
export function ScrollWords({ text, as: Tag = 'p', className, startAt = 0.86, endAt = 0.42, ...rest }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const words = String(text).split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced) {
      el.style.setProperty('--p', '1');
      return undefined;
    }
    const write = (progress) => el.style.setProperty('--p', progress.toFixed(4));
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: `top ${startAt * 100}%`,
      end: `bottom ${endAt * 100}%`,
      onUpdate: (self) => write(self.progress),
      onRefresh: (self) => write(self.progress),
    });
    write(trigger.progress);
    return () => trigger.kill();
  }, [reduced, startAt, endAt, text]);

  return (
    <Tag ref={ref} className={clsx(styles.words, className)} style={{ '--n': words.length }} {...rest}>
      <span className="sr-only">{String(text).replace(/\*/g, '')}</span>
      <span aria-hidden="true">
        {words.map((raw, i) => {
          const em = raw.length > 2 && raw.startsWith('*') && raw.endsWith('*');
          const word = em ? raw.slice(1, -1) : raw;
          return (
            <span key={`${word}-${i}`} className={clsx(styles.word, em && styles.em)} style={{ '--i': i }}>
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

export default ScrollWords;
