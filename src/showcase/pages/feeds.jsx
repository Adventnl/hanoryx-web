import { useState } from 'react';
import { pad2, useCycle, useTick } from '../hooks';
import { Ico } from '../icons';
import c from './feeds.module.css';

/* ============================================================
   48 · FEEDS — lists, chats and notification streams.
   The still side is a chat stream that scrolls past as the scroll advances,
   the message in the middle of the frame lit and the ones leaving it fading
   out. The forty-two specimens are the parts of a stream: list rows you pick,
   reorder or expand, chat bubbles and their small furniture, and the ways a
   notification arrives and goes. Everything that takes input is a real button
   or field, and the streams that would be arriving do so while on screen.
   ============================================================ */

const MSGS = [['Ana', 'Standup in five?'], ['You', 'Yes — joining now'], ['Kofi', 'Deploy is green'], ['You', 'Nice. Shipping.'], ['Mara', 'Can someone review #482?'], ['You', 'On it'], ['Ana', 'Thanks all'], ['Kofi', 'Lunch?']];
function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visFeed}>
        <div className={c.visTrack}>
          {MSGS.map(([w, t], k) => <p key={k} data-me={w === 'You'} style={{ '--k': k }}><small>{w}</small>{t}</p>)}
        </div>
      </div>
      <small>8 MESSAGES · 1 STREAM</small>
    </div>
  );
}

const cx = (...a) => a.filter(Boolean).join(' ');
const Fd = ({ label, children, className, ...r }) => <div className={cx(c.fd, className)} role="group" aria-label={label} {...r}>{children}</div>;
const Av = ({ h, s }) => <b className={c.av} style={{ '--h': h }}>{s}</b>;
const NAMES = ['Ana Reyes', 'Kofi Mensah', 'Mara Lind', 'Ravi Shah', 'Sol Park'];

/* 01 */ function Contacts() {
  const [s, setS] = useState(1);
  return <Fd label="Contacts" className={c.list}>{NAMES.slice(0, 4).map((n, k) => <button key={n} type="button" className={c.row} aria-pressed={s === k} onClick={() => setS(k)}><Av h={k * 70} s={n[0]} /><span><em>{n}</em><small>{['Design', 'Ops', 'Eng', 'Sales'][k]}</small></span>{s === k ? <Ico n="check" /> : null}</button>)}</Fd>;
}

/* 02 */ function Letters() {
  const G = [['A', ['Ana', 'Anders']], ['K', ['Kofi']], ['M', ['Mara', 'Milo']]];
  return <Fd label="Grouped list" className={c.list}>{G.map(([l, ns]) => <div key={l}><b className={c.hd}>{l}</b>{ns.map((n) => <span key={n} className={c.plain}>{n}</span>)}</div>)}</Fd>;
}

/* 03 */ function RowActions() {
  const [a, setA] = useState('');
  return (
    <Fd label="Row actions" className={c.list}>
      {['Invoice 204', 'Invoice 205'].map((t) => (
        <div key={t} className={c.actRow}><span>{t}</span><span className={c.acts}>{['Open', 'Pay', 'Void'].map((x) => <button key={x} type="button" aria-label={`${x} ${t}`} onClick={() => setA(`${x} ${t.split(' ')[1]}`)}>{x}</button>)}</span></div>
      ))}
      <small className={c.m}>{a || 'Hover or focus a row'}</small>
    </Fd>
  );
}

/* 04 */ function Reorder() {
  const [l, setL] = useState(['Intro', 'Pricing', 'FAQ', 'Contact']);
  const mv = (i, d) => setL((a) => { const b = [...a]; const j = i + d; if (j < 0 || j >= b.length) return a; [b[i], b[j]] = [b[j], b[i]]; return b; });
  return (
    <Fd label="Reorder list" className={c.list}>
      {l.map((t, i) => <div key={t} className={c.row}><span>{t}</span><span className={c.ud}><button type="button" aria-label={`Move ${t} up`} disabled={i === 0} onClick={() => mv(i, -1)}><Ico n="up" /></button><button type="button" aria-label={`Move ${t} down`} disabled={i === l.length - 1} onClick={() => mv(i, 1)}><Ico n="down" /></button></span></div>)}
    </Fd>
  );
}

