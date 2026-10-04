import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { ProgressRing } from '../fx/ProgressRing';
import { fx } from '../../utils/fx';
import styles from './BoundaryReview.module.css';

/**
 * A review aid. Work through the questions for a system you are building; the
 * ring and each group's bar fill as you answer. It does not assess any real
 * system and stores nothing — ticks live in this page only. "Copy open
 * questions" puts whatever is left on the clipboard.
 *
 *   groups: [{ label, items: [string] }]
 */
export default function BoundaryReview({ eyebrow, title, intro, groups, note }) {
  const all = useMemo(() => groups.flatMap((g, gi) => g.items.map((q, i) => ({ id: `${gi}-${i}`, q, group: g.label }))), [groups]);
  const [done, setDone] = useState(() => new Set());
  const [copied, setCopied] = useState('');

  const toggle = (id) => setDone((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const ratio = all.length ? done.size / all.length : 0;

  const copyOpen = async () => {
    const open = all.filter((a) => !done.has(a.id)).map((a) => `• ${a.q}`).join('\n');
    try {
      await navigator.clipboard.writeText(open || 'All questions considered.');
      setCopied('Copied');
    } catch {
      setCopied('Copy unavailable');
    }
    window.setTimeout(() => setCopied(''), 1800);
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.layout} {...fx('security.review-checklist')}>
        <aside className={styles.side}>
          <ProgressRing value={ratio} size={150} stroke={3.2} label={`${done.size} of ${all.length} questions considered`}>
            <span className={styles.big}>{done.size}<small>/{all.length}</small></span>
          </ProgressRing>
          <p className={styles.caption} role="status" aria-live="polite">
            {done.size === 0 ? 'Nothing considered yet.' : done.size === all.length ? 'Every question considered.' : `${all.length - done.size} still open.`}
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={copyOpen}><Copy size={13} aria-hidden="true" /> {copied || 'Copy open questions'}</button>
            <button type="button" onClick={() => setDone(new Set())} disabled={done.size === 0}>Reset</button>
          </div>
          {note && <p className={styles.note}>{note}</p>}
        </aside>

        <div className={styles.groups}>
          {groups.map((g, gi) => {
            const count = g.items.filter((_, i) => done.has(`${gi}-${i}`)).length;
            return (
              <fieldset key={g.label} className={styles.group}>
                <legend className={styles.legend}>
                  <span>{g.label}</span>
                  <span className={styles.groupBar} aria-hidden="true"><i style={{ transform: `scaleX(${count / g.items.length})` }} /></span>
                  <span className={styles.groupCount}>{count}/{g.items.length}</span>
                </legend>
                {g.items.map((q, i) => {
                  const id = `${gi}-${i}`;
                  const on = done.has(id);
                  return (
                    <label key={id} className={clsx(styles.item, on && styles.on)}>
                      <input type="checkbox" checked={on} onChange={() => toggle(id)} />
                      <span className={styles.box} aria-hidden="true"><Check size={13} strokeWidth={2.6} /></span>
                      <span className={styles.q}>{q}</span>
                    </label>
                  );
                })}
              </fieldset>
            );
          })}
        </div>
      </div>
    </div>
  );
}
