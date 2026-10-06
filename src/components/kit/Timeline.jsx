import styles from './data.module.css';

/**
 * Things in the order they happen, down a line. It is an ordered list, so the
 * order is announced; `when` can be a date, a phase or just "Step 3". Items with
 * `done` get a filled marker. The site's own timeline is told in undated phases —
 * pass words, not dates, unless you have them.
 *
 *   items: [{ when?, title, body?, done? }]
 */
export default function Timeline({ items = [], className }) {
  return (
    <ol className={`${styles.timeline} ${className || ''}`}>
      {items.map((it) => (
        <li key={it.title} data-done={it.done ? '' : undefined}>
          {it.when && <span className={styles.when}>{it.when}</span>}
          <h3>{it.title}</h3>
          {it.body && <p>{it.body}</p>}
        </li>
      ))}
    </ol>
  );
}
