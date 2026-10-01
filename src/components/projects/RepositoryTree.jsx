import { useState } from 'react';
import { ArrowUpRight, FileCode2, Folder } from 'lucide-react';
import { githubSnapshot } from '../../data/publicProjects';
import styles from './RepositoryTree.module.css';

const INITIAL_COUNT = 8;

export function RepositoryTree({ project }) {
  const [expanded, setExpanded] = useState(false);
  const entries = project.rootEntries || [];
  const visible = expanded ? entries : entries.slice(0, INITIAL_COUNT);
  const directoryCount = entries.filter((entry) => entry.type === 'dir').length;

  return <section className={styles.section} aria-labelledby="repository-tree-heading">
    <div className="container">
      <div className={styles.heading}>
        <span className="eyebrow">Public repository / source structure</span>
        <h2 id="repository-tree-heading" className="heading-1">Inside the root.</h2>
        <p className="lead">Selected root entries from the public GitHub repository. Open a folder or file to inspect the current source.</p>
      </div>
      <div className={styles.layout}>
        <div className={styles.tree}>
          <div className={styles.treeHead}><span>{project.name} /</span><span>{entries.length} selected entries</span></div>
          {entries.length ? <ul>{visible.map((entry) => <li key={entry.url}><a href={entry.url}>
            {entry.type === 'dir' ? <Folder size={16} aria-hidden="true" /> : <FileCode2 size={16} aria-hidden="true" />}
            <span>{entry.name}</span><span className={styles.kind}>{entry.type === 'dir' ? 'directory' : 'file'}</span><ArrowUpRight size={15} aria-hidden="true" />
          </a></li>)}</ul> : <p className={styles.empty}>The root listing was unavailable when this public snapshot was generated. Open the repository on GitHub to inspect it.</p>}
          {!expanded && entries.length > INITIAL_COUNT && <button type="button" className={styles.more} onClick={() => setExpanded(true)}>Show {entries.length - INITIAL_COUNT} more selected entries</button>}
          {expanded && entries.length > INITIAL_COUNT && <button type="button" className={styles.more} onClick={() => setExpanded(false)}>Show fewer entries</button>}
        </div>
        <aside className={styles.context}>
          <span className="eyebrow">Reading the snapshot</span>
          <dl>
            <div><dt>Directories shown</dt><dd>{directoryCount}</dd></div>
            <div><dt>Root files and folders</dt><dd>{project.rootEntryCount ?? 'Unknown'}</dd></div>
            <div><dt>Snapshot generated</dt><dd>{new Date(githubSnapshot.generatedAt).toLocaleDateString('en', { dateStyle: 'medium' })}</dd></div>
          </dl>
          <p>Hidden files and lockfiles are omitted from this preview. GitHub remains the source for the complete, current tree.</p>
          <a href={project.url}>Open full repository <ArrowUpRight size={15} aria-hidden="true" /></a>
        </aside>
      </div>
    </div>
  </section>;
}
