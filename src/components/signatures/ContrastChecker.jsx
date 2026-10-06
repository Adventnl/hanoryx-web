import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowLeftRight, Check, Copy, X } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useCopy } from '../../hooks/useCopy';
import { contrastRatio, nearestPassing, parseHex, toHex } from '../../utils/colour';
import { fx } from '../../utils/fx';
import tool from './tool.module.css';
import styles from './ContrastChecker.module.css';

const TESTS = [
  { id: 'aa', label: 'Body text', level: 'AA', min: 4.5, note: 'Text under 24px (or 19px bold).' },
  { id: 'aaa', label: 'Body text', level: 'AAA', min: 7, note: 'The stricter, enhanced level.' },
  { id: 'lg-aa', label: 'Large text', level: 'AA', min: 3, note: '24px and over, or 19px bold and over.' },
  { id: 'lg-aaa', label: 'Large text', level: 'AAA', min: 4.5, note: 'Large text, enhanced level.' },
  { id: 'ui', label: 'Interface parts', level: 'AA', min: 3, note: 'Borders, icons and focus rings that carry meaning.' },
];

/** Two colours in, the WCAG contrast ratio out, with a verdict for each kind of
 *  thing that has to be read, and the nearest passing colour when it falls short.
 *  Runs entirely in the page; nothing is sent anywhere. */
export default function ContrastChecker({ eyebrow, title, intro, note, start = { fg: '#9a9ea6', bg: '#0a0b0d' } }) {
  const [fg, setFg] = useState(start.fg);
  const [bg, setBg] = useState(start.bg);
  const [copied, copy] = useCopy();
  const f = parseHex(fg);
  const b = parseHex(bg);
  const ratio = f && b ? contrastRatio(f, b) : null;
  const near = useMemo(() => (f && b && ratio < 4.5 ? nearestPassing(f, b, 4.5) : null), [f, b, ratio]);
  const swap = () => { setFg(bg); setBg(fg); };
  const summary = ratio
    ? `Foreground ${toHex(f)} on background ${toHex(b)}: ${ratio.toFixed(2)}:1. ${TESTS.map((t) => `${t.label} ${t.level}: ${ratio >= t.min ? 'pass' : 'fail'}`).join('; ')}.`
    : '';

  const colourField = (label, value, set, ok) => (
    <label className={tool.field}>
      <span>{label}</span>
      <span className={tool.colour}>
        <input type="color" value={ok ? toHex(ok) : '#000000'} onChange={(e) => set(e.target.value)} aria-label={`${label} colour picker`} />
        <input value={value} onChange={(e) => set(e.target.value)} spellCheck={false} autoComplete="off" aria-invalid={!ok} aria-label={`${label} as hex`} />
      </span>
    </label>
  );

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={tool.rig} {...fx('contrast.rig')}>
        <div className={tool.stack}>
          {colourField('Text colour', fg, setFg, f)}
          {colourField('Background', bg, setBg, b)}
          <div className={tool.row}>
            <button type="button" className={styles.btn} onClick={swap}><ArrowLeftRight size={14} aria-hidden="true" /> Swap</button>
            <button type="button" className={styles.btn} onClick={() => copy(summary)} disabled={!ratio}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy the result'}</button>
          </div>
          {(!f || !b) && <p className={tool.err} role="alert">Enter a hex colour such as #9a9ea6 or #fff.</p>}
          {near && (
            <div className={styles.near} {...fx('contrast.nearest')}>
              <p className={tool.k}>Nearest colour that passes body text (4.5 : 1)</p>
              <ul>
                {near.darker && <li><i style={{ background: toHex(near.darker) }} aria-hidden="true" /><code>{toHex(near.darker)}</code><span>a little darker</span><button type="button" onClick={() => setFg(toHex(near.darker))}>Use it</button></li>}
                {near.lighter && <li><i style={{ background: toHex(near.lighter) }} aria-hidden="true" /><code>{toHex(near.lighter)}</code><span>a little lighter</span><button type="button" onClick={() => setFg(toHex(near.lighter))}>Use it</button></li>}
                {!near.darker && !near.lighter && <li><span>No colour of this hue reaches 4.5 : 1 against this background. Try another background.</span></li>}
              </ul>
            </div>
          )}
        </div>

        <div className={tool.out}>
          <div className={styles.preview} style={{ background: b ? toHex(b) : undefined, color: f ? toHex(f) : undefined, borderColor: f ? toHex(f) : undefined }} {...fx('contrast.preview')}>
            <p className={styles.sample}>The quick brown fox</p>
            <p className={styles.para}>Small text is where contrast is lost first. Read this line at the size you would really use.</p>
            <span className={styles.chip}>An interface part</span>
          </div>
          <p className={tool.big} aria-live="polite">{ratio ? ratio.toFixed(2) : '—'}<small> : 1</small></p>
          <div className={tool.verdicts} {...fx('contrast.verdicts')}>
            {TESTS.map((t) => {
              const ok = ratio !== null && ratio >= t.min;
              return (
                <div key={t.id} className={clsx(tool.verdict, ratio !== null && !ok && tool.fail)}>
                  <b>{ratio === null ? null : ok ? <Check size={15} aria-hidden="true" /> : <X size={15} aria-hidden="true" />}{t.label} · {t.level}</b>
                  <span>{ratio === null ? t.note : `${ok ? 'Passes' : 'Fails'} at ${t.min} : 1. ${t.note}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {note && <p className={tool.note}>{note}</p>}
    </div>
  );
}
