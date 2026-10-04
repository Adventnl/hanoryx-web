import { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ArrowLink } from '../fx/ArrowLink';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { fx } from '../../utils/fx';
import styles from './AreasExplorer.module.css';

const INTENT_MS = 110;

/**
 * Areas of work as a row of strips. The strip you point at (or focus, or tap)
 * opens while its neighbours fold to a vertical label; on a phone the same set
 * becomes a stack that opens downward. Hover has a short intent delay so the
 * row does not flutter as the cursor crosses it. ← → ↑ ↓ Home End move focus
 * and open the strip.
 *
 * This is a description of the kinds of work the company does. It is not a
 * list of open roles, and nothing here implies one.
 *
 *   areas: [{ id, code, title, glyph, summary, thinks: [string], links: [{label,to}] }]
 */
export default function AreasExplorer({ eyebrow, title, intro, areas, note }) {
  const uid = useId();
  const fine = useFinePointer();
  const [active, setActive] = useState(0);
  const headRefs = useRef([]);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hoverOpen = (i) => {
    if (!fine) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(i), INTENT_MS);
  };
  const cancelHover = () => window.clearTimeout(timer.current);

  const onKeyDown = (event, i) => {
    const last = areas.length - 1;
    let next = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = i === last ? 0 : i + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = i === 0 ? last : i - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next < 0) return;
    event.preventDefault();
    setActive(next);
    headRefs.current[next]?.focus();
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.strips} style={{ '--n': areas.length }} role="group" aria-label="Areas of work" {...fx('careers.expanding-strips')}>
        {areas.map((a, i) => {
          const on = active === i;
          return (
            <section key={a.id} className={clsx(styles.strip, on && styles.on)} data-area={a.id}>
              <button
                ref={(el) => { headRefs.current[i] = el; }}
                type="button"
                id={`${uid}-h-${a.id}`}
                className={styles.head}
                aria-expanded={on}
                aria-controls={`${uid}-p-${a.id}`}
                onClick={() => setActive(i)}
                onPointerEnter={() => hoverOpen(i)}
                onPointerLeave={cancelHover}
                onKeyDown={(e) => onKeyDown(e, i)}
                data-cursor="card"
                data-cursor-label="Open"
              >
                <span className={styles.code}>{a.code}</span>
                <Glyph name={a.glyph} size={28} className={styles.glyph} />
                <span className={styles.vlabel} {...fx('careers.vertical-label')}>{a.title}</span>
              </button>
              <div
                id={`${uid}-p-${a.id}`}
                role="region"
                aria-labelledby={`${uid}-h-${a.id}`}
                className={clsx('glyph-host', styles.panel)}
                inert={!on}
              >
                <div className={styles.inner}>
                  <span className={clsx('ghost-numeral', styles.ghost)} aria-hidden="true" {...fx('careers.strip-ghost')}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.title}>{a.title}</h3>
                  <p className={styles.summary}>{a.summary}</p>
                  <span className={styles.listLabel}>What the work involves</span>
                  <ul className={styles.list} {...fx('careers.list-stagger')}>
                    {a.thinks.map((t, ti) => (
                      <li key={t} style={{ '--k': ti }}>{t}</li>
                    ))}
                  </ul>
                  {a.links?.length > 0 && (
                    <div className={styles.links}>
                      {a.links.map((l) => <ArrowLink key={l.to} to={l.to} tabIndex={on ? 0 : -1}>{l.label}</ArrowLink>)}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
