import { useMemo, useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './TokenPlayground.module.css';

const START = { accent: '#d92b2b', radius: 10, space: 8, duration: 240, size: 16 };

/** Change four tokens and watch a small interface follow. The values are set
 *  on the preview alone, as custom properties — which is exactly how a real
 *  design system restyles everything at once. */
export default function TokenPlayground({ tag, title, lede, onward }) {
  const [t, setT] = useState(START);
  const [copied, copy] = useCopy();
  const [shown, setShown] = useState(false);
  const set = (k) => (e) => setT((s) => ({ ...s, [k]: k === 'accent' ? e.target.value : Number(e.target.value) }));
  const css = useMemo(() => `:root {\n  --accent: ${t.accent};\n  --radius: ${t.radius}px;\n  --space: ${t.space}px;\n  --duration: ${t.duration}ms;\n  --size: ${t.size}px;\n}`, [t]);
  const vars = { '--accent': t.accent, '--radius': `${t.radius}px`, '--space': `${t.space}px`, '--duration': `${t.duration}ms`, '--size': `${t.size}px` };

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('tokens.playground')}>
        <div className={styles.form}>
          <label className={tool.field}><span>Accent <b>{t.accent}</b></span><input type="color" value={t.accent} onChange={set('accent')} className={styles.colour} /></label>
          <label className={tool.field}><span>Corner radius <b>{t.radius}px</b></span><input type="range" min={0} max={24} value={t.radius} onChange={set('radius')} /></label>
          <label className={tool.field}><span>Space unit <b>{t.space}px</b></span><input type="range" min={4} max={14} value={t.space} onChange={set('space')} /></label>
          <label className={tool.field}><span>Transition <b>{t.duration}ms</b></span><input type="range" min={0} max={600} step={20} value={t.duration} onChange={set('duration')} /></label>
          <label className={tool.field}><span>Base text <b>{t.size}px</b></span><input type="range" min={13} max={20} value={t.size} onChange={set('size')} /></label>
          <div className={shared.row}>
            <button type="button" className={shared.btn} onClick={() => setT(START)}><RotateCcw size={14} aria-hidden="true" /> Reset</button>
            <button type="button" className={shared.btn} onClick={() => copy(css)}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy the tokens'}</button>
          </div>
        </div>
        <div className={styles.preview} style={vars} {...fx('tokens.preview')}>
          <article className={styles.card}>
            <p className={styles.eyebrow}>Order 30211</p>
            <h3>Refund requested</h3>
            <p className={styles.body}>The customer reports the item arrived damaged. Check the photo and approve or decline.</p>
            <label className={styles.field}><span>Reason</span><input defaultValue="Arrived damaged" /></label>
            <div className={styles.actions}>
              <button type="button" className={styles.primary}>Approve</button>
              <button type="button" className={styles.ghost} onClick={() => setShown((s) => !s)} aria-expanded={shown}>Details</button>
              <span className={styles.chip}>Pending</span>
            </div>
            <div className={styles.details} hidden={!shown}>Opened with the duration token. Set it to zero and it simply appears.</div>
          </article>
          <pre className={tool.pre} tabIndex={0}><code>{css}</code></pre>
        </div>
      </div>
    </CloserFrame>
  );
}
