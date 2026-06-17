import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Scroll-linked reveal. Animates the element (or its direct children when
 * `stagger` is set) up from a soft, blurred offset as it enters view.
 * Honors reduced-motion by rendering content immediately.
 *
 * Props:
 *   as       element tag (default 'div')
 *   y        start offset px (default 34)
 *   blur     start blur px (default 8)
 *   duration tween duration (default 1.1)
 *   delay    initial delay (default 0)
 *   stagger  per-child stagger; >0 animates children (default 0)
 *   start    ScrollTrigger start (default 'top 85%')
 *   once     play once (default true)
 */
export function ScrollReveal({
  as: Tag = 'div',
  y = 34,
  blur = 8,
  duration = 1.1,
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  once = true,
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const targets = stagger > 0 ? Array.from(ref.current.children) : ref.current;
      if (stagger > 0 && ref.current.children.length === 0) return;

      gsap.fromTo(
        targets,
        { y, autoAlpha: 0, filter: blur ? `blur(${blur}px)` : 'none' },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: once ? 'play none none none' : 'play none none reverse',
          },
        }
      );
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <Tag ref={ref} className={clsx(className)} {...rest}>
      {children}
    </Tag>
  );
}

export default ScrollReveal;
