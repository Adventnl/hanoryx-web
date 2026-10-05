import { useState } from 'react';
import clsx from 'clsx';
import { Copy, Printer } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { ProgressRing } from '../fx/ProgressRing';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './CheckSheet.module.css';

/** A checklist to take away: tick things off and a ring fills; copy the whole
 *  thing as Markdown (ticks included) or print it. Used by several pages with
 *  their own list — each ending is registered under its own name. */
export default function CheckSheet({ tag, title, lede, sheetTitle, items = [], groups, onward }) {
  const [done, setDone] = useState(() => new Set());
  const [copied, copy] = useCopy();
  const all = groups ? groups.flatMap((g) => g.items) : items;
  const toggle = (id) => setDone((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const md = [`# ${sheetTitle || title}`, '', ...(groups ? groups.flatMap((g) => [`## ${g.name}`, ...g.items.map((i) => `- [${done.has(i.id) ? 'x' : ' '}] ${i.text}`), '']) : items.map((i) => `- [${done.has(i.id) ? 'x' : ' '}] ${i.text}`))].join('\n');
  const list = (arr) => (
    <ul className={styles.list}>
      {arr.map((i) => (
        <li key={i.id}>
          <label className={clsx(styles.row, done.has(i.id) && styles.on)} {...fx('checksheet.item')}>
            <input type="checkbox" checked={done.has(i.id)} onChange={() => toggle(i.id)} />
            <span className={styles.box} aria-hidden="true" />
            <span className={styles.text}>{i.text}</span>
          </label>
        </li>
      ))}
    </ul>
  );
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.sheet} data-print="doc" {...fx('checksheet.sheet')}>
        <div className={styles.side}>
          <ProgressRing value={all.length ? done.size / all.length : 0} size={132} stroke={3.4} label={`${done.size} of ${all.length} ticked`} {...fx('checksheet.ring')}>
            <span className={styles.big}>{done.size}<small>/{all.length}</small></span>
          </ProgressRing>
          <div className={shared.row}>
            <button type="button" className={shared.btn} onClick={() => copy(md)}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy as Markdown'}</button>
            <button type="button" className={shared.btn} onClick={() => window.print()}><Printer size={14} aria-hidden="true" /> Print</button>
          </div>
        </div>
        <div className={styles.body}>
          {sheetTitle && <h3 className={styles.sheetTitle}>{sheetTitle}</h3>}
          {groups ? groups.map((g) => (
            <section key={g.name}>
              <h4 className={styles.group}>{g.name}</h4>
              {list(g.items)}
            </section>
          )) : list(items)}
        </div>
      </div>
    </CloserFrame>
  );
}
