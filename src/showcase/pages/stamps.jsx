import { useId, useState } from 'react';
import { pad2, rng, useDrag } from '../hooks';
import { usePointer } from '../pointerVars';
import { Ico } from '../icons';
import c from './stamps.module.css';

/* ============================================================
   39 · STAMPS — marks pressed onto paper: labels, seals, stickers and tape.
   The still side is a large APPROVED stamp coming down onto paper as the
   scroll advances (it lands at the middle of the page and the ink spreads
   after). The forty-two specimens are the things you would find on a desk:
   most can be pressed, peeled or torn with a click, and every one is a button
   or a field you can reach with the keyboard.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visPaper}>
        <i /><i /><i /><i />
        <span className={c.visTapeL} />
        <span className={c.visTapeR} />
        <b className={c.visStamp}>APPROVED</b>
        <span className={c.visRing} />
      </div>
      <small>1 STAMP · 2 STRIPS OF TAPE</small>
    </div>
  );
}

const tilt = (n, spread = 14) => `${((n * 37) % (spread * 2 + 1)) - spread}deg`;

/* 01 */ function Approved() {
  const [n, setN] = useState(1);
  return (
    <button type="button" className={c.press} onClick={() => setN((v) => v + 1)} aria-label="Stamp APPROVED. Click to stamp again">
      <span className={c.sheet}><i /><i /><i /></span>
      <b key={n} className={c.mark} style={{ '--r': tilt(n, 8) }}>APPROVED</b>
    </button>
  );
}

const DATES = ['14 OCT 2026', '15 OCT 2026', '16 OCT 2026', '19 OCT 2026', '20 OCT 2026'];
/* 02 */ function DateStamp() {
  const [n, setN] = useState(2);
  return (
    <button type="button" className={c.press} onClick={() => setN((v) => v + 1)} aria-label="Press the date stamp">
      <span className={c.dateStack}>
        {Array.from({ length: Math.min(3, n) }, (_, k) => { const id = n - k; return <b key={id} className={c.date} style={{ '--r': tilt(id, 3), opacity: 1 - k * 0.3 }}>{DATES[id % 5]}</b>; })}
      </span>
    </button>
  );
}

/* 03 */ function Seal() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.press} onClick={() => setN((v) => v + 1)} aria-label="Press the seal">
      <i key={n} className={c.wax}><b>H</b></i>
    </button>
  );
}

/* 04 */ function RingSeal() {
  const id = useId();
  return (
    <div className={c.ringSeal} role="img" aria-label="A round seal with turning text">
      <svg viewBox="0 0 100 100">
        <defs><path id={`rs${id}`} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs>
        <g className={c.turn}><text><textPath href={`#rs${id}`}>HANORYX SYSTEMS · EST. 2019 · MADE TO LAST ·</textPath></text></g>
        <circle cx="50" cy="50" r="26" className={c.rule} />
        <path d="M50 33l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" className={c.star} />
      </svg>
    </div>
  );
}

/* 05 */ function Foil() {
  const [ref, bind] = usePointer();
  return <div ref={ref} {...bind} className={c.foil} tabIndex={0} role="img" aria-label="A foil plate that catches the light"><b>HX</b></div>;
}

/* 06 */ function Postmark() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.press} onClick={() => setN((v) => v + 1)} aria-label="Postmark the letter again">
      <span className={c.post} style={{ '--r': tilt(n + 2, 12) }}>
        <svg viewBox="0 0 100 60"><circle cx="30" cy="30" r="22" className={c.pm} /><text x="30" y="27" textAnchor="middle">OCT</text><text x="30" y="38" textAnchor="middle">14 · 26</text>
          {[18, 26, 34, 42].map((y) => <path key={y} d={`M56 ${y}q7-5 14 0t14 0t14 0`} className={c.pm} />)}</svg>
      </span>
    </button>
  );
}

/* 07 */ function Airmail() {
  return <div className={c.air} role="img" aria-label="An airmail envelope edge"><span>PAR AVION</span></div>;
}

