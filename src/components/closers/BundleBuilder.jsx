import { useState } from 'react';
import clsx from 'clsx';
import { Download, Package } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { downloads } from '../../data/resources';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './BundleBuilder.module.css';

const LANG = { 'text/markdown': 'markdown', 'application/json': 'json', 'text/csv': 'csv', 'text/css': 'css', 'text/plain': 'text' };
const size = (n) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);

/** Choose several of the downloadable documents and have them joined into one
 *  Markdown file with a contents list — built here, in the page, when you press
 *  the button. A pack for a new project, a new teammate, or a handover. */
export default function BundleBuilder({ tag, title, lede, presets = [], onward }) {
  const [picked, setPicked] = useState(() => new Set(['runbook', 'readme', 'decision']));
  const [made, setMade] = useState(null);
  const [busy, setBusy] = useState(false);
  const chosen = downloads.filter((d) => picked.has(d.id));

  const toggle = (id) => { setMade(null); setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const preset = (ids) => { setMade(null); setPicked(new Set(ids)); };

  const build = async () => {
    setBusy(true);
    try {
      const parts = [];
      for (const d of chosen) parts.push({ d, text: await d.build() });
      const text = [
        '# Document bundle',
        '',
        `${parts.length} document${parts.length === 1 ? '' : 's'}, joined in your browser.`,
        '',
        '## Contents',
        ...parts.map((p, i) => `${i + 1}. ${p.d.title} (${p.d.file})`),
        '',
        ...parts.flatMap((p, i) => ['---', '', `## ${i + 1}. ${p.d.title}`, `_${p.d.file}_`, '', `\`\`\`\`${LANG[p.d.mime] || 'text'}`, p.text.replace(/\n+$/, ''), '````', '']),
      ].join('\n');
      setMade({ text, bytes: new Blob([text]).size, count: parts.length });
    } finally {
      setBusy(false);
    }
  };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('bundle.rig')}>
        <div className={styles.pick}>
          <div className={styles.presets} role="group" aria-label="Start from a preset">
            {presets.map((p) => <button key={p.label} type="button" className={shared.btn} onClick={() => preset(p.ids)}>{p.label}</button>)}
          </div>
          <ul>
            {downloads.map((d) => (
              <li key={d.id}>
                <label className={clsx(styles.row, picked.has(d.id) && styles.on)}>
                  <input type="checkbox" checked={picked.has(d.id)} onChange={() => toggle(d.id)} />
                  <span className={styles.box} aria-hidden="true" />
                  <span className={styles.name}>{d.title}</span>
                  <code>{d.file}</code>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.out}>
          <p className={shared.label}>The bundle</p>
          <p className={styles.sum}><b>{chosen.length}</b> of {downloads.length} documents</p>
          <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={build} disabled={!chosen.length || busy}><Package size={14} aria-hidden="true" /> {busy ? 'Joining…' : 'Join them'}</button>
          {made && (
            <>
              <pre tabIndex={0} aria-label="Start of the bundle"><code>{made.text.split('\n').slice(0, 14).join('\n')}{'\n…'}</code></pre>
              <div className={shared.row}>
                <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('document-bundle.md', made.text, 'text/markdown')}><Download size={14} aria-hidden="true" /> Download · {size(made.bytes)}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </CloserFrame>
  );
}
