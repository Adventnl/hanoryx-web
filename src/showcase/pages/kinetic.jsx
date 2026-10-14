import { useEffect, useId, useState } from 'react';
import { useDrag, useTick } from '../hooks';
import { useHot, useScan, usePoint, polar } from '../kit';
import c from './kinetic.module.css';

/* ============================================================
   11 · KINETIC — words that scramble, split and settle.
   The still side is one enormous letter. As you scroll it steps through the
   alphabet, and between two letters each is cut in half across the middle: the
   halves slide apart in opposite directions as one fades out and the next slides
   together. The numbers that drive it are the page's --f, read by CSS.
   Everything below is a line of moving type; the ones that react to the pointer
   work from the keyboard too.
   ============================================================ */

const ALPHA = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
function Visual() {
  return (
    <div className={c.giant} aria-hidden="true">
      {ALPHA.map((ch, k) => <span key={ch} className={c.letter} style={{ '--k': k }}><i>{ch}</i><i>{ch}</i></span>)}
      <p className={c.tag}>A <u /> Z</p>
    </div>
  );
}

/* the letters of a word, each knowing its place in it */
const chars = (text) => [...text].map((ch, i) => <span key={i} style={{ '--i': i }}>{ch === ' ' ? ' ' : ch}</span>);

/* 1 */ const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@';
const PHRASE = 'DECODE THE SIGNAL';
function ScrambleReveal() {
  const [hot, h] = useHot();
  const [frame, setFrame] = useState(99);
  useEffect(() => {
    if (!hot) return undefined;
    let f = 0;
    const id = window.setInterval(() => { f += 1; setFrame(f); if (f > 46) window.clearInterval(id); }, 38);
    return () => window.clearInterval(id);
  }, [hot]);
  const shown = hot ? frame : 99;
  const text = [...PHRASE].map((ch, i) => (ch === ' ' || shown > 5 + i * 2 ? ch : GLYPHS[(shown * 31 + i * 17) % GLYPHS.length])).join('');
  return <div className={c.fig}><button type="button" className={c.scr} aria-label={`${PHRASE}. Hover to decode it`} {...h}>{text}</button></div>;
}

/* 2 */ function LetterSplit() {
  const [hot, h] = useHot();
  return (
    <div className={c.fig}>
      <button type="button" className={c.splitWord} data-hot={hot} aria-label="Split. Hover to pull the letters apart" {...h}>
        {[...'SPLIT'].map((ch, i) => <b key={i} style={{ '--i': i }} aria-hidden="true"><i>{ch}</i><i>{ch}</i></b>)}
      </button>
    </div>
  );
}

/* 3 */ function WaveText() {
  return <div className={c.fig} role="img" aria-label="Waveform"><p className={c.wave}>{chars('WAVEFORM')}</p></div>;
}

/* 4 */ const LINES = ['Type with intent.', 'Delete with care.', 'Begin again.'];
const CYCLE = LINES.map((l) => l.length * 2 + 22);
const CYCLE_SUM = CYCLE.reduce((a, b) => a + b, 0);
function Typewriter() {
  const t = useTick(75);
  let k = t % CYCLE_SUM;
  let line = 0;
  while (k >= CYCLE[line]) { k -= CYCLE[line]; line += 1; }
  const len = LINES[line].length;
  const n = k < len ? k : k < len + 16 ? len : Math.max(0, len - (k - len - 16));
  return (
    <div className={c.fig} role="img" aria-label="A line of text typing and deleting itself">
      <p className={c.type}>{LINES[line].slice(0, n)}<i /></p>
    </div>
  );
}

/* 5 */ function RollHover() {
  const [hot, h] = useHot();
  return (
    <div className={c.fig}>
      <button type="button" className={c.roll} data-hot={hot} aria-label="Roll. Hover to roll the letters over" {...h}>
        {[...'ROLL OVER'].map((ch, i) => <b key={i} style={{ '--i': i }} aria-hidden="true"><i>{ch === ' ' ? ' ' : ch}</i><i>{ch === ' ' ? ' ' : ch}</i></b>)}
      </button>
    </div>
  );
}

/* 6 */ function BlurIn() {
  return (
    <div className={c.fig} role="img" aria-label="Quiet things arrive slowly">
      <p className={c.blur}>{['Quiet', 'things', 'arrive', 'slowly'].map((w, i) => <span key={w} style={{ '--i': i }}>{w}</span>)}</p>
    </div>
  );
}

