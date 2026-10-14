import { useState } from 'react';
import { useDrag, useCycle, useTick } from '../hooks';
import { useHot, useScan } from '../kit';
import c from './editorial.module.css';

/* ============================================================
   15 · EDITORIAL — quotes, captions and footnotes.
   The still side is a magazine page that sets itself as you scroll: a kicker,
   a headline that rises line by line, a standfirst that wipes in, two columns of
   text filling line by line, a pull quote, a figure, a footnote. Each part has a
   window of the scroll and CSS reads it from the page's --pin.
   What flies past is the furniture of a page of editorial.
   ============================================================ */

/* ---------- the still side ---------- */

/** deterministic line lengths, 62–100 % of the column */
const lines = (n, seed) => Array.from({ length: n }, (_, i) => 62 + ((i * 37 + seed * 11) % 39));
const COLS = [lines(13, 1), lines(13, 4)];

function Visual() {
  return (
    <div className={c.page} aria-hidden="true">
      <p className={c.kicker}><span>Essay</span><span>No. 04</span></p>
      <h3 className={c.headline}>
        <span><b>The long</b></span>
        <span><b>way round</b></span>
      </h3>
      <p className={c.stand}>A short note on belts, platforms and the people who wind them.</p>
      <p className={c.byline}><b>By A. Writer</b><span>8 min read</span></p>
      <div className={c.cols}>
        {COLS.map((col, n) => (
          <div key={n} className={c.col}>
            {col.map((w, i) => <i key={i} style={{ '--w': w, '--k': n * 13 + i }} />)}
          </div>
        ))}
        <p className={c.pullV}>“Nobody asked it to.”</p>
      </div>
      <figure className={c.figV}>
        <span className={c.imgV} />
        <figcaption>Fig. 1 — The belt, seen from the gate.</figcaption>
      </figure>
      <p className={c.footV}><sup>1</sup> Nor did anyone find the switch.</p>
      <span className={c.folio}>14</span>
    </div>
  );
}

/* ---------- shared ---------- */

const ARTS = ['art1', 'art2', 'art3'];

/* ---------- 01 quotes ---------- */

function PullQuote() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.pull1}>
        <span className={c.pq}>The belt keeps moving, though nobody asked it to.</span>
        <span className={c.cite}>Field notes</span>
      </span>
    </button>
  );
}

function QuoteBar() {
  return (
    <figure className={c.fig}>
      <blockquote className={c.qbar}><p>A line is only as straight as the person who drew it, and nobody drew this one.</p></blockquote>
      <figcaption className={c.cite}>Margin note</figcaption>
    </figure>
  );
}

const EPIGRAPHS = [['The map is not the territory, and neither is the timetable.', 'Anonymous'], ['It was never the gate that was late.', 'A platform sign'], ['Quiet is a kind of loud.', 'Field notes']];
function Epigraph() {
  const [k, setK] = useState(0);
  const [text, who] = EPIGRAPHS[k];
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label="Epigraph. Show another" onClick={() => setK((x) => (x + 1) % EPIGRAPHS.length)}>
      <span key={k} className={c.epi}><span>{text}</span><span className={c.cite}>{who}</span></span>
    </button>
  );
}

const SAYINGS = [['The belt keeps moving.', 'A.'], ['Nobody asked it to.', 'B.'], ['Somebody should.', 'C.']];
function QuoteCarousel() {
  const auto = useCycle(SAYINGS.length, 3200);
  const [pick, setPick] = useState(null);
  const k = pick ?? auto;
  return (
    <div className={c.fig}>
      <p key={k} className={c.car}>“{SAYINGS[k][0]}” <span className={c.cite}>{SAYINGS[k][1]}</span></p>
      <div className={c.dots} role="group" aria-label="Choose a quote">
        {SAYINGS.map((_, i) => <button key={i} type="button" className={c.dot} aria-label={`Show quote ${i + 1}`} aria-current={i === k} onClick={() => setPick(i)} />)}
      </div>
    </div>
  );
}

function InlineQuote() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.para}>As the sign said, <span className={c.inq}>“mind the gap between the train and the platform”</span>, and everyone did.</span>
    </button>
  );
}

