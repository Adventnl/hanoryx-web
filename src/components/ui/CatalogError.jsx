import styles from './CatalogError.module.css';

export function CatalogError({ retry, subject = 'page list' }) {
  return (
    <p role="alert" className={styles.notice}>
      The {subject} could not load.
      <button type="button" onClick={retry}>Try again</button>
    </p>
  );
}