/* 08 */ function CornerPeel() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className={c.peel} aria-pressed={on} onClick={() => setOn((v) => !v)} aria-label="Peel the corner">
      <span>label</span>
    </button>
  );
}

const STK = ['circle', 'star', 'heart', 'bolt', 'moon', 'flag'];
/* 09 */ function StickerSheet() {
  const [gone, setGone] = useState([1]);
  const flip = (i) => setGone((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  return (
    <div className={c.sheetGrid} role="group" aria-label="Sticker sheet">
      {STK.map((n, i) => (
        <button key={n} type="button" className={c.stk} data-gone={gone.includes(i)} aria-pressed={!gone.includes(i)} aria-label={`Sticker ${i + 1}`} onClick={() => flip(i)} style={{ '--h': i * 58 }}>
          <Ico n={n === 'circle' ? 'sun' : n} />
        </button>
      ))}
    </div>
  );
}

/* 10 */ function DieCut() {
  return <button type="button" className={c.die} aria-label="Die-cut sticker"><Ico n="bolt" /></button>;
}

/* 11 */ function Holo() {
  const [ref, bind] = usePointer();
  return <div ref={ref} {...bind} className={c.holo} tabIndex={0} role="img" aria-label="A holographic sticker"><Ico n="star" /></div>;
}

const WASHI = ['dots', 'stripe', 'check', 'wave'];
/* 12 */ function Washi() {
  const [i, setI] = useState(0);
  return <button type="button" className={c.washi} data-p={WASHI[i]} onClick={() => setI((v) => (v + 1) % 4)} aria-label={`Washi tape pattern ${WASHI[i]}. Click to change`} />;
}

/* 13 */ function MaskLabel() {
  const [v, setV] = useState('dont touch');
  return (
    <div className={c.maskWrap}>
      <div className={c.mask}><span>{v || ' '}</span></div>
      <input className={c.field} value={v} maxLength={16} onChange={(e) => setV(e.target.value)} aria-label="Label text" spellCheck={false} />
    </div>
  );
}

/* 14 */ function TapeCross() {
  const [n, setN] = useState(2);
  return (
    <button type="button" className={c.cross} onClick={() => setN((v) => (v + 1) % 5)} aria-label={`${n} strips of tape. Click to add one`}>
      <i className={c.box} />
      {Array.from({ length: n }, (_, k) => <u key={k} style={{ '--a': `${k * 38 - 40}deg` }} />)}
    </button>
  );
}

/* 15 */ function Hazard() {
  return <div className={c.hazard} role="img" aria-label="Hazard tape sliding by" />;
}

/* 16 */ function PriceTag() {
  return (
    <div className={c.tagWrap} role="img" aria-label="A price tag on a string">
      <div className={c.tag}><i /><b>$24</b><small>SALE</small></div>
    </div>
  );
}

/* 17 */ function Luggage() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className={c.lug} aria-pressed={on} onClick={() => setOn((v) => !v)} aria-label="Flip the luggage tag">
      <span className={c.strap} />
      <span className={c.lugBody}>{on ? <><small>GATE</small><b>B12</b></> : <><small>TO</small><b>OSL</b></>}</span>
    </button>
  );
}

/* 18 */ function Badge() {
  const [v, setV] = useState('Ada');
  return (
    <div className={c.badge}>
      <b>HELLO</b><small>my name is</small>
      <input className={c.hand} value={v} maxLength={10} onChange={(e) => setV(e.target.value)} aria-label="Name" spellCheck={false} />
    </div>
  );
}

const BARS = Array.from({ length: 34 }, (_, i) => 1 + Math.floor(rng(i + 4)() * 3));
/* 19 */ function Barcode() {
  return (
    <button type="button" className={c.bar} aria-label="Barcode label, scans when focused or hovered">
      <span>{BARS.map((w, i) => <i key={i} style={{ '--w': w }} />)}</span>
      <small>4 901234 567894</small>
      <b className={c.scan} />
    </button>
  );
}

