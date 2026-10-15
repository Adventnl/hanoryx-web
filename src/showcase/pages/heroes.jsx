import { useState } from 'react';
import { pad2, useCycle, useLive, useTick } from '../hooks';
import { usePointer } from '../pointerVars';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Ico } from '../icons';
import c from './heroes.module.css';

/* ============================================================
   50 · HEROES — opening screens, bands and endings.
   The still side is one hero that re-lays itself out as the scroll advances:
   the headline slides left while a shape grows in on the right and the button
   settles beneath. The forty-two specimens are layouts of the same kind, drawn
   small: openings of every shape, the bands that sit between sections, and the
   endings that close a page. Each has one thing you can do to it (press,
   type, hover, switch) or does something by itself while on screen.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visScreen}>
        <span className={c.visNav}><i /><s /><s /><s /></span>
        <h3>Build calm<br />systems.</h3>
        <p />
        <span className={c.visBtn} />
        <span className={c.visArt} />
      </div>
      <small>1 HEADLINE · 1 SHAPE · 1 BUTTON</small>
    </div>
  );
}

const cx = (...a) => a.filter(Boolean).join(' ');
const Sc = ({ label, className, children, ...r }) => <div className={cx(c.sc, className)} role="group" aria-label={label} {...r}>{children}</div>;
const Nav = () => <span className={c.nav}><i /><s /><s /><s /></span>;
const Cta = ({ children = 'Get started', ...p }) => <button type="button" className={c.cta} {...p}>{children}</button>;

/* typed text that loops while on screen, and just sits there otherwise */
function useTyped(text, ms = 110, hold = 12) {
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const n = useTick(ms);
  if (reduced || !live) return text;
  return text.slice(0, n % (text.length + hold));
}

/* 01 */ function Centered() {
  const [d, setD] = useState(false);
  return <Sc label="Centred hero" className={c.cen}><Nav /><h3>Build calm systems</h3><p>Software that stays out of your way.</p><Cta onClick={() => setD((v) => !v)}>{d ? 'Thank you' : 'Get started'}</Cta></Sc>;
}

/* 02 */ function Side() {
  return <Sc label="Text and art" className={c.side}><Nav /><div><h3>Ship faster, sleep better</h3><p>One place for the work.</p><Cta>Try it</Cta></div><span className={c.shape1} /></Sc>;
}

/* 03 */ function Halves() {
  return <Sc label="Split hero" className={c.halves}><div><h3>Made to last</h3><p>Built with care.</p><Cta>See work</Cta></div><span /></Sc>;
}

/* 04 */ function Overlay() {
  return <Sc label="Full-bleed hero" className={c.overlay}><span className={c.photo} /><div><small>New season</small><h3>Out in the open</h3></div></Sc>;
}

/* 05 */ function VideoHero() {
  const [on, setOn] = useState(false);
  return (
    <Sc label="Video hero" className={c.video}>
      <span className={c.photo} data-on={on} />
      <button type="button" className={c.play} aria-pressed={on} aria-label={on ? 'Pause the film' : 'Play the film'} onClick={() => setOn((v) => !v)}><Ico n={on ? 'pause' : 'play'} /></button>
      <span className={c.scrub}><i data-on={on} /></span>
    </Sc>
  );
}

/* 06 */ function Stacked() {
  const [f, setF] = useState(0);
  return <Sc label="Stacked cards" className={c.stack}><h3>Everything, together</h3><div>{[0, 1, 2].map((k) => <button key={k} type="button" aria-label={`Card ${k + 1}`} style={{ '--d': (k - f + 3) % 3, '--h': k * 90 }} onClick={() => setF(k)} />)}</div></Sc>;
}

/* 07 */ function Email() {
  const [v, setV] = useState('');
  const ok = /.+@.+\..+/.test(v);
  return <Sc label="Email capture" className={c.cen}><h3>Stay in the loop</h3><form className={c.form} onSubmit={(e) => e.preventDefault()}><input value={v} onChange={(e) => setV(e.target.value)} placeholder="you@work.com" aria-label="Email" /><Cta disabled={!ok}>Join</Cta></form><small>{ok ? 'Looks good' : 'We send one a month'}</small></Sc>;
}

