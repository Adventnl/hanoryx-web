import { useCallback, useEffect, useRef, useState } from 'react';
import { useCycle, useDrag, useLive, useTick, useToggle } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Ico } from '../icons';
import c from './toasts.module.css';

/* ============================================================
   27 · TOASTS — alerts, banners and notices.
   The still side is a stack of five notices that arrive one by one as the page
   scrolls: each slides in on its --f and the ones before it shrink back, as
   a real stack does. Specimens use a small queue (auto-dismiss that pauses
   under the pointer or focus) and announce themselves politely to a screen reader.
   ============================================================ */

const NOTES = [['check', 'Saved', 'All changes stored'], ['bell', 'Reminder', 'Review at five'], ['mail', 'New message', 'From the studio'], ['download', 'Export ready', 'report.pdf'], ['flag', 'Flagged', 'Needs a second look']];

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      {NOTES.map(([n, t, d], k) => (
        <div key={t} className={c.visToast} style={{ '--k': k }}>
          <Ico n={n} /><b>{t}</b><span>{d}</span>
        </div>
      ))}
      <small>5 NOTICES · 1 STACK</small>
    </div>
  );
}

/* a queue of toasts: push adds one, each leaves after `ms` unless it is hovered or focused.
   While its specimen is on screen a queue also fires one now and then by itself, so a
   stage is never an empty box (not under reduced motion). */
function useQueue(ms = 2800, max = 3, auto = true) {
  const [list, setList] = useState([]);
  const n = useRef(0);
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const push = useCallback((t) => { n.current += 1; setList((l) => [...l.slice(-(max - 1)), { id: n.current, ...t }]); }, [max]);
  useEffect(() => {
    if (!auto || !live || reduced) return undefined;
    const first = setTimeout(() => push({}), 700);
    const loop = setInterval(() => push({}), ms + 2400);
    return () => { clearTimeout(first); clearInterval(loop); };
  }, [auto, live, reduced, ms, push]);
  const drop = (id) => setList((l) => l.filter((x) => x.id !== id));
  return [list, push, drop, ms];
}

function Toast({ t, ms, drop, className, children, paused }) {
  const [hold, setHold] = useState(false);
  const left = useRef(ms);
  const started = useRef(0);
  useEffect(() => {
    if (hold || paused) return undefined;
    started.current = Date.now();
    const id = setTimeout(() => drop(t.id), left.current);
    return () => { clearTimeout(id); left.current = Math.max(400, left.current - (Date.now() - started.current)); };
  }, [hold, paused, drop, t.id]);
  return (
    <div role="status" className={className} data-hold={hold} style={{ '--ms': `${ms}ms` }} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      {children}
    </div>
  );
}

const Fire = ({ onClick, children = 'Show toast' }) => <button type="button" className={c.fire} onClick={onClick}>{children}</button>;

/* 1 */ function Basic() {
  const [list, push, drop, ms] = useQueue();
  return <div className={c.stage}><Fire onClick={() => push({})} />{list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={c.toast}>Settings updated</Toast>)}</div>;
}

/* 2 */ function Success() {
  const [list, push, drop, ms] = useQueue();
  return <div className={c.stage}><Fire onClick={() => push({})}>Save</Fire>{list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={`${c.toast} ${c.ok}`}><Ico n="check" />Saved to your library</Toast>)}</div>;
}

/* 3 */ function Failure() {
  const [list, push, drop, ms] = useQueue(3200);
  return <div className={c.stage}><Fire onClick={() => push({})}>Break it</Fire>{list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={`${c.toast} ${c.bad}`}><Ico n="close" />Could not reach the server</Toast>)}</div>;
}

/* 4 */ function WarnBanner() {
  const [on, flip] = useToggle(true);
  return (
    <div className={c.bannerBox}>
      {on && <div role="alert" className={`${c.banner} ${c.warn}`}><Ico n="flag" /><span>Your plan renews in 3 days.</span></div>}
      <Fire onClick={flip}>{on ? 'Hide' : 'Show'}</Fire>
    </div>
  );
}

/* 5 */ function InfoBanner() {
  return <div role="note" className={`${c.banner} ${c.info}`}><Ico n="bolt" /><span>New release is out. <a href="#toast" onClick={(e) => e.preventDefault()}>See what changed</a></span></div>;
}

/* 6 */ function Undo() {
  const [list, push, drop, ms] = useQueue(4000, 1);
  const [gone, setGone] = useState(false);
  return (
    <div className={c.stage}>
      <Fire onClick={() => { setGone(true); push({}); }}>{gone ? 'Deleted' : 'Delete file'}</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={(id) => { drop(id); }} className={c.toast}>File deleted<button type="button" onClick={() => { setGone(false); drop(t.id); }}>Undo</button><i aria-hidden="true" /></Toast>)}
    </div>
  );
}

