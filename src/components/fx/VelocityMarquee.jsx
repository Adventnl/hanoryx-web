import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import clsx from 'clsx';
import { useLenis } from '../../app/providers/lenis-context';
import { useOnScreen } from '../../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './VelocityMarquee.module.css';

/**
 * A marquee that reads the page's scroll. It drifts on its own, speeds up and
 * leans (skew) with scroll velocity from Lenis, and eases to a crawl under the
 * pointer — so scrolling the page visibly pushes the ribbon along. It only
 * ticks while on screen. Reduced motion shows the first set, still.
 */
export function VelocityMarquee({ items, speed = 46, direction = 1, className, itemClassName }) {
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const [wrapRef, onScreen] = useOnScreen({ rootMargin: '200px 0px' });
  const trackRef = useRef(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced || !onScreen) return undefined;
    let x = 0;
    let skew = 0;
    let slow = 1;
    const setX = gsap.quickSetter(track, 'x', 'px');
    const setSkew = gsap.quickSetter(track, 'skewX', 'deg');

    const tick = (_time, deltaMs) => {
      const dt = Math.min(deltaMs, 64) / 1000;
      const half = track.scrollWidth / 2;
      const instance = lenis.getLenis?.();
      const v = instance ? instance.velocity : 0; // px/frame-ish
      slow += ((hoverRef.current ? 0.18 : 1) - slow) * 0.08;
      x -= direction * (speed * slow + Math.abs(v) * 22) * dt * (v * direction < 0 ? -1 : 1);
      if (half > 0) {
        if (x <= -half) x += half;
        else if (x > 0) x -= half;
      }
      skew += (Math.max(-7, Math.min(7, v * -0.9 * direction)) - skew) * 0.12;
      setX(x);
      setSkew(skew);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [lenis, reduced, onScreen, speed, direction]);

  const doubled = [...items, ...items];
  return (
    <div
      ref={wrapRef}
      className={clsx(styles.rail, className)}
      aria-hidden="true"
      onPointerEnter={() => { hoverRef.current = true; }}
      onPointerLeave={() => { hoverRef.current = false; }}
    >
      <div ref={trackRef} className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            <span className={clsx(styles.text, itemClassName)}>{item}</span>
            <span className={styles.sep} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default VelocityMarquee;
