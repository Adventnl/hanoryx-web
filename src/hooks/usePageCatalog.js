import { useCallback, useEffect, useState } from 'react';
import { loadPageCatalog } from '../data/pageCatalog';

/** Loads shared page metadata only while a catalog-backed control is mounted. */
export function usePageCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    loadPageCatalog()
      .then((data) => { if (active) { setCatalog(data); setError(false); } })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [attempt]);

  const retry = useCallback(() => {
    setError(false);
    setAttempt((current) => current + 1);
  }, []);

  return { catalog, error, retry };
}
