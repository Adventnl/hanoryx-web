import { useState } from 'react';
import { useCycle, useToggle } from '../hooks';
import c from './fields.module.css';

/* ============================================================
   05 · FIELDS — inputs, pickers and steppers, reimagined.
   The still side is a form that fills itself in, row by row, as you read.
   ============================================================ */

const ROWS = ['NAME', 'EMAIL', 'ROLE', 'TEAM', 'DATE', 'CODE', 'NOTE', 'SECRET'];

function Visual() {
  return (
    <div className={c.form} aria-hidden="true">
      <p>NEW RECORD</p>
      {ROWS.map((t, r) => (
        <div key={t} className={c.row} style={{ '--r': r }}><span>{t}</span><div className={c.fld}><i /></div></div>
      ))}
      <b className={c.send}>SUBMIT</b>
    </div>
  );
}

const WORDS = ['alpha', 'amber', 'anchor', 'beacon', 'bridge', 'cipher', 'delta', 'ember', 'falcon', 'harbor', 'island', 'junction'];
const ADDRESSES = ['12 Example Street', '48 Sample Road', '7 Placeholder Lane', '301 Test Avenue'];
const NAMES = ['Ada', 'Alan', 'Grace', 'Linus', 'Margaret'];

/* 1 */ function FloatingLabel() {
  return <label className={c.float}><input placeholder=" " /><span>Email address</span></label>;
}

/* 2 */ function UnderlineGrow() {
  return <label className={c.under}><input placeholder="Search the archive" aria-label="Underline field" /><i /></label>;
}

/* 3 */ function OneTimeCode() {
  const next = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1);
    e.target.value = v;
    if (v) e.target.nextElementSibling?.focus();
  };
  const back = (e) => { if (e.key === 'Backspace' && !e.target.value) e.target.previousElementSibling?.focus(); };
  return (
    <div className={c.otp} role="group" aria-label="One-time code">
      {Array.from({ length: 6 }, (_, i) => <input key={i} inputMode="numeric" maxLength={2} aria-label={`Digit ${i + 1}`} onChange={next} onKeyDown={back} />)}
    </div>
  );
}

/* 4 */ function PhoneMask() {
  const [v, setV] = useState('');
  const fmt = (raw) => {
    const d = raw.replace(/\D/g, '').slice(0, 10);
    return d.length > 6 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d.length > 3 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : d ? `(${d}` : '';
  };
  return <label className={c.mask}><span>PHONE</span><input value={v} inputMode="tel" placeholder="(000) 000-0000" onChange={(e) => setV(fmt(e.target.value))} /></label>;
}

