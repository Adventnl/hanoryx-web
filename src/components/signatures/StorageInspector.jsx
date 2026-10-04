import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Eraser, RefreshCw } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { ProgressRing } from '../fx/ProgressRing';
import { useOnScreen } from '../../hooks/useOnScreen';
import { fx } from '../../utils/fx';
import styles from './StorageInspector.module.css';

const PREFIX = 'hnx.';

function readStore(store) {
  try {
    return Array.from({ length: store.length }, (_, i) => {
      const key = store.key(i);
      return { key, value: store.getItem(key) ?? '' };
    });
  } catch {
    return null; // storage blocked or unavailable
  }
}
function readCookies() {
  try {
    return document.cookie ? document.cookie.split(';').map((c) => c.trim()).filter(Boolean).map((c) => ({ key: c.split('=')[0], value: c.slice(c.indexOf('=') + 1) })) : [];
  } catch {
    return null;
  }
}
function snapshot() {
  return { cookies: readCookies(), local: readStore(window.localStorage), session: readStore(window.sessionStorage) };
}

function Group({ title, where, rows, known, emptyText }) {
  return (
    <section className={styles.group} aria-label={title}>
      <h3><span>{title}</span><i>{rows === null ? 'blocked' : rows.length}</i></h3>
      {rows === null ? (
        <p className={styles.empty}>Your browser is not letting this page read {where}.</p>
      ) : rows.length === 0 ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : (
        <ul>
          {rows.map((r) => {
            const k = known.find((x) => x.key === r.key);
            return (
              <li key={r.key} className={clsx(k && styles.ours)}>
                <code>{r.key}</code>
                <span className={styles.value}>{r.value.length > 60 ? `${r.value.slice(0, 60)}…` : r.value || '(empty)'}</span>
                <span className={styles.purpose}>{k ? k.purpose : r.key.startsWith(PREFIX) ? 'Set by this site.' : 'Not set by this site’s own code.'}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/**
 * A live look at what this site has stored in YOUR browser, read straight from
 * cookies, local storage and session storage — not a description of them. Items
 * with the site's own prefix are explained; anything else is flagged as not
 * coming from this site's code. "Clear" removes only the site's own items.
 *
 *   known: [{ key, purpose }]
 */
export default function StorageInspector({ eyebrow, title, intro, known, note }) {
  const [rootRef, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.15 });
  const [data, setData] = useState({ cookies: [], local: [], session: [] });
  const [cleared, setCleared] = useState(false);

  const refresh = useCallback(() => setData(snapshot()), []);

  useEffect(() => {
    if (!onScreen) return undefined;
    const first = window.setTimeout(refresh, 0);
    const id = window.setInterval(refresh, 1500);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [onScreen, refresh]);

  const clearOurs = () => {
    try {
      [window.localStorage, window.sessionStorage].forEach((store) => {
        Array.from({ length: store.length }, (_, i) => store.key(i)).filter((k) => k && k.startsWith(PREFIX)).forEach((k) => store.removeItem(k));
      });
    } catch { /* storage blocked */ }
    refresh();
    setCleared(true);
    window.setTimeout(() => setCleared(false), 2400);
  };

  const count = (rows) => (rows === null ? 0 : rows.length);
  const ours = [data.local, data.session].reduce((n, rows) => n + (rows ? rows.filter((r) => r.key.startsWith(PREFIX)).length : 0), 0);
  const total = count(data.cookies) + count(data.local) + count(data.session);

  return (
    <div ref={rootRef}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('cookies.storage-inspector')}>
        <div className={styles.summary}>
          <ProgressRing value={total ? ours / total : 0} size={96} stroke={3.4} label={`${ours} of ${total} stored items are this site's own`} {...fx('cookies.share-ring')}>
            <span className={styles.big}>{total}</span>
          </ProgressRing>
          <div>
            <p className={styles.line}>
              <b>{total}</b> {total === 1 ? 'item is' : 'items are'} stored for this site in your browser right now; <b>{ours}</b> {ours === 1 ? 'is' : 'are'} the site’s own.
            </p>
            <div className={styles.buttons} {...fx('cookies.clear-ours')}>
              <button type="button" onClick={refresh}><RefreshCw size={13} aria-hidden="true" /> Refresh</button>
              <button type="button" onClick={clearOurs} disabled={ours === 0}><Eraser size={13} aria-hidden="true" /> {cleared ? 'Cleared' : 'Clear the site’s items'}</button>
            </div>
          </div>
        </div>

        <div className={styles.groups} {...fx('cookies.live-groups')}>
          <Group title="Cookies" where="cookies" rows={data.cookies} known={known} emptyText="None. This site’s code does not set cookies." />
          <Group title="Local storage" where="local storage" rows={data.local} known={known} emptyText="Nothing. This site does not use local storage." />
          <Group title="Session storage" where="session storage" rows={data.session} known={known} emptyText="Nothing yet. Press START on the intro, or run a search, and look again." />
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
