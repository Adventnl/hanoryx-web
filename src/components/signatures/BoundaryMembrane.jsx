import { useId, useState } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { fx } from '../../utils/fx';
import styles from './BoundaryMembrane.module.css';

const SPRING = { type: 'spring', stiffness: 300, damping: 34, mass: 0.9 };

function Cell({ rec, out, uid, reduced }) {
  return (
    <motion.li
      layout
      layoutId={`${uid}-${rec.id}`}
      className={clsx(styles.cell, out && styles.out)}
      transition={reduced ? { duration: 0 } : SPRING}
    >
      {rec.name}
    </motion.li>
  );
}

/**
 * The line between inside and outside. Twelve records sit behind a membrane;
 * choose a role and the records that role may reach cross to the outside while
 * the rest stay where they are. The crossing is a shared layout animation, so
 * you can follow each record across. An illustration of scoping — in a real
 * portal the boundary is enforced by the backend, never by the interface.
 *
 *   records: [{ id, name, visibleTo: [roleId] }]    roles: [{ id, label, line }]
 */
export default function BoundaryMembrane({ eyebrow, title, intro, records, roles, note }) {
  const uid = useId();
  const reduced = usePrefersReducedMotion();
  const [role, setRole] = useState(roles[0].id);
  const current = roles.find((r) => r.id === role);
  const outside = records.filter((r) => r.visibleTo.includes(role));
  const inside = records.filter((r) => !r.visibleTo.includes(role));

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.bench} {...fx('portals.membrane')}>
        <div className={styles.top}>
          <GlideTabs tabs={roles.map((r) => ({ id: r.id, label: r.label }))} value={role} onChange={setRole} label="Role" idPrefix="membrane-role" />
          <span className={styles.count} aria-hidden="true">
            {outside.length} <i>/</i> {records.length} reach the outside
          </span>
        </div>

        <LayoutGroup id={uid}>
          <div className={styles.stage}>
            <section className={styles.pane} aria-label="Inside">
              <header><span>INSIDE</span><em>stays inside</em></header>
              <ul className={styles.cells}>
                {inside.map((r) => <Cell key={r.id} rec={r} uid={uid} reduced={reduced} />)}
                {inside.length === 0 && <li className={styles.empty}>Nothing held back from this role.</li>}
              </ul>
            </section>

            <div className={styles.membrane} aria-hidden="true">
              <span className={styles.label}>SCOPE</span>
              <span className={styles.wall} />
            </div>

            <section className={clsx(styles.pane, styles.outsidePane)} aria-label="Outside">
              <header><span>OUTSIDE</span><em>what {current.label.toLowerCase()} reaches</em></header>
              <ul className={styles.cells}>
                {outside.map((r) => <Cell key={r.id} rec={r} out uid={uid} reduced={reduced} />)}
              </ul>
            </section>
          </div>
        </LayoutGroup>

        <p className={styles.line} role="status" aria-live="polite">
          <b>{current.label}.</b> {current.line} {outside.length} of {records.length} records reach this role.
        </p>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
