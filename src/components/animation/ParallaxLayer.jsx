import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Scroll-linked parallax. Translates its content as the element passes
 * through the viewport. `speed` is the fraction of travel: positive drifts
 * up (foreground), negative drifts down (background). Disabled under
 * reduced motion.
 *
 * Props: as, speed (default 0.16), children, className
 */
export function ParallaxLayer({ as: Tag = 'div', speed = 0.16, className, children, ...rest }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const shift = speed * 100;
      gsap.fromTo(
        ref.current,
        { yPercent: -shift },
        {
          yPercent: shift,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [reduced, speed] }
  );

  return (
    <Tag ref={ref} className={clsx(className)} {...rest}>
      {children}
    </Tag>
  );
}

export default ParallaxLayer;
