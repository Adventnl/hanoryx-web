import { useState } from 'react';
import { clamp, pad2, useTick } from '../hooks';
import { Ico } from '../icons';
import c from './archive.module.css';

/* ============================================================
   40 · ARCHIVE — files, drawers and index cards.
   The still side is a card drawer: a row of index cards that slides past as
   the scroll advances, the one in front turning to face you. The forty-two
   specimens are the furniture of a records room. Most of them open, pull out or
   turn over with a click; every one is a button or a field, so the keyboard
   reaches them all.
   ============================================================ */

const CARDS = ['AUDIT', 'BRIEF', 'CAST', 'DRAFT', 'EXPORT', 'FIELD', 'GRANT', 'HOLD', 'INDEX', 'JOINT', 'KEEP', 'LOG'];

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visRow}>
        {CARDS.map((t, k) => <i key={t} style={{ '--k': k }}><b>{t}</b><u>{pad2(k + 1)}</u></i>)}
      </div>
      <div className={c.visDrawer}><span>A — L</span><em /></div>
      <small>12 CARDS · 1 DRAWER</small>
    </div>
  );
}

const cx = (...a) => a.filter(Boolean).join(' ');
const step = (n, by, len) => (n + by + len) % len;

/* 01 */ function IndexCard() {
  const [back, setBack] = useState(false);
  return (
    <button type="button" className={c.flip} aria-pressed={back} onClick={() => setBack((v) => !v)} aria-label="Index card. Click to turn it over">
      <span className={c.flipIn} data-back={back}>
        <span className={c.face}><small>REF 0417</small><b>Systems audit</b><i /><i /></span>
        <span className={cx(c.face, c.rear)}><i /><i /><i /><i /><small>filed 14 Oct</small></span>
      </span>
    </button>
  );
}

/* 02 */ function CardDrawer() {
  const [s, setS] = useState(3);
  return (
    <div className={c.drawerRow} role="group" aria-label="Card drawer">
      {'ABCDEFGH'.split('').map((l, i) => <button key={l} type="button" className={c.slim} aria-pressed={s === i} aria-label={`Card ${l}`} onClick={() => setS(i)}><b>{l}</b></button>)}
    </div>
  );
}

/* 03 */ function FileFolder() {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" className={c.folder} aria-pressed={open} onClick={() => setOpen((v) => !v)} aria-label="File folder. Click to open it">
      <span className={c.papers}><i /><i /><i /></span>
      <span className={c.back}><em>CASE 22</em></span>
      <span className={c.front} data-open={open} />
    </button>
  );
}

/* 04 */ function HangingFiles() {
  const [s, setS] = useState(1);
  return (
    <div className={c.hang} role="group" aria-label="Hanging files">
      {['Tax', 'Legal', 'Staff', 'Deeds', 'Misc'].map((t, i) => <button key={t} type="button" aria-pressed={s === i} onClick={() => setS(i)}><span>{t}</span><i /></button>)}
    </div>
  );
}

/* 05 */ function Cabinet() {
  const [o, setO] = useState(1);
  return (
    <div className={c.cab} role="group" aria-label="Filing cabinet">
      {[0, 1, 2].map((i) => <button key={i} type="button" className={c.dr} aria-pressed={o === i} aria-label={`Drawer ${i + 1}`} onClick={() => setO(o === i ? -1 : i)}><i /><b /></button>)}
    </div>
  );
}

const DRAWERS = [['2019 – 2021', 412], ['2022 – 2023', 268], ['2024', 190], ['2025 – 2026', 87]];
/* 06 */ function DrawerStack() {
  const [o, setO] = useState(0);
  return (
    <div className={c.acc}>
      {DRAWERS.map(([t, n], i) => (
        <div key={t} className={c.accRow}>
          <button type="button" aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}><span>{t}</span><Ico n="down" /></button>
          {o === i && <p>{n} records · box {pad2(i + 3)}</p>}
        </div>
      ))}
    </div>
  );
}

