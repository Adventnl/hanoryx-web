import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicProjects } from '../../data/publicProjects';
import styles from './ProjectGraph.module.css';

const HEIGHT = 520;
const position = (index, count) => count === 1 ? HEIGHT / 2 : 72 + index * ((HEIGHT - 144) / (count - 1));

function sharedLanguages(source, target) {
  const names = new Set(source.languages.map((language) => language.name));
  return target.languages.map((language) => language.name).filter((name) => names.has(name));
}

export function ProjectGraph({ initialProjectId, showPicker = true }) {
  const [pickedId, setPickedId] = useState(initialProjectId || publicProjects[0]?.id);
  const selectedId = showPicker ? pickedId : initialProjectId;
  const selected = publicProjects.find((project) => project.id === selectedId) || publicProjects[0];
  const languages = useMemo(() => selected?.languages.map((language) => language.name) || [], [selected]);
  const related = useMemo(() => publicProjects
    .filter((project) => project.id !== selected.id)
    .map((project) => ({ project, shared: sharedLanguages(selected, project) }))
    .filter((item) => item.shared.length)
    .sort((a, b) => b.shared.length - a.shared.length || a.project.name.localeCompare(b.project.name)), [selected]);

  if (!selected) return null;

  return <section className={styles.section} aria-labelledby="project-graph-heading">
    <div className="container">
      <div className={styles.header}>
        <span className="eyebrow">Public source / relationship map</span>
        <h2 id="project-graph-heading" className="heading-1">Trace the shared language.</h2>
        <p className="lead">Connections mean that GitHub detects the same language in two curated public repositories. They do not imply a code dependency or shared deployment.</p>
      </div>
      {showPicker && <div className={styles.picker} role="group" aria-label="Choose a repository for the graph">
        {publicProjects.map((project) => <button type="button" key={project.id} aria-pressed={selected.id === project.id} onClick={() => setPickedId(project.id)}>{project.name}</button>)}
      </div>}
      <div className={styles.summary} role="status" aria-live="polite">
        <span>{selected.name}</span>
        <span>{languages.length} {languages.length === 1 ? 'language' : 'languages'} / {related.length} connected {related.length === 1 ? 'repository' : 'repositories'}</span>
      </div>
      <div className={styles.stage}>
        <svg className={styles.edges} viewBox={`0 0 1000 ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
          {languages.map((language, index) => <path key={`root-${language}`} className={styles.rootEdge} d={`M 180 260 C 330 260 350 ${position(index, languages.length)} 500 ${position(index, languages.length)}`} />)}
          {related.flatMap((item, relatedIndex) => item.shared.map((language) => {
            const languageIndex = languages.indexOf(language);
            return <path key={`${item.project.id}-${language}`} className={styles.relatedEdge} d={`M 500 ${position(languageIndex, languages.length)} C 650 ${position(languageIndex, languages.length)} 670 ${position(relatedIndex, related.length)} 820 ${position(relatedIndex, related.length)}`} />;
          }))}
        </svg>
        <div className={styles.focus}>
          <span className={styles.nodeLabel}>Selected repository</span>
          <strong>{selected.name}</strong>
          <p>{selected.summary}</p>
          {showPicker
            ? <Link to={`/projects/${selected.id}`}>View project <span aria-hidden="true">↗</span></Link>
            : <a href={selected.url}>View source <span aria-hidden="true">↗</span></a>}
        </div>
        <ul className={styles.languageList} aria-label="Detected languages">
          {languages.map((language, index) => <li key={language} style={{ '--node-top': `${20 + position(index, languages.length)}px` }}><span className={styles.nodeLabel}>Language</span><strong>{language}</strong></li>)}
        </ul>
        <ul className={styles.relatedList} aria-label="Connected repositories">
          {related.length ? related.map(({ project, shared }, index) => <li key={project.id} style={{ '--node-top': `${20 + position(index, related.length)}px` }}>
            <Link to={`/projects/${project.id}`}><span className={styles.nodeLabel}>Shared: {shared.join(', ')}</span><strong>{project.name}</strong><span className={styles.nodeArrow} aria-hidden="true">↗</span></Link>
          </li>) : <li className={styles.noConnections}>No other curated repository shares a detected language.</li>}
        </ul>
      </div>
    </div>
  </section>;
}
