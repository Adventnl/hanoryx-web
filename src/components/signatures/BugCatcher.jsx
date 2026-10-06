import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { fx } from '../../utils/fx';
import styles from './BugCatcher.module.css';

/**
 * Which kind of check catches which kind of problem? Switch checks on and off
 * and watch what slips through. The grid is a judgement, not a measurement: it
 * records what experience says each kind of check is good at.
 *
 *   checks:   [{ id, name, blurb, cost }]
 *   problems: [{ id, text, catches: { [checkId]: 0 | 1 | 2 }, note }]       2 = reliably, 1 = sometimes
 */
export default function BugCatcher({ eyebrow, title, intro, checks = [], problems = [], note }) {
  const [on, setOn] = useState(() => new Set(checks.slice(0, 3).map((c) => c.id)));
  const [focus, setFocus] = useState(null);
  const toggle = (id) => setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const verdicts = useMemo(
    () => problems.map((p) => {
      const best = Math.max(0, ...checks.filter((c) => on.has(c.id)).map((c) => p.catches[c.id] || 0));
      return { id: p.id, best };
    }),
    [on, problems, checks]
  );
  const slipped = verdicts.filter((v) => v.best === 0).length;
  const f = problems.find((p) => p.id === focus);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('bugs.rig')}>
        <div className={styles.chips} role="group" aria-label="Checks in use">
          {checks.map((c) => (
            <button key={c.id} type="button" aria-pressed={on.has(c.id)} className={clsx(styles.chip, on.has(c.id) && styles.on)} onClick={() => toggle(c.id)} title={c.blurb}>{c.name}<i>{c.cost}</i></button>
          ))}
        </div>

        <div className={styles.scroll} role="region" aria-label="Which checks catch which problems" tabIndex={0}>
          <table className={styles.grid}>
            <thead>
              <tr>
                <th scope="col">A problem like…</th>
                {checks.map((c) => <th key={c.id} scope="col" className={clsx(!on.has(c.id) && styles.off)}>{c.name}</th>)}
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p, i) => {
                const v = verdicts[i];
                return (
                  <tr key={p.id} className={clsx(focus === p.id && styles.focus, v.best === 0 && styles.slip)} onPointerEnter={() => setFocus(p.id)} onFocus={() => setFocus(p.id)}>
                    <th scope="row"><button type="button" onClick={() => setFocus(p.id)}>{p.text}</button></th>
                    {checks.map((c) => {
                      const lvl = p.catches[c.id] || 0;
                      return (
                        <td key={c.id} className={clsx(!on.has(c.id) && styles.off)}>
                          <span className={clsx(styles.dot, lvl === 2 && styles.full, lvl === 1 && styles.half)} role="img" aria-label={lvl === 2 ? 'catches it reliably' : lvl === 1 ? 'catches it sometimes' : 'does not catch it'} />
                        </td>
                      );
                    })}
                    <td className={styles.res}>{v.best === 2 ? 'Caught' : v.best === 1 ? 'Maybe' : 'Slips through'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.foot}>
          <p className={styles.score} role="status" aria-live="polite"><b>{slipped}</b> of {problems.length} problems slip through with these checks</p>
          <p className={styles.explain}>{f ? <><b>{f.text}.</b> {f.note}</> : 'Point at a problem for what usually finds it.'}</p>
        </div>
        <ul className={styles.legend} aria-label="Key">
          <li><i className={clsx(styles.dot, styles.full)} aria-hidden="true" /> catches it reliably</li>
          <li><i className={clsx(styles.dot, styles.half)} aria-hidden="true" /> sometimes</li>
          <li><i className={styles.dot} aria-hidden="true" /> does not</li>
        </ul>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
