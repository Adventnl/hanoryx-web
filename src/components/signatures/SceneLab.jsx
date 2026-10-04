import { useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { SceneCanvas } from '../scenes/SceneCanvas';
import { fx } from '../../utils/fx';
import styles from './SceneLab.module.css';

/**
 * A viewer for the site's own Canvas scenes. Choose a study from the list (or
 * with ↑ ↓), change its density, and flip "Still frame" to see the single frame
 * a visitor with reduced motion gets. The viewer keeps its place while the scene
 * underneath it changes.
 *
 *   experiments: [{ id, name, purpose }]
 */
export default function SceneLab({ eyebrow, title, intro, experiments, note }) {
  const [id, setId] = useState(experiments[0].id);
  const [density, setDensity] = useState(1);
  const [still, setStill] = useState(false);
  const current = experiments.find((e) => e.id === id);
  const index = experiments.findIndex((e) => e.id === id);

  const onKeyDown = (event) => {
    let next = -1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % experiments.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + experiments.length) % experiments.length;
    if (next < 0) return;
    event.preventDefault();
    setId(experiments[next].id);
    document.getElementById(`lab-exp-${experiments[next].id}`)?.focus();
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="scan" />
      <div className={styles.layout} {...fx('lab.scene-viewer')}>
        <div className={styles.viewer}>
          <SceneCanvas key={`${id}-${still}`} scene={id} cost="hero" density={density} still={still} />
          <span className={clsx(styles.corner, styles.tl)} aria-hidden="true" />
          <span className={clsx(styles.corner, styles.br)} aria-hidden="true" />
          <div className={styles.label}>
            <span>{current.name}</span>
            <span>{still ? 'STILL FRAME' : 'CANVAS / 2D · LIVE'}</span>
          </div>
        </div>

        <div className={styles.panel}>
          <div role="radiogroup" aria-label="Choose a scene" className={styles.list} onKeyDown={onKeyDown}>
            {experiments.map((e, i) => (
              <button
                key={e.id}
                id={`lab-exp-${e.id}`}
                type="button"
                role="radio"
                aria-checked={e.id === id}
                tabIndex={e.id === id ? 0 : -1}
                className={clsx(styles.item, e.id === id && styles.on)}
                onClick={() => setId(e.id)}
              >
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <strong>{e.name}</strong>
              </button>
            ))}
          </div>
          <p className={styles.purpose} key={id}>{current.purpose}</p>
          <label className={styles.slider}>
            <span>Density</span>
            <input type="range" min="0.4" max="1.4" step="0.1" value={density} onChange={(e) => setDensity(Number(e.target.value))} />
            <output>{Math.round(density * 100)}%</output>
          </label>
          <label className={styles.toggle}>
            <input type="checkbox" checked={still} onChange={(e) => setStill(e.target.checked)} />
            <span className={styles.switch} aria-hidden="true"><i /></span>
            <span>Still frame <small>(what reduced motion shows)</small></span>
          </label>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
