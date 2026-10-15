import { Fragment, useState } from 'react';
import { clamp, pad2, rng, useCycle, useLive, useTick } from '../hooks';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Ico } from '../icons';
import c from './terminal.module.css';

/* ============================================================
   38 · TERMINAL — pieces of a command line.
   Everything is drawn in text. The still side is a console window that prints
   a build log line by line as the scroll advances; the forty-two specimens
   beside it are prompts, logs, diffs and menus. The ones that would be running
   run by themselves while on screen (never under reduced motion), and the ones
   that take input are real inputs and buttons with the keys you would expect.
   ============================================================ */

const LOG = [
  ['ok', 'resolve   142 packages'],
  ['ok', 'compile   src/app.jsx'],
  ['ok', 'compile   src/stage.jsx'],
  ['warn', 'warn      unused export "ease"'],
  ['ok', 'bundle    3 chunks'],
  ['ok', 'minify    -41%'],
  ['ok', 'emit      dist/index.html'],
  ['ok', 'emit      dist/app.js'],
  ['ok', 'check     0 errors'],
  ['ok', 'done      in 1.9s'],
];

function Visual() {
  return (
    <div className={c.vis} aria-hidden="true">
      <div className={c.visBar}><i /><i /><i /><span>build — 80×24</span></div>
      <div className={c.visBody}>
        <p style={{ '--k': 0 }}><b className={c.prompt}>$</b> npm run build</p>
        {LOG.map(([k, t], i) => <p key={t} data-k={k} style={{ '--k': i + 1 }}>{t}</p>)}
        <p style={{ '--k': 11 }}><b className={c.prompt}>$</b><i className={c.caret} /></p>
      </div>
      <small>{LOG.length} LINES · 1 PROMPT</small>
    </div>
  );
}

/* text that types itself while on screen, and just sits there otherwise */
function useTyped(text, ms = 90, hold = 14) {
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const n = useTick(ms);
  if (reduced || !live) return text;
  return text.slice(0, n % (text.length + hold));
}

const cx = (...a) => a.filter(Boolean).join(' ');

/* 01 */ function PromptLine() {
  return (
    <div className={c.win}>
      <p className={c.ln}><b className={c.user}>ada@hanoryx</b><span className={c.dim}>:</span><b className={c.path}>~/work</b><span className={c.dim}>$</span><i className={c.caret} /></p>
    </div>
  );
}

/* 02 */ function Typed() {
  const t = useTyped('npm run build --prod', 80, 16);
  return (
    <div className={c.win} role="img" aria-label="A command being typed: npm run build --prod">
      <p className={c.ln}><b className={c.prompt}>$</b> {t}<i className={c.caret} /></p>
    </div>
  );
}

const HIST = ['git status', 'git add -A', 'git commit -m "ship it"', 'git push origin main', 'npm test'];
/* 03 */ function History() {
  const [i, setI] = useState(HIST.length);
  const go = (d) => setI((v) => clamp(v + d, 0, HIST.length));
  return (
    <div className={c.win} tabIndex={0} role="group" aria-label="Command history: press the up and down arrow keys"
      onKeyDown={(e) => { if (e.key === 'ArrowUp') { e.preventDefault(); go(-1); } else if (e.key === 'ArrowDown') { e.preventDefault(); go(1); } }}>
      <p className={c.ln}><b className={c.prompt}>$</b> {HIST[i] ?? ''}<i className={c.caret} /></p>
      <div className={c.keys}>
        <button type="button" className={c.key} aria-label="Previous command" onClick={() => go(-1)}><Ico n="up" /></button>
        <button type="button" className={c.key} aria-label="Next command" onClick={() => go(1)}><Ico n="down" /></button>
        <small className={c.dim}>{i >= HIST.length ? 'new line' : `!${i + 1}`}</small>
      </div>
    </div>
  );
}

const CMDS = ['git checkout', 'git commit', 'git clone', 'grep', 'gzip', 'npm install', 'npm run dev', 'node'];
/* 04 */ function TabComplete() {
  const [v, setV] = useState('git c');
  const ghost = v ? (CMDS.find((m) => m.startsWith(v) && m !== v) ?? '') : '';
  const done = () => { if (ghost) setV(ghost); };
  return (
    <div className={c.win}>
      <div className={c.ln}>
        <b className={c.prompt}>$</b>
        <span className={c.ghostBox}>
          <i>{v}</i><u>{ghost.slice(v.length)}</u>
          <input value={v} onChange={(e) => setV(e.target.value)} spellCheck={false} autoComplete="off" aria-label="Command: press Tab to complete"
            onKeyDown={(e) => { if (e.key === 'Tab' && ghost) { e.preventDefault(); done(); } }} />
        </span>
      </div>
      <button type="button" className={c.key} onClick={done} disabled={!ghost}>Tab ⇥</button>
    </div>
  );
}

