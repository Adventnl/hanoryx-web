import { useMemo, useState } from 'react';
import {
  Checkbox, Combobox, Field, FileDrop, NumberField, PasswordField, RadioGroup, RangeField, SearchField, Segmented,
  SelectField, Switch, TagInput, TextArea, TextField,
} from '..';

const ZONES = ['Africa/Cairo', 'Africa/Lagos', 'Africa/Nairobi', 'America/Chicago', 'America/Los_Angeles', 'America/New_York', 'America/Sao_Paulo', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/Berlin', 'Europe/London', 'Europe/Madrid', 'Pacific/Auckland', 'UTC'];
const WORDS = ['Audit trail', 'Cron expression', 'Dead-letter queue', 'Idempotency key', 'Least privilege', 'Runbook', 'Service level', 'Webhook'];

export function FieldDemo() {
  const [hex, setHex] = useState('#ff3333');
  const bad = hex && !/^#[0-9a-f]{6}$/i.test(hex);
  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '22rem' }}>
      <Field label="Brand colour" hint="Six hex digits, with the #." error={bad ? 'That is not a six-digit hex colour.' : undefined} required>
        {(props) => <input {...props} value={hex} onChange={(e) => setHex(e.target.value)} style={{ padding: '0.7rem 0.9rem', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(10,11,13,0.9)', color: '#fff', font: '0.82rem var(--font-mono)', borderRadius: 4 }} />}
      </Field>
      <span style={{ display: 'inline-block', width: '100%', height: '1.2rem', borderRadius: 4, background: bad ? 'transparent' : hex, border: '1px solid rgba(255,255,255,0.2)' }} aria-hidden="true" />
    </div>
  );
}

export function TextFieldDemo() {
  const [name, setName] = useState('');
  const error = name && name.length < 3 ? 'Use at least three characters.' : undefined;
  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '24rem' }}>
      <TextField label="Project name" hint="Shown on the dashboard." required value={name} onChange={(e) => setName(e.target.value)} error={error} placeholder="Example project" />
      <TextField label="Budget" prefix="$" suffix="per month" defaultValue="1200" inputMode="numeric" />
      <TextField label="Read-only reference" defaultValue="REF-0001-EXAMPLE" readOnly />
      <TextField label="Disabled" defaultValue="Not available" disabled />
    </div>
  );
}

export function TextAreaDemo() {
  return <div style={{ maxWidth: '28rem' }}><TextArea label="Describe the change" hint="Two sentences is plenty." maxLength={140} defaultValue="Moved the nightly export to 02:15 so it finishes before the first shift starts." /></div>;
}

export function NumberFieldDemo() {
  const [qty, setQty] = useState(3);
  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '14rem' }}>
      <NumberField label="Seats" min={1} max={12} value={qty} onChange={setQty} hint="Between 1 and 12." />
      <NumberField label="Ratio" min={1} max={2} step={0.05} defaultValue={1.25} />
    </div>
  );
}

export function SearchFieldDemo() {
  const [q, setQ] = useState('');
  const hits = useMemo(() => WORDS.filter((w) => w.toLowerCase().includes(q.trim().toLowerCase())), [q]);
  return (
    <div style={{ display: 'grid', gap: '0.8rem', maxWidth: '24rem' }}>
      <SearchField label="Find a term" value={q} onChange={setQ} count={hits.length} noun="terms" placeholder="Try “key” or “run”" />
      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'rgba(255,255,255,0.8)', font: '0.78rem/1.8 var(--font-mono)' }}>{hits.map((w) => <li key={w}>{w}</li>)}</ul>
    </div>
  );
}

export function PasswordFieldDemo() {
  return <div style={{ maxWidth: '22rem' }}><PasswordField label="New password" hint="At least 12 characters is a good start. Nothing here is sent anywhere." /></div>;
}