/* 08 */ function Two() {
  const [p, setP] = useState('');
  return <Sc label="Two buttons" className={c.cen}><h3>Start small</h3><p>{p || 'Pick a path'}</p><div className={c.pair}><Cta onClick={() => setP('Free plan chosen')}>Start free</Cta><button type="button" className={c.ghost} onClick={() => setP('Demo booked')}>Book a demo</button></div></Sc>;
}

/* 09 */ function Logos() {
  const [h, setH] = useState(-1);
  return <Sc label="Logo strip" className={c.cen}><h3>Trusted by teams</h3><div className={c.logos} onMouseLeave={() => setH(-1)}>{['◆', '●', '▲', '■', '✦'].map((g, k) => <button key={k} type="button" aria-label={`Customer ${k + 1}`} data-on={h === k} onMouseEnter={() => setH(k)} onFocus={() => setH(k)} onBlur={() => setH(-1)}>{g}</button>)}</div></Sc>;
}

/* 10 */ function Stats() {
  const n = useTick(100);
  const p = Math.min(1, (n % 28) / 18);
  return <Sc label="Stats band" className={c.stats} role="img">{[['Teams', 480], ['Uptime', 99.9], ['Countries', 36]].map(([t, v]) => <div key={t}><b>{v < 100 && v % 1 ? (v * p).toFixed(1) : Math.round(v * p)}{t === 'Uptime' ? '%' : '+'}</b><small>{t}</small></div>)}</Sc>;
}

/* 11 */ function Marquee() {
  return <Sc label="Marquee headline" className={c.marq} role="img"><div><span>BUILD · SHIP · REPEAT · BUILD · SHIP · REPEAT · </span><span>BUILD · SHIP · REPEAT · BUILD · SHIP · REPEAT · </span></div></Sc>;
}

/* 12 */ function Typewriter() {
  const t = useTyped('We make things that work.');
  return <Sc label="Typewriter hero" className={c.cen} role="img"><h3 className={c.type}>{t}<i /></h3></Sc>;
}

/* 13 */ function Rotator() {
  const i = useCycle(4, 1600);
  const W = ['faster', 'calmer', 'smarter', 'together'];
  return <Sc label="Word rotator" className={c.cen} role="img"><h3>Work <span className={c.rot}><b key={i}>{W[i]}</b></span></h3></Sc>;
}

/* 14 */ function Mesh() {
  return <Sc label="Gradient mesh" className={c.mesh} role="img"><i /><i /><i /><h3>Colour, in motion</h3></Sc>;
}

/* 15 */ function Spot() {
  const [ref, bind] = usePointer();
  return <Sc label="Spotlight hero" className={cx(c.spot)} ref={ref} {...bind} tabIndex={0}><h3>Find the light</h3></Sc>;
}

/* 16 */ function Parallax() {
  const [ref, bind] = usePointer();
  return <Sc label="Parallax layers" className={c.para} ref={ref} {...bind} tabIndex={0}><i /><i /><i /><h3>Depth</h3></Sc>;
}

/* 17 */ function Callouts() {
  const [s, setS] = useState(0);
  const N = ['Aluminium body', 'Two-day battery', 'Open firmware'];
  return <Sc label="Product callouts" className={c.callout}><span className={c.prod} />{N.map((t, k) => <button key={t} type="button" aria-pressed={s === k} aria-label={t} style={{ '--k': k }} onClick={() => setS(k)}>{k + 1}</button>)}<small>{N[s]}</small></Sc>;
}

/* 18 */ function Phone() {
  const [t, setT] = useState(0);
  return <Sc label="Phone hero" className={c.phoneH}><div><h3>In your pocket</h3><Cta onClick={() => setT((v) => (v + 1) % 3)}>Next screen</Cta></div><span className={c.phoneBody}><i style={{ '--h': t * 120 }} /></span></Sc>;
}

