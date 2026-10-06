import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Download } from 'lucide-react';
import CloserFrame from './CloserFrame';
import { downloadText } from '../../utils/clipboard';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import shared from './shared.module.css';
import styles from './ReadmeMaker.module.css';

/** A README that the next person can use. Choose the sections; the skeleton is
 *  assembled beside you, with a prompt under every heading saying what belongs
 *  there. */
export default function ReadmeMaker({ tag, title, lede, sections = [], onward }) {
  const [on, setOn] = useState(() => new Set(sections.filter((s) => s.default).map((s) => s.id)));
  const [copied, copy] = useCopy();
  const toggle = (id) => setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const md = useMemo(() => ['# <Service name>', '', '> One sentence: what this is, and who it is for.', '', ...sections.filter((s) => on.has(s.id)).flatMap((s) => [`## ${s.name}`, `<!-- ${s.prompt} -->`, '', s.body ? s.body : '', ''])].join('\n'), [on, sections]);
  return (
    <CloserFrame tag={tag} title={title} lede={lede} onward={onward}>
      <div className={styles.rig} {...fx('readme.rig')}>
        <fieldset className={styles.pick}>
          <legend>Sections</legend>
          {sections.map((s) => (
            <label key={s.id} className={clsx(styles.opt, on.has(s.id) && styles.on)}>
              <input type="checkbox" checked={on.has(s.id)} onChange={() => toggle(s.id)} />
              <span className={styles.box} aria-hidden="true" />
              <span><b>{s.name}</b><small>{s.prompt}</small></span>
            </label>
          ))}
        </fieldset>
        <div className={styles.out} {...fx('readme.preview')}>
          <p className={shared.label}>README.md</p>
          <pre tabIndex={0}><code>{md}</code></pre>
          <div className={shared.row}>
            <button type="button" className={`${shared.btn} ${shared.btnRed}`} onClick={() => downloadText('README.md', md, 'text/markdown')}><Download size={14} aria-hidden="true" /> Download README.md</button>
            <button type="button" className={shared.btn} onClick={() => copy(md)}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
        </div>
      </div>
    </CloserFrame>
  );
}
