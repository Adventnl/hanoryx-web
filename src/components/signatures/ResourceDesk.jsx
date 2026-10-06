import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { SpotlightCard } from '../fx/SpotlightCard';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { glossary } from '../../data/glossary';
import { releases } from '../../data/releases';
import { downloads, tools } from '../../data/resources';
import { fx } from '../../utils/fx';
import styles from './ResourceDesk.module.css';

/** The four shelves of the resource centre, each with a live count read from the
 *  data behind it and a small peek at what is on it. */
export default function ResourceDesk({ eyebrow, title, intro, note }) {
  const reduced = usePrefersReducedMotion();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (reduced) return undefined;
    const id = window.setInterval(() => setAt((n) => n + 1), 4200);
    return () => window.clearInterval(id);
  }, [reduced]);
  const term = glossary[(at * 7) % glossary.length];
  const latest = releases[0];

  const tiles = [
    {
      id: 'glossary', to: '/resources/glossary', n: glossary.length, unit: 'terms', name: 'Glossary', blurb: 'Every word the guides lean on, in plain language.',
      peek: (<div className={styles.peekTerm} aria-hidden="true" key={term.term}><b>{term.term}</b><span>{term.def}</span></div>),
    },
    {
      id: 'changelog', to: '/resources/changelog', n: releases.length, unit: 'chapters', name: 'Release notes', blurb: 'What changed on the site, told in chapters.',
      peek: (<div className={styles.peekTerm}><b>{latest.title}</b><span>{latest.lede}</span></div>),
    },
    {
      id: 'downloads', to: '/resources/downloads', n: downloads.length, unit: 'documents', name: 'Downloads', blurb: 'Templates and checklists, generated in your browser.',
      peek: (<ul className={styles.files}>{downloads.slice(0, 4).map((d) => <li key={d.id}>{d.file}</li>)}</ul>),
    },
    {
      id: 'tools', to: '/resources/tools', n: tools.length, unit: 'tools', name: 'Tools', blurb: 'Small, honest tools that run in the page.',
      peek: (<ul className={styles.chips}>{tools.map((t) => <li key={t.id}>{t.title}</li>)}</ul>),
    },
  ];

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <RevealGroup profile="dataMaterialize" className={styles.grid} itemClassName={styles.cell} stagger={0.08}>
        {tiles.map((t) => (
          <SpotlightCard key={t.id} to={t.to} className={styles.cardWrap} innerClassName={styles.card} {...fx('resources.shelf')}>
            <span className={styles.count}><b>{t.n}</b><span>{t.unit}</span></span>
            <h3 className={styles.name}>{t.name}</h3>
            <p className={styles.blurb}>{t.blurb}</p>
            <div className={styles.peek}>{t.peek}</div>
            <ArrowUpRight className={styles.arrow} size={18} strokeWidth={1.4} aria-hidden="true" />
          </SpotlightCard>
        ))}
      </RevealGroup>
      <p className={styles.also}>Looking for the long reads? <Link to="/insights" data-cursor="link">The guides live under Insights.</Link></p>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