const LV = ['INFO', 'INFO', 'INFO', 'WARN', 'INFO', 'ERROR', 'DEBUG', 'INFO'];
const MSG = ['listening on :8080', 'GET /health 200 2ms', 'cache warmed (412 keys)', 'slow query 840ms', 'job 9f2a done', 'upstream timeout', 'tick 1000', 'POST /login 204 11ms'];
const logLine = (n) => { const r = rng(n * 7 + 3); const k = Math.floor(r() * MSG.length); return { id: n, t: `12:04:${pad2((n * 3) % 60)}`, lv: LV[k], msg: MSG[k] }; };
/* 05 */ function LogTail() {
  const n = useTick(900);
  const rows = Array.from({ length: 5 }, (_, k) => logLine(n + k));
  return (
    <div className={cx(c.win, c.tail)} role="img" aria-label="A log scrolling by">
      {rows.map((r) => <p key={r.id} className={c.ln} data-lv={r.lv}><span className={c.dim}>{r.t}</span> <b>{r.lv}</b> {r.msg}</p>)}
    </div>
  );
}

const SET = [['INFO', 'server started'], ['DEBUG', 'config loaded'], ['WARN', 'disk 87% full'], ['INFO', 'GET /api 200'], ['ERROR', 'db refused'], ['INFO', 'GET /api 200'], ['WARN', 'retry 2/5'], ['ERROR', 'timeout']];
/* 06 */ function LogLevels() {
  const [on, setOn] = useState(['INFO', 'WARN', 'ERROR']);
  const flip = (l) => setOn((a) => (a.includes(l) ? a.filter((x) => x !== l) : [...a, l]));
  return (
    <div className={c.win}>
      <div className={c.chips} role="group" aria-label="Show levels">
        {['DEBUG', 'INFO', 'WARN', 'ERROR'].map((l) => <button key={l} type="button" className={c.chip} data-lv={l} aria-pressed={on.includes(l)} onClick={() => flip(l)}>{l}</button>)}
      </div>
      <div className={c.scroll}>
        {SET.filter(([l]) => on.includes(l)).map(([l, m], i) => <p key={`${l}${i}`} className={c.ln} data-lv={l}><b>{l}</b> {m}</p>)}
      </div>
    </div>
  );
}

/* 07 */ function Diff() {
  return (
    <div className={c.win}>
      {[['@@ -12,4 +12,5 @@ nav.js', [[' ', 'const open = false;'], ['-', 'const speed = 300;'], ['+', 'const speed = 180;'], ['+', 'const ease = "out";']]], ['@@ -40,3 +41,3 @@ stage.js', [[' ', 'render();'], ['-', 'pin(1);'], ['+', 'pin(2);']]]].map(([h, ls]) => (
        <details key={h} open className={c.hunk}>
          <summary>{h}</summary>
          {ls.map(([s, t], i) => <p key={i} className={c.ln} data-d={s}><span>{s}</span>{t}</p>)}
        </details>
      ))}
    </div>
  );
}

/* 08 */ function Trace() {
  return (
    <div className={c.win}>
      <p className={cx(c.ln, c.err)}>TypeError: cannot read "map" of undefined</p>
      <p className={c.ln}><span className={c.dim}>  at</span> render <span className={c.dim}>(list.jsx:14)</span></p>
      <p className={c.ln}><span className={c.dim}>  at</span> mount <span className={c.dim}>(app.jsx:52)</span></p>
      <details className={c.hunk}>
        <summary>3 internal frames</summary>
        {['scheduler.run', 'reconcile', 'commit'].map((f) => <p key={f} className={c.ln}><span className={c.dim}>  at {f}</span></p>)}
      </details>
    </div>
  );
}

/* 09 */ function Hashes() {
  const n = useTick(260);
  const [t0, setT0] = useState(0);
  const p = Math.min(100, ((n - t0) % 30) * 5);
  const f = Math.round(p / 5);
  return (
    <button type="button" className={cx(c.win, c.btn)} onClick={() => setT0(n)} aria-label={`Download ${p} percent. Click to restart`}>
      <span className={c.ln}><span className={c.dim}>fetch</span> data.tar.gz</span>
      <span className={c.ln}>[<span className={c.ok}>{'#'.repeat(f)}</span><span className={c.dim}>{'-'.repeat(20 - f)}</span>] {p}%</span>
    </button>
  );
}

const BRAILLE = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
/* 10 */ function Braille() {
  const i = useCycle(10, 90);
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={cx(c.win, c.btn)} onClick={() => setDone((d) => !d)} aria-pressed={done}>
      <span className={c.ln}>{done ? <b className={c.ok}>✔</b> : <b className={c.cyan}>{BRAILLE[i]}</b>} {done ? 'installed 142 packages' : 'installing packages…'}</span>
    </button>
  );
}

