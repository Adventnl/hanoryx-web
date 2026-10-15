import { useState } from 'react';
import { rng, useCycle, useDrag, useTick, useToggle } from '../hooks';
import { Ico } from '../icons';
import c from './signals.module.css';

/* ============================================================
   30 · SIGNALS — lights, pills and health.
   The still side is a beacon whose colour is the scroll's progress: it goes
   from green to amber to red as the page is read, its rings widen and the word
   under it changes with it. Specimens are the other ways a thing can say how
   it is — and each one says it in words as well as in light.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.beacon}>
        {[0, 1, 2].map((k) => <i key={k} style={{ '--k': k }} />)}
        <b />
      </div>
      <p className={c.word}><span>NOMINAL</span><span>WATCH</span><span>ALERT</span></p>
      <small>1 BEACON · 3 STATES</small>
    </div>
  );
}

const STATES = [['ok', 'Operational'], ['warn', 'Degraded'], ['bad', 'Down'], ['off', 'Paused']];

/* 1 */ function Led() {
  const [k, setK] = useState(0);
  return <button type="button" className={c.ledBtn} aria-label={`LED, ${STATES[k][1]}. Press to change`} onClick={() => setK((k + 1) % 4)}><i className={c.led} data-t={STATES[k][0]} /><span>{STATES[k][1]}</span></button>;
}

/* 2 */ function Blinker() { return <span className={c.blink} role="img" aria-label="Blinking light"><i /></span>; }

/* 3 */ function Bar5() {
  const [v, bind] = useDrag({ init: 0.6, steps: 5 });
  const n = Math.round(v * 5);
  return <div className={c.bar5} {...bind} aria-label="Level" aria-valuetext={`${n} of 5`} style={{ ...bind.style, '--n': n }}>{[1, 2, 3, 4, 5].map((k) => <i key={k} data-on={k <= n} style={{ '--k': k }} />)}</div>;
}

/* 4 */ function Traffic() {
  const k = useCycle(4, 1200);
  const on = ['bad', 'bad-warn', 'ok', 'warn'][k];
  return <div className={c.traffic} role="img" aria-label={`Traffic light: ${['red', 'red and amber', 'green', 'amber'][k]}`}>{['bad', 'warn', 'ok'].map((t) => <i key={t} data-t={t} data-on={on.includes(t)} />)}</div>;
}

/* 5 */ function PillStatus() {
  const [k, setK] = useState(0);
  return <button type="button" className={c.pill} data-t={STATES[k][0]} aria-label={`${STATES[k][1]}. Press to change`} onClick={() => setK((k + 1) % 4)}><i />{STATES[k][1]}</button>;
}

/* 6 */ function ServiceList() {
  const rows = [['API', 'ok'], ['Search', 'warn'], ['Storage', 'ok'], ['Mail', 'bad']];
  return <ul className={c.services} aria-label="Service status">{rows.map(([n, t]) => <li key={n}><i className={c.led} data-t={t} /><span>{n}</span><b>{{ ok: 'Operational', warn: 'Degraded', bad: 'Down' }[t]}</b></li>)}</ul>;
}

const DAYS = (() => { const r = rng(9); return Array.from({ length: 45 }, () => { const v = r(); return v > 0.94 ? 'bad' : v > 0.85 ? 'warn' : 'ok'; }); })();
/* 7 */ function Uptime() {
  const [hot, setHot] = useState(-1);
  return (
    <div className={c.uptime}>
      <div role="img" aria-label="Uptime for 45 days: 4 incidents" onPointerLeave={() => setHot(-1)}>{DAYS.map((t, k) => <i key={k} data-t={t} onPointerEnter={() => setHot(k)} />)}</div>
      <output>{hot < 0 ? '45 days · 99.2%' : `Day ${hot + 1}: ${{ ok: 'no incident', warn: 'slow', bad: 'outage' }[DAYS[hot]]}`}</output>
    </div>
  );
}

