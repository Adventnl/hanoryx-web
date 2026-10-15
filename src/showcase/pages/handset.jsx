import { useState } from 'react';
import { useCycle, useDrag, useTick } from '../hooks';
import { Ico } from '../icons';
import c from './handset.module.css';

/* ============================================================
   46 · HANDSET — mobile screens, from first run to settings.
   The still side is a phone whose screen slides through five states as the
   scroll advances: welcome, sign in, a feed, a chat and settings. Each of the
   forty-two specimens is a small screen of the same kind, drawn at phone
   proportions: the ones you would tap are real buttons, fields and switches
   that work, and the ones that would run on their own do so while on screen.
   ============================================================ */

const SCREENS = ['Welcome', 'Sign in', 'Feed', 'Chat', 'Settings'];
function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.big}>
        <i />
        <div className={c.track}>
          {SCREENS.map((t, k) => (
            <section key={t}>
              <b>{t}</b>
              {[0, 1, 2, 3].map((r) => <u key={r} style={{ '--r': r, '--k': k }} />)}
              <em />
            </section>
          ))}
        </div>
        <span className={c.dots}>{SCREENS.map((t, k) => <s key={t} style={{ '--k': k }} />)}</span>
      </div>
      <small>5 SCREENS · 1 HANDSET</small>
    </div>
  );
}

const cx = (...a) => a.filter(Boolean).join(' ');
const Phone = ({ label, className, children, ...rest }) => <div className={cx(c.ph, className)} role="group" aria-label={label} {...rest}><i className={c.notch} />{children}</div>;
const Sw = ({ on, set, label }) => <button type="button" role="switch" aria-checked={on} aria-label={label} className={c.sw} onClick={() => set(!on)}><i /></button>;
const Av = ({ h = 0, s = '' }) => <b className={c.av} style={{ '--h': h }}>{s}</b>;

/* 01 */ function Welcome() {
  const [done, setDone] = useState(false);
  return (
    <Phone label="Welcome screen" className={c.center}>
      <span className={c.logo}>H</span>
      <b className={c.h}>{done ? 'You are in' : 'Welcome'}</b>
      <span className={c.p}>{done ? 'Taking you home' : 'A calmer way to run work.'}</span>
      <button type="button" className={c.btn} onClick={() => setDone((v) => !v)}>{done ? 'Back' : 'Get started'}</button>
    </Phone>
  );
}

const SL = [['Plan', '#ff5a5a'], ['Track', '#4ade80'], ['Share', '#60a5fa']];
/* 02 */ function Intro() {
  const [i, setI] = useState(0);
  return (
    <Phone label="Intro slides" className={c.center}>
      <span className={c.art} style={{ background: SL[i][1] }}><Ico n={['grid', 'clock', 'share'][i]} /></span>
      <b className={c.h}>{SL[i][0]} it</b>
      <span className={c.dotsRow}>{SL.map((s, k) => <s key={s[0]} data-on={k === i} />)}</span>
      <button type="button" className={c.btn} onClick={() => setI((v) => (v + 1) % 3)}>{i === 2 ? 'Start' : 'Next'}</button>
    </Phone>
  );
}

/* 03 */ function Permission() {
  const [a, setA] = useState('');
  return (
    <Phone label="Permission request" className={c.center}>
      <span className={c.art} style={{ background: '#60a5fa' }}><Ico n="bell" /></span>
      <b className={c.h}>Allow alerts?</b>
      <span className={c.p}>{a === 'y' ? 'Alerts are on.' : a === 'n' ? 'Maybe later.' : 'We only send what matters.'}</span>
      <div className={c.pair}><button type="button" className={c.btn} onClick={() => setA('y')}>Allow</button><button type="button" className={c.ghost} onClick={() => setA('n')}>Not now</button></div>
    </Phone>
  );
}

/* 04 */ function SignIn() {
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const ok = e.includes('@') && p.length > 3;
  return (
    <Phone label="Sign in form">
      <b className={c.h}>Sign in</b>
      <input className={c.in} value={e} onChange={(x) => setE(x.target.value)} placeholder="Email" aria-label="Email" />
      <input className={c.in} type="password" value={p} onChange={(x) => setP(x.target.value)} placeholder="Password" aria-label="Password" />
      <button type="button" className={c.btn} disabled={!ok}>Continue</button>
      <span className={c.p}>{ok ? 'Ready.' : 'Fill both fields.'}</span>
    </Phone>
  );
}

