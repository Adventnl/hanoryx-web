import { X } from 'lucide-react';
import styles from './data.module.css';

/**
 * A compact pill that can be three things: plain information, a toggle (give it
 * `onClick`, and `selected` says whether it is on), and/or removable (give it
 * `onRemove`, which adds a separate close button named after the chip).
 */
export default function Chip({ children, selected, onClick, onRemove, className }) {
  return (
    <span className={`${styles.chip} ${className || ''}`} data-selected={selected ? '' : undefined}>
      {onClick ? (
        <button type="button" className={styles.chipMain} aria-pressed={selected} onClick={onClick}>{children}</button>
      ) : (
        <span className={styles.chipMain}>{children}</span>
      )}
      {onRemove && (
        <button type="button" className={styles.chipX} onClick={onRemove} aria-label={`Remove ${typeof children === 'string' ? children : 'this chip'}`}>
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
