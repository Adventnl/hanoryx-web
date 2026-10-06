import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { fx } from '../../utils/fx';
import styles from './ContractDiff.module.css';

/**
 * A response, three consumers, and a set of changes you can make to it. Each
 * consumer reads the response in its own way, so each change breaks some and
 * spares others — which is the whole lesson of a contract.
 *
 *   changes:   [{ id, label, kind: 'safe'|'breaking', apply: (shape) => shape }]   (declared as data below)
 *   consumers: [{ id, name, how, needs: [{ path, type }], strict }]
 */
const BASE = { total: 'number', 'items[].sku': 'string', 'items[].price': 'number', 'items[].status': 'enum:paid|shipped' };

const CHANGES = [
  { id: 'add', label: 'Add a field: items[].currency', shape: (s) => ({ ...s, 'items[].currency': 'string' }), kind: 'safe' },
  { id: 'rename', label: 'Rename items[].price to items[].amount', shape: (s) => Object.fromEntries(Object.entries(s).map(([k, v]) => (k === 'items[].price' ? ['items[].amount', v] : [k, v]))), kind: 'breaking' },
  { id: 'remove', label: 'Remove items[].sku', shape: (s) => Object.fromEntries(Object.entries(s).filter(([k]) => k !== 'items[].sku')), kind: 'breaking' },
  { id: 'type', label: 'Send items[].price as a string', shape: (s) => ({ ...s, 'items[].price': 'string' }), kind: 'breaking' },
  { id: 'enum', label: 'Add a status value: refunded', shape: (s) => ({ ...s, 'items[].status': 'enum:paid|shipped|refunded' }), kind: 'depends' },
];

function check(c, shape) {
  const problems = [];
  c.needs.forEach((n) => {
    if (!(n.path in shape)) problems.push(`${n.path} is gone`);
    else if (shape[n.path] !== n.type && !(n.type.startsWith('enum') && shape[n.path].startsWith('enum') && !c.strictEnum)) problems.push(`${n.path} is now ${shape[n.path]}, not ${n.type}`);
  });
  if (c.strict) {
    const known = new Set(c.needs.map((n) => n.path));
    Object.keys(shape).forEach((p) => { if (!known.has(p) && !(p in BASE)) problems.push(`${p} is a field it was not told about`); });
  }
  return problems;
}

export default function ContractDiff({ eyebrow, title, intro, consumers = [], note }) {
  const [applied, setApplied] = useState([]);
  const shape = useMemo(() => applied.reduce((s, id) => CHANGES.find((c) => c.id === id).shape(s), BASE), [applied]);
  const toggle = (id) => setApplied((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  const json = useMemo(() => {
    const item = Object.entries(shape).filter(([p]) => p.startsWith('items[].')).map(([p, t]) => `    "${p.slice(8)}": ${t === 'number' ? '19.5' : t === 'string' ? '"…"' : t.startsWith('enum') ? '"paid"' : '…'}`);
    return `{\n  "total": 39,\n  "items": [{\n${item.join(',\n')}\n  }]\n}`;
  }, [shape]);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('contract.rig')}>
        <div className={styles.left}>
          <p className={styles.k}>Change the response</p>
          <ul className={styles.changes} {...fx('contract.changes')}>
            {CHANGES.map((c) => (
              <li key={c.id}>
                <label className={clsx(styles.change, applied.includes(c.id) && styles.on)}>
                  <input type="checkbox" checked={applied.includes(c.id)} onChange={() => toggle(c.id)} />
                  <span className={styles.box} aria-hidden="true" />
                  <span>{c.label}</span>
                </label>
              </li>
            ))}
          </ul>
          <pre className={styles.json} tabIndex={0} aria-label="The response as it is now"><code>{json}</code></pre>
        </div>
        <ul className={styles.consumers} {...fx('contract.consumers')}>
          {consumers.map((c) => {
            const problems = check(c, shape);
            return (
              <li key={c.id} className={clsx(styles.consumer, problems.length ? styles.broken : styles.fine)}>
                <header>
                  <span className={styles.badge}>{problems.length ? <X size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}</span>
                  <h3>{c.name}</h3>
                  <b>{problems.length ? 'Breaks' : 'Still works'}</b>
                </header>
                <p>{c.how}</p>
                {problems.length > 0 && <ul>{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
              </li>
            );
          })}
        </ul>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
