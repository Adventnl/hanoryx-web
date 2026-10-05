import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import Checkbox from './Checkbox';
import styles from './data.module.css';

const compare = (a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true, sensitivity: 'base' }));

/**
 * A table you can sort and select from. A sortable column's header is a button
 * and the `th` carries `aria-sort`; the first press sorts ascending, the second
 * descending, the third restores the original order. The table scrolls sideways
 * inside a focusable region on a narrow screen rather than breaking the page.
 *
 *   columns: [{ key, label, sortable?, align?: 'right', render?: (row) => node, value?: (row) => sortable }]
 */
export default function DataTable({ caption, columns = [], rows = [], rowKey = 'id', selectable = false, onSelect, maxHeight, emptyText = 'No rows.', className }) {
  const [sort, setSort] = useState({ key: null, dir: 'none' });
  const [picked, setPicked] = useState(() => new Set());

  const sorted = useMemo(() => {
    if (!sort.key || sort.dir === 'none') return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = col?.value || ((r) => r[sort.key]);
    const out = [...rows].sort((a, b) => compare(get(a), get(b)));
    return sort.dir === 'descending' ? out.reverse() : out;
  }, [rows, columns, sort]);

  const cycle = (key) => setSort((s) => {
    if (s.key !== key) return { key, dir: 'ascending' };
    return { key, dir: s.dir === 'ascending' ? 'descending' : s.dir === 'descending' ? 'none' : 'ascending' };
  });
  const commit = (next) => { setPicked(next); onSelect?.([...next]); };
  const toggle = (id) => { const n = new Set(picked); if (n.has(id)) n.delete(id); else n.add(id); commit(n); };
  const all = rows.length > 0 && rows.every((r) => picked.has(r[rowKey]));
  const some = !all && rows.some((r) => picked.has(r[rowKey]));

  return (
    <div className={`${styles.tableWrap} ${className || ''}`} role="region" aria-label={caption || 'Table'} tabIndex={0} style={maxHeight ? { maxHeight } : undefined}>
      <table className={styles.table}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {selectable && (
              <th scope="col" className={styles.pick}>
                <Checkbox label={<span className="sr-only">Select all rows</span>} checked={all} indeterminate={some} onChange={(on) => commit(on ? new Set(rows.map((r) => r[rowKey])) : new Set())} />
              </th>
            )}
            {columns.map((c) => {
              const dir = sort.key === c.key ? sort.dir : 'none';
              return (
                <th key={c.key} scope="col" data-align={c.align} aria-sort={c.sortable ? dir : undefined}>
                  {c.sortable ? (
                    <button type="button" className={styles.sort} onClick={() => cycle(c.key)}>
                      {c.label}
                      {dir === 'ascending' ? <ArrowUp size={12} aria-hidden="true" /> : dir === 'descending' ? <ArrowDown size={12} aria-hidden="true" /> : <ChevronsUpDown size={12} aria-hidden="true" />}
                    </button>
                  ) : c.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r[rowKey]} data-selected={picked.has(r[rowKey]) ? '' : undefined}>
              {selectable && (
                <td className={styles.pick}>
                  <Checkbox label={<span className="sr-only">Select {String(r[columns[0]?.key] ?? r[rowKey])}</span>} checked={picked.has(r[rowKey])} onChange={() => toggle(r[rowKey])} />
                </td>
              )}
              {columns.map((c) => <td key={c.key} data-align={c.align}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
          {!sorted.length && <tr><td colSpan={columns.length + (selectable ? 1 : 0)}>{emptyText}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