/* 5 */ function CardNumber() {
  const [v, setV] = useState('');
  const digits = v.replace(/\D/g, '');
  const luhn = digits.length >= 12 && [...digits].reverse().reduce((s, d, i) => { let n = Number(d); if (i % 2) { n *= 2; if (n > 9) n -= 9; } return s + n; }, 0) % 10 === 0;
  return (
    <label className={c.card}>
      <span>CARD NUMBER</span>
      <input value={v} inputMode="numeric" placeholder="0000 0000 0000 0000" onChange={(e) => setV(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} />
      <em data-ok={luhn}>{luhn ? 'CHECK DIGIT OK' : 'CHECK DIGIT —'}</em>
    </label>
  );
}

/* 6 */ function PasswordMeter() {
  const [v, setV] = useState('');
  const score = Math.min(4, (v.length > 7) + (/[A-Z]/.test(v) && /[a-z]/.test(v)) + /\d/.test(v) + /[^A-Za-z0-9]/.test(v));
  return (
    <div className={c.meter}>
      <input type="text" value={v} placeholder="Type a password" aria-label="Password to rate" onChange={(e) => setV(e.target.value)} />
      <p>{Array.from({ length: 4 }, (_, i) => <i key={i} data-on={i < score} />)}</p>
      <output>{['EMPTY', 'WEAK', 'FAIR', 'GOOD', 'STRONG'][v ? score : 0]}</output>
    </div>
  );
}

/* 7 */ function TagInput() {
  const [tags, setTags] = useState(['design', 'motion']);
  const [t, setT] = useState('');
  return (
    <div className={c.tags}>
      {tags.map((x) => <span key={x}>{x}<button type="button" aria-label={`Remove ${x}`} onClick={() => setTags(tags.filter((y) => y !== x))}>×</button></span>)}
      <input value={t} placeholder="add…" aria-label="New tag" onChange={(e) => setT(e.target.value)} onKeyDown={(e) => {
        if (e.key === 'Enter' && t.trim()) { setTags([...tags, t.trim()]); setT(''); }
        if (e.key === 'Backspace' && !t) setTags(tags.slice(0, -1));
      }} />
    </div>
  );
}

/* 8 */ function Typeahead() {
  const [q, setQ] = useState('');
  const hits = q ? WORDS.filter((w) => w.startsWith(q.toLowerCase())).slice(0, 4) : [];
  return (
    <div className={c.ahead}>
      <input value={q} placeholder="Try “a” or “b”" aria-label="Typeahead" onChange={(e) => setQ(e.target.value)} />
      {hits.length > 0 && <ul>{hits.map((w) => <li key={w}><button type="button" onClick={() => setQ(w)}><b>{w.slice(0, q.length)}</b>{w.slice(q.length)}</button></li>)}</ul>}
    </div>
  );
}

/* 9 */ function SearchSuggest() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const list = ['recent: grid layouts', 'recent: spring easing', 'recent: focus rings', 'recent: skeletons'].filter((s) => s.includes(q.toLowerCase()));
  return (
    <div className={c.suggest} onFocus={() => setOpen(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 5 5" /></svg>
      <input value={q} placeholder="Search" aria-label="Search" onChange={(e) => setQ(e.target.value)} />
      {open && <ul>{list.map((s) => <li key={s}><button type="button" onClick={() => { setQ(s.replace('recent: ', '')); setOpen(false); }}>{s}</button></li>)}</ul>}
    </div>
  );
}

/* 10 */ function DatePicker() {
  const [d, setD] = useState(14);
  return (
    <div className={c.cal}>
      <header><b>SAMPLE MONTH</b><output>{d} / 30</output></header>
      <div>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((x, i) => <span key={i}>{x}</span>)}
        {Array.from({ length: 2 }, (_, i) => <i key={`b${i}`} />)}
        {Array.from({ length: 30 }, (_, i) => <button type="button" key={i} aria-pressed={d === i + 1} aria-label={`Day ${i + 1}`} onClick={() => setD(i + 1)}>{i + 1}</button>)}</div>
    </div>
  );
}

/* 11 */ function TimeDrum() {
  return (
    <div className={c.time}>
      {[24, 60].map((n, k) => (
        <ol key={n} tabIndex={0} aria-label={k ? 'Minutes' : 'Hours'}>{Array.from({ length: n }, (_, i) => <li key={i}>{String(i).padStart(2, '0')}</li>)}</ol>
      ))}
    </div>
  );
}

/* 12 */ function SwatchInput() {
  const sw = ['#ff3333', '#e8e9ee', '#9a9ba3', '#5c5d65', '#2a2b30', '#7d1010'];
  const [k, setK] = useState(0);
  return (
    <div className={c.swatch}>
      <div role="radiogroup" aria-label="Colour">{sw.map((x, i) => <button type="button" key={x} role="radio" aria-checked={k === i} aria-label={x} style={{ background: x }} onClick={() => setK(i)} />)}</div>
      <output>{sw[k].toUpperCase()}</output>
    </div>
  );
}

/* 13 */ function DropZone() {
  const [n, setN] = useState(0);
  return <button type="button" className={c.drop} onClick={() => setN(n + 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v4h16v-4" /></svg><span>{n ? `${n} file${n > 1 ? 's' : ''} added` : 'Drop files, or press'}</span></button>;
}

/* 14 */ function AutoGrow() {
  const [t, setT] = useState('Type a few lines.\nThe box grows with them.');
  return (
    <div className={c.grow}>
      <textarea value={t} rows={2} aria-label="Auto-growing text" onChange={(e) => { setT(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; }} />
      <output>{t.length} CHARS · {t.split('\n').length} LINES</output>
    </div>
  );
}

/* 15 */ function MentionBox() {
  const [t, setT] = useState('Thanks @');
  const open = /@\w*$/.test(t);
  return (
    <div className={c.mention}>
      <input value={t} aria-label="Message with mentions" onChange={(e) => setT(e.target.value)} />
      {open && <ul>{NAMES.map((n) => <li key={n}><button type="button" onClick={() => setT(t.replace(/@\w*$/, `@${n} `))}>@{n}</button></li>)}</ul>}
    </div>
  );
}

/* 16 */ function InlineEdit() {
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState('Untitled sketch');
  return edit
    ? <input className={c.inline} autoFocus value={v} aria-label="Title" onChange={(e) => setV(e.target.value)} onBlur={() => setEdit(false)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEdit(false); }} />
    : <button type="button" className={c.inlineBtn} onClick={() => setEdit(true)}>{v}<small>EDIT</small></button>;
}

/* 17 */ function QuantityStepper() {
  const [n, setN] = useState(1);
  return (
    <div className={c.qty}>
      <button type="button" aria-label="Fewer" disabled={n <= 0} onClick={() => setN(n - 1)}>−</button>
      <output aria-live="polite">{n}</output>
      <button type="button" aria-label="More" disabled={n >= 9} onClick={() => setN(n + 1)}>+</button>
    </div>
  );
}

/* 18 */ function Currency() {
  const [v, setV] = useState('1250');
  const shown = v ? Number(v).toLocaleString('en-US') : '';
  return <label className={c.money}><span>$</span><input value={shown} inputMode="numeric" aria-label="Amount" onChange={(e) => setV(e.target.value.replace(/\D/g, '').slice(0, 9))} /><em>USD</em></label>;
}

/* 19 */ function SelectList() {
  const [open, flip, set] = useToggle();
  const [k, setK] = useState(1);
  const opts = ['Draft', 'Review', 'Published'];
  return (
    <div className={c.select}>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={flip}>{opts[k]}<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" /></svg></button>
      {open && <ul role="listbox" aria-label="Status">{opts.map((o, i) => <li key={o} role="option" aria-selected={k === i}><button type="button" onClick={() => { setK(i); set(false); }}>{o}</button></li>)}</ul>}
    </div>
  );
}

/* 20 */ function MultiSelect() {
  const all = ['Email', 'Push', 'SMS', 'Digest'];
  const [on, setOn] = useState(['Email']);
  return (
    <div className={c.multi} role="group" aria-label="Channels">
      {all.map((x) => <button type="button" key={x} aria-pressed={on.includes(x)} onClick={() => setOn(on.includes(x) ? on.filter((y) => y !== x) : [...on, x])}>{x}</button>)}
      <output>{on.length} SELECTED</output>
    </div>
  );
}

/* 21 */ function RadioCards() {
  const [k, setK] = useState(1);
  return (
    <div className={c.plans} role="radiogroup" aria-label="Plan">
      {[['Solo', 'Free'], ['Team', 'Sample'], ['Org', 'Custom']].map(([a, b], i) => <button type="button" key={a} role="radio" aria-checked={k === i} onClick={() => setK(i)}><b>{a}</b><span>{b}</span></button>)}
    </div>
  );
}

/* 22 */ function CheckTree() {
  const [kids, setKids] = useState([true, false, true]);
  const all = kids.every(Boolean);
  const some = kids.some(Boolean);
  return (
    <div className={c.tree}>
      <label><input type="checkbox" checked={all} ref={(el) => { if (el) el.indeterminate = some && !all; }} onChange={() => setKids(kids.map(() => !all))} /><b>Permissions</b></label>
      {['Read', 'Write', 'Share'].map((t, i) => <label key={t}><input type="checkbox" checked={kids[i]} onChange={() => setKids(kids.map((x, j) => (j === i ? !x : x)))} />{t}</label>)}
    </div>
  );
}

/* 23 */ function SettingRows() {
  const [s, setS] = useState([true, false, true]);
  return (
    <ul className={c.rows}>
      {['Sounds', 'Reminders', 'Previews'].map((t, i) => (
        <li key={t}><span>{t}</span><button type="button" role="switch" aria-checked={s[i]} aria-label={t} onClick={() => setS(s.map((x, j) => (j === i ? !x : x)))}><i /></button></li>
      ))}
    </ul>
  );
}

/* 24 */ function SegmentedSize() {
  const [k, setK] = useState(2);
  return <div className={c.seg} role="radiogroup" aria-label="Size">{['S', 'M', 'L', 'XL'].map((t, i) => <button type="button" key={t} role="radio" aria-checked={k === i} onClick={() => setK(i)}>{t}</button>)}</div>;
}

/* 25 */ function PromptLine() {
  const [v, setV] = useState('');
  const [log, setLog] = useState(['ready']);
  return (
    <div className={c.prompt}>
      {log.slice(-2).map((l, i) => <p key={`${l}${i}`}>{l}</p>)}
      <label><span>›</span><input value={v} aria-label="Command prompt" placeholder="type, then Enter" onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && v) { setLog([...log, `ran: ${v}`]); setV(''); } }} /></label>
    </div>
  );
}

