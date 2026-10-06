import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarGroup, Badge, BarList, Chip, CodeBlock, DataTable, DescriptionList, Sparkline, Stat, Timeline, Tree } from '..';

const JOBS = [
  { id: 'j1', job: 'Nightly export', owner: 'Operations', every: 'Daily', mins: 12, state: 'Healthy' },
  { id: 'j2', job: 'Reminder emails', owner: 'Support', every: 'Hourly', mins: 2, state: 'Healthy' },
  { id: 'j3', job: 'Archive old records', owner: 'Operations', every: 'Weekly', mins: 48, state: 'Slow' },
  { id: 'j4', job: 'Rebuild the search index', owner: 'Platform', every: 'Daily', mins: 9, state: 'Healthy' },
  { id: 'j5', job: 'Sync the supplier list', owner: 'Commerce', every: 'Every 15 min', mins: 1, state: 'Failing' },
];

export function BadgeDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
      <Badge>Neutral</Badge>
      <Badge tone="red">New</Badge>
      <Badge tone="solid">Beta</Badge>
      <Badge tone="outline">Draft</Badge>
      <Badge tone="success" dot>Healthy</Badge>
      <Badge tone="warning" dot>Slow</Badge>
    </div>
  );
}

export function ChipDemo() {
  const [on, setOn] = useState(['Operations']);
  const [tags, setTags] = useState(['security', 'handover', 'roles']);
  const toggle = (name) => setOn((l) => (l.includes(name) ? l.filter((x) => x !== name) : [...l, name]));
  return (
    <div style={{ display: 'grid', gap: '1.2rem' }}>
      <div role="group" aria-label="Filter by owner" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {['Operations', 'Support', 'Platform', 'Commerce'].map((n) => <Chip key={n} selected={on.includes(n)} onClick={() => toggle(n)}>{n}</Chip>)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {tags.map((t) => <Chip key={t} onRemove={() => setTags((l) => l.filter((x) => x !== t))}>{t}</Chip>)}
        {!tags.length && <span style={{ font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>All removed. Reload to bring them back.</span>}
      </div>
    </div>
  );
}

export function AvatarDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.6rem', alignItems: 'center' }}>
      <Avatar name="Alex Example" />
      <Avatar name="Sam Sample" tone="red" />
      <Avatar name="Platform team" shape="square" />
      <Avatar name="Rin Placeholder" size="3.4rem" />
      <AvatarGroup names={['Alex Example', 'Sam Sample', 'Rin Placeholder', 'Kai Demo', 'Noor Test', 'Lee Mock']} max={4} />
    </div>
  );
}

export function StatDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', gap: '0.8rem' }}>
      <Stat label="Jobs on time" value="96" unit="%" change={2} changeLabel="vs. last week" note="Sample figures." />
      <Stat label="Median runtime" value="9" unit="min" change={-14} changeLabel="vs. last week" />
      <Stat label="Open incidents" value="0" change={0} />
    </div>
  );
}

export function DataTableDemo() {
  const [chosen, setChosen] = useState([]);
  return (
    <div style={{ display: 'grid', gap: '0.7rem' }}>
      <DataTable
        caption="Scheduled jobs (sample data)"
        rows={JOBS}
        selectable
        onSelect={setChosen}
        columns={[
          { key: 'job', label: 'Job', sortable: true },
          { key: 'owner', label: 'Owner', sortable: true },
          { key: 'every', label: 'Runs' },
          { key: 'mins', label: 'Minutes', sortable: true, align: 'right' },
          { key: 'state', label: 'State', sortable: true, render: (r) => <Badge tone={r.state === 'Healthy' ? 'success' : r.state === 'Slow' ? 'warning' : 'red'} dot>{r.state}</Badge> },
        ]}
      />
      <span style={{ font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>{chosen.length} selected</span>
    </div>
  );
}

export function DescriptionListDemo() {
  return (
    <DescriptionList
      items={[
        { term: 'Service', detail: 'Order intake' },
        { term: 'Owner', detail: 'Commerce team' },
        { term: 'On call', detail: 'Weekdays, 08:00–18:00' },
        { term: 'Runbook', detail: <Link to="/insights/runbooks" data-cursor="link" style={{ color: '#fff' }}>Runbooks people actually use</Link> },
      ]}
    />
  );
}

export function TimelineDemo() {
  return (
    <Timeline
      items={[
        { when: 'Phase one', title: 'Shape', body: 'Work out the problem and what to leave out.', done: true },
        { when: 'Phase two', title: 'Build', body: 'Small pieces that run, riskiest first.', done: true },
        { when: 'Phase three', title: 'Run', body: 'Watch it, patch it, answer questions.' },
        { when: 'Phase four', title: 'Retire', body: 'Switch it off safely and keep what must be kept.' },
      ]}
    />
  );
}

export function TreeDemo() {
  const [last, setLast] = useState('none');
  return (
    <div style={{ display: 'grid', gap: '0.8rem', maxWidth: '22rem' }}>
      <Tree
        label="Project files"
        defaultOpen={['src']}
        onSelect={(n) => setLast(n.label)}
        nodes={[
          { id: 'src', label: 'src', children: [{ id: 'components', label: 'components', children: [{ id: 'button', label: 'Button.jsx' }, { id: 'card', label: 'Card.jsx' }] }, { id: 'data', label: 'data', children: [{ id: 'pages', label: 'pages.js' }] }, { id: 'main', label: 'main.jsx' }] },
          { id: 'public', label: 'public', children: [{ id: 'icon', label: 'favicon.svg' }] },
          { id: 'readme', label: 'README.md' },
        ]}
      />
      <span style={{ font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>Chosen: {last}</span>
    </div>
  );
}

export function CodeBlockDemo() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <CodeBlock
        filename="retry.js"
        lines
        code={`// retry a call, waiting longer each time\nasync function withRetry(call, attempts = 4) {\n  for (let i = 0; i < attempts; i += 1) {\n    try {\n      return await call();\n    } catch (error) {\n      if (i === attempts - 1) throw error;\n      await new Promise((r) => setTimeout(r, 2 ** i * 250));\n    }\n  }\n}`}
      />
      <CodeBlock language="json" filename="entry.json" code={`{\n  "who": "service-account",\n  "what": "order.refund",\n  "outcome": "ok",\n  "attempts": 1\n}`} />
    </div>
  );
}

export function SparklineDemo() {
  return (
    <div style={{ display: 'grid', gap: '1.2rem', maxWidth: '22rem' }}>
      <Sparkline label="Response time (sample)" unit=" ms" data={[210, 190, 205, 230, 180, 170, 175, 160, 150, 155, 140, 138]} />
      <Sparkline label="Queue depth (sample)" data={[2, 3, 2, 5, 11, 24, 18, 9, 4, 3, 2, 2]} />
    </div>
  );
}

export function BarListDemo() {
  return <div style={{ maxWidth: '30rem' }}><BarList label="Jobs by owner (sample)" items={[{ label: 'Operations', value: 12 }, { label: 'Platform', value: 8 }, { label: 'Support', value: 5 }, { label: 'Commerce', value: 3 }]} /></div>;
}
