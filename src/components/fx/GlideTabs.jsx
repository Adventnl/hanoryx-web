import { useId, useRef } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import styles from './GlideTabs.module.css';

const SPRING = { type: 'spring', stiffness: 460, damping: 38, mass: 0.8 };

/**
 * Segmented control / tab list whose selection ink GLIDES from tab to tab
 * (shared layout animation) instead of toggling. Full tablist keyboard model:
 * ← → Home End move and select, only the selected tab is in the tab order.
 *
 * `idPrefix` lets the panel it controls point back at its tab:
 *   tab id   `${idPrefix}-tab-${id}`     panel id `${idPrefix}-panel-${id}`
 */
export function GlideTabs({ tabs, value, onChange, label, idPrefix = 'tabs', variant = 'pill', className, ...rest }) {
  const uid = useId();
  const refs = useRef({});

  const onKeyDown = (event) => {
    const index = tabs.findIndex((t) => t.id === value);
    let next = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    event.preventDefault();
    const target = tabs[next];
    onChange(target.id);
    refs.current[target.id]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={clsx(styles.tabs, styles[variant], className)} onKeyDown={onKeyDown} {...rest}>
      {tabs.map((tab) => {
        const on = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => { refs.current[tab.id] = el; }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={on}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={on ? 0 : -1}
            className={clsx(styles.tab, on && styles.on)}
            onClick={() => onChange(tab.id)}
          >
            {on && <motion.span layoutId={`${uid}-ink`} className={styles.ink} transition={SPRING} />}
            <span className={styles.label}>{tab.label}</span>
            {tab.meta != null && <span className={styles.meta}>{tab.meta}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default GlideTabs;
