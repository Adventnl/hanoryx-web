import { Link } from 'react-router-dom';
import { publicProjects } from '../../data/publicProjects';
import { ProjectCard } from './ProjectCard';
import styles from './projects.module.css';

export function PublicWorkPreview() {
  const featured = publicProjects.filter((project) => ['hanoryx-web', 'task-set', 'yk-engine', 'orbit-cloud'].includes(project.id));
  return <section className={styles.explorer} aria-labelledby="public-work-heading"><div className="container">
    <div className={styles.sectionHeading}><span className="eyebrow">From public source</span><h2 id="public-work-heading" className="heading-1">Built in the open.</h2><p className="lead">Explore real repositories, implementation languages, and public development dates. These records come from GitHub.</p></div>
    <div className={styles.grid}>{featured.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
    <Link className={styles.back} style={{ marginTop: 'var(--space-8)' }} to="/projects">Explore all public work →</Link>
  </div></section>;
}