const PS = [[1, 'root', 0.4, 12], [212, 'ada', 31.2, 8], [388, 'ada', 4.8, 21], [402, 'sys', 0.1, 3], [517, 'www', 12.7, 16], [630, 'ada', 0.0, 1]];
/* 11 */ function Table() {
  const [by, setBy] = useState(2);
  const rows = [...PS].sort((a, b) => (by === 1 ? a[1].localeCompare(b[1]) : b[by] - a[by]));
  return (
    <div className={c.win}>
      <div className={cx(c.ln, c.head)}>
        {['PID', 'USER', 'CPU', 'MEM'].map((h, i) => <button key={h} type="button" className={c.th} aria-pressed={by === i} onClick={() => setBy(i)}>{h}{by === i ? '↓' : ''}</button>)}
      </div>
      {rows.map((r) => <div key={r[0]} className={cx(c.ln, c.row4)}>{r.map((v, i) => <span key={i}>{typeof v === 'number' && i > 1 ? v.toFixed(1) : v}</span>)}</div>)}
    </div>
  );
}

const TREE = [['src', [['app.js'], ['ui', [['nav.js'], ['btn.js']]], ['index.css']]], ['docs', [['intro.md'], ['api.md']]], ['package.json']];
function Branch({ nodes, pre, path, open, flip }) {
  return nodes.map(([name, kids], i) => {
    const last = i === nodes.length - 1;
    const p = `${path}/${name}`;
    return (
      <Fragment key={p}>
        <li className={c.ln}>
          <span className={c.dim}>{pre}{last ? '└── ' : '├── '}</span>
          {kids ? <button type="button" className={c.dirb} aria-expanded={open.includes(p)} onClick={() => flip(p)}>{name}/</button> : <span>{name}</span>}
        </li>
        {kids && open.includes(p) && <Branch nodes={kids} pre={pre + (last ? '    ' : '│   ')} path={p} open={open} flip={flip} />}
      </Fragment>
    );
  });
}
/* 12 */ function Tree() {
  const [open, setOpen] = useState(['/src']);
  const flip = (p) => setOpen((a) => (a.includes(p) ? a.filter((x) => x !== p) : [...a, p]));
  return <ul className={cx(c.win, c.tree)} aria-label="File tree"><li className={c.ln}>.</li><Branch nodes={TREE} pre="" path="" open={open} flip={flip} /></ul>;
}

const OPTS = [['-a', 'include hidden entries'], ['-h', 'sizes in human units'], ['-l', 'use a long listing'], ['-r', 'reverse the order']];
/* 13 */ function ManOptions() {
  const [s, setS] = useState(1);
  return (
    <div className={c.win}>
      <p className={cx(c.ln, c.head)}>LS(1) <span className={c.dim}>— OPTIONS</span></p>
      <div className={c.chips} role="group" aria-label="Options">
        {OPTS.map(([o], i) => <button key={o} type="button" className={c.chip} aria-pressed={s === i} onClick={() => setS(i)} onMouseEnter={() => setS(i)}>{o}</button>)}
      </div>
      <p className={c.ln} aria-live="polite"><b>{OPTS[s][0]}</b> <span className={c.dim}>{OPTS[s][1]}</span></p>
    </div>
  );
}

const EXIT = [[0, 'success'], [1, 'general error'], [2, 'misuse of a command'], [126, 'not executable'], [127, 'command not found'], [130, 'stopped with Ctrl-C']];
/* 14 */ function ExitCodes() {
  const [s, setS] = useState(4);
  const [code, why] = EXIT[s];
  return (
    <div className={c.win}>
      <div className={c.chips} role="group" aria-label="Exit codes">
        {EXIT.map(([n], i) => <button key={n} type="button" className={c.chip} aria-pressed={s === i} onClick={() => setS(i)}>{n}</button>)}
      </div>
      <p className={c.ln}><b className={code ? c.err : c.ok}>{code ? '✘' : '✔'}</b> exit {code} <span className={c.dim}>· {why}</span></p>
    </div>
  );
}

const SHAPES = ['block', 'underline', 'bar'];
/* 15 */ function CursorShapes() {
  const [s, setS] = useState(0);
  return (
    <button type="button" className={cx(c.win, c.btn)} onClick={() => setS((v) => (v + 1) % 3)} aria-label={`Cursor shape: ${SHAPES[s]}. Click to change`}>
      <span className={c.ln}><b className={c.prompt}>$</b> echo hi<i className={cx(c.caret, c.shape)} data-shape={SHAPES[s]} /></span>
      <small className={c.dim}>{SHAPES[s]}</small>
    </button>
  );
}

