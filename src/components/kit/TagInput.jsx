import { useState } from 'react';
import { X } from 'lucide-react';
import Field from './Field';
import { useControllable } from './useControllable';
import styles from './inputs.module.css';

/**
 * Type a word, press Enter (or a comma) and it becomes a tag; Backspace on an
 * empty box takes the last one back. Each tag has its own remove button, and
 * adding or removing is announced. Duplicates are ignored; `max` caps the list.
 */
export default function TagInput({ label, hint, value, defaultValue = [], onChange, max = 8, placeholder = 'Add a tag…', className, disabled }) {
  const [tags, setTags] = useControllable({ value, defaultValue, onChange });
  const [draft, setDraft] = useState('');
  const [said, setSaid] = useState('');

  const add = (raw) => {
    const word = raw.trim().replace(/,+$/, '');
    if (!word) return;
    if (tags.some((t) => t.toLowerCase() === word.toLowerCase())) { setSaid(`${word} is already there.`); setDraft(''); return; }
    if (tags.length >= max) { setSaid(`Up to ${max} tags.`); return; }
    setTags([...tags, word]);
    setSaid(`Added ${word}.`);
    setDraft('');
  };
  const remove = (word) => { setTags(tags.filter((t) => t !== word)); setSaid(`Removed ${word}.`); };

  return (
    <Field label={label} hint={hint} className={className}>
      {(a11y) => (
        <>
          <span className={styles.group} data-disabled={disabled ? '' : undefined}>
            <span className={styles.tags}>
              {tags.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                  <button type="button" className={styles.tagX} onClick={() => remove(t)} aria-label={`Remove ${t}`} disabled={disabled}><X size={12} aria-hidden="true" /></button>
                </span>
              ))}
              <input
                {...a11y}
                className={styles.tagInput}
                value={draft}
                placeholder={tags.length >= max ? '' : placeholder}
                disabled={disabled || tags.length >= max}
                autoComplete="off"
                onChange={(e) => (e.target.value.endsWith(',') ? add(e.target.value) : setDraft(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); add(draft); }
                  else if (e.key === 'Backspace' && !draft && tags.length) remove(tags[tags.length - 1]);
                }}
                onBlur={() => add(draft)}
              />
            </span>
          </span>
          <span className="sr-only" role="status">{said}</span>
        </>
      )}
    </Field>
  );
}
