import { useState } from 'react';
import { useDrag, useToggle } from '../hooks';
import { useHot, useCell } from '../kit';
import c from './fold.module.css';

/* ============================================================
   18 · FOLD — cards that flip, fold and peel.
   The still side is a leaflet of four panels. Each panel hangs from the one
   before it, and each hinge turns by the same --fold (times 1, -2, 2: that is what
   makes it an accordion). The scroll opens it flat, holds it, and folds it the
   other way. The turning ring on the right holds forty-two things to flip, fold,
   peel and tear.
   ============================================================ */

/* ---------- the still side ---------- */

const MULT = [0, 1, -2, 2];
const LETTERS = ['F', 'O', 'L', 'D'];

/** one panel of the leaflet, and (inside it, hinged to its far edge) the next */
function Pleat({ k }) {
  return (
    <div className={`${c.pleat} ${k ? '' : c.first}`} style={{ '--k': k, '--s': MULT[k], '--sh': k % 2 ? -1 : 1 }}>
      <i className={c.front}><b>{LETTERS[k]}</b></i>
      <i className={c.back} />
      {k < 3 ? <Pleat k={k + 1} /> : null}
    </div>
  );
}

function Visual() {
  return (
    <div className={c.leaf} aria-hidden="true">
      <div className={c.sheet}><Pleat k={0} /></div>
      <p className={c.leafTag}><i className="sc-led" /> Four panels, three hinges</p>
    </div>
  );
}

/* ---------- helpers ---------- */

const PN = ['A', 'B', 'C', 'D'];

/* ---------- 01 flips ---------- */

function FlipOver() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Card that flips over" {...bind}>
      <span className={c.stage}>
        <span className={`${c.flip} ${c.y}`}><i><b>Front</b></i><i className={c.bk}><b>Back</b></i></span>
      </span>
    </button>
  );
}

function FlipUp() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Card that flips up like a calendar page" {...bind}>
      <span className={c.stage}>
        <span className={`${c.flip} ${c.x}`}><i><b>Up</b></i><i className={c.bk}><b>Over</b></i></span>
      </span>
    </button>
  );
}

function DiagonalFlip() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="Card that flips over a diagonal" onClick={flip}>
      <span className={c.stage}>
        <span className={`${c.flip} ${c.d}`} data-on={on}><i><b>Slant</b></i><i className={c.bkD}><b>Turn</b></i></span>
      </span>
    </button>
  );
}

function TwinFlip() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Two cards that flip one after the other" {...bind}>
      <span className={`${c.stage} ${c.twins}`}>
        {[0, 1].map((k) => <span key={k} className={`${c.flip} ${c.y} ${c.small}`} style={{ '--i': k }}><i><b>{PN[k]}</b></i><i className={c.bk}><b>{PN[k + 2]}</b></i></span>)}
      </span>
    </button>
  );
}

function FlipDeck() {
  const [n, setN] = useState(0);
  const m = n % 5;
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`A deck; turn the top card face up. ${m} of 4 turned`} onClick={() => setN((v) => v + 1)}>
      <span className={`${c.stage} ${c.deck}`}>
        {[0, 1, 2, 3].map((k) => <i key={k} data-out={k < m} style={{ '--k': k }}><b>{k + 1}</b></i>)}
      </span>
    </button>
  );
}

function FlipTiles() {
  const [at, bind] = useCell(2, 4, null);
  const L = [...'FOLDFLIP'];
  return (
    <div className={c.fig}>
      <div {...bind} className={c.tiles} aria-label="Tiles that flip as the pointer crosses them">
        {L.map((ch, i) => <i key={i} data-on={at[0] === Math.floor(i / 4) && at[1] === i % 4}><b>{ch}</b></i>)}
      </div>
    </div>
  );
}

/* ---------- 02 folds ---------- */

function AccordionFold() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A leaflet; fold or open it" onClick={flip}>
      <span className={c.leafSmall} style={{ '--fold': on ? 0 : 150, '--o': on ? 1 : 0 }}>
        <Pleat k={0} />
      </span>
    </button>
  );
}

function LetterFold() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A letter in three folds" onClick={flip}>
      <span className={c.stage}>
        <span className={c.letter} data-on={on}>
          <i className={c.lt}><b>Top</b></i>
          <i className={c.lm}><b>Middle</b></i>
          <i className={c.lb}><b>Bottom</b></i>
        </span>
      </span>
    </button>
  );
}

function TriFold() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A brochure with two doors" onClick={flip}>
      <span className={c.stage}>
        <span className={c.tri} data-on={on}>
          <i className={c.tc}><b>Inside</b></i>
          <i className={c.tl}><b>Left</b></i>
          <i className={c.tr}><b>Right</b></i>
        </span>
      </span>
    </button>
  );
}

