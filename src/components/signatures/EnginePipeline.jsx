import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { ScrambleText } from '../fx/ScrambleText';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './EnginePipeline.module.css';

const EASE = [0.16, 1, 0.3, 1];

/**
 * A left-to-right flow of stages. Pick one (click, tap, or ← →) and a token
 * glides along the line to it — the line fills behind it — while the panel
 * below cross-slides to that stage's description. The shared-data stage is the
 * hinge: it is the same set of entities and components either side.
 *
 *   stages: [{ id, label, glyph, title, body, points }]
 */
export default function EnginePipeline({ eyebrow, title, intro, stages }) {
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);
  const reduced = usePrefersReducedMotion();
  const n = stages.length;
  const stage = stages[active];

  const pick = (i) => {
    setActive(i);
    setPulse((p) => p + 1);
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); pick(Math.min(n - 1, active + 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); pick(Math.max(0, active - 1)); }
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.flow} style={{ '--n': n, '--a': active }} onKeyDown={onKeyDown} {...fx('yk.pipeline-token')}>
        <span className={styles.line} aria-hidden="true">
          <span className={styles.fill} />
          <span className={styles.token} />
        </span>
        <ul className={styles.stages} role="tablist" aria-label="Engine pipeline stages" {...fx('pipeline.stage-tabs')}>
          {stages.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                role="tab"
                id={`pipe-tab-${s.id}`}
                aria-selected={active === i}
                aria-controls="pipe-panel"
                tabIndex={active === i ? 0 : -1}
                className={clsx('glyph-host', styles.stage, active === i && styles.on, i < active && styles.done)}
                onClick={() => pick(i)}
              >
                <span className={styles.node} aria-hidden="true" />
                <Glyph name={s.glyph} size={30} className={styles.glyph} />
                <span className={styles.label}>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div id="pipe-panel" role="tabpanel" aria-labelledby={`pipe-tab-${stage.id}`} className={styles.panel}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage.id}
            className={styles.card}
            {...fx('pipeline.card-swap')}
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } }}
            exit={reduced ? undefined : { opacity: 0, x: -18, transition: { duration: 0.2 } }}
          >
            <span className={styles.step}>{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
            <ScrambleText as="h3" text={stage.title} trigger={pulse} className={styles.cardTitle} {...fx('pipeline.title-decode')} />
            <p className={styles.cardBody}>{stage.body}</p>
            {stage.points?.length > 0 && (
              <ul className={styles.points}>
                {stage.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
