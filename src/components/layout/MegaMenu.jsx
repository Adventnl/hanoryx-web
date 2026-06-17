import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { navPreviews } from '../../data/navigation';
import styles from './MegaMenu.module.css';

/**
 * Desktop hover preview panel. Driven by `activeKey` (a route path). Slides
 * down from the navbar with a soft blur. Stays open while the pointer is
 * over it (mouse handlers forwarded from the navbar).
 */
export function MegaMenu({ activeKey, onMouseEnter, onMouseLeave }) {
  const preview = activeKey ? navPreviews[activeKey] : null;

  return (
    <AnimatePresence>
      {preview && (
        <motion.div
          key={activeKey}
          className={styles.wrap}
          initial={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className={styles.panel}>
            <div className={styles.lead}>
              <span className="mono">{preview.code}</span>
              <h3 className={styles.title}>{preview.title}</h3>
              <p className={styles.blurb}>{preview.blurb}</p>
              <Link to={activeKey} className={styles.enter}>
                Enter node <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
            <ul className={styles.items}>
              {preview.items.map((item) => (
                <li key={item} className={styles.item}>
                  <span className={styles.tick} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MegaMenu;
