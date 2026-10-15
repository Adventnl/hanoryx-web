import { useState } from 'react';
import { pad2, useDrag, useTick } from '../hooks';
import { Ico } from '../icons';
import c from './checkout.module.css';

/* ============================================================
   49 · CHECKOUT — pricing, carts and order flows.
   The still side is a receipt that prints as the scroll advances: a line
   appears for each item, then the total underlines itself. The forty-two
   specimens are the parts of buying something: plan cards and toggles, cart
   lines and shipping, the steps of paying, and what comes after. The prices are
   made up, but every control does its sum: change a quantity, a plan or a tip
   and the totals follow. Nothing is sent anywhere.
   ============================================================ */

const LINES = [['Trail shell', 98], ['Wool socks ×2', 24], ['Map case', 18], ['Water bottle', 22], ['Gift wrap', 4], ['Shipping', 0]];
function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visTicket}>
        <b>HANORYX SHOP</b>
        <small>ORDER 0417 · 14 OCT</small>
        {LINES.map(([t, p], k) => <p key={t} style={{ '--k': k }}><span>{t}</span><span>{p ? `$${p}.00` : 'free'}</span></p>)}
        <p className={c.visTotal}><span>TOTAL</span><span>$166.00</span></p>
        <i />
      </div>
      <small>6 LINES · 1 TOTAL</small>
    </div>
  );
}

const cx = (...a) => a.filter(Boolean).join(' ');
const $ = (n, cur = '$') => `${cur}${n.toFixed(2).replace(/\.00$/, '')}`;
const Co = ({ label, children, className, ...r }) => <div className={cx(c.co, className)} role="group" aria-label={label} {...r}>{children}</div>;
const Step = ({ v, set, min = 0, max = 9, label }) => <span className={c.step}><button type="button" aria-label={`Fewer ${label}`} disabled={v <= min} onClick={() => set(v - 1)}>−</button><b aria-live="polite">{v}</b><button type="button" aria-label={`More ${label}`} disabled={v >= max} onClick={() => set(v + 1)}>+</button></span>;
const PLANS = [['Solo', 9, 'One seat'], ['Team', 29, 'Ten seats'], ['Scale', 99, 'Unlimited']];

/* 01 */ function PlanCards() {
  const [s, setS] = useState(1);
  return <Co label="Plans" className={c.plans}>{PLANS.map(([n, p, d], k) => <button key={n} type="button" aria-pressed={s === k} onClick={() => setS(k)}><small>{n}</small><b>{$(p)}</b><em>{d}</em></button>)}</Co>;
}

/* 02 */ function Billing() {
  const [y, setY] = useState(false);
  return (
    <Co label="Billing period" className={c.center}>
      <div className={c.seg} role="group" aria-label="Period"><button type="button" aria-pressed={!y} onClick={() => setY(false)}>Monthly</button><button type="button" aria-pressed={y} onClick={() => setY(true)}>Yearly</button></div>
      <b className={c.big}>{y ? '$24' : '$29'}<small>/mo</small></b>
      <small className={c.save}>{y ? 'Save $60 a year' : 'Switch to save 17%'}</small>
    </Co>
  );
}

/* 03 */ function Seats() {
  const [n, setN] = useState(5);
  return <Co label="Seats" className={c.center}><span className={c.m}>Seats</span><Step v={n} set={setN} min={1} max={20} label="seats" /><b className={c.big}>{$(n * 8)}<small>/mo</small></b></Co>;
}

/* 04 */ function Usage() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.3 });
  const gb = Math.round(10 + v * 990);
  return (
    <Co label="Usage" className={c.center}>
      <span className={c.m}>{gb} GB a month</span>
      <div className={c.rail} {...bind} aria-label="Storage"><u style={{ left: `${v * 100}%` }} /></div>
      <b className={c.big}>{$(Math.ceil(gb / 50) * 2)}<small>/mo</small></b>
    </Co>
  );
}

