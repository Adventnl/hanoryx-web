import { useMemo, useState } from 'react';
import { Download, Eraser, Plus, Trash2 } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import tool from './tool.module.css';
import styles from './DecisionRecord.module.css';

const STATUSES = ['Proposed', 'Accepted', 'Superseded', 'Rejected'];
const today = () => new Date().toLocaleDateString('en-CA');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'decision';

const EXAMPLE = {
  title: 'Send receipts from a queue, not inside the request',
  status: 'Accepted',
  deciders: 'The two engineers on the project',
  context: 'Sending a receipt takes between half a second and several seconds, and sometimes fails. Doing it inside the checkout request makes checkout slow, and a failed email can fail the order.',
  options: [
    { name: 'Send inside the request', note: 'Simplest. Slow checkout, and a mail outage breaks orders.' },
    { name: 'Send from a queue', note: 'One more moving part. Checkout stays fast; failed sends can be retried.' },
    { name: 'Do not send receipts', note: 'Rejected: customers expect one.' },
  ],
  decision: 'Put a job on a queue when the order is saved, and send the receipt from a worker. Record that the receipt was sent so a retry cannot send it twice.',
  consequences: 'Checkout no longer waits on email. We need to watch the age of the oldest queued job, and the worker must be safe to run twice. Revisit if volumes outgrow one worker.',
};

/** A decision record builder. Fill in what was decided and why; the Markdown
 *  appears beside it, ready to commit next to the code. It starts with an
 *  invented example so you can see the shape — clear it and write your own. */
export default function DecisionRecord({ eyebrow, title, intro, note }) {
  const [d, setD] = useState(() => ({ ...EXAMPLE, date: today() }));
  const [copied, copy] = useCopy();
  const set = (k) => (e) => setD((s) => ({ ...s, [k]: e.target.value }));
  const setOpt = (i, k) => (e) => setD((s) => ({ ...s, options: s.options.map((o, j) => (j === i ? { ...o, [k]: e.target.value } : o)) }));
  const addOpt = () => setD((s) => (s.options.length < 5 ? { ...s, options: [...s.options, { name: '', note: '' }] } : s));
  const dropOpt = (i) => setD((s) => ({ ...s, options: s.options.filter((_, j) => j !== i) }));

  const md = useMemo(
    () => [
      `# ${d.title || '<Short title of the decision>'}`,
      '',
      `Status: ${d.status}`,
      `Date: ${d.date}`,
      `Deciders: ${d.deciders || '<who>'}`,
      '',
      '## Context',
      d.context || '<What is the situation, and what forces are at work?>',
      '',
      '## Options considered',
      ...d.options.filter((o) => o.name || o.note).map((o, i) => `${i + 1}. ${o.name || '<option>'} - ${o.note || '<what it costs, what it buys>'}`),
      '',
      '## Decision',
      d.decision || '<What was chosen, and the main reason.>',
      '',
      '## Consequences',
      d.consequences || '<What becomes easier, what becomes harder, and when to revisit.>',
      '',
    ].join('\n'),
    [d]
  );

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={tool.rig} {...fx('decision.rig')}>
        <div className={tool.stack}>
          <label className={tool.field}><span>Title</span><input value={d.title} onChange={set('title')} autoComplete="off" /></label>
          <div className={tool.pair}>
            <label className={tool.field}><span>Status</span><select value={d.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label className={tool.field}><span>Date</span><input value={d.date} onChange={set('date')} autoComplete="off" /></label>
          </div>
          <label className={tool.field}><span>Deciders</span><input value={d.deciders} onChange={set('deciders')} autoComplete="off" /></label>
          <label className={tool.field}><span>Context</span><textarea value={d.context} onChange={set('context')} /><small>Write it so a stranger could follow it.</small></label>
          <fieldset className={styles.opts}>
            <legend>Options considered</legend>
            {d.options.map((o, i) => (
              <div key={i} className={styles.opt}>
                <input value={o.name} onChange={setOpt(i, 'name')} placeholder="Option" aria-label={`Option ${i + 1} name`} autoComplete="off" />
                <input value={o.note} onChange={setOpt(i, 'note')} placeholder="What it costs, what it buys" aria-label={`Option ${i + 1} note`} autoComplete="off" />
                <button type="button" onClick={() => dropOpt(i)} aria-label={`Remove option ${i + 1}`}><Trash2 size={14} aria-hidden="true" /></button>
              </div>
            ))}
            <button type="button" className={styles.add} onClick={addOpt} disabled={d.options.length >= 5}><Plus size={13} aria-hidden="true" /> Add an option</button>
          </fieldset>
          <label className={tool.field}><span>Decision</span><textarea value={d.decision} onChange={set('decision')} /></label>
          <label className={tool.field}><span>Consequences</span><textarea value={d.consequences} onChange={set('consequences')} /><small>Say what becomes harder, and when to look again.</small></label>
        </div>
        <div className={`${tool.out} ${tool.sticky}`}>
          <p className={tool.k}>{slug(d.title)}.md</p>
          <pre className={tool.pre} tabIndex={0} {...fx('decision.preview')}><code>{md}</code></pre>
          <div className={tool.row}>
            <button type="button" className={styles.btn} onClick={() => downloadText(`${slug(d.title)}.md`, md, 'text/markdown')}><Download size={13} aria-hidden="true" /> Download</button>
            <button type="button" className={styles.btn} onClick={() => copy(md)}>{copied ? 'Copied' : 'Copy'}</button>
            <button type="button" className={styles.btn} onClick={() => setD({ title: '', status: 'Proposed', date: today(), deciders: '', context: '', options: [{ name: '', note: '' }, { name: '', note: '' }], decision: '', consequences: '' })}><Eraser size={13} aria-hidden="true" /> Clear</button>
          </div>
        </div>
      </div>
      {note && <p className={tool.note}>{note}</p>}
    </div>
  );
}
