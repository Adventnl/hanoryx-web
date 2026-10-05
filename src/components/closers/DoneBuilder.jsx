import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle, Printer } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './DoneBuilder.module.css';

/** Write a definition of done. Choose what must be true before work counts as
 *  finished; the list becomes a card you can print or paste. It nudges you
 *  toward a short list, because a long one is a list nobody checks. */
export default function DoneBuilder({ tag, title, lede, groups = [], start = [], onward }) {
  const [on, setOn] = useState(() => new Set(start));
  const [copied, copy] = useCopy();
  const toggle = (id) => setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const picked = useMemo(() => groups.flatMap((g) => g.items.filter((i) => on.has(i.id)).map((i) => ({ ...i, group: g.name }))), [groups, on]);
  const md = ['# Definition of done', '', 'Work is done when:', '', ...picked.map((p, i) => `${i + 1}. ${p.text}`), ''].join('\n');
  const verdict = picked.length === 0 ? 'Choose what “done” means for you.' : picked.length <= 7 ? 'A list short enough to be checked.' : picked.length <= 9 ? 'Getting long. Everything on it should earn its place.' : 'Too long to check every time. Which of these could be automated, or cut?';

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('done.rig')}>
        <div className={styles.pick}>
          {groups.map((g) => (
            <fieldset key={g.name}>
              <legend>{g.name}</legend>
              {g.items.map((i) => (
                <label key={i.id} className={clsx(styles.row, on.has(i.id) && styles.on)}>
                  <input type="checkbox" checked={on.has(i.id)} onChange={() => toggle(i.id)} />
                  <span className={styles.box} aria-hidden="true" />
                  <span>{i.text}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <div className={styles.cardWrap}>
          <article className={styles.card} data-print="doc" {...fx('done.card')}>
            <p className={shared.label}>Definition of done</p>
            <h3>Work is done when…</h3>
            {picked.length ? <ol>{picked.map((p) => <li key={p.id}>{p.text}</li>)}</ol> : <p className={styles.empty}>Nothing chosen yet.</p>}
            <p className={clsx(styles.verdict, picked.length > 9 && styles.warn)} role="status">{picked.length > 9 && <AlertTriangle size={14} aria-hidden="true" />}{verdict} <span>{picked.length} item{picked.length === 1 ? '' : 's'}</span></p>
          </article>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => window.print()} disabled={!picked.length}><Printer size={14} aria-hidden="true" /> Print the card</button>
            <button type="button" className={shared.btn} onClick={() => copy(md)} disabled={!picked.length}>{copied ? 'Copied' : 'Copy as Markdown'}</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