function AdventDoors() {
  const [open, setOpen] = useState(() => new Set([1]));
  const toggle = (i) => setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <div className={c.fig}>
      <div className={c.advent}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button key={n} type="button" aria-pressed={open.has(n)} aria-label={`Door ${n}`} onClick={() => toggle(n)}>
            <i className={c.inside}>•</i>
            <i className={c.door} data-open={open.has(n)}>{n}</i>
          </button>
        ))}
      </div>
    </div>
  );
}

function PeelCorner() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A page whose corner peels back" {...bind}>
      <span className={c.peelWrap}><i className={c.peelUnder} /><span className={c.peelCard}><b>Peel</b><i /></span></span>
    </button>
  );
}

function Envelope() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="An envelope; open it" onClick={flip}>
      <span className={c.stage}>
        <span className={c.env} data-on={on}>
          <i className={c.note}><b>Letter</b></i>
          <i className={c.pocket} />
          <i className={c.flap} />
        </span>
      </span>
    </button>
  );
}

function NotebookSpread() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A notebook spread; turn the page" onClick={flip}>
      <span className={c.stage}>
        <span className={c.nb} data-on={on}>
          <i className={c.pgL}><b>2</b></i>
          <i className={c.pgR}><b>3</b></i>
          <i className={c.turn}><i className={c.tf}><b>1</b></i><i className={c.tb}><b>2</b></i></i>
        </span>
      </span>
    </button>
  );
}

function PageTurn() {
  const [n, setN] = useState(0);
  const m = n % 5;
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`A book; turn a page. ${m} turned`} onClick={() => setN((v) => v + 1)}>
      <span className={c.stage}>
        <span className={c.book}>
          {[0, 1, 2, 3].map((k) => <i key={k} data-out={k < m} style={{ '--k': k }}><b>{k * 2 + 1}</b><u>{k * 2 + 2}</u></i>)}
        </span>
      </span>
    </button>
  );
}

function Shutters() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A window with two shutters" {...bind}>
      <span className={c.stage}>
        <span className={c.win}><i className={c.view}><b>View</b></i><i className={c.sl} /><i className={c.sr} /></span>
      </span>
    </button>
  );
}

function Blinds() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Venetian blinds" {...bind}>
      <span className={c.stage}>
        <span className={c.win}>
          <i className={c.view}><b>Light</b></i>
          <span className={c.slats}>{[0, 1, 2, 3, 4, 5, 6].map((i) => <i key={i} style={{ '--i': i }} />)}</span>
        </span>
      </span>
    </button>
  );
}

function Curtain() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A stage curtain; open it" onClick={flip}>
      <span className={c.curtain} data-on={on}>
        <i className={c.stageBg}><b>Show</b></i>
        <i className={c.cl} /><i className={c.cr} />
      </span>
    </button>
  );
}

function GarageDoor() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A sectional door; raise it" onClick={flip}>
      <span className={c.garage} data-on={on}>
        <i className={c.inside}>Inside</i>
        {[0, 1, 2, 3].map((i) => <i key={i} className={c.gp} style={{ '--i': i }} />)}
      </span>
    </button>
  );
}

function FoldDown() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A panel that folds down like a table" onClick={flip}>
      <span className={`${c.stage} ${c.tall}`}>
        <span className={c.wall} data-on={on}><i className={c.shelf}><b>Table</b></i></span>
      </span>
    </button>
  );
}

function Bellows() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.5 });
  const s = 3.4 + v * 8;
  const n = 9;
  return (
    <div className={c.fig}>
      <svg className={c.bell} viewBox="0 0 130 40" role="img" aria-label="Bellows that stretch and squeeze">
        <rect x="4" y="4" width="4" height="32" rx="1" />
        {Array.from({ length: n }, (_, i) => {
          const x0 = 10 + i * s;
          const x1 = x0 + s;
          const hi = i % 2 === 0;
          return <polygon key={i} data-hi={hi} points={`${x0},${hi ? 4 : 10} ${x1},${hi ? 10 : 4} ${x1},${hi ? 30 : 36} ${x0},${hi ? 36 : 30}`} />;
        })}
        <rect x={10 + n * s} y="4" width="4" height="32" rx="1" />
      </svg>
      <div {...bind} className={c.track} aria-label="Stretch" aria-valuetext={`${Math.round(v * 100)} percent`} style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

function HandFan() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A fan; open it" onClick={flip}>
      <span className={c.fan} data-on={on}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <i key={i} style={{ '--i': i }} />)}
      </span>
    </button>
  );
}

/* ---------- 03 peels and tears ---------- */

function PeelLabel() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A label peeling back to show what is under it" {...bind}>
      <span className={c.stage}>
        <span className={c.label}>
          <i className={c.under}><b>Under</b></i>
          <i className={c.lpart}><b>Label</b></i>
          <i className={c.lpeel} />
        </span>
      </span>
    </button>
  );
}