/* 16 */ function PromptThemes() {
  const [t, setT] = useState(0);
  const themes = ['plain', 'powerline', 'minimal', 'arrow'];
  return (
    <button type="button" className={cx(c.win, c.btn)} onClick={() => setT((v) => (v + 1) % 4)} aria-label={`Prompt theme: ${themes[t]}. Click to change`}>
      <span className={cx(c.ln, c.theme)} data-t={themes[t]}>
        <span>~/work</span><span>main ±2</span><span>✔</span><i />
      </span>
      <small className={c.dim}>{themes[t]}</small>
    </button>
  );
}

/* 17 */ function GitStatus() {
  const [files, setFiles] = useState([['app.jsx', false], ['nav.css', false], ['notes.md', true], ['logo.svg', false]]);
  const flip = (i) => setFiles((a) => a.map((f, k) => (k === i ? [f[0], !f[1]] : f)));
  return (
    <div className={c.win}>
      {[true, false].map((st) => (
        <Fragment key={String(st)}>
          <p className={cx(c.ln, c.dim)}>{st ? 'to be committed:' : 'not staged:'}</p>
          {files.map((f, i) => f[1] === st && <button key={f[0]} type="button" className={cx(c.ln, c.file)} data-st={st} onClick={() => flip(i)} aria-label={`${f[0]}, ${st ? 'staged' : 'not staged'}. Click to ${st ? 'unstage' : 'stage'}`}>{st ? 'modified:' : 'M'} {f[0]}</button>)}
        </Fragment>
      ))}
    </div>
  );
}

const GRAPH = [['*', ' ', ' ', 'a41f', 'merge ui-pass'], ['|', '\\', ' ', '', ''], ['|', ' ', '*', 'c09d', 'tune the ease'], ['*', ' ', '|', '7e12', 'add nav'], ['|', '/', ' ', '', ''], ['*', ' ', ' ', '19bb', 'first light']];
/* 18 */ function CommitGraph() {
  const [s, setS] = useState('a41f');
  return (
    <div className={cx(c.win, c.graph)} role="group" aria-label="Commit graph">
      {GRAPH.map(([a, b, d, h, m], i) => (
        <div key={i} className={c.ln}>
          <span className={c.gl}>{a}{b}{d}</span>
          {h ? <button type="button" className={c.hash} aria-pressed={s === h} onClick={() => setS(h)}>{h} <span className={c.dim}>{m}</span></button> : null}
        </div>
      ))}
    </div>
  );
}

const BLAME = [['a41f', 'ada', 'const open = false;'], ['a41f', 'ada', 'const speed = 180;'], ['7e12', 'lin', 'render(open);'], ['c09d', 'ada', 'pin(2);'], ['7e12', 'lin', 'export default stage;']];
/* 19 */ function Blame() {
  const [h, setH] = useState('');
  return (
    <div className={c.win} onMouseLeave={() => setH('')}>
      {BLAME.map(([hash, who, code], i) => (
        <button key={i} type="button" className={cx(c.ln, c.bl)} data-hot={h === hash} onMouseEnter={() => setH(hash)} onFocus={() => setH(hash)} onBlur={() => setH('')}>
          <span className={c.hashc}>{hash}</span><span className={c.dim}>{who}</span><span>{code}</span>
        </button>
      ))}
    </div>
  );
}

