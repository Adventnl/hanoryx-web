import { useEffect } from 'react';

const BASE = 'Hanoryx Systems';

/**
 * Sets the document title for a page (external sync — not React state).
 * Pass the page label; the base brand is appended automatically.
 */
export function useDocumentTitle(label) {
  useEffect(() => {
    document.title = label ? `${label} — ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [label]);
}

export default useDocumentTitle;
