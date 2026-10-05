import { useState } from 'react';
import ArticleArtShape from './ArticleArtShape';
import { fx } from '../../utils/fx';
import styles from './ArticleArt.module.css';

/** The hero object of a guide: its drawing, large. It draws itself in once, and
 *  again whenever you point at it. */
export default function ArticleArt({ art, caption }) {
  const [n, setN] = useState(0);
  return (
    <figure className={styles.hero} onPointerEnter={() => setN((v) => v + 1)} onFocus={() => setN((v) => v + 1)} tabIndex={0} {...fx('article.hero-drawing')}>
      <ArticleArtShape art={art} key={n} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