const FIN = [[0, 0], [6, 0], [0, 6]];
/* 20 */ function Mosaic() {
  const [seed, setSeed] = useState(3);
  const cell = (i) => {
    const x = i % 9;
    const y = Math.floor(i / 9);
    const f = FIN.find(([ox, oy]) => x >= ox && x < ox + 3 && y >= oy && y < oy + 3);
    if (f) return x === f[0] + 1 && y === f[1] + 1 ? 0 : 1;
    return rng(seed * 97 + i)() > 0.5 ? 1 : 0;
  };
  return (
    <button type="button" className={c.mosaic} onClick={() => setSeed((v) => v + 1)} aria-label="Code block. Click to draw another">
      {Array.from({ length: 81 }, (_, i) => <i key={i} data-on={cell(i)} />)}
    </button>
  );
}

const SERVICE = [['STANDARD', '#6b7280'], ['EXPRESS', '#f59e0b'], ['OVERNIGHT', '#ef4444']];
/* 21 */ function Parcel() {
  const [s, setS] = useState(1);
  return (
    <button type="button" className={c.parcel} onClick={() => setS((v) => (v + 1) % 3)} aria-label={`Shipping label, ${SERVICE[s][0]}. Click to change service`}>
      <span className={c.svc} style={{ background: SERVICE[s][1] }}>{SERVICE[s][0]}</span>
      <i /><i /><i />
      <small>THIS SIDE UP ↑ · FRAGILE</small>
    </button>
  );
}

/* 22 */ function FragileBand() {
  return <div className={c.fragile} role="img" aria-label="Fragile tape sliding by"><span>{'FRAGILE ⚠ HANDLE WITH CARE ⚠ '.repeat(4)}</span></div>;
}

/* 23 */ function Stub() {
  const [torn, setTorn] = useState(false);
  return (
    <button type="button" className={c.stub} aria-pressed={torn} onClick={() => setTorn((v) => !v)} aria-label="Tear off the ticket stub">
      <span className={c.main}><b>ADMIT ONE</b><small>ROW C · 14</small></span>
      <span className={c.cut}><b>No. 0417</b></span>
    </button>
  );
}

/* 24 */ function Coupon() {
  const [cut, setCut] = useState(false);
  return (
    <button type="button" className={c.coupon} aria-pressed={cut} onClick={() => setCut((v) => !v)} aria-label="Cut out the coupon">
      <span className={c.cp}><b>20% OFF</b><small>CODE HX20</small></span>
      <Ico n="close" />
    </button>
  );
}

/* 25 */ function DueSlip() {
  const [n, setN] = useState(2);
  return (
    <div className={c.slip}>
      <b>DATE DUE</b>
      {Array.from({ length: n }, (_, k) => <span key={k} style={{ '--r': tilt(k + 3, 2) }}>{DATES[k % 5]}</span>)}
      <button type="button" className={c.mini} disabled={n >= 5} onClick={() => setN((v) => v + 1)}>stamp</button>
    </div>
  );
}

const PASS = [['LHR', 12, 18, '#d33'], ['NRT', 58, 10, '#27a'], ['JFK', 24, 52, '#2a6'], ['SYD', 66, 54, '#a52']];
/* 26 */ function Passport() {
  const [extra, setExtra] = useState(0);
  const all = [...PASS, ...Array.from({ length: extra }, (_, k) => [['CPT', 'OSL', 'DXB', 'SIN'][k % 4], 12 + ((k * 31) % 60), 14 + ((k * 23) % 44), ['#d33', '#27a', '#2a6', '#a52'][k % 4]])];
  return (
    <button type="button" className={c.pass} onClick={() => setExtra((v) => (v + 1) % 5)} aria-label={`Passport page with ${all.length} stamps. Click to add one`}>
      {all.map(([t, x, y, col], i) => <b key={i} style={{ left: `${x}%`, top: `${y}%`, color: col, '--r': tilt(i + 1, 16) }}>{t}</b>)}
    </button>
  );
}

