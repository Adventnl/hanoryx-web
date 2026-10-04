import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { KeyCap } from '../fx/KeyCap';
import { useOnScreen } from '../../hooks/useOnScreen';
import { fx } from '../../utils/fx';
import styles from './KeyboardMap.module.css';

const isField = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

/**
 * A keyboard you can press — or tap. Each key that does something on this site
 * is drawn as a keycap; press the real key (or tap the cap) and it lights and
 * says what it does here. Keys are only listened to while the map is on screen
 * and never while you are typing in a field; nothing is intercepted, so Tab and
 * the rest keep doing their job.
 *
 *   keys: [{ id, label, wide?, match: [event.key], does }]   rows: [[id, id, …], …]
 */
export default function KeyboardMap({ eyebrow, title, intro, keys, rows, hint, note }) {
  const [rootRef, onScreen] = useOnScreen({ rootMargin: '0px', threshold: 0.2 });
  const [pressed, setPressed] = useState(null);
  const [picked, setPicked] = useState(keys[0].id);
  const timer = useRef(0);
  const byId = Object.fromEntries(keys.map((k) => [k.id, k]));

  useEffect(() => {
    if (!onScreen) return undefined;
    const onKey = (event) => {
      if (isField(event.target)) return;
      const hit = keys.find((k) => k.match.includes(event.key));
      if (!hit) return;
      setPressed(hit.id);
      setPicked(hit.id);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setPressed(null), 420);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer.current);
    };
  }, [onScreen, keys]);

  const current = byId[picked];

  return (
    <div ref={rootRef}>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.bench} {...fx('a11y.keyboard-map')}>
        <div className={styles.board} role="group" aria-label="Keys that do something on this site" {...fx('keys.board')}>
          {rows.map((row, ri) => (
            <div key={ri} className={styles.row}>
              {row.map((id) => {
                const k = byId[id];
                return (
                  <button
                    key={id}
                    type="button"
                    className={clsx(styles.key, k.wide && styles.wide, picked === id && styles.picked)}
                    onClick={() => setPicked(id)}
                    aria-pressed={picked === id}
                    aria-label={`${k.label}: ${k.does}`}
                  >
                    <KeyCap pressed={pressed === id} {...fx('keys.keycap')}>{k.label}</KeyCap>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.read} aria-live="polite" {...fx('keys.reading')}>
          <span className={styles.which}>{current.label}</span>
          <p key={picked}>{current.does}</p>
        </div>
        {hint && <p className={styles.hint}>{hint}</p>}
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