/* 19 */ function Browser() {
  const [t, setT] = useState(0);
  return <Sc label="Browser frame" className={c.browser}><span className={c.chrome}><i /><i /><i />{['Home', 'Docs'].map((x, k) => <button key={x} type="button" aria-pressed={t === k} onClick={() => setT(k)}>{x}</button>)}</span><h3>{t ? 'Read the docs' : 'Welcome home'}</h3><p /></Sc>;
}

/* 20 */ function Floating() {
  return <Sc label="Floating cards" className={c.float} role="img"><h3>Always in reach</h3><i /><i /><i /></Sc>;
}

/* 21 */ function TabsHero() {
  const [t, setT] = useState(0);
  const T = [['Teams', 'Plan together'], ['Makers', 'Ship alone'], ['Studios', 'Bill clients']];
  return <Sc label="Tabbed hero" className={c.tabsH} style={{ '--h': t * 110 }}><div role="tablist" aria-label="Audience">{T.map(([n], k) => <button key={n} type="button" role="tab" aria-selected={t === k} onClick={() => setT(k)}>{n}</button>)}</div><h3>{T[t][1]}</h3><span /></Sc>;
}

/* 22 */ function Slides() {
  const [i, setI] = useState(0);
  return <Sc label="Carousel hero" className={c.slides} style={{ '--h': i * 120 }}><h3>{['One tool', 'Two views', 'Three steps'][i]}</h3><div>{[0, 1, 2].map((k) => <button key={k} type="button" aria-label={`Slide ${k + 1}`} aria-current={i === k ? 'true' : undefined} onClick={() => setI(k)} />)}</div></Sc>;
}

/* 23 */ function Announce() {
  const [on, setOn] = useState(true);
  return <Sc label="Announcement bar" className={c.cen}>{on && <span className={c.ann}>Version 2 is out<button type="button" aria-label="Dismiss" onClick={() => setOn(false)}>×</button></span>}<h3>Meet version two</h3>{!on && <button type="button" className={c.ghost} onClick={() => setOn(true)}>Show bar</button>}</Sc>;
}

/* 24 */ function Pill() {
  return <Sc label="Badge hero" className={c.cen}><button type="button" className={c.pill}><b>New</b> Dark mode is here <Ico n="right" /></button><h3>Easier on the eyes</h3></Sc>;
}

/* 25 */ function BigNumber() {
  const [o, setO] = useState(false);
  return <Sc label="Big number" className={c.big}><button type="button" aria-expanded={o} onClick={() => setO((v) => !v)}><b>99.9%</b></button><small>{o ? 'Measured over twelve months, every region.' : 'uptime'}</small></Sc>;
}

/* 26 */ function Outline() {
  return <Sc label="Outline type" className={c.outline}><button type="button" aria-label="Outline headline">BOLD</button></Sc>;
}

/* 27 */ function Cue() {
  return <Sc label="Scroll cue" className={c.cen} role="img"><h3>Keep going</h3><span className={c.mouse}><i /></span></Sc>;
}

/* 28 */ function Launch() {
  const n = useTick(1000);
  const s = 4 * 3600 + 12 * 60 - n;
  return <Sc label="Launch countdown" className={c.cen} role="timer"><small>Launching in</small><div className={c.digits}>{[Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v, k) => <b key={k}>{pad2(v)}</b>)}</div></Sc>;
}

/* 29 */ function SearchHero() {
  const [q, setQ] = useState('');
  const S = ['pricing', 'docs', 'status', 'security'].filter((x) => q && x.startsWith(q.toLowerCase()));
  return <Sc label="Search hero" className={c.cen}><h3>Ask anything</h3><label className={c.big2}><Ico n="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search" /></label>{S.length ? <div className={c.sug}>{S.map((s) => <button key={s} type="button" onClick={() => setQ(s)}>{s}</button>)}</div> : <small>Try “p” or “d”</small>}</Sc>;
}

