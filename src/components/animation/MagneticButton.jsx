import { useRef } from 'react';
import gsap from 'gsap';
import clsx from 'clsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './MagneticButton.module.css';

/**
 * Wraps an interactive element with a subtle magnetic pull toward the
 * pointer. Polymorphic via `as` (defaults to <button>); pass `as={Link}`
 * for routing. Disabled under reduced motion. Keyboard/focus behavior is
 * inherited from the underlying element.
 */
export function MagneticButton({
  as: Tag = 'button',
  strength = 0.35,
  radius = 90,
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);
  const reduced = usePrefersReducedMotion();

  const ensureQuick = () => {
    if (!ref.current) return;
    if (!xTo.current) {
      xTo.current = gsap.quickTo(ref.current, 'x', { duration: 0.5, ease: 'power3.out' });
      yTo.current = gsap.quickTo(ref.current, 'y', { duration: 0.5, ease: 'power3.out' });
    }
  };

  const handleMove = (event) => {
    if (reduced || !ref.current) return;
    ensureQuick();
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    xTo.current(relX * strength);
    yTo.current(relY * strength);
  };

  const handleLeave = () => {
    if (reduced || !xTo.current) return;
    xTo.current(0);
    yTo.current(0);
  };

  return (
    <Tag
      ref={ref}
      className={clsx(styles.magnetic, className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <span className={styles.inner} style={{ '--mag-radius': `${radius}px` }}>
        {children}
      </span>
    </Tag>
  );
}

export default MagneticButton;
