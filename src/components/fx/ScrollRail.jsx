import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useLenis } from '../../app/providers/lenis-context';
import styles from './ScrollRail.module.css';

/**
 * A quiet progress rail for long pages: one tick per section, the current one
 * stretches and lights, hover/focus names it, click glides there (through the
 * same smooth scroller as the rest of the site). Desktop only — it never
 * competes with the page on small screens.
 *
 *   sections: [{ id, label }]   ids are DOM ids on the section elements
 */
export function ScrollRail({ sections }) {
  const lenis = useLenis();
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const targets = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!targets.length || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-42% 0px -52% 0px' }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 3) return null;

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) lenis.scrollTo(el, { offset: -72 });
  };

  return (
    <nav className={styles.rail} aria-label="On this page">
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              className={clsx(styles.tick, active === section.id && styles.on)}
              onClick={() => go(section.id)}
              aria-label={section.label}
              aria-current={active === section.id ? 'true' : undefined}
            >
              <span className={styles.name}>{section.label}</span>
              <span className={styles.bar} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ScrollRail;
