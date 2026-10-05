import { Link } from 'react-router-dom';
import styles from './navigation.module.css';

/**
 * Where you are, as a trail back up. The last item is the current page and is
 * not a link; the trail sits in a `nav` named "Breadcrumb" so it can be found.
 *
 *   items: [{ label: 'Resources', to: '/resources' }, { label: 'Glossary' }]
 */
export default function Breadcrumbs({ items = [], label = 'Breadcrumb', className }) {
  return (
    <nav className={`${styles.crumbs} ${className || ''}`} aria-label={label}>
      <ol>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`}>
            {i === items.length - 1 || !item.to ? <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span> : <Link to={item.to} data-cursor="link">{item.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