/* 8 */ function HealthRing() {
  const [v, bind] = useDrag({ init: 0.82 });
  const t = v > 0.7 ? 'ok' : v > 0.4 ? 'warn' : 'bad';
  return (
    <div className={c.hring} {...bind} aria-label="Health score" aria-valuetext={`${Math.round(v * 100)} percent`} data-t={t} style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" /><circle cx="50" cy="50" r="42" pathLength="1" /></svg><b>{Math.round(v * 100)}</b>
    </div>
  );
}

/* 9 */ function Heartbeat() { return <span className={c.heart} role="img" aria-label="Pulse"><i /><i /><b /></span>; }

/* 10 */ function Cell() {
  const [n, setN] = useState(3);
  return <button type="button" className={c.cell} aria-label={`Signal ${n} of 4. Press to change`} onClick={() => setN((n % 4) + 1)}>{[1, 2, 3, 4].map((k) => <i key={k} data-on={k <= n} style={{ '--k': k }} />)}</button>;
}

/* 11 */ function Wifi() {
  const [n, setN] = useState(2);
  return (
    <button type="button" className={c.wifi} aria-label={`Wi-Fi ${n} of 3. Press to change`} onClick={() => setN((n % 3) + 1)}>
      <svg viewBox="0 0 40 32" aria-hidden="true">{[3, 2, 1].map((k) => <path key={k} d={`M${20 - k * 6} ${20 - k * 3.4}a${k * 8} ${k * 8} 0 0 1 ${k * 12} 0`} data-on={k <= n} style={{ transform: `translateY(${(3 - k) * -1}px)` }} />)}<circle cx="20" cy="26" r="2.4" /></svg>
    </button>
  );
}

/* 12 */ function Charge() {
  const [v, bind] = useDrag({ init: 0.35 });
  const t = v > 0.5 ? 'ok' : v > 0.2 ? 'warn' : 'bad';
  return <div className={c.charge} {...bind} aria-label="Charge level" aria-valuetext={`${Math.round(v * 100)} percent`} data-t={t} style={{ ...bind.style, '--v': v }}><i /><b>{Math.round(v * 100)}%</b></div>;
}

/* 13 */ function Presence() {
  const [k, setK] = useState(0);
  const st = ['Online', 'Away', 'Busy', 'Offline'];
  return <button type="button" className={c.presence} data-k={k} aria-label={`MK, ${st[k]}. Press to change`} onClick={() => setK((k + 1) % 4)}><span>MK</span><i /></button>;
}

/* 14 */ function Siren() { return <span className={c.siren} role="img" aria-label="Rotating beacon"><i /><b /></span>; }

/* 15 */ function Banner() {
  const [k, setK] = useState(1);
  const msgs = ['All systems normal', 'Elevated error rate', 'Major outage'];
  return (
    <div className={c.bannerSig}>
      <div role="status" data-t={['ok', 'warn', 'bad'][k]}><i />{msgs[k]}</div>
      <div role="group" aria-label="Pick a state">{['ok', 'warn', 'bad'].map((t, i) => <button key={t} type="button" aria-pressed={i === k} aria-label={msgs[i]} data-t={t} onClick={() => setK(i)} />)}</div>
    </div>
  );
}

/* 16 */ function Severity() {
  const lv = ['Info', 'Low', 'Medium', 'High', 'Critical'];
  const [k, setK] = useState(3);
  return (
    <div className={c.sev}>
      <ul role="radiogroup" aria-label="Severity">{lv.map((t, i) => <li key={t}><button type="button" role="radio" aria-checked={i === k} data-s={i} onClick={() => setK(i)}>{t}</button></li>)}</ul>
    </div>
  );
}

/* 17 */ function Annunciator() {
  const [on, setOn] = useState([true, false, true, false, false, true]);
  const names = ['OIL', 'FUEL', 'TEMP', 'DOOR', 'GEN', 'HYD'];
  return (
    <div className={c.ann} role="group" aria-label="Annunciator panel">
      {names.map((n, k) => <button key={n} type="button" aria-pressed={on[k]} onClick={() => setOn((a) => a.map((x, j) => (j === k ? !x : x)))} data-w={k % 2}>{n}</button>)}
    </div>
  );
}