function PullStat() {
  const t = useTick(40);
  const n = Math.min(42, Math.round(((t % 150) / 40) * 42));
  return (
    <div className={c.fig} role="img" aria-label="42 items on the belt">
      <p className={c.stat}><b>{n}</b><span>items on the belt</span></p>
    </div>
  );
}

function Testimonial() {
  const [open, setOpen] = useState(false);
  return (
    <div className={c.fig}>
      <figure className={c.testi}>
        <span className={c.avatar} aria-hidden="true">AR</span>
        <blockquote><p>The belt keeps moving.{open ? ' It was moving when I arrived and it was moving when I left, and in between nobody asked it to do anything at all.' : ''}</p></blockquote>
        <figcaption>A. Reader <button type="button" className={c.more} aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? 'less' : 'more'}</button></figcaption>
      </figure>
    </div>
  );
}

const MARKS = [['“', '”', 'curly'], ['"', '"', 'straight'], ['«', '»', 'guillemets'], ['‘', '’', 'single'], ['‹', '›', 'angle']];
function QuoteMarks() {
  const [k, setK] = useState(0);
  const [a, b, name] = MARKS[k];
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Quotation marks: ${name}. Try the next style`} onClick={() => setK((x) => (x + 1) % MARKS.length)}>
      <span className={c.marks}>{a}Quiet{b}</span>
      <span className={c.note}>{name}</span>
    </button>
  );
}

const REVEAL = 'Say the thing once, then let the white space say the rest.'.split(' ');
function WordReveal() {
  return (
    <div className={c.fig} role="img" aria-label="Say the thing once, then let the white space say the rest.">
      <p className={c.wr} aria-hidden="true">{REVEAL.map((w, i) => <span key={i} style={{ '--i': i }}>{w}</span>)}</p>
    </div>
  );
}

/* ---------- 02 figures and captions ---------- */

function FigureCaption() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Figure with a caption that slides up" {...bind}>
      <span className={`${c.frame} ${c.art1}`}>
        <span className={c.capSlide}>Fig. 1 — The belt, seen from the gate.</span>
      </span>
    </button>
  );
}

function Cutline() {
  return (
    <figure className={c.fig}>
      <div className={c.cut}>
        <span className={`${c.photo} ${c.art2}`} />
        <span className={c.credit}>Photo: A. Writer</span>
      </div>
      <figcaption className={c.caption}>The 18:02, leaving on time for the first time anyone can remember.</figcaption>
    </figure>
  );
}

function ImageZoom() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Figure; zoom in or out" onClick={() => setOn((v) => !v)}>
      <span className={`${c.frame} ${c.art3} ${on ? c.zoomed : ''}`} />
      <span className={c.note}>Fig. {on ? '2a — detail' : '2 — whole'}</span>
    </button>
  );
}

const SHOTS = ['The gate at dawn.', 'The belt at noon.', 'The hall at dusk.'];
function GalleryCaptions() {
  const [k, setK] = useState(0);
  return (
    <div className={c.fig}>
      <div className={c.thumbs} role="radiogroup" aria-label="Photographs">
        {SHOTS.map((s, i) => <button key={s} type="button" role="radio" aria-checked={i === k} aria-label={s} className={`${c.thumb} ${c[ARTS[i]]}`} onClick={() => setK(i)} />)}
      </div>
      <p key={k} className={c.caption}>{k + 1} / {SHOTS.length} — {SHOTS[k]}</p>
    </div>
  );
}

function Compare() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  return (
    <div className={c.fig}>
      <div {...bind} className={c.compare} aria-label="Before and after; drag the divider" aria-valuetext={`${Math.round(v * 100)} percent after`} style={{ ...bind.style, '--v': v }}>
        <span className={`${c.layer} ${c.art2}`}><i>After</i></span>
        <span className={`${c.layer} ${c.before} ${c.art1}`}><i>Before</i></span>
        <b className={c.handleC} />
      </div>
    </div>
  );
}

const CAPTION_TEXT = 'The belt, photographed from the gate, in the last light of the day.';
function CaptionTyping() {
  const t = useTick(60);
  const n = t % (CAPTION_TEXT.length + 40);
  return (
    <figure className={c.fig} aria-label={CAPTION_TEXT}>
      <span className={`${c.frame} ${c.art2}`} />
      <figcaption className={c.caption} aria-hidden="true">Fig. 3 — {CAPTION_TEXT.slice(0, Math.min(n, CAPTION_TEXT.length))}<i className={c.caret} /></figcaption>
    </figure>
  );
}

function CreditTag() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Photo credit" {...bind}>
      <span className={`${c.frame} ${c.art3}`}>
        <span className={c.pill}><b>©</b><span>Photo: A. Writer</span></span>
      </span>
    </button>
  );
}

const FIGS = [1, 2, 3, 4];
function FigureNumber() {
  const k = useCycle(FIGS.length, 1800);
  return (
    <div className={c.fig} role="img" aria-label={`Figure ${FIGS[k]}`}>
      <div className={c.figNo}><span>FIG.</span><span className={c.roll}><span style={{ '--d': k }}>{FIGS.map((n) => <i key={n}>{n}</i>)}</span></span></div>
    </div>
  );
}

/* ---------- 03 notes and references ---------- */

function FootnotePopover() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.fig}>
      <p className={c.para} onKeyDown={(e) => { if (e.key === 'Escape') setOn(false); }}>
        The belt keeps moving
        <span className={c.anchor}>
          <button type="button" className={c.sup} aria-expanded={on} aria-label="Footnote 1" onClick={() => setOn((o) => !o)}>1</button>
          <span className={c.pop} data-on={on} role="note">Nobody asked it to, and nobody can find the switch.</span>
        </span>
        {' '}all night.
      </p>
    </div>
  );
}

function Sidenote() {
  const [on, setOn] = useState(true);
  return (
    <div className={c.fig}>
      <div className={c.sidewrap} data-on={on}>
        <p className={c.para}>The belt keeps moving<button type="button" className={c.sup} aria-pressed={on} aria-label="Sidenote 1" onClick={() => setOn((o) => !o)}>1</button> all night, though nobody asked it to.</p>
        <aside className={c.side}><sup>1</sup> Nor did anyone find the switch.</aside>
      </div>
    </div>
  );
}

const ENDNOTES = ['A platform sign, 18:02.', 'Field notes, undated.', 'Overheard at gate seven.'];
function Endnotes() {
  const [sel, setSel] = useState(1);
  return (
    <div className={c.fig}>
      <p className={c.para}>
        The belt{' '}
        {ENDNOTES.map((_, i) => <button key={i} type="button" className={c.sup} aria-pressed={sel === i} aria-label={`Note ${i + 1}`} onClick={() => setSel(i)}>{i + 1}</button>)}
        {' '}keeps moving.
      </p>
      <ol className={c.notes}>
        {ENDNOTES.map((n, i) => <li key={n} data-on={sel === i}><button type="button" onClick={() => setSel(i)}>{n}</button></li>)}
      </ol>
    </div>
  );
}

function CitationChip() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Citation 1; hover for the reference" {...bind}>
      <span className={c.para}>It has been said before<span className={c.anchor}><span className={c.cite1}>[1]</span><span className={c.ref} data-on={hot}><b>Field notes</b><span>A. Writer, 2024</span></span></span>.</span>
    </button>
  );
}

function GlossaryTerm() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Glossary term; hover for the definition" {...bind}>
      <span className={c.para}>Every <span className={c.anchor}><span className={c.term}>folio</span><span className={c.ref} data-on={hot}><span>The page number of a page.</span></span></span> sits at the foot.</span>
    </button>
  );
}

const REFS = ['Writer, A. — Field notes. Quiet Press, 2024.', 'Reader, B. — On belts and platforms. Gate Books, 2022.', 'Editor, C. — A short history of tea. Dock Editions, 2019.'];
function ReferenceList() {
  const [i, bind] = useScan(REFS.length, { axis: 'y', label: (k) => REFS[k] });
  return (
    <div className={c.fig}>
      <ol {...bind} className={c.refs} aria-label="References; move along the list to pick one">
        {REFS.map((r, k) => <li key={r} data-on={i === k}>{r}</li>)}
      </ol>
    </div>
  );
}

const BIB = [['Dock', 2019, 'A short history of tea'], ['Gate', 2022, 'On belts and platforms'], ['Quiet', 2024, 'Field notes'], ['Atlas', 2021, 'The long way round']];
function BibSort() {
  const [by, setBy] = useState('author');
  const order = [...BIB].sort((a, b) => (by === 'author' ? a[0].localeCompare(b[0]) : b[1] - a[1])).map((r) => r[0]);
  return (
    <div className={c.fig}>
      <ul className={c.bib}>
        {BIB.map(([a, y, t]) => <li key={a} style={{ '--r': order.indexOf(a) }}><b>{a}</b><span>{t}</span><em>{y}</em></li>)}
      </ul>
      <div className={c.pair2} role="radiogroup" aria-label="Sort references">
        {['author', 'year'].map((k) => <button key={k} type="button" role="radio" aria-checked={by === k} className={c.mini} onClick={() => setBy(k)}>{k}</button>)}
      </div>
    </div>
  );
}

function CrossRef() {
  const [n, setN] = useState(0);
  return (
    <div className={c.fig}>
      <p className={c.para}>As argued earlier, <button type="button" className={c.xref} onClick={() => setN((v) => v + 1)}>see page 12 →</button></p>
      <p key={n} className={c.target} data-hit={n > 0}>Page 12 · The belt, once more</p>
    </div>
  );
}

/* ---------- 04 page furniture ---------- */

function Masthead() {
  return (
    <div className={c.fig} role="img" aria-label="A newspaper masthead: The Daily Belt, volume four">
      <div className={c.mast}>
        <p className={c.mastTop}><span>Vol. IV</span><span>Est. never</span><span>Free</span></p>
        <p className={c.mastName}>The Daily Belt</p>
        <p className={c.mastRule}><i /></p>
      </div>
    </div>
  );
}

function HeadlineStack() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} {...bind}>
      <span className={c.stack}>
        <span className={c.kick}>Essay</span>
        <span className={c.hed}>The long way round</span>
        <span className={c.deck}>A short note on belts, platforms and the people who wind them.</span>
      </span>
    </button>
  );
}

function Byline() {
  const [open, setOpen] = useState(false);
  return (
    <div className={c.fig}>
      <div className={c.by}>
        <span className={c.avatar} aria-hidden="true">AW</span>
        <p><b>By A. Writer</b><span>14 Oct · 8 min read</span></p>
        <button type="button" className={c.more} aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? 'less' : 'bio'}</button>
      </div>
      <p className={c.bio} data-on={open}>A. Writer writes about belts, platforms and the people who wind them.</p>
    </div>
  );
}

function ColumnCount() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5, steps: 2 });
  const n = 1 + Math.round(v * 2);
  return (
    <div className={c.fig}>
      <p className={c.colsText} style={{ columnCount: n }}>The belt keeps moving, though nobody asked it to. At seven the gates open and the hall fills with tea and timetables. Someone has crossed out the wrong platform; someone else has underlined the right one, twice.</p>
      <div {...bind} className={c.track} aria-label="Number of columns" aria-valuetext={`${n} columns`} style={{ ...bind.style, '--v': v }}><i /></div>
      <span className={c.note}>{n} {n === 1 ? 'column' : 'columns'}</span>
    </div>
  );
}

const TOC = [['The long way round', 3], ['Notes on a quiet machine', 11], ['Platforms', 24], ['Colophon', 39]];
function TableOfContents() {
  const [k, setK] = useState(1);
  return (
    <div className={c.fig}>
      <ol className={c.toc}>
        {TOC.map(([t, p], i) => (
          <li key={t}><button type="button" aria-current={i === k} onClick={() => setK(i)}><span>{t}</span><i /><b>{p}</b></button></li>
        ))}
      </ol>
    </div>
  );
}

function RunningHead() {
  const t = useCycle(3, 2200);
  const page = 14 + t;
  const verso = page % 2 === 0;
  return (
    <div className={c.fig} role="img" aria-label={`Page ${page} of a book, with its running head`}>
      <div key={page} className={c.rhead} data-verso={verso}>
        <span>{verso ? page : 'The Quiet Machine'}</span>
        <span>{verso ? 'The Quiet Machine' : page}</span>
      </div>
      <p className={c.note}>{verso ? 'verso · left page' : 'recto · right page'}</p>
    </div>
  );
}

function SectionBreak() {
  return (
    <div className={c.fig} role="img" aria-label="A section break made of three stars">
      <p className={c.brk}><i /><span>{[0, 1, 2].map((i) => <b key={i} style={{ '--i': i }} />)}</span><i /></p>
    </div>
  );
}

function JumpLine() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Continued on page 7" {...bind}>
      <span className={c.jump}>Continued on page 7<i /></span>
    </button>
  );
}

const LONG = 'The belt keeps moving. Nobody asked it to, and nobody has found the switch. At seven the gates open and the hall fills with tea and timetables. Someone has crossed out the wrong platform; someone else has underlined the right one, twice. The names below were removed before printing, and the last line was never finished. The belt keeps moving. ';
function ReadingProgress() {
  return (
    <div className={c.fig}>
      <div className={c.reader} tabIndex={0} role="region" aria-label="Scrolling text with a progress bar">
        <i className={c.prog} />
        <p>{LONG.repeat(3)}</p>
      </div>
    </div>
  );
}

/* ---------- 05 the rest of the page ---------- */

const TAGS = ['belts', 'platforms', 'tea', 'timetables', 'gates'];
function TagChips() {
  const [on, setOn] = useState(() => new Set(['tea']));
  const toggle = (t) => setOn((s) => {
    const n = new Set(s);
    if (n.has(t)) n.delete(t); else n.add(t);
    return n;
  });
  return (
    <div className={c.fig}>
      <div className={c.tags}>
        {TAGS.map((t) => <button key={t} type="button" className={c.tag} aria-pressed={on.has(t)} onClick={() => toggle(t)}>{t}</button>)}
      </div>
      <p className={c.note}>{on.size} selected</p>
    </div>
  );
}

function ReadingTime() {
  const [text, setText] = useState('The belt keeps moving, though nobody asked it to.');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const mins = Math.max(0, words / 200);
  return (
    <div className={c.fig}>
      <textarea className={c.area} value={text} onChange={(e) => setText(e.target.value)} rows={3} aria-label="Text to time" spellCheck="false" />
      <p className={c.note}>{words} words · {mins < 1 ? 'under a minute' : `${Math.ceil(mins)} min`} to read</p>
    </div>
  );
}

function CorrectionNotice() {
  const [open, setOpen] = useState(true);
  return (
    <div className={c.fig}>
      <div className={c.corr} data-on={open}>
        <p><b>Correction</b> An earlier version of this article said the belt was <del>wound</del><ins>wound by hand</ins>.</p>
        <button type="button" className={c.more} onClick={() => setOpen(false)}>dismiss</button>
      </div>
      {!open ? <button type="button" className={c.mini} onClick={() => setOpen(true)}>restore notice</button> : null}
    </div>
  );
}

function UpdatedStamp() {
  const t = useTick(1500);
  const m = 2 + t;
  return (
    <div className={c.fig} role="img" aria-label={`Updated ${m} minutes ago`}>
      <p className={c.stamp}><i className="sc-led" /> Updated <b key={m}>{m}</b> min ago</p>
    </div>
  );
}

function ShareRow() {
  const [done, setDone] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className={c.fig}>
      <div className={c.share}>
        <button type="button" className={c.mini} data-ok={done} onClick={() => setDone(true)}>{done ? 'Link copied' : 'Copy link'}</button>
        <button type="button" className={c.mini} data-ok={sent} onClick={() => setSent((s) => !s)}>{sent ? 'Emailed' : 'Email'}</button>
        <button type="button" className={c.mini} onClick={() => { setDone(false); setSent(false); }}>Reset</button>
      </div>
    </div>
  );
}

function Newsletter() {
  const [mail, setMail] = useState('');
  const [sent, setSent] = useState(false);
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  return (
    <div className={c.fig}>
      <form className={c.news} onSubmit={(e) => { e.preventDefault(); if (ok) setSent(true); }}>
        <label htmlFor="ed-mail">One note a week, never more.</label>
        <div>
          <input id="ed-mail" type="email" value={mail} onChange={(e) => { setMail(e.target.value); setSent(false); }} placeholder="you@example.com" autoComplete="off" data-ok={ok} />
          <button type="submit" disabled={!ok}>{sent ? 'Subscribed' : 'Subscribe'}</button>
        </div>
      </form>
    </div>
  );
}

const CROSS = [[1, 1, 1, 0], [1, 0, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]];
function CrosswordMini() {
  const [cells, setCells] = useState(() => CROSS.map((r) => r.map(() => '')));
  const set = (r, k, v) => setCells((cs) => cs.map((row, i) => row.map((x, j) => (i === r && j === k ? v : x))));
  return (
    <div className={c.fig}>
      <div className={c.cross} role="group" aria-label="Mini crossword; type letters into the open squares">
        {CROSS.map((row, r) => row.map((open, k) => (open
          ? <input key={`${r}-${k}`} value={cells[r][k]} maxLength={1} aria-label={`Row ${r + 1}, column ${k + 1}`} onChange={(e) => set(r, k, e.target.value.toUpperCase().slice(-1))} onFocus={(e) => e.target.select()} autoComplete="off" />
          : <i key={`${r}-${k}`} aria-hidden="true" />)))}
      </div>
    </div>
  );
}

const SPARK = [3, 5, 4, 7, 6, 9, 8, 11];
function Sparkword() {
  const [hot, bind] = useHot();
  const d = SPARK.map((v, i) => `${i ? 'L' : 'M'}${i * 5} ${14 - v}`).join('');
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A sentence with a small trend line inside it" {...bind}>
      <span className={c.para}>Visitors rose <svg className={c.spark} viewBox="0 0 36 14" aria-hidden="true"><path d={d} /><circle cx="35" cy={14 - SPARK[7]} r="1.6" /></svg><span className={c.sval} data-on={hot}>+8</span> over the week.</span>
    </button>
  );
}

export default {
  Visual,
  items: [
    ['Pull quote', PullQuote, 'hover'], ['Quote bar', QuoteBar, 'auto'], ['Epigraph', Epigraph, 'click'], ['Quote carousel', QuoteCarousel, 'auto'],
    ['Inline quote', InlineQuote, 'hover'], ['Pull stat', PullStat, 'auto'], ['Testimonial', Testimonial, 'click'], ['Quote marks', QuoteMarks, 'click'],
    ['Word reveal', WordReveal, 'auto'], ['Figure caption', FigureCaption, 'hover'], ['Cutline', Cutline, 'auto'], ['Image zoom', ImageZoom, 'click'],
    ['Gallery captions', GalleryCaptions, 'click'], ['Compare', Compare, 'drag'], ['Caption typing', CaptionTyping, 'auto'], ['Credit tag', CreditTag, 'hover'],
    ['Figure number', FigureNumber, 'auto'], ['Footnote popover', FootnotePopover, 'click'], ['Sidenote', Sidenote, 'click'], ['Endnotes', Endnotes, 'click'],
    ['Citation chip', CitationChip, 'hover'], ['Glossary term', GlossaryTerm, 'hover'], ['Reference list', ReferenceList, 'hover'], ['Bibliography sort', BibSort, 'click'],
    ['Cross-reference', CrossRef, 'click'], ['Masthead', Masthead, 'auto'], ['Headline stack', HeadlineStack, 'hover'], ['Byline', Byline, 'click'],
    ['Column count', ColumnCount, 'drag'], ['Table of contents', TableOfContents, 'click'], ['Running head', RunningHead, 'auto'], ['Section break', SectionBreak, 'auto'],
    ['Jump line', JumpLine, 'hover'], ['Reading progress', ReadingProgress, 'scroll'], ['Tag chips', TagChips, 'click'], ['Reading time', ReadingTime, 'type'],
    ['Correction notice', CorrectionNotice, 'click'], ['Updated stamp', UpdatedStamp, 'auto'], ['Share row', ShareRow, 'click'], ['Newsletter box', Newsletter, 'type'],
    ['Crossword mini', CrosswordMini, 'type'], ['Sparkword', Sparkword, 'hover'],
  ],
};
