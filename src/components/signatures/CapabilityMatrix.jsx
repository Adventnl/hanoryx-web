import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { fx } from '../../utils/fx';
import styles from './CapabilityMatrix.module.css';

/**
 * What an operational system is usually made of, and which kind of system tends
 * to need what. A reference, drawn as a grid: a judgement from experience, not
 * a statement about any one project.
 *
 *   areas:        [{ id, name, to }]
 *   capabilities: [{ id, name, blurb, uses: { [areaId]: 0 | 1 | 2 } }]     2 = nearly always, 1 = often
 */
export default function CapabilityMatrix({ eyebrow, title, intro, areas = [], capabilities = [], note }) {
  const [area, setArea] = useState(null);
  const [cap, setCap] = useState(null);
  const shown = useMemo(() => (area ? capabilities.filter((c) => (c.uses[area] || 0) > 0) : capabilities), [area, capabilities]);
  const c = capabilities.find((x) => x.id === cap);
  const a = areas.find((x) => x.id === area);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('capmatrix.rig')}>
        <div className={styles.scroll} role="region" aria-label="Capabilities by kind of system" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                {areas.map((x) => (
                  <th key={x.id} scope="col" className={clsx(area === x.id && styles.pick)}>
                    <button type="button" aria-pressed={area === x.id} onClick={() => setArea(area === x.id ? null : x.id)}>{x.name}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className={clsx(cap === r.id && styles.focus)}>
                  <th scope="row"><button type="button" onClick={() => setCap(cap === r.id ? null : r.id)} aria-expanded={cap === r.id}>{r.name}</button></th>
                  {areas.map((x) => {
                    const lvl = r.uses[x.id] || 0;
                    return <td key={x.id} className={clsx(area === x.id && styles.pick)}><span className={clsx(styles.dot, lvl === 2 && styles.full, lvl === 1 && styles.half)} role="img" aria-label={lvl === 2 ? 'nearly always needed' : lvl === 1 ? 'often needed' : 'rarely needed'} /></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className={styles.side} aria-live="polite" {...fx('capmatrix.detail')}>
          {c ? (
            <>
              <p className={styles.k}>Capability</p>
              <h3>{c.name}</h3>
              <p>{c.blurb}</p>
              <ul>{areas.filter((x) => (c.uses[x.id] || 0) > 0).map((x) => <li key={x.id}><Link to={x.to} data-cursor="link">{x.name}</Link><i>{c.uses[x.id] === 2 ? 'nearly always' : 'often'}</i></li>)}</ul>
            </>
          ) : a ? (
            <>
              <p className={styles.k}>Kind of system</p>
              <h3>{a.name}</h3>
              <p>{shown.length} of {capabilities.length} capabilities are usually part of this. <Link to={a.to} data-cursor="link">Read the page.</Link></p>
            </>
          ) : (
            <p className={styles.wait}>Choose a capability to see where it turns up, or a kind of system to see what it usually needs.</p>
          )}
        </aside>
      </div>
      <ul className={styles.legend} aria-label="Key">
        <li><i className={clsx(styles.dot, styles.full)} aria-hidden="true" /> nearly always</li>
        <li><i className={clsx(styles.dot, styles.half)} aria-hidden="true" /> often</li>
        <li><i className={styles.dot} aria-hidden="true" /> rarely</li>
      </ul>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
