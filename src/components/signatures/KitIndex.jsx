import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, SearchX } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Badge, Card, EmptyState, Grid, SearchField } from '../kit';
import { kit, kitFamilies } from '../../data/kit';
import { fx } from '../../utils/fx';
import styles from './KitIndex.module.css';

/**
 * The front door of the interface kit: every component, found by name or by what
 * it is for. With nothing typed it shows the six families (each with its count and
 * a few of its components); as you type it becomes a list of matches that link
 * straight to the component, open in its family's gallery.
 */
export default function KitIndex({ eyebrow, title, intro, note }) {
  const [q, setQ] = useState('');
  const families = useMemo(() => kitFamilies.map((f) => ({ ...f, items: kit.filter((k) => k.family === f.id) })), []);
  const hits = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return null;
    return kit.filter((k) => words.every((w) => `${k.name} ${k.summary} ${k.family}`.toLowerCase().includes(w)));
  }, [q]);

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} intro={intro} size="h1" variant="left" />
      <div className={styles.top} {...fx('kit.search')}>
        <SearchField label="Find a component" value={q} onChange={setQ} count={hits ? hits.length : kit.length} noun="components" placeholder="A name, or what you need: sort, date, focus…" />
      </div>

      {hits ? (
        hits.length ? (
          <ul className={styles.results} aria-label="Matching components" {...fx('kit.results')}>
            {hits.map((k) => {
              const family = kitFamilies.find((f) => f.id === k.family);
              return (
                <li key={k.id} className={styles.hit}>
                  <Link to={`${family.to}#${k.id}`} data-cursor="link">{k.name}</Link>
                  <Badge tone="outline">{family.name}</Badge>
                  <p>{k.summary}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={styles.empty}>
            <EmptyState icon={SearchX} title="No component by that description">Try a shorter word, or clear the search to see the six families.</EmptyState>
          </div>
        )
      ) : (
        <Grid min="19rem" gap={4} className={styles.families} {...fx('kit.families')}>
          {families.map((f) => (
            <Card key={f.id} as="h3" eyebrow={`${f.items.length} components`} title={<Link to={f.to} data-cursor="link" style={{ color: 'inherit', textDecoration: 'none' }}>{f.name}</Link>} footer={<Link to={f.to} className={styles.open} data-cursor="link">Open the gallery <ArrowUpRight size={13} aria-hidden="true" /></Link>} interactive>
              <p style={{ margin: '0 0 0.9rem' }}>{f.blurb}</p>
              <ul className={styles.names} aria-label={`${f.name} components`}>
                {f.items.slice(0, 6).map((k) => <li key={k.id}>{k.name}</li>)}
                {f.items.length > 6 && <li>+{f.items.length - 6} more</li>}
              </ul>
            </Card>
          ))}
        </Grid>
      )}
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