/* 18 */ function PanelLamp() {
  const [test, setTest] = useState(false);
  return (
    <div className={c.panel}>
      <span className={c.lens} data-on={test} aria-hidden="true" />
      <button type="button" aria-label="Lamp test, hold" onPointerDown={() => setTest(true)} onPointerUp={() => setTest(false)} onPointerLeave={() => setTest(false)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setTest(true); }} onKeyUp={() => setTest(false)} onBlur={() => setTest(false)}>Test</button>
    </div>
  );
}

/* 19 */ function Walk() {
  const k = useCycle(2, 2200);
  return <div className={c.walk} data-k={k} role="img" aria-label={k ? 'Walk' : "Don't walk"}><svg viewBox="0 0 24 40" aria-hidden="true">{k ? <path d="M12 6a2.4 2.4 0 1 0 0 .01M12 11l-3 8 3 4v10M12 11l4 6M9 19l-3 7M12 23l5 3" /> : <path d="M5 8h14v18H5zM9 12h6M9 17h6M9 22h6" />}</svg></div>;
}

/* 20 */ function LockLight() {
  const [on, flip] = useToggle(true);
  return <button type="button" className={c.lock} aria-pressed={on} aria-label={on ? 'Locked' : 'Unlocked'} onClick={flip}><Ico n="lock" /><i /><span>{on ? 'Locked' : 'Open'}</span></button>;
}

/* 21 */ function Rec() { return <span className={c.rec} role="img" aria-label="Recording"><i />REC</span>; }
/* 22 */ function LiveBadge() { return <span className={c.live} role="img" aria-label="Live"><i /><b>Live</b></span>; }
/* 23 */ function TypingSig() { return <span className={c.typing} role="img" aria-label="Typing"><i /><i /><i /></span>; }

/* 24 */ function Sync() {
  const [s, setS] = useState(0);
  const st = ['Synced', 'Syncing', 'Offline'];
  return <button type="button" className={c.sync} data-s={s} aria-label={`${st[s]}. Press to change`} onClick={() => setS((s + 1) % 3)}><Ico n="download" /><span>{st[s]}</span></button>;
}

/* 25 */ function Ping() {
  const t = useTick(900);
  const ms = [24, 31, 28, 140, 36, 29, 210, 33, 27, 30, 41, 38];
  const shown = Array.from({ length: 12 }, (_, i) => ms[(i + t) % ms.length]);
  return (
    <div className={c.ping} role="img" aria-label={`Latency, latest ${shown[11]} milliseconds`}>
      {shown.map((v, i) => <i key={i} data-t={v > 150 ? 'bad' : v > 60 ? 'warn' : 'ok'} style={{ height: `${Math.min(100, 12 + v / 2.4)}%` }} />)}
      <output>{shown[11]} ms</output>
    </div>
  );
}

/* 26 */ function Disk() {
  const [v, bind] = useDrag({ init: 0.7 });
  const t = v > 0.9 ? 'bad' : v > 0.75 ? 'warn' : 'ok';
  return (
    <div className={c.disk}>
      <div {...bind} aria-label="Disk used" aria-valuetext={`${Math.round(v * 100)} percent`} data-t={t} style={{ ...bind.style, '--v': v }}><i /><u /><u /></div>
      <output data-t={t}>{Math.round(v * 100)}% · {{ ok: 'fine', warn: 'getting full', bad: 'almost full' }[t]}</output>
    </div>
  );
}

/* 27 */ function Ladder() {
  const [v, bind] = useDrag({ mode: 'y', init: 0.5, steps: 8 });
  const n = Math.round(v * 8);
  return <div className={c.ladder} {...bind} aria-label="Temperature" aria-valuetext={`${30 + n * 10} degrees`} style={bind.style}>{Array.from({ length: 8 }, (_, k) => <i key={k} data-on={7 - k < n} style={{ '--k': 7 - k }} />)}</div>;
}

