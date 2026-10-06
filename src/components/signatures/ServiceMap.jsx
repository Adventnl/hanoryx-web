import { useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { fx } from '../../utils/fx';
import styles from './ServiceMap.module.css';

const SAMPLE = 'Online systems, built with care.';

/**
 * Every service your browser may be asked to contact for this site, one at a
 * time: what it receives, when, whether you can avoid it, and what you would
 * see if you did. For the font service the "what you would see" is shown, side
 * by side, in the real typeface and in the fallback the page would use.
 *
 *   services: [{ id, name, hosts, role, when, receives[], avoid, ifBlocked, fonts? }]
 */
export default function ServiceMap({ eyebrow, title, intro, services = [], note }) {
  const [id, setId] = useState(services[0]?.id);
  const s = services.find((x) => x.id === id) || services[0];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.map} {...fx('services.map')}>
        <div className={styles.hub} aria-hidden="true">
          <span className={styles.you}>Your browser</span>
          <svg viewBox="0 0 120 200" preserveAspectRatio="none">
            {services.map((svc, i) => {
              const y = ((i + 0.5) / services.length) * 200;
              return <path key={svc.id} d={`M2 100 C60 100 60 ${y} 118 ${y}`} className={clsx(styles.wire, svc.id === id && styles.wireOn)} />;
            })}
          </svg>
        </div>
        <div className={styles.list} role="radiogroup" aria-label="Service">
          {services.map((svc) => (
            <button key={svc.id} type="button" role="radio" aria-checked={svc.id === id} className={clsx(styles.node, svc.id === id && styles.on)} onClick={() => setId(svc.id)} {...fx('services.node')}>
              <span className={styles.name}>{svc.name}</span>
              <span className={styles.host}>{svc.hosts.join(' · ')}</span>
              <span className={clsx(styles.tag, svc.avoid === 'No' && styles.must)}>{svc.avoid === 'No' ? 'Needed' : svc.avoid}</span>
            </button>
          ))}
        </div>
        <article className={styles.detail} key={s.id} {...fx('services.detail')}>
          <p className={styles.kicker}>{s.role}</p>
          <dl>
            <div><dt>When it is contacted</dt><dd>{s.when}</dd></div>
            <div><dt>What it receives</dt><dd><ul>{s.receives.map((r) => <li key={r}>{r}</li>)}</ul></dd></div>
            <div><dt>Can you avoid it?</dt><dd>{s.avoidNote}</dd></div>
            <div><dt>If it is blocked</dt><dd>{s.ifBlocked}</dd></div>
          </dl>
          {s.fonts && (
            <div className={styles.compare} {...fx('services.font-compare')}>
              <figure>
                <span style={{ fontFamily: s.fonts.real }}>{SAMPLE}</span>
                <figcaption>With the font service</figcaption>
              </figure>
              <figure>
                <span style={{ fontFamily: s.fonts.fallback }}>{SAMPLE}</span>
                <figcaption>Blocked: the fallback typeface</figcaption>
              </figure>
            </div>
          )}
        </article>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