/* 26 */ function DotPin() {
  const [v, setV] = useState('');
  return (
    <label className={c.dots}>
      <input value={v} inputMode="numeric" maxLength={4} aria-label="PIN" onChange={(e) => setV(e.target.value.replace(/\D/g, ''))} />
      <p aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <i key={i} data-on={i < v.length} />)}</p>
    </label>
  );
}

/* 27 */ function SlugMaker() {
  const [t, setT] = useState('A title with Words!');
  const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (
    <div className={c.slug}>
      <input value={t} aria-label="Title" onChange={(e) => setT(e.target.value)} />
      <output>/{slug || '…'}</output>
    </div>
  );
}

/* 28 */ function UrlField() {
  const [p, setP] = useState('https');
  const [h, setH] = useState('example.test/page');
  return (
    <div className={c.url}>
      <select value={p} aria-label="Protocol" onChange={(e) => setP(e.target.value)}><option>https</option><option>http</option></select>
      <input value={h} aria-label="Address" onChange={(e) => setH(e.target.value)} />
      <output>{p}://{h}</output>
    </div>
  );
}

/* 29 */ function EmailDomain() {
  const [v, setV] = useState('ada@');
  const show = /@[\w.]*$/.test(v);
  return (
    <div className={c.domain}>
      <input value={v} inputMode="email" aria-label="Email" onChange={(e) => setV(e.target.value)} />
      {show && <p>{['example.test', 'sample.test', 'mail.test'].map((d) => <button type="button" key={d} onClick={() => setV(v.replace(/@[\w.]*$/, `@${d}`))}>@{d}</button>)}</p>}
    </div>
  );
}

