import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './navigation.module.css';

/**
 * A vertical navigation in groups that fold. A folded group is hidden from the
 * tab order and from screen readers, not only from the eye. The current item
 * carries `aria-current="page"`.
 *
 *   groups: [{ label, items: [{ label, to, badge? }], open? }]   current: the `to` of this page
 */
export default function SideNav({ groups = [], current, label = 'Section navigation', className }) {
  const base = useId().replace(/:/g, '');
  const [open, setOpen] = useState(() => new Set(groups.map((g, i) => (g.open ?? i === 0) ? g.label : null).filter(Boolean)));
  const toggle = (name) => setOpen((o) => { const n = new Set(o); if (n.has(name)) n.delete(name); else n.add(name); return n; });

  return (
    <nav className={`${styles.side} ${className || ''}`} aria-label={label}>
      {groups.map((g, i) => {
        const isOpen = open.has(g.label);
        return (
          <div key={g.label} className={styles.sideGroup}>
            <h3>
              <button type="button" className={styles.sideToggle} aria-expanded={isOpen} aria-controls={`${base}-${i}`} onClick={() => toggle(g.label)}>
                <span>{g.label}</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-${i}`} className={styles.sideBody} data-open={isOpen ? '' : undefined}>
              <ul>
                {g.items.map((item) => (
                  <li key={item.to || item.label}>
                    <Link to={item.to} className={styles.sideItem} aria-current={item.to === current ? 'page' : undefined} data-cursor="link">
                      <span>{item.label}</span>
                      {item.badge != null && <span className={styles.sideBadge}>{item.badge}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
