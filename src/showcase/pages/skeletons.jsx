import { useEffect, useState } from 'react';
import { useCycle, useDrag, useToggle } from '../hooks';
import { Ico } from '../icons';
import c from './skeletons.module.css';

/* ============================================================
   29 · SKELETONS — placeholders and empty states.
   The still side is one card that resolves as you scroll: grey bars sharpen
   into a heading, a line of text and a figure at the scroll's own pace (every
   step is a CSS number, so nothing re-renders). Specimens are the waiting
   shapes — and what a page says when there is nothing to wait for.
   ============================================================ */

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visCard}>
        <i className={c.visPic} />
        <div className={c.visBody}>
          <b className={c.visH}><u>Quiet interfaces</u><s /></b>
          <p className={c.visP}><u>Made to be waited for, then forgotten.</u><s /></p>
          <p className={c.visP2}><u>Forty-two shapes</u><s /></p>
        </div>
      </div>
      <small>1 CARD · 3 STATES</small>
    </div>
  );
}

const sk = (w, h = '0.6rem', r) => <i className={c.sk} style={{ width: w, height: h, borderRadius: r }} />;
const Shell = ({ label = 'Loading', className, children }) => <div className={className} role="status" aria-busy="true" aria-label={label}>{children}</div>;

/* 1 */ function Lines() { return <Shell className={c.col} label="Loading text">{sk('100%')}{sk('92%')}{sk('96%')}{sk('58%')}</Shell>; }

/* 2 */ function CardSk() {
  return (
    <Shell className={c.card}>{sk('100%', '5rem', '8px')}<div>{sk('70%', '0.8rem')}{sk('100%')}{sk('84%')}</div></Shell>
  );
}

/* 3 */ function Row() {
  return <Shell className={c.row}>{sk('2.6rem', '2.6rem', '50%')}<div>{sk('55%', '0.7rem')}{sk('85%')}</div></Shell>;
}

/* 4 */ function Table() {
  return (
    <Shell className={c.table} label="Loading table">
      {[0, 1, 2, 3].map((r) => <div key={r}>{sk('18%')}{sk('36%')}{sk('14%')}{sk('12%')}</div>)}
    </Shell>
  );
}

/* 5 */ function Flavours() {
  const [k, setK] = useState(0);
  const names = ['Shimmer', 'Pulse', 'Wave'];
  return (
    <div className={c.flav}>
      <div role="radiogroup" aria-label="Skeleton animation">{names.map((n, i) => <button key={n} type="button" role="radio" aria-checked={i === k} onClick={() => setK(i)}>{n}</button>)}</div>
      <Shell className={c.flavBox} label="Loading"><div data-k={k}>{sk('100%', '0.8rem')}{sk('76%', '0.8rem')}{sk('88%', '0.8rem')}</div></Shell>
    </div>
  );
}

/* 6 */ function ChartSk() {
  return <Shell className={c.chart} label="Loading chart">{[40, 70, 52, 86, 34, 64, 48].map((h, k) => <i key={k} className={c.sk} style={{ height: `${h}%`, animationDelay: `${k * 0.12}s` }} />)}</Shell>;
}

/* 7 */ function Profile() {
  return <Shell className={c.profile}>{sk('100%', '2.4rem', '6px')}<div>{sk('3.4rem', '3.4rem', '50%')}<span>{sk('6rem', '0.8rem')}{sk('9rem')}</span></div></Shell>;
}

/* 8 */ function Pic() {
  return <Shell className={c.pic} label="Loading image"><Ico n="image" /></Shell>;
}

/* 9 */ function GalleryGrid() {
  return <Shell className={c.gallery} label="Loading gallery">{Array.from({ length: 6 }, (_, k) => <i key={k} className={c.sk} style={{ animationDelay: `${k * 0.1}s` }} />)}</Shell>;
}

/* 10 */ function Thread() {
  return (
    <Shell className={c.thread} label="Loading comments">
      {[0, 1].map((k) => <div key={k} style={{ marginLeft: k ? '1.8rem' : 0 }}>{sk('1.8rem', '1.8rem', '50%')}<span>{sk('4rem', '0.55rem')}{sk('100%')}{sk('70%')}</span></div>)}
    </Shell>
  );
}

