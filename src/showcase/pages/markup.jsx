import { useId, useState } from 'react';
import { useDrag, useCycle, useTick, useToggle } from '../hooks';
import { useHot, useScan, usePoint } from '../kit';
import c from './markup.module.css';

/* ============================================================
   13 · MARKUP — highlights, strikes and redactions.
   The still side is a page of notes. As you scroll, a pen goes through it: a
   phrase is highlighted, another crossed out, a word circled, a few lines blacked
   out. Each mark has a progress of its own (--m, from the page's --pin and the
   mark's order) and CSS draws it; nothing is animated by script.
   Everything in the deck is something you can do to a line of text.
   ============================================================ */

/* ---------- the still side ---------- */

const NOTES = [
  ['The belt ', ['keeps moving', 'hl'], ', though ', ['nobody asked it to', 'st'], '. At ', ['seven', 'ci'], ' the gates open and the hall fills with ', ['tea and timetables', 'ul'], '.'],
  ['Someone has crossed out ', ['the wrong platform', 'st'], '. Someone else has underlined the right one ', ['twice', 'du'], '.'],
  ['The list below was ', ['removed before printing', 'hl'], ': ', ['the east gate', 'rd'], ', ', ['platform nine', 'rd'], ' and ', ['the night shift', 'rd'], '.'],
  ['The last line was ', ['never finished', 'rd'], '.'],
];
let order = 0;
const PAGE = NOTES.map((p) => p.map((tok) => (typeof tok === 'string' ? { t: tok } : { t: tok[0], m: tok[1], i: order++ })));
const MARKS = order;

function Visual() {
  return (
    <div className={c.doc} style={{ '--n': MARKS + 1 }} aria-hidden="true">
      <p className={c.docHead}><span><i className="sc-led" /> Field notes</span><span>Page 1 of 1</span></p>
      <h3 className={c.docTitle}>Notes on a quiet machine</h3>
      {PAGE.map((p, n) => (
        <p key={n} className={c.docP}>
          {p.map((tok, k) => (tok.m
            ? <span key={k} className={`${c.mk} ${c[tok.m]}`} style={{ '--i': tok.i }}>{tok.t}</span>
            : <span key={k}>{tok.t}</span>))}
        </p>
      ))}
      <p className={c.docKey}><b>Highlight</b><b>Strike</b><b>Redact</b><b>Circle</b></p>
      <span className={c.docRule}><i /></span>
    </div>
  );
}

/* ---------- 01 marks you draw ---------- */

function MarkerSweep() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.para}>The belt <mark className={c.marker}>keeps moving, though nobody asked it to</mark>, and the hall fills with tea.</span>
    </button>
  );
}

function DoubleMarker() {
  return (
    <div className={c.fig}>
      <p className={c.para}>Two pens: <mark className={c.pen1}>one pass over the line</mark> and <mark className={c.pen2}>another over the first</mark>.</p>
    </div>
  );
}

function StrikeDraw() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} onClick={flip}>
      <span className={c.para}>The old timetable <s className={c.strike} data-on={on}>said the belt would stop at six</s> and so it did not.</span>
    </button>
  );
}

function Squiggle() {
  return (
    <div className={c.fig}>
      <p className={c.para}>Check <span className={c.squig}>the speling</span> of every <span className={c.squig}>platfrom</span> name.</p>
    </div>
  );
}

const CIRCLE = 'M52 4C24 2 3 12 4 26c1 13 27 16 52 14 29-2 42-11 40-24C94 7 70 3 40 6';
function HandCircle() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} onClick={flip}>
      <span className={c.para}>The gates open at <span className={c.circled} data-on={on}>seven<svg viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d={CIRCLE} /></svg></span> sharp.</span>
    </button>
  );
}

