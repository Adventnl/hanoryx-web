import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Play, Square } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useOnScreen } from '../../hooks/useOnScreen';
import { fx } from '../../utils/fx';
import styles from './ArchitectureExplorer.module.css';

const STEP_MS = 2100;

/**
 * The four layers of this website as a row. Pick one to see what feeds it, what
 * it produces and where the code lives (shown as plain paths). "Trace a page
 * view" walks the layers in order, a packet crossing from one to the next, and
 * says what happens at each — it stops when it reaches the last or when the
 * section leaves the screen.
 *
 *   layers: [{ id, number, name, signal, summary, trace, inputs, output, lives }]
 */
export default function ArchitectureExplorer({ eyebrow, title, intro, layers, note }) {
  const n = layers.length;
  const [rootRef, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.25 });
  const [active, setActive] = useState(0);
  const [tracing, setTracing] = useState(false);
  const layer = layers[active];

  useEffect(() => {
    if (!tracing || !onScreen) return undefined;
    const id = window.setTimeout(() => {
      if (active < n - 1) setActive(active + 1);
      else setTracing(false);
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [tracing, onScreen, active, n]);

  const pick = (i) => {
    setTracing(false);
    setActive(i);
  };
  const trace = () => {
    if (tracing) {
      setTracing(false);
      return;
    }
    setActive(0);
    setTracing(true);
  };

  return (
    <div ref={rootRef}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('engineering.layer-trace')}>
        <div className={styles.top}>
          <button type="button" className={styles.trace} onClick={trace} aria-pressed={tracing} data-cursor="link" {...fx('arch.trace-button')}>
            {tracing ? <Square size={12} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
            <span>{tracing ? 'Stop the trace' : 'Trace a page view'}</span>
          </button>
          <span className={styles.step} aria-hidden="true">LAYER {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
        </div>

        <ol className={styles.row} style={{ '--n': n, '--a': active }} role="tablist" aria-label="Site layers" {...fx('arch.layer-tabs')}>
          <span className={styles.line} aria-hidden="true" {...fx('arch.line-fill')}><span className={styles.fill} /></span>
          <span className={styles.packet} aria-hidden="true" {...fx('arch.packet')} />
          {layers.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                role="tab"
                id={`arch-tab-${l.id}`}
                aria-selected={active === i}
                aria-controls="arch-panel"
                tabIndex={active === i ? 0 : -1}
                className={clsx(styles.tab, active === i && styles.on, i < active && styles.done)}
                onClick={() => pick(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') { e.preventDefault(); pick(Math.min(n - 1, i + 1)); document.getElementById(`arch-tab-${layers[Math.min(n - 1, i + 1)].id}`)?.focus(); }
                  if (e.key === 'ArrowLeft') { e.preventDefault(); pick(Math.max(0, i - 1)); document.getElementById(`arch-tab-${layers[Math.max(0, i - 1)].id}`)?.focus(); }
                }}
              >
                <span className={styles.num}>{l.number}</span>
                <span className={styles.name}>{l.name}</span>
                <span className={styles.signal}>{l.signal}</span>
              </button>
            </li>
          ))}
        </ol>

        <div id="arch-panel" role="tabpanel" aria-labelledby={`arch-tab-${layer.id}`} className={styles.panel} {...fx('arch.story-swap')}>
          <div className={styles.story} key={layer.id}>
            <h3>{layer.signal}.</h3>
            <p>{layer.summary}</p>
            <p className={styles.traceLine}><b>In a page view:</b> {layer.trace}</p>
          </div>
          <div className={styles.cols} key={`${layer.id}-cols`}>
            <div>
              <span>Takes in</span>
              <ul>{layer.inputs.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div>
              <span>Produces</span>
              <p>{layer.output}</p>
            </div>
            <div>
              <span>Where it lives</span>
              <ul className={styles.paths}>{layer.lives.map((x) => <li key={x}><code>{x}</code></li>)}</ul>
            </div>
          </div>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
