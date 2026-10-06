import { useMemo } from 'react';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import DataTable from '../../kit/DataTable';
import { Reveal } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * A table of records, written as a header row and rows of cells. With `sortable`
 * every column can be sorted from its header; wide tables scroll inside a named,
 * focusable region instead of breaking the page.
 *
 *   { type: 'table', caption, head: [string], rows: [[string]], sortable?, align?: ['left'|'right'], note?,
 *     eyebrow?, title?, intro? }
 */
export function TableBlock({ block, accent }) {
  const columns = useMemo(
    () => block.head.map((label, i) => ({ key: `c${i}`, label, sortable: Boolean(block.sortable), align: block.align?.[i] === 'right' ? 'right' : undefined })),
    [block.head, block.sortable, block.align],
  );
  const rows = useMemo(
    () => block.rows.map((row, r) => Object.fromEntries([['id', String(r)], ...row.map((cell, i) => [`c${i}`, cell])])),
    [block.rows],
  );
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <Reveal className={styles.wide} {...fx('table.records')}>
        <DataTable caption={block.caption || block.title} columns={columns} rows={rows} />
      </Reveal>
      {block.note && <p className={styles.note}>{block.note}</p>}
    </Shell>
  );
}

export default TableBlock;