function RoughRule() {
  return (
    <div className={c.fig}>
      <p className={c.para}>Every <span className={c.rough}>word counts<svg viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 7C28 3 62 11 98 4" /><path pathLength="1" d="M4 11C34 8 70 13 96 9" /></svg></span> on this belt.</p>
    </div>
  );
}

function CornerBrackets() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.para}>Look closely at <span className={c.brk}>this phrase</span> and nothing else.</span>
    </button>
  );
}

const SCRIBBLE = 'M3 10L97 4 5 16 97 10 7 22 95 16 9 24 93 20';
function ScribbleOut() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} onClick={flip}>
      <span className={c.para}>Please do not <span className={c.scrib} data-on={on}>mention the belt<svg viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d={SCRIBBLE} /></svg></span> again.</span>
    </button>
  );
}

function CalloutArrow() {
  return (
    <div className={c.fig} role="img" aria-label="A callout arrow pointing at the word one, labelled: this one">
      <p className={c.para}>Every dial reads normal, except <span className={c.target}>one<svg viewBox="0 0 60 36" aria-hidden="true"><path pathLength="1" d="M4 30C10 8 30 4 50 6" /><path pathLength="1" d="M44 1L52 6 45 13" /></svg><em>this one</em></span>.</p>
    </div>
  );
}

function HighlighterDrag() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.45 });
  return (
    <div className={c.fig}>
      <p {...bind} className={`${c.para} ${c.draggable}`} aria-label="Drag across the text to highlight as far as you like" style={{ ...bind.style, '--v': v }}>
        <span className={c.pen}>Drag across this line of text to highlight it, as far as you like.</span>
      </p>
    </div>
  );
}

function EraserReveal() {
  const [v, bind] = useDrag({ mode: 'x', init: 0 });
  return (
    <div className={c.fig}>
      <div {...bind} className={c.erase} aria-label="Drag to rub out the cover" style={{ ...bind.style, '--v': v }}>
        <p className={c.para}>Under the grey there is a sentence nobody was meant to read.</p>
        <span className={c.cover} aria-hidden="true" />
      </div>
    </div>
  );
}

/* ---------- 02 notes beside the text ---------- */

function MarginNote() {
  const [on, flip] = useToggle(true);
  return (
    <div className={c.fig}>
      <div className={c.marg} data-on={on}>
        <p className={c.para}>The belt <button type="button" className={c.anchor} aria-expanded={on} onClick={flip}>keeps moving</button>, though nobody asked it to.</p>
        <aside className={c.aside}><b>Check</b> who wound it.</aside>
      </div>
    </div>
  );
}

const VIEWS = ['markup', 'final', 'original'];
function TrackedChanges() {
  const [v, setV] = useState(0);
  return (
    <div className={c.fig}>
      <p className={c.para} data-view={VIEWS[v]}>The belt <del>keeps</del><ins>kept</ins> moving <del>until midnight</del><ins>all night</ins>, and nobody <del>minded</del><ins>complained</ins>.</p>
      <button type="button" className={c.pill} aria-label={`Showing the ${VIEWS[v]} view. Switch view`} onClick={() => setV((x) => (x + 1) % VIEWS.length)}>{VIEWS[v]}</button>
    </div>
  );
}

const DIFF = [[' ', 'const belt = new Belt();'], ['-', 'belt.speed = 3;'], ['+', 'belt.speed = 5;'], [' ', 'belt.start();'], ['-', 'await wait(900);'], ['+', 'await wait(400);']];
function LineDiff() {
  const [i, bind] = useScan(DIFF.length, { axis: 'y', label: (k) => `line ${k + 1}: ${DIFF[k][1]}` });
  return (
    <div className={c.fig}>
      <ol {...bind} className={c.diff} aria-label="A line diff; move along it to focus a line">
        {DIFF.map(([k, t], r) => <li key={r} data-k={k} data-on={r === i}><i>{r + 1}</i><b>{k}</b><code>{t}</code></li>)}
      </ol>
    </div>
  );
}