/* 27 */ function Quality() {
  return <button type="button" className={c.quality} aria-label="Seal of quality"><Ico n="check" /></button>;
}

/* 28 */ function Rosette() {
  return (
    <button type="button" className={c.rosette} aria-label="Award rosette">
      <i /><i /><b><Ico n="star" /></b>
    </button>
  );
}

/* 29 */ function Banner() {
  return <button type="button" className={c.banner} aria-label="Best in class ribbon"><span>BEST IN CLASS</span></button>;
}

/* 30 */ function CornerFlag() {
  return (
    <button type="button" className={c.flagCard} aria-label="Card with a corner ribbon">
      <i /><i /><i />
      <span>NEW</span>
    </button>
  );
}

/* 31 */ function Burst() {
  return <div className={c.burst} role="img" aria-label="Starburst reading SALE"><b>SALE</b></div>;
}

/* 32 */ function Pinned() {
  return (
    <button type="button" className={c.pinned} aria-label="A label held by a pin">
      <span className={c.pin} /><span className={c.note}><b>call back</b><small>before noon</small></span>
    </button>
  );
}

/* 33 */ function Stencil() {
  return (
    <button type="button" className={c.stencil} aria-label="Stencilled crate number">
      {'CRATE 07'.split('').map((ch, i) => <span key={i}>{ch}</span>)}
    </button>
  );
}

const RED = ['The budget is', 'forty thousand', 'and the owner is', 'Ms. Okafor'];
/* 34 */ function Redaction() {
  const [open, setOpen] = useState([]);
  const flip = (i) => setOpen((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  return (
    <div className={c.red}>
      {RED.map((t, i) => <button key={t} type="button" aria-pressed={open.includes(i)} onClick={() => flip(i)} aria-label={`Line ${i + 1}, ${open.includes(i) ? 'revealed' : 'blacked out'}`}>{t}</button>)}
    </div>
  );
}

/* 35 */ function Classified() {
  const [on, setOn] = useState(true);
  return (
    <button type="button" className={c.doc} aria-pressed={on} onClick={() => setOn((v) => !v)} aria-label="Document marked confidential. Click to remove the mark">
      <i /><i /><i /><i />
      {on && <b className={c.mark}>CONFIDENTIAL</b>}
    </button>
  );
}

/* 36 */ function Worn() {
  const id = `w${useId().replace(/\W/g, '')}`;
  const [v, bind] = useDrag({ mode: 'x', init: 0.45 });
  return (
    <div className={c.wornWrap}>
      <svg width="0" height="0" aria-hidden="true"><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" /><feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -${(4 + v * 6).toFixed(2)} ${(2.4 + v * 4.4).toFixed(2)}`} result="m" /><feComposite in="SourceGraphic" in2="m" operator="in" /></filter></svg>
      <b className={c.void} style={{ filter: `url(#${id})` }}>VOID</b>
      <div className={c.rail} {...bind} aria-label="Ink wear"><i style={{ width: `${v * 100}%` }} /></div>
    </div>
  );
}

/* 37 */ function InkPad() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.inkpad} onClick={() => setN((v) => v + 1)} aria-label="Ink the stamp and press">
      <span className={c.pad} />
      <span className={c.paperBit} />
      <i key={n} className={c.lift} data-go={n > 0} />
      {n > 0 && <b key={`m${n}`} className={c.mark2}>PAID</b>}
    </button>
  );
}

/* 38 */ function Thumb() {
  const [n, setN] = useState(1);
  return (
    <button type="button" className={c.thumb} onClick={() => setN((v) => (v % 3) + 1)} aria-label={`Thumbprint, ink level ${n}. Click to change`} style={{ '--ink': n / 3 }}>
      <svg viewBox="0 0 60 80">{Array.from({ length: 9 }, (_, k) => <ellipse key={k} cx="30" cy="42" rx={4 + k * 3.2} ry={6 + k * 4.2} strokeDasharray={k % 2 ? '9 3' : '16 4 3 4'} />)}</svg>
    </button>
  );
}

