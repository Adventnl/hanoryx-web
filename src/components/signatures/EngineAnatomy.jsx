import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ArrowLink } from '../fx/ArrowLink';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './EngineAnatomy.module.css';

const EASE = [0.16, 1, 0.3, 1];

/**
 * How the engine is organised, as an interactive blueprint. Pick a part on the
 * left; the matching block on the diagram lights and the panel explains it.
 * The only external link on the whole site lives here — to the YK Engine
 * repository.
 *
 *   parts: [{ id, name, glyph, line, detail, folders }]
 */
export default function EngineAnatomy({ eyebrow, title, intro, parts, repoUrl, repoLabel }) {
  const [active, setActive] = useState(parts[0].id);
  const reduced = usePrefersReducedMotion();
  const part = parts.find((p) => p.id === active);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.layout} {...fx('yk.anatomy-blueprint')}>
        <ul className={styles.list} aria-label="Engine parts">
          {parts.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={clsx('glyph-host', styles.item, active === p.id && styles.on)}
                aria-pressed={active === p.id}
                onClick={() => setActive(p.id)}
                onPointerEnter={() => setActive(p.id)}
                onFocus={() => setActive(p.id)}
              >
                <Glyph name={p.glyph} size={26} className={styles.glyph} />
                <span className={styles.name}>{p.name}</span>
                <span className={styles.line}>{p.line}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.board} aria-hidden="true">
          {parts.map((p, i) => (
            <span key={p.id} className={clsx(styles.cell, active === p.id && styles.cellOn)} style={{ '--i': i }} data-part={p.id}>
              <span>{p.name}</span>
            </span>
          ))}
          <span className={styles.crosshair} />
        </div>

        <div className={styles.detail} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={part.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }}
              exit={reduced ? undefined : { opacity: 0, y: -8, transition: { duration: 0.15 } }}
            >
              <h3 className={styles.dTitle}>{part.name}</h3>
              <p className={styles.dBody}>{part.detail}</p>
              {part.folders?.length > 0 && (
                <ul className={styles.folders}>
                  {part.folders.map((f) => <li key={f}>{f}</li>)}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {repoUrl && (
        <div className={styles.repo}>
          <ArrowLink href={repoUrl} tone="red">{repoLabel || 'YK Engine on GitHub'}</ArrowLink>
        </div>
      )}
    </div>
  );
}
