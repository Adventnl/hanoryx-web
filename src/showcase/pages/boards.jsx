import { useState } from 'react';
import { clamp, pad2, useDrag, useTick } from '../hooks';
import { Ico } from '../icons';
import c from './boards.module.css';

/* ============================================================
   47 · BOARDS — kanban, calendars and agendas on one sheet.
   The still side is a three-lane board whose cards move across it as the scroll
   advances: from To do, through Doing, to Done. The forty-two specimens are
   planning surfaces of the same kind, small enough to sit on one sheet and
   working: cards move when you click them, days and slots select, and the
   boards that would be ticking over (a countdown, a focus timer) do so while
   they are on screen.
   ============================================================ */

const CARDS = [['Draft brief', 0, 0, 1], ['Wire form', 0, 1, 2], ['Review', 1, 1, 2], ['Ship', 1, 2, 2], ['QA pass', 0, 1, 2], ['Notes', 1, 2, 2]];
function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visBoard}>
        {['To do', 'Doing', 'Done'].map((t) => <span key={t}><b>{t}</b></span>)}
        {CARDS.map(([t, row, from, to], k) => <i key={t} style={{ '--from': from, '--to': to, '--row': row, '--k': k }}>{t}</i>)}
      </div>
      <small>6 CARDS · 3 LANES</small>
    </div>
  );
}

const cx = (...a) => a.filter(Boolean).join(' ');
const Bd = ({ label, children, className, ...r }) => <div className={cx(c.bd, className)} role="group" aria-label={label} {...r}>{children}</div>;
const LANES = ['To do', 'Doing', 'Done'];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/* 01 */ function Lane() {
  const [n, setN] = useState(3);
  return (
    <Bd label="One lane" className={c.one}>
      <b className={c.lh}>Doing <small>{n}</small></b>
      {Array.from({ length: n }, (_, k) => <span key={k} className={c.cd}>Task {k + 1}</span>)}
      <button type="button" className={c.add} onClick={() => setN((v) => (v >= 5 ? 2 : v + 1))}>+ Add</button>
    </Bd>
  );
}

const START = [['Brief', 0], ['Wire', 0], ['Review', 1], ['Ship', 2], ['Docs', 1]];
/* 02 */ function Three() {
  const [cards, setCards] = useState(START);
  const move = (i) => setCards((a) => a.map((x, k) => (k === i ? [x[0], (x[1] + 1) % 3] : x)));
  return (
    <Bd label="Three lanes. Click a card to move it on" className={c.three}>
      {LANES.map((l, col) => (
        <div key={l} className={c.lane}><b>{l}</b>{cards.map(([t, at], i) => at === col && <button key={t} type="button" className={c.cd} onClick={() => move(i)} aria-label={`${t}, in ${l}. Move to ${LANES[(col + 1) % 3]}`}>{t}</button>)}</div>
      ))}
    </Bd>
  );
}

/* 03 */ function Keys() {
  const [cards, setCards] = useState(START);
  const [sel, setSel] = useState(1);
  const shift = (d) => setCards((a) => a.map((x, k) => (k === sel ? [x[0], clamp(x[1] + d, 0, 2)] : x)));
  return (
    <Bd label="Three lanes. Select a card, then use the left and right arrow keys" className={c.three} tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); shift(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); shift(-1); } }}>
      {LANES.map((l, col) => (
        <div key={l} className={c.lane}><b>{l}</b>{cards.map(([t, at], i) => at === col && <button key={t} type="button" className={c.cd} aria-pressed={sel === i} onClick={() => setSel(i)}>{t}</button>)}</div>
      ))}
    </Bd>
  );
}

