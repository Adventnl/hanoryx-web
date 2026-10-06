import { useEffect, useRef, useState } from 'react';
import CloserFrame from './CloserFrame';
import { Dialog, TextField } from '../kit';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './FocusTrap.module.css';

const describe = (el) => {
  if (!el) return 'nothing';
  const named = el.getAttribute('aria-label') || el.labels?.[0]?.innerText?.split('\n')[0] || el.innerText || el.tagName.toLowerCase();
  return `${named.replace(/\s+/g, ' ').trim().slice(0, 40)} (${el.tagName.toLowerCase()})`;
};

/**
 * “Try to escape the dialog.” Open it and press Tab, Shift+Tab and Escape: a log
 * beside it writes down where focus goes — in, round and round inside, and back to
 * the button that opened it. The dialog is the kit’s own.
 */
export default function FocusTrap({ tag, title, lede, rules = [], onward }) {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState([]);
  const opener = useRef(null);
  const count = useRef(0);

  const add = (k, text) => { count.current += 1; setLog((l) => [{ id: count.current, k, text }, ...l].slice(0, 9)); };

  useEffect(() => {
    if (!open) return undefined;
    const onFocus = (e) => add('FOCUS', `moved to ${describe(e.target)}`);
    const onKey = (e) => {
      if (e.key === 'Tab') add('KEY', e.shiftKey ? 'Shift+Tab pressed' : 'Tab pressed');
      else if (e.key === 'Escape') add('KEY', 'Escape pressed — closing');
    };
    document.addEventListener('focusin', onFocus);
    document.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('focusin', onFocus); document.removeEventListener('keydown', onKey, true); };
  }, [open]);

  const openIt = () => { setLog([]); add('OPEN', 'dialog opened'); setOpen(true); };
  const close = () => { setOpen(false); requestAnimationFrame(() => add('FOCUS', `returned to ${describe(opener.current)}`)); };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('focustrap.rig')}>
        <div className={styles.col}>
          <button ref={opener} type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={openIt}>Open the dialog</button>
          <p>Then press Tab again and again. Focus never leaves — it goes round. Press Escape, or the dark area, and it goes back to this button.</p>
          <ul className={styles.rules} aria-label="What a good dialog does">
            {rules.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
        <div className={styles.col}>
          <p className={shared.label}>Where focus went</p>
          <ol className={styles.log} aria-label="Focus log" {...fx('focustrap.log')}>
            {log.map((l) => <li key={l.id}><b>{l.k}</b><span>{l.text}</span></li>)}
            {!log.length && <li className={styles.empty}>Nothing yet. Open the dialog.</li>}
          </ol>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={close}
        title="Rename the project"
        footer={(
          <>
            <button type="button" className={shared.btn} onClick={close}>Cancel</button>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={close}>Save</button>
          </>
        )}
      >
        <TextField label="New name" defaultValue="Example project" />
      </Dialog>
    </CloserFrame>
  );
}
