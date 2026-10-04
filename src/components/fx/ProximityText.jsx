import { Fragment, useRef } from 'react';
import clsx from 'clsx';
import { useProximity } from '../../hooks/useProximity';
import styles from './ProximityText.module.css';

/**
 * Text that reacts to the pointer: each unit lifts, swells and warms toward red
 * as the cursor comes near, so a sweep across a headline rolls through it like
 * a wave and settles back smoothly when the cursor leaves.
 *
 *   by="word"  (default) — keeps the font's kerning intact; right for display serif
 *   by="char"            — per letter; right for mono labels and short words
 *
 * The engine is useProximity (one rAF loop, only while something is moving).
 * Touch devices and reduced motion get plain static text. The full string is
 * exposed to assistive tech via the hidden twin; the animated spans are
 * aria-hidden.
 */
export function ProximityText({ text, as: Tag = 'span', by = 'word', radius = 220, className, unitClassName }) {
  const ref = useRef(null);
  useProximity(ref, { radius, deps: [text, by] });
  const words = String(text).split(' ');

  return (
    <Tag ref={ref} className={clsx(styles.prox, className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={styles.visual}>
        {words.map((word, wi) => (
          <Fragment key={`${word}-${wi}`}>
            {by === 'char' ? (
              <span className={styles.word}>
                {Array.from(word).map((ch, ci) => (
                  <span key={ci} data-prox className={clsx(styles.unit, unitClassName)}>{ch}</span>
                ))}
              </span>
            ) : (
              <span data-prox className={clsx(styles.unit, styles.word, unitClassName)}>{word}</span>
            )}
            {wi < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

export default ProximityText;
