import { useState } from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../ui/SectionHeader';
import { Glyph } from '../fx/Glyph';
import { fx } from '../../utils/fx';
import styles from './DataJourney.module.css';

/**
 * "What leaves your browser?" Choose something you might do on this site and
 * the diagram shows which connections are made — and which are not. Every
 * statement here describes what the site's own code does; it is not a legal
 * document and not a promise about anything outside the site.
 *
 *   actions:  [{ id, label, summary, reach: [destId], stores, sends: [{ to, what }], stays: [string] }]
 *   dests:    [{ id, title, line, glyph }]
 */
export default function DataJourney({ eyebrow, title, intro, actions, dests, note }) {
  const [id, setId] = useState(actions[0].id);
  const action = actions.find((a) => a.id === id);
  const reach = new Set(action.reach);
  const total = action.sends.length;

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.bench} {...fx('privacy.data-journey')}>
        <div role="radiogroup" aria-label="What are you doing?" className={styles.actions}>
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={a.id === id}
              className={clsx(styles.action, a.id === id && styles.on)}
              onClick={() => setId(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className={styles.stage}>
          <div className={styles.diagram} data-count={total}>
            <div className={clsx(styles.node, styles.you)}>
              <Glyph name="terminal" size={26} className={styles.nodeGlyph} />
              <strong>Your browser</strong>
              <span>this tab</span>
            </div>

            <ul className={styles.dests}>
              {dests.map((d) => {
                const on = reach.has(d.id);
                return (
                  <li key={d.id} className={clsx(styles.dest, on && styles.live)}>
                    <span className={styles.wire} aria-hidden="true"><i /></span>
                    <span className={styles.node}>
                      <Glyph name={d.glyph} size={22} className={styles.nodeGlyph} />
                      <strong>{d.title}</strong>
                      <span>{on ? action.sends.find((s) => s.to === d.id)?.what || d.line : d.line}</span>
                    </span>
                    <span className={styles.badge}>{on ? 'Connection made' : 'No connection'}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.read} aria-live="polite">
            <p className={styles.summary} key={id}>{action.summary}</p>
            <div className={styles.cols}>
              <div>
                <span>Leaves the browser</span>
                {action.sends.length === 0 ? (
                  <p className={styles.none}>Nothing.</p>
                ) : (
                  <ul>{action.sends.map((s) => <li key={s.to}><b>{dests.find((d) => d.id === s.to).title}</b> {s.what}</li>)}</ul>
                )}
              </div>
              <div>
                <span>Stays in this tab</span>
                {action.stays.length === 0 ? (
                  <p className={styles.none}>Nothing.</p>
                ) : (
                  <ul>{action.stays.map((s) => <li key={s}>{s}</li>)}</ul>
                )}
              </div>
            </div>
          </div>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
