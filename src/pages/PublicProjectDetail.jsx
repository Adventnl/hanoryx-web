import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHeroBlock } from '../components/page/PageBlocks';
import { LanguageDistribution } from '../components/projects/LanguageDistribution';
import { ProjectGraph } from '../components/projects/ProjectGraph';
import { RepositoryTree } from '../components/projects/RepositoryTree';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatProjectDate, getPublicProject } from '../data/publicProjects';
import NotFound from './NotFound';
import styles from '../components/projects/projects.module.css';

function ProjectDetail({ project }) {
  useDocumentTitle(project.name, project.summary);
  const hero = {
    scene: project.category === 'Engine' ? 'isometric-infra' : 'architecture-layer',
    eyebrow: `Public repository / ${project.category}`,
    title: project.name,
    intro: project.summary,
    code: project.primaryLanguage || 'SOURCE',
    status: 'PUBLIC REPOSITORY',
    actions: [{ label: 'View source on GitHub', href: project.url }, { label: 'All projects', to: '/projects', variant: 'outline' }],
  };
  return <PageTransition>
    <PageHeroBlock hero={hero} accent="#ff3333" />
    <section className={styles.detail}>
      <div className="container">
        <Link to="/projects" className={styles.back}><ArrowLeft size={15} /> All public projects</Link>
        <div className={styles.detailGrid}>
          <div>
            <span className="eyebrow">Repository profile</span>
            <h2 className="heading-1">The public record.</h2>
            <p className="lead">This profile reports repository metadata. See the source for implementation details and current status.</p>
            {project.topics.length > 0 && <div className={styles.topics}>{project.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>}
          </div>
          <dl className={styles.facts}>
            <div><dt>Category</dt><dd>{project.category}</dd></div>
            <div><dt>Primary language</dt><dd>{project.primaryLanguage || 'Not listed'}</dd></div>
            <div><dt>Created</dt><dd>{formatProjectDate(project.createdAt)}</dd></div>
            <div><dt>Last pushed</dt><dd>{formatProjectDate(project.pushedAt)}</dd></div>
            {project.latestRelease && <div><dt>Latest published release</dt><dd><a href={project.latestRelease.url}>{project.latestRelease.tag} <ArrowUpRight size={13} /></a></dd></div>}
            <div><dt>Source</dt><dd><a href={project.url}>GitHub <ArrowUpRight size={13} /></a></dd></div>
            {project.homepageUrl && <div><dt>Project site</dt><dd><a href={project.homepageUrl}>Open site <ArrowUpRight size={13} /></a></dd></div>}
          </dl>
        </div>
        <LanguageDistribution languages={project.languages} title="Language composition" />
      </div>
    </section>
    <RepositoryTree key={project.id} project={project} />
    <section className={styles.highlights}><div className="container"><span className="eyebrow">From public documentation</span><h2 className="heading-1">What the source describes.</h2><p className={styles.highlightsIntro}>These notes are reviewed summaries of the repository README. Follow the source link for implementation detail and current status.</p><ol>{project.highlights.map((highlight, index) => <li key={highlight}><span>{String(index + 1).padStart(2, '0')}</span><p>{highlight}</p></li>)}</ol></div></section>
    <ProjectGraph initialProjectId={project.id} showPicker={false} />
  </PageTransition>;
}

export default function PublicProjectDetail() {
  const { id } = useParams();
  const project = getPublicProject(id);
  return project ? <ProjectDetail project={project} /> : <NotFound />;
}
