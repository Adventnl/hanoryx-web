import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Play, RotateCcw } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { fx } from '../../utils/fx';
import styles from './OrderPath.module.css';

const STEP_MS = 1050;

/**
 * An order as a state machine. Pick a scenario and run it: a token walks the
 * path through the states (it can double back, or stop at a terminal state),
 * each state explains itself, and a small ledger says whether anything settled.
 * A teaching diagram of a workflow design — not a trace of a real order.
 *
 *   nodes:     [{ id, title, note, x, y, terminal? }]   (x, y in 0..100)
 *   edges:     [[idA, idB]]
 *   scenarios: [{ id, label, summary, path: [ids], ledger }]
 */
export default function OrderPath({ eyebrow, title, intro, nodes, edges, scenarios, note }) {
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const last = scenario.path.length - 1;
  const done = step === last && !running;
  const currentId = step >= 0 ? scenario.path[step] : null;
  const current = currentId ? byId[currentId] : null;
  const visited = new Set(scenario.path.slice(0, step + 1));
  const trail = scenario.path.slice(0, step + 1);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setTimeout(() => {
      if (step < last) setStep(step + 1);
      else setRunning(false);
    }, step < 0 ? 150 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, step, last]);

  const run = () => {
    setStep(-1);
    setRunning(true);
  };
  const pick = (id) => {
    if (running) return;
    setScenarioId(id);
    setStep(-1);
  };
  const tokenNode = current || byId[scenario.path[0]];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.bench} {...fx('commerce.order-state-machine')}>
        <div className={styles.controls}>
          <GlideTabs tabs={scenarios.map((s) => ({ id: s.id, label: s.label }))} value={scenarioId} onChange={pick} label="Scenario" idPrefix="order-scn" {...fx('order.scenario-tabs')} />
          <button type="button" className={styles.run} onClick={run} disabled={running} data-cursor="link">
            {done ? <RotateCcw size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            <span>{running ? 'Running…' : done ? 'Run again' : 'Run the order'}</span>
          </button>
        </div>

        <div className={styles.stageWrap}>
          <div className={styles.diagram} data-state={step < 0 ? 'idle' : done ? 'done' : 'run'}>
            <svg className={styles.edges} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" {...fx('order.edges')}>
              {edges.map(([a, b]) => {
                const A = byId[a];
                const B = byId[b];
                const used = trail.some((id, i) => i > 0 && ((trail[i - 1] === a && id === b) || (trail[i - 1] === b && id === a)));
                return (
                  <line key={`${a}-${b}`} className={clsx(styles.edge, used && styles.used)} x1={A.x} y1={A.y} x2={B.x} y2={B.y} vectorEffect="non-scaling-stroke" />
                );
              })}
            </svg>
            {nodes.map((n) => (
              <div
                key={n.id}
                className={clsx(styles.node, visited.has(n.id) && styles.seen, currentId === n.id && styles.now, n.terminal && styles.terminal)}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                {...fx('order.state-node')}
              >
                <span className={styles.nodeName}>{n.title}</span>
              </div>
            ))}
            <span className={styles.token} style={{ left: `${tokenNode.x}%`, top: `${tokenNode.y}%` }} aria-hidden="true" {...fx('order.token')} />
          </div>

          <div className={styles.side}>
            <div className={styles.explain} aria-live="polite" {...fx('order.explain')}>
              <span className={styles.kicker}>{current ? `STATE ${String(step + 1).padStart(2, '0')} / ${String(scenario.path.length).padStart(2, '0')}` : 'READY'}</span>
              <h3 className={styles.stateTitle}>{current ? current.title : scenario.label}</h3>
              <p className={styles.stateNote}>{current ? current.note : scenario.summary}</p>
            </div>
            <div className={clsx(styles.ledger, done && styles.ledgerOn)} {...fx('order.ledger')}>
              <span>LEDGER</span>
              <strong>{done ? scenario.ledger : '—'}</strong>
            </div>
          </div>
        </div>
        {note && <p className={styles.caption}>{note}</p>}
      </div>
    </div>
  );
}
