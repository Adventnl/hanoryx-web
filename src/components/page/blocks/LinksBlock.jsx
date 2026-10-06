import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Shell } from './Shell';
import { SectionHeader } from '../../ui/SectionHeader';
import Card from '../../kit/Card';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { fx } from '../../../utils/fx';
import styles from './generic.module.css';

/**
 * Where to go next: a set of cards, each with one link to a page of the site.
 * The link is the thing you press (the card is not wrapped in it), and its text
 * names the page.
 *
 *   { type: 'links', items: [{ title, body, to, label? }], eyebrow?, title?, intro? }
 */
export function LinksBlock({ block, accent }) {
  return (
    <Shell block={block} accent={accent}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} size="h2" />
      <RevealGroup className={styles.linkGrid} itemClassName={styles.cell} stagger={0.07} {...fx('links.cards')}>
        {block.items.map((item) => (
          <Card
            key={item.to}
            title={item.title}
            as="h3"
            interactive
            footer={<Link className={styles.go} to={item.to}>{item.label || 'Read it'} <ArrowUpRight size={13} aria-hidden="true" /></Link>}
          >
            {item.body}
          </Card>
        ))}
      </RevealGroup>
    </Shell>
  );
}

export default LinksBlock;