const ENV = [['NODE_ENV', 'production'], ['API_URL', 'https://api.hanoryx.io'], ['TOKEN', 'sk_live_4f9a21c8'], ['PORT', '8080']];
/* 20 */ function EnvVars() {
  const [shown, setShown] = useState(['NODE_ENV']);
  const flip = (k) => setShown((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  return (
    <div className={c.win}>
      {ENV.map(([k, v]) => (
        <button key={k} type="button" className={cx(c.ln, c.bl)} aria-pressed={shown.includes(k)} aria-label={`${k}, ${shown.includes(k) ? 'shown' : 'hidden'}`} onClick={() => flip(k)}>
          <span className={c.cyan}>{k}</span><span className={c.dim}>=</span><span>{shown.includes(k) ? v : '•'.repeat(Math.min(10, v.length))}</span>
        </button>
      ))}
    </div>
  );
}

/* 21 */ function Pipe() {
  return (
    <div className={cx(c.win, c.pipe)} role="img" aria-label="Three commands joined by pipes, data flowing through">
      {['cat log', 'grep ERR', 'wc -l'].map((t, i) => <Fragment key={t}>{i > 0 && <span className={c.bar}><u /><u /><u /></span>}<code>{t}</code></Fragment>)}
    </div>
  );
}

/* 22 */ function Cores() {
  const n = useTick(700);
  return (
    <div className={c.win} role="img" aria-label="CPU usage per core">
      {Array.from({ length: 6 }, (_, k) => { const v = Math.round(rng(n * 13 + k * 5 + 1)() * 90 + 5); return (
        <div key={k} className={c.ln}><span className={c.dim}>{k}</span><span className={c.meter}><i style={{ width: `${v}%`, background: v > 75 ? '#ff6b6b' : '#4ade80' }} /></span><span>{v}%</span></div>
      ); })}
    </div>
  );
}

const DU = [['node_modules', 612], ['.git', 140], ['dist', 56], ['src', 22], ['public', 9]];
/* 23 */ function DiskUsage() {
  const [s, setS] = useState(0);
  return (
    <div className={c.win}>
      {DU.map(([d, mb], i) => (
        <button key={d} type="button" className={cx(c.ln, c.du)} aria-pressed={s === i} onClick={() => setS(i)}>
          <span className={c.meter}><i style={{ width: `${(mb / 612) * 100}%` }} /></span><span>{mb}M</span><span className={c.dim}>{d}</span>
        </button>
      ))}
    </div>
  );
}

/* 24 */ function Ping() {
  const n = useTick(600);
  const v = (k) => 14 + rng(k * 31 + 9)() * 30;
  const win = Array.from({ length: 14 }, (_, k) => v(n + k));
  return (
    <div className={c.win} role="img" aria-label="Ping times">
      <p className={c.ln}>64 bytes from 10.0.0.1 <span className={c.dim}>time=</span><b className={c.ok}>{win[13].toFixed(1)} ms</b></p>
      <div className={c.spark}>{win.map((x, k) => <i key={n + k} style={{ height: `${x * 2}%` }} data-hi={x > 38} />)}</div>
    </div>
  );
}

const BOOT = ['Reached target Network', 'Started Journal Service', 'Mounted /data', 'Started Cron Daemon', 'Reached target Graphical'];
/* 25 */ function Boot() {
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const n = useTick(550);
  const k = reduced || !live ? BOOT.length : 1 + (n % (BOOT.length + 2));
  return (
    <div className={c.win} role="img" aria-label="Boot messages appearing">
      {BOOT.slice(0, k).map((t) => <p key={t} className={c.ln}>[ <b className={c.ok}>OK</b> ] {t}</p>)}
    </div>
  );
}

/* 26 */ function Panes() {
  const [f, setF] = useState(0);
  const names = ['editor', 'server', 'tests'];
  return (
    <div className={c.panes} role="group" aria-label="Terminal panes"
      onKeyDown={(e) => { if (e.key === 'ArrowRight') setF((v) => (v + 1) % 3); if (e.key === 'ArrowLeft') setF((v) => (v + 2) % 3); }}>
      {names.map((n, i) => (
        <button key={n} type="button" className={c.pane} aria-pressed={f === i} data-p={i} onClick={() => setF(i)}>
          <span className={c.dim}>{n}</span>
          <i /><i /><i />
        </button>
      ))}
    </div>
  );
}

/* 27 */ function Windows() {
  const [s, setS] = useState(0);
  const W = [['zsh', 'ada@hanoryx ~ $'], ['vim', '-- INSERT --'], ['logs', 'tail -f app.log']];
  return (
    <div className={c.win}>
      <div className={c.tabs} role="tablist" aria-label="Windows">
        {W.map(([n], i) => <button key={n} type="button" role="tab" id={`w${i}`} aria-selected={s === i} className={c.tab} onClick={() => setS(i)}>{i}:{n}{s === i ? '*' : ''}</button>)}
      </div>
      <p className={c.ln} role="tabpanel" aria-labelledby={`w${s}`}>{W[s][1]}<i className={c.caret} /></p>
    </div>
  );
}

const MODES = ['NORMAL', 'INSERT', 'VISUAL'];
/* 28 */ function ModeLine() {
  const [m, setM] = useState(0);
  return (
    <div className={c.win} tabIndex={0} role="group" aria-label="Editor mode: press i, v or Escape"
      onKeyDown={(e) => { if (e.key === 'i') setM(1); else if (e.key === 'v') setM(2); else if (e.key === 'Escape') setM(0); }}>
      <p className={c.ln}><span className={c.dim}>~</span></p>
      <div className={c.mode} data-m={MODES[m]}>
        {MODES.map((x, i) => <button key={x} type="button" aria-pressed={m === i} onClick={() => setM(i)}>{x}</button>)}
        <span>utf-8 · 12:4</span>
      </div>
    </div>
  );
}

const CODE = ['import stage from "./stage";', '', 'export function run(el) {', '  const t = stage(el);', '  t.pin(2);', '  return t;', '}'];
/* 29 */ function LineNumbers() {
  const [cur, setCur] = useState(3);
  return (
    <div className={cx(c.win, c.code)} role="group" aria-label="Code, pick a line"
      onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setCur((v) => clamp(v + 1, 0, CODE.length - 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setCur((v) => clamp(v - 1, 0, CODE.length - 1)); } }}>
      {CODE.map((t, i) => <button key={i} type="button" className={c.cl} data-cur={cur === i} aria-pressed={cur === i} onClick={() => setCur(i)}><span>{i + 1}</span><code>{t || ' '}</code></button>)}
    </div>
  );
}

const SYN = ['night', 'paper', 'neon'];
/* 30 */ function SyntaxTheme() {
  const [t, setT] = useState(0);
  return (
    <button type="button" className={cx(c.win, c.btn, c.syn)} data-t={SYN[t]} onClick={() => setT((v) => (v + 1) % 3)} aria-label={`Syntax colours: ${SYN[t]}. Click to change`}>
      <span className={c.ln}><i data-k="kw">const</i> <i data-k="fn">add</i> = (<i data-k="id">a</i>, <i data-k="id">b</i>) =&gt; <i data-k="id">a</i> + <i data-k="num">1</i>;</span>
      <span className={c.ln}><i data-k="cm">{'// ' + SYN[t]}</i></span>
      <span className={c.ln}><i data-k="kw">return</i> <i data-k="str">"ok"</i>;</span>
    </button>
  );
}

const GREP = ['src/app.jsx:12: const stage = pin();', 'src/nav.jsx:4: import { stage } from ./s', 'docs/api.md:30: stage options', 'src/ui.css:9: .stage { gap: 1rem }', 'README.md:2: run the stage demo'];
/* 31 */ function GrepFilter() {
  const [q, setQ] = useState('stage');
  const hit = GREP.filter((l) => !q || l.toLowerCase().includes(q.toLowerCase()));
  const mark = (l) => {
    if (!q) return l;
    const i = l.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? l : <>{l.slice(0, i)}<mark>{l.slice(i, i + q.length)}</mark>{l.slice(i + q.length)}</>;
  };
  return (
    <div className={c.win}>
      <label className={c.ln}><b className={c.prompt}>grep</b> <input className={c.plain} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search text" spellCheck={false} autoComplete="off" /></label>
      <div className={c.scroll}>{hit.map((l) => <p key={l} className={c.ln}>{mark(l)}</p>)}<small className={c.dim}>{hit.length} matches</small></div>
    </div>
  );
}

const HEX = [0x48, 0x61, 0x6e, 0x6f, 0x72, 0x79, 0x78, 0x00, 0x53, 0x79, 0x73, 0x74, 0x65, 0x6d, 0x73, 0x21];
/* 32 */ function Hex() {
  const [h, setH] = useState(-1);
  const ch = (b) => (b > 31 && b < 127 ? String.fromCharCode(b) : '.');
  return (
    <div className={c.win} onMouseLeave={() => setH(-1)}>
      {[0, 8].map((o) => (
        <div key={o} className={cx(c.ln, c.hexrow)}>
          <span className={c.dim}>{pad2(o)}</span>
          <span>{HEX.slice(o, o + 8).map((b, i) => <button key={i} type="button" className={c.byte} data-hot={h === o + i} aria-label={`byte ${o + i}: ${b.toString(16)}`} onMouseEnter={() => setH(o + i)} onFocus={() => setH(o + i)} onBlur={() => setH(-1)}>{b.toString(16).padStart(2, '0')}</button>)}</span>
          <span className={c.asc}>{HEX.slice(o, o + 8).map((b, i) => <i key={i} data-hot={h === o + i}>{ch(b)}</i>)}</span>
        </div>
      ))}
    </div>
  );
}

const CHEAT = [['Ctrl R', 'search history'], ['Ctrl A', 'line start'], ['Ctrl E', 'line end'], ['Ctrl W', 'delete word'], ['Ctrl L', 'clear screen'], ['Ctrl C', 'interrupt']];
/* 33 */ function Cheats() {
  const [s, setS] = useState(-1);
  return (
    <div className={c.win}>
      <div className={c.caps}>
        {CHEAT.map(([k], i) => <button key={k} type="button" className={c.cap} aria-pressed={s === i} onPointerDown={() => setS(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setS(i); }}>{k}</button>)}
      </div>
      <p className={c.ln} aria-live="polite">{s < 0 ? <span className={c.dim}>press a key</span> : CHEAT[s][1]}</p>
    </div>
  );
}

const ALIAS = { gs: 'git status', gp: 'git push', ll: 'ls -alh', dc: 'docker compose up' };
/* 34 */ function Alias() {
  const [v, setV] = useState('gs');
  const change = (e) => {
    const t = e.target.value;
    const m = /^(\w+) $/.exec(t);
    setV(m && ALIAS[m[1]] ? `${ALIAS[m[1]]} ` : t);
  };
  return (
    <div className={c.win}>
      <label className={c.ln}><b className={c.prompt}>$</b> <input className={c.plain} value={v} onChange={change} aria-label="Command: type an alias then a space" spellCheck={false} autoComplete="off" /></label>
      <small className={c.dim}>gs · gp · ll · dc, then space</small>
    </div>
  );
}

/* 35 */ function Heredoc() {
  const [lines, setLines] = useState(['hello']);
  const [v, setV] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (v.trim() === 'EOF') { setDone(true); } else { setLines((a) => [...a.slice(-2), v]); }
    setV('');
  };
  const reset = () => { setLines([]); setDone(false); };
  return (
    <form className={c.win} onSubmit={submit}>
      <p className={c.ln}><b className={c.prompt}>$</b> cat &lt;&lt; EOF</p>
      {lines.map((l, i) => <p key={i} className={c.ln}><span className={c.dim}>&gt;</span> {l}</p>)}
      {done ? <p className={c.ln}><b className={c.ok}>wrote {lines.length} lines</b> <button type="button" className={c.key} onClick={reset}>again</button></p>
        : <label className={c.ln}><span className={c.dim}>&gt;</span> <input className={c.plain} value={v} onChange={(e) => setV(e.target.value)} aria-label="Line (type EOF to finish)" spellCheck={false} autoComplete="off" /></label>}
    </form>
  );
}

