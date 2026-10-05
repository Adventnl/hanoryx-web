import { Fragment, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Field from './Field';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/* Wrap the part of a label that matched what was typed. */
function Marked({ text, query }) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at < 0) return text;
  return (
    <Fragment>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </Fragment>
  );
}

/**
 * An editable combobox (the ARIA 1.2 list-autocomplete pattern): type to filter,
 * ↓ ↑ to move through the matches, Home and End to jump, Enter to choose, Escape
 * to close — and then to clear. DOM focus stays in the input; the highlighted
 * option is named with `aria-activedescendant`.
 *
 *   options: ['Cairo', 'Lagos'] or [{ value, label }]
 */
export default function Combobox({ label, hint, error, required, options = [], value, defaultValue = '', onChange, onSelect, placeholder = 'Type to search…', emptyText = 'Nothing matches.', className, disabled }) {
  const listId = useId();
  const [selected, setSelected] = useControllable({ value, defaultValue, onChange });
  const items = useMemo(() => options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)), [options]);
  const [typed, setTyped] = useState(null); // null = show the chosen label, string = the user is typing
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const chosen = items.find((o) => o.value === selected);
  const text = typed ?? chosen?.label ?? '';
  const matches = useMemo(() => {
    const q = (typed ?? '').trim().toLowerCase();
    return q ? items.filter((o) => o.label.toLowerCase().includes(q)) : items;
  }, [items, typed]);
  const at = Math.min(active, Math.max(matches.length - 1, 0));
  const showList = open && matches.length > 0;

  const choose = (o) => {
    setSelected(o.value);
    onSelect?.(o);
    setTyped(null);
    setOpen(false);
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setActive((at + 1) % Math.max(matches.length, 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (!open) setOpen(true); else setActive((at - 1 + matches.length) % Math.max(matches.length, 1)); }
    else if (e.key === 'Home' && open) { e.preventDefault(); setActive(0); }
    else if (e.key === 'End' && open) { e.preventDefault(); setActive(Math.max(matches.length - 1, 0)); }
    else if (e.key === 'Enter' && showList && matches[at]) { e.preventDefault(); choose(matches[at]); }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); setTyped(null); } else if (text) { setSelected(''); setTyped(null); } }
    else if (e.key === 'Tab') { setOpen(false); setTyped(null); }
  };

  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => (
        <span className={styles.comboWrap}>
          <span className={styles.group} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
            <input
              {...a11y}
              ref={inputRef}
              className={styles.bare}
              role="combobox"
              aria-expanded={showList}
              aria-controls={showList ? listId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={showList ? `${listId}-${at}` : undefined}
              value={text}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              autoComplete="off"
              onChange={(e) => { setTyped(e.target.value); setActive(0); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => { setOpen(false); setTyped(null); }}
              onKeyDown={onKeyDown}
            />
            <button type="button" className={styles.iconBtn} tabIndex={-1} aria-label="Show the options" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => { setOpen((o) => !o); inputRef.current?.focus(); }}>
              <ChevronDown size={15} aria-hidden="true" />
            </button>
          </span>
          {showList && (
            <ul id={listId} role="listbox" className={styles.listbox} aria-label={label || 'Options'}>
              {matches.map((o, i) => (
                <li key={o.value} id={`${listId}-${i}`} role="option" aria-selected={i === at} className={styles.option} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(o)} onMouseMove={() => setActive(i)}>
                  <Marked text={o.label} query={typed ?? ''} />
                </li>
              ))}
            </ul>
          )}
          {open && !matches.length && <p className={`${styles.listbox} ${styles.empty}`} role="status">{emptyText}</p>}
        </span>
      )}
    </Field>
  );
}
