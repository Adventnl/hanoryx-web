import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './BlueprintLayer.module.css';

/**
 * Blueprint mode. `html.blueprint` outlines every marked part of the page (see
 * styles/fx.css); this layer names them: a small label pinned to the corner of
 * each element that carries a `data-fx` marker, and a count of how many
 * distinct marked details this page has. It re-reads the page twice a second
 * (lazy chunks arrive late) and repositions on scroll, only while the mode is
 * on, and never touches layout.
 */
export function BlueprintLayer({ active }) {
  const [labels, setLabels] = useState([]);
  const [total, setTotal] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    const html = document.documentElement;
    html.classList.add('blueprint');

    const measure = () => {
      frame.current = 0;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const next = [];
      const seen = new Set();
      document.querySelectorAll('main [data-fx]').forEach((el) => {
        const id = el.getAttribute('data-fx');
        seen.add(id);
        const r = el.getBoundingClientRect();
        if (r.width < 24 || r.height < 16 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return;
        next.push({ id, key: `${id}-${next.length}`, x: Math.max(4, Math.min(vw - 8, r.left)), y: Math.max(4, Math.min(vh - 18, r.top)) });
      });
      setLabels(next.slice(0, 60));
      setTotal(seen.size);
    };
    const schedule = () => { if (!frame.current) frame.current = requestAnimationFrame(measure); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const poll = window.setInterval(schedule, 600);
    return () => {
      html.classList.remove('blueprint');
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.clearInterval(poll);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [active]);

  if (!active) return null;
  return createPortal(
    <div className={styles.layer} aria-hidden="true">
      {labels.map((l) => (
        <span key={l.key} className={styles.label} style={{ transform: `translate3d(${l.x}px, ${l.y}px, 0)` }}>{l.id}</span>
      ))}
      <div className={styles.hud}>
        <b>Blueprint</b>
        <span>{total} marked {total === 1 ? 'detail' : 'details'} on this page</span>
        <i>Press B to leave</i>
      </div>
    </div>,
    document.body
  );
}

export default BlueprintLayer;
