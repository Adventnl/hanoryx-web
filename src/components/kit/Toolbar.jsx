import { useRef, useState } from 'react';
import styles from './navigation.module.css';

/**
 * A row of tool buttons that is one tab stop: ← → (and Home, End) move between
 * the tools, as the ARIA toolbar pattern asks. A tool with `toggle` is a pressed/
 * not-pressed button and says so with `aria-pressed`.
 *
 *   items: [{ id, label, icon: LucideIcon, toggle?, pressed?, onClick? } | { separator: true }]
 */
export default function Toolbar({ label, items = [], className }) {
  const refs = useRef([]);
  const [focus, setFocus] = useState(0);
  const [pressed, setPressed] = useState(() => new Set(items.filter((i) => i.pressed).map((i) => i.id)));
  const tools = items.filter((it) => !it.separator);
  const position = new Map(tools.map((it, i) => [it.id, i]));

  const move = (to) => {
    const n = (to + tools.length) % tools.length;
    setFocus(n);
    refs.current[n]?.focus();
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(focus + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(focus - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(tools.length - 1); }
  };
  const press = (it) => {
    if (it.toggle) setPressed((p) => { const n = new Set(p); if (n.has(it.id)) n.delete(it.id); else n.add(it.id); return n; });
    it.onClick?.();
  };

  return (
    <div className={`${styles.toolbar} ${className || ''}`} role="toolbar" aria-label={label} onKeyDown={onKeyDown}>
      {items.map((it, i) => {
        if (it.separator) return <span key={`sep-${i}`} className={styles.toolSep} role="separator" aria-orientation="vertical" />;
        const at = position.get(it.id);
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            ref={(el) => { refs.current[at] = el; }}
            type="button"
            className={styles.tool}
            tabIndex={focus === at ? 0 : -1}
            aria-label={it.label}
            aria-pressed={it.toggle ? pressed.has(it.id) : undefined}
            title={it.label}
            onFocus={() => setFocus(at)}
            onClick={() => press(it)}
          >
            {Icon ? <Icon size={16} aria-hidden="true" /> : it.label}
          </button>
        );
      })}
    </div>
  );
}