/* 04 */ function Wip() {
  const [n, setN] = useState(3);
  return (
    <Bd label="Lane with a limit" className={c.one}>
      <b className={c.lh}>Doing <small className={n > 3 ? c.over : ''}>{n}/3</small></b>
      {Array.from({ length: n }, (_, k) => <span key={k} className={cx(c.cd, k >= 3 && c.bad)}>Task {k + 1}</span>)}
      <div className={c.pair}><button type="button" className={c.add} onClick={() => setN((v) => Math.min(5, v + 1))}>+</button><button type="button" className={c.add} onClick={() => setN((v) => Math.max(0, v - 1))}>−</button></div>
    </Bd>
  );
}

/* 05 */ function Swim() {
  const [open, setOpen] = useState([0, 1]);
  const flip = (r) => setOpen((a) => (a.includes(r) ? a.filter((x) => x !== r) : [...a, r]));
  return (
    <Bd label="Swimlanes" className={c.swim}>
      {['Web', 'Mobile'].map((r, i) => (
        <div key={r} className={c.sl}>
          <button type="button" aria-expanded={open.includes(i)} onClick={() => flip(i)}><Ico n="down" />{r}</button>
          {open.includes(i) && <div className={c.slRow}>{LANES.map((l) => <span key={l} className={c.cd}>{l[0]}{i + 1}</span>)}</div>}
        </div>
      ))}
    </Bd>
  );
}

/* 06 */ function Peek() {
  const [o, setO] = useState(false);
  return (
    <Bd label="Card detail" className={c.one}>
      <button type="button" className={cx(c.cd, c.peek)} aria-expanded={o} onClick={() => setO((v) => !v)}>
        <b>Fix login</b>
        {o && <><small>Users on Safari are bounced back to the form.</small><span className={c.avs}><i style={{ '--h': 10 }}>A</i><i style={{ '--h': 200 }}>K</i></span></>}
      </button>
      <span className={c.cd}>Update copy</span>
    </Bd>
  );
}

/* 07 */ function Labels() {
  const [f, setF] = useState('all');
  const T = [['Fix login', 'bug'], ['Dark mode', 'feat'], ['Bump deps', 'chore'], ['Crash on save', 'bug'], ['Export CSV', 'feat']];
  return (
    <Bd label="Label filter" className={c.one}>
      <div className={c.chips} role="group" aria-label="Filter">{['all', 'bug', 'feat', 'chore'].map((l) => <button key={l} type="button" className={c.chip} data-l={l} aria-pressed={f === l} onClick={() => setF(l)}>{l}</button>)}</div>
      {T.filter(([, l]) => f === 'all' || l === f).map(([t, l]) => <span key={t} className={c.cd} data-l={l}>{t}</span>)}
    </Bd>
  );
}

/* 08 */ function CheckRing() {
  const [on, setOn] = useState([0, 1]);
  const flip = (k) => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  return (
    <Bd label="Checklist card" className={c.rowFlex}>
      <span className={c.ring} style={{ '--p': on.length * 25 }}><b>{on.length * 25}%</b></span>
      <div className={c.checks}>{['Spec', 'Build', 'Test', 'Ship'].map((t, k) => <button key={t} type="button" role="checkbox" aria-checked={on.includes(k)} onClick={() => flip(k)}><i>{on.includes(k) ? '✓' : ''}</i>{t}</button>)}</div>
    </Bd>
  );
}

/* 09 */ function Due() {
  const [done, setDone] = useState([2]);
  const D = [['Invoices', 'Yesterday', true], ['Hiring plan', 'Today', false], ['Offsite', 'Fri', false]];
  return (
    <Bd label="Due dates" className={c.one}>
      {D.map(([t, d, late], k) => <button key={t} type="button" className={cx(c.cd, c.due)} aria-pressed={done.includes(k)} onClick={() => setDone((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]))}><span>{t}</span><em data-late={late && !done.includes(k)}>{done.includes(k) ? 'Done' : d}</em></button>)}
    </Bd>
  );
}

