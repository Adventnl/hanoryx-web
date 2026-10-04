import { Children, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './DragRail.module.css';

/**
 * A horizontal rail of cards. Touch scrolls natively with snap. With a mouse
 * you can grab and fling it: drag moves the rail 1:1 and release carries on
 * with momentum that decays smoothly. Also: ← → buttons, arrow keys on the
 * focused rail, and a progress thumb that tracks position. A drag never fires
 * the click on the card underneath.
 */
export function DragRail({ children, label = 'Scrollable list', className }) {
  const railRef = useRef(null);
  const wrapRef = useRef(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const items = Children.toArray(children);

  const paint = useCallback(() => {
    const rail = railRef.current;
    const wrap = wrapRef.current;
    if (!rail || !wrap) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const progress = max > 0 ? rail.scrollLeft / max : 0;
    const ratio = rail.scrollWidth > 0 ? rail.clientWidth / rail.scrollWidth : 1;
    wrap.style.setProperty('--prog', progress.toFixed(4));
    wrap.style.setProperty('--thumb', Math.min(1, ratio).toFixed(4));
    wrap.dataset.atStart = progress < 0.01 ? 'true' : 'false';
    wrap.dataset.atEnd = progress > 0.99 || max <= 0 ? 'true' : 'false';
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; paint(); });
    };
    paint();
    rail.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(paint);
    ro.observe(rail);
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [paint]);

  // Mouse drag with inertia (touch uses native scrolling).
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !fine) return undefined;
    let down = false;
    let moved = 0;
    let startX = 0;
    let startLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastT = 0;
    let glide = 0;

    const stopGlide = () => cancelAnimationFrame(glide);
    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      stopGlide();
      down = true;
      moved = 0;
      startX = lastX = e.clientX;
      startLeft = rail.scrollLeft;
      velocity = 0;
      lastT = performance.now();
      rail.classList.add(styles.grabbing);
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      rail.scrollLeft = startLeft - dx;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = ((lastX - e.clientX) / dt) * 16; // px per frame
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      rail.classList.remove(styles.grabbing);
      if (reduced) return;
      const decay = () => {
        velocity *= 0.94;
        if (Math.abs(velocity) < 0.25) return;
        rail.scrollLeft += velocity;
        glide = requestAnimationFrame(decay);
      };
      glide = requestAnimationFrame(decay);
    };
    const swallowClick = (e) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };

    rail.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    rail.addEventListener('click', swallowClick, true);
    return () => {
      stopGlide();
      rail.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      rail.removeEventListener('click', swallowClick, true);
    };
  }, [fine, reduced]);

  const step = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-rail-item]');
    const by = (card ? card.getBoundingClientRect().width : rail.clientWidth * 0.8) + 20;
    rail.scrollBy({ left: dir * by, behavior: reduced ? 'auto' : 'smooth' });
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  return (
    <div ref={wrapRef} className={clsx(styles.wrap, className)}>
      <div
        ref={railRef}
        className={styles.rail}
        role="group"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        data-cursor="drag"
      >
        {items.map((child, i) => (
          <div key={child.key ?? i} className={styles.item} data-rail-item>{child}</div>
        ))}
      </div>
      <div className={styles.controls}>
        <div className={styles.track} aria-hidden="true"><span className={styles.thumb} /></div>
        <div className={styles.buttons}>
          <button type="button" className={styles.btn} onClick={() => step(-1)} aria-label="Previous">
            <ArrowLeft size={16} strokeWidth={1.5} />
          </button>
          <button type="button" className={styles.btn} onClick={() => step(1)} aria-label="Next">
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DragRail;