function ProofMarks() {
  return (
    <div className={c.fig} role="img" aria-label="A sentence with proofreader's marks: insert an e, swap two letters, delete a word">
      <div className={c.proof}>
        <p>the quick brown fox jumpd over teh lazy very dog</p>
        <span className={c.caret} style={{ '--c': 24, '--k': 0 }}><b>e</b></span>
        <span className={c.swapMark} style={{ '--c': 32, '--k': 1 }} />
        <span className={c.delMark} style={{ '--c': 40, '--w': 4, '--k': 2 }}><b>d</b></span>
      </div>
    </div>
  );
}

function PostIt() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Sticky note: ask who wound the belt" {...bind}>
      <span className={c.sticky}><span className={c.tape} /><span>Ask who wound the belt.</span></span>
    </button>
  );
}

function Footnote() {
  const [on, flip] = useToggle(true);
  return (
    <div className={c.fig}>
      <p className={c.para}>The belt keeps moving<button type="button" className={c.sup} aria-expanded={on} aria-label="Footnote 1" onClick={flip}>1</button> all night.</p>
      <p className={c.foot} data-on={on}><sup>1</sup> Nobody asked it to, and nobody can find the switch.</p>
    </div>
  );
}

function Spoiler() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} onClick={flip}>
      <span className={c.para}>The butler did it, and then <span className={c.spoil} data-on={on}>handed in his notice at seven</span>.</span>
    </button>
  );
}

const CODE = ['function tick(belt) {', '  belt.advance(1);', '  if (belt.full) belt.stop();', '  return belt.position;', '}'];
function CodeComment() {
  const [open, setOpen] = useState(() => new Set([2]));
  const toggle = (i) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(i)) n.delete(i); else n.add(i);
    return n;
  });
  return (
    <div className={c.fig}>
      <ol className={c.code}>
        {CODE.map((l, i) => (
          <li key={i}>
            <button type="button" className={c.codeLine} aria-expanded={open.has(i)} onClick={() => toggle(i)}><i>{i + 1}</i><code>{l}</code><b aria-hidden="true">+</b></button>
            {open.has(i) ? <p className={c.review}>Should this wait for the next tick?</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

const PINS = [[22, 40, 'The belt'], [58, 68, 'The hall'], [80, 26, 'The gate']];
function PinnedFigure() {
  const [k, setK] = useState(0);
  return (
    <div className={c.fig}>
      <div className={c.figure}>
        {PINS.map(([x, y, label], i) => (
          <button key={label} type="button" className={c.pin} style={{ '--ox': `${x}%`, '--oy': `${y}%` }} aria-pressed={i === k} aria-label={`Pin ${i + 1}: ${label}`} onClick={() => setK(i)}>{i + 1}</button>
        ))}
      </div>
      <p className={c.note}>{k + 1}  ·  {PINS[k][2]}</p>
    </div>
  );
}

const POEM = ['The belt keeps moving,', 'though nobody asked it to.', 'At seven the gates open,', 'and the hall fills with tea.', 'Someone has crossed out the platform.'];
function ReadingRuler() {
  const [i, bind] = useScan(POEM.length, { axis: 'y', label: (k) => POEM[k] });
  return (
    <div className={c.fig}>
      <div {...bind} className={c.ruler} aria-label="A reading ruler; move over the text to focus a line">
        {POEM.map((l, k) => <p key={k} data-on={i === -1 || i === k} data-f={i === k}>{l}</p>)}
      </div>
    </div>
  );
}

/* ---------- 03 edits and secrets ---------- */

const REWRITES = [['keeps', 'kept'], ['nobody', 'someone'], ['tea', 'coffee']];
function Rewrite() {
  const i = useCycle(REWRITES.length, 2800);
  const [was, now] = REWRITES[i];
  return (
    <div className={c.fig} role="img" aria-label={`A word struck out and rewritten: ${was} becomes ${now}`}>
      <p className={c.para}>The word <span key={i} className={c.rewrite}><s>{was}</s><em>{now}</em></span> was changed.</p>
    </div>
  );
}

function Overtype() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} onClick={flip}>
      <span className={c.para}>The password is <span className={c.over} data-on={on}>swordfish<i aria-hidden="true">xxxxxxxxxxxxxx</i></span> today.</span>
    </button>
  );
}

function Whiteout() {
  const id = `blot${useId().replace(/\W/g, '')}`;
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} onClick={flip}>
      <svg className={c.defs} width="0" height="0" aria-hidden="true" focusable="false">
        <filter id={id} x="-15%" y="-40%" width="130%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="10" /></filter>
      </svg>
      <span className={c.para}>My account number is <span className={c.blotWrap}>0000 1234 5678<i className={c.blot} data-on={on} style={{ filter: `url(#${id})` }} /></span>, said no one.</span>
    </button>
  );
}

