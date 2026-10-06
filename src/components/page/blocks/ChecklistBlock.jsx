import { useState } from 'react';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Checkbox from '../../kit/Checkbox';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * A list to tick through. Ticks are held in the page only: they are gone when
 * you leave, and nothing is stored or sent. The count is announced politely as it changes.
 *
 *   { type: 'checklist', items: [{ label, hint? }], done?: string (said when all are ticked),
 *     eyebrow?, title?, intro? }
 */
export function ChecklistBlock({ block, accent }) {
  const [ticked, setTicked] = useState(() => new Set());
  const total = block.items.length;
  const toggle = (label, on) => setTicked((prev) => {
    const next = new Set(prev);
    if (on) next.add(label); else next.delete(label);
    return next;
  });
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <Reveal as="ul" className={styles.checks} {...fx('checklist.items')}>
        {block.items.map((item) => (
          <li key={item.label} data-on={ticked.has(item.label) ? '' : undefined}>
            <Checkbox label={item.label} hint={item.hint} checked={ticked.has(item.label)} onChange={(on) => toggle(item.label, on)} />
          </li>
        ))}
      </Reveal>
      <div className={styles.progress}>
        <span role="status">{ticked.size} of {total} ticked{ticked.size === total && block.done ? ` · ${block.done}` : ''}</span>
        <progress max={total} value={ticked.size} aria-hidden="true" />
        <button type="button" onClick={() => setTicked(new Set())} disabled={ticked.size === 0}>Clear</button>
      </div>
    </Shell>
  );
}

export default ChecklistBlock;
