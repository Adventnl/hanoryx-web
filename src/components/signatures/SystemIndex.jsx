import { useMemo } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { HoverIndex } from '../fx/HoverIndex';
import { Glyph } from '../fx/Glyph';
import { fx } from '../../utils/fx';
import styles from './SystemIndex.module.css';

/**
 * A typographic index of the system areas: large rows, a red rule that follows
 * the pointer from row to row, and a floating preview card that trails the
 * cursor (fine pointers only — on touch every row simply shows its own detail).
 *
 *   items: [{ id, code, title, summary, tags, glyph, to }]
 */
export default function SystemIndex({ eyebrow, title, intro, items }) {
  const rows = useMemo(
    () =>
      items.map((it) => ({
        id: it.id,
        title: it.title,
        detail: it.summary,
        meta: it.code,
        to: it.to,
        preview: (
          <div className={styles.preview}>
            <Glyph name={it.glyph} size={54} className={styles.glyph} />
            <span className={styles.previewCode}>{it.code}</span>
            <span className={styles.previewTags}>{it.tags.join(' · ')}</span>
          </div>
        ),
      })),
    [items]
  );
  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.index} {...fx('systems.hover-index')}>
        <HoverIndex items={rows} />
      </div>
    </div>
  );
}
