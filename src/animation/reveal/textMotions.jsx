import { motion } from 'motion/react';
import { revealVariants, staggerContainer } from './motionProfiles';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * RevealText — a single reveal primitive with multiple, visibly distinct
 * languages so body copy / intros stop sharing one fade-up.
 *
 *   variant : 'fadeUp' | 'maskUp' | 'scanX' | 'splitY' | 'pop' | 'slideIn'
 *   split   : 'none' | 'word'   (word => per-word stagger in the chosen variant)
 *
 * Triggers in-view (once), honours reduced motion, and renders the requested
 * tag. Strings only for `split="word"`; otherwise pass children.
 */
export function RevealText({
  as = 'p',
  variant = 'fadeUp',
  split = 'none',
  text,
  children,
  stagger = 0.05,
  amount = 0.3,
  className,
  ...rest
}) {
  const reduced = usePrefersReducedMotion();
  const v = revealVariants[variant] || revealVariants.fadeUp;
  const content = text ?? children;
  const Tag = motion[as] || motion.p;

  if (reduced) {
    const Plain = Tag;
    return (
      <Plain className={className} {...rest}>
        {content}
      </Plain>
    );
  }

  if (split === 'word' && typeof content === 'string') {
    const words = content.split(' ');
    return (
      <Tag
        className={className}
        variants={staggerContainer(stagger)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
        {...rest}
      >
        {words.map((w, i) => (
          <motion.span key={`${w}-${i}`} variants={v} style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {content}
    </Tag>
  );
}

export default RevealText;
