import { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './CompareSlider.module.css';

/**
 * Before / after comparison. Drag the handle (mouse, touch, pen), press the
 * track to glide there, or use ← → Home End on the handle. The position is a
 * registered CSS variable, so clicking the track or using the keyboard EASES
 * the reveal instead of snapping; while dragging the ease is off so the handle
 * tracks the finger exactly.
 */
export function CompareSlider({ before, after, beforeLabel = 'Before', afterLabel = 'After', initial = 50, value, onChange, label = 'Comparison', className }) {
  const trackRef = useRef(null);
  const [inner, setInner] = useState(initial);
  const [dragging, setDragging] = useState(false);
  // controlled when `value` is given (so a legend elsewhere can drive the reveal)
  const controlled = value !== undefined;
  const pos = controlled ? value : inner;
  const setPos = useCallback((next) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  }, [controlled, onChange]);

  const toPos = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (event) => {
    if (event.button != null && event.button !== 0) return;
    trackRef.current.setPointerCapture(event.pointerId);
    // pressing the handle drags; pressing the bare track glides there
    const onHandle = event.target.closest('[data-handle]');
    setDragging(Boolean(onHandle));
    setPos(toPos(event.clientX));
  };
  const onPointerMove = (event) => {
    if (dragging) setPos(toPos(event.clientX));
  };
  const endDrag = () => setDragging(false);

  const onKeyDown = (event) => {
    const step = event.shiftKey ? 15 : 5;
    if (event.key === 'ArrowLeft') setPos(Math.max(0, pos - step));
    else if (event.key === 'ArrowRight') setPos(Math.min(100, pos + step));
    else if (event.key === 'Home') setPos(0);
    else if (event.key === 'End') setPos(100);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={trackRef}
      className={clsx(styles.compare, dragging && styles.dragging, className)}
      style={{ '--pos': pos }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      data-cursor="drag"
    >
      <div className={clsx(styles.layer, styles.base)}>{before}</div>
      <div className={clsx(styles.layer, styles.over)} aria-hidden={pos < 4 ? 'true' : undefined}>{after}</div>
      <span className={clsx(styles.tag, styles.tagBefore)}>{beforeLabel}</span>
      <span className={clsx(styles.tag, styles.tagAfter)}>{afterLabel}</span>
      <div className={styles.line} aria-hidden="true" />
      <button
        type="button"
        data-handle
        className={styles.handle}
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% ${afterLabel}`}
        onKeyDown={onKeyDown}
      >
        <span aria-hidden="true">‹ ›</span>
      </button>
    </div>
  );
}

export default CompareSlider;
