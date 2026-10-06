import { useId, useRef } from 'react';
import { useControllable } from './useControllable';
import styles from './navigation.module.css';

/**
 * Tabs that change a panel of content, as the ARIA pattern asks: one tab stop
 * for the list, ← → (and Home, End) move between tabs and show the panel at once,
 * and the panel is a tab stop of its own if it has nothing focusable inside.
 * For choices that only change a nearby demo, use Segmented.
 *
 *   tabs: [{ id, label, content }]
 */
export default function Tabs({ tabs = [], value, defaultValue, onChange, label, className }) {
  const base = useId().replace(/:/g, '');
  const [current, setCurrent] = useControllable({ value, defaultValue: defaultValue ?? tabs[0]?.id, onChange });
  const refs = useRef({});
  const index = Math.max(0, tabs.findIndex((t) => t.id === current));

  const move = (to) => {
    const next = tabs[(to + tabs.length) % tabs.length];
    setCurrent(next.id);
    refs.current[next.id]?.focus();
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(index - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(tabs.length - 1); }
  };

  return (
    <div className={`${styles.tabs} ${className || ''}`}>
      <div className={styles.tabList} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[t.id] = el; }}
            type="button"
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={t.id === tabs[index]?.id}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={t.id === tabs[index]?.id ? 0 : -1}
            className={styles.tab}
            onClick={() => setCurrent(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`${base}-panel-${t.id}`} aria-labelledby={`${base}-tab-${t.id}`} className={styles.panel} hidden={t.id !== tabs[index]?.id} tabIndex={0}>
          {t.id === tabs[index]?.id ? t.content : null}
        </div>
      ))}
    </div>
  );
}