/* 30 */ function AddressCard() {
  const [q, setQ] = useState('');
  const [pick, setPick] = useState(null);
  const hits = q && !pick ? ADDRESSES.filter((a) => a.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <div className={c.address}>
      <input value={pick || q} aria-label="Address search" placeholder="Search sample addresses" onChange={(e) => { setPick(null); setQ(e.target.value); }} />
      {hits.length > 0 && <ul>{hits.map((a) => <li key={a}><button type="button" onClick={() => setPick(a)}>{a}</button></li>)}</ul>}
      {pick && <p><i /><span>{pick}<small>SAMPLE ADDRESS</small></span></p>}
    </div>
  );
}

/* 31 */ function FilterChips() {
  const [on, setOn] = useState(['New']);
  return (
    <div className={c.chips} role="group" aria-label="Filters">
      {['New', 'Open', 'Mine', 'Starred', 'Archived'].map((x) => <button type="button" key={x} aria-pressed={on.includes(x)} onClick={() => setOn(on.includes(x) ? on.filter((y) => y !== x) : [...on, x])}>{on.includes(x) && '✓ '}{x}</button>)}
    </div>
  );
}

/* 32 */ function StarRating() {
  const [n, setN] = useState(3);
  const [hover, setHover] = useState(0);
  return (
    <div className={c.stars} role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => <button type="button" key={i} role="radio" aria-checked={n === i} aria-label={`${i} of 5`} data-on={i <= (hover || n)} onMouseEnter={() => setHover(i)} onClick={() => setN(i)}>★</button>)}
    </div>
  );
}

/* 33 */ function SymbolPicker() {
  const [t, setT] = useState('');
  return (
    <div className={c.symbols}>
      <output>{t || 'pick some'}</output>
      <div>{[...'→←↑↓✓✕★◆●■▲≈'].map((s) => <button type="button" key={s} aria-label={`Insert ${s}`} onClick={() => setT((x) => (x + s).slice(-12))}>{s}</button>)}</div>
    </div>
  );
}

/* 34 */ function VoiceField() {
  const [on, flip] = useToggle();
  return (
    <div className={c.voice} data-on={on}>
      <button type="button" aria-pressed={on} aria-label={on ? 'Stop listening' : 'Start listening'} onClick={flip}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg></button>
      <p aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</p>
      <output>{on ? 'LISTENING' : 'TAP TO SPEAK'}</output>
    </div>
  );
}

/* 35 */ function FormatBar() {
  const [f, setF] = useState({ b: false, i: false, u: false });
  return (
    <div className={c.format}>
      <div role="group" aria-label="Format">{[['b', 'B'], ['i', 'I'], ['u', 'U']].map(([k, t]) => <button type="button" key={k} aria-pressed={f[k]} aria-label={t === 'B' ? 'Bold' : t === 'I' ? 'Italic' : 'Underline'} data-k={k} onClick={() => setF({ ...f, [k]: !f[k] })}>{t}</button>)}</div>
      <p style={{ fontWeight: f.b ? 700 : 300, fontStyle: f.i ? 'italic' : 'normal', textDecoration: f.u ? 'underline' : 'none' }}>The quick sample sentence.</p>
    </div>
  );
}