export function SelectFieldDemo() {
  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '20rem' }}>
      <SelectField label="Environment" defaultValue="staging" options={[{ value: 'dev', label: 'Development' }, { value: 'staging', label: 'Staging' }, { value: 'prod', label: 'Production' }, { value: 'legacy', label: 'Legacy (retired)', disabled: true }]} hint="Production asks for a second approval." />
      <SelectField label="Time zone" placeholder="Choose one…" defaultValue="" options={ZONES.slice(0, 6)} required />
    </div>
  );
}

export function ComboboxDemo() {
  const [zone, setZone] = useState('Europe/London');
  return (
    <div style={{ display: 'grid', gap: '0.8rem', maxWidth: '22rem' }}>
      <Combobox label="Time zone" options={ZONES} value={zone} onChange={setZone} hint="Type to filter; ↓ ↑ to move; Enter to choose." />
      <span style={{ font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>Chosen: {zone || 'none'}</span>
    </div>
  );
}

export function CheckboxDemo() {
  const [items, setItems] = useState({ a: true, b: false, c: false });
  const values = Object.values(items);
  const all = values.every(Boolean);
  const some = values.some(Boolean) && !all;
  const set = (k) => (on) => setItems((s) => ({ ...s, [k]: on }));
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <Checkbox label="Everything" hint="Selects or clears the three below." checked={all} indeterminate={some} onChange={(on) => setItems({ a: on, b: on, c: on })} />
      <div style={{ display: 'grid', gap: '0.35rem', paddingLeft: '1.9rem' }}>
        <Checkbox label="Send the weekly summary" checked={items.a} onChange={set('a')} />
        <Checkbox label="Send incident updates" checked={items.b} onChange={set('b')} />
        <Checkbox label="Send release notes" checked={items.c} onChange={set('c')} />
      </div>
      <Checkbox label="Disabled option" disabled />
    </div>
  );
}

export function RadioGroupDemo() {
  const [plan, setPlan] = useState('team');
  return (
    <div style={{ display: 'grid', gap: '1.2rem' }}>
      <RadioGroup legend="Support level" value={plan} onChange={setPlan} options={[{ value: 'self', label: 'Self-serve', hint: 'Documentation and the community.' }, { value: 'team', label: 'Team', hint: 'A named contact, weekday hours.' }, { value: 'care', label: 'Always on', hint: 'Out-of-hours cover.', disabled: true }]} />
      <RadioGroup legend="Density" defaultValue="comfortable" row options={['Compact', 'Comfortable', 'Spacious'].map((v) => ({ value: v.toLowerCase(), label: v }))} />
    </div>
  );
}

export function SwitchDemo() {
  return (
    <div style={{ display: 'grid', gap: '0.3rem' }}>
      <Switch label="Email me when a deploy fails" defaultChecked />
      <Switch label="Reduce motion in this view" />
      <Switch label="Beta features" disabled />
    </div>
  );
}

export function RangeFieldDemo() {
  const [ms, setMs] = useState(240);
  return (
    <div style={{ display: 'grid', gap: '1.2rem', maxWidth: '24rem' }}>
      <RangeField label="Duration" min={0} max={1000} step={20} value={ms} onChange={setMs} format={(n) => `${n} ms`} marks={['0', '500', '1000 ms']} hint="Most interface motion sits between 150 and 400." />
      <RangeField label="Volume" defaultValue={35} format={(n) => `${n}%`} />
    </div>
  );
}

export function SegmentedDemo() {
  const [view, setView] = useState('week');
  return (
    <div style={{ display: 'grid', gap: '0.8rem', justifyItems: 'start' }}>
      <Segmented label="Range" options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} value={view} onChange={setView} />
      <span style={{ font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>Showing: {view}</span>
    </div>
  );
}

export function TagInputDemo() {
  return <div style={{ maxWidth: '28rem' }}><TagInput label="Topics" hint="Enter or comma adds; Backspace takes the last one back." defaultValue={['security', 'handover']} max={6} /></div>;
}

export function FileDropDemo() {
  return <div style={{ maxWidth: '28rem' }}><FileDrop label="Choose files" hint="or drop them here — they stay in your browser" /></div>;
}
