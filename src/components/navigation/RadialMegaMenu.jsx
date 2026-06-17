import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { TAU } from '../../animation/easing';
import styles from './RadialMegaMenu.module.css';

const EASE = [0.16, 1, 0.3, 1];

/* Lay child routes around an arc so the SVG reads as a small radial system. */
function nodePositions(count, cx, cy, r) {
  const start = -TAU * 0.28;
  const end = TAU * 0.28;
  return Array.from({ length: count }, (_, i) => {
    const a = count === 1 ? 0 : start + ((end - start) * i) / (count - 1);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, a };
  });
}

/**
 * Deployable radial navigation panel. When a nav group is active it draws a
 * ring + connector lines + orbit nodes (SVG stroke animation), with the child
 * routes listed alongside as a previewable constellation. Keyboard accessible,
 * flicker-free (hover handlers forwarded from the navbar).
 */
export function RadialMegaMenu({ group, onMouseEnter, onMouseLeave }) {
  const [hover, setHover] = useState(0);

  return (
    <AnimatePresence>
      {group && (
        <motion.div
          key={group.id}
          className={styles.wrap}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.34, ease: EASE }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className={styles.panel}>
            {/* Radial diagram */}
            <div className={styles.diagram} aria-hidden="true">
              <svg viewBox="0 0 200 200" className={styles.svg}>
                <circle className={styles.ringOuter} cx="100" cy="100" r="78" pathLength="1" />
                <circle className={styles.ringInner} cx="100" cy="100" r="54" pathLength="1" />
                {nodePositions(group.children.length, 100, 100, 78).map((p, i) => (
                  <g key={i} className={clsx(styles.node, i === hover && styles.nodeOn)}>
                    <line className={styles.connector} x1="100" y1="100" x2={p.x} y2={p.y} pathLength="1" />
                    <circle cx={p.x} cy={p.y} r={i === hover ? 5 : 3} className={styles.nodeDot} />
                  </g>
                ))}
                <circle cx="100" cy="100" r="4" className={styles.core} />
                <text x="100" y="138" textAnchor="middle" className={styles.coreLabel}>
                  {group.code}
                </text>
              </svg>
            </div>

            {/* Route constellation list */}
            <div className={styles.list}>
              <div className={styles.head}>
                <span className="mono">{group.code} // NODE MAP</span>
                <p className={styles.blurb}>{group.blurb}</p>
              </div>
              <ul className={styles.items}>
                {group.children.map((child, i) => (
                  <li key={child.to + child.label}>
                    <Link
                      to={child.to}
                      data-cursor="nav"
                      className={styles.item}
                      onMouseEnter={() => setHover(i)}
                      onFocus={() => setHover(i)}
                    >
                      <span className={styles.itemCode}>{child.code}</span>
                      <span className={styles.itemLabel}>{child.label}</span>
                      <ArrowUpRight className={styles.itemArrow} size={14} strokeWidth={1.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RadialMegaMenu;