/* 11 */ function ButtonSk() {
  return <Shell className={c.btns} label="Loading actions">{sk('5.4rem', '2.2rem', '99px')}{sk('3.6rem', '2.2rem', '99px')}</Shell>;
}

/* 12 */ function FormSk() {
  return <Shell className={c.form} label="Loading form">{[0, 1].map((k) => <div key={k}>{sk('3rem', '0.5rem')}{sk('100%', '2rem', '6px')}</div>)}{sk('40%', '2rem', '6px')}</Shell>;
}

/* 13 */ function Reveal() {
  const [on, flip] = useToggle();
  return (
    <div className={c.reveal}>
      <div className={c.revealBox} data-on={on}>
        <div aria-hidden={on}>{sk('100%', '0.9rem')}{sk('70%')}{sk('90%')}</div>
        <p aria-hidden={!on}><b>Quiet interfaces</b>Waited for, then forgotten.</p>
      </div>
      <button type="button" aria-pressed={on} onClick={flip}>{on ? 'Show skeleton' : 'Load content'}</button>
    </div>
  );
}

/* 14 */ function Stagger() {
  const k = useCycle(6, 800);
  return (
    <div className={c.stag} role="img" aria-label="Lines appearing in turn">
      {[100, 84, 92, 60, 76].map((w, i) => <i key={i} className={c.sk} style={{ width: `${w}%`, opacity: i <= k ? 1 : 0.15, transform: i <= k ? 'none' : 'translateX(-8px)' }} />)}
    </div>
  );
}

/* 15 */ function BlurUp() {
  const [sharp, flip] = useToggle();
  return (
    <div className={c.blur}>
      <div data-sharp={sharp} role="img" aria-label={sharp ? 'Sharp picture' : 'Blurred preview'} />
      <button type="button" aria-pressed={sharp} onClick={flip}>{sharp ? 'Blur again' : 'Sharpen'}</button>
    </div>
  );
}

/* 16 */ function Ellipsis() {
  return <Shell className={c.ellip}><span>Fetching</span><b>.</b><b>.</b><b>.</b></Shell>;
}

/* 17 */ function NoResults() {
  return (
    <div className={c.empty}>
      <Ico n="search" /><b>No results</b><p>Nothing matches “zebra”.</p><button type="button">Clear search</button>
    </div>
  );
}

/* 18 */ function EmptyInbox() {
  return (
    <div className={c.empty}>
      <i className={c.tray} aria-hidden="true" /><b>Inbox zero</b><p>Everything has been dealt with.</p>
    </div>
  );
}

/* 19 */ function EmptyBag() {
  const [n, setN] = useState(0);
  return (
    <div className={c.empty}>
      <Ico n="cart" /><b>{n ? `${n} in your bag` : 'Your bag is empty'}</b><p>{n ? 'Nice choice.' : 'Add something you like.'}</p>
      <button type="button" onClick={() => setN(n ? 0 : 1)}>{n ? 'Empty it' : 'Browse'}</button>
    </div>
  );
}

/* 20 */ function Lost() {
  return <div className={c.lost}><b>404</b><p>This page wandered off.</p><a href="#lost" onClick={(e) => e.preventDefault()}>Back to the start</a></div>;
}

/* 21 */ function OfflineState() {
  return <div className={c.empty}><Ico n="bolt" /><b>You are offline</b><p>Reconnect to load your feed.</p></div>;
}

/* 22 */ function FirstRun() {
  const [made, setMade] = useState(false);
  return (
    <div className={c.first} data-made={made}>
      {made ? <><Ico n="check" /><b>Project one</b></> : <><Ico n="plus" /><b>Create your first project</b></>}
      <button type="button" onClick={() => setMade(!made)}>{made ? 'Undo' : 'Create'}</button>
    </div>
  );
}

/* 23 */ function FlatChart() {
  return (
    <div className={c.flat} role="img" aria-label="Empty chart: no data yet">
      <svg viewBox="0 0 120 50" aria-hidden="true"><path d="M0 40H120" /><path d="M0 10H120M0 25H120" className={c.guide} /></svg>
      <span>No data yet</span>
    </div>
  );
}

