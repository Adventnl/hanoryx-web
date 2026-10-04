import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ScrambleText } from './ScrambleText';
import styles from './Accordion.module.css';
import { fx } from '../../utils/fx';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Disclosure list with real height animation. Each row: index, title, optional
 * meta; the header scrambles its meta code on hover/focus, the plus turns, the
 * body opens with eased height + opacity (never a jump).
 *
 *   items: [{ id, title, meta, body }]   body: string | node
 *   single: only one row open at a time (default true)
 */
export function Accordion({ items, single = true, defaultOpen = null, numbered = true, className }) {
  const uid = useId();
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(() => new Set(defaultOpen ? [defaultOpen] : []));
  const [pulse, setPulse] = useState({});

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(single ? [] : prev);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const bump = (id) => setPulse((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));

  return (
    <ul className={clsx(styles.list, className)}>
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        return (
          <li key={item.id} className={clsx(styles.item, isOpen && styles.open)}>
            <h3 className={styles.head}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={`${uid}-${item.id}`}
                onClick={() => toggle(item.id)}
                onPointerEnter={() => bump(item.id)}
                onFocus={() => bump(item.id)}
              >
                {numbered && <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>}
                <span className={styles.title}>{item.title}</span>
                {item.meta && (
                  <ScrambleText text={item.meta} trigger={pulse[item.id] || 0} className={styles.meta} {...fx('accordion.meta-decode')} />
                )}
                <Plus className={styles.plus} size={18} strokeWidth={1.4} aria-hidden="true" {...fx('accordion.plus-turn')} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-${item.id}`}
                  role="region"
                  className={styles.panel}
                  {...fx('accordion.panel-height')}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                >
                  <div className={styles.body}>{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

export default Accordion;