function InkBleed() {
  const id = `bleed${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.fig} role="img" aria-label="Text whose edges bleed like ink on paper">
      <svg className={c.defs} width="0" height="0" aria-hidden="true" focusable="false">
        <filter id={id} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3"><animate attributeName="scale" values="2;5;2" dur="5s" repeatCount="indefinite" /></feDisplacementMap>
        </filter>
      </svg>
      <p className={c.bleed} style={{ filter: `url(#${id})` }} aria-hidden="true">Inked, never quite sharp.</p>
    </div>
  );
}

const THREAD = [['A', 'Why is it still moving?'], ['B', 'Nobody asked it to stop.'], ['A', 'Then who wound it?']];
function CommentThread() {
  const t = useTick(1600);
  const n = [1, 2, 3, 3, 3][t % 5];
  const run = Math.floor(t / 5);
  return (
    <div className={c.fig} role="img" aria-label="A comment thread growing under a highlighted phrase">
      <p className={c.para}>The belt <mark className={c.marker2}>keeps moving</mark> all night.</p>
      <ol className={c.thread}>
        {THREAD.slice(0, n).map(([who, said], k) => <li key={`${run}-${k}`}><b>{who}</b>{said}</li>)}
      </ol>
    </div>
  );
}

function DogEar() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Page seven with a folded corner" {...bind}>
      <span className={c.leafCard}><span>Page seven. The belt moves on.</span><i className={c.ear} /></span>
    </button>
  );
}

function Paperclip() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Two sheets held by a clip. Take the clip off" onClick={flip}>
      <span className={c.sheets} data-on={on}>
        <i className={c.sh1}><b /><b /><b /></i>
        <i className={c.sh2}><b /><b /><b /></i>
        <svg className={c.clip} viewBox="0 0 20 44" aria-hidden="true"><path d="M5 34V9a5 5 0 0 1 10 0v25a3.5 3.5 0 0 1-7 0V12" /></svg>
      </span>
    </button>
  );
}

const RULED = ['Dear belt,', 'you keep moving.', 'Nobody asked you to.', 'Please keep going.'];
function RuledPaper() {
  return (
    <div className={c.fig} role="img" aria-label="Ruled paper being written on: Dear belt, you keep moving. Nobody asked you to. Please keep going.">
      <div className={c.ruled}>
        {RULED.map((l, i) => <p key={l} style={{ '--i': i }}><span>{l}</span></p>)}
      </div>
    </div>
  );
}

