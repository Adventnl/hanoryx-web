import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Download, Plus, Trash2 } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './PreMortem.module.css';

const LIKELY = ['High', 'Medium', 'Low'];
const START = [
  { what: 'The person who knows how it works leaves.', likely: 'Medium', fix: 'Write the decision record now, and have a second person make a change this month.' },
  { what: 'It turns out to cost far more to run than we assumed.', likely: 'Medium', fix: 'Put a monthly cost figure on the dashboard, and an alert at twice the estimate.' },
  { what: 'The need that justified it quietly disappears.', likely: 'Low', fix: 'Set a date to ask “is this still the right thing?”, and write down what would count as a no.' },
];

/** The pre-mortem: imagine a year has passed and the decision turned out badly.
 *  What went wrong? Write the reasons, how likely each is, and what you would do
 *  about it now. The riskiest come out first, as a table. */
export default function PreMortem({ tag, title, lede, onward }) {
  const [rows, setRows] = useState(START);
  const [copied, copy] = useCopy();
  const set = (i, k) => (e) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)));
  const sorted = useMemo(() => [...rows].filter((r) => r.what.trim()).sort((a, b) => LIKELY.indexOf(a.likely) - LIKELY.indexOf(b.likely)), [rows]);
  const md = ['# Pre-mortem', '', 'It is a year later and this decision turned out badly. Why?', '', '| Likelihood | What went wrong | What we do now |', '| --- | --- | --- |', ...sorted.map((r) => `| ${r.likely} | ${r.what.trim()} | ${r.fix.trim() || '—'} |`), ''].join('\n');

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('premortem.rig')}>
        <ol className={styles.rows}>
          {rows.map((r, i) => (
            <li key={i} className={styles.row}>
              <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
              <label><span className={shared.label}>What went wrong</span><input value={r.what} onChange={set(i, 'what')} autoComplete="off" /></label>
              <label><span className={shared.label}>How likely</span>
                <select value={r.likely} onChange={set(i, 'likely')}>{LIKELY.map((l) => <option key={l}>{l}</option>)}</select>
              </label>
              <label className={styles.wide}><span className={shared.label}>What we do about it now</span><input value={r.fix} onChange={set(i, 'fix')} autoComplete="off" /></label>
              <button type="button" className={styles.drop} onClick={() => setRows((x) => x.filter((_, j) => j !== i))} aria-label={`Remove reason ${i + 1}`}><Trash2 size={14} aria-hidden="true" /></button>
            </li>
          ))}
          <li><button type="button" className={shared.btn} onClick={() => setRows((r) => (r.length < 8 ? [...r, { what: '', likely: 'Medium', fix: '' }] : r))} disabled={rows.length >= 8}><Plus size={14} aria-hidden="true" /> Add a reason</button></li>
        </ol>

        <div className={styles.out}>
          <p className={shared.label}>Riskiest first</p>
          <table>
            <thead><tr><th scope="col">Likelihood</th><th scope="col">What went wrong</th><th scope="col">What we do now</th></tr></thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={`${i}-${r.what}`}><td><i className={clsx(styles.dot, styles[r.likely])} aria-hidden="true" />{r.likely}</td><td>{r.what}</td><td>{r.fix || '—'}</td></tr>
              ))}
            </tbody>
          </table>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('pre-mortem.md', md, 'text/markdown')} disabled={!sorted.length}><Download size={14} aria-hidden="true" /> Download</button>
            <button type="button" className={shared.btn} onClick={() => copy(md)} disabled={!sorted.length}>{copied ? 'Copied' : 'Copy as Markdown'}</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