/* 30 */ function Waitlist() {
  const [n, setN] = useState('');
  const [d, setD] = useState(false);
  return <Sc label="Waitlist form" className={c.cen}>{d ? <><span className={c.ok}><Ico n="check" /></span><h3>You are on the list</h3><button type="button" className={c.ghost} onClick={() => { setD(false); setN(''); }}>Reset</button></> : <><h3>Join the waitlist</h3><form className={c.form} onSubmit={(e) => { e.preventDefault(); if (n.trim()) setD(true); }}><input value={n} onChange={(e) => setN(e.target.value)} placeholder="Your name" aria-label="Name" /><Cta type="submit">Join</Cta></form></>}</Sc>;
}

/* 31 */ function PriceBand() {
  const [s, setS] = useState(1);
  return <Sc label="Pricing band" className={c.cen}><h3>Simple pricing</h3><div className={c.prices} role="group" aria-label="Plan">{[['Solo', 9], ['Team', 29], ['Scale', 99]].map(([n, p], k) => <button key={n} type="button" aria-pressed={s === k} onClick={() => setS(k)}><small>{n}</small><b>${p}</b></button>)}</div></Sc>;
}

/* 32 */ function Quote() {
  const [i, setI] = useState(0);
  const Q = [['“It just stays out of the way.”', 'Ana, Ops'], ['“We shipped a week early.”', 'Kofi, Eng'], ['“Our calmest quarter.”', 'Mara, Design']];
  return <Sc label="Testimonial band" className={c.cen}><p className={c.quote}>{Q[i][0]}</p><small>{Q[i][1]}</small><button type="button" className={c.ghost} onClick={() => setI((v) => (v + 1) % 3)}>Next</button></Sc>;
}

/* 33 */ function Closing() {
  return <Sc label="Closing band" className={c.closing}><h3>Ready when you are</h3><Cta>Start now</Cta></Sc>;
}

/* 34 */ function FooterCta() {
  return <Sc label="Footer" className={c.foot}><h3>Let us talk</h3><div>{[['Work', 'Cases', 'Method'], ['Company', 'About', 'Jobs'], ['Help', 'Docs', 'Status']].map(([h, ...l]) => <span key={h}><b>{h}</b>{l.map((x) => <a key={x} href="#footer" onClick={(e) => e.preventDefault()}>{x}</a>)}</span>)}</div></Sc>;
}

/* 35 */ function Newsletter() {
  const [v, setV] = useState('');
  const [d, setD] = useState(false);
  return <Sc label="Newsletter ending" className={c.cen}><h3>{d ? 'Subscribed' : 'One email a month'}</h3><form className={c.form} onSubmit={(e) => { e.preventDefault(); if (v.includes('@')) setD(true); }}><input value={v} onChange={(e) => { setV(e.target.value); setD(false); }} placeholder="Email" aria-label="Email" /><Cta type="submit">{d ? '✓' : 'Join'}</Cta></form></Sc>;
}

/* 36 */ function Lost() {
  return <Sc label="Page not found" className={c.lost}><b>404</b><small>This page took a different road.</small><Cta>Go home</Cta></Sc>;
}

/* 37 */ function Thanks() {
  const [n, setN] = useState(1);
  return <Sc label="Thank you" className={c.cen}><button type="button" className={c.okring} aria-label="Replay" onClick={() => setN((v) => v + 1)}><svg key={n} viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" pathLength="1" /><path d="M15 27l8 8 14-16" pathLength="1" /></svg></button><h3>Thank you</h3><small>We will be in touch</small></Sc>;
}

/* 38 */ function Contact() {
  const [d, setD] = useState(false);
  return <Sc label="Contact ending" className={c.cen}><small>Write to us</small><h3>hello@hanoryx.io</h3><button type="button" className={c.ghost} onClick={() => setD((v) => !v)}>{d ? 'Copied ✓' : 'Copy address'}</button></Sc>;
}