/* 36 */ function Secret() {
  const [v, setV] = useState('');
  const [show, setShow] = useState(false);
  const score = Math.min(4, Math.floor(v.length / 3));
  return (
    <div className={c.win}>
      <label className={c.ln}><span className={c.dim}>password:</span> <input className={c.plain} type={show ? 'text' : 'password'} value={v} onChange={(e) => setV(e.target.value)} aria-label="Password" autoComplete="off" /></label>
      <div className={c.strength} data-s={score}>{[0, 1, 2, 3].map((k) => <i key={k} data-on={score > k} />)}</div>
      <button type="button" className={c.key} aria-pressed={show} onClick={() => setShow((s) => !s)}><Ico n="eye" /></button>
    </div>
  );
}

/* 37 */ function Confirm() {
  const [a, setA] = useState('');
  return (
    <div className={c.win} tabIndex={0} role="group" aria-label="Confirm: press y or n"
      onKeyDown={(e) => { const k = e.key.toLowerCase(); if (k === 'y') setA('y'); else if (k === 'n' || k === 'enter') setA('n'); }}>
      <p className={c.ln}>Delete 3 files? <span className={c.dim}>[y/N]</span> <b className={a === 'y' ? c.err : c.ok}>{a}</b></p>
      <div className={c.keys}>
        <button type="button" className={c.key} onClick={() => setA('y')}>y</button>
        <button type="button" className={c.key} onClick={() => setA('n')}>n</button>
        {a && <small className={c.dim}>{a === 'y' ? 'removed' : 'kept'}</small>}
      </div>
    </div>
  );
}

