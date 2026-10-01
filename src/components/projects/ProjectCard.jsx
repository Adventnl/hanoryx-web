import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatProjectDate } from '../../data/publicProjects';
import styles from './projects.module.css';

export function ProjectCard({ project, index }) {
  return (
    <article className={styles.card}>
      <Link to={`/projects/${project.id}`} className={styles.cardLink} aria-label={`Explore ${project.name}`}>
        <span className={styles.cardTop}><span>{String(index + 1).padStart(2, '0')} / {project.category}</span><ArrowUpRight size={18} /></span>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <span className={styles.cardBottom}>
          <span>{project.primaryLanguage || 'Language unlisted'}</span>
          <span>Updated {formatProjectDate(project.pushedAt)}</span>
        </span>
      </Link>
    </article>
  );
}
