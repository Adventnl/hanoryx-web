import { useEffect, useMemo, useState } from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './SplitFlap.module.css';

const CYCLE_MS = 3400;

function Row({ label, text, width, replay, button, onClick }) {
  const padded = text.toUpperCase().padEnd(width, ' ');
  const cells = Array.from(padded).map((ch, i) => (
    <span key={`${replay}-${i}`} className={styles.cell} style={{ '--i': i }} data-blank={ch === ' ' ? 'true' : 'false'}>
      <span>{ch}</span>
    </span>
  ));
  const inner = (
    <>
      <span className={styles.label}><i aria-hidden="true" />{label}</span>
      <span className={styles.cells} aria-hidden="true">{cells}</span>
    </>
  );
  return button ? (
    <button type="button" className={`${styles.row} ${styles.rowButton}`} onClick={onClick} aria-label={`${label}: ${text}. Show the next one.`} data-cursor="card" data-cursor-label="Next">
      {inner}
    </button>
  ) : (
    <div className={styles.row}>{inner}</div>
  );
}

/**
 * A departure board for the careers hero. Two fixed rows state the facts —
 * nothing is listed, introductions are welcome — and a third row flips through
 * the areas of work. Click the third row to flip to the next area yourself.
 * The board only cycles while on screen and not at all under reduced motion
 * (it then rests on the first area).
 *
 *   rows:  [{ label, value }]
 *   cycle: { label, values: [string] }
 */
export default function SplitFlap({ rows, cycle, caption }) {
  const reduced = usePrefersReducedMotion();
  const [ref, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.3 });
  const [index, setIndex] = useState(0);
  const width = useMemo(
    () => Math.max(...rows.map((r) => r.value.length), ...cycle.values.map((v) => v.length)),
    [rows, cycle]
  );

  useEffect(() => {
    if (reduced || !onScreen) return undefined;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % cycle.values.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, onScreen, cycle.values.length]);

  const next = () => setIndex((i) => (i + 1) % cycle.values.length);
  const summary = `${rows.map((r) => `${r.label}: ${r.value}`).join('. ')}. ${cycle.label}: ${cycle.values.join(', ')}.`;

  return (
    <div ref={ref} className={styles.board} role="group" aria-label={summary} {...fx('careers.split-flap-board')}>
      <div className={styles.bar} aria-hidden="true">
        <span>HANORYX · INTRODUCTIONS</span>
        <span className={styles.lamp} />
      </div>
      {rows.map((r) => <Row key={r.label} label={r.label} text={r.value} width={width} replay={0} />)}
      <Row label={cycle.label} text={cycle.values[index]} width={width} replay={index} button onClick={next} />
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
