import { useEffect, useState } from 'react';
import { useDrag } from '../hooks';
import { Ico } from '../icons';
import c from './loaders.module.css';

/* ============================================================
   26 · LOADERS — forty ways to wait.
   Nearly everything here runs by itself, and only while it is on screen (the
   specimen frame pauses every animation that is off-screen). The still side is
   a core with five rings that the scroll turns at five speeds, so the page
   itself is the thing being waited on.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((k) => <i key={k} style={{ '--k': k }}><b /></i>)}
      <s />
      <small>5 RINGS · 1 CORE</small>
    </div>
  );
}

const dots = (n) => Array.from({ length: n }, (_, k) => <i key={k} style={{ '--k': k }} />);
const status = (label) => ({ role: 'img', 'aria-label': label });

/* 1 */ function Ring() { return <span className={c.ring} {...status('Loading')} />; }
/* 2 */ function DualRing() { return <span className={c.dual} {...status('Loading')}><i /><i /></span>; }
/* 3 */ function Bounce() { return <span className={c.bounce} {...status('Loading')}>{dots(3)}</span>; }
/* 4 */ function Wave() { return <span className={c.wave} {...status('Loading')}>{dots(6)}</span>; }
/* 5 */ function Equalizer() { return <span className={c.eq} {...status('Loading')}>{dots(5)}</span>; }
/* 6 */ function Ripple() { return <span className={c.ripple} {...status('Loading')}><i /><i /></span>; }
/* 7 */ function Orbit() { return <span className={c.orbit} {...status('Loading')}>{dots(3)}</span>; }

/* 8 */ function Clock() { return <span className={c.clock} {...status('Loading')}><i /><b /></span>; }
/* 9 */ function Hourglass() { return <span className={c.glass} {...status('Loading')}><i /></span>; }
/* 10 */ function Arc() { return <svg className={c.arc} viewBox="0 0 50 50" {...status('Loading')}><circle cx="25" cy="25" r="20" /></svg>; }
/* 11 */ function Squares() { return <span className={c.squares} {...status('Loading')}>{dots(2)}</span>; }
/* 12 */ function Cube() { return <span className={c.cube} {...status('Loading')}>{dots(6)}</span>; }
/* 13 */ function FlipCard() { return <span className={c.flip} {...status('Loading')}><i /></span>; }
/* 14 */ function Typing() { return <span className={c.typing} {...status('Someone is typing')}>{dots(3)}</span>; }

/* 15 */ function Heartbeat() {
  return <svg className={c.beat} viewBox="0 0 120 40" {...status('Loading')}><path d="M0 22h34l6-14 8 28 7-20 5 6h60" /></svg>;
}
/* 16 */ function Helix() { return <span className={c.helix} {...status('Loading')}>{dots(8)}</span>; }
/* 17 */ function Cradle() { return <span className={c.cradle} {...status('Loading')}>{dots(5)}</span>; }
/* 18 */ function Gears() {
  return (
    <svg className={c.gears} viewBox="0 0 80 50" {...status('Loading')}>
      <g className={c.g1}><circle cx="26" cy="25" r="12" /><path d="M26 9v6M26 35v6M10 25h6M36 25h6M14.7 13.7l4.2 4.2M33.1 32.1l4.2 4.2M14.7 36.3l4.2-4.2M33.1 17.9l4.2-4.2" /></g>
      <g className={c.g2}><circle cx="54" cy="25" r="9" /><path d="M54 13v4M54 33v4M42 25h4M62 25h4M45.5 16.5l2.8 2.8M59.7 30.7l2.8 2.8M45.5 33.5l2.8-2.8M59.7 19.3l2.8-2.8" /></g>
    </svg>
  );
}
/* 19 */ function Battery() { return <span className={c.battery} {...status('Charging')}><i /></span>; }
/* 20 */ function LoadingDots() { return <span className={c.words} {...status('Loading')}>Loading<b>.</b><b>.</b><b>.</b></span>; }
/* 21 */ function LetterWave() { return <span className={c.letters} {...status('Loading')}>{'LOADING'.split('').map((l, k) => <i key={k} style={{ '--k': k }}>{l}</i>)}</span>; }
/* 22 */ function Chase() { return <span className={c.chase} {...status('Loading')}><i />{dots(3)}</span>; }
/* 23 */ function Roller() { return <span className={c.roller} {...status('Loading')}><i /></span>; }
/* 24 */ function Ball() { return <span className={c.ball} {...status('Loading')}><i /><b /></span>; }
/* 25 */ function Windmill() { return <span className={c.mill} {...status('Loading')}><i /><i /><i /><i /></span>; }
/* 26 */ function Planet() { return <span className={c.planet} {...status('Loading')}><i /><b /></span>; }
/* 27 */ function Grid9() { return <span className={c.grid9} {...status('Loading')}>{dots(9)}</span>; }
/* 28 */ function HexSpin() { return <span className={c.hex} {...status('Loading')}><i /></span>; }
/* 29 */ function Lemniscate() {
  return <svg className={c.inf} viewBox="0 0 80 40" {...status('Loading')}><path d="M40 20C52 4 72 4 72 20S52 36 40 20 28 4 8 4 8 36 40 20Z" pathLength="1" /></svg>;
}
/* 30 */ function Spiral() { return <span className={c.spiral} {...status('Loading')}>{dots(10)}</span>; }
/* 31 */ function Ink() { return <span className={c.ink} {...status('Loading')}><i /><i /><i /></span>; }
/* 32 */ function Liquid() { return <span className={c.liquid} {...status('Loading')}><i /></span>; }
/* 33 */ function Fuse() { return <span className={c.fuse} {...status('Loading')}><i /><b /></span>; }
/* 34 */ function Elastic() { return <span className={c.elastic} {...status('Loading')}><i /></span>; }
/* 35 */ function Segments() { return <span className={c.segs} {...status('Loading')}>{dots(8)}</span>; }
/* 36 */ function Morph() { return <span className={c.morph} {...status('Loading')}><i /><i /></span>; }
/* 37 */ function Pendulum() { return <span className={c.pend} {...status('Loading')}><i /></span>; }
/* 38 */ function Reels() { return <span className={c.reels} {...status('Loading')}><i /><i /><b /></span>; }
/* 39 */ function Race() { return <span className={c.race} {...status('Loading')}>{dots(4)}</span>; }

