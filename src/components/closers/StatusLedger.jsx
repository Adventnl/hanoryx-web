import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Check, Minus } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './StatusLedger.module.css';

/** An honest ledger of where each document stands. The ticks arrive one by one
 *  as the ledger scrolls in; the column nobody has ticked yet says so. */
export default function StatusLedger({ tag, title, lede, columns = [], rows = [], note, onward }) {
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.wrap} role="region" aria-label="Document status" tabIndex={0} {...fx('ledger.table')}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Document</th>
              {columns.map((c) => <th key={c} scope="col">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.to}>
                <th scope="row"><Link to={r.to} data-cursor="link">{r.label}</Link></th>
                {r.marks.map((m, ci) => (
                  <td key={columns[ci]}>
                    <span className={clsx(styles.mark, m ? styles.yes : styles.no)} style={{ '--d': `${(ri * columns.length + ci) * 45}ms` }} {...fx('ledger.tick')}>
                      {m ? <Check size={14} strokeWidth={2} aria-hidden="true" /> : <Minus size={14} aria-hidden="true" />}
                      <span className="sr-only">{m ? 'Yes' : 'Not yet'}</span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className={styles.note}>{note}</p>}
      <p className={shared.label}>A dash is “not yet”, not “no”.</p>
    </CloserFrame>
  );
}
