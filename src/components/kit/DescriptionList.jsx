import styles from './data.module.css';

/**
 * Terms and what they mean, or labels and their values — the right element for
 * a "fact sheet". A real `<dl>`, so a screen reader pairs each term with its
 * detail. `stacked` puts the detail under the term instead of beside it.
 *
 *   items: [{ term, detail }]
 */
export default function DescriptionList({ items = [], stacked = false, className }) {
  return (
    <dl className={`${styles.dl} ${className || ''}`} data-stacked={stacked ? '' : undefined}>
      {items.map((it) => (
        <div key={it.term}>
          <dt>{it.term}</dt>
          <dd>{it.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
