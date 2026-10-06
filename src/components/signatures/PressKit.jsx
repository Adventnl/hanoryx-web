import { useState } from 'react';
import clsx from 'clsx';
import { Copy, Download } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlideTabs } from '../fx/GlideTabs';
import { useCopy } from '../../hooks/useCopy';
import { fx } from '../../utils/fx';
import styles from './PressKit.module.css';

const words = (t) => t.trim().split(/\s+/).length;

/**
 * Everything someone writing about the company needs to get it right: the
 * company in three lengths (each one copies in a press), a fact sheet where
 * every line copies, and the mark in the files the site itself uses.
 *
 *   boilerplates: [{ id, label, text }]   facts: [{ k, v }]   assets: [{ id, name, file, note, preview }]
 */
export default function PressKit({ eyebrow, title, intro, boilerplates = [], facts = [], assets = [], rules = [] }) {
  const [id, setId] = useState(boilerplates[0]?.id);
  const [copied, copy] = useCopy();
  const b = boilerplates.find((x) => x.id === id) || boilerplates[0];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.kit} {...fx('press.kit')}>
        <section className={styles.boiler} aria-label="The company in a few lines">
          <div className={styles.row}>
            <GlideTabs
              idPrefix="press-bp"
              label="Length"
              value={id}
              onChange={setId}
              tabs={boilerplates.map((x) => ({ id: x.id, label: x.label, meta: `${words(x.text)}w` }))}
              {...fx('press.length-tabs')}
            />
          </div>
          <div role="tabpanel" id={`press-bp-panel-${b.id}`} aria-labelledby={`press-bp-tab-${b.id}`} className={styles.text} key={b.id} {...fx('press.boilerplate')}>
            <p>{b.text}</p>
            <button type="button" className={clsx(styles.btn, copied === b.text && styles.done)} onClick={() => copy(b.text)}>
              <Copy size={13} aria-hidden="true" /> {copied === b.text ? 'Copied' : `Copy the ${b.label.toLowerCase()} version`}
            </button>
          </div>
        </section>

        <section className={styles.facts} aria-label="Fact sheet" {...fx('press.fact-sheet')}>
          <h3>Fact sheet</h3>
          <dl>
            {facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>
                  <span>{f.v}</span>
                  <button type="button" className={styles.mini} onClick={() => copy(`${f.k}: ${f.v}`)} aria-label={`Copy ${f.k}`}>
                    {copied === `${f.k}: ${f.v}` ? 'Copied' : <Copy size={12} aria-hidden="true" />}
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className={styles.assets} {...fx('press.assets')}>
        {assets.map((a) => (
          <figure key={a.id} className={styles.asset}>
            <span className={styles.plate}><img src={a.preview || a.file} alt="" width="96" height="96" /></span>
            <figcaption>
              <b>{a.name}</b>
              <span>{a.note}</span>
              <a href={a.file} download className={styles.dl}><Download size={13} aria-hidden="true" /> Download {a.file.split('.').pop().toUpperCase()}</a>
            </figcaption>
          </figure>
        ))}
      </div>

      {rules.length > 0 && (
        <ul className={styles.rules} {...fx('press.usage-rules')}>
          {rules.map((r) => <li key={r}>{r}</li>)}
        </ul>
      )}
    </div>
  );
}