const FOLDERS = [['A', 'Arrivals are logged by hand.'], ['B', 'Belts are checked at seven.'], ['C', 'Complaints go in the red tray.'], ['D', 'Departures are never late.']];
function FolderTabs() {
  const [k, setK] = useState(1);
  const onKey = (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const n = (k + d + FOLDERS.length) % FOLDERS.length;
    setK(n);
    e.currentTarget.parentElement.children[n].focus();
  };
  return (
    <div className={c.fig}>
      <div className={c.folder}>
        <div role="tablist" aria-label="Folder tabs" className={c.tabs}>
          {FOLDERS.map(([l], i) => (
            <button key={l} type="button" role="tab" id={`ft-${l}`} aria-selected={i === k} tabIndex={i === k ? 0 : -1} className={c.tab} onClick={() => setK(i)} onKeyDown={onKey}>{l}</button>
          ))}
        </div>
        <p role="tabpanel" aria-labelledby={`ft-${FOLDERS[k][0]}`} className={c.panelText}>{FOLDERS[k][1]}</p>
      </div>
    </div>
  );
}

function TornEdge() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A sheet that tears in two" onClick={flip}>
      <span className={c.torn} data-on={on}>
        <span className={c.halfL}>Tear here, then<br />read the other half.</span>
        <span className={c.halfR} aria-hidden="true">Tear here, then<br />read the other half.</span>
      </span>
    </button>
  );
}

const WORDS = ['belt', 'gates', 'tea', 'timetables', 'platform', 'hall'];
const PENS = ['red', 'white', 'line'];
function PaletteMarker() {
  const [pen, setPen] = useState(0);
  const [marks, setMarks] = useState({});
  const paint = (w) => setMarks((m) => {
    const n = { ...m };
    if (n[w] === pen) delete n[w]; else n[w] = pen;
    return n;
  });
  return (
    <div className={c.fig}>
      <p className={c.para}>
        {WORDS.map((w) => <button key={w} type="button" className={c.tok} data-pen={marks[w] === undefined ? '' : PENS[marks[w]]} onClick={() => paint(w)}>{w}</button>)}
      </p>
      <div role="radiogroup" aria-label="Pen colour" className={c.chipsRow}>
        {PENS.map((p, i) => <button key={p} type="button" role="radio" aria-checked={i === pen} aria-label={`${p} pen`} className={c.swatch} data-pen={p} onClick={() => setPen(i)} />)}
      </div>
    </div>
  );
}

const CLEAR = [['The', 0], ['east', 2], ['gate', 2], ['opens', 1], ['at', 0], ['seven', 3], ['for', 0], ['the', 0], ['night', 4], ['shift', 4]];
function ClearanceDial() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5, steps: 4 });
  const level = Math.round(v * 4);
  return (
    <div className={c.fig}>
      <p className={c.para}>{CLEAR.map(([w, lv], i) => <span key={i} className={c.cw} data-hide={lv > 0 && level >= lv}>{w} </span>)}</p>
      <div {...bind} className={c.dialTrack} aria-label="Clearance level" aria-valuetext={`Level ${level} of 4`} style={{ ...bind.style, '--v': v }}>
        <i />
      </div>
      <p className={c.note}>Clearance {level} / 4</p>
    </div>
  );
}

const LENS = 'The names on this page were meant to stay blurred, and a small circle of light is the only thing that can read them.';
function BlurLens() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div {...bind} className={c.lens} aria-label="A blurred paragraph; move over it to read through a circle" style={{ ...bind.style, '--lx': `${p ? p.x : 50}%`, '--ly': `${p ? p.y : 50}%`, '--lo': p ? 1 : 0 }}>
        <p className={c.lensBlur}>{LENS}</p>
        <p className={c.lensSharp} aria-hidden="true">{LENS}</p>
      </div>
    </div>
  );
}

const TASKS = ['Wind the belt', 'Open the gates', 'Serve the tea', 'Print the list'];
function TaskStrike() {
  const [done, setDone] = useState(() => new Set([0]));
  const toggle = (i) => setDone((s) => {
    const n = new Set(s);
    if (n.has(i)) n.delete(i); else n.add(i);
    return n;
  });
  return (
    <div className={c.fig}>
      <ul className={c.tasks}>
        {TASKS.map((t, i) => (
          <li key={t}><button type="button" role="checkbox" aria-checked={done.has(i)} className={c.task} onClick={() => toggle(i)}><i /><span>{t}</span></button></li>
        ))}
      </ul>
    </div>
  );
}