/* 40 */ function Percent() {
  return <span className={c.pct} {...status('Loading')}><i /></span>;
}

/* the specimens below are the ones you can press */

/* 41 */ function ButtonLoader() {
  const [s, setS] = useState('idle');
  useEffect(() => {
    if (s !== 'busy') return undefined;
    const id = setTimeout(() => setS('done'), 1800);
    return () => clearTimeout(id);
  }, [s]);
  return (
    <button type="button" className={c.btn} data-s={s} aria-busy={s === 'busy'} onClick={() => setS('busy')} disabled={s === 'busy'}>
      {s === 'idle' && 'Send'}
      {s === 'busy' && <><i aria-hidden="true" />Sending</>}
      {s === 'done' && <><Ico n="check" />Sent</>}
    </button>
  );
}

/* 42 */ function PullRefresh() {
  const [v, bind, set] = useDrag({ mode: 'y', init: 1 });
  const [busy, setBusy] = useState(false);
  const pull = 1 - v;
  useEffect(() => {
    if (!busy) return undefined;
    const id = setTimeout(() => { setBusy(false); set(1); }, 1400);
    return () => clearTimeout(id);
  }, [busy, set]);
  return (
    <div className={c.pull}>
      <div className={c.pullHead} style={{ '--p': busy ? 0.7 : Math.min(pull * 1.6, 1) }} data-busy={busy} aria-live="polite">
        <i aria-hidden="true" /><span>{busy ? 'Refreshing' : pull > 0.62 ? 'Release' : 'Pull down'}</span>
      </div>
      <div
        className={c.pullHandle}
        {...bind}
        aria-label="Pull to refresh, drag down or press the down arrow past the end"
        onPointerUp={() => { if (pull > 0.62) setBusy(true); else set(1); }}
        onKeyUp={(e) => { if (e.key === 'ArrowDown' && pull > 0.62) setBusy(true); }}
        style={{ ...bind.style, '--p': busy ? 0.7 : Math.min(pull * 1.6, 1) }}
      ><u /></div>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Ring spinner', Ring, 'auto'], ['Twin ring', DualRing, 'auto'], ['Bouncing dots', Bounce, 'auto'], ['Dot wave', Wave, 'auto'],
    ['Equaliser bars', Equalizer, 'auto'], ['Ripple pulse', Ripple, 'auto'], ['Orbiting dots', Orbit, 'auto'], ['Clock hands', Clock, 'auto'],
    ['Sand timer', Hourglass, 'auto'], ['Chasing arc', Arc, 'auto'], ['Square swap', Squares, 'auto'], ['Spinning cube', Cube, 'auto'],
    ['Flip loader', FlipCard, 'auto'], ['Typing dots', Typing, 'auto'], ['Heartbeat line', Heartbeat, 'auto'], ['Helix dots', Helix, 'auto'],
    ['Newton cradle', Cradle, 'auto'], ['Meshing gears', Gears, 'auto'], ['Charging cell', Battery, 'auto'], ['Loading word', LoadingDots, 'auto'],
    ['Letter wave', LetterWave, 'auto'], ['Dot chase', Chase, 'auto'], ['Rolling bar', Roller, 'auto'], ['Bouncing ball', Ball, 'auto'],
    ['Windmill', Windmill, 'auto'], ['Little planet', Planet, 'auto'], ['Nine grid', Grid9, 'auto'], ['Hex spin', HexSpin, 'auto'],
    ['Lemniscate', Lemniscate, 'auto'], ['Dot spiral', Spiral, 'auto'], ['Ink drops', Ink, 'auto'], ['Rising liquid', Liquid, 'auto'],
    ['Burning fuse', Fuse, 'auto'], ['Elastic bar', Elastic, 'auto'], ['Segment ring spin', Segments, 'auto'], ['Plus morph', Morph, 'auto'],
    ['Pendulum', Pendulum, 'auto'], ['Tape reels', Reels, 'auto'], ['Dot race', Race, 'auto'], ['Counting up', Percent, 'auto'],
    ['Button loader', ButtonLoader, 'click'], ['Pull to refresh', PullRefresh, 'drag'],
  ],
};
