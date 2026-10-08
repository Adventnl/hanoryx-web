import { useEffect } from 'react';
import { SITE_ORIGIN } from '../utils/constants';

const BASE = 'Hanoryx Systems';

function setMeta(selector, attributes, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Sets the document title for a page (external sync — not React state).
 * Pass the page label; the base brand is appended automatically.
 */
export function useDocumentTitle(label, description) {
  useEffect(() => {
    const title = label ? `${label} — ${BASE}` : BASE;
    const summary = description || `${label || 'Software systems'} at Hanoryx Systems. Explore engineering, public projects, and interface research.`;
    const canonical = `${SITE_ORIGIN}${window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '')}`;
    document.title = title;
    setMeta('meta[name="description"]', { name: 'description' }, summary);
    setMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    setMeta('meta[property="og:description"]', { property: 'og:description' }, summary);
    setMeta('meta[property="og:url"]', { property: 'og:url' }, canonical);
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, summary);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
    return () => {
      document.title = BASE;
    };
  }, [label, description]);
}

export default useDocumentTitle;
