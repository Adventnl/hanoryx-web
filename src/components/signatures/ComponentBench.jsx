import { useState } from 'react';
import clsx from 'clsx';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Pill } from '../ui/Pill';
import { GlideTabs } from '../fx/GlideTabs';
import { KeyCap } from '../fx/KeyCap';
import { fx } from '../../utils/fx';
import styles from './ComponentBench.module.css';

/* What each specimen lets you change. These are the real components of the
   site (Button, Pill, KeyCap) plus the plain switch used across the pages. */
const SPEC = {
  button: {
    options: [
      { key: 'variant', label: 'Variant', values: ['primary', 'outline', 'ghost', 'line'] },
      { key: 'size', label: 'Size', values: ['sm', 'md', 'lg'] },
    ],
    toggles: [
      { key: 'icon', label: 'Icon' },
      { key: 'magnetic', label: 'Magnetic pull' },
    ],
    initial: { variant: 'primary', size: 'md', icon: true, magnetic: true },
    code: (s) => `<Button variant="${s.variant}" size="${s.size}"${s.icon ? ' icon={ArrowUpRight}' : ''}${s.magnetic ? '' : ' magnetic={false}'}>Open</Button>`,
  },
  pill: {
    options: [{ key: 'variant', label: 'Variant', values: ['default', 'red', 'ghost'] }],
    toggles: [{ key: 'dot', label: 'Live dot' }],
    initial: { variant: 'default', dot: true },
    code: (s) => `<Pill variant="${s.variant}"${s.dot ? ' dot' : ''}>Live</Pill>`,
  },
  key: {
    options: [{ key: 'label', label: 'Key', values: ['K', '⌘', 'Esc', 'Enter'] }],
    toggles: [{ key: 'pressed', label: 'Pressed' }],
    initial: { label: 'K', pressed: false },
    code: (s) => `<KeyCap${s.pressed ? ' pressed' : ''}>${s.label}</KeyCap>`,
  },
  switch: {
    options: [],
    toggles: [
      { key: 'on', label: 'On' },
      { key: 'disabled', label: 'Disabled' },
    ],
    initial: { on: true, disabled: false },
    code: (s) => `<button role="switch" aria-checked={${s.on}}${s.disabled ? ' disabled' : ''} />`,
  },
};

function Segmented({ label, values, value, onChange }) {
  return (
    <fieldset className={styles.seg}>
      <legend>{label}</legend>
      <div>
        {values.map((v) => (
          <label key={v} className={clsx(styles.segItem, value === v && styles.segOn)}>
            <input type="radio" name={label} checked={value === v} onChange={() => onChange(v)} />
            <span>{v}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Preview({ id, s, setS }) {
  if (id === 'button') {
    return <Button variant={s.variant} size={s.size} icon={s.icon ? ArrowUpRight : undefined} magnetic={s.magnetic}>Open</Button>;
  }
  if (id === 'pill') return <Pill variant={s.variant} dot={s.dot}>Live</Pill>;
  if (id === 'key') return <KeyCap pressed={s.pressed}>{s.label}</KeyCap>;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={s.on}
      disabled={s.disabled}
      className={clsx(styles.sw, s.on && styles.swOn)}
      onClick={() => setS({ ...s, on: !s.on })}
      aria-label="Specimen switch"
    >
      <i />
    </button>
  );
}

/**
 * A bench for the site's own small components. Pick a specimen, change its
 * props, and see the real component respond — then hover it, tab to it, press
 * it. The generated line is what you would write to get that state, and it
 * copies to the clipboard.
 *
 *   specimens: [{ id, label, purpose }]
 */
export default function ComponentBench({ eyebrow, title, intro, specimens, note }) {
  const [id, setId] = useState(specimens[0].id);
  const [all, setAll] = useState(() => Object.fromEntries(Object.entries(SPEC).map(([k, v]) => [k, v.initial])));
  const [copied, setCopied] = useState('');
  const spec = SPEC[id];
  const s = all[id];
  const setS = (next) => setAll((prev) => ({ ...prev, [id]: next }));
  const current = specimens.find((sp) => sp.id === id);
  const code = spec.code(s);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied('Copied');
    } catch {
      setCopied('Copy unavailable');
    }
    window.setTimeout(() => setCopied(''), 1800);
  };

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="right" />
      <div className={styles.bench} {...fx('lab.component-bench')}>
        <GlideTabs tabs={specimens.map((sp) => ({ id: sp.id, label: sp.label }))} value={id} onChange={setId} label="Specimen" idPrefix="bench-spec" />
        <div className={styles.frame} role="tabpanel" id={`bench-spec-panel-${id}`} aria-labelledby={`bench-spec-tab-${id}`}>
          <div className={styles.controls}>
            <p className={styles.purpose} key={id}>{current.purpose}</p>
            {spec.options.map((o) => (
              <Segmented key={o.key} label={o.label} values={o.values} value={s[o.key]} onChange={(v) => setS({ ...s, [o.key]: v })} />
            ))}
            {spec.toggles.length > 0 && (
              <div className={styles.toggles}>
                {spec.toggles.map((t) => (
                  <label key={t.key} className={styles.toggle}>
                    <input type="checkbox" checked={Boolean(s[t.key])} onChange={(e) => setS({ ...s, [t.key]: e.target.checked })} />
                    <span className={styles.box} aria-hidden="true"><Check size={12} strokeWidth={2.6} /></span>
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.stageCol}>
            <div className={styles.stage}>
              <span className={clsx(styles.rule, styles.ruleX)} aria-hidden="true" />
              <span className={clsx(styles.rule, styles.ruleY)} aria-hidden="true" />
              <div className={styles.specimen}><Preview id={id} s={s} setS={setS} /></div>
              <span className={styles.hint}>Hover it. Tab to it. Press it.</span>
            </div>
            <div className={styles.code}>
              <code>{code}</code>
              <button type="button" onClick={copy} aria-label="Copy the line">
                <Copy size={13} aria-hidden="true" /> {copied || 'Copy'}
              </button>
            </div>
          </div>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