/* 05 */ function Multi() {
  const [on, setOn] = useState([0, 2]);
  const flip = (k) => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  return (
    <Fd label="Multi-select list" className={c.list}>
      {['Q3 report', 'Logo.svg', 'Notes.md', 'Budget.xls'].map((t, k) => <button key={t} type="button" role="checkbox" aria-checked={on.includes(k)} className={c.row} onClick={() => flip(k)}><i className={c.tick}>{on.includes(k) ? '✓' : ''}</i><span>{t}</span></button>)}
      <div className={c.bar} data-on={on.length > 0}>{on.length} selected<button type="button" onClick={() => setOn([])}>Clear</button></div>
    </Fd>
  );
}

/* 06 */ function Accordion() {
  const [o, setO] = useState(0);
  const Q = [['Shipping', '3–5 days, tracked.'], ['Returns', '30 days, free.'], ['Warranty', 'Two years.']];
  return <Fd label="Expandable rows" className={c.list}>{Q.map(([q, a], k) => <div key={q}><button type="button" className={c.row} aria-expanded={o === k} onClick={() => setO(o === k ? -1 : k)}><span>{q}</span><Ico n="down" /></button>{o === k && <p className={c.ans}>{a}</p>}</div>)}</Fd>;
}

/* 07 */ function More() {
  const [n, setN] = useState(3);
  return <Fd label="Load more" className={c.list}>{Array.from({ length: n }, (_, k) => <span key={k} className={cx(c.plain, c.fresh)}>Result {k + 1}</span>)}<button type="button" className={c.more} onClick={() => setN((v) => (v >= 7 ? 3 : v + 2))}>{n >= 7 ? 'Reset' : 'Load more'}</button></Fd>;
}

/* 08 */ function SortTable() {
  const [by, setBy] = useState(1);
  const R = [['Ana', 42, 'Oct 2'], ['Kofi', 17, 'Oct 9'], ['Mara', 88, 'Sep 28'], ['Ravi', 31, 'Oct 12']];
  const rows = [...R].sort((a, b) => (typeof a[by] === 'number' ? b[by] - a[by] : String(a[by]).localeCompare(String(b[by]))));
  return (
    <Fd label="Sortable table" className={c.list}>
      <div className={cx(c.tr, c.th)}>{['Name', 'Score', 'Seen'].map((h, k) => <button key={h} type="button" aria-pressed={by === k} onClick={() => setBy(k)}>{h}{by === k ? ' ↓' : ''}</button>)}</div>
      {rows.map(([a, b, d]) => <div key={a} className={c.tr}><span>{a}</span><span>{b}</span><span>{d}</span></div>)}
    </Fd>
  );
}

/* 09 */ function FilterFeed() {
  const [q, setQ] = useState('');
  const P = ['Launch day notes', 'Pricing update', 'Hiring: designer', 'Launch retro', 'Office move'];
  const hit = P.filter((p) => p.toLowerCase().includes(q.toLowerCase()));
  return (
    <Fd label="Filtered feed" className={c.list}>
      <label className={c.search}><Ico n="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter" aria-label="Filter posts" /></label>
      {hit.map((p) => <span key={p} className={c.plain}>{p}</span>)}
      <small className={c.m}>{hit.length} of {P.length}</small>
    </Fd>
  );
}

/* 10 */ function PinTop() {
  const [pins, setPins] = useState([2]);
  const L = ['Roadmap', 'Minutes', 'Brand kit', 'Invoices'];
  const order = [...L.keys()].sort((a, b) => Number(pins.includes(b)) - Number(pins.includes(a)) || a - b);
  return (
    <Fd label="Pin to top" className={c.list}>
      {order.map((k) => <div key={L[k]} className={c.row}><span>{L[k]}</span><button type="button" className={c.pin} aria-pressed={pins.includes(k)} aria-label={`${pins.includes(k) ? 'Unpin' : 'Pin'} ${L[k]}`} onClick={() => setPins((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]))}><Ico n="pin" /></button></div>)}
    </Fd>
  );
}

