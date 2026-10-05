import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, Trash2 } from 'lucide-react';
import { ConfirmDialog, Dialog, Drawer, HoverCard, Popover, TextField, Tooltip, useToast } from '..';

const btn = { padding: '0.65rem 1.1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, background: 'transparent', color: '#fff', font: '0.6rem var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' };
const icon = { display: 'inline-grid', placeItems: 'center', width: '2.4rem', height: '2.4rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, background: 'rgba(10,11,13,0.9)', color: '#fff', cursor: 'pointer' };

export function TooltipDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.4rem', paddingTop: '2.4rem', alignItems: 'center' }}>
      <Tooltip text="More about this setting"><button type="button" style={icon} aria-label="About this setting"><Info size={16} aria-hidden="true" /></button></Tooltip>
      <Tooltip text="Removes the draft for good" placement="bottom"><button type="button" style={icon} aria-label="Delete the draft"><Trash2 size={16} aria-hidden="true" /></button></Tooltip>
      <Tooltip text="Opens beside it" placement="end"><button type="button" style={btn}>Hover or focus me</button></Tooltip>
    </div>
  );
}

export function PopoverDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', minHeight: '13rem', alignItems: 'flex-start' }}>
      <Popover label="Share" title="Share this view">
        <p style={{ margin: '0 0 0.7rem' }}>Anyone with the link can read this page. Nothing is sent from here — the link is yours to copy.</p>
        <TextField label="Link" defaultValue="https://example.test/view/0001" readOnly />
      </Popover>
      <Popover label="Columns" title="Columns shown" align="end">
        <p style={{ margin: 0 }}>A popover can hold a short form, a list of options, or a few links. It is not modal, so you can still tab out of it.</p>
      </Popover>
    </div>
  );
}

export function HoverCardDemo() {
  return (
    <div style={{ minHeight: '10rem', paddingTop: '0.5rem' }}>
      <p style={{ margin: 0, font: '0.9rem/1.8 var(--font-sans)', color: 'rgba(255,255,255,0.8)' }}>
        See the{' '}
        <HoverCard title="Glossary" body="Every term the site uses, in plain language: search, filter by area, jump by letter.">
          <Link to="/resources/glossary" data-cursor="link" style={{ color: '#fff', textDecoration: 'underline', textDecorationColor: 'rgba(255,51,51,0.6)' }}>glossary</Link>
        </HoverCard>
        {' '}for words like idempotency, and the{' '}
        <HoverCard title="Runbooks" body="One page that starts from the symptom and gets a tired reader to the first safe action.">
          <Link to="/insights/runbooks" data-cursor="link" style={{ color: '#fff', textDecoration: 'underline', textDecorationColor: 'rgba(255,51,51,0.6)' }}>runbook guide</Link>
        </HoverCard>
        {' '}for what to write down.
      </p>
    </div>
  );
}

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  return (
    <div>
      <button type="button" style={btn} onClick={() => setOpen(true)}>Open a dialog</button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Rename the project"
        footer={(
          <>
            <button type="button" style={btn} onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" style={{ ...btn, borderColor: 'rgba(255,51,51,0.55)', background: 'rgba(255,51,51,0.12)' }} onClick={() => { setOpen(false); toast({ title: 'Renamed', tone: 'success', duration: 2600 }); }}>Save</button>
          </>
        )}
      >
        <TextField label="New name" defaultValue="Example project" data-autofocus="" />
        <p>Focus is inside the dialog; Tab and Shift+Tab stay in it; Escape or a press on the dark area closes it, and focus goes back to the button you used.</p>
      </Dialog>
    </div>
  );
}

export function DrawerDemo() {
  const [side, setSide] = useState(null);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
      <button type="button" style={btn} onClick={() => setSide('right')}>Filters, from the right</button>
      <button type="button" style={btn} onClick={() => setSide('left')}>Menu, from the left</button>
      <Drawer open={Boolean(side)} side={side || 'right'} onClose={() => setSide(null)} title={side === 'left' ? 'Menu' : 'Filters'}>
        <p>A drawer is a dialog that runs the full height. Use it where the page behind still helps — a filter panel, a record’s detail.</p>
        <TextField label="Owner" placeholder="Anyone" />
      </Drawer>
    </div>
  );
}

export function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState('Nothing deleted.');
  return (
    <div style={{ display: 'grid', gap: '0.8rem', justifyItems: 'start' }}>
      <button type="button" style={btn} onClick={() => setOpen(true)}>Delete the draft…</button>
      <ConfirmDialog
        open={open}
        title="Delete this draft?"
        confirmLabel="Delete the draft"
        cancelLabel="Keep it"
        danger
        onCancel={() => setOpen(false)}
        onConfirm={() => { setOpen(false); setDone('The draft was deleted (not really — this is a demonstration).'); }}
      >
        <p style={{ margin: 0 }}>It cannot be recovered. The safe button, “Keep it”, has focus.</p>
      </ConfirmDialog>
      <span style={{ font: '0.7rem var(--font-mono)', color: 'rgba(255,255,255,0.65)' }}>{done}</span>
    </div>
  );
}
