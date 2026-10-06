import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './ClampMaker.module.css';

const trim = (n, d = 4) => String(Number(n.toFixed(d)));

/** Fluid type without media queries: a font size that grows smoothly between
 *  two viewport widths and stops at both ends. Set the four numbers; the one
 *  line of CSS comes out, and a slider stands in for the browser window. */
export default function ClampMaker({ tag, title, lede, onward }) {
  const [min, setMin] = useState(18);
  const [max, setMax] = useState(40);
  const [minVw, setMinVw] = useState(360);
  const [maxVw, setMaxVw] = useState(1280);
  const [vw, setVw] = useState(800);
  const [copied, copy] = useCopy();

  const ok = max > min && maxVw > minVw;
  const m = useMemo(() => {
    const slope = (max - min) / (maxVw - minVw);
    const base = min - slope * minVw;
    const rem = (px) => trim(px / 16);
    const mid = `${base < 0 ? `${trim(slope * 100)}vw - ${rem(-base)}rem` : `${rem(base)}rem + ${trim(slope * 100)}vw`}`;
    return { slope, base, css: `font-size: clamp(${rem(min)}rem, ${mid}, ${rem(max)}rem);` };
  }, [min, max, minVw, maxVw]);
  const at = ok ? Math.max(min, Math.min(max, m.base + m.slope * vw)) : min;

  const W = 320;
  const H = 120;
  const x = (v) => ((v - 280) / (1920 - 280)) * W;
  const y = (s) => H - 10 - ((s - Math.min(min, max) * 0.8) / (Math.max(min, max) * 1.1 - Math.min(min, max) * 0.8 || 1)) * (H - 24);
  const size = (v) => Math.max(min, Math.min(max, m.base + m.slope * v));
  const pts = ok ? [280, minVw, maxVw, 1920].map((v) => `${x(v)},${y(size(v))}`).join(' ') : '';

  const num = (label, value, set, lo, hi, unit) => (
    <label className={tool.field}>
      <span>{label} <b>{value}{unit}</b></span>
      <input type="range" min={lo} max={hi} value={value} onChange={(e) => set(Number(e.target.value))} />
    </label>
  );

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('clamp.rig')}>
        <div className={styles.form}>
          <div className={tool.pair}>
            {num('Smallest size', min, setMin, 10, 40, 'px')}
            {num('Largest size', max, setMax, 16, 120, 'px')}
          </div>
          <div className={tool.pair}>
            {num('Starts growing at', minVw, setMinVw, 280, 800, 'px')}
            {num('Stops growing at', maxVw, setMaxVw, 900, 1920, 'px')}
          </div>
          {!ok && <p className={tool.err} role="alert">The largest size and the wider screen must each be bigger than their smaller partners.</p>}
          <pre className={tool.pre} tabIndex={0}><code>{ok ? m.css : '—'}</code></pre>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => copy(m.css)} disabled={!ok}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy the line'}</button>
          </div>
        </div>
        <div className={styles.view}>
          <label className={tool.field}>
            <span>Pretend the window is <b>{vw}px</b> wide</span>
            <input type="range" min={280} max={1920} value={vw} onChange={(e) => setVw(Number(e.target.value))} />
          </label>
          <figure className={styles.graph} {...fx('clamp.graph')}>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Font size against window width. At ${vw} pixels wide the size is ${at.toFixed(1)} pixels.`}>
              <line x1="0" x2={W} y1={H - 10} y2={H - 10} className={styles.axis} />
              {ok && <polyline points={pts} className={styles.line} />}
              {ok && <line x1={x(vw)} x2={x(vw)} y1="6" y2={H - 10} className={styles.cursor} />}
              {ok && <circle cx={x(vw)} cy={y(at)} r="4" className={styles.dot} />}
            </svg>
            <figcaption>{at.toFixed(1)}px at {vw}px</figcaption>
          </figure>
          <p className={styles.sample} style={{ fontSize: `${at}px` }}>A headline that fits</p>
        </div>
      </div>
    </CloserFrame>
  );
}
