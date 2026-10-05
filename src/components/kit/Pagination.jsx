import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useControllable } from './useControllable';
import { pageWindow } from './pageWindow';
import styles from './navigation.module.css';

/**
 * Page buttons with the first, the last and the neighbours of the current one,
 * and "…" for what is skipped. Previous and next step by one and stop at the ends.
 * The current page is marked with `aria-current="page"`.
 */
export default function Pagination({ page, defaultPage = 1, pages = 1, onChange, siblings = 1, label = 'Pagination', className }) {
  const [current, setCurrent] = useControllable({ value: page, defaultValue: defaultPage, onChange });
  const go = (n) => { if (n >= 1 && n <= pages && n !== current) setCurrent(n); };

  return (
    <nav className={`${styles.pager} ${className || ''}`} aria-label={label}>
      <ul>
        <li><button type="button" className={styles.pageBtn} onClick={() => go(current - 1)} disabled={current <= 1} aria-label="Previous page"><ChevronLeft size={15} aria-hidden="true" /></button></li>
        {pageWindow(current, pages, siblings).map((n, i) => (
          <li key={`${n}-${i}`}>
            {n === '…' ? <span className={styles.gap} aria-hidden="true">…</span> : <button type="button" className={styles.pageBtn} onClick={() => go(n)} aria-current={n === current ? 'page' : undefined} aria-label={`Page ${n}`}>{n}</button>}
          </li>
        ))}
        <li><button type="button" className={styles.pageBtn} onClick={() => go(current + 1)} disabled={current >= pages} aria-label="Next page"><ChevronRight size={15} aria-hidden="true" /></button></li>
      </ul>
    </nav>
  );
}
