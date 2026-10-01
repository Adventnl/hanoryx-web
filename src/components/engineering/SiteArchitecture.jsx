import { useState } from 'react';
import styles from './SiteArchitecture.module.css';

const SOURCE_ROOT = 'https://github.com/Adventnl/hanoryx-web/blob/main/';

const layers = [
  {
    id: 'content', number: '01', name: 'Content', signal: 'Records and route data',
    summary: 'Page records and a reviewed public GitHub snapshot supply the site with inspectable content.',
    inputs: ['Per-route page data', 'Curated public repository metadata'],
    output: 'Structured page and project records',
    source: [
      { label: 'Page data registry', path: 'src/data/pages/index.js' },
      { label: 'GitHub sync', path: 'scripts/sync-github.mjs' },
    ],
  },
  {
    id: 'interface', number: '02', name: 'Interface', signal: 'Semantic page structure',
    summary: 'Route components compose those records into navigation, sections, project views, and accessible controls.',
    inputs: ['Structured content', 'Shared UI components'],
    output: 'The document and interaction states',
    source: [
      { label: 'Page template', path: 'src/components/page/PageTemplate.jsx' },
      { label: 'Project explorer', path: 'src/components/projects/ProjectExplorer.jsx' },
    ],
  },
  {
    id: 'motion', number: '03', name: 'Motion', signal: 'State made visible',
    summary: 'Reveals, route transitions, and section scenes communicate changes without owning the underlying content.',
    inputs: ['Document state', 'Reduced-motion preference'],
    output: 'Timed reveals and scene parameters',
    source: [
      { label: 'Reveal host', path: 'src/animation/reveal/Reveal.jsx' },
      { label: 'Route transition', path: 'src/features/transitions/TransitionOverlay.jsx' },
    ],
  },
  {
    id: 'runtime', number: '04', name: 'Runtime', signal: 'Rendering within a budget',
    summary: 'One frame scheduler, scene visibility budget, and device quality settings govern Canvas work.',
    inputs: ['Visible scenes', 'Device and motion settings'],
    output: 'Frames for the scenes that can be seen',
    source: [
      { label: 'Frame scheduler', path: 'src/animation/rafScheduler.js' },
      { label: 'Scene budget', path: 'src/animation/sceneBudget.js' },
    ],
  },
];

export function SiteArchitecture() {
  const [activeId, setActiveId] = useState(layers[0].id);
  const active = layers.find((layer) => layer.id === activeId);

  return <div className={styles.explorer}>
    <div className={styles.rail} role="group" aria-label="Site architecture layers">
      {layers.map((layer, index) => <button type="button" key={layer.id} aria-pressed={layer.id === activeId} onClick={() => setActiveId(layer.id)}>
        <span className={styles.number}>{layer.number}</span>
        <strong>{layer.name}</strong>
        <span className={styles.signal}>{layer.signal}</span>
        {index < layers.length - 1 && <span className={styles.arrow} aria-hidden="true">→</span>}
      </button>)}
    </div>
    <div className={styles.detail} aria-live="polite">
      <div className={styles.story}>
        <span className="eyebrow">Layer {active.number} / {active.name}</span>
        <h3>{active.signal}.</h3>
        <p>{active.summary}</p>
      </div>
      <div className={styles.flow}>
        <div><span>Inputs</span><ul>{active.inputs.map((input) => <li key={input}>{input}</li>)}</ul></div>
        <div><span>Output</span><p>{active.output}</p></div>
      </div>
      <div className={styles.source}>
        <span>Inspect source</span>
        <ul>{active.source.map((item) => <li key={item.path}><a href={`${SOURCE_ROOT}${item.path}`}>{item.label}<span aria-hidden="true">↗</span></a><code>{item.path}</code></li>)}</ul>
      </div>
    </div>
  </div>;
}