/* 7 */ function StaggerRise() {
  const [n, setN] = useState(0);
  return (
    <div className={c.fig}>
      <button type="button" className={c.rise} aria-label="Stagger rise. Click to play it again" onClick={() => setN(n + 1)}>
        {['Rise', 'from', 'below'].map((w, i) => <span key={`${n}-${w}`}><i style={{ '--i': i }}>{w}</i></span>)}
      </button>
    </div>
  );
}

/* 8 */ function StrokeSwell() {
  const [i, bind] = useScan(8, { label: (k) => `Letter ${k + 1}` });
  return (
    <div className={c.fig}>
      <p className={c.swell} {...bind} aria-label="Stroke swell, move along the word" style={{ ...bind.style, '--px': i < 0 ? -9 : i }}>{chars('OUTLINES')}</p>
    </div>
  );
}

/* 9 */ function MagnetLetters() {
  const [i, bind] = useScan(7, { label: (k) => `Letter ${k + 1}` });
  return (
    <div className={c.fig}>
      <p className={c.magnet} {...bind} aria-label="Magnet letters, move along the word" style={{ ...bind.style, '--px': i < 0 ? -9 : i }}>{chars('MAGNETS')}</p>
    </div>
  );
}

/* 10 */ function GradientSweep() {
  return <div className={c.fig}><p className={c.sweep}>Sweep of light</p></div>;
}

/* 11 */ function OutlineFill() {
  const [hot, h] = useHot();
  return (
    <div className={c.fig}>
      <button type="button" className={c.outline} data-hot={hot} aria-label="Fill. Hover to fill the outline" {...h}>
        <span>FILL</span><span aria-hidden="true">FILL</span>
      </button>
    </div>
  );
}

/* 12 */ function Glitch() {
  return <div className={c.fig} role="img" aria-label="Glitch"><b className={c.glitch} data-text="GLITCH" aria-hidden="true">GLITCH</b></div>;
}

/* 13 */ function NeonFlicker() {
  return <div className={c.fig} role="img" aria-label="Open"><b className={c.neon} aria-hidden="true">{chars('OPEN')}</b></div>;
}

/* 14 */ function SpotlightReveal() {
  const [p, bind] = usePoint();
  return (
    <div className={c.fig}>
      <div className={c.spot} {...bind} aria-label="Spotlight reveal, move over it to light the words" style={{ ...bind.style, '--x': `${p ? p.x : -40}%`, '--y': `${p ? p.y : 50}%` }}>
        <span>Hidden in plain sight</span>
        <span aria-hidden="true">Hidden in plain sight</span>
      </div>
    </div>
  );
}

/* 15 */ function KerningBreathe() {
  return <div className={c.fig} role="img" aria-label="Breathe"><p className={c.breathe}>BREATHE</p></div>;
}

/* 16 */ const SCATTER = [[-34, -22, -8], [26, -30, 6], [-18, 26, 10], [36, 20, -5], [-4, -4, 12]];
function ScatterWords() {
  const [apart, setApart] = useState(true);
  return (
    <div className={c.fig}>
      <button type="button" className={c.scatter} aria-pressed={apart} aria-label="Scatter words, click to scatter or gather them" onClick={() => setApart(!apart)}>
        {['Words', 'drift', 'apart', 'and', 'return'].map((w, i) => <span key={w} style={{ '--x': `${SCATTER[i][0]}px`, '--y': `${SCATTER[i][1]}px`, '--r': `${SCATTER[i][2]}deg`, '--i': i }} data-apart={apart}>{w}</span>)}
      </button>
    </div>
  );
}

/* 17 */ function CircleText() {
  const id = `ct${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.fig} role="img" aria-label="Round and round, written around a circle">
      <svg className={c.circleSvg} viewBox="0 0 100 100" aria-hidden="true">
        <defs><path id={id} d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0" /></defs>
        <g className={c.spin}><text><textPath href={`#${id}`} textLength="224">ROUND AND ROUND AND ROUND ·</textPath></text></g>
        <circle cx="50" cy="50" r="3" className={c.dotR} />
      </svg>
    </div>
  );
}

