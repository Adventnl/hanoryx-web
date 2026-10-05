import { Suspense, useMemo, useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { CodeBlock, DataTable, DescriptionList, SearchField, Segmented, Spinner, Tabs, ToastProvider } from '../kit';
import { demoRegistry } from '../kit/demos/registry';
import { fx } from '../../utils/fx';
import styles from './ComponentGallery.module.css';

const WIDTHS = [{ value: 'full', label: 'Full width' }, { value: 'phone', label: 'Phone, 360' }];

/* “type · default · what it does” → three columns. */
const propRow = (p) => {
  const [type = '', def = '', ...rest] = p.v.split(' · ');
  return { name: p.k, type, def, what: rest.join(' · ') };
};

const startId = (items) => {
  const hash = typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.slice(1)) : '';
  return items.some((i) => i.id === hash) ? hash : items[0]?.id;
};

/**
 * A family of interface components, each shown live. Pick one from the list (or
 * arrive with its name in the address); see it working, narrowed to a phone if you
 * like, then read how to use it, its props, the keys it answers to and what to
 * know about it. The gallery is itself built from the kit it documents.
 *
 *   items: [{ id, name, summary, demo, code, props, keys, notes }]   (data/kit.js)
 */
export default function ComponentGallery({ eyebrow, title, intro, items = [], note }) {
  const [id, setId] = useState(() => startId(items));
  const [q, setQ] = useState('');
  const [width, setWidth] = useState('full');
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return needle ? items.filter((i) => `${i.name} ${i.summary}`.toLowerCase().includes(needle)) : items;
  }, [items, q]);
  const item = items.find((i) => i.id === id) || items[0];
  const Demo = item ? demoRegistry[item.demo] : null;

  const choose = (next) => {
    setId(next);
    try { window.history.replaceState(null, '', `#${next}`); } catch { /* the address is a nicety */ }
  };

  const tabs = item ? [
    { id: 'usage', label: 'Usage', content: <CodeBlock code={item.code} language="jsx" filename={`${item.name}.jsx`} /> },
    { id: 'props', label: 'Props', content: <DataTable caption={`${item.name} props`} rows={item.props.map(propRow)} rowKey="name" columns={[{ key: 'name', label: 'Prop' }, { key: 'type', label: 'Type' }, { key: 'def', label: 'Default' }, { key: 'what', label: 'What it does' }]} /> },
    { id: 'keys', label: 'Keyboard', content: <DescriptionList className={styles.keys} items={item.keys.map((k) => ({ term: k.k, detail: k.v }))} /> },
    { id: 'notes', label: 'Notes', content: <ul className={styles.notes}>{item.notes.map((n) => <li key={n}>{n}</li>)}</ul> },
  ] : [];

  return (
    <ToastProvider>
      <div>
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
        <div className={styles.rig} {...fx('gallery.rig')}>
          <nav className={styles.list} aria-label="Components" {...fx('gallery.list')}>
            <SearchField label="Find one" value={q} onChange={setQ} count={shown.length} noun="components" placeholder="Name or purpose" />
            <ul className={styles.names}>
              {shown.map((i) => (
                <li key={i.id}>
                  <button type="button" className={styles.name} aria-pressed={i.id === item?.id} onClick={() => choose(i.id)}>
                    <span>{i.name}</span>
                  </button>
                </li>
              ))}
              {!shown.length && <li className={styles.none}>Nothing matches. Clear the search to see all {items.length}.</li>}
            </ul>
          </nav>

          {item && (
            <section className={styles.stage} aria-labelledby={`gal-${item.id}`} {...fx('gallery.stage')}>
              <div className={styles.head}>
                <h3 id={`gal-${item.id}`}>{item.name}<span>{items.indexOf(item) + 1} of {items.length}</span></h3>
                <p>{item.summary}</p>
              </div>
              <div className={styles.bar}>
                <span className={styles.barLabel}>Live example</span>
                <Segmented label="Preview width" options={WIDTHS} value={width} onChange={setWidth} />
              </div>
              <div className={styles.preview} {...fx('gallery.preview')}>
                <div style={{ '--w': width === 'phone' ? '360px' : 'none' }} key={item.id}>
                  <Suspense fallback={<Spinner label="Loading the example" />}>{Demo && <Demo />}</Suspense>
                </div>
              </div>
              <Tabs key={item.id} className={styles.tabs} label={`About ${item.name}`} tabs={tabs} />
            </section>
          )}
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </ToastProvider>
  );
}
