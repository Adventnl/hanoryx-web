import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './HostScan.module.css';

function scan() {
  const by = new Map();
  try {
    performance.getEntriesByType('resource').forEach((e) => {
      let host;
      try { host = new URL(e.name).host; } catch { return; }
      if (!host) return;
      const row = by.get(host) || { host, requests: 0, bytes: 0 };
      row.requests += 1;
      row.bytes += e.transferSize || 0;
      by.set(host, row);
    });
  } catch { /* no Performance API */ }
  if (!by.has(window.location.host)) by.set(window.location.host, { host: window.location.host, requests: 0, bytes: 0 });
  return [...by.values()].sort((a, b) => b.requests - a.requests);
}

const kb = (n) => (n ? (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} kB`) : 'not reported');

/** "Where has this tab been?" — read from the browser's own list of requests,
 *  grouped by host, each one matched against the hosts this site says it uses. */
export default function HostScan({ tag, title, lede, expected = {}, onward }) {
  const [rows, setRows] = useState(null);
  const [run, setRun] = useState(0);
  const read = useCallback(() => { setRows(scan()); setRun((n) => n + 1); }, []);
  useEffect(() => {
    const id = window.setTimeout(read, 0);
    return () => window.clearTimeout(id);
  }, [read]);
  const max = rows ? Math.max(1, ...rows.map((r) => r.requests)) : 1;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.head}>
        <button type="button" className={shared.btn} onClick={read}><RefreshCw size={14} aria-hidden="true" /> Scan again</button>
        <p className={styles.sum} role="status" aria-live="polite">{rows ? `${rows.length} ${rows.length === 1 ? 'host' : 'hosts'} contacted by this tab` : 'Scanning…'}</p>
      </div>
      <ul key={run} className={styles.list} {...fx('hostscan.rows')}>
        {(rows || []).map((r, i) => {
          const known = r.host === window.location.host ? 'This site’s own host' : expected[r.host];
          return (
            <li key={r.host} className={clsx(styles.row, !known && styles.unknown)} style={{ '--i': i }}>
              <code>{r.host}</code>
              <span className={styles.bar} aria-hidden="true"><i style={{ width: `${(r.requests / max) * 100}%` }} /></span>
              <span className={styles.n}>{r.requests} {r.requests === 1 ? 'request' : 'requests'} · {kb(r.bytes)}</span>
              <span className={styles.why}>{known || 'Not on the list of hosts this site expects. Worth a look.'}</span>
            </li>
          );
        })}
      </ul>
    </CloserFrame>
  );
}
