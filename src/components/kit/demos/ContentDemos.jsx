import { useState } from 'react';
import { AspectRatio, Callout, Card, Cluster, Disclosure, Divider, Figure, Grid, Prose, Quote, Stack, VisuallyHidden } from '..';

const chipStyle = { padding: '0.35rem 0.7rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, font: '0.6rem var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' };
const box = { padding: '0.8rem 1rem', border: '1px dashed rgba(255,255,255,0.3)', borderRadius: 6, font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.03)' };

export function CardDemo() {
  return (
    <Grid min="15rem">
      <Card eyebrow="Raised" title="The default">A surface for related content, with a quiet border.</Card>
      <Card variant="flat" eyebrow="Flat" title="Less weight">For content that is already inside something.</Card>
      <Card variant="outline" eyebrow="Outline" title="Empty inside">Just a border, for a placeholder or a drop target.</Card>
      <Card variant="accent" eyebrow="Accent" title="Pick one" footer="Use this once per screen, no more.">The red wash says “start here”.</Card>
      <Card interactive eyebrow="Interactive" title="Lifts on hover" footer={<a href="#cards" onClick={(e) => e.preventDefault()} style={{ color: '#fff' }}>The one link inside it</a>}>Make the link the thing you press, not the whole card.</Card>
    </Grid>
  );
}

export function CalloutDemo() {
  return (
    <Stack gap={3}>
      <Callout tone="note">A note sits in the flow of the text and adds a little context.</Callout>
      <Callout tone="tip" title="Try this">Press <kbd style={{ font: '0.8em var(--font-mono)' }}>?</kbd> on any page to see the shortcuts.</Callout>
      <Callout tone="warning">Changing the retention period applies to new records only.</Callout>
      <Callout tone="danger" title="Cannot be undone">Deleting an environment removes its data after 30 days.</Callout>
    </Stack>
  );
}

export function QuoteDemo() {
  return (
    <Quote cite="From this company’s principles">
      A system that is hard to hand over is a system that is hard to trust.
    </Quote>
  );
}

export function FigureDemo() {
  return (
    <div style={{ maxWidth: '26rem' }}>
      <Figure caption="Figure 1. Three plates, drawn with CSS. A figure’s caption is read with it.">
        <svg viewBox="0 0 240 110" role="img" aria-label="Three stacked plates, the middle one tinted red" style={{ display: 'block', width: '100%', height: 'auto' }}>
          <rect x="30" y="62" width="180" height="30" rx="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" />
          <rect x="30" y="38" width="180" height="30" rx="3" fill="rgba(255,51,51,0.14)" stroke="#ff3333" />
          <rect x="30" y="14" width="180" height="30" rx="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" />
        </svg>
      </Figure>
    </div>
  );
}

export function DividerDemo() {
  return (
    <div style={{ maxWidth: '28rem' }}>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Above the line.</p>
      <Divider />
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Between the line and the label.</p>
      <Divider>or</Divider>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Below the labelled one.</p>
    </div>
  );
}

export function ProseDemo() {
  return (
    <Prose>
      <h3>Handing a system over</h3>
      <p>A handover is judged by the <strong>first change a stranger can make safely</strong>. Everything else — the diagrams, the wiki — is in service of that.</p>
      <ul>
        <li>Write down how it is run, not only how it is built.</li>
        <li>Keep the list of <code>environment variables</code> next to the code.</li>
        <li>Say what you would do differently.</li>
      </ul>
      <blockquote>Documentation that is not read is a diary.</blockquote>
      <p>The guide on <a href="/insights/handover">designing for handover</a> goes further.</p>
    </Prose>
  );
}

export function StackDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
      {[2, 4, 8].map((g) => (
        <div key={g}>
          <p style={{ margin: '0 0 0.5rem', font: '0.58rem var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>gap {g}</p>
          <Stack gap={g}><div style={box}>One</div><div style={box}>Two</div><div style={box}>Three</div></Stack>
        </div>
      ))}
    </div>
  );
}

export function ClusterDemo() {
  return (
    <div style={{ display: 'grid', gap: '1.2rem' }}>
      <Cluster>{['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet'].map((w) => <span key={w} style={chipStyle}>{w}</span>)}</Cluster>
      <Cluster justify="space-between" gap={4}><span style={chipStyle}>Left</span><span style={chipStyle}>Right</span></Cluster>
    </div>
  );
}

export function GridDemo() {
  const [min, setMin] = useState('10rem');
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <label style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', font: '0.6rem var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
        Smallest column
        <select value={min} onChange={(e) => setMin(e.target.value)} style={{ padding: '0.4rem 0.6rem', background: '#0a0b0d', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', font: '0.7rem var(--font-mono)' }}>
          {['7rem', '10rem', '14rem', '20rem'].map((v) => <option key={v}>{v}</option>)}
        </select>
      </label>
      <Grid min={min} gap={3}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={box}>Cell {i + 1}</div>)}</Grid>
    </div>
  );
}

export function DisclosureDemo() {
  return (
    <div style={{ maxWidth: '36rem' }}>
      <Disclosure title="What does “idempotent” mean?" defaultOpen>Doing it twice has the same effect as doing it once. A payment request with a key is idempotent: the repeat gets the first answer.</Disclosure>
      <Disclosure title="Why not retry everything?">Because some things should not happen twice. Retrying a charge without a key is how customers are billed double.</Disclosure>
      <Disclosure title="Who owns the retry policy?">The team that owns the caller. The callee only has to make repeats safe.</Disclosure>
    </div>
  );
}

export function AspectRatioDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))', gap: '1rem' }}>
      {[['16 / 9', 'Video'], ['4 / 3', 'Slide'], ['1 / 1', 'Square']].map(([r, name]) => (
        <AspectRatio key={r} ratio={r}>
          <div style={{ display: 'grid', placeItems: 'center', border: '1px dashed rgba(255,255,255,0.3)', borderRadius: 6, background: 'rgba(255,255,255,0.03)', font: '0.65rem var(--font-mono)', color: 'rgba(255,255,255,0.8)' }}>{name} · {r}</div>
        </AspectRatio>
      ))}
    </div>
  );
}

export function VisuallyHiddenDemo() {
  return (
    <div style={{ display: 'grid', gap: '0.8rem', maxWidth: '30rem' }}>
      <p style={{ margin: 0, font: '0.85rem/1.7 var(--font-sans)', color: 'rgba(255,255,255,0.8)' }}>
        This button looks like “×” but a screen reader hears “Close the panel”:{' '}
        <button type="button" style={{ width: '2.2rem', height: '2.2rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, background: 'transparent', color: '#fff', cursor: 'pointer' }}>
          <span aria-hidden="true">×</span>
          <VisuallyHidden>Close the panel</VisuallyHidden>
        </button>
      </p>
      <p style={{ margin: 0, font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>Turn on a screen reader, or open the page outline tool, to hear it.</p>
    </div>
  );
}