/* 36 */ function SecretReveal() {
  const [show, flip] = useToggle();
  return (
    <label className={c.secret}>
      <input type={show ? 'text' : 'password'} defaultValue="sample-secret" aria-label="Secret" />
      <button type="button" aria-pressed={show} aria-label={show ? 'Hide' : 'Show'} onClick={flip}>{show ? 'HIDE' : 'SHOW'}</button>
    </label>
  );
}

/* 37 */ function RotatingPrompt() {
  const hints = ['Search for a page', 'Ask a question', 'Find a component', 'Jump to a section'];
  const k = useCycle(hints.length, 2200);
  const [v, setV] = useState('');
  return (
    <label className={c.rotate}>
      <input value={v} aria-label="Prompt with rotating hints" onChange={(e) => setV(e.target.value)} />
      {!v && <span key={k}>{hints[k]}</span>}
    </label>
  );
}

/* 38 */ function FindReplace() {
  const [a, setA] = useState('quick');
  const [b, setB] = useState('slow');
  const sample = 'A quick pass, then a quick fix.';
  return (
    <div className={c.find}>
      <div><input value={a} aria-label="Find" onChange={(e) => setA(e.target.value)} /><input value={b} aria-label="Replace with" onChange={(e) => setB(e.target.value)} /></div>
      <p>{a ? sample.split(a).join(`«${b}»`) : sample}</p>
    </div>
  );
}

/* 39 */ function StateRows() {
  return (
    <div className={c.states}>
      {[['bad', 'Required', 'error'], ['ok', 'Looks good', 'ok'], ['warn', 'Check the format', 'warn']].map(([k, m, s]) => (
        <label key={k} data-s={s}><input defaultValue={k === 'ok' ? 'valid' : ''} placeholder={m === 'Required' ? 'name' : 'value'} aria-label={`${s} state`} aria-invalid={s === 'error'} /><span>{m}</span></label>
      ))}
    </div>
  );
}

/* 40 */ function CounterRing() {
  const [v, setV] = useState('Plan the next');
  const max = 40;
  const left = max - v.length;
  return (
    <div className={c.ring}>
      <input value={v} maxLength={max} aria-label="Limited text" onChange={(e) => setV(e.target.value)} />
      <svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" pathLength="1" /><circle className={c.arc} cx="18" cy="18" r="15" pathLength="1" style={{ strokeDasharray: `${v.length / max} 1` }} data-low={left < 8} /></svg>
      <output>{left}</output>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Floating label', FloatingLabel, 'type'], ['Underline grow', UnderlineGrow, 'type'], ['One-time code', OneTimeCode, 'type'], ['Phone mask', PhoneMask, 'type'],
    ['Card number', CardNumber, 'type'], ['Password meter', PasswordMeter, 'type'], ['Tag input', TagInput, 'type'], ['Typeahead', Typeahead, 'type'],
    ['Search suggest', SearchSuggest, 'type'], ['Date picker', DatePicker, 'click'], ['Time drum', TimeDrum, 'scroll'], ['Swatch input', SwatchInput, 'click'],
    ['Drop zone', DropZone, 'click'], ['Auto-grow area', AutoGrow, 'type'], ['Mention box', MentionBox, 'type'], ['Inline edit', InlineEdit, 'click'],
    ['Quantity stepper', QuantityStepper, 'click'], ['Currency field', Currency, 'type'], ['Select list', SelectList, 'click'], ['Multi select', MultiSelect, 'click'],
    ['Radio cards', RadioCards, 'click'], ['Check tree', CheckTree, 'click'], ['Setting rows', SettingRows, 'click'], ['Segmented size', SegmentedSize, 'click'],
    ['Prompt line', PromptLine, 'type'], ['Dot pin', DotPin, 'type'], ['Slug maker', SlugMaker, 'type'], ['URL field', UrlField, 'type'],
    ['Email domain', EmailDomain, 'type'], ['Address card', AddressCard, 'type'], ['Filter chips', FilterChips, 'click'], ['Star rating', StarRating, 'click'],
    ['Symbol picker', SymbolPicker, 'click'], ['Voice field', VoiceField, 'click'], ['Format bar', FormatBar, 'click'], ['Secret reveal', SecretReveal, 'click'],
    ['Rotating prompt', RotatingPrompt, 'type'], ['Find replace', FindReplace, 'type'], ['State rows', StateRows, 'type'], ['Counter ring', CounterRing, 'type'],
  ],
};
