import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { filterPublicProjects, projectCategories, projectLanguages, publicProjects } from '../../data/publicProjects';
import { ProjectCard } from './ProjectCard';
import styles from './projects.module.css';

export function ProjectExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('All');
  const [view, setView] = useState(() => { try { return localStorage.getItem('hnx.project-view') === 'index' ? 'index' : 'grid'; } catch { return 'grid'; } });
  const filtered = useMemo(() => filterPublicProjects(publicProjects, { query, category, language }), [query, category, language]);
  const setProjectView = (next) => { setView(next); try { localStorage.setItem('hnx.project-view', next); } catch { /* private browsing */ } };

  return (
    <section className={styles.explorer} aria-labelledby="explorer-heading">
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className="eyebrow">Public source / curated</span>
          <h2 id="explorer-heading" className="heading-1">Explore the work.</h2>
          <p className="lead">Browse public repositories by subject and implementation language. Each record links to its source.</p>
        </div>
        <div className={styles.controls}>
          <label className={styles.searchLabel}>Search projects
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, subject, or technology" />
          </label>
          <label className={styles.selectLabel}>Language
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option>All</option>
              {projectLanguages.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className={styles.filters} role="group" aria-label="Project categories">
          {projectCategories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className={styles.resultBar}><p className={styles.resultCount} role="status">{filtered.length} public {filtered.length === 1 ? 'repository' : 'repositories'}</p><div className={styles.viewToggle} role="group" aria-label="Project view"><button type="button" aria-pressed={view === 'grid'} onClick={() => setProjectView('grid')}>Grid</button><button type="button" aria-pressed={view === 'index'} onClick={() => setProjectView('index')}>Index</button></div></div>
        {filtered.length ? view === 'grid' ? <div className={styles.grid}>{filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div> : <ul className={styles.indexList}>{filtered.map((project, index) => <li key={project.id}><Link to={`/projects/${project.id}`}><span className={styles.indexNum}>{String(index + 1).padStart(2, '0')}</span><strong>{project.name}</strong><span>{project.category}</span><span>{project.primaryLanguage || '—'}</span><span aria-hidden="true">↗</span></Link></li>)}</ul> : <p className={styles.empty}>No repositories match these filters. Try another subject or language.</p>}
      </div>
    </section>
  );
}
