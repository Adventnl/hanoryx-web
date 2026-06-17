import { forwardRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { TAU } from '../../animation/easing';
import styles from './RadialMegaMenu.module.css';

const EASE = [0.16, 1, 0.3, 1];
const VB = 240; // svg viewBox
const CX = VB / 2;
const CY = VB / 2;
const R = 92; // orbit radius

/* Distribute child nodes around a full circle starting at the top. */
function nodePositions(count) {
  return Array.from({ length: count }, (_, i) => {
    const a = -TAU / 4 + (TAU * i) / count;
    return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R, a, deg: (a * 180) / Math.PI };
  });
}

const containerV = {
  hidden: { opacity: 0, y: -14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: EASE } },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.24, ease: EASE } },
};
const nodeV = {
  hidden: { scale: 0, opacity: 0 },
  show: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 420, damping: 24, delay: 0.18 + i * 0.045 },
  }),
};
const labelV = {
  hidden: { y: '110%', opacity: 0 },
  show: (i) => ({ y: '0%', opacity: 1, transition: { duration: 0.5, ease: EASE, delay: 0.12 + i * 0.05 } }),
};

/**
 * Deployable radial command menu. Reads as a diagram, not a dropdown: a drawn
 * orbit ring with one node per route, connectors that stroke open from the
 * core, a selector arc that swings to the focused route, and route labels that
 * clip-reveal in a terminal column — all inside a chamfered HUD field anchored
 * under the hovered nav item. Keyboard accessible and flicker-free.
 */
export const RadialMegaMenu = forwardRef(function RadialMegaMenu(
  { group, anchorX, onMouseEnter, onMouseLeave, onNavigate },
  ref
) {
  const { pathname } = useLocation();
  const [hover, setHover] = useState(0);

  // Reset the selector to the active route (or first) whenever the group opens.
  useEffect(() => {
    if (!group) return;
    const activeIdx = group.children.findIndex((c) => c.to === pathname);
    setHover(activeIdx >= 0 ? activeIdx : 0);
  }, [group, pathname]);

  const count = group ? group.children.length : 0;
  const nodes = nodePositions(count);
  const sel = nodes[hover] || { deg: -90 };

  return (
    <AnimatePresence>
      {group && (
        <motion.div
          ref={ref}
          key={group.id}
          className={styles.wrap}
          style={anchorX != null ? { '--anchor-x': `${anchorX}px` } : undefined}
          variants={containerV}
          initial="hidden"
          animate="show"
          exit="exit"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className={styles.field}>
            {/* animated corner brackets */}
            <span className={clsx(styles.corner, styles.tl)} aria-hidden="true" />
            <span className={clsx(styles.corner, styles.tr)} aria-hidden="true" />
            <span className={clsx(styles.corner, styles.bl)} aria-hidden="true" />
            <span className={clsx(styles.corner, styles.br)} aria-hidden="true" />

            <div className={styles.body}>
              {/* ---- Radial diagram ---- */}
              <div className={styles.diagram} aria-hidden="true">
                <svg viewBox={`0 0 ${VB} ${VB}`} className={styles.svg}>
                  {/* tick ring */}
                  <g className={styles.ticks}>
                    {Array.from({ length: 48 }, (_, i) => {
                      const a = (TAU * i) / 48;
                      const r1 = R + 14;
                      const r2 = R + (i % 4 === 0 ? 22 : 18);
                      return (
                        <line
                          key={i}
                          x1={CX + Math.cos(a) * r1}
                          y1={CY + Math.sin(a) * r1}
                          x2={CX + Math.cos(a) * r2}
                          y2={CY + Math.sin(a) * r2}
                        />
                      );
                    })}
                  </g>

                  <circle className={styles.ringOuter} cx={CX} cy={CY} r={R + 8} pathLength="1" />
                  <circle className={styles.ringMid} cx={CX} cy={CY} r={R} pathLength="1" />
                  <circle className={styles.ringInner} cx={CX} cy={CY} r={R - 34} pathLength="1" />

                  {/* selector arc swings to the focused node */}
                  <g className={styles.selector} style={{ transform: `rotate(${sel.deg + 90}deg)` }}>
                    <line className={styles.selectorLine} x1={CX} y1={CY} x2={CX} y2={CY - R} pathLength="1" />
                    <polygon className={styles.selectorHead} points={`${CX},${CY - R - 6} ${CX - 4},${CY - R + 3} ${CX + 4},${CY - R + 3}`} />
                  </g>

                  {/* connectors + nodes */}
                  {nodes.map((p, i) => (
                    <g key={i} className={clsx(styles.node, i === hover && styles.nodeOn)}>
                      <line className={styles.connector} x1={CX} y1={CY} x2={p.x} y2={p.y} pathLength="1" style={{ animationDelay: `${0.25 + i * 0.04}s` }} />
                      <motion.circle cx={p.x} cy={p.y} r={i === hover ? 6 : 3.4} className={styles.nodeDot} custom={i} variants={nodeV} />
                    </g>
                  ))}

                  {/* core */}
                  <circle className={styles.coreGlow} cx={CX} cy={CY} r="14" />
                  <circle className={styles.core} cx={CX} cy={CY} r="5" />
                  <text x={CX} y={CY + 30} textAnchor="middle" className={styles.coreLabel}>
                    {group.code}
                  </text>
                </svg>
              </div>

              {/* ---- Route terminal ---- */}
              <div className={styles.list}>
                <div className={styles.head}>
                  <span className={clsx('mono', styles.headCode)}>{group.code} // NODE MAP</span>
                  <p className={styles.blurb}>{group.blurb}</p>
                </div>
                <ul className={styles.items}>
                  {group.children.map((child, i) => {
                    const active = child.to === pathname;
                    return (
                      <li key={child.to + child.label} className={styles.itemWrap}>
                        <motion.span className={styles.itemReveal} custom={i} variants={labelV}>
                          <Link
                            to={child.to}
                            data-cursor="nav"
                            className={clsx(styles.item, active && styles.itemActive, i === hover && styles.itemHot)}
                            onMouseEnter={() => setHover(i)}
                            onFocus={() => setHover(i)}
                            onClick={onNavigate}
                          >
                            <span className={styles.itemCode}>{child.code}</span>
                            <span className={styles.itemLabel}>{child.label}</span>
                            {active && <span className={styles.itemLive} aria-hidden="true" />}
                            <ArrowUpRight className={styles.itemArrow} size={14} strokeWidth={1.5} />
                          </Link>
                        </motion.span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default RadialMegaMenu;