/* 10 */ function Assign() {
  const [on, setOn] = useState([0]);
  const P = ['A', 'K', 'M', 'R'];
  return (
    <Bd label="Assignees" className={c.center}>
      <span className={c.cd}>Launch page</span>
      <div className={c.avRow} role="group" aria-label="People">{P.map((p, k) => <button key={p} type="button" aria-pressed={on.includes(k)} aria-label={`Assign ${p}`} style={{ '--h': k * 80 }} onClick={() => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]))}>{p}</button>)}</div>
      <small className={c.m}>{on.length} assigned</small>
    </Bd>
  );
}

/* 11 */ function Fold() {
  const [shut, setShut] = useState([1]);
  const flip = (k) => setShut((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  return (
    <Bd label="Collapsible lanes" className={c.foldRow}>
      {LANES.map((l, k) => <div key={l} className={c.fl} data-shut={shut.includes(k)}><button type="button" aria-expanded={!shut.includes(k)} aria-label={l} onClick={() => flip(k)}><span>{l}</span></button>{!shut.includes(k) && <><i className={c.cd}>A</i><i className={c.cd}>B</i></>}</div>)}
    </Bd>
  );
}

/* 12 */ function Month() {
  const [d, setD] = useState(14);
  return (
    <Bd label="Month grid" className={c.cal}>
      <b className={c.mh}>October 2026</b>
      <div className={c.grid7}>{DAYS.map((x, i) => <small key={i}>{x}</small>)}{Array.from({ length: 31 }, (_, k) => <button key={k} type="button" aria-pressed={d === k + 1} aria-current={k + 1 === 15 ? 'date' : undefined} aria-label={`October ${k + 1}`} onClick={() => setD(k + 1)}>{k + 1}</button>)}</div>
    </Bd>
  );
}

/* 13 */ function Week() {
  const [d, setD] = useState(2);
  return (
    <Bd label="Week strip" className={c.center}>
      <div className={c.weekS} role="group" aria-label="Days">{DAYS.map((x, k) => <button key={k} type="button" aria-pressed={d === k} onClick={() => setD(k)}><small>{x}</small><b>{12 + k}</b></button>)}</div>
      <small className={c.m}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d]} {12 + d} Oct · {d % 3 + 1} events</small>
    </Bd>
  );
}

/* 14 */ function Hours() {
  const [on, setOn] = useState([1, 4]);
  const flip = (k) => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  return (
    <Bd label="Day hours" className={c.hours}>
      {[9, 10, 11, 12, 13, 14].map((h, k) => <button key={h} type="button" aria-pressed={on.includes(k)} aria-label={`${h}:00`} onClick={() => flip(k)}><small>{h}:00</small><i>{on.includes(k) ? 'Booked' : ''}</i></button>)}
    </Bd>
  );
}

/* 15 */ function Overlap() {
  const [s, setS] = useState(0);
  const E = [['Sync', 0, 2, 0], ['Design', 1, 3, 1], ['Lunch', 3, 4, 0], ['1:1', 2, 3, 0]];
  return (
    <Bd label="Overlapping events" className={c.overlap}>
      <div>{E.map(([t, a, b, col], k) => <button key={t} type="button" aria-pressed={s === k} style={{ '--a': a, '--b': b, '--col': col }} onClick={() => setS(k)}>{t}</button>)}</div>
      <small className={c.m}>{E[s][0]}</small>
    </Bd>
  );
}

/* 16 */ function Range() {
  const [r, setR] = useState([4, 8]);
  const pick = (d) => setR(([a, b]) => (a != null && b == null ? (d < a ? [d, a] : [a, d]) : [d, null]));
  return (
    <Bd label="Date range" className={c.cal}>
      <b className={c.mh}>{r[0]}{r[1] ? ` – ${r[1]}` : ''} Oct · {r[1] ? r[1] - r[0] + 1 : 1} days</b>
      <div className={c.grid7}>{Array.from({ length: 14 }, (_, k) => k + 1).map((d) => <button key={d} type="button" data-in={r[0] != null && d >= r[0] && d <= (r[1] ?? r[0])} aria-pressed={d === r[0] || d === r[1]} onClick={() => pick(d)}>{d}</button>)}</div>
    </Bd>
  );
}