/* 18 */ const WAVE_D = (() => {
  let d = 'M-60 40';
  for (let k = 0; k < 8; k += 1) d += `q15-24 30 0t30 0`;
  return d;
})();
function WavyPath() {
  const id = `wp${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.fig} role="img" aria-label="Text riding a wave">
      <svg className={c.waveSvg} viewBox="0 0 160 80" aria-hidden="true">
        <defs><path id={id} d={WAVE_D} /></defs>
        <g className={c.ride}><text><textPath href={`#${id}`}>on the crest of a long wave on the crest of a long wave on the crest</textPath></text></g>
      </svg>
    </div>
  );
}

/* 19 */ function StackSlam() {
  const [n, setN] = useState(0);
  return (
    <div className={c.fig}>
      <button type="button" className={c.slam} aria-label="Stack slam. Click to slam the words in again" onClick={() => setN(n + 1)}>
        {['STACK', 'THE', 'TYPE'].map((w, i) => <b key={`${n}-${w}`} style={{ '--i': i }}>{w}</b>)}
      </button>
    </div>
  );
}

/* 20 */ const RING = 'ROTATE WITH THE WORLD · ';
function RingLetters() {
  return (
    <div className={c.fig} role="img" aria-label="Letters turning in a ring">
      <div className={c.ring}>
        {[...RING].map((ch, i) => <span key={i} style={{ '--a': `${(i / RING.length) * 360}deg` }}>{ch === ' ' ? ' ' : ch}</span>)}
        <b>R</b>
      </div>
    </div>
  );
}

/* 21 */ function WordSwap() {
  return (
    <div className={c.fig} role="img" aria-label="We make things, rooms, noise, maps">
      <p className={c.swap}>We make <span><b>things</b><b>rooms</b><b>noise</b><b>maps</b><b>things</b></span></p>
    </div>
  );
}

/* 22 */ function UnderlineDraw() {
  return (
    <div className={c.fig}>
      <p className={c.unders}>
        {['grow', 'centre', 'marker'].map((w) => <button key={w} type="button" data-u={w}>{w}</button>)}
      </p>
    </div>
  );
}

/* 23 */ function FlipWords() {
  return (
    <div className={c.fig} role="img" aria-label="Flip, then flop">
      <p className={c.flip}><span><b>FLIP</b><b>FLOP</b></span></p>
    </div>
  );
}

/* 24 */ function BounceLetters() {
  const [hot, h] = useHot();
  return (
    <div className={c.fig}>
      <button type="button" className={c.bounce} data-hot={hot} aria-label="Bounce. Hover to bounce the letters" {...h}>{chars('BOUNCE')}</button>
    </div>
  );
}