const TYPOS = [['Teh', 'The'], ['moveing', 'moving']];
function TypoSquiggle() {
  const [fixed, setFixed] = useState([false, false]);
  const left = fixed.filter((f) => !f).length;
  return (
    <div className={c.fig}>
      <p className={c.para}>
        <button type="button" className={c.typo} data-fixed={fixed[0]} onClick={() => setFixed((f) => [true, f[1]])}>{fixed[0] ? TYPOS[0][1] : TYPOS[0][0]}</button> belt keeps{' '}
        <button type="button" className={c.typo} data-fixed={fixed[1]} onClick={() => setFixed((f) => [f[0], true])}>{fixed[1] ? TYPOS[1][1] : TYPOS[1][0]}</button> all night.
      </p>
      <div className={c.chipsRow}>
        <span className={c.note}>{left ? `${left} possible ${left === 1 ? 'issue' : 'issues'}` : 'No issues'}</span>
        <button type="button" className={c.mini} onClick={() => setFixed([false, false])}>reset</button>
      </div>
    </div>
  );
}

function SelectionStyle() {
  return (
    <div className={c.fig} role="img" aria-label="Text being selected and released, with a handle at each end">
      <p className={c.selLine}><span className={c.sel}>Select a few words, then let go.</span></p>
    </div>
  );
}

