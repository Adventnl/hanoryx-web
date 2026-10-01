import { Link } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHeroBlock } from '../components/page/PageBlocks';
import { SectionScene } from '../components/scenes/SectionScene';
import { SiteArchitecture } from '../components/engineering/SiteArchitecture';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Engineering.module.css';

const hero = {
  scene: 'architecture-layer', eyebrow: 'Hanoryx Systems / Engineering', title: 'Engineering, visible in the system.',
  intro: 'The site itself is a working example: a scene registry, shared animation scheduler, quality budget, and route-level code splitting.',
  code: 'ENG.01', status: 'IMPLEMENTED HERE',
  actions: [{ label: 'Explore the lab', to: '/lab' }, { label: 'View source', href: 'https://github.com/Adventnl/hanoryx-web', variant: 'outline' }],
};

export default function Engineering() {
  useDocumentTitle('Site Engineering');
  return <PageTransition><PageHeroBlock hero={hero} accent="#ff3333" />
    <SectionScene scene="dependency-graph" intensity="low" className={styles.section}><div className="container">
      <span className="eyebrow">Architecture / this website</span><h2 className="heading-1">Four layers. One interface.</h2>
      <p className={styles.intro}>The diagram describes this repository’s implementation, not an undisclosed client system.</p>
      <SiteArchitecture />
    </div></SectionScene>
    <section className={styles.principles}><div className="container"><span className="eyebrow">Runtime decisions</span><h2 className="heading-1">Effects have a cost.</h2>
      <div className={styles.columns}><p>Canvas scenes load on demand and share a single animation loop. Offscreen scenes pause; the most visible scenes receive the frame budget. Background scenes target 30 frames per second.</p><p>On reduced-motion settings, scenes render a still frame. Mobile devices use a lower pixel ratio and fewer simultaneous scenes. The content stays available even when the visual layer is quiet.</p></div>
      <Link to="/lab" className={styles.link}>Inspect scenes in the lab →</Link>
    </div></section>
  </PageTransition>;
}