/* 24 */ function EmptyRow() {
  return (
    <table className={c.tbl}>
      <thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead>
      <tbody><tr><td colSpan={2}>Nothing to show here yet</td></tr></tbody>
    </table>
  );
}

/* 25 */ function Suggest() {
  const [q, setQ] = useState('');
  const hits = ['maps', 'markers', 'marginalia'].filter((t) => q && t.startsWith(q.toLowerCase()));
  return (
    <div className={c.suggest}>
      <input aria-label="Search" placeholder="Try ‘ma’" value={q} onChange={(e) => setQ(e.target.value)} />
      {q === '' ? <p>Type to search.</p> : hits.length ? <ul>{hits.map((t) => <li key={t}>{t}</li>)}</ul> : <p>No match. Try fewer letters.</p>}
    </div>
  );
}

/* 26 */ function Denied() {
  return <div className={c.empty}><Ico n="lock" /><b>Members only</b><p>Ask an owner for access.</p><button type="button">Request access</button></div>;
}

/* 27 */ function Retry() {
  const [s, setS] = useState('bad');
  useEffect(() => {
    if (s !== 'busy') return undefined;
    const id = setTimeout(() => setS('ok'), 1200);
    return () => clearTimeout(id);
  }, [s]);
  return (
    <div className={c.empty} role="status">
      {s === 'bad' && <><Ico n="close" /><b>Could not load</b><p>Check your connection.</p><button type="button" onClick={() => setS('busy')}>Try again</button></>}
      {s === 'busy' && <><i className={c.spin} /><b>Trying again</b></>}
      {s === 'ok' && <><Ico n="check" /><b>Loaded</b><button type="button" onClick={() => setS('bad')}>Break it</button></>}
    </div>
  );
}

/* 28 */ function Soon() {
  const k = useCycle(60, 1000);
  return <div className={c.soon} role="timer" aria-label="Coming soon"><b>Soon</b><output>00:00:{String(59 - k).padStart(2, '0')}</output></div>;
}

/* 29 */ function EmptyCal() {
  return <div className={c.cal} role="img" aria-label="An empty month">{Array.from({ length: 21 }, (_, k) => <i key={k} data-hot={k === 9} />)}</div>;
}

/* 30 */ function DropZone() {
  const [over, setOver] = useState(false);
  const [n, setN] = useState(0);
  return (
    <div className={c.drop} data-over={over} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); setN((v) => v + (e.dataTransfer.files.length || 1)); }}>
      <Ico n="upload" /><b>{n ? `${n} dropped` : 'Drop files here'}</b>
      <button type="button" onClick={() => setN((v) => v + 1)}>or browse</button>
    </div>
  );
}

/* 31 */ function Ghost() {
  return <ul className={c.ghost} aria-label="Fading list">{['Atlas', 'Beacon', 'Compass', 'Dock', 'Ember'].map((t, k) => <li key={t} style={{ '--k': k }}>{t}</li>)}</ul>;
}

/* 32 */ function LineCount() {
  const [v, bind] = useDrag({ init: 0.5, steps: 4 });
  const n = 1 + Math.round(v * 4);
  return (
    <div className={c.count}>
      <Shell className={c.col} label="Loading text">{Array.from({ length: n }, (_, k) => <span key={k} style={{ display: 'block' }}>{sk(k === n - 1 && n > 1 ? '60%' : '100%')}</span>)}</Shell>
      <div {...bind} aria-label="Number of lines" aria-valuetext={`${n} lines`} style={{ ...bind.style, '--v': v }}><i /></div>
    </div>
  );
}

/* 33 */ function Shapes() {
  return <Shell className={c.shapes} label="Loading shapes">{sk('2.4rem', '2.4rem', '50%')}{sk('2.4rem', '2.4rem', '6px')}{sk('4.4rem', '1.6rem', '99px')}{sk('2.4rem', '2.4rem', '50% 0 50% 0')}</Shell>;
}

/* 34 */ function RingSk() {
  return <Shell className={c.ringSk} label="Loading gauge"><i className={c.sk} /><b /></Shell>;
}

