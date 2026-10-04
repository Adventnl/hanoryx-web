import { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { ScrambleText } from '../fx/ScrambleText';
import { fx } from '../../utils/fx';
import styles from './NorthCompass.module.css';

const TICKS = Array.from({ length: 72 }, (_, i) => i);
const POSITIONS = ['n', 'e', 's', 'w'];

/**
 * Hero object for the development page: a compass whose four points are the
 * four pillars of the team's work. The needle follows the pointer around the
 * dial (CSS-eased, always the short way round) and the pillar it settles on
 * is the one described below. Tap or focus a point to turn the needle to it.
 * Leaving the dial lets the needle settle back on the nearest pillar.
 *
 *   pillars: [{ id, code, title, body }]  (four — N, E, S, W in that order)
 */
export default function NorthCompass({ pillars, caption }) {
  const dialRef = useRef(null);
  const readoutRef = useRef(null);
  const angleRef = useRef(0); // unwrapped, degrees clockwise from north
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);

  const turnTo = useCallback((deg) => {
    const el = dialRef.current;
    if (!el) return;
    const current = angleRef.current;
    const next = current + (((deg - current + 540) % 360) - 180); // shortest way round
    angleRef.current = next;
    el.style.setProperty('--needle', next.toFixed(2));
    const norm = ((next % 360) + 360) % 360;
    if (readoutRef.current) readoutRef.current.textContent = `${String(Math.round(norm) % 360).padStart(3, '0')}°`;
    const idx = Math.round(norm / 90) % 4;
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
      setPulse((p) => p + 1);
    }
  }, []);

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const rect = dialRef.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    if (Math.hypot(dx, dy) < rect.width * 0.1) return;
    turnTo((Math.atan2(dx, -dy) * 180) / Math.PI);
  };
  const settle = () => turnTo(activeRef.current * 90);
  const pillar = pillars[active];

  return (
    <div className={styles.wrap} onPointerMove={onPointerMove} onPointerLeave={settle} {...fx('north.compass')}>
      <div ref={dialRef} className={styles.dial}>
        <svg className={styles.ticks} viewBox="0 0 100 100" aria-hidden="true" {...fx('compass.tick-ring')}>
          <circle className={styles.ring} cx="50" cy="50" r="47" />
          <circle className={styles.ringInner} cx="50" cy="50" r="34" />
          {TICKS.map((i) => {
            const major = i % 18 === 0;
            const mid = i % 6 === 0;
            const a = (i * 5 * Math.PI) / 180;
            const r1 = 47;
            const r2 = major ? 41 : mid ? 43.5 : 45;
            return (
              <line
                key={i}
                className={clsx(styles.tick, major && styles.tickMajor)}
                x1={50 + r1 * Math.sin(a)} y1={50 - r1 * Math.cos(a)}
                x2={50 + r2 * Math.sin(a)} y2={50 - r2 * Math.cos(a)}
              />
            );
          })}
        </svg>

        <span className={styles.needle} aria-hidden="true" {...fx('compass.needle')}><i /><b /></span>
        <span className={styles.hub} aria-hidden="true" {...fx('compass.hub-readout')}>
          <span ref={readoutRef}>000°</span>
        </span>

        {pillars.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={clsx(styles.point, styles[POSITIONS[i]], active === i && styles.on)}
            aria-pressed={active === i}
            aria-label={`${p.code} ${p.title}`}
            onClick={() => turnTo(i * 90)}
            onFocus={() => turnTo(i * 90)}
            data-cursor="card"
            data-cursor-label="Turn"
            {...fx('compass.pillar-point')}
          >
            <span>{p.code}</span>
          </button>
        ))}
      </div>

      <div className={styles.panel} aria-live="polite">
        <span className={styles.code}>{pillar.code}</span>
        <ScrambleText as="h3" text={pillar.title} trigger={pulse} className={styles.title} {...fx('compass.title-decode')} />
        <p className={styles.body} key={pillar.id}>{pillar.body}</p>
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
