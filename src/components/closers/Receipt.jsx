import { useCallback, useEffect, useState } from 'react';
import { Copy, Printer } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { readFootprint, isOwnKey } from '../../utils/footprint';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import styles from './Receipt.module.css';

const count = (list) => (list === null ? 'blocked' : String(list.length));

function lines(fp, path) {
  const own = fp.session?.filter(isOwnKey) ?? [];
  const rows = [
    ['PAGE', path],
    ['---'],
    ['Cookies set by the site', count(fp.cookies)],
    ['Local storage items', count(fp.local)],
    ['Session storage items', count(fp.session)],
    ...own.map((k) => [`  ${k}`, '1']),
    ['---'],
    ['Accounts', '0'],
    ['Analytics scripts', '0'],
    ['Forms sent to a server', '0'],
    ['---'],
    ['Hosts this tab has contacted', String(fp.hosts.length)],
    ...fp.hosts.map((h) => [`  ${h}`, '']),
    ['---'],
    ['PERSONAL DATA COLLECTED BY THE SITE’S CODE', '0'],
  ];
  return rows;
}

/** An itemised receipt of what the site holds for this visitor, read live from
 *  the browser and "printed" line by line. Copy it as text or print it again. */
export default function Receipt({ tag, title, lede, onward }) {
  const [fp, setFp] = useState(null);
  const [run, setRun] = useState(0);
  const [copied, copy] = useCopy();

  const read = useCallback(() => {
    setFp(readFootprint());
    setRun((n) => n + 1);
  }, []);
  useEffect(() => {
    const id = window.setTimeout(read, 0);
    return () => window.clearTimeout(id);
  }, [read]);

  const rows = fp ? lines(fp, window.location.pathname) : [];
  const plain = fp ? ['HANORYX SYSTEMS — PRIVACY RECEIPT', ...rows.map((r) => (r[0] === '---' ? '----------------------------------------' : `${r[0]}${r[1] ? `  ${r[1]}` : ''}`))].join('\n') : '';

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.stage} {...fx('receipt.stage')}>
        <div className={styles.paper} {...fx('receipt.paper')}>
          <p className={styles.brand}>HANORYX SYSTEMS</p>
          <p className={styles.sub}>PRIVACY RECEIPT</p>
          <ul key={run} className={styles.lines} aria-label="Receipt lines">
            {rows.map((r, i) =>
              r[0] === '---' ? (
                <li key={i} className={styles.sep} style={{ '--i': i }} aria-hidden="true" />
              ) : (
                <li key={i} className={styles.line} style={{ '--i': i }} data-total={r[0].startsWith('PERSONAL') || undefined}>
                  <span>{r[0]}</span>
                  <b>{r[1]}</b>
                </li>
              )
            )}
          </ul>
          <p className={styles.thanks}>NOTHING ON THIS RECEIPT WAS SENT ANYWHERE.</p>
          <span className={styles.teeth} aria-hidden="true" />
        </div>
        <div className={styles.actions}>
          <p>Read from this tab just now: the cookie jar, both storages and the browser’s own list of requests.</p>
          <div>
            <button type="button" onClick={read} {...fx('receipt.reprint')}><Printer size={14} aria-hidden="true" /> Print again</button>
            <button type="button" onClick={() => copy(plain)} disabled={!fp}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy as text'}</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
