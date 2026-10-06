import { useEffect, useState } from 'react';
import { CalendarX2 } from 'lucide-react';
import { Alert, Banner, EmptyState, Meter, ProgressBar, Skeleton, Spinner, StatusDot, useToast } from '..';

const btn = { padding: '0.6rem 1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, background: 'transparent', color: '#fff', font: '0.6rem var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' };

export function AlertDemo() {
  const [shown, setShown] = useState(true);
  return (
    <div style={{ display: 'grid', gap: '0.7rem' }}>
      <Alert tone="info" title="Maintenance window">The service is read-only between 02:00 and 02:30 UTC on Sunday.</Alert>
      <Alert tone="success" title="Saved">Your changes are kept.</Alert>
      <Alert tone="warning" title="Token expires soon">Replace it before Friday to avoid a failed export.</Alert>
      <Alert tone="danger" title="Export failed">Two rows had no order number. Fix them and run it again.</Alert>
      {shown ? <Alert tone="info" title="You can dismiss this one" onDismiss={() => setShown(false)}>It stays gone until you reload.</Alert> : <button type="button" style={{ ...btn, justifySelf: 'start' }} onClick={() => setShown(true)}>Bring it back</button>}
    </div>
  );
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
      <button type="button" style={btn} onClick={() => toast({ title: 'Copied', body: 'The address is on your clipboard.', tone: 'success' })}>Success</button>
      <button type="button" style={btn} onClick={() => toast({ title: 'Heads up', body: 'Hover or tab to a toast and it waits for you.', tone: 'info', duration: 8000 })}>Info, slow</button>
      <button type="button" style={btn} onClick={() => toast({ title: 'Could not save', body: 'Check your connection and try again.', tone: 'danger', duration: 0 })}>Error, stays</button>
    </div>
  );
}

export function BannerDemo() {
  return (
    <div style={{ display: 'grid', gap: '0.8rem' }}>
      <Banner title="New:" action={{ label: 'Read the notes', to: '/resources/changelog' }}>A chapter was added to the release notes.</Banner>
      <Banner title="Read-only mode." dismissible={false} action={{ label: 'Why?', onClick: () => {} }}>Editing is switched off while the migration runs.</Banner>
    </div>
  );
}

export function ProgressBarDemo() {
  const [pct, setPct] = useState(0);
  const [started, setStarted] = useState(false);
  const active = started && pct < 100;
  useEffect(() => {
    if (!active) return undefined;
    const id = window.setInterval(() => setPct((p) => Math.min(100, p + 7)), 220);
    return () => window.clearInterval(id);
  }, [active]);
  return (
    <div style={{ display: 'grid', gap: '1.2rem', maxWidth: '26rem' }}>
      <ProgressBar label="Importing rows" value={pct} />
      <button type="button" style={{ ...btn, justifySelf: 'start' }} onClick={() => { setPct(0); setStarted(true); }} disabled={active}>{active ? 'Importing…' : pct === 100 ? 'Run again' : 'Start'}</button>
      <ProgressBar label="Waiting for the server (no estimate)" />
    </div>
  );
}

export function MeterDemo() {
  const [used, setUsed] = useState(62);
  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '26rem' }}>
      <Meter label="Storage used" value={used} unit="%" low={10} high={85} />
      <input type="range" min={0} max={100} value={used} onChange={(e) => setUsed(Number(e.target.value))} aria-label="Storage used, to try the meter" style={{ accentColor: '#ff3333' }} />
    </div>
  );
}

export function SpinnerDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.6rem', alignItems: 'center' }}>
      <Spinner />
      <Spinner label="Saving" size="1.2rem" />
      <Spinner label="Working" size="2.4rem" hideLabel />
    </div>
  );
}

export function SkeletonDemo() {
  const [ready, setReady] = useState(false);
  return (
    <div style={{ display: 'grid', gap: '0.9rem', maxWidth: '24rem' }}>
      {ready ? (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <strong style={{ color: '#fff', fontWeight: 500 }}>Quarterly summary</strong>
          <p style={{ margin: 0, font: '0.85rem/1.65 var(--font-sans)', color: 'rgba(255,255,255,0.8)' }}>The content has arrived, and nothing moved to make room for it, because the skeleton held the same space.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.6rem' }} aria-busy="true">
          <Skeleton width="48%" height="1.1rem" />
          <Skeleton lines={3} height="0.85rem" />
        </div>
      )}
      <button type="button" style={{ ...btn, justifySelf: 'start' }} onClick={() => setReady((r) => !r)}>{ready ? 'Load again' : 'Content arrives'}</button>
    </div>
  );
}

export function EmptyStateDemo() {
  return (
    <EmptyState icon={CalendarX2} title="Nothing scheduled" action={<button type="button" style={btn}>Add the first one</button>}>
      When a job is scheduled it appears here, with the next time it will run.
    </EmptyState>
  );
}

export function StatusDotDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.6rem' }}>
      <StatusDot state="ok" pulse />
      <StatusDot state="warn" label="Slow responses" />
      <StatusDot state="down" />
      <StatusDot state="idle" label="Paused" />
    </div>
  );
}