/* 35 */ function MapSk() {
  return <Shell className={c.mapSk} label="Loading map"><i aria-hidden="true" /><Ico n="pin" /></Shell>;
}

/* 36 */ function VideoSk() {
  return <Shell className={c.video} label="Loading video"><span><Ico n="play" /></span><u><s /></u></Shell>;
}

/* 37 */ function ProductSk() {
  return <Shell className={c.product}>{sk('100%', '5rem', '6px')}{sk('70%', '0.7rem')}{sk('36%', '0.9rem')}</Shell>;
}

/* 38 */ function ChatSk() {
  return <Shell className={c.chatSk} label="Loading messages">{[['60%', 'l'], ['72%', 'r'], ['44%', 'l']].map(([w, s], k) => <div key={k} data-s={s}>{sk(w, '1.6rem', '12px')}</div>)}</Shell>;
}

/* 39 */ function NotifSk() {
  return <Shell className={c.notif} label="Loading notifications">{[0, 1, 2].map((k) => <div key={k}>{sk('0.6rem', '0.6rem', '50%')}{sk(`${70 - k * 12}%`)}</div>)}</Shell>;
}

/* 40 */ function PricingSk() {
  return <Shell className={c.price} label="Loading plans">{[0, 1].map((k) => <div key={k}>{sk('50%', '0.6rem')}{sk('70%', '1.4rem')}{sk('100%', '0.5rem')}{sk('100%', '0.5rem')}{sk('100%', '1.6rem', '99px')}</div>)}</Shell>;
}

/* 41 */ function SideSk() {
  return <Shell className={c.side} label="Loading navigation">{[80, 60, 72, 50, 66].map((w, k) => <div key={k}>{sk('1rem', '1rem', '4px')}{sk(`${w}%`)}</div>)}</Shell>;
}

/* 42 */ function Wireframe() {
  const [on, flip] = useToggle();
  return (
    <div className={c.wire}>
      <div className={c.wireBox} data-wire={on}>
        <i /><b /><u /><u /><s />
      </div>
      <button type="button" aria-pressed={on} onClick={flip}>{on ? 'Show skeleton' : 'Show wireframe'}</button>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Text lines', Lines, 'auto'], ['Card placeholder', CardSk, 'auto'], ['List row', Row, 'auto'], ['Table rows', Table, 'auto'],
    ['Three shimmers', Flavours, 'click'], ['Chart placeholder', ChartSk, 'auto'], ['Profile header', Profile, 'auto'], ['Picture frame', Pic, 'auto'],
    ['Gallery grid', GalleryGrid, 'auto'], ['Reply thread', Thread, 'auto'], ['Action buttons', ButtonSk, 'auto'], ['Form fields', FormSk, 'auto'],
    ['Skeleton to content', Reveal, 'click'], ['Line stagger', Stagger, 'auto'], ['Blur up', BlurUp, 'click'], ['Fetching dots', Ellipsis, 'auto'],
    ['No results', NoResults, 'click'], ['Inbox zero', EmptyInbox, 'static'], ['Empty bag', EmptyBag, 'click'], ['Lost page', Lost, 'static'],
    ['Offline feed', OfflineState, 'static'], ['First project', FirstRun, 'click'], ['Flat chart', FlatChart, 'static'], ['Empty table', EmptyRow, 'static'],
    ['Search suggestions', Suggest, 'type'], ['Members only', Denied, 'static'], ['Retry state', Retry, 'click'], ['Soon counter', Soon, 'auto'],
    ['Empty month', EmptyCal, 'static'], ['Drop target', DropZone, 'drop'], ['Ghost list', Ghost, 'static'], ['Line count', LineCount, 'drag'],
    ['Shape library', Shapes, 'auto'], ['Gauge placeholder', RingSk, 'auto'], ['Map placeholder', MapSk, 'auto'], ['Video placeholder', VideoSk, 'auto'],
    ['Product placeholder', ProductSk, 'auto'], ['Chat placeholder', ChatSk, 'auto'], ['Alert placeholder', NotifSk, 'auto'], ['Plan placeholder', PricingSk, 'auto'],
    ['Sidebar placeholder', SideSk, 'auto'], ['Wireframe toggle', Wireframe, 'click'],
  ],
};
