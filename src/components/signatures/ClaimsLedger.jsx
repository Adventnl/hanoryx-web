import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Accordion } from '../fx/Accordion';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { fx } from '../../utils/fx';
import styles from './ClaimsLedger.module.css';

/**
 * The trust centre's ledger: three columns — what the site does, what it does
 * not claim, and what is still open — each row a disclosure that says how you
 * can check it for yourself and links to the page that proves it.
 *
 *   columns: [{ id, title, lede, items: [{ title, how, to, toLabel }] }]
 */
export default function ClaimsLedger({ eyebrow, title, intro, columns = [] }) {
  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <RevealGroup profile="dataMaterialize" className={styles.grid} itemClassName={styles.cell} stagger={0.1} {...fx('trust.claims-ledger')}>
        {columns.map((col, ci) => (
          <section key={col.id} className={styles.col} aria-label={col.title} {...fx(`trust.column-${col.id}`)}>
            <header className={styles.head}>
              <span className={styles.idx}>{String(ci + 1).padStart(2, '0')}</span>
              <h3>{col.title}</h3>
              <i>{col.items.length}</i>
            </header>
            <p className={styles.lede}>{col.lede}</p>
            <Accordion
              className={styles.acc}
              numbered={false}
              items={col.items.map((it, i) => ({
                id: `${col.id}-${i}`,
                title: it.title,
                body: (
                  <div className={styles.how}>
                    <p>{it.how}</p>
                    {it.to && (
                      <Link to={it.to} className={styles.link} data-cursor="link">
                        {it.toLabel || 'See the page'} <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                ),
              }))}
            />
          </section>
        ))}
      </RevealGroup>
    </div>
  );
}
