import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './NeedsFinder.module.css';

const EASE = [0.16, 1, 0.3, 1];

/**
 * "What are you trying to do?" — pick a need and the matching system area is
 * lit in the strip below and explained in the panel, with a link. A small
 * playful route through the section, built as a real radio group (↑ ↓ ← → move
 * and choose; the choice announces itself).
 *
 *   needs: [{ id, label, area, why }]     areas: [{ id, code, title, glyph, to }]
 */
export default function NeedsFinder({ eyebrow, title, intro, needs, areas }) {
  const uid = useId();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(needs[0].id);
  const need = needs.find((n) => n.id === value);
  const area = areas.find((a) => a.id === need.area);

  const onKeyDown = (event) => {
    const i = needs.findIndex((n) => n.id === value);
    let next = -1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (i + 1) % needs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (i - 1 + needs.length) % needs.length;
    if (next < 0) return;
    event.preventDefault();
    setValue(needs[next].id);
    document.getElementById(`${uid}-${needs[next].id}`)?.focus();
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.layout} {...fx('systems.needs-finder')}>
        <div role="radiogroup" aria-label="What are you trying to do?" className={styles.needs} onKeyDown={onKeyDown}>
          {needs.map((n) => {
            const on = n.id === value;
            return (
              <button
                key={n.id}
                id={`${uid}-${n.id}`}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                className={clsx(styles.need, on && styles.on)}
                onClick={() => setValue(n.id)}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span>{n.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.answer} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={need.id}
              className={styles.panel}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduced ? 0 : 0.42, ease: EASE }}
            >
              <span className={styles.kicker}>Start with</span>
              <h3 className={styles.areaTitle}>{area.title}</h3>
              <p className={styles.why}>{need.why}</p>
              <Link to={area.to} className={styles.go} data-cursor="link">
                Open {area.code} <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ul className={styles.strip} aria-label="All system areas">
        {areas.map((a) => (
          <li key={a.id} className={clsx(styles.chip, a.id === area.id && styles.chipOn)}>
            <Link to={a.to} tabIndex={-1} aria-label={a.title}>
              <Glyph name={a.glyph} size={22} />
              <span>{a.code}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