/* 05 */ function Setup() {
  const [s, setS] = useState(1);
  return (
    <Phone label="Setup steps">
      <span className={c.p}>Step {s} of 4</span>
      <span className={c.prog}><i style={{ width: `${s * 25}%` }} /></span>
      <b className={c.h}>{['Name', 'Team', 'Plan', 'Invite'][s - 1]}</b>
      <u className={c.line} /><u className={c.line} style={{ width: '60%' }} />
      <button type="button" className={cx(c.btn, c.low)} onClick={() => setS((v) => (v % 4) + 1)}>{s === 4 ? 'Finish' : 'Next'}</button>
    </Phone>
  );
}

/* 06 */ function Code() {
  const [v, setV] = useState('48');
  return (
    <Phone label="Code entry" className={c.center}>
      <b className={c.h}>Enter code</b>
      <label className={c.codeBox}>
        {[0, 1, 2, 3].map((k) => <i key={k} data-on={v.length === k}>{v[k] ?? ''}</i>)}
        <input value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" maxLength={4} aria-label="Four digit code" />
      </label>
      <span className={c.p}>{v.length === 4 ? 'Checking…' : 'Sent to ••• 21'}</span>
    </Phone>
  );
}

/* 07 */ function FaceId() {
  const [ok, setOk] = useState(false);
  return (
    <Phone label="Biometric prompt" className={c.center}>
      <button type="button" className={c.finger} data-ok={ok} aria-pressed={ok} aria-label="Fingerprint sensor" onClick={() => setOk((v) => !v)}><i /><i /><i /><Ico n={ok ? 'check' : 'user'} /></button>
      <b className={c.h}>{ok ? 'Verified' : 'Touch to unlock'}</b>
    </Phone>
  );
}

/* 08 */ function Avatars() {
  const [s, setS] = useState(1);
  return (
    <Phone label="Avatar picker" className={c.center}>
      <b className={c.h}>Pick a face</b>
      <div className={c.avGrid} role="radiogroup" aria-label="Avatar">
        {[0, 70, 140, 210].map((h, k) => <button key={h} type="button" role="radio" aria-checked={s === k} aria-label={`Avatar ${k + 1}`} onClick={() => setS(k)}><Av h={h} s={'ABCD'[k]} /></button>)}
      </div>
    </Phone>
  );
}

const INT = ['Design', 'Code', 'Music', 'Film', 'Food', 'Travel'];
/* 09 */ function Interests() {
  const [on, setOn] = useState(['Code', 'Music']);
  const flip = (t) => setOn((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));
  return (
    <Phone label="Interest chips">
      <b className={c.h}>Your topics</b>
      <div className={c.chips}>{INT.map((t) => <button key={t} type="button" className={c.chip} aria-pressed={on.includes(t)} onClick={() => flip(t)}>{t}</button>)}</div>
      <span className={c.p}>{on.length} picked</span>
    </Phone>
  );
}

/* 10 */ function Remind() {
  const [on, setOn] = useState(true);
  const [t, setT] = useState(1);
  return (
    <Phone label="Reminder opt-in">
      <div className={c.row}><b className={c.h}>Daily nudge</b><Sw on={on} set={setOn} label="Daily nudge" /></div>
      <div className={c.chips} role="group" aria-label="Time">{['8:00', '12:30', '18:00'].map((x, k) => <button key={x} type="button" className={c.chip} disabled={!on} aria-pressed={t === k} onClick={() => setT(k)}>{x}</button>)}</div>
      <span className={c.p}>{on ? `At ${['8:00', '12:30', '18:00'][t]}` : 'Off'}</span>
    </Phone>
  );
}

