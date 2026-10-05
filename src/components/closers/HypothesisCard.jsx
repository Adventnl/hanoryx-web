import { useMemo, useState } from 'react';
import { AlertTriangle, Check, Download, Wand2 } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './HypothesisCard.module.css';

const FIELDS = [
  { id: 'question', label: 'The question', ph: 'Does a calm mode change how long people stay on a long page?' },
  { id: 'if', label: 'If we…', ph: 'offer a calm mode from the first screen' },
  { id: 'then', label: '…then', ph: 'more visitors will reach the end of long pages' },
  { id: 'measure', label: 'We will measure', ph: 'Share of visits that scroll to the last section, before and after' },
  { id: 'stop', label: 'We will stop if', ph: 'Two weeks pass with no visible difference, or it harms anything else' },
];
const VAGUE = /\b(better|improve|improved|faster|easier|more engaging|enhance|optimi[sz]e)\b/i;
const COUNTABLE = /\d|%|share|count|time|rate|number|before|after|compare|average|per /i;
const text = (v, id) => (v[id] || '').trim();

/** A small card for a small experiment. A good hypothesis can be wrong, says what
 *  would show it, and says when to stop. Fill the five lines; the page flags the
 *  usual weaknesses, and the card can be taken away. */
export default function HypothesisCard({ tag, title, lede, onward }) {
  const [v, setV] = useState({});
  const [copied, copy] = useCopy();
  const set = (id) => (e) => setV((s) => ({ ...s, [id]: e.target.value }));
  const get = (id) => text(v, id);
  const checks = [
    { ok: get('if').length > 3 && get('then').length > 3, text: 'It has the shape “if we do this, then that will happen”.' },
    { ok: get('measure').length > 3 && COUNTABLE.test(get('measure')), text: 'It names something that can be counted or compared.' },
    { ok: get('then').length > 3 && !VAGUE.test(get('then')), text: 'The prediction is specific. Words such as “better” or “improve” hide what you expect.' },
    { ok: get('stop').length > 3, text: 'It says when to stop, so the experiment can end.' },
  ];
  const md = useMemo(() => {
    const t = (id, fallback) => text(v, id) || fallback;
    return ['# Research card', '', `**Question.** ${t('question', '—')}`, '', `**Hypothesis.** If we ${t('if', '…')}, then ${t('then', '…')}.`, '', `**Measure.** ${t('measure', '—')}`, '', `**Stop if.** ${t('stop', '—')}`, ''].join('\n');
  }, [v]);
  const done = FIELDS.filter((f) => get(f.id).length > 3).length;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('hypothesis.rig')}>
        <div className={styles.form}>
          {FIELDS.map((f) => <label key={f.id} className={tool.field}><span>{f.label}</span><textarea rows={2} value={v[f.id] || ''} onChange={set(f.id)} placeholder={f.ph} autoComplete="off" /></label>)}
          <div className={shared.row}>
            <button type="button" className={shared.btn} onClick={() => setV(Object.fromEntries(FIELDS.map((f) => [f.id, f.ph])))}><Wand2 size={14} aria-hidden="true" /> Fill with an example</button>
          </div>
        </div>
        <div className={styles.out}>
          <article className={styles.card}>
            <p className={shared.label}>Research card · {done} of {FIELDS.length}</p>
            <p className={styles.q}>{get('question') || 'The question goes here.'}</p>
            <p className={styles.h}>If we <b>{get('if') || '…'}</b>, then <b>{get('then') || '…'}</b>.</p>
            <dl>
              <div><dt>Measure</dt><dd>{get('measure') || '—'}</dd></div>
              <div><dt>Stop if</dt><dd>{get('stop') || '—'}</dd></div>
            </dl>
          </article>
          <ul className={styles.checks} aria-live="polite">
            {checks.map((c) => <li key={c.text} className={c.ok ? undefined : styles.no}>{c.ok ? <Check size={14} aria-hidden="true" /> : <AlertTriangle size={14} aria-hidden="true" />}<span>{c.text}</span></li>)}
          </ul>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('research-card.md', md, 'text/markdown')} disabled={!done}><Download size={14} aria-hidden="true" /> Download</button>
            <button type="button" className={shared.btn} onClick={() => copy(md)} disabled={!done}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