/* 25 */ function StretchWord() {
  const [v, bind] = useDrag({ init: 0.3 });
  return (
    <div className={c.fig}>
      <p className={c.stretch} style={{ '--v': v }}><span>ELASTIC</span></p>
      <div className={c.slide} {...bind} aria-label="Stretch, drag to pull the word" style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

/* 26 */ function FisheyeText() {
  const [i, bind] = useScan(9, { label: (k) => `Letter ${k + 1}` });
  return (
    <div className={c.fig}>
      <p className={c.fish} {...bind} aria-label="Fisheye text, move along the word" style={{ ...bind.style, '--px': i < 0 ? -9 : i }}>{chars('FISHEYE ON')}</p>
    </div>
  );
}

/* 27 */ function SlantDial() {
  const [v, bind] = useDrag({ init: 0.62 });
  return (
    <div className={c.fig}>
      <p className={c.slant} style={{ '--v': v }}>SLANT</p>
      <div className={c.slide} {...bind} aria-label="Slant, drag to lean the word" style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

/* 28 */ const ANAGRAM = [2, 1, 0, 5, 3, 4];
function AnagramShuffle() {
  const [on, setOn] = useState(false);
  return (
    <div className={c.fig}>
      <button type="button" className={c.anagram} aria-label={`Anagram shuffle, showing ${on ? 'SILENT' : 'LISTEN'}. Click to rearrange`} onClick={() => setOn(!on)}>
        {[...'LISTEN'].map((ch, i) => <span key={ch} style={{ '--x': on ? ANAGRAM[i] : i }}>{ch}</span>)}
      </button>
    </div>
  );
}

/* 29 */ function PopIn() {
  const [text, setText] = useState('hello');
  return (
    <div className={c.fig}>
      <input className={c.input} value={text} maxLength={14} aria-label="Type to pop letters in" onChange={(e) => setText(e.target.value)} />
      <p className={c.pop} aria-hidden="true">{[...text].map((ch, i) => <span key={`${i}-${ch}`}>{ch === ' ' ? ' ' : ch}</span>)}</p>
    </div>
  );
}

/* 30 */ function EchoTrail() {
  const [p, bind] = usePoint();
  const dx = p ? (p.x - 50) * 0.5 : 0;
  const dy = p ? (p.y - 50) * 0.5 : 0;
  return (
    <div className={c.fig}>
      <div className={c.echo} {...bind} aria-label="Echo trail, move over it to drag the echoes" style={{ ...bind.style, '--dx': `${dx.toFixed(1)}px`, '--dy': `${dy.toFixed(1)}px` }}><b>ECHO</b></div>
    </div>
  );
}

/* 31 */ function MirrorRipple() {
  return (
    <div className={c.fig} role="img" aria-label="Mirror, reflected in water">
      <div className={c.mirror}><b>MIRROR</b><b aria-hidden="true">MIRROR</b></div>
    </div>
  );
}

/* 32 */ function StrokeWrite() {
  return (
    <div className={c.fig} role="img" aria-label="Write, drawn letter by letter">
      <svg className={c.writeSvg} viewBox="0 0 120 40" aria-hidden="true">
        {[...'WRITE'].map((ch, i) => <text key={i} className={c.writeText} x={12 + i * 24} y="31" style={{ '--i': i }}>{ch}</text>)}
      </svg>
    </div>
  );
}

/* 33 */ function CipherCycle() {
  const t = useTick(55) % 90;
  const word = 'CIPHER';
  return (
    <div className={c.fig} role="img" aria-label="Cipher, letters cycling until they settle">
      <p className={c.cipher}>{[...word].map((ch, i) => <span key={i} data-done={t > 14 + i * 7 || t > 60}>{t > 14 + i * 7 || t > 60 ? ch : GLYPHS[(t * 5 + i * 11) % 26]}</span>)}</p>
    </div>
  );
}

/* 34 */ function DepthLayers() {
  const [p, bind] = usePoint();
  const dx = p ? (p.x - 50) / 50 : 0;
  const dy = p ? (p.y - 50) / 50 : 0;
  return (
    <div className={c.fig}>
      <div className={c.depth} {...bind} aria-label="Depth layers, move over it to shift the layers" style={{ ...bind.style, '--dx': dx, '--dy': dy }}>
        {[4, 3, 2, 1, 0].map((z) => <b key={z} style={{ '--z': z }} aria-hidden={z !== 0}>DEPTH</b>)}
      </div>
    </div>
  );
}

/* 35 */ function LiquidWobble() {
  const id = `lw${useId().replace(/\W/g, '')}`;
  return (
    <div className={c.fig} role="img" aria-label="Liquid, wobbling">
      <svg className={c.liquidSvg} viewBox="0 0 160 60" aria-hidden="true">
        <defs>
          <filter id={id}>
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="2" result="n"><animate attributeName="baseFrequency" values="0.012 0.05;0.02 0.07;0.012 0.05" dur="7s" repeatCount="indefinite" /></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
          </filter>
        </defs>
        <text x="80" y="44" textAnchor="middle" filter={`url(#${id})`} className={c.liquidText}>LIQUID</text>
      </svg>
    </div>
  );
}

/* 36 */ const GRID_WORD = 'KINETICTYPEMOVESNOW';
function LetterGrid() {
  return (
    <div className={c.fig} role="img" aria-label="A grid of letters turning over, one after another">
      <div className={c.lgrid}>{[...GRID_WORD.padEnd(20, '·')].map((ch, i) => <span key={i} style={{ '--i': i }}>{ch}</span>)}</div>
    </div>
  );
}

/* 37 */ function LetterBurst() {
  const [n, setN] = useState(0);
  return (
    <div className={c.fig}>
      <button type="button" className={c.burst} aria-label="Burst. Click to scatter the letters outward" onClick={() => setN(n + 1)}>
        {[...'BURST'].map((ch, i) => { const [x, y] = polar(0, 0, 70, i * 72 + 30); return <span key={`${n}-${i}`} className={n ? c.burstGo : undefined} style={{ '--x': `${x}px`, '--y': `${y}px`, '--r': `${(i - 2) * 40}deg` }}>{ch}</span>; })}
      </button>
    </div>
  );
}

/* 38 */ const DROPS = [0.9, 0.5, 1.2, 0.7, 1.05, 0.6];
function LetterDrop() {
  const [down, setDown] = useState(false);
  return (
    <div className={c.fig}>
      <button type="button" className={c.drop} aria-pressed={down} aria-label="Letter drop. Click to drop the letters or pick them up" onClick={() => setDown(!down)}>
        {[...'GRAVITY'.slice(0, 6)].map((ch, i) => <span key={i} data-down={down} style={{ '--d': `${DROPS[i]}s`, '--r': `${(i % 2 ? 1 : -1) * (8 + i * 6)}deg` }}>{ch}</span>)}
      </button>
    </div>
  );
}

/* 39 */ function TrackingIn() {
  return <div className={c.fig} role="img" aria-label="Closer"><p className={c.tracking}>CLOSER</p></div>;
}

/* 40 */ function ZoomThrough() {
  const [hot, h] = useHot();
  return (
    <div className={c.fig}>
      <button type="button" className={c.zoom} data-hot={hot} aria-label="Zoom through. Hover to fly through the word" {...h}><span>THROUGH</span></button>
    </div>
  );
}

/* 41 */ function SliceSlide() {
  const [hot, h] = useHot();
  return (
    <div className={c.fig}>
      <button type="button" className={c.slice} data-hot={hot} aria-label="Slice. Hover to slide the slices" {...h}>
        {[0, 1, 2, 3].map((k) => <span key={k} style={{ '--k': k }} aria-hidden={k !== 0}>SLICE</span>)}
      </button>
    </div>
  );
}

/* 42 */ function KaraokeWords() {
  return (
    <div className={c.fig} role="img" aria-label="Follow the words as they light up">
      <p className={c.karaoke}>{['Follow', 'the', 'words', 'as', 'they', 'light', 'up'].map((w, i) => <span key={w} style={{ '--i': i }}>{w} </span>)}</p>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Scramble reveal', ScrambleReveal, 'hover'], ['Letter split', LetterSplit, 'hover'], ['Wave text', WaveText, 'auto'], ['Typewriter', Typewriter, 'auto'],
    ['Roll hover', RollHover, 'hover'], ['Blur in', BlurIn, 'auto'], ['Stagger rise', StaggerRise, 'click'], ['Stroke swell', StrokeSwell, 'hover'],
    ['Magnet letters', MagnetLetters, 'hover'], ['Gradient sweep', GradientSweep, 'auto'], ['Outline fill', OutlineFill, 'hover'], ['Glitch', Glitch, 'auto'],
    ['Neon flicker', NeonFlicker, 'auto'], ['Spotlight reveal', SpotlightReveal, 'hover'], ['Kerning breathe', KerningBreathe, 'auto'], ['Scatter words', ScatterWords, 'click'],
    ['Circle text', CircleText, 'auto'], ['Wavy path', WavyPath, 'auto'], ['Stack slam', StackSlam, 'click'], ['Ring letters', RingLetters, 'auto'],
    ['Word swap', WordSwap, 'auto'], ['Underline draw', UnderlineDraw, 'hover'], ['Flip words', FlipWords, 'auto'], ['Bounce letters', BounceLetters, 'hover'],
    ['Stretch word', StretchWord, 'drag'], ['Fisheye text', FisheyeText, 'hover'], ['Slant dial', SlantDial, 'drag'], ['Anagram shuffle', AnagramShuffle, 'click'],
    ['Pop in', PopIn, 'type'], ['Echo trail', EchoTrail, 'hover'], ['Mirror ripple', MirrorRipple, 'auto'], ['Stroke write', StrokeWrite, 'auto'],
    ['Cipher cycle', CipherCycle, 'auto'], ['Depth layers', DepthLayers, 'hover'], ['Liquid wobble', LiquidWobble, 'auto'], ['Letter grid', LetterGrid, 'auto'],
    ['Letter burst', LetterBurst, 'click'], ['Letter drop', LetterDrop, 'click'], ['Tracking in', TrackingIn, 'auto'], ['Zoom through', ZoomThrough, 'hover'],
    ['Slice slide', SliceSlide, 'hover'], ['Karaoke words', KaraokeWords, 'auto'],
  ],
};
