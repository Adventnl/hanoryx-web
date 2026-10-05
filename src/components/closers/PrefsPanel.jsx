import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Contrast, Pause, RotateCcw, Rows3, Type } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './PrefsPanel.module.css';

/* Display preferences for this view. They are written to attributes on <html>
   (global.css reacts to them) and kept in memory only — they last until the
   page is reloaded, are never stored, and are sent nowhere. */
const DEFAULTS = { text: 'normal', spacing: 'normal', contrast: 'normal', calm: 'off' };
let remembered = { ...DEFAULTS };

const GROUPS = [
  { key: 'text', label: 'Text size', icon: Type, options: [['normal', 'Normal'], ['large', 'Large'], ['larger', 'Larger']] },
  { key: 'spacing', label: 'Line spacing', icon: Rows3, options: [['normal', 'Normal'], ['wide', 'Wide']] },
  { key: 'contrast', label: 'Text contrast', icon: Contrast, options: [['normal', 'Normal'], ['high', 'Higher']] },
  { key: 'calm', label: 'Calm mode', icon: Pause, options: [['off', 'Off'], ['on', 'On']], hint: 'Stops animation and freezes the backgrounds.' },
];

function apply(prefs) {
  const root = document.documentElement;
  root.dataset.text = prefs.text;
  root.dataset.spacing = prefs.spacing;
  root.dataset.contrast = prefs.contrast;
  root.dataset.calm = prefs.calm;
}

/** Display preferences for this view — text size, line spacing, contrast and a calm mode — that take effect at once and last only until the page is reloaded. */
export default function PrefsPanel({ tag, title, lede, onward }) {
  const [prefs, setPrefs] = useState(remembered);

  useEffect(() => {
    remembered = prefs;
    apply(prefs);
  }, [prefs]);

  const set = (key, value) => setPrefs((p) => ({ ...p, [key]: value }));
  const changed = Object.keys(DEFAULTS).some((k) => prefs[k] !== DEFAULTS[k]);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.grid} {...fx('prefs.panel')}>
        {GROUPS.map((g) => (
          <fieldset key={g.key} className={clsx(shared.panel, styles.group)} {...fx(`prefs.${g.key}`)}>
            <legend className={styles.legend}><g.icon size={15} aria-hidden="true" /> {g.label}</legend>
            {g.hint && <p className={styles.hint}>{g.hint}</p>}
            <div className={styles.options} role="radiogroup" aria-label={g.label}>
              {g.options.map(([value, label]) => (
                <button key={value} type="button" role="radio" aria-checked={prefs[g.key] === value} className={clsx(shared.btn, prefs[g.key] === value && shared.btnOn)} onClick={() => set(g.key, value)}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className={styles.foot}>
        <button type="button" className={shared.btn} onClick={() => setPrefs({ ...DEFAULTS })} disabled={!changed} {...fx('prefs.reset')}>
          <RotateCcw size={14} aria-hidden="true" /> Back to the defaults
        </button>
        <p className={styles.note}>These apply to every page until you reload. Nothing is stored, and nothing is sent.</p>
      </div>
    </CloserFrame>
  );
}
