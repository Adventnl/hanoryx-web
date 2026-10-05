import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight, Download, Eye, EyeOff } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { downloadText } from '../../utils/clipboard';
import { downloads } from '../../data/resources';
import { fx } from '../../utils/fx';
import styles from './DownloadShelf.module.css';

const size = (n) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);

/** Twelve documents you can keep. Each is generated in your browser when you
 *  press the button — nothing is fetched — so the ones built from the site's own
 *  data (the glossary, the page list) are always in step with it. */
export default function DownloadShelf({ eyebrow, title, intro, note }) {
  const [area, setArea] = useState('All');
  const [built, setBuilt] = useState({});
  const [busy, setBusy] = useState(null);
  const [peek, setPeek] = useState(null);
  const areas = ['All', ...new Set(downloads.map((d) => d.area))];
  const shown = downloads.filter((d) => area === 'All' || d.area === area);

  const make = async (d) => {
    setBusy(d.id);
    try {
      const text = await d.build();
      setBuilt((b) => ({ ...b, [d.id]: { text, bytes: new Blob([text]).size } }));
      return text;
    } catch {
      setBuilt((b) => ({ ...b, [d.id]: { error: true } }));
      return null;
    } finally {
      setBusy(null);
    }
  };
  const save = async (d) => {
    const text = built[d.id]?.text ?? (await make(d));
    if (text) downloadText(d.file, text, d.mime);
  };
  const preview = async (d) => {
    if (peek === d.id) { setPeek(null); return; }
    if (!built[d.id]) await make(d);
    setPeek(d.id);
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('downloads.shelf')}>
        <div className={styles.chips} role="group" aria-label="Kind of document">
          {areas.map((a) => <button key={a} type="button" className={clsx(styles.chip, area === a && styles.on)} aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>)}
        </div>
        <ul className={styles.grid}>
          {shown.map((d) => {
            const b = built[d.id];
            return (
              <li key={d.id} className={clsx(styles.card, peek === d.id && styles.open)} {...fx('downloads.card')}>
                <div className={styles.head}>
                  <span className={styles.area}>{d.area}</span>
                  <code className={styles.file}>{d.file}</code>
                </div>
                <h3>{d.title}</h3>
                <p>{d.blurb}</p>
                {peek === d.id && b?.text && <pre className={styles.peek} tabIndex={0}><code>{b.text.split('\n').slice(0, 16).join('\n')}{b.text.split('\n').length > 16 ? '\n…' : ''}</code></pre>}
                {b?.error && <p className={styles.err} role="alert">That file could not be built.</p>}
                <div className={styles.actions}>
                  <button type="button" className={styles.get} onClick={() => save(d)} disabled={busy === d.id}><Download size={13} aria-hidden="true" /> {busy === d.id ? 'Building…' : 'Download'}</button>
                  <button type="button" className={styles.ghost} onClick={() => preview(d)} aria-expanded={peek === d.id}>{peek === d.id ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />} {peek === d.id ? 'Hide' : 'Preview'}</button>
                  {b?.bytes ? <span className={styles.size}>{size(b.bytes)}</span> : null}
                  <Link to={d.see} className={styles.see} data-cursor="link" aria-label={`Related page for ${d.title}`}><ArrowUpRight size={14} aria-hidden="true" /></Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
