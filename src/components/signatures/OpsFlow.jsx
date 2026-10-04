import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Play, RotateCcw } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { Glyph } from '../fx/Glyph';
import { fx } from '../../utils/fx';
import styles from './OpsFlow.module.css';

const STEP_MS = 1150;

/**
 * "The life of a request." Choose a kind of request and send it: a token
 * glides through four stages, the request card fills in field by field and an
 * append-only record writes a line at each stage. It is an illustration of a
 * way of working, not a recording of any real system.
 *
 *   stages: [{ id, title, body, glyph, field: { k, v } }]
 *   kinds:  [{ id, label, lines: [one line per stage] }]
 */
export default function OpsFlow({ eyebrow, title, intro, stages, kinds, note }) {
  const n = stages.length;
  const last = n - 1;
  const [kindId, setKindId] = useState(kinds[0].id);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [sent, setSent] = useState(0);
  const kind = kinds.find((k) => k.id === kindId);
  const done = step === last && !running;

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setTimeout(() => {
      if (step < last) setStep(step + 1);
      else {
        setRunning(false);
        setSent((c) => c + 1);
      }
    }, step < 0 ? 200 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, step, last]);

  const send = () => {
    setStep(-1);
    setRunning(true);
  };
  const pickKind = (id) => {
    if (running) return;
    setKindId(id);
    setStep(-1);
  };
  const lines = step >= 0 ? kind.lines.slice(0, step + 1) : [];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="scan" />
      <div className={styles.bench} {...fx('ops.request-flow')}>
        <div className={styles.controls}>
          <GlideTabs
            tabs={kinds.map((k) => ({ id: k.id, label: k.label }))}
            value={kindId}
            onChange={pickKind}
            label="Kind of request"
            idPrefix="ops-kind"
            panels={false}
            {...fx('ops.kind-tabs')}
          />
          <button type="button" className={styles.send} onClick={send} disabled={running} data-cursor="link">
            {done ? <RotateCcw size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            <span>{running ? 'In flight…' : done ? 'Send another' : 'Send request'}</span>
          </button>
        </div>

        <div className={styles.pipe} style={{ '--n': n, '--at': Math.max(step, 0) }} data-state={step < 0 ? 'idle' : done ? 'done' : 'run'}>
          <span className={styles.track} aria-hidden="true" {...fx('ops.stage-fill')}>
            <span className={styles.fill} style={{ '--fillp': step <= 0 ? 0 : step / last }} />
          </span>
          <span className={styles.token} aria-hidden="true" {...fx('ops.pipe-token')} />
          {stages.map((s, i) => (
            <div key={s.id} className={clsx(styles.stage, i <= step && styles.passed, i === step && styles.here)}>
              <span className={styles.node}><Glyph name={s.glyph} size={22} /></span>
              <span className={styles.stageNum}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.stageTitle}>{s.title}</h3>
              <p className={styles.stageBody}>{s.body}</p>
            </div>
          ))}
        </div>

        <div className={styles.lower}>
          <div className={styles.card} role="group" aria-label="The request" {...fx('ops.request-card')}>
            <div className={styles.cardHead}>
              <span>THE REQUEST</span>
              <span className={styles.count}>SENT {String(sent).padStart(2, '0')}</span>
            </div>
            <dl className={styles.fields}>
              {stages.map((s, i) => (
                <div key={s.id} className={clsx(styles.field, i <= step && styles.filled)}>
                  <dt>{s.field.k}</dt>
                  <dd>{i <= step ? s.field.v : '—'}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.record} role="log" aria-label="The record" aria-live="polite" {...fx('ops.record-log')}>
            <div className={styles.cardHead}>
              <span>THE RECORD</span>
              <span className={styles.count}>APPEND-ONLY</span>
            </div>
            <ol>
              {lines.map((line, i) => (
                <li key={`${kind.id}-${i}`} style={{ '--i': i }}>
                  <span className={styles.stamp}>T+{(i * 1.1).toFixed(1)}s</span>
                  <span>{line}</span>
                </li>
              ))}
              {lines.length === 0 && <li className={styles.empty}>Nothing written yet. Send a request.</li>}
            </ol>
          </div>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