/* 17 */ function DotsCal() {
  const [d, setD] = useState(6);
  const ev = { 3: 1, 6: 3, 9: 2, 12: 1, 15: 2 };
  return (
    <Bd label="Month with event dots" className={c.cal}>
      <div className={c.grid7}>{Array.from({ length: 21 }, (_, k) => k + 1).map((x) => <button key={x} type="button" aria-pressed={d === x} onClick={() => setD(x)}>{x}<s>{'•'.repeat(ev[x] ?? 0)}</s></button>)}</div>
      <small className={c.m}>{ev[d] ?? 0} events on the {d}th</small>
    </Bd>
  );
}

/* 18 */ function Heat() {
  const [s, setS] = useState(-1);
  const v = (k) => ((k * 7919) % 11) / 10;
  return (
    <Bd label="Year heat grid" className={c.center}>
      <div className={c.heat}>{Array.from({ length: 12 * 7 }, (_, k) => <button key={k} type="button" aria-label={`Cell ${k + 1}`} aria-pressed={s === k} onClick={() => setS(k)} style={{ '--v': v(k) }} />)}</div>
      <small className={c.m}>{s < 0 ? 'Pick a day' : `${Math.round(v(s) * 10)} contributions`}</small>
    </Bd>
  );
}

/* 19 */ function AgendaList() {
  const [done, setDone] = useState([0]);
  const G = [['Today', ['Standup', 'Review PRs']], ['Tomorrow', ['Demo prep', 'Dentist']]];
  let k = -1;
  return (
    <Bd label="Agenda list" className={c.one}>
      {G.map(([g, items]) => <div key={g}><b className={c.lh}>{g}</b>{items.map((t) => { k += 1; const id = k; return <button key={t} type="button" role="checkbox" aria-checked={done.includes(id)} className={c.todo} onClick={() => setDone((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))}><i>{done.includes(id) ? '✓' : ''}</i><span>{t}</span></button>; })}</div>)}
    </Bd>
  );
}

/* 20 */ function Gantt() {
  const [s, setS] = useState(1);
  const T = [['Design', 0, 4], ['Build', 3, 8], ['Test', 7, 10], ['Launch', 10, 12]];
  return (
    <Bd label="Gantt bars" className={c.gantt}>
      {T.map(([t, a, b], k) => <div key={t}><small>{t}</small><button type="button" aria-pressed={s === k} aria-label={`${t}, weeks ${a + 1} to ${b}`} style={{ '--a': a, '--n': b - a }} onClick={() => setS(k)} /></div>)}
      <small className={c.m}>{T[s][0]} · weeks {T[s][1] + 1}–{T[s][2]}</small>
    </Bd>
  );
}

/* 21 */ function Deps() {
  const [s, setS] = useState(0);
  const N = ['Spec', 'API', 'UI', 'Ship'];
  return (
    <Bd label="Dependencies" className={c.deps}>
      <svg viewBox="0 0 110 60" aria-hidden="true"><path d="M20 14H40V30H60M60 30V46H80M40 30V14M20 14L40 30" /><path d="M24 14C36 14 36 30 46 30M64 30C76 30 76 46 86 46" /></svg>
      {N.map((t, k) => <button key={t} type="button" aria-pressed={s === k} data-done={k <= s} style={{ '--k': k }} onClick={() => setS(k)}>{t}</button>)}
    </Bd>
  );
}