const SECRET = [['The', 0], ['meeting', 1], ['is', 0], ['at', 0], ['the', 0], ['old', 1], ['mill', 1], ['tonight', 1]];
function BarRedaction() {
  const [held, setHeld] = useState(false);
  const isKey = (e) => e.key === ' ' || e.key === 'Enter';
  return (
    <div className={c.fig}>
      <button
        type="button"
        className={`${c.hold} ${c.reset}`}
        data-held={held}
        aria-pressed={held}
        aria-label="Hold to read the redacted line"
        onPointerDown={() => setHeld(true)}
        onPointerUp={() => setHeld(false)}
        onPointerLeave={() => setHeld(false)}
        onPointerCancel={() => setHeld(false)}
        onBlur={() => setHeld(false)}
        onKeyDown={(e) => { if (isKey(e) && !e.repeat) { e.preventDefault(); setHeld(true); } }}
        onKeyUp={(e) => { if (isKey(e)) setHeld(false); }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className={c.para}>{SECRET.map(([w, r], i) => <span key={i} className={c.bar} data-r={r}>{w} </span>)}</span>
        <span className={c.holdTag}>{held ? 'READING' : 'HOLD TO READ'}</span>
      </button>
    </div>
  );
}

const TICKS = [['Belt wound', true], ['Gates open', true], ['Tea served', false], ['List printed', true]];
function TickMargin() {
  return (
    <div className={c.fig} role="img" aria-label="A checklist with ticks and one cross drawn in the margin">
      <ul className={c.ticks}>
        {TICKS.map(([t, ok], i) => (
          <li key={t} style={{ '--i': i }}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{ok ? <path pathLength="1" d="M3 13l6 6L21 5" /> : <path pathLength="1" d="M5 5l14 14M19 5L5 19" />}</svg>
            <span data-ok={ok}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the last three, which need a little state of their own ---------- */

const ULS = ['solid', 'dotted', 'dashed', 'wavy', 'double'];
function UnderlineStyles() {
  const [k, setK] = useState(3);
  return (
    <div className={c.fig}>
      <p className={c.para}>An <span className={c.uline} style={{ textDecorationStyle: ULS[k] }}>underlined phrase</span> can be dressed five ways.</p>
      <div role="radiogroup" aria-label="Underline style" className={c.chipsRow}>
        {ULS.map((u, i) => <button key={u} type="button" role="radio" aria-checked={i === k} className={c.mini} onClick={() => setK(i)}>{u}</button>)}
      </div>
    </div>
  );
}

const FIND = 'The belt keeps moving. The belt does not stop for tea, and the belt does not ask why.';
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function FindInText() {
  const [q, setQ] = useState('belt');
  const parts = q ? FIND.split(new RegExp(`(${escape(q)})`, 'ig')) : [FIND];
  const n = q ? Math.floor(parts.length / 2) : 0;
  return (
    <div className={c.fig}>
      <p className={c.para}>{parts.map((p, i) => (i % 2 ? <mark key={i} className={c.found}>{p}</mark> : p))}</p>
      <label className={c.search}>
        <input value={q} onChange={(e) => setQ(e.target.value.slice(0, 20))} aria-label="Find in the paragraph" spellCheck="false" autoComplete="off" />
        <span>{n} {n === 1 ? 'match' : 'matches'}</span>
      </label>
    </div>
  );
}

const SWAP = 'The belt keeps moving, and the belt does not ask why. Nobody has ever seen the belt stop.';
function SwapPreview() {
  const [r, setR] = useState('tape');
  const parts = SWAP.split(/(belt)/g);
  return (
    <div className={c.fig}>
      <p className={c.para}>{parts.map((p, i) => (i % 2 ? <span key={i} className={c.swapPair}><del>{p}</del><ins>{r || '…'}</ins></span> : p))}</p>
      <label className={c.search}>
        <span>replace “belt” with</span>
        <input value={r} onChange={(e) => setR(e.target.value.slice(0, 12))} aria-label="Replacement for the word belt" spellCheck="false" autoComplete="off" />
      </label>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Marker sweep', MarkerSweep, 'hover'], ['Double marker', DoubleMarker, 'auto'], ['Strike draw', StrikeDraw, 'click'], ['Squiggle', Squiggle, 'auto'],
    ['Hand circle', HandCircle, 'click'], ['Rough rule', RoughRule, 'auto'], ['Corner brackets', CornerBrackets, 'hover'], ['Scribble out', ScribbleOut, 'click'],
    ['Callout arrow', CalloutArrow, 'auto'], ['Highlighter drag', HighlighterDrag, 'drag'], ['Eraser reveal', EraserReveal, 'drag'], ['Margin note', MarginNote, 'click'],
    ['Tracked changes', TrackedChanges, 'click'], ['Line diff', LineDiff, 'hover'], ['Proof marks', ProofMarks, 'auto'], ['Post-it', PostIt, 'hover'],
    ['Footnote', Footnote, 'click'], ['Spoiler', Spoiler, 'click'], ['Code comment', CodeComment, 'click'], ['Pinned figure', PinnedFigure, 'click'],
    ['Reading ruler', ReadingRuler, 'hover'], ['Rewrite', Rewrite, 'auto'], ['Overtype', Overtype, 'click'], ['Whiteout', Whiteout, 'click'],
    ['Ink bleed', InkBleed, 'auto'], ['Comment thread', CommentThread, 'auto'], ['Dog-ear', DogEar, 'hover'], ['Paperclip', Paperclip, 'click'],
    ['Ruled paper', RuledPaper, 'auto'], ['Folder tabs', FolderTabs, 'keys'], ['Torn edge', TornEdge, 'click'], ['Palette marker', PaletteMarker, 'click'],
    ['Clearance dial', ClearanceDial, 'drag'], ['Blur lens', BlurLens, 'hover'], ['Task strike', TaskStrike, 'click'], ['Typo squiggle', TypoSquiggle, 'click'],
    ['Selection style', SelectionStyle, 'auto'], ['Bar redaction', BarRedaction, 'press'], ['Tick margin', TickMargin, 'auto'], ['Underline styles', UnderlineStyles, 'click'],
    ['Find in text', FindInText, 'type'], ['Swap preview', SwapPreview, 'type'],
  ],
};
