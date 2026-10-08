import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Download } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { usePageCatalog } from '../../hooks/usePageCatalog';
import { CatalogError } from '../ui/CatalogError';
import { routePath } from '../../app/routeConfig';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './ReadingList.module.css';

const WPM = 220;
const SECTIONS = { insights: 'Insights', resources: 'Resources', north: 'Development', engineering: 'Development', lab: 'Development', company: 'Company', trust: 'Trust', legal: 'Legal', systems: 'Systems', work: 'Work' };
const SKIP = new Set(['home', 'contact', 'sitemap']);

/** Build a reading list from the pages of this site: tick what to read, or start
 *  from a preset; the list comes out as Markdown with the links and an honest
 *  estimate of the time, ready to send to someone. */
export default function ReadingList({ tag, title, lede, presets = [], onward }) {
  const { catalog: pages, error, retry } = usePageCatalog();
  const [picked, setPicked] = useState(() => new Set());
  const [copied, copy] = useCopy();

  const groups = useMemo(() => {
    if (!pages) return [];
    const by = {};
    Object.values(pages).filter((p) => !SKIP.has(p.key)).forEach((p) => {
      const section = SECTIONS[p.key.split('/')[0]] || 'Other';
      (by[section] ||= []).push({ key: p.key, title: p.title, path: routePath(p.key), minutes: Math.max(1, Math.round(p.words / WPM)) });
    });
    return Object.entries(by).map(([name, items]) => ({ name, items: items.sort((a, b) => a.path.localeCompare(b.path)) }));
  }, [pages]);

  const flat = groups.flatMap((g) => g.items);
  const chosen = flat.filter((i) => picked.has(i.key));
  const total = chosen.reduce((n, i) => n + i.minutes, 0);
  const toggle = (key) => setPicked((s) => { const n = new Set(s); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  const md = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return ['# Reading list', '', `${chosen.length} pages, about ${total} minutes in all.`, '', ...chosen.map((i) => `- [${i.title}](${origin}${i.path}) — about ${i.minutes} min`), ''].join('\n');
  }, [chosen, total]);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('readinglist.rig')}>
        <div className={styles.pick}>
          <div className={styles.presets} role="group" aria-label="Start from a preset">
            {presets.map((p) => <button key={p.label} type="button" className={shared.btn} onClick={() => setPicked(new Set(p.keys.filter((k) => flat.some((i) => i.key === k))))}>{p.label}</button>)}
            <button type="button" className={shared.btn} onClick={() => setPicked(new Set())} disabled={!picked.size}>Clear</button>
          </div>
          {error ? <CatalogError retry={retry} /> : !pages && <p className={styles.wait}>Loading the page list…</p>}
          {groups.map((g) => {
            const n = g.items.filter((i) => picked.has(i.key)).length;
            return (
              <details key={g.name} className={styles.group} open={n > 0 || undefined}>
                <summary><span>{g.name}</span><i>{n ? `${n} chosen` : `${g.items.length} pages`}</i></summary>
                <ul>
                  {g.items.map((i) => (
                    <li key={i.key}>
                      <label className={clsx(styles.row, picked.has(i.key) && styles.on)}>
                        <input type="checkbox" checked={picked.has(i.key)} onChange={() => toggle(i.key)} />
                        <span className={styles.box} aria-hidden="true" />
                        <span className={styles.name}>{i.title}</span>
                        <span className={styles.min}>{i.minutes} min</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
        <div className={styles.out}>
          <p className={shared.label}>Your list</p>
          <p className={styles.total}><b>{chosen.length}</b> pages · about <b>{total}</b> min</p>
          <pre tabIndex={0} aria-label="The list as Markdown"><code>{chosen.length ? md : 'Choose a preset, or tick pages on the left.'}</code></pre>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('reading-list.md', md, 'text/markdown')} disabled={!chosen.length}><Download size={14} aria-hidden="true" /> Download</button>
            <button type="button" className={shared.btn} onClick={() => copy(md)} disabled={!chosen.length}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <p className={styles.fine}>Times count every word on a page at about 220 a minute, interactive parts included. Treat them as a guide.</p>
        </div>
      </div>
    </CloserFrame>
  );
}
