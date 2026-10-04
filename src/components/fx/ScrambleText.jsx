import { useEffect } from 'react';
import clsx from 'clsx';
import { useOnScreen } from '../../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

/**
 * Text that decodes from noise into its final form, left to right.
 *
 *   trigger  change this value (e.g. increment a counter on hover) to replay
 *   auto     also play once when the text first scrolls into view
 *
 * The scramble is written straight to the DOM (no React state), uses a
 * deterministic glyph sequence (no randomness during render), and the real
 * string is always present for assistive tech in a hidden twin. Reduced motion
 * shows the final text with no scramble.
 */
export function ScrambleText({ text, as: Tag = 'span', trigger = 0, auto = false, duration = 720, className }) {
  const reduced = usePrefersReducedMotion();
  const [ref, seen] = useOnScreen({ rootMargin: '0px', threshold: 0.4 });

  useEffect(() => {
    const el = ref.current?.querySelector('[data-scramble]');
    if (!el) return undefined;
    el.textContent = text;
    const shouldRun = !reduced && (trigger > 0 || (auto && seen));
    if (!shouldRun) return undefined;

    let raf = 0;
    let start = 0;
    const step = (now) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(progress * text.length);
      const frame = Math.floor(now / 48);
      let out = '';
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        out += i < resolved || ch === ' ' ? ch : GLYPHS[(i * 7 + frame * 3) % GLYPHS.length];
      }
      el.textContent = out;
      if (progress < 1) raf = requestAnimationFrame(step);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [ref, text, trigger, auto, seen, duration, reduced]);

  return (
    <Tag ref={ref} className={clsx(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-scramble>{text}</span>
    </Tag>
  );
}

export default ScrambleText;