/* 11 */ function FeedCards() {
  const [lk, setLk] = useState([1]);
  const flip = (k) => setLk((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  return (
    <Phone label="Feed">
      {[0, 1, 2].map((k) => (
        <div key={k} className={c.post}><span className={c.thumb} style={{ '--h': k * 90 }} /><u className={c.line} /><button type="button" className={c.heart} aria-pressed={lk.includes(k)} aria-label={`Like post ${k + 1}`} onClick={() => flip(k)}><Ico n="heart" /></button></div>
      ))}
    </Phone>
  );
}

/* 12 */ function Stories() {
  const [seen, setSeen] = useState([2]);
  return (
    <Phone label="Story rail">
      <b className={c.h}>Stories</b>
      <div className={c.rail}>{[0, 1, 2, 3, 4].map((k) => <button key={k} type="button" className={c.story} data-seen={seen.includes(k)} aria-label={`Story ${k + 1}`} onClick={() => setSeen((a) => [...new Set([...a, k])])}><Av h={k * 60} s={'ABCDE'[k]} /></button>)}</div>
      <span className={c.p}>{5 - seen.length} unseen</span>
    </Phone>
  );
}

/* 13 */ function SearchScreen() {
  const [q, setQ] = useState('');
  const R = ['coffee', 'bike', 'rent', 'music'];
  return (
    <Phone label="Search screen">
      <label className={c.search}><Ico n="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search" /></label>
      <span className={c.p}>Recent</span>
      <div className={c.chips}>{R.filter((r) => r.includes(q.toLowerCase())).map((r) => <button key={r} type="button" className={c.chip} onClick={() => setQ(r)}>{r}</button>)}</div>
    </Phone>
  );
}

/* 14 */ function TabBar() {
  const [t, setT] = useState(0);
  const T = [['home', 'Home'], ['search', 'Find'], ['bell', 'Alerts'], ['user', 'Me']];
  return (
    <Phone label="Tab bar" className={c.between}>
      <b className={c.h}>{T[t][1]}</b>
      <u className={c.line} /><u className={c.line} style={{ width: '55%' }} />
      <nav className={c.tabs} aria-label="Tabs">{T.map(([n, l], k) => <button key={n} type="button" aria-label={l} aria-current={t === k ? 'page' : undefined} onClick={() => setT(k)}><Ico n={n} /></button>)}</nav>
    </Phone>
  );
}

/* 15 */ function PeekSheet() {
  const [up, setUp] = useState(false);
  return (
    <Phone label="Bottom sheet">
      <span className={c.map} />
      <div className={c.sheet} data-up={up}>
        <button type="button" className={c.grab} aria-expanded={up} aria-label="Sheet handle" onClick={() => setUp((v) => !v)} />
        <b className={c.h}>Nearby</b><u className={c.line} /><u className={c.line} style={{ width: '60%' }} /><u className={c.line} />
      </div>
    </Phone>
  );
}

/* 16 */ function Pull() {
  const [n, setN] = useState(0);
  const t = useTick(900);
  const busy = n > 0 && t - n < 2;
  return (
    <Phone label="Pull to refresh">
      <span className={c.pullSpin} data-busy={busy}><i /></span>
      <div className={c.list} data-busy={busy}>{[0, 1, 2].map((k) => <u key={k} className={c.line} />)}</div>
      <button type="button" className={c.ghost} onClick={() => setN(t + 1)}>Pull</button>
    </Phone>
  );
}

/* 17 */ function SwipeRow() {
  const [open, setOpen] = useState(false);
  return (
    <Phone label="Swipe actions">
      <b className={c.h}>Inbox</b>
      <div className={c.swipe} data-open={open}>
        <span className={c.acts}><button type="button" aria-label="Archive">Arch</button><button type="button" aria-label="Delete">Del</button></span>
        <button type="button" className={c.top} aria-expanded={open} onClick={() => setOpen((v) => !v)}><Av h={40} s="M" /><span><em>Mara</em><small>Lunch?</small></span></button>
      </div>
      <u className={c.line} /><u className={c.line} />
    </Phone>
  );
}

/* 18 */ function Segment() {
  const [s, setS] = useState(0);
  const L = [['Day', ['9:00 Standup', '11:30 Review']], ['Week', ['Mon Plan', 'Thu Demo']], ['Month', ['3 Launch']]];
  return (
    <Phone label="Segment switch">
      <div className={c.seg} role="group" aria-label="Range">{L.map(([t], k) => <button key={t} type="button" aria-pressed={s === k} onClick={() => setS(k)}>{t}</button>)}</div>
      {L[s][1].map((x) => <span key={x} className={c.item}>{x}</span>)}
    </Phone>
  );
}

/* 19 */ function ShareGrid() {
  const [s, setS] = useState(-1);
  const A = [['mail', 'Mail'], ['chat', 'Chat'], ['link', 'Link'], ['copy', 'Copy'], ['download', 'Save'], ['share', 'More']];
  return (
    <Phone label="Share sheet">
      <b className={c.h}>Share</b>
      <div className={c.shareG}>{A.map(([n, l], k) => <button key={n} type="button" aria-pressed={s === k} onClick={() => setS(k)}><Ico n={n} /><small>{l}</small></button>)}</div>
      <span className={c.p}>{s < 0 ? 'Choose where' : `Sent via ${A[s][1]}`}</span>
    </Phone>
  );
}

/* 20 */ function Banner() {
  const [on, setOn] = useState(true);
  return (
    <Phone label="Top banner">
      <button type="button" className={c.banner} data-on={on} aria-label="Notification banner. Click to dismiss" onClick={() => setOn((v) => !v)}><Ico n="mail" /><span><em>New message</em><small>Ana: see you at 6</small></span></button>
      <u className={c.line} /><u className={c.line} /><button type="button" className={c.ghost} onClick={() => setOn(true)}>Again</button>
    </Phone>
  );
}

/* 21 */ function Product() {
  const [size, setSize] = useState(1);
  const [n, setN] = useState(0);
  return (
    <Phone label="Product page">
      <span className={c.hero} />
      <div className={c.row}><b className={c.h}>Trail shell</b><span className={c.price}>$98</span></div>
      <div className={c.chips} role="group" aria-label="Size">{['S', 'M', 'L'].map((x, k) => <button key={x} type="button" className={c.chip} aria-pressed={size === k} onClick={() => setSize(k)}>{x}</button>)}</div>
      <button type="button" className={c.btn} onClick={() => setN((v) => v + 1)}>{n ? `In bag · ${n}` : 'Add to bag'}</button>
    </Phone>
  );
}

/* 22 */ function Chat() {
  const [m, setM] = useState(['Are we on?', 'Yes, 6pm.']);
  const [v, setV] = useState('');
  const send = (e) => { e.preventDefault(); if (v.trim()) { setM((a) => [...a.slice(-3), v.trim()]); setV(''); } };
  return (
    <Phone label="Chat thread" className={c.between}>
      <div className={c.bubbles}>{m.map((x, i) => <span key={`${i}${x}`} data-me={i % 2 === 1}>{x}</span>)}</div>
      <form className={c.compose} onSubmit={send}><input value={v} onChange={(e) => setV(e.target.value)} placeholder="Message" aria-label="Message" /><button type="submit" aria-label="Send"><Ico n="right" /></button></form>
    </Phone>
  );
}

/* 23 */ function Dial() {
  const [d, setD] = useState('');
  return (
    <Phone label="Dial pad" className={c.between}>
      <b className={cx(c.h, c.num)}>{d || '—'}</b>
      <div className={c.pad}>{'123456789*0#'.split('').map((k) => <button key={k} type="button" onClick={() => setD((x) => (x + k).slice(-9))}>{k}</button>)}</div>
      <button type="button" className={c.ghost} onClick={() => setD('')}>Clear</button>
    </Phone>
  );
}

/* 24 */ function MapPin() {
  const [p, setP] = useState(4);
  return (
    <Phone label="Map with a pin">
      <span className={c.mapG} role="group" aria-label="Map">
        {Array.from({ length: 9 }, (_, k) => <button key={k} type="button" aria-label={`Spot ${k + 1}`} aria-pressed={p === k} onClick={() => setP(k)}>{p === k ? <Ico n="pin" /> : null}</button>)}
      </span>
      <b className={c.h}>Spot {p + 1}</b><span className={c.p}>{p * 120 + 80} m away</span>
    </Phone>
  );
}

/* 25 */ function Player() {
  const [on, setOn] = useState(true);
  const n = useTick(500);
  const [t0, setT0] = useState(0);
  const p = on ? ((n - t0) % 40) / 40 : 0;
  return (
    <Phone label="Music player" className={c.center}>
      <span className={c.cover} />
      <b className={c.h}>Slow light</b>
      <span className={c.prog}><i style={{ width: `${p * 100}%` }} /></span>
      <button type="button" className={c.play} aria-pressed={on} aria-label={on ? 'Pause' : 'Play'} onClick={() => { setOn((v) => !v); setT0(n); }}><Ico n={on ? 'pause' : 'play'} /></button>
    </Phone>
  );
}

/* 26 */ function Shutter() {
  const [n, setN] = useState(0);
  const [m, setM] = useState(0);
  return (
    <Phone label="Camera" className={c.between}>
      <span className={c.view}><i key={n} className={c.flash} data-go={n > 0} /></span>
      <div className={c.modes} role="group" aria-label="Mode">{['Photo', 'Video', 'Pano'].map((x, k) => <button key={x} type="button" aria-pressed={m === k} onClick={() => setM(k)}>{x}</button>)}</div>
      <button type="button" className={c.shutter} aria-label="Take a picture" onClick={() => setN((v) => v + 1)} />
    </Phone>
  );
}

/* 27 */ function Agenda() {
  const [o, setO] = useState(1);
  const E = [['9:00', 'Standup', 'Room 2'], ['11:30', 'Review', 'Video'], ['15:00', 'Demo', 'Hall']];
  return (
    <Phone label="Day agenda">
      <b className={c.h}>Today</b>
      {E.map(([t, n, w], k) => <button key={t} type="button" className={c.ev} aria-expanded={o === k} onClick={() => setO(o === k ? -1 : k)}><small>{t}</small><span><em>{n}</em>{o === k ? <small>{w}</small> : null}</span></button>)}
    </Phone>
  );
}

/* 28 */ function Wallet() {
  const [front, setFront] = useState(0);
  return (
    <Phone label="Wallet cards">
      <div className={c.wallet}>
        {[0, 1, 2].map((k) => { const d = (k - front + 3) % 3; return <button key={k} type="button" aria-label={`Card ${k + 1}`} onClick={() => setFront(k)} style={{ '--d': d, '--h': k * 110 }}><small>•••• {4200 + k * 17}</small></button>; })}
      </div>
    </Phone>
  );
}

/* 29 */ function SlidePay() {
  const [v, bind] = useDrag({ mode: 'x', init: 0 });
  return (
    <Phone label="Slide to pay" className={c.center}>
      <b className={c.h}>$42.00</b>
      <span className={c.p}>Blue Door Cafe</span>
      <div className={c.slide} {...bind} aria-label="Slide to pay"><i style={{ left: `${v * 78}%` }}><Ico n="right" /></i><em style={{ opacity: 1 - v }}>slide</em></div>
      <span className={c.p}>{v > 0.95 ? 'Paid' : 'Not paid'}</span>
    </Phone>
  );
}

/* 30 */ function SettingsList() {
  const [s, setS] = useState([true, false, true]);
  const set = (k) => (v) => setS((a) => a.map((x, i) => (i === k ? v : x)));
  return (
    <Phone label="Settings list">
      <b className={c.h}>Settings</b>
      {['Wi-Fi', 'Airplane', 'Alerts'].map((t, k) => <div key={t} className={c.row}><span>{t}</span><Sw on={s[k]} set={set(k)} label={t} /></div>)}
    </Phone>
  );
}

/* 31 */ function ProfileTop() {
  const [f, setF] = useState(false);
  return (
    <Phone label="Profile header" className={c.center}>
      <Av h={20} s="A" />
      <b className={c.h}>Ada</b>
      <span className={c.p}>{f ? 241 : 240} followers</span>
      <button type="button" className={f ? c.ghost : c.btn} aria-pressed={f} onClick={() => setF((v) => !v)}>{f ? 'Following' : 'Follow'}</button>
    </Phone>
  );
}

/* 32 */ function ThemeChoice() {
  const [t, setT] = useState(0);
  return (
    <Phone label="Theme choice" className={cx(c.themed, t === 1 && c.light)}>
      <b className={c.h}>Theme</b>
      <div className={c.radios} role="radiogroup" aria-label="Theme">{['Dark', 'Light', 'Auto'].map((x, k) => <button key={x} type="button" role="radio" aria-checked={t === k} onClick={() => setT(k)}>{x}</button>)}</div>
      <u className={c.line} /><u className={c.line} style={{ width: '60%' }} />
    </Phone>
  );
}

/* 33 */ function Language() {
  const [l, setL] = useState(0);
  return (
    <Phone label="Language list">
      <b className={c.h}>Language</b>
      <div className={c.radios} role="radiogroup" aria-label="Language">{['English', 'Español', '日本語', 'Norsk'].map((x, k) => <button key={x} type="button" role="radio" aria-checked={l === k} onClick={() => setL(k)}>{x}{l === k ? <Ico n="check" /> : null}</button>)}</div>
    </Phone>
  );
}

/* 34 */ function Privacy() {
  const [s, setS] = useState([true, true, false]);
  const set = (k) => (v) => setS((a) => a.map((x, i) => (i === k ? v : x)));
  const T = [['Location', 'While open'], ['Contacts', 'Never shared'], ['Ads', 'Personalised']];
  return (
    <Phone label="Privacy switches">
      {T.map(([t, d], k) => <div key={t} className={c.row}><span><em>{t}</em><small>{d}</small></span><Sw on={s[k]} set={set(k)} label={t} /></div>)}
    </Phone>
  );
}

/* 35 */ function Storage() {
  const [used, setUsed] = useState(62);
  return (
    <Phone label="Storage bar">
      <b className={c.h}>Storage</b>
      <span className={c.store}><i style={{ width: `${used * 0.5}%`, background: '#60a5fa' }} /><i style={{ width: `${used * 0.3}%`, background: '#ffb84d' }} /><i style={{ width: `${used * 0.2}%`, background: '#ff5a5a' }} /></span>
      <span className={c.p}>{used} GB of 128</span>
      <button type="button" className={c.ghost} onClick={() => setUsed((v) => Math.max(12, v - 15))}>Clear cache</button>
    </Phone>
  );
}

/* 36 */ function DeleteGuard() {
  const [v, setV] = useState('');
  return (
    <Phone label="Delete guard" className={c.center}>
      <span className={c.art} style={{ background: '#ff5a5a' }}><Ico n="trash" /></span>
      <span className={c.p}>Type DELETE to confirm</span>
      <input className={c.in} value={v} onChange={(e) => setV(e.target.value)} aria-label="Type DELETE" />
      <button type="button" className={c.btn} disabled={v !== 'DELETE'}>Delete account</button>
    </Phone>
  );
}

/* 37 */ function SignOut() {
  const [a, setA] = useState('');
  return (
    <Phone label="Sign-out ask" className={c.bottom}>
      <span className={c.dim} />
      <div className={c.ask}>
        <b className={c.h}>Sign out?</b>
        <span className={c.p}>{a === 'y' ? 'Signed out' : a === 'n' ? 'Still here' : 'You can sign back in.'}</span>
        <button type="button" className={c.btn} onClick={() => setA('y')}>Sign out</button>
        <button type="button" className={c.ghost} onClick={() => setA('n')}>Stay</button>
      </div>
    </Phone>
  );
}

/* 38 */ function BuildTap() {
  const [n, setN] = useState(3);
  return (
    <Phone label="Build number" className={c.center}>
      <span className={c.logo}>H</span>
      <button type="button" className={c.ghost} onClick={() => setN((v) => v + 1)}>Build 1.4.2</button>
      <span className={c.p}>{n >= 7 ? 'Developer mode on' : `${7 - n} taps to go`}</span>
    </Phone>
  );
}

/* 39 */ function Empty() {
  const [has, setHas] = useState(false);
  return (
    <Phone label="Empty state" className={c.center}>
      {has ? [0, 1, 2].map((k) => <span key={k} className={c.item}>Task {k + 1}</span>) : <><span className={c.art} style={{ background: '#3a3b42' }}><Ico n="list" /></span><b className={c.h}>Nothing yet</b></>}
      <button type="button" className={has ? c.ghost : c.btn} onClick={() => setHas((v) => !v)}>{has ? 'Clear' : 'Add a task'}</button>
    </Phone>
  );
}

/* 40 */ function Offline() {
  const [st, setSt] = useState(0);
  const n = useTick(900);
  const [t0, setT0] = useState(-9);
  const busy = n - t0 < 2 && st === 1;
  const state = busy ? 'busy' : st === 1 ? 'ok' : 'off';
  return (
    <Phone label="Offline retry" className={c.center}>
      <span className={c.art} style={{ background: state === 'ok' ? '#4ade80' : state === 'busy' ? '#60a5fa' : '#ff5a5a' }}><Ico n={state === 'ok' ? 'check' : 'bolt'} /></span>
      <b className={c.h}>{state === 'ok' ? 'Back online' : state === 'busy' ? 'Trying…' : 'No connection'}</b>
      <button type="button" className={c.btn} onClick={() => { setSt(st === 1 ? 0 : 1); setT0(n); }}>{st === 1 ? 'Go offline' : 'Retry'}</button>
    </Phone>
  );
}

/* 41 */ function LoadContent() {
  const n = useCycle(6, 1100);
  const loaded = n >= 3;
  return (
    <Phone label="Loading then content">
      <div className={c.row}><span className={cx(c.skel, loaded && c.gone)} style={{ width: '45%' }} /><b className={c.h} style={{ opacity: loaded ? 1 : 0 }}>Reports</b></div>
      {[0, 1, 2].map((k) => <div key={k} className={cx(c.sk, loaded && c.loaded)}><i /><u className={c.line} /></div>)}
      <span className={c.p}>{loaded ? 'Loaded' : 'Loading…'}</span>
    </Phone>
  );
}

/* 42 */ function Done() {
  const [n, setN] = useState(1);
  return (
    <Phone label="Success" className={c.center}>
      <button type="button" className={c.okring} aria-label="Replay" onClick={() => setN((v) => v + 1)}>
        <svg key={n} viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" pathLength="1" /><path d="M15 27l8 8 14-16" pathLength="1" /></svg>
      </button>
      <b className={c.h}>All done</b>
      <span className={c.p}>Tap to replay</span>
    </Phone>
  );
}


export default {
  Visual,
  items: [
    ['Welcome splash', Welcome, 'click'], ['Intro slides', Intro, 'click'], ['Permission ask', Permission, 'click'], ['Sign-in form', SignIn, 'type'],
    ['Setup steps', Setup, 'click'], ['Code entry', Code, 'type'], ['Face ID prompt', FaceId, 'click'], ['Avatar pick', Avatars, 'click'],
    ['Interest chips', Interests, 'click'], ['Reminder opt-in', Remind, 'click'], ['Feed cards', FeedCards, 'click'], ['Story rail', Stories, 'click'],
    ['Search screen', SearchScreen, 'type'], ['Tab bar', TabBar, 'click'], ['Peek sheet', PeekSheet, 'click'], ['Pull refresh', Pull, 'click'],
    ['Swipe row', SwipeRow, 'click'], ['Segment switch', Segment, 'click'], ['Share grid', ShareGrid, 'click'], ['Top banner', Banner, 'click'],
    ['Product page', Product, 'click'], ['Chat thread', Chat, 'type'], ['Dial pad', Dial, 'press'], ['Map pin', MapPin, 'click'],
    ['Music player', Player, 'click'], ['Camera shutter', Shutter, 'click'], ['Day agenda', Agenda, 'click'], ['Wallet stack', Wallet, 'click'],
    ['Slide to pay', SlidePay, 'drag'], ['Settings list', SettingsList, 'click'], ['Profile top', ProfileTop, 'click'], ['Theme choice', ThemeChoice, 'click'],
    ['Language list', Language, 'click'], ['Privacy switches', Privacy, 'click'], ['Storage bar', Storage, 'click'], ['Delete guard', DeleteGuard, 'type'],
    ['Sign-out ask', SignOut, 'click'], ['Build tap', BuildTap, 'click'], ['Empty state', Empty, 'click'], ['Offline retry', Offline, 'click'],
    ['Load to content', LoadContent, 'auto'], ['Done check', Done, 'click'],
  ],
};
