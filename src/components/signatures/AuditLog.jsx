import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { fx } from '../../utils/fx';
import styles from './AuditLog.module.css';

/**
 * An audit trail is judged by the questions it can answer. Choose which fields
 * a log records; the questions people actually ask light up as answerable — or
 * go dark, with the missing field named.
 *
 *   fields:    [{ id, label, sample }]
 *   questions: [{ id, text, needs: [fieldId] }]
 */
export default function AuditLog({ eyebrow, title, intro, fields = [], questions = [], note }) {
  const [on, setOn] = useState(() => new Set(['when', 'what']));
  const toggle = (id) => setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const cols = fields.filter((f) => on.has(f.id));
  const answerable = useMemo(() => questions.filter((q) => q.needs.every((n) => on.has(n))).length, [on, questions]);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('audit.rig')}>
        <fieldset className={styles.fields} {...fx('audit.fields')}>
          <legend>What each entry records</legend>
          <div className={styles.chips}>
            {fields.map((f) => (
              <label key={f.id} className={clsx(styles.chip, on.has(f.id) && styles.on)}>
                <input type="checkbox" checked={on.has(f.id)} onChange={() => toggle(f.id)} />
                {f.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.table} role="region" aria-label="A sample of the log, with only the fields you chose" tabIndex={0} {...fx('audit.sample-log')}>
          <table>
            <thead><tr>{cols.map((c) => <th key={c.id} scope="col">{c.label}</th>)}</tr></thead>
            <tbody>
              {[0, 1, 2].map((r) => (
                <tr key={r}>{cols.map((c) => <td key={c.id}>{c.sample[r]}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.score} role="status" aria-live="polite">
          <span className={styles.big}>{answerable}<small>/{questions.length}</small></span>
          <span>questions this log can answer</span>
        </div>

        <ul className={styles.qs} {...fx('audit.questions')}>
          {questions.map((q) => {
            const missing = q.needs.filter((n) => !on.has(n));
            const ok = missing.length === 0;
            return (
              <li key={q.id} className={clsx(styles.q, ok ? styles.ok : styles.no)}>
                <span className={styles.mark}>{ok ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}</span>
                <span className={styles.text}>{q.text}</span>
                <span className={styles.need}>{ok ? 'Answerable' : `Needs: ${missing.map((m) => fields.find((f) => f.id === m).label.toLowerCase()).join(', ')}`}</span>
              </li>
            );
          })}
        </ul>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