/* 7 */ function UploadToast() {
  const [p, setP] = useState(-1);
  useEffect(() => {
    if (p < 0 || p >= 100) return undefined;
    const id = setTimeout(() => setP((v) => Math.min(100, v + 7)), 120);
    return () => clearTimeout(id);
  }, [p]);
  return (
    <div className={c.stage}>
      <Fire onClick={() => setP(0)}>Upload</Fire>
      {p >= 0 && <div role="status" className={c.toast}><span>{p < 100 ? `Uploading… ${p}%` : 'Upload complete'}</span><u aria-hidden="true"><s style={{ width: `${p}%` }} /></u></div>}
    </div>
  );
}

/* 8 */ function Stacked() {
  const [list, push, drop] = useQueue(60000, 3, false);
  const [k, setK] = useState(0);
  return (
    <div className={c.stage}>
      <Fire onClick={() => { setK(k + 1); push({ k: k + 1 }); }}>Add notice</Fire>
      <div className={c.pile}>{list.map((t, i) => <Toast key={t.id} t={t} ms={60000} drop={drop} className={c.pileItem} paused><span style={{ '--d': list.length - 1 - i }}>Notice {t.k}</span><button type="button" aria-label={`Dismiss notice ${t.k}`} onClick={() => drop(t.id)}>×</button></Toast>)}</div>
    </div>
  );
}

/* 9 */ function Swipe() {
  const [v, bind, set] = useDrag({ init: 0.5 });
  const [gone, setGone] = useState(false);
  const off = (v - 0.5) * 2;
  return gone ? <button type="button" className={c.fire} onClick={() => { setGone(false); set(0.5); }}>Bring it back</button> : (
    <div className={c.swipe} {...bind} aria-label="Swipe this notice away, or press an arrow key" aria-valuetext={Math.abs(off) > 0.7 ? 'dismissing' : 'in place'} style={{ ...bind.style, '--x': off }} onPointerUp={() => { if (Math.abs(off) > 0.7) setGone(true); else set(0.5); }} onKeyUp={() => { if (Math.abs(off) > 0.7) setGone(true); }}>
      <Ico n="mail" /><span>Swipe me away</span>
    </div>
  );
}

/* 10 */ function Snack() {
  const [list, push, drop, ms] = useQueue(3600, 1);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Archive</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={c.snack}><span>Conversation archived</span><button type="button" onClick={() => drop(t.id)}>Undo</button></Toast>)}
    </div>
  );
}

/* 11 */ function Preferences() {
  const [on, setOn] = useState(true);
  return (
    <div className={c.stage}>
      {on ? <div role="region" aria-label="Preferences" className={c.consent}><p>Pick how this site behaves for you.</p><div><button type="button" onClick={() => setOn(false)}>Keep defaults</button><button type="button" onClick={() => setOn(false)}>Choose</button></div></div> : <Fire onClick={() => setOn(true)}>Ask again</Fire>}
    </div>
  );
}

/* 12 */ function InlineAlert() {
  const [k, setK] = useState(0);
  const kinds = [['Heads up', 'Backups run at night.', c.aInfo], ['Done', 'Your changes are live.', c.aOk], ['Careful', 'This cannot be undone.', c.aWarn], ['Failed', 'We could not save that.', c.aBad]];
  return (
    <div className={c.alerts}>
      <div role="group" aria-label="Alert type">{kinds.map(([t], i) => <button key={t} type="button" aria-pressed={i === k} onClick={() => setK(i)}>{t}</button>)}</div>
      <div role="alert" className={`${c.alert} ${kinds[k][2]}`} key={k}><b>{kinds[k][0]}</b><span>{kinds[k][1]}</span></div>
    </div>
  );
}

/* 13 */ function Callout() {
  const [k, setK] = useState(0);
  const kinds = [['Note', 'pen', 'Notes sit quietly beside the text.'], ['Tip', 'bolt', 'Press ? to see every shortcut.'], ['Warning', 'flag', 'Deleting a project deletes its files.']];
  return (
    <div className={c.callout}>
      <div role="tablist" aria-label="Callout kind">{kinds.map(([t], i) => <button key={t} type="button" role="tab" aria-selected={i === k} onClick={() => setK(i)}>{t}</button>)}</div>
      <aside data-k={k}><Ico n={kinds[k][1]} /><div><b>{kinds[k][0]}</b><p>{kinds[k][2]}</p></div></aside>
    </div>
  );
}

