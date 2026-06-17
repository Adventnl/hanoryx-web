import { Children, createElement, isValidElement } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { revealProfiles, staggerContainer, withDelay } from './revealProfiles';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Reveal — animate a single element into view with a named profile.
 *
 *   <Reveal profile="slideLeft" as="p">…</Reveal>
 *
 * The profile is one of revealProfiles (slideLeft, scanX, glassMaterialize,
 * realityAssemble, …). Honours reduced motion (renders the element statically).
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
  const variant = withDelay(revealProfiles[profile] || revealProfiles.fadeUp, delay);
  const Tag = motion[as] || motion.div;

  if (reduced) {
    return createElement(as, { className, style, ...rest }, children);
  }

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
 * RevealGroup — staggers its children, each entering with the SAME per-item
 * profile but offset in time. Children are wrapped in a motion element
 * (`itemAs`, default 'div') so callers can pass plain components (Card, panels,
 * list content) without making them motion-aware.
 *
 *   <RevealGroup profile="dataMaterialize" stagger={0.07} className="grid">
 *     {cards}
 *   </RevealGroup>
 *
 *   <RevealGroup as="ol" itemAs="li" profile="stepActivate" itemClassName={styles.step}>
 *     {steps.map(s => <>…</>)}
 *   </RevealGroup>
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
  const Container = motion[as] || motion.div;
  const Item = motion[itemAs] || motion.div;
  const variant = revealProfiles[profile] || revealProfiles.fadeUp;
  const items = Children.toArray(children).filter(isValidElement);

  if (reduced) {
    return createElement(
      as,
      { className, ...rest },
      items.map((child, i) => createElement(itemAs, { className: itemClassName, key: i }, child))
    );
  }

  return (
    <Container
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...rest}
    >
      {items.map((child, i) => (
        <Item
          key={i}
          className={clsx(itemClassName)}
          variants={variant}
          style={{ willChange: 'transform, opacity' }}
        >
          {child}
        </Item>
      ))}
    </Container>
  );
}

export default Reveal;
