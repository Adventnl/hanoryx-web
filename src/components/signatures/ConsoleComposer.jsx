import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { Lock } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './ConsoleComposer.module.css';

const SPRING = { type: 'spring', stiffness: 360, damping: 38, mass: 0.9 };

/* abstract panel bodies — shapes only, no numbers and no copy */
function Overview() {
  return (
    <>
      <div className={styles.tiles}>
        {[0, 1, 2].map((i) => <span key={i}><i /><b /></span>)}
      </div>
      <svg className={styles.spark} viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="0,18 12,14 24,16 36,8 48,12 60,5 72,9 84,3 100,6" />
      </svg>
    </>
  );
}
function Administration() {
  return (
    <ul className={styles.rows}>
      {[0, 1, 2].map((i) => <li key={i}><i /><b /><span data-on={i !== 1 ? 'true' : 'false'} /></li>)}
    </ul>
  );
}
function Control() {
  return (
    <div className={styles.control}>
      <span className={styles.bar} />
      <span className={styles.btns}><b>Confirm</b><em>Undo</em></span>
    </div>
  );
}
function Exceptions() {
  return (
    <ul className={styles.rows}>
      {[0, 1, 2].map((i) => <li key={i}><i data-hot={i === 0 ? 'true' : 'false'} /><b /><em /></li>)}
    </ul>
  );
}
const BODY = { overview: Overview, administration: Administration, control: Control, exceptions: Exceptions };

/**
 * Compose an internal platform. Switch modules on and off and the console
 * re-flows around them (shared layout animation). Switch the role to Operator
 * and the Administration module locks — configuration and access changes are
 * kept apart from day-to-day work. Shapes only: nothing here is a real console.
 *
 *   modules: [{ id, title, body, span, adminOnly? }]   roles: [{ id, label }]
 */
export default function ConsoleComposer({ eyebrow, title, intro, modules, roles, note }) {
  const reduced = usePrefersReducedMotion();
  const [on, setOn] = useState(() => new Set(['overview', 'exceptions']));
  const [role, setRole] = useState(roles[0].id);
  const toggle = (id) => setOn((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const active = modules.filter((m) => on.has(m.id));
  const roleLabel = roles.find((r) => r.id === role).label;

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.bench} {...fx('platforms.console-composer')}>
        <div className={styles.side}>
          <GlideTabs tabs={roles} value={role} onChange={setRole} label="Role" idPrefix="console-role" panels={false} {...fx('console.role-tabs')} />
          <ul className={styles.toggles} {...fx('console.module-switches')}>
            {modules.map((m) => {
              const checked = on.has(m.id);
              const locked = m.adminOnly && role !== 'admin';
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    className={clsx(styles.toggle, checked && styles.toggleOn)}
                    onClick={() => toggle(m.id)}
                  >
                    <span className={styles.switch} aria-hidden="true"><i /></span>
                    <span className={styles.toggleText}>
                      <b>{m.title}{locked && checked && <Lock size={12} aria-label="locked for this role" />}</b>
                      <span>{m.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.frame}>
          <div className={styles.chrome} aria-hidden="true" {...fx('console.chrome-bar')}>
            <span /><span /><span />
            <em>CONSOLE · {roleLabel.toUpperCase()}</em>
          </div>
          <motion.div layout className={styles.grid} transition={reduced ? { duration: 0 } : SPRING} {...fx('console.reflow-grid')}>
            <AnimatePresence mode="popLayout" initial={false}>
              {active.map((m) => {
                const Body = BODY[m.id];
                const locked = m.adminOnly && role !== 'admin';
                return (
                  <motion.section
                    key={m.id}
                    layout
                    className={clsx(styles.panel, locked && styles.locked)}
                    style={{ gridColumn: `span ${m.span}` }}
                    initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 0.94 }}
                    transition={reduced ? { duration: 0 } : SPRING}
                  >
                    <header><span>{m.title}</span>{locked && <Lock size={12} aria-hidden="true" />}</header>
                    {locked ? (
                      <p className={styles.lockText}>Needs an administrator role.</p>
                    ) : (
                      <Body />
                    )}
                  </motion.section>
                );
              })}
            </AnimatePresence>
            {active.length === 0 && <p className={styles.empty}>Switch a module on.</p>}
          </motion.div>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