/* 14 */ function Marquee() {
  return (
    <div className={c.marquee} role="note" aria-label="Announcement">
      <div aria-hidden="true">{Array.from({ length: 2 }, (_, k) => <span key={k}>New studio hours · Spring release · Open call for work · </span>)}</div>
      <p className="sr-only">New studio hours, spring release, open call for work.</p>
    </div>
  );
}

/* 15 */ function Dismissible() {
  const [on, setOn] = useState(true);
  return (
    <div className={c.dismiss}>
      <div className={c.collapse} data-open={on}><div role="note"><span>Free shipping this week.</span><button type="button" aria-label="Dismiss banner" onClick={() => setOn(false)}><Ico n="close" /></button></div></div>
      {!on && <Fire onClick={() => setOn(true)}>Bring back</Fire>}
    </div>
  );
}

/* 16 */ function RingTimer() {
  const [list, push, drop, ms] = useQueue(3000, 1);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Ping</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={c.toast}><svg className={c.ringT} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="10" pathLength="1" /></svg>Closing soon</Toast>)}
    </div>
  );
}

/* 17 */ function BellShake() {
  const [n, setN] = useState(0);
  return (
    <div className={c.bell}>
      <button type="button" aria-label={`Notifications, ${n} new`} onClick={() => setN(n === 0 ? 1 : 0)} key={n} data-new={n > 0}><Ico n="bell" />{n > 0 && <b aria-hidden="true">{n}</b>}</button>
      <button type="button" className={c.fire} onClick={() => setN(n + 1)}>New alert</button>
    </div>
  );
}

/* 18 */ function CornerPop() {
  const [list, push, drop, ms] = useQueue(3000, 2);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Pop</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={c.corner}>Hello <span aria-hidden="true">✦</span></Toast>)}
    </div>
  );
}

/* 19 */ function AvatarToast() {
  const [list, push, drop, ms] = useQueue(3600, 1);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Message</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={c.toast}><i className={c.av}>MK</i><span><b>Mira</b>Lunch at one?</span></Toast>)}
    </div>
  );
}

/* 20 */ function ImageToast() {
  const [list, push, drop, ms] = useQueue(3600, 1);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Snap</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={c.toast}><i className={c.thumb} /><span><b>Screenshot saved</b>to Pictures</span></Toast>)}
    </div>
  );
}

/* 21 */ function ActionToast() {
  const [list, push, drop, ms] = useQueue(5000, 1);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Incoming</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={`${c.toast} ${c.tall}`}><span><b>Ada commented</b>“Can we ship it?”</span><div><button type="button" onClick={() => drop(t.id)}>Reply</button><button type="button" onClick={() => drop(t.id)}>Mute</button></div></Toast>)}
    </div>
  );
}

/* 22 */ function SystemBar() {
  return (
    <div role="alert" className={`${c.banner} ${c.sys}`}><i aria-hidden="true" /><span>Degraded: search is slow. We are on it.</span></div>
  );
}

/* 23 */ function Drawer() {
  const [open, flip] = useToggle();
  return (
    <div className={c.drawerBox}>
      <Fire onClick={flip}>{open ? 'Close panel' : 'Open panel'}</Fire>
      <aside className={c.drawer} data-open={open} aria-label="Notifications panel" inert={!open || undefined}>{['Build passed', 'Review requested', 'Mention in #ops'].map((t) => <p key={t}>{t}</p>)}</aside>
    </div>
  );
}

/* 24 */ function Flash() {
  const [k, setK] = useState(0);
  return (
    <div className={c.stage}>
      <Fire onClick={() => setK(k + 1)}>Flash</Fire>
      {k > 0 && <p key={k} role="status" className={c.flash}>Link copied to clipboard</p>}
    </div>
  );
}

/* 25 */ function Confetti() {
  const [k, setK] = useState(0);
  return (
    <div className={c.stage}>
      <Fire onClick={() => setK(k + 1)}>Celebrate</Fire>
      {k > 0 && <div key={k} role="status" className={`${c.toast} ${c.party}`}>{Array.from({ length: 14 }, (_, i) => <i key={i} aria-hidden="true" style={{ '--a': i * 25.7, '--h': (i * 47) % 360 }} />)}<b>Goal reached</b></div>}
    </div>
  );
}

