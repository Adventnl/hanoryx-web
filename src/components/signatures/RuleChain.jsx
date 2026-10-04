import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { fx } from '../../utils/fx';
import styles from './RuleChain.module.css';

const STEP_MS = 850;

function Picker({ label, legend, options, value, onChange, disabled }) {
  return (
    <fieldset className={styles.picker}>
      <legend>
        <b>{label}</b>
        <span>{legend}</span>
      </legend>
      <div className={styles.options}>
        {options.map((o) => (
          <label key={o.id} className={clsx(styles.option, value === o.id && styles.optionOn)}>
            <input type="radio" name={label} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} disabled={disabled} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * A rule you can assemble and run. Choose a trigger, a condition and an action,
 * decide whether the condition holds, then run it: a pulse travels WHEN → IF →
 * THEN → LOG and the record appends a line for every run — including the runs
 * where the rule stops cleanly. Nothing real is triggered; it is a model.
 *
 *   triggers/conditions/actions: [{ id, label }]
 */
export default function RuleChain({ eyebrow, title, intro, triggers, conditions, actions, note }) {
  const [when, setWhen] = useState(triggers[0].id);
  const [cond, setCond] = useState(conditions[0].id);
  const [then, setThen] = useState(actions[0].id);
  const [holds, setHolds] = useState(true);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [record, setRecord] = useState({ count: 0, items: [] });

  const label = (list, id) => list.find((o) => o.id === id).label;
  const runText = holds
    ? `${label(triggers, when)} → ${label(conditions, cond)} held → ${label(actions, then)} (ran once)`
    : `${label(triggers, when)} → ${label(conditions, cond)} did not hold → stopped, decision recorded`;

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
        return;
      }
      setRunning(false);
      setRecord((prev) => ({ count: prev.count + 1, items: [...prev.items, { n: prev.count + 1, text: runText }].slice(-6) }));
    }, step < 0 ? 120 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, step, runText]);

  const run = () => {
    setStep(-1);
    setRunning(true);
  };
  const blocks = [
    { id: 'when', k: 'WHEN', v: label(triggers, when), glyph: 'spark' },
    { id: 'if', k: 'IF', v: `${label(conditions, cond)} ${holds ? '✓' : '✕'}`, glyph: 'gate' },
    { id: 'then', k: 'THEN', v: holds ? label(actions, then) : 'skipped', glyph: 'loop', skipped: !holds },
    { id: 'log', k: 'LOG', v: 'run recorded', glyph: 'doc' },
  ];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('automation.rule-builder')}>
        <div className={styles.pickers} {...fx('rule.pickers')}>
          <Picker label="WHEN" legend="A trigger" options={triggers} value={when} onChange={setWhen} disabled={running} />
          <Picker label="IF" legend="A guard" options={conditions} value={cond} onChange={setCond} disabled={running} />
          <Picker label="THEN" legend="An action" options={actions} value={then} onChange={setThen} disabled={running} />
        </div>

        <div className={styles.runbar}>
          <label className={styles.toggle} {...fx('rule.condition-switch')}>
            <input type="checkbox" checked={holds} onChange={(e) => setHolds(e.target.checked)} disabled={running} />
            <span className={styles.switch} aria-hidden="true"><i /></span>
            <span>The condition holds</span>
          </label>
          <button type="button" className={styles.run} onClick={run} disabled={running} data-cursor="link">
            <Play size={14} aria-hidden="true" />
            <span>{running ? 'Running…' : 'Run the rule'}</span>
          </button>
        </div>

        <div className={styles.chain} data-step={step} {...fx('rule.chain-blocks')}>
          <span className={styles.pulse} style={{ '--at': Math.max(step, 0) }} aria-hidden="true" {...fx('rule.pulse')} />
          {blocks.map((b, i) => (
            <div key={b.id} className={clsx(styles.block, i <= step && styles.lit, i === step && styles.now, b.skipped && i <= step && styles.skipped)}>
              <Glyph name={b.glyph} size={22} className={styles.blockGlyph} />
              <span className={styles.blockK}>{b.k}</span>
              <span className={styles.blockV}>{b.v}</span>
            </div>
          ))}
        </div>

        <div className={styles.log} role="log" aria-label="Run record" aria-live="polite" {...fx('rule.run-record')}>
          <div className={styles.logHead}><span>RUN RECORD</span><span>APPEND-ONLY</span></div>
          <ol>
            {record.items.length === 0 && <li className={styles.empty}>No runs yet. Assemble a rule and run it.</li>}
            {record.items.map((r) => (
              <li key={r.n}>
                <span className={styles.runN}>RUN {String(r.n).padStart(3, '0')}</span>
                <span>{r.text}</span>
              </li>
            ))}
          </ol>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
