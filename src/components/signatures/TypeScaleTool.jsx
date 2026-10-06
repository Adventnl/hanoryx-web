import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import tool from './tool.module.css';
import styles from './TypeScaleTool.module.css';

const RATIOS = [
  { id: '1.067', label: 'Minor second', value: 1.067 },
  { id: '1.125', label: 'Major second', value: 1.125 },
  { id: '1.2', label: 'Minor third', value: 1.2 },
  { id: '1.25', label: 'Major third', value: 1.25 },
  { id: '1.333', label: 'Perfect fourth', value: 1.333 },
  { id: '1.414', label: 'Augmented fourth', value: 1.414 },
  { id: '1.5', label: 'Perfect fifth', value: 1.5 },
  { id: '1.618', label: 'Golden ratio', value: 1.618 },
];

/** A type scale: one base size multiplied again and again by one ratio, so the
 *  sizes belong together. Set the base and the ratio, see each step set in type,
 *  and copy the sizes as CSS custom properties. */
export default function TypeScaleTool({ eyebrow, title, intro, note }) {
  const [base, setBase] = useState(16);
  const [ratioId, setRatioId] = useState('1.25');
  const [down, setDown] = useState(2);
  const [up, setUp] = useState(5);
  const [copied, copy] = useCopy();
  const ratio = RATIOS.find((r) => r.id === ratioId).value;

  const steps = useMemo(
    () => Array.from({ length: down + up + 1 }, (_, i) => {
      const n = i - down;
      const px = base * ratio ** n;
      return { n, px, rem: px / 16 };
    }).reverse(),
    [base, ratio, down, up]
  );
  const css = useMemo(
    () => `:root {\n${[...steps].reverse().map((s) => `  --step-${s.n < 0 ? `minus-${-s.n}` : s.n}: ${s.rem.toFixed(3).replace(/\.?0+$/, '')}rem; /* ${s.px.toFixed(1)}px */`).join('\n')}\n}`,
    [steps]
  );

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={`${tool.rig} ${tool.rigWide}`} {...fx('typescale.rig')}>
        <div className={tool.stack}>
          <label className={tool.field}>
            <span>Base size <b>{base}px</b></span>
            <input type="range" min={12} max={24} value={base} onChange={(e) => setBase(Number(e.target.value))} />
            <small>The size of ordinary reading text. Sixteen is the browser’s default.</small>
          </label>
          <label className={tool.field}>
            <span>Ratio <b>{ratio}</b></span>
            <select value={ratioId} onChange={(e) => setRatioId(e.target.value)}>
              {RATIOS.map((r) => <option key={r.id} value={r.id}>{r.label} · {r.value}</option>)}
            </select>
            <small>Small ratios change gently; large ones make headlines that shout.</small>
          </label>
          <div className={tool.pair}>
            <label className={tool.field}>
              <span>Steps down <b>{down}</b></span>
              <input type="range" min={0} max={3} value={down} onChange={(e) => setDown(Number(e.target.value))} />
            </label>
            <label className={tool.field}>
              <span>Steps up <b>{up}</b></span>
              <input type="range" min={1} max={7} value={up} onChange={(e) => setUp(Number(e.target.value))} />
            </label>
          </div>
          <div className={tool.out}>
            <p className={tool.k}>As CSS</p>
            <pre className={tool.pre} tabIndex={0}><code>{css}</code></pre>
            <div className={tool.row}>
              <button type="button" className={styles.btn} onClick={() => copy(css)}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy the CSS'}</button>
            </div>
          </div>
        </div>
        <ol className={styles.specimen} aria-label="The scale, set in type" {...fx('typescale.specimen')}>
          {steps.map((s) => (
            <li key={s.n} className={s.n === 0 ? styles.base : undefined}>
              <span className={styles.meta}>{s.n === 0 ? 'base' : s.n > 0 ? `+${s.n}` : s.n}<small>{s.px.toFixed(1)}px · {s.rem.toFixed(3)}rem</small></span>
              <span className={styles.line} style={{ fontSize: `${Math.min(s.px, 96)}px` }}>Hamburgefonstiv</span>
            </li>
          ))}
        </ol>
      </div>
      {note && <p className={tool.note}>{note}</p>}
    </div>
  );
}