/* 05 */ function Matrix() {
  const F = [['Projects', [1, 1, 1]], ['Export', [0, 1, 1]], ['SSO', [0, 0, 1]]];
  return (
    <Co label="Feature matrix" className={c.mx}>
      <div><span /><small>Solo</small><small>Team</small><small>Scale</small></div>
      {F.map(([t, r]) => <div key={t}><span>{t}</span>{r.map((x, k) => <i key={k} data-on={!!x}>{x ? '✓' : '–'}</i>)}</div>)}
    </Co>
  );
}

/* 06 */ function Diff() {
  const [d, setD] = useState(true);
  const F = [['Seats', '1', '10'], ['Support', 'Email', 'Email'], ['History', '7 days', '90 days']];
  return (
    <Co label="Compare plans" className={c.list}>
      <button type="button" className={c.chip} aria-pressed={d} onClick={() => setD((v) => !v)}>Differences only</button>
      {F.filter(([, a, b]) => !d || a !== b).map(([t, a, b]) => <div key={t} className={c.cmp}><span>{t}</span><b>{a}</b><b>{b}</b></div>)}
    </Co>
  );
}

/* 07 */ function Tiers() {
  const [q, setQ] = useState(300);
  const t = [[100, 0.1], [500, 0.08], [1000, 0.05]];
  const rate = (t.find(([m]) => q <= m) ?? t[2])[1];
  return (
    <Co label="Volume tiers" className={c.center}>
      <div className={c.chips} role="group" aria-label="Volume">{[100, 300, 800, 2000].map((v) => <button key={v} type="button" className={c.chip} aria-pressed={q === v} onClick={() => setQ(v)}>{v}</button>)}</div>
      <b className={c.big}>{$(q * rate)}</b><small className={c.m}>{$(rate)} each</small>
    </Co>
  );
}

/* 08 */ function AddOns() {
  const [on, setOn] = useState([0]);
  const A = [['Priority support', 15], ['Extra storage', 8], ['Audit log', 12]];
  const tot = 29 + on.reduce((s, k) => s + A[k][1], 0);
  return (
    <Co label="Add-ons" className={c.list}>
      {A.map(([t, p], k) => <button key={t} type="button" role="checkbox" aria-checked={on.includes(k)} className={c.line} onClick={() => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]))}><i>{on.includes(k) ? '✓' : ''}</i><span>{t}</span><em>+{$(p)}</em></button>)}
      <div className={c.sum}><span>Total</span><b>{$(tot)}</b></div>
    </Co>
  );
}

/* 09 */ function Coupon() {
  const [v, setV] = useState('');
  const ok = v.toUpperCase() === 'WELCOME10';
  return (
    <Co label="Coupon" className={c.list}>
      <div className={c.sum}><span>Subtotal</span><b>$120</b></div>
      <label className={c.field}><input value={v} onChange={(e) => setV(e.target.value)} placeholder="Code (try WELCOME10)" aria-label="Coupon code" /></label>
      {ok && <div className={c.sum}><span>Discount</span><b className={c.green}>−$12</b></div>}
      <div className={c.sum}><span>Total</span><b>{ok ? '$108' : '$120'}</b></div>
    </Co>
  );
}

/* 10 */ function Currency() {
  const [i, setI] = useState(0);
  const C = [['USD', '$', 1], ['EUR', '€', 0.92], ['GBP', '£', 0.79]];
  return (
    <Co label="Currency" className={c.center}>
      <div className={c.seg} role="group" aria-label="Currency">{C.map(([n], k) => <button key={n} type="button" aria-pressed={i === k} onClick={() => setI(k)}>{n}</button>)}</div>
      <b className={c.big}>{$(49 * C[i][2], C[i][1])}</b>
    </Co>
  );
}

/* 11 */ function Drop() {
  const [on, setOn] = useState(true);
  return (
    <Co label="Price drop" className={c.center}>
      <div className={c.priceDrop}>{on && <s>$120</s>}<b className={c.big}>{on ? '$84' : '$120'}</b>{on && <em>−30%</em>}</div>
      <button type="button" className={c.chip} aria-pressed={on} onClick={() => setOn((v) => !v)}>Sale {on ? 'on' : 'off'}</button>
    </Co>
  );
}