/* 28 */ function RingToggle() {
  const [on, flip] = useToggle();
  return <button type="button" className={c.rtoggle} role="switch" aria-checked={on} aria-label="Ring toggle" onClick={flip}><i /><span>{on ? 'On' : 'Off'}</span></button>;
}

/* 29 */ function Morse() {
  const t = useTick(380);
  // ··· --- ··· as on and off steps
  const seq = [1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0];
  return <span className={c.morse} data-on={seq[t % seq.length] === 1} role="img" aria-label="Morse blinker sending S O S"><i /></span>;
}

/* 30 */ function Metronome() { return <span className={c.metro} role="img" aria-label="Metronome lamp"><i /><b /></span>; }

/* 31 */ function Semaphore() {
  const [k, setK] = useState(0);
  const pos = [[0, 0], [45, 90], [90, 135], [135, 45]];
  return (
    <div className={c.sema}>
      <div aria-hidden="true"><i style={{ '--a': pos[k][0] }} /><i style={{ '--a': -pos[k][1] }} /><b /></div>
      <button type="button" onClick={() => setK((k + 1) % 4)}>Next signal</button>
    </div>
  );
}

/* 32 */ function Tower() { return <span className={c.tower} role="img" aria-label="Transmitting"><i /><i /><i /><b /></span>; }

/* 33 */ function PingRing() {
  const [n, setN] = useState(0);
  return <button type="button" className={c.pingRing} aria-label="Send a ping" onClick={() => setN(n + 1)}><i key={n} data-fire={n > 0} /><Ico n="bell" /></button>;
}

/* 34 */ function Dots5() {
  const [k, setK] = useState(3);
  return (
    <div className={c.dots5} role="radiogroup" aria-label="Health, one to five">
      {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={n === k} aria-label={`${n} of 5`} data-on={n <= k} data-t={k > 3 ? 'ok' : k > 1 ? 'warn' : 'bad'} onClick={() => setK(n)} />)}
    </div>
  );
}

/* 35 */ function Chip() {
  const [open, setOpen] = useState(false);
  return (
    <div className={c.chip}>
      <button type="button" aria-describedby="chip-tip" onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}><i />Degraded</button>
      <span id="chip-tip" role="tooltip" data-open={open}>Search is slow. Since 14:02</span>
    </div>
  );
}

/* 36 */ function Incidents() {
  const evs = [['14:02', 'bad', 'Outage'], ['14:11', 'warn', 'Mitigating'], ['14:35', 'ok', 'Resolved']];
  const [k, setK] = useState(1);
  return (
    <div className={c.inc}>
      <ol>{evs.map(([t, s, n], i) => <li key={t}><button type="button" data-t={s} aria-current={i === k ? 'true' : undefined} aria-label={`${t} ${n}`} onClick={() => setK(i)} /></li>)}</ol>
      <output>{evs[k][0]} — {evs[k][2]}</output>
    </div>
  );
}

/* 37 */ function StatusGrid() {
  const rows = ['API', 'Web', 'Mail'];
  const r = rng(3);
  const [cells] = useState(() => rows.map(() => Array.from({ length: 10 }, () => { const v = r(); return v > 0.93 ? 'bad' : v > 0.82 ? 'warn' : 'ok'; })));
  return (
    <div className={c.sgrid} role="table" aria-label="Status by day">
      {rows.map((n, i) => <div key={n} role="row"><span role="rowheader">{n}</span>{cells[i].map((t, k) => <i key={k} role="cell" data-t={t} aria-label={`${n} day ${k + 1}: ${t === 'ok' ? 'fine' : t === 'warn' ? 'slow' : 'down'}`} />)}</div>)}
    </div>
  );
}

/* 38 */ function Sla() {
  const [v, bind] = useDrag({ init: 0.9 });
  const pct = (99 + v).toFixed(2);
  return (
    <div className={c.sla} {...bind} aria-label="Availability" aria-valuetext={`${pct} percent`} style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" /><circle cx="50" cy="50" r="42" pathLength="1" /></svg>
      <b>{pct}<small>%</small></b>
    </div>
  );
}

