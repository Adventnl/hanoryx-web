import { useState } from 'react';
import clsx from 'clsx';
import { Check, Play, X } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { readFootprint, isOwnKey } from '../../utils/footprint';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './SelfAudit.module.css';

/* Each check inspects this very page, in your browser, and reports. */
const CHECKS = [
  {
    id: 'cookies',
    title: 'Does the site set any cookies?',
    how: 'Reads the cookie jar for this site.',
    run: () => {
      const fp = readFootprint();
      return fp.cookies === null ? { pass: false, text: 'Your browser would not let the page read cookies.' } : { pass: fp.cookies.length === 0, text: `${fp.cookies.length} cookies are set for this site.` };
    },
  },
  {
    id: 'scripts',
    title: 'Does any script come from another origin?',
    how: 'Lists every <script> on the page and compares its origin with the site’s.',
    run: () => {
      const foreign = [...document.scripts].map((s) => s.src).filter(Boolean).filter((src) => new URL(src).origin !== window.location.origin);
      return { pass: foreign.length === 0, text: foreign.length ? `${foreign.length} from elsewhere: ${foreign.join(', ')}` : 'Every script on the page was served by the site itself.' };
    },
  },
  {
    id: 'hosts',
    title: 'Which hosts has this tab talked to?',
    how: 'Reads the browser’s own list of requests made by this tab.',
    run: () => {
      const { hosts } = readFootprint();
      const odd = hosts.filter((h) => h !== window.location.host && !/^fonts\.(googleapis|gstatic)\.com$/.test(h));
      return { pass: odd.length === 0, text: `${hosts.join(', ')}${odd.length ? ` — not expected: ${odd.join(', ')}` : ''}` };
    },
  },
  {
    id: 'storage',
    title: 'What is in local and session storage?',
    how: 'Counts the keys, and checks that all of them are this site’s own.',
    run: () => {
      const fp = readFootprint();
      const keys = [...(fp.local || []), ...(fp.session || [])];
      return { pass: (fp.local || []).length === 0 && keys.every(isOwnKey), text: `${keys.length} item${keys.length === 1 ? '' : 's'}${keys.length ? `: ${keys.join(', ')}` : ''}. Local storage holds ${(fp.local || []).length}.` };
    },
  },
];

/** Four checks you run yourself, on this page, in your browser. Each says what
 *  it will look at, then what it found — so "trust us" becomes "look". */
export default function SelfAudit({ tag, title, lede, onward }) {
  const [results, setResults] = useState({});
  const run = (c) => setResults((r) => ({ ...r, [c.id]: c.run() }));
  const runAll = () => setResults(Object.fromEntries(CHECKS.map((c) => [c.id, c.run()])));
  const done = Object.keys(results).length;
  const passed = Object.values(results).filter((r) => r.pass).length;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.head} {...fx('audit.run-all')}>
        <button type="button" className={clsx(shared.btn, shared.btnRed)} onClick={runAll}><Play size={14} aria-hidden="true" /> Run all four</button>
        <p className={styles.tally} role="status" aria-live="polite">{done === 0 ? 'Nothing has been run yet.' : `${passed} of ${done} checks came out as the site says.`}</p>
      </div>
      <ol className={styles.list}>
        {CHECKS.map((c, i) => {
          const r = results[c.id];
          return (
            <li key={c.id} className={clsx(styles.item, r && (r.pass ? styles.pass : styles.fail))} {...fx('audit.check')}>
              <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.body}>
                <h3>{c.title}</h3>
                <p className={styles.how}>{c.how}</p>
                {r && <p className={styles.out} role="status">{r.pass ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}<span>{r.text}</span></p>}
              </div>
              <button type="button" className={shared.btn} onClick={() => run(c)}>{r ? 'Run again' : 'Run'}</button>
            </li>
          );
        })}
      </ol>
    </CloserFrame>
  );
}