/* 12 */ function Trial() {
  const n = useTick(1400);
  const left = 14 - (n % 14);
  return (
    <Co label="Trial banner" className={c.center} role="status">
      <span className={c.m}>Free trial</span>
      <span className={c.bar}><i style={{ width: `${((14 - left) / 14) * 100}%` }} /></span>
      <b>{left} days left</b>
      <button type="button" className={c.pay}>Upgrade</button>
    </Co>
  );
}

/* 13 */ function Guarantee() {
  const [o, setO] = useState(false);
  return (
    <Co label="Guarantee" className={c.center}>
      <button type="button" className={c.seal} aria-expanded={o} onClick={() => setO((v) => !v)}><b>30</b><small>day</small></button>
      <span className={c.m}>{o ? 'Not happy? Full refund, no forms.' : 'Money-back guarantee'}</span>
    </Co>
  );
}

/* 14 */ function Faq() {
  const [o, setO] = useState(0);
  const Q = [['Can I cancel?', 'Any time, in one click.'], ['Do you bill tax?', 'Added at checkout.']];
  return <Co label="Pricing questions" className={c.list}>{Q.map(([q, a], k) => <div key={q}><button type="button" className={c.line} aria-expanded={o === k} onClick={() => setO(o === k ? -1 : k)}><span>{q}</span><Ico n="down" /></button>{o === k && <p className={c.ans}>{a}</p>}</div>)}</Co>;
}

/* 15 */ function Lines() {
  const [q, setQ] = useState([1, 2]);
  const P = [['Trail shell', 98], ['Wool socks', 12]];
  return (
    <Co label="Cart lines" className={c.list}>
      {P.map(([t, p], k) => <div key={t} className={c.line}><span>{t}<small>{$(p)}</small></span><Step v={q[k]} set={(v) => setQ((a) => a.map((x, i) => (i === k ? v : x)))} min={0} max={5} label={t} /><b>{$(p * q[k])}</b></div>)}
      <div className={c.sum}><span>Subtotal</span><b>{$(q[0] * 98 + q[1] * 12)}</b></div>
    </Co>
  );
}

/* 16 */ function MiniCart() {
  const [n, setN] = useState(2);
  return (
    <Co label="Mini cart" className={c.center}>
      <button type="button" className={c.cartBtn} aria-label={`Cart, ${n} items. Add another`} onClick={() => setN((v) => v + 1)}><Ico n="cart" />{n > 0 && <em key={n}>{n}</em>}</button>
      <button type="button" className={c.chip} onClick={() => setN(0)}>Empty cart</button>
    </Co>
  );
}

/* 17 */ function FreeShip() {
  const [t, setT] = useState(32);
  const left = Math.max(0, 50 - t);
  return (
    <Co label="Free shipping progress" className={c.center}>
      <span className={c.m}>{left ? `${$(left)} away from free shipping` : 'Free shipping unlocked'}</span>
      <span className={c.bar}><i style={{ width: `${Math.min(100, (t / 50) * 100)}%`, background: left ? 'var(--c-red)' : '#4ade80' }} /></span>
      <div className={c.chips}><button type="button" className={c.chip} onClick={() => setT((v) => v + 9)}>+ $9 item</button><button type="button" className={c.chip} onClick={() => setT(32)}>Reset</button></div>
    </Co>
  );
}

/* 18 */ function Summary() {
  const [express, setExpress] = useState(false);
  const sub = 120; const tax = sub * 0.08; const ship = express ? 12 : 0;
  return (
    <Co label="Order summary" className={c.list}>
      {[['Subtotal', sub], ['Tax (8%)', tax], ['Shipping', ship]].map(([t, v]) => <div key={t} className={c.sum}><span>{t}</span><b>{v ? $(v) : 'Free'}</b></div>)}
      <div className={cx(c.sum, c.total)}><span>Total</span><b>{$(sub + tax + ship)}</b></div>
      <button type="button" className={c.chip} aria-pressed={express} onClick={() => setExpress((v) => !v)}>Express +$12</button>
    </Co>
  );
}

