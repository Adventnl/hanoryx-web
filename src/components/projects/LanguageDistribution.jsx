import styles from './projects.module.css';

export function LanguageDistribution({ languages, title = 'Languages' }) {
  const total = languages.reduce((sum, language) => sum + language.bytes, 0);
  if (!total) return <p className={styles.empty}>Language data is not available for this repository.</p>;
  return (
    <div className={styles.languagePanel}>
      <h3>{title}</h3>
      <div className={styles.languageStack} aria-hidden="true">
        {languages.map((language, index) => <span key={language.name} style={{ width: `${language.bytes / total * 100}%`, background: index === 0 ? 'var(--c-red)' : `rgba(255,255,255,${Math.max(0.16, 0.64 - index * 0.1)})` }} />)}
      </div>
      <ul className={styles.languageList}>
        {languages.map((language) => <li key={language.name}><span>{language.name}</span><strong>{language.bytes / total < 0.005 ? '<1%' : `${Math.round(language.bytes / total * 100)}%`}</strong></li>)}
      </ul>
    </div>
  );
}
