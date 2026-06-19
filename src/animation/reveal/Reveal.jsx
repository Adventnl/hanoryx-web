import { Children, createElement, isValidElement, useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { revealProfiles, staggerContainer, withDelay } from './revealProfiles';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { getPerformanceMode, subscribePerformanceMode } from '../../performance/performanceMode';

/* A cheap opacity-only variant used while the user is flinging the page: a
   reveal that enters view then appears immediately instead of stacking an
   expensive blur/transform tween onto an already-busy frame. */
const INSTANT = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.12 } },
};

/* Live fast-scroll flag via the external performance store (lint-clean,
   no setState-in-effect, no ref reads during render). */
function useFastScroll() {
  return useSyncExternalStore(
    subscribePerformanceMode,
    () => getPerformanceMode() === 'fast-scroll',
    () => false
  );
}

/**
 * Reveal — animate a single element into view with a named profile.
 *   <Reveal profile="slideLeft" as="p">…</Reveal>
 * Honours reduced motion (static) and the fast-scroll governor (snaps in).
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
  const fast = useFastScroll();

  if (reduced) {
    return createElement(as, { className, style, ...rest }, children);
  }

  const variant = fast ? INSTANT : withDelay(revealProfiles[profile] || revealProfiles.fadeUp, delay);
  const Tag = motion[as] || motion.div;

  return (
    <Tag
      className={className}
      style={{ willChange: 'transform, opacity', ...style }}
      variants={variant}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * RevealGroup — staggers its children, each entering with the same per-item
 * profile. While fast-scrolling the whole group snaps in cheaply (no stagger,
 * no blur) so a screenful of reveals can't pile up.
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
  const fast = useFastScroll();
  const items = Children.toArray(children).filter(isValidElement);

  if (reduced) {
    return createElement(
      as,
      { className, ...rest },
      items.map((child, i) => createElement(itemAs, { className: itemClassName, key: i }, child))
    );
  }

  const itemVariant = fast ? INSTANT : revealProfiles[profile] || revealProfiles.fadeUp;
  const container = staggerContainer(fast ? 0 : stagger, fast ? 0 : delayChildren);
  const Container = motion[as] || motion.div;
  const Item = motion[itemAs] || motion.div;

  return (
    <Container
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...rest}
    >
      {items.map((child, i) => (
        <Item
          key={i}
          className={clsx(itemClassName)}
          variants={itemVariant}
          style={{ willChange: 'transform, opacity' }}
        >
          {child}
        </Item>
      ))}
    </Container>
  );
}

export default Reveal;
