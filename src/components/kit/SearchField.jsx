import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import Field from './Field';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/**
 * A search box with a clear button and, when you give it `count`, a result count
 * that is read out as it changes. Escape clears it. `onChange` gets the text; it
 * does not search anything itself.
 */
export default function SearchField({ label = 'Search', hint, value, defaultValue = '', onChange, count, noun = 'results', placeholder = 'Search…', className, disabled }) {
  const [text, setText] = useControllable({ value, defaultValue, onChange });
  const ref = useRef(null);
  const clear = () => { setText(''); ref.current?.focus(); };

  return (
    <Field label={label} hint={hint} className={className}>
      {(a11y) => (
        <>
          <span className={styles.group} data-disabled={disabled ? '' : undefined}>
            <span className={styles.searchIcon} aria-hidden="true"><Search size={15} /></span>
            <input
              {...a11y}
              ref={ref}
              className={styles.bare}
              type="search"
              value={text}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape' && text) { e.preventDefault(); clear(); } }}
            />
            {text && <button type="button" className={styles.iconBtn} onClick={clear} aria-label="Clear the search"><X size={14} aria-hidden="true" /></button>}
          </span>
          {count != null && <span className={styles.count} role="status">{count} {count === 1 ? noun.replace(/s$/, '') : noun}</span>}
        </>
      )}
    </Field>
  );
}
