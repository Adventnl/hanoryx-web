import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { useCopy } from '../../hooks/useCopy';
import { brandLogo } from '../../utils/assetResolver';
import { fx } from '../../utils/fx';
import styles from './BrandBoard.module.css';

/* WCAG relative luminance and contrast ratio for a colour over a surface. */
function parse(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function over(rgb, alpha, base) { return rgb.map((c, i) => Math.round(c * alpha + base[i] * (1 - alpha))); }
function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); }
const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'Fails');

const TABS = [['mark', 'Mark'], ['colour', 'Colour'], ['type', 'Type'], ['motion', 'Motion'], ['voice', 'Voice']];

/**
 * The brand as the site actually uses it, in five panels: the mark and the room
 * it needs, the colours (click to copy; each one's contrast on the site's
 * black is calculated, not claimed), the three typefaces, the easing curves
 * (press play to run one), and the way the copy is written.
 */
export default function BrandBoard({ eyebrow, title, intro, mark, colours = [], faces = [], curves = [], voice = [] }) {
  const [tab, setTab] = useState('mark');
  const [space, setSpace] = useState(25);
  const [copied, copy] = useCopy();
  const [run, setRun] = useState({});

  const surface = useMemo(() => parse('#050505'), []);
  const rows = colours.map((c) => {
    const base = parse(c.hex);
    const rgb = c.alpha ? over(base, c.alpha, surface) : base;
    const r = ratio(rgb, surface);
    return { ...c, rgb, r };
  });

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.board} {...fx('brand.board')}>
        <GlideTabs idPrefix="brand" label="Part of the brand" value={tab} onChange={setTab} tabs={TABS.map(([id, label]) => ({ id, label }))} {...fx('brand.tabs')} />

        <div role="tabpanel" id="brand-panel-mark" aria-labelledby="brand-tab-mark" hidden={tab !== 'mark'} className={styles.panel}>
          {tab === 'mark' && (
            <div className={styles.markGrid}>
              <div className={styles.stage} {...fx('brand.clear-space')}>
                <div className={styles.markBox} style={{ '--cs-n': space / 100 }}>
                  <span className={styles.clear} aria-hidden="true" />
                  <img src={brandLogo} alt="The Hanoryx mark: a white H on a red square" width="160" height="160" />
                </div>
              </div>
              <div className={styles.side}>
                <p className={styles.kicker}>Room around the mark</p>
                <label className={styles.slider}>
                  <span>Clear space: <b>{space}%</b> of the mark’s width</span>
                  <input type="range" min={10} max={50} step={5} value={space} onChange={(e) => setSpace(Number(e.target.value))} />
                </label>
                <p className={styles.small}>{mark.rule}</p>
                <div className={styles.sizes} aria-label="The mark at the sizes the site uses" {...fx('brand.size-ladder')}>
                  {mark.sizes.map((s) => (
                    <figure key={s.px}>
                      <img src={brandLogo} alt="" width={s.px} height={s.px} style={{ width: s.px, height: s.px }} />
                      <figcaption>{s.px}px<br />{s.where}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div role="tabpanel" id="brand-panel-colour" aria-labelledby="brand-tab-colour" hidden={tab !== 'colour'} className={styles.panel}>
          {tab === 'colour' && (
            <ul className={styles.swatches} {...fx('brand.swatches')}>
              {rows.map((c) => (
                <li key={c.token}>
                  <button type="button" className={clsx(styles.swatch, copied === c.hex && styles.copied)} onClick={() => copy(c.hex)} aria-label={`Copy ${c.name}, ${c.hex}`}>
                    <span className={styles.chip} style={{ background: c.alpha ? `rgba(${parse(c.hex).join(',')},${c.alpha})` : c.hex }} />
                    <span className={styles.sName}>{c.name}</span>
                    <code>{copied === c.hex ? 'Copied' : c.hex}</code>
                    <code className={styles.tok}>{c.token}</code>
                  </button>
                  <span className={styles.use}>{c.use}</span>
                  <span className={clsx(styles.ratio, c.r < 4.5 && styles.low)}>{c.r.toFixed(1)}:1 on black · {grade(c.r)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div role="tabpanel" id="brand-panel-type" aria-labelledby="brand-tab-type" hidden={tab !== 'type'} className={styles.panel}>
          {tab === 'type' && (
            <div className={styles.faces} {...fx('brand.specimens')}>
              {faces.map((f) => (
                <article key={f.name} className={styles.face}>
                  <p className={styles.kicker}>{f.role}</p>
                  <p className={styles.specimen} style={{ fontFamily: f.stack, fontWeight: f.weight, letterSpacing: f.tracking, textTransform: f.upper ? 'uppercase' : 'none' }}>{f.sample}</p>
                  <p className={styles.aa} style={{ fontFamily: f.stack, fontWeight: f.weight }} aria-hidden="true">Aa Bb Cc 0123</p>
                  <p className={styles.small}><b>{f.name}</b> · {f.weights}</p>
                  <p className={styles.small}>{f.use}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div role="tabpanel" id="brand-panel-motion" aria-labelledby="brand-tab-motion" hidden={tab !== 'motion'} className={styles.panel}>
          {tab === 'motion' && (
            <ul className={styles.curves} {...fx('brand.easing-curves')}>
              {curves.map((c) => {
                const [x1, y1, x2, y2] = c.bezier;
                return (
                  <li key={c.token}>
                    <svg viewBox="0 0 100 100" className={styles.curve} aria-hidden="true">
                      <path d="M0 100 L100 0" className={styles.diag} />
                      <path d={`M0 100 C${x1 * 100} ${100 - y1 * 100} ${x2 * 100} ${100 - y2 * 100} 100 0`} className={styles.bez} />
                    </svg>
                    <div className={styles.cBody}>
                      <b>{c.name}</b>
                      <code>{c.token}: cubic-bezier({c.bezier.join(', ')})</code>
                      <span>{c.use}</span>
                    </div>
                    <div className={styles.lane} aria-hidden="true">
                      <i key={run[c.token] || 0} className={clsx(styles.ball, run[c.token] && styles.go)} style={{ '--ease': `cubic-bezier(${c.bezier.join(',')})` }} />
                    </div>
                    <button type="button" className={styles.play} onClick={() => setRun((r) => ({ ...r, [c.token]: (r[c.token] || 0) + 1 }))} aria-label={`Run ${c.name}`}><Play size={13} aria-hidden="true" /></button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div role="tabpanel" id="brand-panel-voice" aria-labelledby="brand-tab-voice" hidden={tab !== 'voice'} className={styles.panel}>
          {tab === 'voice' && (
            <ul className={styles.voice} {...fx('brand.voice-pairs')}>
              {voice.map((v) => (
                <li key={v.say}>
                  <p className={styles.say}><span>Say</span>{v.say}</p>
                  <p className={styles.not}><span>Not</span>{v.not}</p>
                  <p className={styles.why}>{v.why}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