/* 07 */ function BoxFile() {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" className={c.boxf} aria-pressed={open} onClick={() => setOpen((v) => !v)} aria-label="Box file. Click to lift the lid">
      <span className={c.lid} data-open={open} />
      <span className={c.boxBody}><em>2026</em></span>
    </button>
  );
}

/* 08 */ function Binder() {
  const [p, setP] = useState(1);
  return (
    <button type="button" className={c.binder} onClick={() => setP((v) => (v + 1) % 4)} aria-label={`Binder, page ${p + 1} of 4. Click to turn the page`}>
      {[0, 1, 2].map((i) => <i key={i} className={c.leaf} data-turned={i < p} style={{ zIndex: i < p ? i : 4 - i }}><u /><u /><u /></i>)}
      <span className={c.rings}><b /><b /><b /></span>
    </button>
  );
}

/* 09 */ function Rotary() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={c.rot} onClick={() => setN((v) => v + 1)} aria-label="Card rotary. Click to turn it">
      <span className={c.cyl} style={{ transform: `rotateX(${n * 45}deg)` }}>
        {Array.from({ length: 8 }, (_, k) => <i key={k} style={{ transform: `rotateX(${-k * 45}deg) translateZ(2.6rem)` }}><b>{CARDS[k]}</b></i>)}
      </span>
    </button>
  );
}

/* 10 */ function CardFan() {
  return (
    <button type="button" className={c.fan} aria-label="Cards that fan out on hover or focus">
      {Array.from({ length: 5 }, (_, k) => <i key={k} style={{ '--k': k - 2 }}><b>{CARDS[k][0]}</b></i>)}
    </button>
  );
}

/* 11 */ function PaperPile() {
  const [n, setN] = useState(4);
  return (
    <button type="button" className={c.pile} onClick={() => setN((v) => (v >= 9 ? 1 : v + 1))} aria-label={`${n} sheets. Click to add one`}>
      {Array.from({ length: n }, (_, k) => <i key={k} style={{ '--k': k, '--r': `${((k * 37) % 7) - 3}deg` }} />)}
      <small>{n}</small>
    </button>
  );
}

/* 12 */ function ClipPile() {
  const [n, setN] = useState(3);
  return (
    <button type="button" className={c.clips} onClick={() => setN((v) => (v >= 8 ? 1 : v + 1))} aria-label={`${n} paper clips. Click to add one`}>
      {Array.from({ length: n }, (_, k) => (
        <svg key={k} viewBox="0 0 12 28" style={{ left: `${10 + ((k * 29) % 70)}%`, top: `${8 + ((k * 41) % 46)}%`, '--r': `${(k * 53) % 180 - 90}deg` }}><path d="M9 20V6a3 3 0 0 0-6 0v16a5 5 0 0 0 10 0V8" /></svg>
      ))}
    </button>
  );
}

/* 13 */ function Dividers() {
  const [s, setS] = useState(0);
  const T = ['Intro', 'Terms', 'Scope', 'Fees'];
  return (
    <div className={c.divs}>
      <div role="group" aria-label="Dividers">
        {T.map((t, i) => <button key={t} type="button" aria-pressed={s === i} style={{ '--i': i }} onClick={() => setS(i)}>{t}</button>)}
      </div>
      <p aria-live="polite">{T[s]} · section {s + 1} of 4</p>
    </div>
  );
}

const BOXES = ['Ledgers', 'Letters', 'Plans', 'Photos'];
/* 14 */ function ArchiveBox() {
  const [i, setI] = useState(0);
  return (
    <button type="button" className={c.abox} onClick={() => setI((v) => step(v, 1, 4))} aria-label={`Archive box: ${BOXES[i]}. Click for the next box`}>
      <span className={c.hole} />
      <span className={c.plate}><b>{BOXES[i]}</b><small>BOX {pad2(i + 11)}</small></span>
    </button>
  );
}