const STICKERS = ['Star', 'Dot', 'Bolt'];
function StickerSheet() {
  const [gone, setGone] = useState(() => new Set());
  const toggle = (k) => setGone((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  return (
    <div className={c.fig}>
      <div className={c.sheetBox}>
        {STICKERS.map((s, k) => (
          <button key={s} type="button" aria-pressed={gone.has(k)} aria-label={`${s} sticker; peel it off or put it back`} onClick={() => toggle(k)}>
            <i className={c.ghost} />
            <i className={c.sticker} data-gone={gone.has(k)} style={{ '--r': `${(k - 1) * 14}deg` }}>{['A', 'B', 'C'][k]}</i>
          </button>
        ))}
      </div>
    </div>
  );
}

function TearOff() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Calendar page ${14 + n}; tear it off`} onClick={() => setN((v) => v + 1)}>
      <span className={c.stage}>
        <span className={c.cal}>
          <i className={c.page}><b>{14 + n}</b></i>
          {n > 0 ? <i key={n} className={`${c.page} ${c.torn}`}><b>{13 + n}</b></i> : null}
          <u />
        </span>
      </span>
    </button>
  );
}

const FACES = ['One', 'Two', 'Three', 'Four'];
function FaceRoll() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`A rolling sign showing ${FACES[n % 4]}. Roll to the next`} onClick={() => setN((v) => v + 1)}>
      <span className={c.stage}>
        <span className={c.prism} style={{ transform: `rotateX(${-n * 90}deg)` }}>
          {FACES.map((f, i) => <i key={f} style={{ '--i': i }}><b>{f}</b></i>)}
        </span>
      </span>
    </button>
  );
}

function SplitOpen() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A card that splits open down the middle" {...bind}>
      <span className={c.stage}>
        <span className={c.split}>
          <i className={c.core}><b>Open</b></i>
          <i className={c.halfL} /><i className={c.halfR} />
        </span>
      </span>
    </button>
  );
}

function DiagonalFold() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A card with a corner folded across the diagonal" onClick={flip}>
      <span className={c.dg} data-on={on}>
        <i className={c.dgBase}><b>Corner</b></i>
        <i className={c.dgFold} />
      </span>
    </button>
  );
}

function LayerPeel() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Three layers; the top one peels away" {...bind}>
      <span className={c.layers}>
        <i className={c.l3}><b>Three</b></i><i className={c.l2}><b>Two</b></i><i className={c.l1}><b>One</b></i>
      </span>
    </button>
  );
}

function ScrollRoll() {
  const [on, flip] = useToggle(true);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A scroll; roll it up or down" onClick={flip}>
      <span className={c.scroll} data-on={on}>
        <i className={c.roller} />
        <i className={c.paper}><b>Scroll</b><span>unrolls</span></i>
        <i className={c.roller} />
      </span>
    </button>
  );
}

function SpiralPad() {
  const [n, setN] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label="A spiral pad; flip the top sheet" onClick={() => setN((v) => v + 1)}>
      <span className={c.stage}>
        <span className={c.pad}>
          <i className={c.sheetUnder}><b>{n + 2}</b></i>
          <i key={n} className={`${c.sheetTop} ${n ? c.flipUp : ''}`}><b>{n + 1}</b></i>
          <u>{Array.from({ length: 9 }, (_, k) => <s key={k} />)}</u>
        </span>
      </span>
    </button>
  );
}

/* ---------- 04 motion that folds on its own ---------- */

function LeafCycle() {
  return (
    <div className={c.fig} role="img" aria-label="A leaf turning over and over through four faces">
      <div className={c.stage}>
        <div className={c.cycle}>{PN.map((p, i) => <i key={p} style={{ '--i': i }}><b>{p}</b></i>)}</div>
      </div>
    </div>
  );
}

function PageFlipper() {
  return (
    <div className={c.fig} role="img" aria-label="A book turning its pages one after another">
      <div className={c.stage}>
        <div className={c.flipper}>{[0, 1, 2, 3, 4].map((k) => <i key={k} style={{ '--k': k }}><b>{k + 1}</b></i>)}</div>
      </div>
    </div>
  );
}

function WaveFold() {
  return (
    <div className={c.fig} role="img" aria-label="A row of panels folding in a wave">
      <div className={`${c.stage} ${c.waveStage}`}>
        <div className={c.wave}>{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
      </div>
    </div>
  );
}

function TwistRibbon() {
  return (
    <div className={c.fig} role="img" aria-label="A ribbon twisting along its length">
      <div className={`${c.stage} ${c.waveStage}`}>
        <div className={c.ribbon}>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
      </div>
    </div>
  );
}

function Pleats() {
  return (
    <div className={c.fig} role="img" aria-label="Pleated paper that breathes in and out">
      <div className={`${c.stage} ${c.waveStage}`}>
        <div className={c.pleats}>{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
      </div>
    </div>
  );
}

const SQUARES = ['Square', 'Triangle', 'Small triangle', 'Kite'];
function PaperSteps() {
  const [k, setK] = useState(0);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-label={`Paper fold step ${k + 1}: ${SQUARES[k]}. Fold again`} onClick={() => setK((x) => (x + 1) % SQUARES.length)}>
      <span className={c.steps}><i data-k={k} /><u /></span>
      <span className={c.cap}>{k + 1} / 4 · {SQUARES[k]}</span>
    </button>
  );
}

function FoldAngle() {
  const [v, bind] = useDrag({ mode: 'x', init: 0.35 });
  return (
    <div className={c.fig}>
      <div className={c.stage}>
        <div className={c.hinge} style={{ '--a': (v * 175).toFixed(1) }}>
          <i className={c.hl}><b>Left</b></i>
          <i className={c.hr}><b>Right</b></i>
        </div>
      </div>
      <div {...bind} className={c.track} aria-label="Fold angle" aria-valuetext={`${Math.round(v * 175)} degrees`} style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

function BookEdge() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="Stacked pages that fan out" {...bind}>
      <span className={c.edge}>{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
    </button>
  );
}

function CardWallet() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A wallet; slide the card out" onClick={flip}>
      <span className={c.wallet} data-on={on}>
        <i className={c.wcard}><b>Card</b></i>
        <i className={c.wfront}><b>Wallet</b></i>
      </span>
    </button>
  );
}

function PocketReveal() {
  const [hot, bind] = useHot();
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} data-hot={hot} aria-pressed={hot} aria-label="A card sliding out of a sleeve" {...bind}>
      <span className={c.sleeve}>
        <i className={c.scard}><b>Inside</b></i>
        <i className={c.sfront} />
      </span>
    </button>
  );
}

function Perforation() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A coupon with a perforated end; tear it off" onClick={flip}>
      <span className={c.coupon} data-on={on}>
        <i className={c.cmain}><b>Coupon</b></i>
        <i className={c.cstub}><b>Stub</b></i>
      </span>
    </button>
  );
}

function Clamshell() {
  const [on, flip] = useToggle(false);
  return (
    <button type="button" className={`${c.fig} ${c.reset}`} aria-pressed={on} aria-label="A clamshell case; open it" onClick={flip}>
      <span className={c.stage}>
        <span className={c.shell} data-on={on}>
          <i className={c.base}><b>Screen</b></i>
          <i className={c.lid}><b>Lid</b></i>
        </span>
      </span>
    </button>
  );
}

export default {
  Visual,
  items: [
    ['Flip over', FlipOver, 'hover'], ['Flip up', FlipUp, 'hover'], ['Diagonal flip', DiagonalFlip, 'click'], ['Twin flip', TwinFlip, 'hover'],
    ['Flip deck', FlipDeck, 'click'], ['Flip tiles', FlipTiles, 'hover'], ['Accordion fold', AccordionFold, 'click'], ['Letter fold', LetterFold, 'click'],
    ['Tri-fold', TriFold, 'click'], ['Advent doors', AdventDoors, 'click'], ['Peel corner', PeelCorner, 'hover'], ['Envelope', Envelope, 'click'],
    ['Notebook spread', NotebookSpread, 'click'], ['Page turn', PageTurn, 'click'], ['Shutters', Shutters, 'hover'], ['Blinds', Blinds, 'hover'],
    ['Curtain', Curtain, 'click'], ['Garage door', GarageDoor, 'click'], ['Fold-down', FoldDown, 'click'], ['Bellows', Bellows, 'drag'],
    ['Hand fan', HandFan, 'click'], ['Peel label', PeelLabel, 'hover'], ['Sticker sheet', StickerSheet, 'click'], ['Tear off', TearOff, 'click'],
    ['Face roll', FaceRoll, 'click'], ['Split open', SplitOpen, 'hover'], ['Diagonal fold', DiagonalFold, 'click'], ['Layer peel', LayerPeel, 'hover'],
    ['Scroll roll', ScrollRoll, 'click'], ['Spiral pad', SpiralPad, 'click'], ['Leaf cycle', LeafCycle, 'auto'], ['Page flipper', PageFlipper, 'auto'],
    ['Wave fold', WaveFold, 'auto'], ['Twist ribbon', TwistRibbon, 'auto'], ['Pleats', Pleats, 'auto'], ['Paper steps', PaperSteps, 'click'],
    ['Fold angle', FoldAngle, 'drag'], ['Book edge', BookEdge, 'hover'], ['Card wallet', CardWallet, 'click'], ['Pocket reveal', PocketReveal, 'hover'],
    ['Perforation', Perforation, 'click'], ['Clamshell', Clamshell, 'click'],
  ],
};
