import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './BlueprintLayer.module.css';
import { fx } from '../../utils/fx';

/**
 * Blueprint mode. `html.blueprint` outlines every marked part of the page (see
 * styles/fx.css); this layer names them: a small label pinned to the corner of
 * each element that carries a `data-fx` marker, and a count of how many
 * distinct marked details this page has. It re-reads the page twice a second
 * (lazy chunks arrive late) and repositions on scroll, only while the mode is
 * on, and never touches layout.
 */
/* The cursor, this HUD and the route line are tools, not details of a page. */
const SKIP = /^(cursor|blueprint|transition)\./;
const LABELS_PER_ID = 3;
const LABEL_H = 14;
const CHAR_W = 5.8; // 0.5rem mono with its tracking

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
      const placed = [];
      const seen = new Set();
      const perId = new Map();
      // labels that would sit on top of one another stack downwards instead
      const slot = (id, x, y) => {
        const w = id.length * CHAR_W + 16;
        let top = y;
        for (let tries = 0; tries < 8; tries += 1) {
          const hit = placed.find((p) => Math.abs(p.y - top) < LABEL_H && x < p.x + p.w && p.x < x + w);
          if (!hit) break;
          top = hit.y + LABEL_H;
        }
        placed.push({ x, y: top, w });
        return Math.min(vh - 18, top);
      };
      document.querySelectorAll('[data-fx]').forEach((el) => {
        const id = el.getAttribute('data-fx');
        if (SKIP.test(id) || !el.getClientRects().length) return;
        seen.add(id);
        const r = el.getBoundingClientRect();
        if (r.width < 24 || r.height < 16 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return;
        // a repeated detail (a card in a grid) is named a few times, not on every copy
        const n = (perId.get(id) || 0) + 1;
        perId.set(id, n);
        if (n > LABELS_PER_ID) return;
        const x = Math.max(4, Math.min(vw - 8, r.left));
        next.push({ id, key: `${id}-${next.length}`, x, y: slot(id, x, Math.max(4, Math.min(vh - 18, r.top))) });
      });
      setLabels(next.slice(0, 70));
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
      <div className={styles.hud} {...fx('blueprint.hud')}>
        <b>Blueprint</b>
        <span>{total} marked {total === 1 ? 'detail' : 'details'} on this page</span>
        <i>Press B to leave</i>
      </div>
    </div>,
    document.body
  );
}

export default BlueprintLayer;
