import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Download } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { useCopy } from '../../hooks/useCopy';
import { downloadText } from '../../utils/clipboard';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import tool from '../signatures/tool.module.css';
import styles from './SunsetPlan.module.css';

/** Plan the end while you are building the start. Choose what applies to the
 *  system you are retiring and how much notice people get; out comes an ordered
 *  plan counted back from the day it is switched off. */
export default function SunsetPlan({ tag, title, lede, groups = [], onward }) {
  const [on, setOn] = useState(() => new Set(groups.flatMap((g) => g.items.filter((i) => i.default).map((i) => i.id))));
  const [weeks, setWeeks] = useState(12);
  const [copied, copy] = useCopy();
  const toggle = (id) => setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const picked = useMemo(() => groups.flatMap((g) => g.items.filter((i) => on.has(i.id)).map((i) => ({ ...i, group: g.name, at: Math.round(weeks * i.when) }))).sort((a, b) => b.at - a.at), [groups, on, weeks]);
  const label = (at) => (at > 0 ? `${at} weeks before` : at === 0 ? 'On the day' : `${-at} weeks after`);
  const md = ['# Retirement plan', '', `Notice to users: ${weeks} weeks.`, '', ...picked.map((p) => `- [ ] **${label(p.at)}** — ${p.text} _(${p.group})_`), ''].join('\n');

  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('sunset.rig')}>
        <div className={styles.pick}>
          <label className={tool.field}><span>Notice to the people who use it <b>{weeks} weeks</b></span><input type="range" min={4} max={52} step={2} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} /></label>
          {groups.map((g) => (
            <fieldset key={g.name}>
              <legend>{g.name}</legend>
              {g.items.map((i) => (
                <label key={i.id} className={clsx(styles.row, on.has(i.id) && styles.on)}>
                  <input type="checkbox" checked={on.has(i.id)} onChange={() => toggle(i.id)} />
                  <span className={styles.box} aria-hidden="true" />
                  <span>{i.text}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <div className={styles.out}>
          <p className={shared.label}>{picked.length} steps, in order</p>
          <ol className={styles.timeline}>
            {picked.map((p) => <li key={p.id}><b>{label(p.at)}</b><span>{p.text}</span><i>{p.group}</i></li>)}
            {!picked.length && <li className={styles.empty}>Choose the steps that apply.</li>}
          </ol>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('retirement-plan.md', md, 'text/markdown')} disabled={!picked.length}><Download size={14} aria-hidden="true" /> Download</button>
            <button type="button" className={shared.btn} onClick={() => copy(md)} disabled={!picked.length}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