/* 22 */ function Avail() {
  const [on, setOn] = useState(['0-1', '1-2', '2-2', '3-3']);
  const flip = (id) => setOn((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  return (
    <Bd label="Availability grid" className={c.center}>
      <div className={c.avail}>{Array.from({ length: 30 }, (_, k) => { const id = `${k % 5}-${Math.floor(k / 5)}`; return <button key={id} type="button" aria-pressed={on.includes(id)} aria-label={`Day ${(k % 5) + 1}, slot ${Math.floor(k / 5) + 1}`} onClick={() => flip(id)} />; })}</div>
      <small className={c.m}>{on.length} slots free</small>
    </Bd>
  );
}

/* 23 */ function Zones() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.45 });
  const h = Math.round(v * 23);
  return (
    <Bd label="Time zones" className={c.zones}>
      {[['Oslo', 0], ['London', -1], ['Tokyo', 8]].map(([n, o]) => { const t = (h + o + 24) % 24; return <div key={n}><small>{n}</small><span className={c.band}>{Array.from({ length: 24 }, (_, k) => <i key={k} data-day={((k + o + 24) % 24) >= 8 && ((k + o + 24) % 24) < 20} />)}</span><b>{pad2(t)}:00</b></div>; })}
      <div className={c.scrub} {...bind} aria-label="Hour"><u style={{ left: `${v * 100}%` }} /></div>
    </Bd>
  );
}

/* 24 */ function Slots() {
  const [s, setS] = useState(-1);
  const T = ['9:00', '9:30', '10:00', '11:30', '13:00', '14:30'];
  return (
    <Bd label="Booking slots" className={c.center}>
      <div className={c.chips} role="group" aria-label="Times">{T.map((t, k) => <button key={t} type="button" className={c.chip} aria-pressed={s === k} disabled={k === 1} onClick={() => setS(k)}>{t}</button>)}</div>
      <small className={c.m}>{s < 0 ? 'Choose a time' : `Booked ${T[s]}`}</small>
    </Bd>
  );
}

/* 25 */ function Countdown() {
  const n = useTick(1000);
  const left = 3 * 86400 + 7 * 3600 + 12 * 60 - n;
  const parts = [['days', Math.floor(left / 86400)], ['hrs', Math.floor((left % 86400) / 3600)], ['min', Math.floor((left % 3600) / 60)], ['sec', left % 60]];
  return (
    <Bd label="Countdown" className={c.center} role="timer">
      <small className={c.m}>Launch in</small>
      <div className={c.cd4}>{parts.map(([l, v]) => <span key={l}><b>{pad2(v)}</b><small>{l}</small></span>)}</div>
    </Bd>
  );
}

/* 26 */ function Repeat() {
  const [r, setR] = useState(1);
  const R = [['Daily', 'Oct 15, 16, 17'], ['Weekly', 'Oct 15, 22, 29'], ['Monthly', 'Oct 15, Nov 15, Dec 15']];
  return (
    <Bd label="Repeat" className={c.center}>
      <div className={c.chips} role="radiogroup" aria-label="Repeat">{R.map(([t], k) => <button key={t} type="button" role="radio" aria-checked={r === k} className={c.chip} aria-pressed={r === k} onClick={() => setR(k)}>{t}</button>)}</div>
      <small className={c.m}>{R[r][1]}</small>
    </Bd>
  );
}

/* 27 */ function MonthAgenda() {
  const [d, setD] = useState(2);
  const E = [['Standup', 'Review'], ['Planning'], ['Demo', '1:1', 'Retro'], [], ['Offsite']];
  return (
    <Bd label="Month with agenda" className={c.cal}>
      <div className={c.weekS} role="group" aria-label="Days">{[1, 2, 3, 4, 5].map((x, k) => <button key={x} type="button" aria-pressed={d === k} onClick={() => setD(k)}><b>{x}</b></button>)}</div>
      {E[d].length ? E[d].map((e) => <span key={e} className={c.cd}>{e}</span>) : <small className={c.m}>Free day</small>}
    </Bd>
  );
}

