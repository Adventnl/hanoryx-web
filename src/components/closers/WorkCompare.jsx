import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { workItems } from '../../data/work';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './WorkCompare.module.css';

/** Put any two of the four side by side. The rows are the things the work pages
 *  say; where a row is the same for both it is marked, because what two pieces of
 *  work share is as telling as how they differ. */
export default function WorkCompare({ tag, title, lede, shows = {}, onward }) {
  const [a, setA] = useState('musebase');
  const [b, setB] = useState('internal-crm');
  const A = workItems.find((w) => w.id === a);
  const B = workItems.find((w) => w.id === b);
  const rows = [
    { k: 'Kind', a: A.kind, b: B.kind },
    { k: 'Standing', a: A.tier === 'primary' ? 'A lead project' : 'A supporting study', b: B.tier === 'primary' ? 'A lead project' : 'A supporting study' },
    { k: 'In a line', a: A.tagline, b: B.tagline },
    { k: 'What it is', a: A.summary, b: B.summary },
    { k: 'What its page shows', a: shows[a], b: shows[b] },
  ];
  const swap = () => { setA(b); setB(a); };
  const options = workItems.map((w) => <option key={w.id} value={w.id}>{w.name}</option>);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('workcompare.rig')}>
        <div className={styles.pick}>
          <label className={tool.field}><span>One</span><select value={a} onChange={(e) => setA(e.target.value)}>{options}</select></label>
          <button type="button" className={shared.btn} onClick={swap} aria-label="Swap the two"><ArrowLeftRight size={14} aria-hidden="true" /></button>
          <label className={tool.field}><span>Two</span><select value={b} onChange={(e) => setB(e.target.value)}>{options}</select></label>
        </div>
        {a === b && <p className={tool.sm} role="status">That is the same piece of work twice. Choose a different second one.</p>}
        <div className={tool.scroll}>
          <table className={tool.table}>
            <thead><tr><th scope="col"><span className="sr-only">Row</span></th><th scope="col">{A.name}</th><th scope="col">{B.name}</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className={r.a === r.b ? styles.same : undefined}>
                  <th scope="row">{r.k}{r.a === r.b && <i> · same</i>}</th>
                  <td>{r.a}</td>
                  <td>{r.b}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Read it</th>
                <td><Link to={A.to} className={styles.go} data-cursor="link">{A.name} <ArrowUpRight size={13} aria-hidden="true" /></Link></td>
                <td><Link to={B.to} className={styles.go} data-cursor="link">{B.name} <ArrowUpRight size={13} aria-hidden="true" /></Link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CloserFrame>
  );
}
