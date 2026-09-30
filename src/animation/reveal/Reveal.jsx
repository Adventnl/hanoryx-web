import { Children, createElement, isValidElement, useMemo } from 'react';
import { motion } from 'motion/react';
import { revealProfiles, staggerContainer, withDelay } from './revealProfiles';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Reveal — animate a single element into view with a named profile.
 *   <Reveal profile="slideLeft" as="p">…</Reveal>
 * Honours reduced motion (static).
 *
 * IMPORTANT: this component must NOT re-render on scroll. It used to subscribe
 * to the fast-scroll governor and swap its `variants`/`viewport` objects on
 * every scroll burst — which made Framer Motion tear down and recreate the
 * `whileInView` observer, replaying the entrance over and over (sections
 * visibly "collapsing and reappearing" while scrolling). The variants and
 * viewport config are memoised here so their identity is stable; with
 * `once: true` Motion keeps the original observer, fires the entrance exactly
 * once, then disconnects.
 *
 * `will-change` / `filter` / `clip-path` housekeeping lives in the profiles
 * themselves (see `withHousekeeping` in revealProfiles.js).
 */
export function Reveal({
  profile = 'fadeUp',
  as = 'div',
  delay = 0,
  amount = 0.3,
  once = true,
  className,
  children,
  style,
  ...rest
}) {
  const reduced = usePrefersReducedMotion();

  const variants = useMemo(
    () => withDelay(revealProfiles[profile] || revealProfiles.fadeUp, delay),
    [profile, delay]
  );
  const viewport = useMemo(() => ({ once, amount }), [once, amount]);

  if (reduced) {
    return createElement(as, { className, style, ...rest }, children);
  }

  const Tag = motion[as] || motion.div;

  return (
    <Tag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * RevealGroup — staggers its children, each entering with the same per-item
 * profile. Like Reveal, this does not re-render on scroll: the container and
 * item variants are stable so the staggered entrance plays once.
 */
export function RevealGroup({
  profile = 'fadeUp',
  as = 'div',
  itemAs = 'div',
  stagger = 0.08,
  delayChildren = 0.05,
  amount = 0.2,
  once = true,
  className,
  itemClassName,
  children,
  ...rest
}) {
  const reduced = usePrefersReducedMotion();
  const items = Children.toArray(children).filter(isValidElement);

  const itemVariant = useMemo(
    () => revealProfiles[profile] || revealProfiles.fadeUp,
    [profile]
  );
  const container = useMemo(
    () => staggerContainer(stagger, delayChildren),
    [stagger, delayChildren]
  );
  const viewport = useMemo(() => ({ once, amount }), [once, amount]);

  if (reduced) {
    return createElement(
      as,
      { className, ...rest },
      items.map((child, i) => createElement(itemAs, { className: itemClassName, key: i }, child))
    );
  }

  const Container = motion[as] || motion.div;
  const Item = motion[itemAs] || motion.div;

  return (
    <Container
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...rest}
    >
      {items.map((child, i) => (
        <Item key={i} className={itemClassName} variants={itemVariant}>
          {child}
        </Item>
      ))}
    </Container>
  );
}

export default Reveal;