/* 19 */ function Promo() {
  const [on, setOn] = useState(true);
  return (
    <Co label="Applied promo" className={c.center}>
      {on ? <span className={c.tagP}>SPRING15<button type="button" aria-label="Remove promo" onClick={() => setOn(false)}>×</button></span> : <button type="button" className={c.chip} onClick={() => setOn(true)}>Add SPRING15</button>}
      <b className={c.big}>{on ? '$102' : '$120'}</b>
    </Co>
  );
}

/* 20 */ function Later() {
  const [cart, setCart] = useState(['Tent pegs', 'Stove']);
  const [saved, setSaved] = useState(['Lantern']);
  const mv = (set, setTo, t) => { set((a) => a.filter((x) => x !== t)); setTo((a) => [...a, t]); };
  return (
    <Co label="Saved for later" className={c.list}>
      <small className={c.m}>In cart ({cart.length})</small>
      {cart.map((t) => <button key={t} type="button" className={c.line} onClick={() => mv(setCart, setSaved, t)}><span>{t}</span><em>Save</em></button>)}
      <small className={c.m}>Saved ({saved.length})</small>
      {saved.map((t) => <button key={t} type="button" className={c.line} onClick={() => mv(setSaved, setCart, t)}><span>{t}</span><em>Move to cart</em></button>)}
    </Co>
  );
}

/* 21 */ function Upsell() {
  const [on, setOn] = useState([]);
  const U = [['Waterproof bag', 14], ['Spare laces', 4]];
  return (
    <Co label="Add this too" className={c.list}>
      <small className={c.m}>Goes well with</small>
      {U.map(([t, p], k) => <div key={t} className={c.line}><span>{t}<small>{$(p)}</small></span><button type="button" className={c.chip} aria-pressed={on.includes(k)} onClick={() => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]))}>{on.includes(k) ? 'Added' : 'Add'}</button></div>)}
      <div className={c.sum}><span>Extras</span><b>{$(on.reduce((s, k) => s + U[k][1], 0))}</b></div>
    </Co>
  );
}

