import clsx from 'clsx';
import { TAU } from '../../animation/easing';
import styles from './NodeMap.module.css';
import { fx } from '../../utils/fx';

const VB = 240; // svg viewBox
const C = VB / 2;
const R = 92; // orbit radius

/* Distribute nodes around a full circle starting at the top. */
const nodeAt = (i, count) => {
  const a = -TAU / 4 + (TAU * i) / count;
  return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R, deg: (a * 180) / Math.PI };
};

/**
 * The site's orbit diagram, kept as a small aside in the wide menu: a drawn ring
 * with one node per page of the open category, a selector arc that swings to the
 * page being pointed at, and the group's code at the core. Decorative only —
 * the links beside it carry the meaning, so it is hidden from assistive tech.
 * Keyed by the caller, so a new category redraws it.
 */
export function NodeMap({ count, hot, code }) {
  const sel = count ? nodeAt(Math.min(hot, count - 1), count) : { deg: -90 };
  return (
    <div className={styles.map} aria-hidden="true" {...fx('menu.node-map-ring')}>
      <svg viewBox={`0 0 ${VB} ${VB}`} className={styles.svg}>
        <g className={styles.ticks}>
          {Array.from({ length: 48 }, (_, i) => {
            const a = (TAU * i) / 48;
            const r2 = R + (i % 4 === 0 ? 22 : 18);
            return <line key={i} x1={C + Math.cos(a) * (R + 14)} y1={C + Math.sin(a) * (R + 14)} x2={C + Math.cos(a) * r2} y2={C + Math.sin(a) * r2} />;
          })}
        </g>
        <circle className={clsx(styles.ring, styles.outer)} cx={C} cy={C} r={R + 8} pathLength="1" />
        <circle className={clsx(styles.ring, styles.mid)} cx={C} cy={C} r={R} pathLength="1" />
        <circle className={clsx(styles.ring, styles.inner)} cx={C} cy={C} r={R - 34} pathLength="1" />

        <g className={styles.selector} style={{ transform: `rotate(${sel.deg + 90}deg)` }}>
          <line className={styles.selectorLine} x1={C} y1={C} x2={C} y2={C - R} />
          <polygon className={styles.selectorHead} points={`${C},${C - R - 6} ${C - 4},${C - R + 3} ${C + 4},${C - R + 3}`} />
        </g>

        {Array.from({ length: count }, (_, i) => {
          const p = nodeAt(i, count);
          return (
            <g key={i} className={clsx(styles.node, i === hot && styles.on)}>
              <line className={styles.connector} x1={C} y1={C} x2={p.x} y2={p.y} pathLength="1" style={{ animationDelay: `${0.12 + i * 0.03}s` }} />
              <circle className={styles.dot} cx={p.x} cy={p.y} r={i === hot ? 6 : 3.4} style={{ animationDelay: `${0.18 + i * 0.03}s` }} />
            </g>
          );
        })}

        <circle className={styles.glow} cx={C} cy={C} r="14" />
        <circle className={styles.core} cx={C} cy={C} r="5" />
        <text x={C} y={C + 30} textAnchor="middle" className={styles.label}>{code}</text>
      </svg>
    </div>
  );
}

export default NodeMap;
