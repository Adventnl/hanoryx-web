import { useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { fx } from '../../utils/fx';
import styles from './LifecycleLine.module.css';

/**
 * A system's life as five stages, with an illustrative shape of the effort each
 * asks for. Slide along it to see where you are and what the stage is mostly
 * about. The shape is qualitative: it says which stages tend to be larger, not by
 * how much.
 *
 *   stages: [{ id, name, years, blurb, mostly, decisions, risks, effort: [number x 10] }]
 */
export default function LifecycleLine({ eyebrow, title, intro, stages = [], note }) {
  const [at, setAt] = useState(0);
  const s = stages[at];
  const W = 400;
  const H = 120;
  const all = stages.flatMap((x) => x.effort);
  const top = Math.max(...all, 1);
  const pts = all.map((v, i) => [(i / (all.length - 1)) * W, H - 8 - (v / top) * (H - 22)]);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `0,${H - 8} ${line} ${W},${H - 8}`;
  const per = stages[0].effort.length;
  const x0 = (at * per) / (all.length - 1) * W;
  const x1 = ((at + 1) * per - 1) / (all.length - 1) * W;

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('lifecycle.rig')}>
        <div className={styles.track} role="tablist" aria-label="Stages of a system's life">
          {stages.map((x, i) => (
            <button key={x.id} id={`life-${x.id}`} type="button" role="tab" aria-selected={i === at} aria-controls="life-panel" tabIndex={i === at ? 0 : -1} className={clsx(styles.stage, i === at && styles.on, i < at && styles.past)} onClick={() => setAt(i)}
              onKeyDown={(e) => { if (e.key === 'ArrowRight') setAt((n) => Math.min(stages.length - 1, n + 1)); else if (e.key === 'ArrowLeft') setAt((n) => Math.max(0, n - 1)); }}>
              <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
              <b>{x.name}</b>
              <small>{x.years}</small>
            </button>
          ))}
        </div>

        <figure className={styles.chart}>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="An illustrative shape of the effort a system asks for over its life">
            <rect x={x0} y="0" width={Math.max(8, x1 - x0)} height={H} className={styles.band} />
            <polygon points={area} className={styles.fill} />
            <polyline points={line} className={styles.line} />
            <line x1="0" x2={W} y1={H - 8} y2={H - 8} className={styles.axis} />
          </svg>
          <figcaption>An illustrative shape of the effort a system asks for. Which stages tend to be larger, not by how much.</figcaption>
        </figure>

        <div id="life-panel" role="tabpanel" aria-labelledby={`life-${s.id}`} className={styles.panel} {...fx('lifecycle.stage')}>
          <p className={styles.k}>Stage {at + 1} of {stages.length}</p>
          <h3>{s.name}</h3>
          <p className={styles.blurb}>{s.blurb}</p>
          <p className={styles.mostly}><b>Mostly:</b> {s.mostly}</p>
          <div className={styles.cols}>
            <div><p className={styles.k}>Decisions</p><ul>{s.decisions.map((d) => <li key={d}>{d}</li>)}</ul></div>
            <div><p className={styles.k}>What goes wrong</p><ul>{s.risks.map((d) => <li key={d}>{d}</li>)}</ul></div>
          </div>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
