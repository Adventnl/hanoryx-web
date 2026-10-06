import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { licences, fontLicences } from '../../data/licences';
import { fx } from '../../utils/fx';
import styles from './LicenceTable.module.css';

const ALL = [...licences, ...fontLicences];
const KINDS = [['all', 'Everything'], ['runtime', 'In the site'], ['build', 'Build & test'], ['font', 'Typefaces']];
const KIND_LABEL = { runtime: 'In the site', build: 'Build & test', font: 'Typeface' };

/**
 * Every library and typeface the site is built with, its version and its
 * licence, as published by the packages themselves. Filter, search, sort — and
 * see at a glance which licences make up the whole.
 */
export default function LicenceTable({ eyebrow, title, intro, note }) {
  const [kind, setKind] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ by: 'name', dir: 1 });

  const rows = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    return ALL.filter((r) => (kind === 'all' || r.kind === kind) && tokens.every((t) => `${r.name} ${r.licence} ${r.role}`.toLowerCase().includes(t))).sort((a, b) => String(a[sort.by] ?? '').localeCompare(String(b[sort.by] ?? '')) * sort.dir);
  }, [kind, query, sort]);

  const mix = useMemo(() => {
    const counts = new Map();
    ALL.forEach((r) => counts.set(r.licence, (counts.get(r.licence) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const toggle = (by) => setSort((s) => (s.by === by ? { by, dir: -s.dir } : { by, dir: 1 }));
  const head = (by, label) => (
    <th scope="col" aria-sort={sort.by === by ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => toggle(by)}>
        {label}
        {sort.by === by && (sort.dir === 1 ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />)}
      </button>
    </th>
  );

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('licences.table')}>
        <div className={styles.mix} role="img" aria-label={mix.map(([l, n]) => `${n} ${l}`).join(', ')} {...fx('licences.mix-bar')}>
          {mix.map(([l, n], i) => (
            <span key={l} className={styles.seg} style={{ flexGrow: n, '--i': i }} title={`${l}: ${n}`}>
              <b>{n}</b>
              <i>{l}</i>
            </span>
          ))}
        </div>
        <div className={styles.top}>
          <label className={styles.search} {...fx('licences.live-filter')}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Filter the list</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by name, licence or purpose…" spellCheck={false} autoComplete="off" />
            <span className={styles.count} aria-live="polite">{rows.length} / {ALL.length}</span>
          </label>
          <div className={styles.chips} role="group" aria-label="Kind">
            {KINDS.map(([v, l]) => (
              <button key={v} type="button" className={clsx(styles.chip, kind === v && styles.on)} aria-pressed={kind === v} onClick={() => setKind(v)}>{l}</button>
            ))}
          </div>
        </div>
        <div className={styles.wrap} role="region" aria-label="Licences" tabIndex={0}>
          <table className={styles.table}>
            <thead>
              <tr>{head('name', 'Name')}{head('version', 'Version')}{head('licence', 'Licence')}<th scope="col">What it is for</th>{head('kind', 'Where')}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <th scope="row">{r.name}</th>
                  <td className={styles.mono}>{r.version || '—'}</td>
                  <td className={styles.mono}>{r.licence}</td>
                  <td>{r.role}</td>
                  <td><span className={styles.kind}>{KIND_LABEL[r.kind]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
