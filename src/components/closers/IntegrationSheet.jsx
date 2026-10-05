import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './IntegrationSheet.module.css';

const DIRECTIONS = ['A sends to B', 'B sends to A', 'Both ways'];
const TRIGGERS = ['When something happens (an event)', 'On a schedule', 'When the other side asks'];
const FAILURES = ['Retry with back-off, then alert a person', 'Queue it and replay when the other side returns', 'Stop, and show an error to the person who caused it'];
const OWNERS = ['The sender', 'The receiver', 'Both, with a named contact each'];
const AUTH = ['A secret key per side, rotated on a schedule', 'Short-lived tokens', 'Signed requests', 'An allow-list of addresses, plus a key'];

/** The agreement that decides whether an integration survives its first bad day.
 *  Choose what is sent, when, what happens when it fails and who owns it; out
 *  comes a one-page contract to put in front of both teams. */
export default function IntegrationSheet({ tag, title, lede, onward }) {
  const [v, setV] = useState({ a: 'The shop', b: 'The accounting package', direction: DIRECTIONS[0], what: 'Paid orders: id, total, currency, date', trigger: TRIGGERS[0], volume: '200 a day, 2,000 on a busy one', failure: FAILURES[0], owner: OWNERS[2], auth: AUTH[0], notice: '60' });
  const [copied, copy] = useCopy();
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const md = useMemo(() => [
    `# Integration: ${v.a || 'A'} ↔ ${v.b || 'B'}`, '',
    '## Purpose', `${v.direction}. ${v.what || '—'}.`, '',
    '## Trigger', `${v.trigger}.`, '',
    '## Volume', `${v.volume || '—'}. Both sides agree to tell the other before it changes by an order of magnitude.`, '',
    '## When it fails', `${v.failure}. Every failure is logged with a request id both sides can quote.`, '',
    '## Repeats', 'A message may arrive more than once. The receiver recognises a repeat by its id and does the work once.', '',
    '## Ownership', `${v.owner}. Each side names a person and a way to reach them out of hours.`, '',
    '## Security', `${v.auth}. Nothing travels in the clear. Personal data is limited to what the purpose needs.`, '',
    '## Changing it', `Either side gives at least ${v.notice || '—'} days’ notice before removing or changing a field. Additions are not breaking changes.`, '',
  ].join('\n'), [v]);

  const select = (k, label, options) => <label className={tool.field}><span>{label}</span><select value={v[k]} onChange={set(k)}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>;

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('integration.rig')}>
        <div className={styles.form}>
          <div className={tool.pair}>
            <label className={tool.field}><span>Side A</span><input value={v.a} onChange={set('a')} autoComplete="off" /></label>
            <label className={tool.field}><span>Side B</span><input value={v.b} onChange={set('b')} autoComplete="off" /></label>
          </div>
          {select('direction', 'Direction', DIRECTIONS)}
          <label className={tool.field}><span>What is sent</span><input value={v.what} onChange={set('what')} autoComplete="off" /></label>
          {select('trigger', 'It happens', TRIGGERS)}
          <label className={tool.field}><span>How much</span><input value={v.volume} onChange={set('volume')} autoComplete="off" /></label>
          {select('failure', 'When it fails', FAILURES)}
          {select('owner', 'Who owns the interface', OWNERS)}
          {select('auth', 'How each side proves itself', AUTH)}
          <label className={tool.field}><span>Notice before a breaking change <b>{v.notice} days</b></span><input type="range" min={14} max={180} step={7} value={v.notice} onChange={set('notice')} /></label>
        </div>
        <div className={styles.out}>
          <p className={shared.label}>integration-contract.md</p>
          <pre tabIndex={0}><code>{md}</code></pre>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('integration-contract.md', md, 'text/markdown')}><Download size={14} aria-hidden="true" /> Download</button>
            <button type="button" className={shared.btn} onClick={() => copy(md)}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
