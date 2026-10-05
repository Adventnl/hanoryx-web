import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle, Copy } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useCopy } from '../../hooks/useCopy';
import { describe, expand, fieldLabels, nextRuns, parseCron, warnings } from '../../utils/cron';
import { fx } from '../../utils/fx';
import tool from './tool.module.css';
import styles from './CronExplainer.module.css';

const PRESETS = [
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Weekdays at 09:30', value: '30 9 * * 1-5' },
  { label: 'Every night at 02:15', value: '15 2 * * *' },
  { label: 'First of the month', value: '0 6 1 * *' },
  { label: 'Mondays and Thursdays', value: '45 17 * * MON,THU' },
  { label: 'Quarter past, each hour', value: '15 * * * *' },
  { label: 'Every Sunday at midnight', value: '@weekly' },
];

const HEADS = ['minute', 'hour', 'day of month', 'month', 'day of week'];

/** Paste a schedule, read it in plain English, and see the next times it will
 *  run — in your own time zone or in UTC. It explains; it runs nothing. */
export default function CronExplainer({ eyebrow, title, intro, note }) {
  const [text, setText] = useState('30 9 * * 1-5');
  const [utc, setUtc] = useState(false);
  const [from, setFrom] = useState(() => Date.now());
  const [copied, copy] = useCopy();
  const parsed = useMemo(() => parseCron(text), [text]);
  const runs = useMemo(() => (parsed.ok ? nextRuns(parsed, from, 8, utc) : []), [parsed, from, utc]);
  const notes = useMemo(() => (parsed.ok ? warnings(parsed) : []), [parsed]);
  const zone = utc ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone;
  const fmt = useMemo(() => new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: utc ? 'UTC' : undefined }), [utc]);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={tool.rig} {...fx('cron.rig')}>
        <div className={tool.stack}>
          <label className={tool.field}>
            <span>A schedule</span>
            <input className={styles.expr} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} autoComplete="off" aria-invalid={!parsed.ok} aria-describedby="cron-help" />
            <small id="cron-help">Five fields: minute, hour, day of month, month, day of week. Also reads @daily, @weekly and the like.</small>
          </label>
          <div className={styles.legend} aria-hidden="true">{HEADS.map((h) => <span key={h}>{h}</span>)}</div>
          <div className={tool.chips} role="group" aria-label="Examples" {...fx('cron.presets')}>
            {PRESETS.map((p) => <button key={p.value} type="button" className={clsx(tool.chip, text === p.value && tool.chipOn)} onClick={() => setText(p.value)}>{p.label}</button>)}
          </div>
          {!parsed.ok && <p className={tool.err} role="alert">{parsed.error}</p>}
          {parsed.ok && (
            <table className={clsx(tool.table, styles.fields)} {...fx('cron.fields')}>
              <thead><tr><th scope="col">Field</th><th scope="col">You wrote</th><th scope="col">Which means</th></tr></thead>
              <tbody>
                {fieldLabels.map((label, i) => (
                  <tr key={label}><th scope="row">{label}</th><td><code>{parsed.fields[i]}</code></td><td>{parsed.fields[i] === '*' ? 'every one' : expand(parsed, i)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={tool.out}>
          <div className={clsx(tool.panel, styles.say)} aria-live="polite" {...fx('cron.sentence')}>
            <p className={tool.k}>In plain English</p>
            <p className={styles.sentence}>{parsed.ok ? describe(parsed) : '—'}</p>
          </div>
          {notes.length > 0 && (
            <ul className={styles.notes} {...fx('cron.cautions')}>
              {notes.map((n) => <li key={n}><AlertTriangle size={14} aria-hidden="true" /><span>{n}</span></li>)}
            </ul>
          )}
          <div className={tool.panel} {...fx('cron.next-runs')}>
            <div className={tool.row}>
              <p className={tool.k}>Next runs · {zone}</p>
              <span className={styles.toggle} role="group" aria-label="Time zone">
                <button type="button" aria-pressed={!utc} className={clsx(styles.tz, !utc && styles.tzOn)} onClick={() => setUtc(false)}>Mine</button>
                <button type="button" aria-pressed={utc} className={clsx(styles.tz, utc && styles.tzOn)} onClick={() => setUtc(true)}>UTC</button>
              </span>
            </div>
            {parsed.ok && runs.length === 0 && <p className={tool.sm}>This schedule does not run in the next several years. Check the month and day fields.</p>}
            <ol className={styles.runs}>
              {runs.map((t, i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><time dateTime={new Date(t).toISOString()}>{fmt.format(t)}</time></li>)}
            </ol>
            <div className={tool.row}>
              <button type="button" className={styles.btn} onClick={() => setFrom(Date.now())}>Recount from now</button>
              <button type="button" className={styles.btn} onClick={() => copy(`${parsed.ok ? parsed.text : text}  # ${parsed.ok ? describe(parsed) : ''}`)} disabled={!parsed.ok}><Copy size={13} aria-hidden="true" /> {copied ? 'Copied' : 'Copy with comment'}</button>
            </div>
          </div>
        </div>
      </div>
      {note && <p className={tool.note}>{note}</p>}
    </div>
  );
}