const RUN = ['node 22', 'bun 1.2', 'deno 2', 'edge worker'];
/* 38 */ function SelectMenu() {
  const [i, setI] = useState(0);
  return (
    <div className={c.win} tabIndex={0} role="listbox" aria-label="Pick a runtime" aria-activedescendant={`rt${i}`}
      onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => (v + 1) % 4); } if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => (v + 3) % 4); } }}>
      <p className={c.ln}><b className={c.prompt}>?</b> Pick a runtime</p>
      {RUN.map((r, k) => <p key={r} id={`rt${k}`} role="option" aria-selected={i === k} className={cx(c.ln, c.opt)} onClick={() => setI(k)}><span>{i === k ? '❯' : ' '}</span> {r}</p>)}
    </div>
  );
}

const PICK = ['lint', 'types', 'tests', 'docs'];
/* 39 */ function Checks() {
  const [on, setOn] = useState(['lint', 'tests']);
  const flip = (k) => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  return (
    <div className={c.win}>
      {PICK.map((k) => <button key={k} type="button" role="checkbox" aria-checked={on.includes(k)} className={cx(c.ln, c.bl)} onClick={() => flip(k)}><b className={on.includes(k) ? c.ok : c.dim}>{on.includes(k) ? '◉' : '◯'}</b> {k}</button>)}
      <small className={c.dim}>{on.length} of 4 selected</small>
    </div>
  );
}

