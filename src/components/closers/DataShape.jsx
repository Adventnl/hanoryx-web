import { useState } from 'react';
import { Link } from 'react-router-dom';
import CloserFrame from './CloserFrame';
import { BarList, Badge, DataTable, DescriptionList, Sparkline, Stat, Timeline, Tree } from '../kit';
import { fx } from '../../utils/fx';
import styles from './DataShape.module.css';

/* Sample data, clearly labelled as such. */
const SAMPLE = {
  trend: <Sparkline label="Response time, sample data" unit=" ms" data={[210, 190, 205, 230, 180, 170, 175, 160, 150, 155, 140, 138]} width={320} height={80} />,
  compare: <BarList label="Jobs by owner, sample data" items={[{ label: 'Operations', value: 12 }, { label: 'Platform', value: 8 }, { label: 'Support', value: 5 }, { label: 'Commerce', value: 3 }]} />,
  records: (
    <DataTable
      caption="Scheduled jobs (sample data)"
      rows={[{ id: 1, job: 'Nightly export', mins: 12, state: 'Healthy' }, { id: 2, job: 'Archive old records', mins: 48, state: 'Slow' }, { id: 3, job: 'Reminder emails', mins: 2, state: 'Healthy' }]}
      columns={[{ key: 'job', label: 'Job', sortable: true }, { key: 'mins', label: 'Minutes', sortable: true, align: 'right' }, { key: 'state', label: 'State', render: (r) => <Badge tone={r.state === 'Healthy' ? 'success' : 'warning'} dot>{r.state}</Badge> }]}
    />
  ),
  facts: <DescriptionList items={[{ term: 'Service', detail: 'Order intake' }, { term: 'Owner', detail: 'Commerce team' }, { term: 'On call', detail: 'Weekdays, 08:00–18:00' }]} />,
  steps: <Timeline items={[{ when: 'First', title: 'Shape', done: true }, { when: 'Then', title: 'Build', done: true }, { when: 'Now', title: 'Run' }, { when: 'Last', title: 'Retire' }]} />,
  nested: <Tree label="Folders, sample data" defaultOpen={['docs']} nodes={[{ id: 'docs', label: 'docs', children: [{ id: 'a', label: 'handover.md' }, { id: 'b', label: 'runbook.md' }] }, { id: 'src', label: 'src', children: [{ id: 'c', label: 'main.jsx' }] }]} />,
  one: <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '0.8rem' }}><Stat label="Jobs on time" value="96" unit="%" change={2} changeLabel="vs. last week" /><Stat label="Open incidents" value="0" /></div>,
};

/**
 * “Show this data.” Pick the shape your data has and the page shows the component
 * that suits it, drawn with sample data, with the reason — and the common wrong
 * choice and why it fails.
 *
 *   shapes: [{ id, label, sees, use, why, notThis, to }]   id is a key of SAMPLE
 */
export default function DataShape({ tag, title, lede, shapes = [], onward }) {
  const [id, setId] = useState(shapes[0]?.id);
  const s = shapes.find((x) => x.id === id) || shapes[0];

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('shape.rig')}>
        <div className={styles.opts} role="radiogroup" aria-label="The shape of your data">
          {shapes.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={x.id === s?.id} className={styles.opt} onClick={() => setId(x.id)}>
              <b>{x.label}</b>
              <small>{x.sees}</small>
            </button>
          ))}
        </div>
        {s && (
          <div className={styles.out} role="status" aria-live="polite">
            <div className={styles.stage} key={s.id} {...fx('shape.stage')}>{SAMPLE[s.id]}</div>
            <div className={styles.why}>
              <span className={styles.pick}>Use {s.use}</span>
              <p>{s.why}</p>
              <p><b>Not this:</b> {s.notThis}</p>
              {s.to && <p><Link to={s.to} data-cursor="link" style={{ color: 'var(--c-white)' }}>See {s.use} in the gallery →</Link></p>}
            </div>
            <p className={styles.fine}>All figures here are sample data, made up for the picture.</p>
          </div>
        )}
      </div>
    </CloserFrame>
  );
}