const SPINES = [['Atlas', '#8a3b2b', 6.2], ['Ledger', '#2b4a8a', 5.4], ['Annals', '#2f6b4a', 6.6], ['Index', '#6b4a2f', 5.8], ['Codex', '#7a2f6b', 6.4], ['Rolls', '#3b3b44', 5.2], ['Notes', '#8a6b2b', 5.9]];
/* 15 */ function Spines() {
  const [s, setS] = useState(2);
  return (
    <div className={c.shelf}>
      <div role="group" aria-label="Book spines">
        {SPINES.map(([t, col, h], i) => <button key={t} type="button" aria-pressed={s === i} aria-label={t} onClick={() => setS(i)} style={{ '--col': col, '--h': `${h}rem` }}><span>{t}</span></button>)}
      </div>
      <small>{SPINES[s][0]}</small>
    </div>
  );
}

/* 16 */ function CallNumber() {
  const [v, setV] = useState('QA 76.9 D5 H36');
  return (
    <div className={c.callBox}>
      <div className={c.spineLabel}>{(v.trim() || '—').split(/\s+/).slice(0, 4).map((p, i) => <span key={i}>{p}</span>)}</div>
      <input className={c.field} value={v} maxLength={20} onChange={(e) => setV(e.target.value.toUpperCase())} aria-label="Call number" spellCheck={false} />
    </div>
  );
}

/* 17 */ function Fiche() {
  const [cell, setCell] = useState([2, 3]);
  const move = (dx, dy) => setCell(([x, y]) => [clamp(x + dx, 0, 5), clamp(y + dy, 0, 3)]);
  return (
    <div className={c.fiche} tabIndex={0} role="group" aria-label="Microfiche: use the arrow keys or the pointer"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setCell([clamp(Math.floor(((e.clientX - r.left) / r.width) * 6), 0, 5), clamp(Math.floor(((e.clientY - r.top) / r.height) * 4), 0, 3)]); }}
      onKeyDown={(e) => { const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (d) { e.preventDefault(); move(...d); } }}>
      {Array.from({ length: 24 }, (_, i) => <i key={i} data-hot={i % 6 === cell[0] && Math.floor(i / 6) === cell[1]} />)}
      <small>frame {cell[1] + 1}.{cell[0] + 1}</small>
    </div>
  );
}

/* 18 */ function Negative() {
  return (
    <div className={c.neg} role="img" aria-label="A film negative strip moving past">
      <div>{Array.from({ length: 16 }, (_, k) => <i key={k}><b style={{ '--s': (k * 7) % 5 }} /></i>)}</div>
    </div>
  );
}

/* 19 */ function SlideTray() {
  const [s, setS] = useState(0);
  return (
    <button type="button" className={c.tray} onClick={() => setS((v) => (v + 1) % 6)} aria-label={`Slide tray, slide ${s + 1} of 6. Click to advance`}>
      {Array.from({ length: 6 }, (_, k) => <i key={k} data-on={k === s} style={{ '--h': k * 60 }} />)}
    </button>
  );
}

/* 20 */ function Sleeve() {
  const [out, setOut] = useState(false);
  return (
    <button type="button" className={c.sleeve} aria-pressed={out} onClick={() => setOut((v) => !v)} aria-label="Record sleeve. Click to slide the record out">
      <i className={c.disc} data-out={out} />
      <span className={c.cover}><b>VOL. 3</b></span>
    </button>
  );
}

/* 21 */ function Corners() {
  const [on, setOn] = useState(true);
  return (
    <button type="button" className={c.album} aria-pressed={on} onClick={() => setOn((v) => !v)} aria-label="Photo in corner mounts. Click to take it out">
      <span className={c.photo} data-on={on}><i /></span>
      <b /><b /><b /><b />
    </button>
  );
}

/* 22 */ function Shuffle() {
  const [order, setOrder] = useState([0, 1, 2, 3]);
  return (
    <button type="button" className={c.shuf} onClick={() => setOrder((a) => [...a.slice(1), a[0]])} aria-label="Photographs. Click to send the top one to the back">
      {order.map((id, z) => <i key={id} style={{ '--z': order.length - z, '--r': `${(id * 29) % 17 - 8}deg`, '--h': id * 70 }}><b /></i>)}
    </button>
  );
}