/* 40 */ function TestDots() {
  const n = useTick(240);
  const [t0, setT0] = useState(0);
  const total = 28;
  const k = Math.min(total, ((n - t0) % (total + 12)));
  const dots = Array.from({ length: k }, (_, i) => (i === 13 ? 'F' : '.'));
  return (
    <button type="button" className={cx(c.win, c.btn)} onClick={() => setT0(n)} aria-label="Test run. Click to rerun">
      <span className={cx(c.ln, c.dots)}>{dots.map((d, i) => <b key={i} className={d === 'F' ? c.err : c.ok}>{d}</b>)}</span>
      <span className={c.ln}>{k >= total ? <><b className={c.err}>1 failed</b> <span className={c.dim}>27 passed</span></> : <span className={c.dim}>running {k}/{total}</span>}</span>
    </button>
  );
}

const STEPS = [['clean', 40], ['compile', 310], ['bundle', 180], ['minify', 95], ['upload', 420]];
/* 41 */ function BuildSteps() {
  const live = useLive();
  const reduced = usePrefersReducedMotion();
  const n = useTick(700);
  const k = reduced || !live ? STEPS.length : n % (STEPS.length + 2);
  return (
    <div className={c.win} role="img" aria-label="Build steps finishing one by one">
      {STEPS.map(([t, ms], i) => <p key={t} className={c.ln}>{i < k ? <b className={c.ok}>✓</b> : i === k ? <b className={c.cyan}>{BRAILLE[n % 10]}</b> : <span className={c.dim}>·</span>} {t} <span className={c.dim}>{i < k ? `${ms}ms` : ''}</span></p>)}
    </div>
  );
}

const CRON = [['min', ['0', '15', '30', '45', '*']], ['hour', ['9', '12', '18', '*']], ['day', ['*', '1', '15']], ['mon', ['*', '1', '6']], ['dow', ['*', '1', '5']]];
/* 42 */ function Cron() {
  const [ix, setIx] = useState([0, 0, 0, 0, 1]);
  const bump = (i) => setIx((a) => a.map((v, k) => (k === i ? (v + 1) % CRON[i][1].length : v)));
  const v = ix.map((x, i) => CRON[i][1][x]);
  const dow = { '*': 'every day', 1: 'on Mondays', 5: 'on Fridays' }[v[4]];
  return (
    <div className={c.win}>
      <div className={c.cronf} role="group" aria-label="Cron fields">
        {CRON.map(([n], i) => <button key={n} type="button" className={c.field} onClick={() => bump(i)} aria-label={`${n}: ${v[i]}. Click to change`}><b>{v[i]}</b><small>{n}</small></button>)}
      </div>
      <p className={c.ln}><span className={c.dim}>→</span> at {v[1] === '*' ? 'every hour' : `${pad2(+v[1])}:${v[0] === '*' ? 'xx' : pad2(+v[0])}`}, {dow}</p>
    </div>
  );
}

export default {
  Visual,
  items: [
    ['Shell prompt', PromptLine, 'auto'], ['Typed command', Typed, 'auto'], ['History recall', History, 'click'], ['Tab complete', TabComplete, 'type'],
    ['Log tail', LogTail, 'auto'], ['Log levels', LogLevels, 'click'], ['Diff hunks', Diff, 'click'], ['Stack trace', Trace, 'click'],
    ['Hash progress', Hashes, 'auto'], ['Braille spinner', Braille, 'auto'], ['Process table', Table, 'click'], ['Tree listing', Tree, 'click'],
    ['Man options', ManOptions, 'hover'], ['Exit codes', ExitCodes, 'click'], ['Cursor shapes', CursorShapes, 'click'], ['Prompt themes', PromptThemes, 'click'],
    ['Git status', GitStatus, 'click'], ['Commit graph', CommitGraph, 'click'], ['Blame gutter', Blame, 'hover'], ['Env vars', EnvVars, 'click'],
    ['Pipe chain', Pipe, 'auto'], ['Core bars', Cores, 'auto'], ['Space hogs', DiskUsage, 'click'], ['Ping trace', Ping, 'auto'],
    ['Boot log', Boot, 'auto'], ['Split panes', Panes, 'click'], ['Window strip', Windows, 'click'], ['Mode line', ModeLine, 'key'],
    ['Line numbers', LineNumbers, 'click'], ['Syntax theme', SyntaxTheme, 'click'], ['Grep filter', GrepFilter, 'type'], ['Byte dump', Hex, 'hover'],
    ['Key cheats', Cheats, 'press'], ['Alias expand', Alias, 'type'], ['Heredoc prompt', Heredoc, 'type'], ['Secret prompt', Secret, 'type'],
    ['Confirm prompt', Confirm, 'key'], ['Runtime picker', SelectMenu, 'key'], ['Checkbox list', Checks, 'click'], ['Test dots', TestDots, 'auto'],
    ['Build steps', BuildSteps, 'auto'], ['Cron fields', Cron, 'click'],
  ],
};
