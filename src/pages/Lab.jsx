import { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHeroBlock } from '../components/page/PageBlocks';
import { SceneCanvas } from '../components/scenes/SceneCanvas';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Lab.module.css';

const experiments = [
  { id: 'flow-field', name: 'Flow field', purpose: 'Vector motion as a continuous field.' },
  { id: 'network-constellation', name: 'Network constellation', purpose: 'Relationships drawn as linked nodes.' },
  { id: 'wave-interference', name: 'Wave interference', purpose: 'Overlapping frequencies create a changing surface.' },
  { id: 'topographic-lines', name: 'Topographic lines', purpose: 'Contour structure with slow spatial movement.' },
  { id: 'dependency-graph', name: 'Dependency graph', purpose: 'Architecture expressed through connections.' },
  { id: 'signal-spectrum-field', name: 'Signal spectrum', purpose: 'A field that responds to the shared audio bridge.' },
];

const hero = { scene: 'interface-lab-shape', eyebrow: 'Hanoryx Systems / Lab', title: 'The visual systems laboratory.', intro: 'A closer look at selected Canvas scenes that already power the site. Choose a study and inspect its behavior.', code: 'LAB.01', status: 'INTERACTIVE', actions: [{ label: 'How it is built', to: '/engineering', variant: 'outline' }] };

export default function Lab() {
  useDocumentTitle('Lab');
  const [selected, setSelected] = useState(experiments[0]);
  const [density, setDensity] = useState(1);
  return <PageTransition><PageHeroBlock hero={hero} accent="#ff3333" />
    <section className={styles.lab} aria-labelledby="lab-heading"><div className="container">
      <div className={styles.heading}><span className="eyebrow">Scene catalogue / selection</span><h2 id="lab-heading" className="heading-1">Study the field.</h2><p>Scenes share the site’s scheduler and quality budget. Reduced-motion settings show a still frame.</p></div>
      <div className={styles.layout}>
        <div className={styles.viewer}><SceneCanvas key={selected.id} scene={selected.id} cost="hero" density={density} /><div className={styles.viewerLabel}><span>{selected.name}</span><span>CANVAS / 2D</span></div></div>
        <div className={styles.panel}><h3>Experiments</h3><div className={styles.list} role="group" aria-label="Choose a scene">{experiments.map((item, index) => <button type="button" key={item.id} aria-pressed={selected.id === item.id} onClick={() => setSelected(item)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.name}</strong></button>)}</div>
          <p className={styles.purpose}>{selected.purpose}</p>
          <label className={styles.slider}>Density <output>{Math.round(density * 100)}%</output><input type="range" min="0.4" max="1.4" step="0.1" value={density} onChange={(event) => setDensity(Number(event.target.value))} /></label>
        </div>
      </div>
    </div></section>
  </PageTransition>;
}
