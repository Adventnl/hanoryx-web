import { useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { fx } from '../../utils/fx';
import tool from './tool.module.css';
import styles from './IntegrationAtlas.module.css';

const ROWS = [
  ['how', 'How it works'],
  ['speed', 'How soon the other side knows'],
  ['coupling', 'How tightly the two are tied'],
  ['fails', 'When the other side is down'],
  ['effort', 'Effort to build well'],
  ['use', 'Reach for it when'],
  ['avoid', 'Think twice when'],
];

/**
 * Six ways to connect two systems, and two of them at a time. Choose any two and
 * every row compares them. The entries are general reference, written for this
 * site, not a statement about any particular integration.
 *
 *   patterns: [{ id, name, how, speed, coupling, fails, effort, use, avoid }]
 */
export default function IntegrationAtlas({ eyebrow, title, intro, patterns = [], note }) {
  const [pick, setPick] = useState([patterns[0]?.id, patterns[1]?.id]);
  const toggle = (id) => setPick((p) => {
    if (p.includes(id)) return p.length > 1 ? p.filter((x) => x !== id) : p;
    return [...p.slice(-1), id].slice(-2);
  });
  const chosen = pick.map((id) => patterns.find((x) => x.id === id)).filter(Boolean);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('atlas.rig')}>
        <div className={tool.chips} role="group" aria-label="Choose two patterns to compare">
          {patterns.map((p) => <button key={p.id} type="button" aria-pressed={pick.includes(p.id)} className={clsx(tool.chip, pick.includes(p.id) && tool.chipOn)} onClick={() => toggle(p.id)}>{p.name}</button>)}
        </div>
        <div className={tool.scroll}>
          <table className={tool.table}>
            <thead>
              <tr><th scope="col"><span className="sr-only">Row</span></th>{chosen.map((p) => <th key={p.id} scope="col" className={styles.name}>{p.name}</th>)}</tr>
            </thead>
            <tbody>
              {ROWS.map(([k, label]) => (
                <tr key={k}>
                  <th scope="row">{label}</th>
                  {chosen.map((p) => <td key={p.id}>{p[k]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {note && <p className={tool.note}>{note}</p>}
    </div>
  );
}
