import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './FitRadar.module.css';

const SIZE = 240;
const C = SIZE / 2;
const R = 92;

/** Set how much each area of the work draws you, and a radar fills in. The
 *  area you lean towards most is named. Nothing is stored or sent — it is a
 *  mirror, not a form. */
export default function FitRadar({ tag, title, lede, axes = [], onward }) {
  const [vals, setVals] = useState(() => Object.fromEntries(axes.map((a) => [a.id, 2])));
  const n = axes.length;
  const pt = (i, v) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / n;
    const r = (v / 4) * R;
    return [C + Math.cos(a) * r, C + Math.sin(a) * r];
  };
  const poly = axes.map((a, i) => pt(i, vals[a.id]).join(',')).join(' ');
  const top = [...axes].sort((a, b) => vals[b.id] - vals[a.id])[0];
  const flat = axes.every((a) => vals[a.id] === vals[axes[0].id]);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.wrap} {...fx('fit.radar')}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg} role="img" aria-label={`Radar of interest: ${axes.map((a) => `${a.label} ${vals[a.id]} of 4`).join(', ')}`}>
          {[1, 2, 3, 4].map((k) => <polygon key={k} points={axes.map((_, i) => pt(i, k).join(',')).join(' ')} className={styles.ring} />)}
          {axes.map((a, i) => { const [x, y] = pt(i, 4); return <line key={a.id} x1={C} y1={C} x2={x} y2={y} className={styles.spoke} />; })}
          <polygon points={poly} className={styles.shape} />
          {axes.map((a, i) => { const [x, y] = pt(i, vals[a.id]); return <circle key={a.id} cx={x} cy={y} r="3.2" className={styles.dot} />; })}
          {axes.map((a, i) => { const [x, y] = pt(i, 4.9); return <text key={a.id} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className={styles.lbl}>{a.short}</text>; })}
        </svg>
        <div className={styles.controls}>
          {axes.map((a) => (
            <label key={a.id} className={styles.slider}>
              <span><b>{a.label}</b><i>{['Not for me', 'A little', 'Interested', 'Keen', 'Drawn to it'][vals[a.id]]}</i></span>
              <input type="range" min={0} max={4} step={1} value={vals[a.id]} onChange={(e) => setVals((v) => ({ ...v, [a.id]: Number(e.target.value) }))} aria-valuetext={['Not for me', 'A little', 'Interested', 'Keen', 'Drawn to it'][vals[a.id]]} />
            </label>
          ))}
          <div className={styles.result} role="status" aria-live="polite">
            {flat ? <p>Move a slider. The area you lean towards will be named here.</p> : (
              <p>You lean towards <b>{top.label}</b>. {top.blurb}{top.to && <> <Link to={top.to} className={styles.go}>See it <ArrowUpRight size={12} aria-hidden="true" /></Link></>}</p>
            )}
            <button type="button" className={shared.btn} onClick={() => setVals(Object.fromEntries(axes.map((a) => [a.id, 2])))}><RotateCcw size={13} aria-hidden="true" /> Reset</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
