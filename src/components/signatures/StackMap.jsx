import { useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { licences } from '../../data/licences';
import { fx } from '../../utils/fx';
import styles from './StackMap.module.css';

const byName = Object.fromEntries(licences.map((l) => [l.name, l]));

/** The site's stack as slabs, top to bottom: what the visitor touches down to what
 *  builds it. Versions and licences are read from the same data as the licences
 *  page, so they cannot disagree with it.
 *
 *    layers: [{ id, name, blurb, packages: [{ name, why }] }]       (a package with no entry is a thing we wrote) */
export default function StackMap({ eyebrow, title, intro, layers = [], note }) {
  const [sel, setSel] = useState(null);
  const [layerId, pkgName] = sel || [];
  const layer = layers.find((l) => l.id === layerId);
  const pkg = layer?.packages.find((p) => p.name === pkgName);
  const info = pkg && byName[pkg.name];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.rig} {...fx('stack.map')}>
        <ol className={styles.slabs}>
          {layers.map((l, i) => (
            <li key={l.id} className={clsx(styles.slab, layerId === l.id && styles.on)} style={{ '--i': i }}>
              <div className={styles.head}><span className={styles.n}>{String(i + 1).padStart(2, '0')}</span><b>{l.name}</b><small>{l.blurb}</small></div>
              <ul className={styles.pkgs}>
                {l.packages.map((p) => {
                  const lic = byName[p.name];
                  return (
                    <li key={p.name}>
                      <button type="button" className={clsx(styles.pkg, layerId === l.id && pkgName === p.name && styles.sel, !lic && styles.ours)} aria-pressed={layerId === l.id && pkgName === p.name} onClick={() => setSel([l.id, p.name])}>
                        {p.name}{lic && <i>{lic.version}</i>}{!lic && <i>ours</i>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
        <aside className={styles.detail} aria-live="polite" {...fx('stack.detail')}>
          {pkg ? (
            <>
              <p className={styles.k}>{layer.name}</p>
              <h3>{pkg.name}</h3>
              <dl>
                <div><dt>Why it is here</dt><dd>{pkg.why}</dd></div>
                {info ? (
                  <>
                    <div><dt>What it is</dt><dd>{info.role}</dd></div>
                    <div><dt>Version · licence</dt><dd>{info.version} · {info.licence}</dd></div>
                    <div><dt>Used for</dt><dd>{info.kind === 'build' ? 'Building and checking the site. It is not shipped to visitors.' : 'Running in the visitor’s browser.'}</dd></div>
                  </>
                ) : (
                  <div><dt>What it is</dt><dd>Written for this site, not installed. There is nothing to update and nothing to license.</dd></div>
                )}
              </dl>
            </>
          ) : (
            <p className={styles.wait}>Choose a part to see why it is here.</p>
          )}
        </aside>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