/* 28 */ function Burn() {
  const [day, setDay] = useState(5);
  const act = [10, 9.2, 8.4, 7.1, 6.6, 5.2, 4.8, 3.1, 2.4, 1.2, 0].slice(0, day + 1);
  const px = (i) => 8 + i * 9.4; const py = (v) => 6 + (1 - v / 10) * 40;
  return (
    <Bd label="Burndown" className={c.center}>
      <svg viewBox="0 0 110 52" className={c.burn} aria-hidden="true"><path d={`M${px(0)} ${py(10)}L${px(10)} ${py(0)}`} className={c.ideal} /><path d={act.map((v, i) => `${i ? 'L' : 'M'}${px(i)} ${py(v)}`).join('')} className={c.actual} /></svg>
      <div className={c.pair}><small className={c.m}>Day {day}</small><button type="button" className={c.add} onClick={() => setDay((v) => (v >= 10 ? 1 : v + 1))}>Next day</button></div>
    </Bd>
  );
}

/* 29 */ function Roadmap() {
  const [shipped, setShipped] = useState([0]);
  const R = [['Auth', 0, 2], ['Search', 1, 3], ['Billing', 2, 4], ['API', 3, 4]];
  return (
    <Bd label="Roadmap" className={c.road}>
      <div className={c.qs}>{['Q1', 'Q2', 'Q3', 'Q4'].map((q) => <small key={q}>{q}</small>)}</div>
      {R.map(([t, a, b], k) => <button key={t} type="button" aria-pressed={shipped.includes(k)} style={{ '--a': a, '--n': b - a }} onClick={() => setShipped((x) => (x.includes(k) ? x.filter((y) => y !== k) : [...x, k]))}>{t}{shipped.includes(k) ? ' ✓' : ''}</button>)}
    </Bd>
  );
}

/* 30 */ function Matrix() {
  const [q, setQ] = useState(1);
  const N = ['Do later', 'Do now', 'Drop', 'Hand off'];
  return (
    <Bd label="Priority matrix" className={c.matrix}>
      {N.map((t, k) => <button key={t} type="button" aria-pressed={q === k} aria-label={`${t}: place the task here`} onClick={() => setQ(k)}><small>{t}</small>{q === k ? <i /> : null}</button>)}
    </Bd>
  );
}

/* 31 */ function Poker() {
  const [s, setS] = useState(3);
  const F = [1, 2, 3, 5, 8, 13];
  return (
    <Bd label="Estimate cards" className={c.center}>
      <div className={c.poker} role="radiogroup" aria-label="Estimate">{F.map((f, k) => <button key={f} type="button" role="radio" aria-checked={s === k} onClick={() => setS(k)}>{f}</button>)}</div>
      <small className={c.m}>{F[s]} points</small>
    </Bd>
  );
}

/* 32 */ function Retro() {
  const [v, setV] = useState([2, 0, 1]);
  const T = [['Went well', 'Fast reviews'], ['To improve', 'Flaky tests'], ['Try next', 'Pair on bugs']];
  return (
    <Bd label="Retro notes" className={c.three}>
      {T.map(([h, n], k) => <div key={h} className={c.lane}><b>{h}</b><button type="button" className={cx(c.cd, c.sticky)} style={{ '--k': k }} aria-label={`${n}, ${v[k]} votes. Vote`} onClick={() => setV((a) => a.map((x, i) => (i === k ? x + 1 : x)))}>{n}<em>+{v[k]}</em></button></div>)}
    </Bd>
  );
}

/* 33 */ function Rota() {
  const [i, setI] = useState(1);
  const P = ['Ana', 'Kofi', 'Mara', 'Ravi'];
  return (
    <Bd label="Rota" className={c.center}>
      <small className={c.m}>On call</small>
      <div className={c.rota}>{P.map((p, k) => <span key={p} data-on={k === i}>{p}</span>)}</div>
      <button type="button" className={c.add} onClick={() => setI((v) => (v + 1) % 4)}>Hand over</button>
    </Bd>
  );
}

/* 34 */ function Habits() {
  const [on, setOn] = useState({ '0-0': 1, '0-1': 1, '0-2': 1, '1-1': 1, '1-3': 1 });
  const flip = (id) => setOn((a) => ({ ...a, [id]: a[id] ? 0 : 1 }));
  return (
    <Bd label="Habit week" className={c.habits}>
      {['Read', 'Run'].map((h, r) => <div key={h}><small>{h}</small>{DAYS.map((d, k) => { const id = `${r}-${k}`; return <button key={id} type="button" aria-pressed={!!on[id]} aria-label={`${h}, day ${k + 1}`} onClick={() => flip(id)} />; })}</div>)}
      <small className={c.m}>{Object.values(on).filter(Boolean).length} done</small>
    </Bd>
  );
}

