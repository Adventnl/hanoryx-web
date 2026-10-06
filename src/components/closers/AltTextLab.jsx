import { useState } from 'react';
import clsx from 'clsx';
import { Check, Info, X } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './AltTextLab.module.css';

const BARS = [12, 18, 25, 21, 30];

/* Four small pictures, each a different problem for the person who writes the alt text. */
const PICTURES = [
  {
    id: 'chart', kind: 'informative', label: 'A chart', good: 'Orders per day rose through the week, from 12 on Monday to 30 on Friday, with a small dip on Thursday.',
    ask: 'It carries information. What is the point of it?',
    art: (
      <svg viewBox="0 0 160 90" role="presentation" focusable="false">
        <path d="M14 76 H150" className={styles.ax} />
        {BARS.map((v, i) => <rect key={i} x={26 + i * 25} y={76 - v * 2} width="14" height={v * 2} className={i === 4 ? styles.hot : styles.bar} />)}
        {['M', 'T', 'W', 'T', 'F'].map((d, i) => <text key={i} x={33 + i * 25} y="86" className={styles.tx}>{d}</text>)}
      </svg>
    ),
  },
  {
    id: 'rule', kind: 'decorative', label: 'An ornament', good: '',
    ask: 'It is only decoration. What should a screen reader say about it?',
    art: (
      <svg viewBox="0 0 160 90" role="presentation" focusable="false">
        <path d="M14 45 H66 M94 45 H146" className={styles.ax} />
        <path d="M80 33 L92 45 L80 57 L68 45 Z" className={styles.hot} />
      </svg>
    ),
  },
  {
    id: 'search', kind: 'functional', label: 'A button’s icon', good: 'Search',
    ask: 'It is the only thing inside a button. What does pressing it do?',
    art: (
      <svg viewBox="0 0 160 90" role="presentation" focusable="false">
        <rect x="48" y="22" width="64" height="46" rx="23" className={styles.btn} />
        <circle cx="76" cy="43" r="9" className={styles.ico} />
        <path d="M83 50 L92 59" className={styles.ico} />
      </svg>
    ),
  },
  {
    id: 'keys', kind: 'informative', label: 'A picture', good: 'A keyboard with the Tab key highlighted.',
    ask: 'It illustrates a point in the text. What does it show?',
    art: (
      <svg viewBox="0 0 160 90" role="presentation" focusable="false">
        {[0, 1, 2].map((r) => Array.from({ length: 8 - r }, (_, c) => <rect key={`${r}-${c}`} x={14 + c * 17 + r * 6} y={18 + r * 19} width="14" height="15" rx="2" className={r === 1 && c === 0 ? styles.hotKey : styles.key} />))}
        <rect x="42" y="75" width="74" height="9" rx="2" className={styles.key} />
      </svg>
    ),
  },
];

function review(p, raw) {
  const t = raw.trim();
  const out = [];
  if (p.kind === 'decorative') {
    out.push(t === '' ? { ok: true, msg: 'Empty, which is right. A screen reader skips it and nothing is lost.' } : { ok: false, msg: 'A decorative picture should have empty alt text, so it is skipped rather than read out.' });
    return out;
  }
  if (t === '') return [{ ok: false, msg: 'Empty means “skip this”. But this picture does something or says something, so it needs words.' }];
  if (/^(an? )?(image|picture|photo|graphic|icon) of\b/i.test(t)) out.push({ ok: false, msg: 'Leave out “image of”. A screen reader already announces that it is an image.' });
  if (t.length > 125) out.push({ ok: false, msg: 'Long. Aim for a sentence, and put anything more in the text next to the picture.' });
  if (t.length < 5) out.push({ ok: p.kind === 'functional', msg: p.kind === 'functional' ? 'Short is fine for a control, as long as it names the action.' : 'Very short. What would someone who cannot see it need to know?' });
  if (p.id === 'search' && /(magnif|glass|icon|lens)/i.test(t)) out.push({ ok: false, msg: 'Describe what pressing it does, not what it looks like: “Search”.' });
  if (p.id === 'chart' && !/\d|rise|rose|grow|increase|trend|peak|climb|up/i.test(t)) out.push({ ok: false, msg: 'Say what the chart shows: the trend, or the headline figure.' });
  if (!out.length) out.push({ ok: true, msg: 'Short, specific, and it says why the picture is there.' });
  return out;
}

/** Write the alt text for four pictures, each a different problem: a chart, an
 *  ornament, an icon in a button, an illustration. Press Check for a short review
 *  against common rules, then see one way each could be written. */
export default function AltTextLab({ tag, title, lede, onward }) {
  const [text, setText] = useState({});
  const [checked, setChecked] = useState({});
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <ul className={styles.grid} {...fx('alttext.grid')}>
        {PICTURES.map((p) => {
          const res = checked[p.id] ? review(p, text[p.id] || '') : null;
          const ok = res?.every((r) => r.ok);
          return (
            <li key={p.id} className={clsx(styles.card, res && (ok ? styles.ok : styles.no))}>
              <div className={styles.art} aria-hidden="true">{p.art}</div>
              <p className={shared.label}>{p.label} · {p.kind}</p>
              <p className={styles.ask}>{p.ask}</p>
              <label className={styles.field}>
                <span className="sr-only">Alt text for {p.label.toLowerCase()}</span>
                <textarea rows={2} value={text[p.id] || ''} onChange={(e) => { setText((t) => ({ ...t, [p.id]: e.target.value })); setChecked((c) => ({ ...c, [p.id]: false })); }} placeholder={p.kind === 'decorative' ? 'Leave empty, or type something to see' : 'Write the alt text'} spellCheck />
              </label>
              <button type="button" className={shared.btn} onClick={() => setChecked((c) => ({ ...c, [p.id]: true }))}>Check</button>
              {res && (
                <ul className={styles.notes} aria-live="polite">
                  {res.map((r) => <li key={r.msg}>{r.ok ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}<span>{r.msg}</span></li>)}
                  <li className={styles.sugg}><Info size={13} aria-hidden="true" /><span>One way: {p.good === '' ? <em>(empty)</em> : `“${p.good}”`}</span></li>
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </CloserFrame>
  );
}
