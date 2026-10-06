import { useState } from 'react';
import CloserFrame from './CloserFrame';
import { RangeField, Segmented } from '../kit';
import { fx } from '../../utils/fx';
import styles from './ReadingColumn.module.css';

const FACES = { serif: 'var(--font-serif)', sans: 'var(--font-sans)', mono: 'var(--font-mono)' };

const measureWord = (n) => (n < 45 ? ['short', 'Lines this short break the sentence into pieces, and the eye jumps down too often.'] : n <= 75 ? ['comfortable', 'The classic range: long enough to settle into, short enough to find the next line.'] : ['long', 'Past about 75 characters the eye loses its place at the end of a line.']);
const leadWord = (x) => (x < 1.4 ? ['tight', 'Lines almost touch; long passages tire the eye.'] : x <= 1.8 ? ['comfortable', 'Room to breathe without the lines drifting apart.'] : ['airy', 'Generous, and good for large type; at body size the lines start to read as separate.']);

/**
 * Set a reading column. Slide the measure (characters per line), the line height
 * and the size, and change the face; the text reflows under your hands and the page
 * says whether each setting is short, comfortable or long — the rules of thumb
 * behind the site’s Prose component.
 */
export default function ReadingColumn({ tag, title, lede, heading, paragraphs = [], onward }) {
  const [measure, setMeasure] = useState(66);
  const [lead, setLead] = useState(1.7);
  const [size, setSize] = useState(17);
  const [face, setFace] = useState('sans');
  const [m, mWhy] = measureWord(measure);
  const [l, lWhy] = leadWord(lead);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('reading.rig')}>
        <div className={styles.controls}>
          <RangeField label="Characters per line" min={28} max={110} value={measure} onChange={setMeasure} format={(n) => `${n}`} marks={['28', '66', '110']} />
          <RangeField label="Line height" min={1.1} max={2.3} step={0.05} value={lead} onChange={setLead} format={(n) => n.toFixed(2)} marks={['1.1', '1.7', '2.3']} />
          <RangeField label="Size" min={13} max={24} value={size} onChange={setSize} format={(n) => `${n} px`} />
          <Segmented label="Face" options={[{ value: 'sans', label: 'Sans' }, { value: 'serif', label: 'Serif' }, { value: 'mono', label: 'Mono' }]} value={face} onChange={setFace} />
          <div className={styles.read} role="status" aria-live="polite" {...fx('reading.verdict')}>
            <b>Line length: {m}</b>
            <span>{mWhy}</span>
            <b>Line height: {l}</b>
            <span>{lWhy}</span>
            <span>About <strong>{Math.round(measure / 6)}</strong> words a line.</span>
          </div>
        </div>
        <div className={styles.page}>
          <div className={styles.text} style={{ maxWidth: `${measure}ch`, lineHeight: lead, fontSize: `${size}px`, fontFamily: FACES[face] }}>
            <h3>{heading}</h3>
            {paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
