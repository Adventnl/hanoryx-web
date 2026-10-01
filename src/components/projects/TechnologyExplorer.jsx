import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicProjects } from '../../data/publicProjects';
import styles from './TechnologyExplorer.module.css';

const technologies = [...publicProjects.flatMap((project) => project.languages)]
  .reduce((totals, language) => totals.set(language.name, (totals.get(language.name) || 0) + language.bytes), new Map());
const languages = [...technologies.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name]) => name);

export function TechnologyExplorer() {
  const [selected, setSelected] = useState(languages[0]);
  const connected = useMemo(() => publicProjects.filter((project) => project.languages.some((language) => language.name === selected)), [selected]);

  return <section className={styles.section} aria-labelledby="tech-heading"><div className="container">
    <div className={styles.heading}><span className="eyebrow">Public repository languages</span><h2 id="tech-heading" className="heading-1">Follow the technology.</h2><p className="lead">Select a language to see the repositories where GitHub detects it. Connections reflect language data only.</p></div>
    <div className={styles.layout}>
      <div className={styles.languages} role="group" aria-label="Choose a language">{languages.map((language) => <button type="button" key={language} aria-pressed={selected === language} onClick={() => setSelected(language)}><span>{language}</span><span>{publicProjects.filter((project) => project.languages.some((item) => item.name === language)).length}</span></button>)}</div>
      <div className={styles.results} aria-live="polite"><div className={styles.resultHead}><span>{selected}</span><span>{connected.length} {connected.length === 1 ? 'repository' : 'repositories'}</span></div>
        <ul>{connected.map((project) => <li key={project.id}><Link to={`/projects/${project.id}`}><span><small>{project.category}</small><strong>{project.name}</strong></span><span aria-hidden="true">↗</span></Link></li>)}</ul>
      </div>
    </div>
  </div></section>;
}
