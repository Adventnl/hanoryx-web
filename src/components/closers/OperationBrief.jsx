import { useMemo, useState } from 'react';
import { Download, Wand2 } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './OperationBrief.module.css';

const FIELDS = [
  { id: 'what', label: 'The operation', hint: 'What happens, from start to finish, in a sentence or two.', ph: 'Orders arrive by email and phone, are checked, packed and sent.' },
  { id: 'who', label: 'The people', hint: 'Who is involved, by role, and who decides.', ph: 'Two people take orders, three pack, one owner approves refunds.' },
  { id: 'records', label: 'The records', hint: 'What is kept, where it lives today, and who can change it.', ph: 'A shared spreadsheet, a shared inbox and a paper diary.' },
  { id: 'wrong', label: 'What goes wrong', hint: 'The last three times it went wrong, in plain words.', ph: 'Two people promised the same stock. A refund was paid twice.' },
  { id: 'good', label: 'What “working” would look like', hint: 'How you would know. A number, a time, a count.', ph: 'No double promises. Any order answerable in under a minute.' },
  { id: 'limits', label: 'Limits and rules', hint: 'Systems that must stay, rules that cannot bend, dates that matter.', ph: 'The accounting package stays. Refunds over a limit need approval.' },
];
const VAGUE = /\b(better|faster|easier|improve|modern|streamline|efficient|seamless)\b/i;

/** Write the brief the first conversation needs, before the conversation. Six
 *  short answers become a one-page brief you can keep, share or bring. Nothing is
 *  sent anywhere: it stays in the page until you copy or download it. */
export default function OperationBrief({ tag, title, lede, onward }) {
  const [v, setV] = useState({});
  const [copied, copy] = useCopy();
  const set = (id) => (e) => setV((s) => ({ ...s, [id]: e.target.value }));
  const filled = FIELDS.filter((f) => (v[f.id] || '').trim().length > 8).length;
  const vague = VAGUE.test(v.good || '') && !/\d/.test(v.good || '');
  const md = useMemo(() => ['# Operation brief', '', ...FIELDS.flatMap((f) => [`## ${f.label}`, (v[f.id] || '').trim() || '_Not yet written._', ''])].join('\n'), [v]);
  const example = () => setV(Object.fromEntries(FIELDS.map((f) => [f.id, f.ph])));

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('opbrief.rig')}>
        <div className={styles.form}>
          {FIELDS.map((f) => (
            <label key={f.id} className={tool.field}>
              <span>{f.label}</span>
              <textarea rows={2} value={v[f.id] || ''} onChange={set(f.id)} placeholder={f.ph} />
              <small>{f.hint}</small>
            </label>
          ))}
          {vague && <p className={tool.err} role="status">“Working” is easier to build for when it can be counted. What number or time would tell you?</p>}
        </div>
        <div className={styles.out}>
          <p className={shared.label}>{filled} of {FIELDS.length} answered</p>
          <pre tabIndex={0}><code>{md}</code></pre>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('operation-brief.md', md, 'text/markdown')} disabled={!filled}><Download size={14} aria-hidden="true" /> Download</button>
            <button type="button" className={shared.btn} onClick={() => copy(md)} disabled={!filled}>{copied ? 'Copied' : 'Copy'}</button>
            <button type="button" className={shared.btn} onClick={example}><Wand2 size={14} aria-hidden="true" /> Fill with an example</button>
          </div>
          <p className={styles.fine}>The example is invented, to show the level of detail that helps. Nothing you write is sent anywhere.</p>
        </div>
      </div>
    </CloserFrame>
  );
}
