import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SETTLE = 350;
const GIVE_UP = 1600;

/**
 * Tells assistive technology that a new page has opened.
 *
 * Moving between pages here does not reload the document, so a screen reader
 * hears nothing unless something says so. Each page sets document.title when
 * it mounts (and the page it replaces resets it on the way out), so this waits
 * for the title to stop changing and then reads it out in a polite live region.
 * If the link that was used went with the old page, keyboard focus is handed to
 * the new page's main region, so the next Tab starts from its content and not
 * from the top of the site.
 */
export function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState('');
  const seen = useRef(pathname);
  const armed = useRef(false);
  const timer = useRef(0);

  useEffect(() => {
    const announce = () => {
      if (!armed.current) return;
      armed.current = false;
      window.clearTimeout(timer.current);
      setMessage(document.title);
      const active = document.activeElement;
      if (!active || active === document.body) document.getElementById('main')?.focus({ preventScroll: true });
    };
    const observer = new MutationObserver(() => {
      if (!armed.current) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(announce, SETTLE);
    });
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });

    if (seen.current !== pathname) {
      seen.current = pathname;
      armed.current = true;
      // A page whose title does not change still gets announced.
      timer.current = window.setTimeout(announce, GIVE_UP);
    }
    return () => {
      observer.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [pathname]);

  return <div className="sr-only" role="status" data-route-announcer>{message}</div>;
}

export default RouteAnnouncer;
