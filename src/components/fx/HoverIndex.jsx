import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { usePointerField } from '../../hooks/usePointerField';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ScrambleText } from './ScrambleText';
import styles from './HoverIndex.module.css';
import { fx } from '../../utils/fx';

/**
 * A typographic index: big rows that a floating preview card follows the
 * cursor across. Rows glide a red rule under the hovered line and scramble
 * their code. On touch (or keyboard) there is no floating card — every row
 * simply shows its own detail line, so nothing is hidden behind hover.
 *
 *   items: [{ id, title, kicker, detail, to, meta, preview }]
 */
export function HoverIndex({ items, className }) {
  const listRef = useRef(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(null);
  const [pulse, setPulse] = useState({});
  usePointerField(listRef);

  const current = items.find((item) => item.id === active);
  const showCard = fine && !reduced;

  const enter = (id) => {
    setActive(id);
    setPulse((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  };

  return (
    <div ref={listRef} className={clsx(styles.wrap, className)} onPointerLeave={() => setActive(null)}>
      <ul className={styles.list} {...fx('index.row-dim')}>
        {items.map((item, index) => (
          <li key={item.id} className={clsx(styles.row, active === item.id && styles.on, active && active !== item.id && styles.dim)}>
            <Link
              to={item.to}
              className={styles.link}
              onPointerEnter={() => enter(item.id)}
              onFocus={() => enter(item.id)}
              onBlur={() => setActive(null)}
            >
              <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.main}>
                <span className={styles.title}>{item.title}</span>
                {item.detail && <span className={styles.detail}>{item.detail}</span>}
              </span>
              <ScrambleText text={item.meta || item.kicker || ''} trigger={pulse[item.id] || 0} className={styles.meta} {...fx('index.meta-decode')} />
              <ArrowUpRight className={styles.arrow} size={22} strokeWidth={1.2} aria-hidden="true" />
            </Link>
            <span className={styles.rule} aria-hidden="true" {...fx('index.rule-draw')} />
          </li>
        ))}
      </ul>

      {showCard && (
        <div className={styles.cardLayer} aria-hidden="true">
          <AnimatePresence mode="popLayout">
            {current?.preview && (
              <motion.div
                key={current.id}
                className={styles.card}
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
              >
                {current.preview}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default HoverIndex;