/* 35 */ function Todo() {
  const [items, setItems] = useState([['Book flights', true], ['Pack', false]]);
  const [v, setV] = useState('');
  const add = (e) => { e.preventDefault(); if (v.trim()) { setItems((a) => [...a.slice(-3), [v.trim(), false]]); setV(''); } };
  return (
    <Bd label="To-do list" className={c.one}>
      {items.map(([t, d], k) => <button key={`${k}${t}`} type="button" role="checkbox" aria-checked={d} className={c.todo} onClick={() => setItems((a) => a.map((x, i) => (i === k ? [x[0], !x[1]] : x)))}><i>{d ? '✓' : ''}</i><span>{t}</span></button>)}
      <form onSubmit={add}><input className={c.in} value={v} onChange={(e) => setV(e.target.value)} placeholder="Add…" aria-label="New to-do" /></form>
    </Bd>
  );
}

/* 36 */ function Focus() {
  const n = useTick(600);
  const step = n % 30;
  return (
    <Bd label="Focus blocks" className={c.center} role="timer">
      <div className={c.blocks}>{Array.from({ length: 10 }, (_, k) => <i key={k} data-brk={k % 5 === 4} data-on={k * 3 <= step} />)}</div>
      <small className={c.m}>{step < 15 ? 'Focus' : 'Break soon'} · {pad2(Math.floor(step / 2))}:{pad2((step % 2) * 30)}</small>
    </Bd>
  );
}

/* 37 */ function Ladder() {
  const [s, setS] = useState(1);
  const M = ['Kickoff', 'Alpha', 'Beta', 'Launch'];
  return (
    <Bd label="Milestones" className={c.ladder}>
      {M.map((m, k) => <button key={m} type="button" data-done={k <= s} aria-pressed={k <= s} onClick={() => setS(k === s ? k - 1 : k)}><i />{m}</button>)}
    </Bd>
  );
}

/* 38 */ function Capacity() {
  const [load, setLoad] = useState([3, 5, 2, 4]);
  const P = ['Ana', 'Kofi', 'Mara', 'Ravi'];
  return (
    <Bd label="Capacity" className={c.cap}>
      {P.map((p, k) => <button key={p} type="button" aria-label={`${p} has ${load[k]} of 5. Add a task`} onClick={() => setLoad((a) => a.map((x, i) => (i === k ? (x >= 7 ? 1 : x + 1) : x)))}><small>{p}</small><span><i data-over={load[k] > 5} style={{ width: `${(load[k] / 7) * 100}%` }} /><u /></span><em>{load[k]}</em></button>)}
    </Bd>
  );
}

/* 39 */ function Status() {
  const [s, setS] = useState([0, 1, 0, 2]);
  const C = [['up', '#4ade80'], ['slow', '#febc2e'], ['down', '#ff6b6b']];
  return (
    <Bd label="Service status" className={c.one}>
      {['API', 'Web', 'Queue', 'Search'].map((t, k) => <button key={t} type="button" className={cx(c.cd, c.stat)} aria-label={`${t}: ${C[s[k]][0]}. Change`} onClick={() => setS((a) => a.map((x, i) => (i === k ? (x + 1) % 3 : x)))}><span>{t}</span><i style={{ background: C[s[k]][1], boxShadow: `0 0 6px ${C[s[k]][1]}` }} /></button>)}
    </Bd>
  );
}

