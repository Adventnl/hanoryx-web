import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight, X } from 'lucide-react';
import { Glyph } from '../fx/Glyph';
import { fx } from '../../utils/fx';
import styles from './SystemMap.module.css';

/**
 * Hero object for /systems: the seven areas as a small graph around a shared
 * core. Point at a node and its connections light and flow; press it and it
 * opens in place into a card with a summary and a link to its page. Escape
 * closes it. Left-half nodes open to the right and right-half nodes open to the
 * left, so a card never leaves the frame.
 *
 * The links are DESIGN relationships — which areas lean on which — not a
 * diagram of deployed software, and the caption says so.
 *
 *   nodes: [{ id, code, short, title, summary, glyph, to, tags }]
 *   links: [[idA, idB], ...]     core: { title, line }
 */
const RADIUS = 36;

export default function SystemMap({ nodes, links, core, caption }) {
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const rootRef = useRef(null);

  const placed = useMemo(
    () =>
      nodes.map((n, i) => {
        const angle = ((-90 + (i * 360) / nodes.length) * Math.PI) / 180;
        const x = 50 + RADIUS * Math.cos(angle);
        const y = 50 + RADIUS * 0.92 * Math.sin(angle);
        return { ...n, x, y, side: x <= 52 ? 'left' : 'right', vert: y > 55 ? 'bottom' : 'top' };
      }),
    [nodes]
  );
  const byId = useMemo(() => Object.fromEntries(placed.map((n) => [n.id, n])), [placed]);

  const focusId = open || hover;
  const connected = useMemo(() => {
    const set = new Set();
    if (!focusId) return set;
    set.add(focusId);
    links.forEach(([a, b]) => {
      if (a === focusId) set.add(b);
      if (b === focusId) set.add(a);
    });
    return set;
  }, [focusId, links]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(null);
    };
    const onDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.wrap} {...fx('systems.expandable-map')}>
      <div className={styles.map} data-focus={focusId ? 'true' : 'false'} {...fx('systems.focus-dim')}>
        <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" {...fx('systems.link-flow')}>
          <circle className={styles.ring} cx="50" cy="50" r={RADIUS} vectorEffect="non-scaling-stroke" />
          {placed.map((n) => (
            <line
              key={`core-${n.id}`}
              className={clsx(styles.spoke, connected.has(n.id) && styles.hot)}
              x1="50" y1="50" x2={n.x} y2={n.y}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {links.map(([a, b]) => {
            const A = byId[a];
            const B = byId[b];
            if (!A || !B) return null;
            const hot = focusId && (a === focusId || b === focusId);
            return (
              <line
                key={`${a}-${b}`}
                className={clsx(styles.link, hot && styles.hot)}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        <div className={styles.core} {...fx('systems.core-pulse')}>
          <span className={styles.coreRing} aria-hidden="true" />
          <span className={styles.coreTitle}>{core.title}</span>
          <span className={styles.coreLine}>{core.line}</span>
        </div>

        {placed.map((n) => {
          const isOpen = open === n.id;
          const dim = focusId && !connected.has(n.id);
          // `--room` is how far the card can open before it meets the frame's edge.
          const pos = {
            ...(n.side === 'left' ? { left: `calc(${n.x}% - 32px)` } : { right: `calc(${100 - n.x}% - 32px)` }),
            ...(n.vert === 'top' ? { top: `calc(${n.y}% - 32px)` } : { bottom: `calc(${100 - n.y}% - 32px)` }),
            '--room': n.side === 'left' ? `calc(${100 - n.x}% + 32px)` : `calc(${n.x}% + 32px)`,
          };
          return (
            <div
              key={n.id}
              className={clsx(styles.node, isOpen && styles.open, dim && styles.dim)}
              data-side={n.side}
              data-vert={n.vert}
              {...fx('systems.node-open')}
              style={pos}
              onPointerEnter={() => setHover(n.id)}
              onPointerLeave={() => setHover(null)}
            >
              <button
                type="button"
                className={styles.head}
                aria-expanded={isOpen}
                aria-label={`${n.code} ${n.title}`}
                onClick={() => setOpen(isOpen ? null : n.id)}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover(null)}
                data-cursor="card"
                data-cursor-label="Open"
              >
                <Glyph name={n.glyph} size={22} className={styles.glyph} />
                <span className={styles.short}>{n.short}</span>
              </button>
              <div className={styles.card} aria-hidden={!isOpen} inert={!isOpen}>
                <span className={styles.code}>{n.code}</span>
                <strong className={styles.title}>{n.title}</strong>
                <p className={styles.summary}>{n.summary}</p>
                <span className={styles.row}>
                  <Link to={n.to} className={styles.go} tabIndex={isOpen ? 0 : -1}>
                    Open <ArrowUpRight size={13} strokeWidth={1.6} aria-hidden="true" />
                  </Link>
                  <button type="button" className={styles.close} onClick={() => setOpen(null)} tabIndex={isOpen ? 0 : -1} aria-label="Close">
                    <X size={13} aria-hidden="true" />
                  </button>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className={styles.hint}>Point at an area to light its links. Press it to open.</p>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