/* 23 */ function Flap() {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" className={c.env} aria-pressed={open} onClick={() => setOpen((v) => !v)} aria-label="Envelope. Click to open the flap">
      <span className={c.letter} data-open={open}><i /><i /><i /></span>
      <span className={c.pocket} />
      <span className={c.flap} data-open={open} />
    </button>
  );
}

/* 24 */ function Bundle() {
  const [loose, setLoose] = useState(false);
  return (
    <button type="button" className={c.bundle} aria-pressed={loose} onClick={() => setLoose((v) => !v)} aria-label="Bundle of letters. Click to untie it">
      {[0, 1, 2].map((k) => <i key={k} data-loose={loose} style={{ '--k': k - 1 }} />)}
      <span className={c.twine} data-loose={loose} />
    </button>
  );
}

const TRAYS = ['IN', 'WORK', 'OUT'];
/* 25 */ function Trays() {
  const [at, setAt] = useState([2, 1, 0]);
  const move = (i) => setAt((a) => a.map((v, k) => (k === i ? (v + 1) % 3 : v)));
  return (
    <div className={c.trays}>
      {TRAYS.map((t, col) => (
        <div key={t}>
          <span>{t}</span>
          {at.map((v, k) => v === col && <button key={k} type="button" className={c.sheetBtn} aria-label={`Move paper ${k + 1} on from ${t}`} onClick={() => move(k)} style={{ '--h': k * 90 }} />)}
        </div>
      ))}
    </div>
  );
}

