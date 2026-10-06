import { useState } from 'react';
import { Bold, Italic, Link2, List, Underline } from 'lucide-react';
import { Breadcrumbs, DropdownMenu, OnThisPage, Pagination, SideNav, Stepper, Tabs, Toolbar, useToast } from '..';

const btn = { padding: '0.6rem 1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, background: 'transparent', color: '#fff', font: '0.6rem var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' };

export function BreadcrumbsDemo() {
  return (
    <div style={{ display: 'grid', gap: '1.2rem' }}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Development', to: '/north' }, { label: 'Components', to: '/north/components' }, { label: 'Navigation' }]} />
      <Breadcrumbs label="Breadcrumb, short" items={[{ label: 'Legal', to: '/legal' }, { label: 'Privacy' }]} />
    </div>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(6);
  return (
    <div style={{ display: 'grid', gap: '0.8rem' }}>
      <Pagination page={page} pages={20} onChange={setPage} />
      <span style={{ font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>Page {page} of 20</span>
      <Pagination defaultPage={2} pages={4} label="Pagination, short" />
    </div>
  );
}

export function StepperDemo() {
  const [step, setStep] = useState(1);
  const steps = [{ title: 'Details', hint: 'Who and what' }, { title: 'Review', hint: 'Check it over' }, { title: 'Confirm', hint: 'Make it so' }, { title: 'Done', hint: 'Nothing left' }];
  return (
    <div style={{ display: 'grid', gap: '1.4rem' }}>
      <Stepper steps={steps} current={step} label="Setup progress" />
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button type="button" style={btn} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
        <button type="button" style={btn} onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}>Next</button>
      </div>
    </div>
  );
}

export function TabsDemo() {
  return (
    <Tabs
      label="About the service"
      tabs={[
        { id: 'what', label: 'What it does', content: <p style={{ margin: 0 }}>Receives an order once, however many times the network repeats it, and passes it on exactly once.</p> },
        { id: 'run', label: 'Running it', content: <p style={{ margin: 0 }}>One process, one database table, one alert: the backlog of orders waiting longer than five minutes.</p> },
        { id: 'change', label: 'Changing it', content: <p style={{ margin: 0 }}>Changes go out behind a switch and can be undone in under a minute. The runbook lists the steps.</p> },
      ]}
    />
  );
}

export function SideNavDemo() {
  return (
    <div style={{ maxWidth: '16rem' }}>
      <SideNav
        label="Guides"
        current="/insights/runbooks"
        groups={[
          { label: 'Reliability', open: true, items: [{ label: 'Idempotency', to: '/insights/idempotency' }, { label: 'Runbooks', to: '/insights/runbooks' }, { label: 'Handover', to: '/insights/handover', badge: 'new' }] },
          { label: 'Interfaces', items: [{ label: 'API contracts', to: '/insights/api-contracts' }, { label: 'Permissions', to: '/insights/permissions' }] },
          { label: 'Records', items: [{ label: 'Audit trails', to: '/insights/audit-trails' }] },
        ]}
      />
    </div>
  );
}

export function DropdownMenuDemo() {
  const toast = useToast();
  const [last, setLast] = useState('nothing yet');
  const pick = (what) => () => { setLast(what); toast({ title: what, tone: 'info', duration: 2400 }); };
  return (
    <div style={{ display: 'grid', gap: '0.8rem', justifyItems: 'start' }}>
      <DropdownMenu
        label="Actions"
        items={[
          { label: 'Rename', onSelect: pick('Rename') },
          { label: 'Duplicate', onSelect: pick('Duplicate') },
          { label: 'Archive', onSelect: pick('Archive'), disabled: true },
          { separator: true },
          { label: 'Delete…', onSelect: pick('Delete'), danger: true },
        ]}
      />
      <span style={{ font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>Last chosen: {last}</span>
    </div>
  );
}

export function OnThisPageDemo() {
  const ids = ['kit-a', 'kit-b', 'kit-c'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 11rem) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
      <OnThisPage items={[{ id: ids[0], label: 'Why it follows you' }, { id: ids[1], label: 'How it knows' }, { id: ids[2], label: 'What it moves' }]} />
      <div style={{ maxHeight: '15rem', overflowY: 'auto', paddingRight: '0.6rem', font: '0.82rem/1.7 var(--font-sans)', color: 'rgba(255,255,255,0.8)' }} tabIndex={0} role="region" aria-label="Sample text">
        {[['Why it follows you', 'A long page is easier to hold in your head when something says where you are in it.'], ['How it knows', 'An observer watches each heading and reports the one nearest the top of the window.'], ['What it moves', 'Pressing an entry scrolls to that heading and puts keyboard focus on it, so the next Tab continues from there.']].map(([h, t], i) => (
          <section key={h} id={ids[i]} style={{ minHeight: '10rem' }}><h4 style={{ margin: '0 0 0.4rem', color: '#fff', fontWeight: 500 }}>{h}</h4><p style={{ margin: 0 }}>{t}</p></section>
        ))}
      </div>
    </div>
  );
}

export function ToolbarDemo() {
  const toast = useToast();
  return (
    <Toolbar
      label="Text formatting"
      items={[
        { id: 'b', label: 'Bold', icon: Bold, toggle: true },
        { id: 'i', label: 'Italic', icon: Italic, toggle: true },
        { id: 'u', label: 'Underline', icon: Underline, toggle: true, pressed: true },
        { separator: true },
        { id: 'l', label: 'Bulleted list', icon: List, toggle: true },
        { id: 'k', label: 'Insert link', icon: Link2, onClick: () => toast({ title: 'Insert link', body: 'A real editor would open a dialog here.', duration: 2600 }) },
      ]}
    />
  );
}
