import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './HanoryxCursor.module.css';
import { fx } from '../../utils/fx';

/**
 * Designed precision cursor. A tight core dot tracks the pointer exactly while
 * a reticle follows with a little lag. Hovering elements that declare
 * data-cursor="link|card|nav|redacted|audio" morph the reticle into a
 * context-appropriate state. Fine-pointer only; disabled under reduced motion.
 * No React state on mousemove — everything is refs + GSAP quickTo + classList.
 */
/* Short words the reticle can carry beside it. A control can override its own
   with data-cursor-label="…"; an empty value silences the default. */
const DEFAULT_LABELS = { card: 'View', drag: 'Drag' };

export function HanoryxCursor() {
  const ring = useRef(null);
  const dot = useRef(null);
  const label = useRef(null);
  const reduced = usePrefersReducedMotion();

  const enabled =
    !reduced &&
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches;

  useEffect(() => {
    if (!enabled) return undefined;
    const ringEl = ring.current;
    const dotEl = dot.current;
    const labelEl = label.current;
    if (!ringEl || !dotEl || !labelEl) return undefined;

    document.documentElement.classList.add('hnx-cursor-active');

    const rx = gsap.quickTo(ringEl, 'x', { duration: 0.42, ease: 'power3.out' });
    const ry = gsap.quickTo(ringEl, 'y', { duration: 0.42, ease: 'power3.out' });
    const dx = gsap.quickTo(dotEl, 'x', { duration: 0.08, ease: 'power2.out' });
    const dy = gsap.quickTo(dotEl, 'y', { duration: 0.08, ease: 'power2.out' });

    let visible = false;
    const onMove = (e) => {
      if (!visible) {
        visible = true;
        ringEl.style.opacity = '1';
        dotEl.style.opacity = '1';
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };

    let current = '';
    let currentLabel = '';
    const setState = (state, text = '') => {
      if (state !== current) {
        if (current) ringEl.classList.remove(styles[current]);
        if (state) ringEl.classList.add(styles[state]);
        current = state;
      }
      if (text !== currentLabel) {
        currentLabel = text;
        if (text) labelEl.textContent = text;
        ringEl.classList.toggle(styles.hasLabel, Boolean(text));
      }
    };

    const onOver = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button');
      if (!target) {
        setState('');
        return;
      }
      const declared = target.getAttribute('data-cursor');
      const override = target.getAttribute('data-cursor-label');
      const state = declared && styles[declared] ? declared : 'link';
      setState(state, override !== null ? override : DEFAULT_LABELS[state] || '');
    };

    const onLeaveDoc = () => {
      ringEl.style.opacity = '0';
      dotEl.style.opacity = '0';
      visible = false;
    };
    const onDown = () => ringEl.classList.add(styles.down);
    const onUp = () => ringEl.classList.remove(styles.down);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeaveDoc);

    return () => {
      document.documentElement.classList.remove('hnx-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeaveDoc);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ring} data-chrome className={styles.ring} aria-hidden="true" {...fx('cursor.reticle-ring')}>
        <span className={styles.reticle} />
        <span className={clsxCorner('tl')} />
        <span className={clsxCorner('tr')} />
        <span className={clsxCorner('bl')} />
        <span className={clsxCorner('br')} />
        <span className={styles.scan} />
        <span className={styles.orbit} />
        <span ref={label} className={styles.label} {...fx('cursor.label')} />
      </div>
      <div ref={dot} data-chrome className={styles.dot} aria-hidden="true" {...fx('cursor.dot')} />
    </>
  );
}

/* Local helper to keep corner spans tidy. */
function clsxCorner(pos) {
  return `${styles.corner} ${styles[`corner_${pos}`]}`;
}

export default HanoryxCursor;