/* 39 */ function Sparkline() {
  const [v, bind] = useDrag({ init: 0.5 });
  const pts = [20, 24, 22, 30, 28, 26, 34, 70, 40, 32, 30, 28].map((y, i) => `${i ? 'L' : 'M'}${(i * 100) / 11} ${50 - y * 0.6}`).join('');
  return (
    <div className={c.spark} {...bind} aria-label="Alert threshold" aria-valuetext={`${Math.round(20 + v * 60)} milliseconds`} style={{ ...bind.style, '--v': v }}>
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true"><path d={pts} /></svg>
      <i aria-hidden="true" />
    </div>
  );
}

/* 40 */ function Defcon() {
  const [k, setK] = useState(3);
  return (
    <div className={c.defcon} role="radiogroup" aria-label="Alert level">
      {[5, 4, 3, 2, 1].map((n) => <button key={n} type="button" role="radio" aria-checked={n === k} data-n={n} onClick={() => setK(n)}>{n}</button>)}
    </div>
  );
}

/* 41 */ function SevenSeg() {
  const [n, setN] = useState(404);
  const seg = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  return (
    <button type="button" className={c.seven} aria-label={`Fault code ${n}. Press for another`} onClick={() => setN((v) => [404, 500, 503, 200][([404, 500, 503, 200].indexOf(v) + 1) % 4])}>
      {String(n).split('').map((d, i) => <span key={i}>{'abcdefg'.split('').map((s) => <i key={s} data-s={s} data-on={seg[d].includes(s)} />)}</span>)}
    </button>
  );
}

/* 42 */ function Buzz() {
  const [n, setN] = useState(0);
  return (
    <div className={c.buzz}>
      <span key={n} data-fire={n > 0} role="img" aria-label="Pager">
        <Ico n="bell" />
      </span>
      <button type="button" onClick={() => setN(n + 1)}>Page me</button>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['LED lamp', Led, 'click'], ['Blinking light', Blinker, 'auto'], ['Level LEDs', Bar5, 'drag'], ['Traffic light', Traffic, 'auto'],
    ['Status pill', PillStatus, 'click'], ['Service list', ServiceList, 'static'], ['Uptime strip', Uptime, 'hover'], ['Health ring', HealthRing, 'drag'],
    ['Pulse dot', Heartbeat, 'auto'], ['Cell bars', Cell, 'click'], ['Wi-Fi arcs', Wifi, 'click'], ['Charge gauge', Charge, 'drag'],
    ['Presence dot', Presence, 'click'], ['Rotating beacon', Siren, 'auto'], ['State banner', Banner, 'click'], ['Severity scale', Severity, 'click'],
    ['Annunciator panel', Annunciator, 'click'], ['Lamp test', PanelLamp, 'hold'], ['Walk signal', Walk, 'auto'], ['Lock light', LockLight, 'click'],
    ['Record light', Rec, 'auto'], ['Live badge', LiveBadge, 'auto'], ['Typing signal', TypingSig, 'auto'], ['Sync state', Sync, 'click'],
    ['Latency bars', Ping, 'auto'], ['Disk warning', Disk, 'drag'], ['Heat ladder', Ladder, 'drag'], ['Ring switch', RingToggle, 'click'],
    ['Morse lamp', Morse, 'auto'], ['Metronome lamp', Metronome, 'auto'], ['Semaphore', Semaphore, 'click'], ['Radio mast', Tower, 'auto'],
    ['Ping ring', PingRing, 'click'], ['Health dots', Dots5, 'click'], ['Status chip', Chip, 'hover'], ['Incident dots', Incidents, 'click'],
    ['Status grid', StatusGrid, 'static'], ['Availability ring', Sla, 'drag'], ['Alert threshold', Sparkline, 'drag'], ['Alert levels', Defcon, 'click'],
    ['Fault code', SevenSeg, 'click'], ['Pager buzz', Buzz, 'click'],
  ],
};
