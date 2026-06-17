import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { formatCount } from '../../utils/animation';

/**
 * Counts up to `value` when scrolled into view. Writes directly to the DOM
 * node via GSAP (no React state) so it stays cheap. Honors reduced motion
 * by rendering the final value immediately.
 *
 * Props: value, suffix, prefix, decimals, duration
 */
export function AnimatedCounter({
  value = 0,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2,
  className,
}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        el.textContent = `${prefix}${formatCount(value, decimals)}${suffix}`;
        return;
      }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${formatCount(obj.v, decimals)}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    },
    { scope: ref, dependencies: [reduced, value] }
  );

  return (
    <span ref={ref} className={clsx(className)}>
      {prefix}
      {formatCount(0, decimals)}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;
