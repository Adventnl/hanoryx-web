import { useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './data.module.css';

/* The nodes you can currently reach, in reading order, each with its parent. */
function visible(nodes, open, parent = null, out = []) {
  nodes.forEach((n) => {
    out.push({ id: n.id, parent, hasKids: Boolean(n.children?.length) });
    if (n.children?.length && open.has(n.id)) visible(n.children, open, n.id, out);
  });
  return out;
}

/**
 * An expandable tree (files, categories, an outline), following the ARIA tree-view
 * pattern: one tab stop; ↑ ↓ move through what is visible; → opens a closed
 * branch or steps into an open one; ← closes it or steps out to the parent; Home
 * and End jump; Enter or Space chooses. `onSelect` receives the node.
 *
 *   nodes: [{ id, label, children?: [...] }]
 */
export default function Tree({ nodes = [], label, onSelect, defaultOpen = [], className }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen));
  const [selected, setSelected] = useState(null);
  const [focus, setFocus] = useState(nodes[0]?.id);
  const refs = useRef({});

  const list = visible(nodes, open);
  const at = list.findIndex((n) => n.id === focus);
  const go = (id) => { if (!id) return; setFocus(id); refs.current[id]?.focus(); };
  const toggle = (id, force) => setOpen((o) => { const n = new Set(o); const on = force ?? !n.has(id); if (on) n.add(id); else n.delete(id); return n; });
  const pick = (node) => { setSelected(node.id); onSelect?.(node); };

  const onKeyDown = (e, node) => {
    const cur = list[at] || {};
    if (e.key === 'ArrowDown') { e.preventDefault(); go(list[Math.min(at + 1, list.length - 1)]?.id); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); go(list[Math.max(at - 1, 0)]?.id); }
    else if (e.key === 'Home') { e.preventDefault(); go(list[0]?.id); }
    else if (e.key === 'End') { e.preventDefault(); go(list[list.length - 1]?.id); }
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (cur.hasKids && !open.has(node.id)) toggle(node.id, true);
      else if (cur.hasKids) go(node.children[0].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (cur.hasKids && open.has(node.id)) toggle(node.id, false);
      else go(cur.parent);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (cur.hasKids) toggle(node.id);
      pick(node);
    }
  };

  const render = (items, level) => items.map((n, i) => {
    const hasKids = Boolean(n.children?.length);
    const isOpen = open.has(n.id);
    return (
      <li
        key={n.id}
        ref={(el) => { refs.current[n.id] = el; }}
        role="treeitem"
        aria-level={level}
        aria-setsize={items.length}
        aria-posinset={i + 1}
        aria-expanded={hasKids ? isOpen : undefined}
        aria-selected={selected === n.id}
        tabIndex={focus === n.id ? 0 : -1}
        onKeyDown={(e) => { e.stopPropagation(); onKeyDown(e, n); }}
        onFocus={(e) => { if (e.target === e.currentTarget) setFocus(n.id); }}
      >
        <div className={styles.node} onClick={() => { setFocus(n.id); if (hasKids) toggle(n.id); pick(n); }}>
          <ChevronRight className={styles.caret} size={14} aria-hidden="true" style={{ visibility: hasKids ? 'visible' : 'hidden' }} />
          <span>{n.label}</span>
        </div>
        {hasKids && isOpen && <ul role="group">{render(n.children, level + 1)}</ul>}
      </li>
    );
  });

  return <ul className={`${styles.tree} ${className || ''}`} role="tree" aria-label={label}>{render(nodes, 1)}</ul>;
}
