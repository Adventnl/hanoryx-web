/* What this site has left in the visitor's browser, and which hosts the tab has
   talked to — read live from the browser, never remembered. Several pages show
   it (the privacy receipt, the storage purge, the host scan). */
const PREFIX = 'hnx.';

function keysOf(store) {
  try {
    return Array.from({ length: store.length }, (_, i) => store.key(i)).filter(Boolean);
  } catch {
    return null; // storage blocked
  }
}

export function readFootprint() {
  let cookies;
  try {
    cookies = document.cookie ? document.cookie.split(';').map((c) => c.trim().split('=')[0]).filter(Boolean) : [];
  } catch {
    cookies = null;
  }
  const hosts = new Set();
  if (window.location.host) hosts.add(window.location.host);
  try {
    performance.getEntriesByType('resource').forEach((entry) => {
      try {
        const host = new URL(entry.name).host;
        if (host) hosts.add(host);
      } catch {
        /* not a URL */
      }
    });
  } catch {
    /* no Performance API */
  }
  return { cookies, local: keysOf(window.localStorage), session: keysOf(window.sessionStorage), hosts: [...hosts].sort() };
}

export const isOwnKey = (key) => key.startsWith(PREFIX);

/** Remove only the site's own items. Returns how many were removed. */
export function clearOwnStorage() {
  let removed = 0;
  [window.localStorage, window.sessionStorage].forEach((store) => {
    try {
      keysOf(store)?.filter(isOwnKey).forEach((key) => {
        store.removeItem(key);
        removed += 1;
      });
    } catch {
      /* storage blocked */
    }
  });
  return removed;
}