/* 39 */ function Signature() {
  return (
    <div className={c.sig} role="img" aria-label="A signature being written">
      <svg viewBox="0 0 120 50"><path pathLength="100" d="M6 34c8-22 16-26 14-8s-10 20-4 18 14-22 22-22c-6 12-2 18 6 8s6-10 10-6c-4 8 2 8 8 0s8-10 4-4 4 6 10 0 12-8 14-2 8-6 10-10" /><path pathLength="100" className={c.under} d="M10 44c30-4 60-4 100-8" /></svg>
    </div>
  );
}

const INIT = ['HX', 'A', 'KO', 'M'];
/* 40 */ function Monogram() {
  const [i, setI] = useState(0);
  return (
    <button type="button" className={c.mono} onClick={() => setI((v) => (v + 1) % 4)} aria-label={`Monogram ${INIT[i]}. Click to change`}>
      <span>{INIT[i]}</span>
    </button>
  );
}

/* 41 */ function LabelMaker() {
  const [v, setV] = useState('SPARE KEYS');
  return (
    <div className={c.maker}>
      <div className={c.strip}><span>{v.toUpperCase()}</span></div>
      <input className={c.field} value={v} maxLength={14} onChange={(e) => setV(e.target.value)} aria-label="Label text" spellCheck={false} />
    </div>
  );
}

const FLAGS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];
/* 42 */ function PageFlags() {
  const [on, setOn] = useState([0, 3]);
  const flip = (i) => setOn((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  return (
    <div className={c.flags}>
      <span className={c.page}><i /><i /><i /><i /><small>p. {pad2(14 + on.length)}</small></span>
      <div role="group" aria-label="Page flags">
        {FLAGS.map((col, i) => <button key={col} type="button" aria-pressed={on.includes(i)} aria-label={`Flag ${i + 1}`} style={{ '--f': col }} onClick={() => flip(i)} />)}
      </div>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Approved stamp', Approved, 'click'], ['Date stamp', DateStamp, 'click'], ['Pressed seal', Seal, 'click'], ['Ring seal', RingSeal, 'auto'],
    ['Foil plate', Foil, 'hover'], ['Cancel mark', Postmark, 'click'], ['Airmail edge', Airmail, 'auto'], ['Corner peel', CornerPeel, 'click'],
    ['Peel sheet', StickerSheet, 'click'], ['Die-cut sticker', DieCut, 'hover'], ['Holo sticker', Holo, 'hover'], ['Washi strip', Washi, 'click'],
    ['Masking label', MaskLabel, 'type'], ['Tape cross', TapeCross, 'click'], ['Hazard strip', Hazard, 'auto'], ['Price tag', PriceTag, 'auto'],
    ['Baggage tag', Luggage, 'click'], ['Name badge', Badge, 'type'], ['Barcode label', Barcode, 'hover'], ['Mosaic code', Mosaic, 'click'],
    ['Courier label', Parcel, 'click'], ['Fragile band', FragileBand, 'auto'], ['Ticket stub', Stub, 'click'], ['Coupon cut', Coupon, 'click'],
    ['Due slip', DueSlip, 'click'], ['Visa page', Passport, 'click'], ['Quality badge', Quality, 'hover'], ['Prize rosette', Rosette, 'hover'],
    ['Banner ribbon', Banner, 'hover'], ['Corner flag', CornerFlag, 'hover'], ['Starburst', Burst, 'auto'], ['Pinned label', Pinned, 'hover'],
    ['Crate stencil', Stencil, 'hover'], ['Redaction bars', Redaction, 'click'], ['Classified mark', Classified, 'click'], ['Worn ink', Worn, 'drag'],
    ['Ink pad', InkPad, 'click'], ['Thumbprint', Thumb, 'click'], ['Signature draw', Signature, 'auto'], ['Monogram seal', Monogram, 'click'],
    ['Label maker', LabelMaker, 'type'], ['Margin flags', PageFlags, 'click'],
  ],
};
