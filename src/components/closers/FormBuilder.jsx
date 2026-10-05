import { useRef, useState } from 'react';
import CloserFrame from './CloserFrame';
import { Alert, Checkbox, CodeBlock, NumberField, PasswordField, RadioGroup, SelectField, TextArea, TextField } from '../kit';
import { strength } from '../kit/strength';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './FormBuilder.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* How each kind of field is checked, drawn and written out as code. */
const KINDS = {
  text: { jsx: (f) => `<TextField label="${f.label}"${f.required ? ' required' : ''} />`, check: (v, f) => (f.required && !String(v || '').trim() ? `Enter ${f.label.toLowerCase()}.` : '') },
  email: { jsx: (f) => `<TextField label="${f.label}" type="email"${f.required ? ' required' : ''} />`, check: (v, f) => (!String(v || '').trim() ? (f.required ? `Enter ${f.label.toLowerCase()}.` : '') : EMAIL.test(v) ? '' : 'That does not look like an email address — it needs an @ and a domain.') },
  password: { jsx: (f) => `<PasswordField label="${f.label}"${f.required ? ' required' : ''} />`, check: (v) => (strength(v || '') >= 2 ? '' : 'Use at least 12 characters, or mix upper and lower case with numbers and symbols.') },
  number: { jsx: (f) => `<NumberField label="${f.label}" min={${f.min}} max={${f.max}} />`, check: (v, f) => (v == null ? `Enter ${f.label.toLowerCase()}.` : v < f.min || v > f.max ? `Use a number from ${f.min} to ${f.max}.` : '') },
  select: { jsx: (f) => `<SelectField label="${f.label}" options={${JSON.stringify(f.options)}} placeholder="Choose one…"${f.required ? ' required' : ''} />`, check: (v, f) => (f.required && !v ? `Choose ${f.label.toLowerCase()}.` : '') },
  radio: { jsx: (f) => `<RadioGroup legend="${f.label}" options={${JSON.stringify(f.options.map((o) => ({ value: o.toLowerCase(), label: o })))}} />`, check: (v, f) => (f.required && !v ? `Choose ${f.label.toLowerCase()}.` : '') },
  textarea: { jsx: (f) => `<TextArea label="${f.label}" maxLength={${f.max}} />`, check: (v, f) => ((v || '').length > f.max ? `Keep it under ${f.max} characters.` : f.required && !String(v || '').trim() ? `Write ${f.label.toLowerCase()}.` : '') },
  checkbox: { jsx: (f) => `<Checkbox label="${f.label}" />`, check: (v, f) => (f.required && !v ? 'This needs to be ticked to go on.' : '') },
};

/**
 * Choose the fields a form needs and the page builds it from the kit's own
 * components, checks it when you send it (focus goes to the first problem, and a
 * summary is announced), and writes the JSX out so you can take it with you.
 * Nothing is sent anywhere.
 */
export default function FormBuilder({ tag, title, lede, fields = [], onward }) {
  const [on, setOn] = useState(() => new Set(fields.filter((f) => f.start).map((f) => f.id)));
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const form = useRef(null);
  const active = fields.filter((f) => on.has(f.id));

  const set = (id, v) => { setValues((s) => ({ ...s, [id]: v })); setSent(false); if (errors[id]) setErrors((e) => ({ ...e, [id]: '' })); };
  const toggle = (id) => { setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }); setSent(false); setErrors({}); };
  const submit = (e) => {
    e.preventDefault();
    const found = Object.fromEntries(active.map((f) => [f.id, KINDS[f.kind].check(values[f.id], f)]));
    setErrors(found);
    const bad = Object.values(found).filter(Boolean).length;
    setSent(bad === 0 && active.length > 0);
    if (bad) requestAnimationFrame(() => form.current?.querySelector('[aria-invalid="true"]')?.focus());
  };
  const count = Object.values(errors).filter(Boolean).length;

  const control = (f) => {
    const err = errors[f.id] || undefined;
    const v = values[f.id];
    switch (f.kind) {
      case 'text': return <TextField key={f.id} label={f.label} required={f.required} value={v ?? ''} onChange={(e) => set(f.id, e.target.value)} error={err} hint={f.hint} />;
      case 'email': return <TextField key={f.id} label={f.label} type="email" required={f.required} value={v ?? ''} onChange={(e) => set(f.id, e.target.value)} error={err} hint={f.hint} />;
      case 'password': return <PasswordField key={f.id} label={f.label} required={f.required} value={v ?? ''} onChange={(x) => set(f.id, x)} error={err} hint={f.hint} />;
      case 'number': return <NumberField key={f.id} label={f.label} min={f.min} max={f.max} value={v ?? null} onChange={(x) => set(f.id, x)} error={err} hint={f.hint} />;
      case 'select': return <SelectField key={f.id} label={f.label} required={f.required} options={f.options} placeholder="Choose one…" value={v ?? ''} onChange={(x) => set(f.id, x)} error={err} hint={f.hint} />;
      case 'radio': return <RadioGroup key={f.id} legend={f.label} options={f.options.map((o) => ({ value: o.toLowerCase(), label: o }))} value={v ?? ''} onChange={(x) => set(f.id, x)} row />;
      case 'textarea': return <TextArea key={f.id} label={f.label} maxLength={f.max} value={v ?? ''} onChange={(x) => set(f.id, x)} error={err && err.includes('under') ? undefined : err} hint={f.hint} />;
      case 'checkbox': return <div key={f.id}><Checkbox label={f.label} checked={Boolean(v)} onChange={(x) => set(f.id, x)} hint={f.hint} />{err && <p role="alert" style={{ margin: '0.3rem 0 0 1.9rem', fontSize: 'var(--fs-xs)', color: 'var(--c-red-bright)' }}>{err}</p>}</div>;
      default: return null;
    }
  };

  const code = active.length
    ? `<form onSubmit={handleSubmit} noValidate>\n${active.map((f) => `  ${KINDS[f.kind].jsx(f)}`).join('\n')}\n  <button type="submit">Send</button>\n</form>`
    : '<form>…choose some fields…</form>';

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('formbuilder.rig')}>
        <fieldset className={styles.pick}>
          <legend>Fields in the form</legend>
          {fields.map((f) => <Checkbox key={f.id} label={f.label} hint={f.kind === 'radio' || f.kind === 'select' ? `${f.kind} · ${f.options.join(', ')}` : f.kind} checked={on.has(f.id)} onChange={() => toggle(f.id)} />)}
        </fieldset>

        <div>
          <form ref={form} className={styles.form} onSubmit={submit} noValidate {...fx('formbuilder.form')}>
            <h3>Your form</h3>
            {active.length ? active.map(control) : <p className={styles.empty}>Tick at least one field to build a form.</p>}
            {count > 0 && <Alert tone="danger" title={`${count} ${count === 1 ? 'thing' : 'things'} to fix`}>The first one has focus. Each message says what to do.</Alert>}
            {sent && <Alert tone="success" title="Checked — and nothing was sent">This is a demonstration; the form never leaves your browser.</Alert>}
            <div className={styles.actions}>
              <button type="submit" className={`${shared.btn} ${shared.btnRed}`} disabled={!active.length}>Send</button>
              <button type="button" className={shared.btn} onClick={() => { setValues({}); setErrors({}); setSent(false); }}>Clear</button>
            </div>
          </form>
          <div className={styles.code}><CodeBlock code={code} language="jsx" filename="Form.jsx" /></div>
        </div>
      </div>
    </CloserFrame>
  );
}