/* 39 */ function ToTop() {
  const [p, setP] = useState(60);
  return <Sc label="Back to top" className={c.cen}><button type="button" className={c.ring} aria-label={`${p} percent down the page. Click to go to the top`} style={{ '--p': p }} onClick={() => setP((v) => (v >= 100 ? 0 : Math.min(100, v + 25)))}><Ico n="up" /></button><small>{p}% down</small></Sc>;
}

/* 40 */ function Sign() {
  return <Sc label="Sign-off" className={c.cen} role="img"><svg viewBox="0 0 120 40" className={c.sig}><path pathLength="100" d="M6 28c8-22 16-26 14-8s-10 20-4 18 14-22 22-22c-6 12-2 18 6 8s6-10 10-6c-4 8 2 8 8 0s8-10 4-4 4 6 10 0 12-8 14-2 8-6 10-10" /></svg><small>With thanks, the Hanoryx team</small></Sc>;
}

/* 41 */ function Theme() {
  const [d, setD] = useState(true);
  return <Sc label="Light and dark hero" className={cx(c.cen, c.themed, !d && c.lightH)}><h3>Your theme</h3><button type="button" className={c.ghost} aria-pressed={d} onClick={() => setD((v) => !v)}>{d ? 'Dark' : 'Light'}</button></Sc>;
}

/* 42 */ function Lang() {
  const [i, setI] = useState(0);
  const L = [['EN', 'Build calm systems'], ['NO', 'Bygg rolige systemer'], ['JA', '落ち着いたシステムを']];
  return <Sc label="Language hero" className={c.cen}><div className={c.chips} role="group" aria-label="Language">{L.map(([k], j) => <button key={k} type="button" aria-pressed={i === j} onClick={() => setI(j)}>{k}</button>)}</div><h3 lang={['en', 'no', 'ja'][i]}>{L[i][1]}</h3></Sc>;
}

export default {
  Visual,
  items: [
    ['Centred opening', Centered, 'click'], ['Text and shape', Side, 'still'], ['Half and half', Halves, 'still'], ['Full-bleed', Overlay, 'still'],
    ['Film opening', VideoHero, 'click'], ['Card stack hero', Stacked, 'click'], ['Email opening', Email, 'type'], ['Two paths', Two, 'click'],
    ['Logo strip', Logos, 'hover'], ['Stats band', Stats, 'auto'], ['Marquee words', Marquee, 'auto'], ['Typed opening', Typewriter, 'auto'],
    ['Word rotator', Rotator, 'auto'], ['Colour mesh', Mesh, 'auto'], ['Spotlight opening', Spot, 'hover'], ['Parallax opening', Parallax, 'hover'],
    ['Product callouts', Callouts, 'click'], ['Phone opening', Phone, 'click'], ['Browser opening', Browser, 'click'], ['Floating cards', Floating, 'auto'],
    ['Tabbed opening', TabsHero, 'click'], ['Slide opening', Slides, 'click'], ['Announcement bar', Announce, 'click'], ['Badge opening', Pill, 'hover'],
    ['Big number', BigNumber, 'click'], ['Outline type', Outline, 'hover'], ['Scroll nudge', Cue, 'auto'], ['Launch clock', Launch, 'auto'],
    ['Search opening', SearchHero, 'type'], ['Waitlist form', Waitlist, 'type'], ['Pricing band', PriceBand, 'click'], ['Quote band', Quote, 'click'],
    ['Closing band', Closing, 'still'], ['Footer call', FooterCta, 'still'], ['Newsletter ending', Newsletter, 'type'], ['Dead end', Lost, 'still'],
    ['Thank-you ending', Thanks, 'click'], ['Contact ending', Contact, 'click'], ['Return to top', ToTop, 'click'], ['Sign-off', Sign, 'auto'],
    ['Theme opening', Theme, 'click'], ['Language opening', Lang, 'click'],
  ],
};