/* 26 */ function Sequence() {
  const [k, setK] = useState(0);
  const msgs = ['Connecting…', 'Syncing 3 files…', 'All up to date'];
  useEffect(() => {
    if (k === 0 || k > 3) return undefined;
    const id = setTimeout(() => setK((v) => v + 1), 1100);
    return () => clearTimeout(id);
  }, [k]);
  return (
    <div className={c.stage}>
      <Fire onClick={() => setK(1)}>Sync</Fire>
      {k >= 1 && k <= 3 && <div role="status" className={c.toast} key={k}>{k === 3 ? <Ico n="check" /> : <i className={c.spin} aria-hidden="true" />}{msgs[k - 1]}</div>}
    </div>
  );
}

/* 27 */ function Where() {
  const [pos, setPos] = useState('br');
  const names = { tl: 'Top left', tr: 'Top right', bl: 'Bottom left', br: 'Bottom right' };
  return (
    <div className={c.where}>
      <div className={c.screen}><i data-pos={pos} aria-hidden="true" /></div>
      <div role="radiogroup" aria-label="Toast position">{Object.keys(names).map((k) => <button key={k} type="button" role="radio" aria-checked={pos === k} aria-label={names[k]} onClick={() => setPos(k)} data-k={k} />)}</div>
    </div>
  );
}

/* 28 */ function Duration() {
  const [v, bind] = useDrag({ init: 0.4, steps: 8 });
  const sec = 2 + Math.round(v * 8);
  const [k, setK] = useState(0);
  return (
    <div className={c.dur}>
      <div className={c.durRange} {...bind} aria-label="Toast duration" aria-valuetext={`${sec} seconds`} style={{ ...bind.style, '--v': v }}><i /></div>
      <Fire onClick={() => setK(k + 1)}>{sec}s toast</Fire>
      {k > 0 && <u key={`${k}-${sec}`} className={c.durBar} style={{ '--ms': `${sec}s` }} aria-hidden="true" />}
    </div>
  );
}

/* 29 */ function Offline() {
  const [off, flip] = useToggle();
  return (
    <div className={c.offline}>
      <div className={c.offBar} data-off={off} role="status">{off ? 'You are offline. Changes will sync later.' : 'Back online'}</div>
      <Fire onClick={flip}>{off ? 'Go online' : 'Go offline'}</Fire>
    </div>
  );
}

/* 30 */ function NetPill() {
  const [k, setK] = useState(0);
  const st = [['Online', 'ok'], ['Slow', 'warn'], ['Offline', 'bad']];
  return (
    <button type="button" className={c.pill} data-t={st[k][1]} aria-label={`Network ${st[k][0]}. Click to change`} onClick={() => setK((k + 1) % 3)}><i aria-hidden="true" />{st[k][0]}</button>
  );
}

/* 31 */ function Update() {
  const [s, setS] = useState('ask');
  return (
    <div className={c.stage}>
      {s === 'ask' ? <div role="status" className={`${c.toast} ${c.tall}`}><span><b>Update available</b>Version 2.4 is ready</span><div><button type="button" onClick={() => setS('now')}>Restart</button><button type="button" onClick={() => setS('later')}>Later</button></div></div> : <><p className={c.said}>{s === 'now' ? 'Restarting…' : 'We will ask tomorrow.'}</p><Fire onClick={() => setS('ask')}>Again</Fire></>}
    </div>
  );
}

/* 32 */ function CopyToast() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return undefined;
    const id = setTimeout(() => setOn(false), 1500);
    return () => clearTimeout(id);
  }, [on]);
  return (
    <div className={c.copy}>
      <code>npm i hanoryx</code>
      <button type="button" onClick={() => setOn(true)} aria-label="Copy command">{on ? <Ico n="check" /> : <Ico n="copy" />}</button>
      <span role="status" data-on={on}>Copied</span>
    </div>
  );
}

/* 33 */ function ErrorSummary() {
  const [shown, flip] = useToggle(true);
  return (
    <div className={c.summary}>
      {shown && <div role="alert"><b>2 problems</b><ul><li><a href="#e" onClick={(e) => e.preventDefault()}>Name is required</a></li><li><a href="#e" onClick={(e) => e.preventDefault()}>Enter a valid mail</a></li></ul></div>}
      <Fire onClick={flip}>{shown ? 'Fix them' : 'Submit'}</Fire>
    </div>
  );
}

/* 34 */ function FieldHint() {
  const [v, setV] = useState('ada');
  const bad = v.length < 4;
  return (
    <label className={c.field} data-bad={bad}>
      <span>Handle</span>
      <input value={v} onChange={(e) => setV(e.target.value)} aria-invalid={bad} aria-describedby="hint-34" />
      <small id="hint-34" role={bad ? 'alert' : undefined}>{bad ? 'At least four characters.' : 'Looks good.'}</small>
    </label>
  );
}