/* 40 */ function Train() {
  const [s, setS] = useState(1);
  const S = ['Plan', 'Build', 'Test', 'Ship'];
  return (
    <Bd label="Release train" className={c.train}>
      <div>{S.map((t, k) => <button key={t} type="button" data-done={k <= s} aria-current={k === s ? 'step' : undefined} onClick={() => setS(k)}><i />{t}</button>)}</div>
      <button type="button" className={c.add} onClick={() => setS((v) => (v + 1) % 4)}>Advance</button>
    </Bd>
  );
}

/* 41 */ function Roster() {
  const [g, setG] = useState(() => Array.from({ length: 21 }, (_, k) => (k * 5) % 4));
  const P = ['·', 'A', 'K', 'M'];
  return (
    <Bd label="Shift roster" className={c.center}>
      <div className={c.roster}>{g.map((v, k) => <button key={k} type="button" data-v={v} aria-label={`Day ${(k % 7) + 1}, shift ${Math.floor(k / 7) + 1}: ${P[v]}`} onClick={() => setG((a) => a.map((x, i) => (i === k ? (x + 1) % 4 : x)))}>{P[v]}</button>)}</div>
    </Bd>
  );
}

/* 42 */ function Poll() {
  const [v, setV] = useState(() => [[1, 0, 1], [0, 1, 1], [1, 1, 1], [0, 0, 1]]);
  const sums = v.map((r) => r.reduce((a, b) => a + b, 0));
  const best = sums.indexOf(Math.max(...sums));
  return (
    <Bd label="Meeting poll" className={c.poll}>
      <div className={c.pollH}><span /><small>Ana</small><small>Kofi</small><small>Mara</small></div>
      {['Mon 10', 'Tue 14', 'Wed 9', 'Thu 16'].map((t, r) => <div key={t} data-best={best === r}><small>{t}</small>{v[r].map((x, k) => <button key={k} type="button" aria-pressed={!!x} aria-label={`${t}, person ${k + 1}`} onClick={() => setV((a) => a.map((row, i) => (i === r ? row.map((y, j) => (j === k ? (y ? 0 : 1) : y)) : row)))}>{x ? '✓' : ''}</button>)}</div>)}
    </Bd>
  );
}

export default {
  Visual,
  items: [
    ['Single lane', Lane, 'click'], ['Three lanes', Three, 'click'], ['Keyboard move', Keys, 'key'], ['Lane limit', Wip, 'click'],
    ['Swimlanes', Swim, 'click'], ['Card peek', Peek, 'click'], ['Label filter', Labels, 'click'], ['Checklist ring', CheckRing, 'click'],
    ['Due badges', Due, 'click'], ['Assignees', Assign, 'click'], ['Lane fold', Fold, 'click'], ['Calendar month', Month, 'click'],
    ['Day chooser', Week, 'click'], ['Hour slots', Hours, 'click'], ['Overlap columns', Overlap, 'click'], ['Range pick', Range, 'click'],
    ['Event dots', DotsCal, 'click'], ['Year heat', Heat, 'click'], ['Agenda list', AgendaList, 'click'], ['Gantt bars', Gantt, 'click'],
    ['Task links', Deps, 'click'], ['Availability grid', Avail, 'click'], ['Zone strip', Zones, 'drag'], ['Booking slots', Slots, 'click'],
    ['Countdown card', Countdown, 'auto'], ['Repeat rule', Repeat, 'click'], ['Month agenda', MonthAgenda, 'click'], ['Burndown', Burn, 'click'],
    ['Roadmap bars', Roadmap, 'click'], ['Urgency quadrants', Matrix, 'click'], ['Estimate cards', Poker, 'click'], ['Retro notes', Retro, 'click'],
    ['On-call rota', Rota, 'click'], ['Habit week', Habits, 'click'], ['To-do list', Todo, 'type'], ['Focus blocks', Focus, 'auto'],
    ['Milestone ladder', Ladder, 'click'], ['Capacity bars', Capacity, 'click'], ['Service status', Status, 'click'], ['Release train', Train, 'click'],
    ['Shift roster', Roster, 'click'], ['Meeting poll', Poll, 'click'],
  ],
};
