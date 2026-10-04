import { useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { CompareSlider } from '../fx/CompareSlider';
import { fx } from '../../utils/fx';
import styles from './SurfaceCompare.module.css';

/**
 * "Structure first. Surface second." Drag the handle to peel the surface of a
 * generic screen away and see the structure it rests on: roles, records,
 * boundaries and a trail of changes. The legend buttons glide the reveal open
 * and light one family of annotations at a time.
 *
 * The screen is a deliberate abstraction (skeleton bars, no copy) — an
 * illustration of the approach, not a screenshot of any real product.
 *
 *   groups: [{ id, label, note }]
 */
function Skeleton({ structure }) {
  const note = (group, text, className) => (
    structure ? <span className={clsx(styles.note, className)} data-group={group}>{text}</span> : null
  );
  return (
    <div className={clsx(styles.screen, structure && styles.blueprint)} aria-hidden="true">
      <div className={styles.top}>
        <span className={styles.logo} />
        <span className={styles.pill} /><span className={styles.pill} /><span className={styles.pill} />
        <span className={styles.avatar} />
        {note('access', 'SESSION · ROLE', styles.nTop)}
      </div>
      <div className={styles.side}>
        {[0, 1, 2, 3].map((i) => <span key={i} className={styles.sideItem} data-on={i === 1 ? 'true' : 'false'} />)}
        {note('access', 'SCOPE PER ROLE', styles.nSide)}
      </div>
      <div className={styles.main}>
        <span className={styles.heading} />
        <div className={styles.cards}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={styles.card}>
              <i /><b /><em />
            </span>
          ))}
          {note('data', 'RECORD OWNER', styles.nCards)}
        </div>
        <div className={styles.table}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={styles.rowLine}><i /><b /><em /></span>
          ))}
          {note('change', 'AUDIT TRAIL', styles.nTable)}
        </div>
        {note('data', 'READ BOUNDARY', styles.nBoundary)}
      </div>
      {structure && <span className={styles.boundaryLine} data-group="data" />}
    </div>
  );
}

export default function SurfaceCompare({ eyebrow, title, intro, groups, note }) {
  const [pos, setPos] = useState(18);
  const [focus, setFocus] = useState(null);

  const reveal = (id) => {
    setFocus(id);
    setPos(88);
  };
  const clear = () => setFocus(null);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.wrap} data-focus={focus || 'none'} {...fx('company.surface-compare')}>
        <CompareSlider
          className={styles.slider}
          value={pos}
          onChange={setPos}
          before={<Skeleton />}
          after={<Skeleton structure />}
          beforeLabel="Surface"
          afterLabel="Structure"
          label="Reveal the structure under the surface"
        />
        <ul className={styles.legend}>
          {groups.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                className={clsx(styles.chip, focus === g.id && styles.chipOn)}
                onClick={() => reveal(g.id)}
                onPointerEnter={() => focus && setFocus(g.id)}
                onFocus={() => setFocus(g.id)}
                onBlur={clear}
                aria-pressed={focus === g.id}
              >
                <b>{g.label}</b>
                <span>{g.note}</span>
              </button>
            </li>
          ))}
        </ul>
        {note && <p className={styles.caption}>{note}</p>}
      </div>
    </div>
  );
}