/* 11 */ function Unread() {
  const [u, setU] = useState([3, 0, 12, 1]);
  const L = ['General', 'Design', 'Eng', 'Random'];
  return (
    <Fd label="Unread badges" className={c.list}>
      {L.map((t, k) => <button key={t} type="button" className={c.row} data-unread={u[k] > 0} onClick={() => setU((a) => a.map((x, i) => (i === k ? 0 : x)))}><span># {t}</span>{u[k] > 0 && <em className={c.badge}>{u[k]}</em>}</button>)}
      <small className={c.m}>{u.reduce((a, b) => a + b, 0)} unread</small>
    </Fd>
  );
}

/* 12 */ function TimelineFeed() {
  const E = [['9:02', 'Deploy finished'], ['9:40', 'Ana joined'], ['10:15', 'Invoice paid'], ['11:30', 'Backup done']];
  return <Fd label="Timeline" className={c.tl}>{E.map(([t, x]) => <div key={t}><i /><small>{t}</small><span>{x}</span></div>)}</Fd>;
}

/* 13 */ function Log() {
  const A = [['plus', 'Ana created Board 4'], ['pen', 'Kofi edited Pricing'], ['check', 'Mara closed #482'], ['trash', 'Ravi removed Draft']];
  return <Fd label="Activity log" className={c.list}>{A.map(([i, t]) => <div key={t} className={c.row}><span className={c.ic}><Ico n={i} /></span><span>{t}</span></div>)}</Fd>;
}

/* 14 */ function Density() {
  const [d, setD] = useState(false);
  return (
    <Fd label="Density" className={cx(c.list, d && c.tight)}>
      <div className={c.pairR}><b className={c.hd}>Inbox</b><button type="button" className={c.chip} aria-pressed={d} onClick={() => setD((v) => !v)}>{d ? 'Compact' : 'Comfy'}</button></div>
      {NAMES.slice(0, 4).map((n) => <div key={n} className={c.row}><span>{n}</span><small>2m</small></div>)}
    </Fd>
  );
}

/* 15 */ function Empty() {
  const [q, setQ] = useState('zzz');
  return (
    <Fd label="Empty results" className={c.center}>
      <label className={c.search}><Ico n="search" /><input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" /></label>
      {q === 'zzz' ? <><span className={c.art}><Ico n="search" /></span><b>No results for “zzz”</b><small className={c.m}>Try fewer letters</small></> : <span className={c.plain}>Showing “{q}”</span>}
    </Fd>
  );
}

/* 16 */ function Bubbles() {
  const [m, setM] = useState(MSGS.slice(0, 3));
  const [v, setV] = useState('');
  const send = (e) => { e.preventDefault(); if (v.trim()) { setM((a) => [...a.slice(-3), ['You', v.trim()]]); setV(''); } };
  return (
    <Fd label="Chat thread" className={c.chat}>
      <div>{m.map(([w, t], k) => <p key={`${k}${t}`} data-me={w === 'You'}>{t}</p>)}</div>
      <form onSubmit={send}><input value={v} onChange={(e) => setV(e.target.value)} placeholder="Message" aria-label="Message" /><button type="submit" aria-label="Send"><Ico n="right" /></button></form>
    </Fd>
  );
}

/* 17 */ function Typing() {
  return <Fd label="Typing" className={c.chat} role="img"><div><p>Are you free later?</p><p data-me="true" className={c.typing}><i /><i /><i /></p></div><small className={c.m}>Ana is typing…</small></Fd>;
}

/* 18 */ function Reactions() {
  const [on, setOn] = useState({ '👍': 2, '🎉': 1 });
  const add = (e) => setOn((a) => ({ ...a, [e]: (a[e] ?? 0) + 1 }));
  return (
    <Fd label="Reactions" className={c.chat}>
      <div><p>Release is live</p></div>
      <div className={c.react}>{Object.entries(on).map(([e, n]) => <button key={e} type="button" aria-label={`${e} ${n}`} onClick={() => add(e)}>{e} {n}</button>)}</div>
      <div className={c.react}>{['👍', '🎉', '🔥', '👀'].map((e) => <button key={e} type="button" aria-label={`React ${e}`} className={c.ghostBtn} onClick={() => add(e)}>{e}</button>)}</div>
    </Fd>
  );
}

/* 19 */ function Quote() {
  const [q, setQ] = useState(null);
  const M = ['Can you send the file?', 'It is in the drive', 'Which folder?'];
  return (
    <Fd label="Quote reply" className={c.chat}>
      <div>{M.map((t, k) => <button key={t} type="button" className={c.msgBtn} data-me={k === 1} aria-label={`Reply to: ${t}`} onClick={() => setQ(t)}>{t}</button>)}</div>
      {q && <div className={c.quote}><span>↩ {q}</span><button type="button" aria-label="Cancel reply" onClick={() => setQ(null)}>×</button></div>}
    </Fd>
  );
}

/* 20 */ function Ticks() {
  const [s, setS] = useState(0);
  const L = ['Sending', 'Sent', 'Delivered', 'Read'];
  return (
    <Fd label="Read receipts" className={c.chat}>
      <div><p data-me="true">See you at six <button type="button" className={c.tickBtn} data-s={s} aria-label={`${L[s]}. Click to advance`} onClick={() => setS((v) => (v + 1) % 4)}>{['◔', '✓', '✓✓', '✓✓'][s]}</button></p></div>
      <small className={c.m}>{L[s]}</small>
    </Fd>
  );
}

/* 21 */ function Voice() {
  const [on, setOn] = useState(true);
  const n = useTick(250);
  const [t0, setT0] = useState(0);
  const p = on ? Math.min(1, ((n - t0) % 48) / 40) : 0.3;
  return (
    <Fd label="Voice note" className={c.chat}>
      <div className={c.voice}>
        <button type="button" aria-pressed={on} aria-label={on ? 'Pause' : 'Play'} onClick={() => { setOn((v) => !v); setT0(n); }}><Ico n={on ? 'pause' : 'play'} /></button>
        <span>{Array.from({ length: 24 }, (_, k) => <i key={k} data-on={k / 24 < p} style={{ height: `${25 + Math.abs(Math.sin(k * 1.3)) * 70}%` }} />)}</span>
        <small>0:{pad2(Math.round(p * 24))}</small>
      </div>
    </Fd>
  );
}

/* 22 */ function Days() {
  return <Fd label="Day dividers" className={c.chat}><div><span className={c.day}>Yesterday</span><p>Notes sent</p><p data-me="true">Got them</p><span className={c.day}>Today</span><p>Morning!</p></div></Fd>;
}

/* 23 */ function Attach() {
  const [f, setF] = useState(['plan.pdf', 'hero.png']);
  return (
    <Fd label="Attachments" className={c.chat}>
      <div className={c.files}>{f.map((x) => <span key={x}>{x}<button type="button" aria-label={`Remove ${x}`} onClick={() => setF((a) => a.filter((y) => y !== x))}>×</button></span>)}</div>
      <button type="button" className={c.more} onClick={() => setF(['plan.pdf', 'hero.png', 'notes.md'].slice(0, f.length + 1 > 3 ? 1 : f.length + 1))}>Attach</button>
    </Fd>
  );
}

/* 24 */ function ThreadFold() {
  const [o, setO] = useState(false);
  return (
    <Fd label="Thread" className={c.chat}>
      <div><p>Ship on Friday?</p>{o ? <><p data-me="true" className={c.sub}>Yes</p><p className={c.sub}>After QA</p><p data-me="true" className={c.sub}>Ok</p></> : null}</div>
      <button type="button" className={c.more} aria-expanded={o} onClick={() => setO((v) => !v)}>{o ? 'Hide replies' : '3 replies'}</button>
    </Fd>
  );
}

/* 25 */ function Channels() {
  const [s, setS] = useState(1);
  const C = [['general', 0], ['design', 4], ['eng', 0], ['ops', 1]];
  return <Fd label="Channels" className={c.list}>{C.map(([n, u], k) => <button key={n} type="button" className={c.row} aria-current={s === k ? 'true' : undefined} data-unread={u > 0} onClick={() => setS(k)}><span># {n}</span>{u > 0 && s !== k ? <em className={c.badge}>{u}</em> : null}</button>)}</Fd>;
}

/* 26 */ function Mention() {
  const [v, setV] = useState('Thanks @');
  const at = /@(\w*)$/.exec(v);
  const sug = at ? NAMES.filter((n) => n.toLowerCase().startsWith(at[1].toLowerCase())).slice(0, 3) : [];
  return (
    <Fd label="Mention suggestions" className={c.list}>
      <input className={c.in} value={v} onChange={(e) => setV(e.target.value)} aria-label="Message with mentions" />
      {sug.length ? <div className={c.pop}>{sug.map((n) => <button key={n} type="button" onClick={() => setV(v.replace(/@\w*$/, `@${n.split(' ')[0]} `))}><Av h={n.length * 20} s={n[0]} />{n}</button>)}</div> : <small className={c.m}>Type @ to mention</small>}
    </Fd>
  );
}

/* 27 */ function Emoji() {
  const [s, setS] = useState('🙂');
  const E = ['🙂', '😄', '😍', '🤔', '😮', '😢', '🙏', '👏', '🔥', '🎉', '💡', '✅'];
  return (
    <Fd label="Emoji grid" className={c.center}>
      <div className={c.emoji}>{E.map((e) => <button key={e} type="button" aria-label={e} aria-pressed={s === e} onClick={() => setS(e)}>{e}</button>)}</div>
      <small className={c.m}>Picked {s}</small>
    </Fd>
  );
}

/* 28 */ function ToastPile() {
  const [t, setT] = useState(['Saved', 'Synced']);
  return (
    <Fd label="Toast pile" className={c.center}>
      <div className={c.toasts}>{t.map((x, k) => <button key={`${k}${x}`} type="button" aria-label={`Dismiss ${x}`} onClick={() => setT((a) => a.filter((_, i) => i !== k))}><Ico n="check" />{x}<s>×</s></button>)}</div>
      <button type="button" className={c.more} onClick={() => setT((a) => [...a.slice(-2), ['Uploaded', 'Copied', 'Sent'][a.length % 3]])}>Notify</button>
    </Fd>
  );
}

/* 29 */ function Groups() {
  const [g, setG] = useState([['Mentions', 2], ['Comments', 3], ['System', 1]]);
  return (
    <Fd label="Alert groups" className={c.list}>
      {g.map(([t, n]) => <div key={t} className={c.row}><span>{t}</span><em className={c.badge}>{n}</em></div>)}
      <button type="button" className={c.more} onClick={() => setG((a) => (a.length ? [] : [['Mentions', 2], ['Comments', 3], ['System', 1]]))}>{g.length ? 'Clear all' : 'Restore'}</button>
    </Fd>
  );
}

/* 30 */ function Bell() {
  const [n, setN] = useState(2);
  return (
    <Fd label="Bell counter" className={c.center}>
      <button type="button" className={c.bell} aria-label={`${n} notifications. Add one`} onClick={() => setN((v) => v + 1)}><Ico n="bell" />{n > 0 && <em key={n} className={c.badge}>{n > 9 ? '9+' : n}</em>}</button>
      <button type="button" className={c.more} onClick={() => setN(0)}>Mark all read</button>
    </Fd>
  );
}

/* 31 */ function Digest() {
  const [o, setO] = useState(false);
  return (
    <Fd label="Digest card" className={c.list}>
      <button type="button" className={c.digest} aria-expanded={o} onClick={() => setO((v) => !v)}><b>12 updates</b><small>since 9:00</small></button>
      {o && ['4 comments', '5 likes', '3 new files'].map((x) => <span key={x} className={c.plain}>{x}</span>)}
    </Fd>
  );
}

/* 32 */ function Snooze() {
  const [s, setS] = useState(-1);
  const T = ['1 hour', 'Tonight', 'Tomorrow', 'Next week'];
  return (
    <Fd label="Snooze" className={c.center}>
      <span className={c.plain}>Weekly report is ready</span>
      <div className={c.chips} role="group" aria-label="Snooze until">{T.map((t, k) => <button key={t} type="button" className={c.chip} aria-pressed={s === k} onClick={() => setS(k)}>{t}</button>)}</div>
      <small className={c.m}>{s < 0 ? 'Not snoozed' : `Back ${T[s].toLowerCase()}`}</small>
    </Fd>
  );
}

/* 33 */ function Quiet() {
  const [on, setOn] = useState(true);
  return (
    <Fd label="Quiet hours" className={c.list}>
      <div className={c.row}><span>Quiet hours</span><button type="button" role="switch" aria-checked={on} aria-label="Quiet hours" className={c.sw} onClick={() => setOn((v) => !v)}><i /></button></div>
      <div className={c.range} data-on={on}><span>22:00</span><i><u /></i><span>07:00</span></div>
      <small className={c.m}>{on ? 'Silent overnight' : 'Always on'}</small>
    </Fd>
  );
}

/* 34 */ function Matrix() {
  const [g, setG] = useState([[1, 1, 0], [1, 0, 0], [0, 1, 1]]);
  return (
    <Fd label="Notification channels" className={c.list}>
      <div className={c.mxRow}><span /><small>Push</small><small>Mail</small><small>SMS</small></div>
      {['Mentions', 'Replies', 'Billing'].map((t, r) => <div key={t} className={c.mxRow}><span>{t}</span>{g[r].map((v, k) => <button key={k} type="button" role="switch" aria-checked={!!v} aria-label={`${t} by ${['push', 'mail', 'SMS'][k]}`} className={c.dotSw} onClick={() => setG((a) => a.map((row, i) => (i === r ? row.map((x, j) => (j === k ? (x ? 0 : 1) : x)) : row)))} />)}</div>)}
    </Fd>
  );
}

/* 35 */ function Ticker() {
  const n = useTick(1100);
  const E = ['Ana opened #482', 'Deploy passed', 'Kofi commented', 'Backup finished', 'Ravi merged #479', 'Mara joined', 'Alert cleared'];
  const rows = Array.from({ length: 4 }, (_, k) => ({ id: n + 3 - k, t: E[(n + 3 - k) % E.length] }));
  return <Fd label="Live ticker" className={c.list} role="log">{rows.map((r) => <div key={r.id} className={cx(c.row, c.in2)}><span>{r.t}</span><small>{r.id % 60}s</small></div>)}</Fd>;
}

/* 36 */ function PriorityTabs() {
  const [t, setT] = useState(0);
  const L = [['All', ['Deploy ok', '@Ana review?', 'Backup done']], ['Mentions', ['@Ana review?']], ['Alerts', ['Backup done']]];
  return (
    <Fd label="Priority tabs" className={c.list}>
      <div className={c.tabs} role="tablist" aria-label="Filter">{L.map(([n], k) => <button key={n} type="button" role="tab" aria-selected={t === k} onClick={() => setT(k)}>{n}</button>)}</div>
      {L[t][1].map((x) => <span key={x} className={c.plain}>{x}</span>)}
    </Fd>
  );
}

/* 37 */ function Presence() {
  const [on, setOn] = useState([0, 2]);
  return (
    <Fd label="Presence" className={c.list}>
      {NAMES.slice(0, 4).map((n, k) => <button key={n} type="button" className={c.row} aria-pressed={on.includes(k)} aria-label={`${n}, ${on.includes(k) ? 'online' : 'away'}`} onClick={() => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]))}><span className={c.pres}><Av h={k * 70} s={n[0]} /><i data-on={on.includes(k)} /></span><span>{n}</span></button>)}
    </Fd>
  );
}

/* 38 */ function Online() {
  const n = useCycle(8, 1200);
  const v = 128 + [0, 3, 5, 4, 8, 6, 9, 7][n];
  return <Fd label="Online now" className={c.center} role="status"><span className={c.live}><i />LIVE</span><b className={c.big} key={v}>{v}</b><small className={c.m}>people online</small></Fd>;
}

/* 39 */ function Tree() {
  const [open, setOpen] = useState([0]);
  const C = [['Ana', 'Great news!', ['Kofi', 'Agreed']], ['Mara', 'When is the demo?', ['Ravi', 'Friday']]];
  return (
    <Fd label="Comment tree" className={c.list}>
      {C.map(([a, t, [b, r]], k) => <div key={a}><div className={c.cmt}><Av h={k * 90} s={a[0]} /><span><em>{a}</em>{t}</span></div><button type="button" className={c.fold} aria-expanded={open.includes(k)} onClick={() => setOpen((x) => (x.includes(k) ? x.filter((y) => y !== k) : [...x, k]))}>1 reply</button>{open.includes(k) && <div className={cx(c.cmt, c.nest)}><Av h={k * 90 + 40} s={b[0]} /><span><em>{b}</em>{r}</span></div>}</div>)}
    </Fd>
  );
}

/* 40 */ function PollBars() {
  const v = [4, 7, 2];
  const [mine, setMine] = useState(-1);
  const tot = v.reduce((a, b) => a + b, 0) + (mine >= 0 ? 1 : 0);
  return (
    <Fd label="Poll" className={c.list}>
      <b className={c.hd}>Lunch spot?</b>
      {['Noodles', 'Tacos', 'Salad'].map((t, k) => { const n = v[k] + (mine === k ? 1 : 0); return <button key={t} type="button" className={c.pollRow} aria-pressed={mine === k} onClick={() => { if (mine < 0) setMine(k); else setMine(-1); }}><i style={{ width: `${(n / tot) * 100}%` }} /><span>{t}</span><small>{Math.round((n / tot) * 100)}%</small></button>; })}
    </Fd>
  );
}

/* 41 */ function LinkCard() {
  const [x, setX] = useState(true);
  return (
    <Fd label="Link preview" className={c.chat}>
      <div><p data-me="true">Look at this https://hanoryx.io/work</p></div>
      {x ? <div className={c.link}><span /><span><em>Work — Hanoryx</em><small>Selected systems and results</small></span><button type="button" aria-label="Remove preview" onClick={() => setX(false)}>×</button></div> : <button type="button" className={c.more} onClick={() => setX(true)}>Show preview</button>}
    </Fd>
  );
}

/* 42 */ function NewPosts() {
  const [n, setN] = useState(0);
  const tick = useTick(2000);
  const waiting = Math.min(4, tick % 5);
  const posts = ['Hello', 'Standup notes', 'Release 1.4', 'Lunch poll', 'New hire!', 'Offsite', 'Friday demo'];
  const shown = posts.slice(posts.length - 3 - n, posts.length - n);
  return (
    <Fd label="New posts pill" className={c.list}>
      {waiting > 0 && <button type="button" className={c.pill} onClick={() => setN((v) => Math.min(4, v + 1))}>↑ {waiting} new</button>}
      {shown.map((p) => <span key={p} className={cx(c.plain, c.fresh)}>{p}</span>)}
    </Fd>
  );
}

export default {
  Visual,
  items: [
    ['Contact list', Contacts, 'click'], ['Letter groups', Letters, 'still'], ['Hover actions', RowActions, 'hover'], ['Reorder list', Reorder, 'click'],
    ['Multi-select', Multi, 'click'], ['Row accordion', Accordion, 'click'], ['Page more', More, 'click'], ['Sort table', SortTable, 'click'],
    ['Filter feed', FilterFeed, 'type'], ['Pin to top', PinTop, 'click'], ['Unread badges', Unread, 'click'], ['Timeline feed', TimelineFeed, 'still'],
    ['Activity log', Log, 'still'], ['Density switch', Density, 'click'], ['Empty results', Empty, 'type'], ['Bubble thread', Bubbles, 'type'],
    ['Typing bubble', Typing, 'auto'], ['Emoji reactions', Reactions, 'click'], ['Quote reply', Quote, 'click'], ['Read ticks', Ticks, 'click'],
    ['Voice note', Voice, 'click'], ['Day dividers', Days, 'still'], ['Attach chips', Attach, 'click'], ['Thread fold', ThreadFold, 'click'],
    ['Channel list', Channels, 'click'], ['Mention suggest', Mention, 'type'], ['Emoji grid', Emoji, 'click'], ['Toast pile', ToastPile, 'click'],
    ['Alert groups', Groups, 'click'], ['Bell counter', Bell, 'click'], ['Digest card', Digest, 'click'], ['Snooze chips', Snooze, 'click'],
    ['Quiet hours', Quiet, 'click'], ['Channel matrix', Matrix, 'click'], ['Live ticker', Ticker, 'auto'], ['Priority tabs', PriorityTabs, 'click'],
    ['Presence list', Presence, 'click'], ['Online count', Online, 'auto'], ['Comment tree', Tree, 'click'], ['Poll results', PollBars, 'click'],
    ['Unfurl card', LinkCard, 'click'], ['New posts pill', NewPosts, 'auto'],
  ],
};