/* 35 */ function Autosave() {
  const t = useTick(2400);
  const phase = t % 3;
  return <div role="status" className={c.autosave} data-p={phase}><i aria-hidden="true" />{['Saved', 'Saving…', 'Saved'][phase]}</div>;
}

/* 36 */ function CartToast() {
  const [list, push, drop, ms] = useQueue(3600, 1);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Add to bag</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={`${c.toast} ${c.rise}`}><Ico n="cart" /><span>Added to your bag</span><button type="button" onClick={() => drop(t.id)}>View</button></Toast>)}
    </div>
  );
}

/* 37 */ function ReactToast() {
  const [pick, setPick] = useState('');
  return (
    <div className={c.reactT} role="group" aria-label="How was that?">
      <p>{pick ? `You said ${pick}` : 'How was that?'}</p>
      <div>{['☹', '☻', '★'].map((f) => <button key={f} type="button" aria-pressed={pick === f} aria-label={`React ${f}`} onClick={() => setPick(f)}>{f}</button>)}</div>
    </div>
  );
}

/* 38 */ function BarToast() {
  const [list, push, drop, ms] = useQueue(3500, 1);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Show</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={`${c.toast} ${c.timed}`}>Auto-dismiss in 3.5s<i aria-hidden="true" /></Toast>)}
    </div>
  );
}

/* 39 */ function HoverPause() {
  const [list, push, drop, ms] = useQueue(3000, 1);
  return (
    <div className={c.stage}>
      <Fire onClick={() => push({})}>Show</Fire>
      {list.map((t) => <Toast key={t.id} t={t} ms={ms} drop={drop} className={`${c.toast} ${c.timed}`}>Hover to hold me<i aria-hidden="true" /></Toast>)}
    </div>
  );
}

/* 40 */ function Fanned() {
  const [open, setOpen] = useState(false);
  return (
    <div className={c.fanBox} onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} data-open={open}>
      {['Build passed', 'Deploy started', 'Review requested'].map((t, i) => <button key={t} type="button" style={{ '--i': i }}>{t}</button>)}
    </div>
  );
}

/* 41 */ function Sale() {
  const t = useTick(1000);
  const left = 134 - (t % 134);
  return <div role="timer" aria-label="Sale countdown" className={`${c.banner} ${c.sale}`}><span>Sale ends in</span><b>{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</b></div>;
}

/* 42 */ function LiveLine() {
  const k = useCycle(4, 2200);
  const lines = ['Build 214 started', 'Tests passing: 312', 'Deploying to preview', 'Preview is live'];
  return <p role="status" className={c.live} key={k}><i aria-hidden="true" />{lines[k]}</p>;
}

export default {
  Visual,
  items: [
    ['Quiet toast', Basic, 'click'], ['Success toast', Success, 'click'], ['Failure toast', Failure, 'click'], ['Warning banner', WarnBanner, 'click'],
    ['Info banner', InfoBanner, 'static'], ['Undo toast', Undo, 'click'], ['Upload toast', UploadToast, 'click'], ['Stacked notices', Stacked, 'click'],
    ['Swipe away', Swipe, 'drag'], ['Snackbar', Snack, 'click'], ['Preference bar', Preferences, 'click'], ['Inline alert', InlineAlert, 'click'],
    ['Callout', Callout, 'click'], ['Announcement marquee', Marquee, 'auto'], ['Dismissible banner', Dismissible, 'click'], ['Timer ring toast', RingTimer, 'click'],
    ['Bell shake', BellShake, 'click'], ['Corner pop', CornerPop, 'click'], ['Avatar toast', AvatarToast, 'click'], ['Image toast', ImageToast, 'click'],
    ['Action toast', ActionToast, 'click'], ['System bar', SystemBar, 'auto'], ['Notification panel', Drawer, 'click'], ['Flash message', Flash, 'click'],
    ['Confetti toast', Confetti, 'click'], ['Toast sequence', Sequence, 'click'], ['Position picker', Where, 'click'], ['Duration slider', Duration, 'drag'],
    ['Offline bar', Offline, 'click'], ['Network pill', NetPill, 'click'], ['Update prompt', Update, 'click'], ['Copy confirm', CopyToast, 'click'],
    ['Error summary', ErrorSummary, 'click'], ['Field hint', FieldHint, 'type'], ['Autosave line', Autosave, 'auto'], ['Bag toast', CartToast, 'click'],
    ['Reaction prompt', ReactToast, 'click'], ['Timed toast', BarToast, 'click'], ['Hover to hold', HoverPause, 'hover'], ['Fanned notices', Fanned, 'hover'],
    ['Sale countdown', Sale, 'auto'], ['Live status line', LiveLine, 'auto'],
  ],
};