/* 26 */ function Ledger() {
  const [on, setOn] = useState([1, 3]);
  const rows = [['Rent', 1200], ['Paper', 86], ['Power', 240], ['Post', 33], ['Ink', 118]];
  const flip = (i) => setOn((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  const total = rows.reduce((s, [, v], i) => s + (on.includes(i) ? v : 0), 0);
  return (
    <div className={c.ledger}>
      {rows.map(([t, v], i) => <button key={t} type="button" role="checkbox" aria-checked={on.includes(i)} onClick={() => flip(i)}><u data-on={on.includes(i)}>✓</u><span>{t}</span><b>{v}</b></button>)}
      <p><span>checked</span><b>{total}</b></p>
    </div>
  );
}

const ENTRIES = { A: ['Abbott', 'Alder'], B: ['Baird', 'Brandt', 'Boyle'], C: ['Cole'], D: ['Dunn', 'Dale'], E: ['Ellis'] };
/* 27 */ function LetterTabs() {
  const [l, setL] = useState('B');
  return (
    <div className={c.letters}>
      <ul aria-live="polite">{ENTRIES[l].map((e) => <li key={e}>{e}</li>)}</ul>
      <div role="group" aria-label="Index letters">{Object.keys(ENTRIES).map((k) => <button key={k} type="button" aria-pressed={l === k} onClick={() => setL(k)}>{k}</button>)}</div>
    </div>
  );
}

/* 28 */ function Years() {
  const [y, setY] = useState(2023);
  return (
    <div className={c.years}>
      <div role="group" aria-label="Years">{[2021, 2022, 2023, 2024, 2025].map((v) => <button key={v} type="button" aria-pressed={y === v} onClick={() => setY(v)}>{v}</button>)}</div>
      <small>{(y * 7) % 41 + 12} boxes in {y}</small>
    </div>
  );
}

/* 29 */ function Bates() {
  const n = useTick(900);
  return (
    <div className={c.bates} role="img" aria-label="A page being numbered">
      <i /><i /><i />
      <b key={n}>HX-{String(1000 + n).padStart(6, '0')}</b>
    </div>
  );
}

/* 30 */ function EvidenceBag() {
  const [torn, setTorn] = useState(false);
  return (
    <button type="button" className={c.bag} aria-pressed={torn} onClick={() => setTorn((v) => !v)} aria-label="Evidence bag. Click to tear the seal">
      <span className={c.seal} data-torn={torn}>EVIDENCE</span>
      <span className={c.bagBody}><i /><i /></span>
    </button>
  );
}

/* 31 */ function EvidenceTag() {
  const [v, setV] = useState('CASE 0417');
  return (
    <div className={c.tagBox}>
      <div className={c.etag}><i /><b>{v || '—'}</b><small>ITEM 04 · SEALED</small></div>
      <input className={c.field} value={v} maxLength={12} onChange={(e) => setV(e.target.value.toUpperCase())} aria-label="Case number" spellCheck={false} />
    </div>
  );
}

const ST = [['open', '#4ade80'], ['review', '#febc2e'], ['closed', '#8b8d97']];
/* 32 */ function Docket() {
  const [s, setS] = useState([0, 1, 2, 1]);
  const bump = (i) => setS((a) => a.map((v, k) => (k === i ? (v + 1) % 3 : v)));
  return (
    <div className={c.docket}>
      {['Hale v. Rowe', 'Re: Estate 22', 'Parcel 9', 'Wren Ltd'].map((t, i) => <button key={t} type="button" onClick={() => bump(i)} aria-label={`${t}: ${ST[s[i]][0]}. Click to change`}><span>{t}</span><em style={{ '--st': ST[s[i]][1] }}>{ST[s[i]][0]}</em></button>)}
    </div>
  );
}

/* 33 */ function Pocket() {
  const [up, setUp] = useState(false);
  return (
    <button type="button" className={c.pocketBtn} aria-pressed={up} onClick={() => setUp((v) => !v)} aria-label="Library pocket. Click to pull the card up">
      <span className={c.slipCard} data-up={up}><i /><i /><i /></span>
      <span className={c.pkt}><b>BORROWER</b></span>
    </button>
  );
}

/* 34 */ function CallSlip() {
  const [t, setT] = useState('Parish records');
  const [rush, setRush] = useState(false);
  return (
    <div className={c.slipForm}>
      <b>CALL SLIP</b>
      <input className={c.field} value={t} maxLength={22} onChange={(e) => setT(e.target.value)} aria-label="Title wanted" spellCheck={false} />
      <label><input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} /> rush</label>
      <small>{rush ? 'in 1 hour' : 'next day'} · {t.length} characters</small>
    </div>
  );
}

const RECS = ['Hale deed 1931', 'Hale lease 1958', 'Rowe will 1972', 'Rowe letters 1974', 'Wren charter 1899', 'Wren map 1902'];
/* 35 */ function Search() {
  const [q, setQ] = useState('hale');
  const hit = RECS.filter((r) => r.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={c.search}>
      <label><Ico n="search" /><input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the records" spellCheck={false} autoComplete="off" /></label>
      <ul>{hit.slice(0, 4).map((r) => <li key={r}>{r}</li>)}</ul>
      <small>{hit.length} of {RECS.length} records</small>
    </div>
  );
}

/* 36 */ function Retention() {
  const n = useTick(1100);
  const left = 5 - (n % 6);
  return (
    <div className={c.ret} role="img" aria-label={`${left} years of retention left`}>
      <div>{Array.from({ length: 7 }, (_, k) => <i key={k} data-on={k < 7 - left} />)}</div>
      <small>{left > 0 ? `${left} years to keep` : 'ready to destroy'}</small>
    </div>
  );
}

/* 37 */ function Combo() {
  const [d, setD] = useState([3, 1, 4]);
  const bump = (i, by) => setD((a) => a.map((v, k) => (k === i ? step(v, by, 10) : v)));
  const open = d.join('') === '314';
  return (
    <div className={c.combo} data-open={open}>
      <div>{d.map((v, i) => (
        <span key={i}>
          <button type="button" aria-label={`Raise wheel ${i + 1}`} onClick={() => bump(i, 1)}><Ico n="up" /></button>
          <b>{v}</b>
          <button type="button" aria-label={`Lower wheel ${i + 1}`} onClick={() => bump(i, -1)}><Ico n="down" /></button>
        </span>
      ))}</div>
      <small>{open ? 'unlocked' : 'locked'}</small>
    </div>
  );
}

/* 38 */ function BoxStack() {
  const [n, setN] = useState(3);
  return (
    <button type="button" className={c.stackBox} onClick={() => setN((v) => (v >= 5 ? 1 : v + 1))} aria-label={`${n} boxes. Click to add one`}>
      {Array.from({ length: n }, (_, k) => <i key={k} style={{ '--k': k, '--s': k % 2 ? 1 : -1 }}><b>{pad2(k + 1)}</b></i>)}
    </button>
  );
}

/* 39 */ function AisleMap() {
  const [s, setS] = useState(5);
  return (
    <div className={c.aisle} role="group" aria-label="Aisle map">
      {Array.from({ length: 12 }, (_, i) => <button key={i} type="button" aria-pressed={s === i} aria-label={`Bay ${i + 1}`} onClick={() => setS(i)} data-on={i % 4 === s % 4 || Math.floor(i / 4) === Math.floor(s / 4)} />)}
      <small>bay {pad2(s + 1)}</small>
    </div>
  );
}

/* 40 */ function ScanBed() {
  return (
    <div className={c.scan} role="img" aria-label="A flatbed scanner sweeping a page">
      <i /><i /><i /><i />
      <b />
    </div>
  );
}

/* 41 */ function DrawerPull() {
  const [out, setOut] = useState(false);
  return (
    <button type="button" className={c.pull} aria-pressed={out} onClick={() => setOut((v) => !v)} aria-label="Drawer. Click to pull it out">
      <span className={c.inner} data-out={out}>{[0, 1, 2, 3].map((k) => <i key={k} style={{ '--k': k }} />)}</span>
      <span className={c.faceP}><em>Q–S</em><b /></span>
    </button>
  );
}

/* 42 */ function FolderLift() {
  const [h, setH] = useState(-1);
  return (
    <div className={c.lift} onMouseLeave={() => setH(-1)}>
      {['#c9a86a', '#d8b87a', '#c9a86a', '#d8b87a', '#c9a86a'].map((col, i) => <button key={i} type="button" aria-label={`Folder ${i + 1}`} data-n={h < 0 ? 0 : i === h ? 2 : i === h - 1 || i === h + 1 ? 1 : 0} style={{ '--col': col, '--i': i }} onMouseEnter={() => setH(i)} onFocus={() => setH(i)} onBlur={() => setH(-1)} />)}
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Index card', IndexCard, 'click'], ['Card drawer', CardDrawer, 'click'], ['File folder', FileFolder, 'click'], ['Hanging files', HangingFiles, 'click'],
    ['Filing cabinet', Cabinet, 'click'], ['Drawer stack', DrawerStack, 'click'], ['Box file', BoxFile, 'click'], ['Binder rings', Binder, 'click'],
    ['Card rotary', Rotary, 'click'], ['Index fan', CardFan, 'hover'], ['Paper pile', PaperPile, 'click'], ['Clip pile', ClipPile, 'click'],
    ['Divider tabs', Dividers, 'click'], ['Archive box', ArchiveBox, 'click'], ['Book spines', Spines, 'click'], ['Call number', CallNumber, 'type'],
    ['Microfiche', Fiche, 'hover'], ['Negative strip', Negative, 'auto'], ['Slide tray', SlideTray, 'click'], ['Record sleeve', Sleeve, 'click'],
    ['Album corners', Corners, 'click'], ['Photo shuffle', Shuffle, 'click'], ['Envelope flap', Flap, 'click'], ['Letter bundle', Bundle, 'click'],
    ['Tray sorter', Trays, 'click'], ['Ledger page', Ledger, 'click'], ['Letter tabs', LetterTabs, 'click'], ['Year labels', Years, 'click'],
    ['Bates stamp', Bates, 'auto'], ['Evidence bag', EvidenceBag, 'click'], ['Evidence tag', EvidenceTag, 'type'], ['Docket board', Docket, 'click'],
    ['Pocket card', Pocket, 'click'], ['Call slip', CallSlip, 'type'], ['Record search', Search, 'type'], ['Retention bar', Retention, 'auto'],
    ['Combination lock', Combo, 'click'], ['Box stack', BoxStack, 'click'], ['Aisle map', AisleMap, 'click'], ['Scan bed', ScanBed, 'auto'],
    ['Drawer pull', DrawerPull, 'click'], ['Folder lift', FolderLift, 'hover'],
  ],
};
