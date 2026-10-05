import { useMemo, useState } from 'react';
import { Copy, Download } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './SigilMaker.module.css';

/* A small seeded random source: the same word always draws the same figure. */
function seeded(text) {
  let h = 2166136261;
  for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  let a = h >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const f = (n) => n.toFixed(2);

function draw(word, rings, spokes, accent) {
  const rnd = seeded(word || 'hanoryx');
  const C = 160;
  const parts = [];
  for (let r = 0; r < rings; r += 1) {
    const sides = 3 + Math.floor(rnd() * 6);
    const radius = 24 + ((r + 1) / rings) * 112;
    const rot = rnd() * Math.PI * 2;
    const pts = Array.from({ length: sides }, (_, i) => { const a = rot + (i / sides) * Math.PI * 2; return `${f(C + Math.cos(a) * radius)},${f(C + Math.sin(a) * radius)}`; }).join(' ');
    const hot = accent && r === Math.floor(rnd() * rings);
    parts.push(`<polygon points="${pts}" fill="none" stroke="${hot ? '#ff3333' : '#f2f2f2'}" stroke-opacity="${hot ? 1 : f(0.35 + rnd() * 0.5)}" stroke-width="${hot ? 1.6 : 1}"/>`);
  }
  for (let s = 0; s < spokes; s += 1) {
    const a = (s / spokes) * Math.PI * 2 + rnd() * 0.1;
    const r1 = 14 + rnd() * 40;
    const r2 = 90 + rnd() * 56;
    parts.push(`<line x1="${f(C + Math.cos(a) * r1)}" y1="${f(C + Math.sin(a) * r1)}" x2="${f(C + Math.cos(a) * r2)}" y2="${f(C + Math.sin(a) * r2)}" stroke="#f2f2f2" stroke-opacity="${f(0.2 + rnd() * 0.4)}"/>`);
    parts.push(`<circle cx="${f(C + Math.cos(a) * r2)}" cy="${f(C + Math.sin(a) * r2)}" r="${f(1.2 + rnd() * 2.2)}" fill="${accent && s % 5 === 0 ? '#ff3333' : '#f2f2f2'}"/>`);
  }
  parts.push(`<circle cx="${C}" cy="${C}" r="3" fill="#ff3333"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320"><rect width="320" height="320" fill="#0a0b0d"/>${parts.join('')}</svg>`;
}

/** A figure drawn from a word. The same word always draws the same shape, so it
 *  is a signature rather than a random picture. Download it as an SVG. */
export default function SigilMaker({ tag, title, lede, onward }) {
  const [word, setWord] = useState('Hanoryx');
  const [rings, setRings] = useState(6);
  const [spokes, setSpokes] = useState(14);
  const [accent, setAccent] = useState(true);
  const [copied, copy] = useCopy();
  const svg = useMemo(() => draw(word.trim().toLowerCase(), rings, spokes, accent), [word, rings, spokes, accent]);
  const name = (word.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'figure');

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('sigil.rig')}>
        <div className={styles.form}>
          <label className={tool.field}><span>A word</span><input value={word} onChange={(e) => setWord(e.target.value)} maxLength={40} autoComplete="off" spellCheck={false} /><small>Any word, name or phrase. Same input, same figure.</small></label>
          <div className={tool.pair}>
            <label className={tool.field}><span>Rings <b>{rings}</b></span><input type="range" min={2} max={9} value={rings} onChange={(e) => setRings(Number(e.target.value))} /></label>
            <label className={tool.field}><span>Spokes <b>{spokes}</b></span><input type="range" min={0} max={32} value={spokes} onChange={(e) => setSpokes(Number(e.target.value))} /></label>
          </div>
          <label className={styles.inline}><input type="checkbox" checked={accent} onChange={(e) => setAccent(e.target.checked)} /> Use the red accent</label>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText(`${name}.svg`, svg, 'image/svg+xml')}><Download size={14} aria-hidden="true" /> Download SVG</button>
            <button type="button" className={shared.btn} onClick={() => copy(svg)}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy the SVG'}</button>
          </div>
        </div>
        <figure className={styles.view} {...fx('sigil.figure')}>
          <div className={styles.svg} role="img" aria-label={`A figure drawn from the word “${word}”: ${rings} rings and ${spokes} spokes.`} dangerouslySetInnerHTML={{ __html: svg }} />
          <figcaption>{name}.svg</figcaption>
        </figure>
      </div>
    </CloserFrame>
  );
}