/* 22 */ function Gift() {
  const [on, setOn] = useState(false);
  const [note, setNote] = useState('');
  return (
    <Co label="Gift options" className={c.list}>
      <div className={c.line}><span>Gift wrap <small>+$4</small></span><button type="button" role="switch" aria-checked={on} aria-label="Gift wrap" className={c.sw} onClick={() => setOn((v) => !v)}><i /></button></div>
      {on && <label className={c.field}><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note" aria-label="Gift note" maxLength={40} /></label>}
      <div className={c.sum}><span>Total</span><b>{on ? '$124' : '$120'}</b></div>
    </Co>
  );
}

/* 23 */ function Delivery() {
  const [s, setS] = useState(0);
  const D = [['Standard', '3–5 days', 0], ['Express', '1–2 days', 12], ['Pickup', 'Today', 0]];
  return <Co label="Delivery" className={c.list}><div role="radiogroup" aria-label="Delivery">{D.map(([t, d, p], k) => <button key={t} type="button" role="radio" aria-checked={s === k} className={c.line} onClick={() => setS(k)}><i className={c.radio} data-on={s === k} /><span>{t}<small>{d}</small></span><em>{p ? $(p) : 'Free'}</em></button>)}</div></Co>;
}

/* 24 */ function EmptyCart() {
  const [has, setHas] = useState(false);
  return (
    <Co label="Empty cart" className={c.center}>
      {has ? <><span className={c.line}><span>Trail shell</span><b>$98</b></span><button type="button" className={c.chip} onClick={() => setHas(false)}>Remove</button></> : <><span className={c.art}><Ico n="cart" /></span><b>Your cart is empty</b><button type="button" className={c.pay} onClick={() => setHas(true)}>Add a shell</button></>}
    </Co>
  );
}

/* 25 */ function Stepper() {
  const [s, setS] = useState(1);
  const S = ['Cart', 'Details', 'Pay', 'Done'];
  return (
    <Co label="Checkout steps" className={c.center}>
      <ol className={c.steps}>{S.map((t, k) => <li key={t} data-done={k < s} aria-current={k === s ? 'step' : undefined}><i>{k < s ? '✓' : k + 1}</i>{t}</li>)}</ol>
      <div className={c.chips}><button type="button" className={c.chip} disabled={s === 0} onClick={() => setS((v) => v - 1)}>Back</button><button type="button" className={c.chip} onClick={() => setS((v) => (v + 1) % 4)}>{s === 3 ? 'Restart' : 'Next'}</button></div>
    </Co>
  );
}

/* 26 */ function Address() {
  const [f, setF] = useState({ n: '', z: '' });
  const ok = f.n.length > 1 && /^\d{4,5}$/.test(f.z);
  return (
    <Co label="Address form" className={c.list}>
      <label className={c.field}><input value={f.n} onChange={(e) => setF({ ...f, n: e.target.value })} placeholder="Full name" aria-label="Full name" /></label>
      <label className={c.field}><input value={f.z} onChange={(e) => setF({ ...f, z: e.target.value })} placeholder="Postcode (4–5 digits)" aria-label="Postcode" inputMode="numeric" /></label>
      <button type="button" className={c.pay} disabled={!ok}>Ship here</button>
    </Co>
  );
}

const group = (s) => s.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
/* 27 */ function CardForm() {
  const [v, setV] = useState('4242 4242');
  return (
    <Co label="Card number" className={c.list}>
      <span className={c.cardFace}>{v || '•••• •••• •••• ••••'}</span>
      <label className={c.field}><input value={v} onChange={(e) => setV(group(e.target.value))} inputMode="numeric" placeholder="Card number" aria-label="Card number" autoComplete="off" /></label>
      <small className={c.m}>{v.replace(/\s/g, '').length}/16 digits</small>
    </Co>
  );
}

/* 28 */ function Brand() {
  const [v, setV] = useState('4');
  const b = v.startsWith('4') ? 'Visa' : v.startsWith('5') ? 'Mastercard' : v.startsWith('3') ? 'Amex' : '—';
  return (
    <Co label="Card brand" className={c.list}>
      <label className={c.field}><input value={v} onChange={(e) => setV(group(e.target.value))} inputMode="numeric" placeholder="Start typing" aria-label="Card number" autoComplete="off" /></label>
      <span className={c.brand} data-b={b}>{b}</span>
    </Co>
  );
}

/* 29 */ function Expiry() {
  const [e, setE] = useState('');
  const [cv, setCv] = useState('');
  const fmt = (s) => { const d = s.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };
  return (
    <Co label="Expiry and code" className={c.list}>
      <div className={c.two}><label className={c.field}><input value={e} onChange={(x) => setE(fmt(x.target.value))} placeholder="MM/YY" aria-label="Expiry" inputMode="numeric" /></label><label className={c.field}><input type="password" value={cv} onChange={(x) => setCv(x.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="CVC" aria-label="Security code" inputMode="numeric" /></label></div>
      <small className={c.m}>{e.length === 5 && cv.length === 3 ? 'Looks complete' : 'Fill both'}</small>
    </Co>
  );
}

/* 30 */ function Methods() {
  const [s, setS] = useState(0);
  const M = [['Card', 'Number, expiry, code'], ['Wallet', 'Confirm on your phone'], ['Bank', 'Choose your bank']];
  return (
    <Co label="Payment methods" className={c.list}>
      <div className={c.tabs} role="tablist" aria-label="Method">{M.map(([t], k) => <button key={t} type="button" role="tab" aria-selected={s === k} onClick={() => setS(k)}>{t}</button>)}</div>
      <p className={c.ans} role="tabpanel">{M[s][1]}</p>
    </Co>
  );
}

/* 31 */ function Terms() {
  const [a, setA] = useState(false);
  return (
    <Co label="Terms" className={c.list}>
      <button type="button" role="checkbox" aria-checked={a} className={c.line} onClick={() => setA((v) => !v)}><i>{a ? '✓' : ''}</i><span>I accept the terms</span></button>
      <button type="button" className={c.pay} disabled={!a}>Pay $120</button>
    </Co>
  );
}

/* 32 */ function PayStates() {
  const [s, setS] = useState('idle');
  const n = useTick(700);
  const [t0, setT0] = useState(0);
  const st = s === 'busy' && n - t0 >= 2 ? 'done' : s;
  return (
    <Co label="Pay button" className={c.center}>
      <button type="button" className={c.payBig} data-s={st} aria-busy={st === 'busy'} onClick={() => { if (st === 'done') setS('idle'); else { setS('busy'); setT0(n); } }}>{st === 'idle' ? 'Pay $120' : st === 'busy' ? <i className={c.spin} /> : '✓ Paid'}</button>
    </Co>
  );
}

/* 33 */ function Confirm() {
  const [n, setN] = useState(1);
  return (
    <Co label="Order confirmed" className={c.center}>
      <button type="button" className={c.okring} aria-label="Replay" onClick={() => setN((v) => v + 1)}><svg key={n} viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" pathLength="1" /><path d="M15 27l8 8 14-16" pathLength="1" /></svg></button>
      <b>Order confirmed</b><small className={c.m}>No. 0417 · email sent</small>
    </Co>
  );
}

/* 34 */ function Receipt() {
  const n = useTick(700);
  const k = (n % 7) + 1;
  return (
    <Co label="Receipt printing" className={c.receipt} role="img">
      {LINES.slice(0, Math.min(5, k)).map(([t, p]) => <p key={t}><span>{t}</span><span>{p ? $(p) : 'free'}</span></p>)}
      {k >= 6 && <p className={c.rTot}><span>TOTAL</span><span>$166</span></p>}
    </Co>
  );
}

/* 35 */ function Invoices() {
  const [s, setS] = useState([0, 1, 2]);
  const C = [['Paid', '#4ade80'], ['Due', '#febc2e'], ['Late', '#ff6b6b']];
  return <Co label="Invoices" className={c.list}>{['INV-204', 'INV-205', 'INV-206'].map((t, k) => <button key={t} type="button" className={c.line} onClick={() => setS((a) => a.map((x, i) => (i === k ? (x + 1) % 3 : x)))}><span>{t}</span><em className={c.status} style={{ '--st': C[s[k]][1] }}>{C[s[k]][0]}</em></button>)}</Co>;
}

/* 36 */ function Refund() {
  const [r, setR] = useState(-1);
  const R = ['Too small', 'Wrong item', 'Late', 'Changed mind'];
  return (
    <Co label="Refund reason" className={c.center}>
      <div className={c.chips} role="radiogroup" aria-label="Reason">{R.map((t, k) => <button key={t} type="button" role="radio" aria-checked={r === k} className={c.chip} aria-pressed={r === k} onClick={() => setR(k)}>{t}</button>)}</div>
      <button type="button" className={c.pay} disabled={r < 0}>{r < 0 ? 'Choose a reason' : 'Request refund'}</button>
    </Co>
  );
}

/* 37 */ function Tracker() {
  const [s, setS] = useState(1);
  const T = ['Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  return (
    <Co label="Order tracker" className={c.list}>
      <ol className={c.track}>{T.map((t, k) => <li key={t} data-done={k <= s}><i />{t}</li>)}</ol>
      <button type="button" className={c.chip} onClick={() => setS((v) => (v + 1) % 4)}>Next update</button>
    </Co>
  );
}

/* 38 */ function Slots() {
  const [s, setS] = useState(1);
  const T = ['Mon 9–12', 'Mon 12–15', 'Tue 9–12', 'Tue 15–18'];
  return <Co label="Delivery slots" className={c.center}><div className={c.chips} role="radiogroup" aria-label="Slot">{T.map((t, k) => <button key={t} type="button" role="radio" aria-checked={s === k} className={c.chip} aria-pressed={s === k} onClick={() => setS(k)}>{t}</button>)}</div><small className={c.m}>Arrives {T[s]}</small></Co>;
}

/* 39 */ function Tip() {
  const [t, setT] = useState(15);
  return (
    <Co label="Tip" className={c.center}>
      <span className={c.m}>Bill $64</span>
      <div className={c.chips} role="group" aria-label="Tip">{[0, 10, 15, 20].map((v) => <button key={v} type="button" className={c.chip} aria-pressed={t === v} onClick={() => setT(v)}>{v}%</button>)}</div>
      <b className={c.big}>{$(64 * (1 + t / 100))}</b>
    </Co>
  );
}

/* 40 */ function Split() {
  const [n, setN] = useState(3);
  return <Co label="Split the bill" className={c.center}><span className={c.m}>Split between</span><Step v={n} set={setN} min={1} max={8} label="people" /><b className={c.big}>{$(96 / n)}</b><small className={c.m}>each</small></Co>;
}

/* 41 */ function Manage() {
  const [s, setS] = useState('active');
  const L = { active: 'Active · renews Nov 14', paused: 'Paused until Dec 14', cancelled: 'Ends Nov 14' };
  return (
    <Co label="Manage subscription" className={c.list}>
      <b className={c.status2} data-s={s}>{L[s]}</b>
      <div className={c.chips}><button type="button" className={c.chip} onClick={() => setS(s === 'paused' ? 'active' : 'paused')}>{s === 'paused' ? 'Resume' : 'Pause'}</button><button type="button" className={c.chip} onClick={() => setS(s === 'cancelled' ? 'active' : 'cancelled')}>{s === 'cancelled' ? 'Keep' : 'Cancel'}</button></div>
    </Co>
  );
}

/* 42 */ function Prorate() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  const day = Math.round(1 + v * 29);
  const left = 30 - day;
  return (
    <Co label="Plan change" className={c.center}>
      <span className={c.m}>Switch on day {day}</span>
      <div className={c.rail} {...bind} aria-label="Day of the month"><u style={{ left: `${v * 100}%` }} /></div>
      <b className={c.big}>{$(((99 - 29) * left) / 30)}</b><small className={c.m}>charged today · {pad2(left)} days left</small>
    </Co>
  );
}

export default {
  Visual,
  items: [
    ['Price cards', PlanCards, 'click'], ['Billing toggle', Billing, 'click'], ['Seat stepper', Seats, 'click'], ['Usage slider', Usage, 'drag'],
    ['Feature table', Matrix, 'still'], ['Differences only', Diff, 'click'], ['Volume tiers', Tiers, 'click'], ['Add-on boxes', AddOns, 'click'],
    ['Coupon code', Coupon, 'type'], ['Currency switch', Currency, 'click'], ['Price drop', Drop, 'click'], ['Trial bar', Trial, 'auto'],
    ['Guarantee seal', Guarantee, 'click'], ['Pricing questions', Faq, 'click'], ['Cart lines', Lines, 'click'], ['Mini cart', MiniCart, 'click'],
    ['Free shipping bar', FreeShip, 'click'], ['Order summary', Summary, 'click'], ['Promo chip', Promo, 'click'], ['Saved for later', Later, 'click'],
    ['Upsell strip', Upsell, 'click'], ['Gift wrap', Gift, 'click'], ['Delivery choice', Delivery, 'click'], ['Empty cart', EmptyCart, 'click'],
    ['Checkout steps', Stepper, 'click'], ['Address form', Address, 'type'], ['Card digits', CardForm, 'type'], ['Card brand', Brand, 'type'],
    ['Expiry and code', Expiry, 'type'], ['Payment methods', Methods, 'click'], ['Terms gate', Terms, 'click'], ['Pay button', PayStates, 'click'],
    ['Order confirmed', Confirm, 'click'], ['Receipt printing', Receipt, 'auto'], ['Invoice rows', Invoices, 'click'], ['Refund reason', Refund, 'click'],
    ['Order tracker', Tracker, 'click'], ['Delivery slots', Slots, 'click'], ['Tip chips', Tip, 'click'], ['Bill share', Split, 'click'],
    ['Manage plan', Manage, 'click'], ['Plan change', Prorate, 'drag'],
  ],
};
