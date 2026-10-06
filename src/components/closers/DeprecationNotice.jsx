import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './DeprecationNotice.module.css';

/** Write the notice before you break anything. Say what is going, what replaces
 *  it and how long people have; out come the announcement and the two response
 *  headers (Deprecation and Sunset) that let tools notice on their own. */
export default function DeprecationNotice({ tag, title, lede, onward }) {
  const [what, setWhat] = useState('GET /v1/orders → items[].price');
  const [instead, setInstead] = useState('items[].amount, which carries the currency as well');
  const [weeks, setWeeks] = useState(12);
  const [copied, copy] = useCopy();
  /* Read the clock once, on mount: render stays pure and the dates don't drift
     while the visitor edits the form. */
  const [today] = useState(() => Date.now());

  const text = useMemo(() => {
    const sunset = new Date(today + weeks * 7 * 86400000);
    const iso = sunset.toISOString().slice(0, 10);
    const http = sunset.toUTCString();
    return `Subject: Deprecation notice — ${what}

${what} is deprecated and will be removed on ${iso}.

Use instead: ${instead}.

What happens now:
  - Until ${iso} it keeps working exactly as before.
  - Responses carry two headers so your tooling can notice:
      Deprecation: true
      Sunset: ${http}
  - After ${iso} requests that depend on it will fail.

What we need from you: switch before that date. If you cannot, tell us what is in the way.`;
  }, [what, instead, weeks, today]);

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('deprecate.rig')}>
        <div className={styles.form}>
          <label><span>What is going</span><input value={what} onChange={(e) => setWhat(e.target.value)} spellCheck={false} /></label>
          <label><span>What replaces it</span><input value={instead} onChange={(e) => setInstead(e.target.value)} spellCheck={false} /></label>
          <label className={styles.range}><span>Notice period <b>{weeks} weeks</b></span><input type="range" min={2} max={52} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} /></label>
          <p className={styles.tip}>The right notice period is the longest your slowest consumer needs, not the shortest you can get away with.</p>
        </div>
        <div className={styles.out} {...fx('deprecate.notice')}>
          <p className={shared.label}>The notice</p>
          <pre tabIndex={0}><code>{text}</code></pre>
          <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => copy(text)}><Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy the notice'}</button>
        </div>
      </div>
    </CloserFrame>
  );
}
