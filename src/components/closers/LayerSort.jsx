import { useState } from 'react';
import clsx from 'clsx';
import { Check, RotateCcw, X } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './LayerSort.module.css';

/** Where does it belong? Eight small responsibilities, four layers. Put each in
 *  the layer you would give it, then check against the reasoning. There is
 *  rarely one possible answer; the point is to say why. */
export default function LayerSort({ tag, title, lede, layers = [], items = [], onward }) {
  const [ans, setAns] = useState({});
  const [checked, setChecked] = useState(false);
  const right = items.filter((i) => ans[i.id] === i.layer).length;
  const all = items.every((i) => ans[i.id]);
  const reset = () => { setAns({}); setChecked(false); };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('layersort.rig')}>
        <ol className={styles.items}>
          {items.map((it, n) => {
            const status = checked ? (ans[it.id] === it.layer ? 'ok' : 'no') : '';
            return (
              <li key={it.id} className={clsx(styles.item, status && styles[status])}>
                <p className={styles.text}><span>{String(n + 1).padStart(2, '0')}</span>{it.text}</p>
                <div className={styles.opts} role="radiogroup" aria-label={it.text}>
                  {layers.map((l) => (
                    <button key={l.id} type="button" role="radio" aria-checked={ans[it.id] === l.id} className={clsx(styles.opt, ans[it.id] === l.id && styles.on)} onClick={() => !checked && setAns((a) => ({ ...a, [it.id]: l.id }))} disabled={checked && ans[it.id] !== l.id && it.layer !== l.id}>{l.name}</button>
                  ))}
                </div>
                {checked && (
                  <p className={styles.why}>
                    {status === 'ok' ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}
                    <span><b>{layers.find((l) => l.id === it.layer).name}.</b> {it.why}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
        <div className={styles.side} aria-live="polite">
          {checked ? <p className={styles.score}><b>{right}</b> of {items.length} placed as expected</p> : <p className={styles.help}>{Object.keys(ans).length} of {items.length} placed</p>}
          <div className={shared.row}>
            {!checked && <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => setChecked(true)} disabled={!all}><Check size={14} aria-hidden="true" /> Check</button>}
            <button type="button" className={shared.btn} onClick={reset} disabled={!Object.keys(ans).length}><RotateCcw size={14} aria-hidden="true" /> Start again</button>
          </div>
          <ul className={styles.key}>{layers.map((l) => <li key={l.id}><b>{l.name}</b><span>{l.blurb}</span></li>)}</ul>
        </div>
      </div>
    </CloserFrame>
  );
}
