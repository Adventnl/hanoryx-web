import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, OctagonAlert, X } from 'lucide-react';
import { ToastContext } from './toastContext';
import styles from './feedback.module.css';

const ICON = { info: Info, success: CheckCircle2, danger: OctagonAlert };

/**
 * Brief messages that appear in a corner and leave by themselves. They are
 * announced politely in a live region, never take focus, pause while the pointer
 * or keyboard is on them, and can always be dismissed. A toast is for something
 * that needs no answer ("Copied"); anything that does is a dialog.
 */
export default function ToastProvider({ children, max = 4 }) {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());
  const counter = useRef(0);

  const drop = useCallback((id) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setItems((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 260);
  }, []);
  const arm = useCallback((id, ms) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.set(id, window.setTimeout(() => drop(id), ms));
  }, [drop]);

  const push = useCallback(({ title, body, tone = 'info', duration = 5000 }) => {
    counter.current += 1;
    const id = counter.current;
    setItems((list) => [...list.slice(-(max - 1)), { id, title, body, tone, duration }]);
    if (duration > 0) arm(id, duration);
    return id;
  }, [arm, max]);

  useEffect(() => {
    const live = timers.current;
    return () => live.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      {createPortal(
        <div className={styles.toasts} role="status" aria-label="Notifications" aria-live="polite">
          {items.map((t) => {
            const Icon = ICON[t.tone] || Info;
            return (
              <div
                key={t.id}
                className={styles.toast}
                data-tone={t.tone}
                data-leaving={t.leaving ? '' : undefined}
                onPointerEnter={() => window.clearTimeout(timers.current.get(t.id))}
                onPointerLeave={() => t.duration > 0 && arm(t.id, 2000)}
                onFocus={() => window.clearTimeout(timers.current.get(t.id))}
              >
                <Icon size={17} aria-hidden="true" />
                <div className={styles.alertBody}>
                  {t.title && <b>{t.title}</b>}
                  {t.body && <p>{t.body}</p>}
                </div>
                <button type="button" className={styles.dismiss} onClick={() => drop(t.id)} aria-label="Dismiss this notification"><X size={14} aria-hidden="true" /></button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
