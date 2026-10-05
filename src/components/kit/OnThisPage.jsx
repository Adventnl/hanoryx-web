import { useEffect, useState } from 'react';
import styles from './navigation.module.css';

/**
 * A "on this page" list that follows the reader: the item for the section
 * nearest the top of the screen is marked `aria-current="location"`. Clicking
 * one scrolls there (smoothly unless the reader prefers reduced motion) and moves
 * keyboard focus to the section, so the next Tab continues from it.
 *
 *   items: [{ id, label }]   — ids of elements on the page
 */
export default function OnThisPage({ items = [], label = 'On this page', className }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return undefined;
    const seen = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null));
      const live = [...seen.entries()].filter(([, top]) => top !== null).sort((a, b) => a[1] - b[1]);
      if (live.length) setActive(live[0][0]);
    }, { rootMargin: '-15% 0px -70% 0px' });
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  const go = (e, id) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    setActive(id);
  };

  return (
    <nav className={className} aria-label={label}>
      <ul className={styles.toc}>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className={styles.tocLink} aria-current={active === it.id ? 'location' : undefined} onClick={(e) => go(e, it.id)} data-cursor="link">{it.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
