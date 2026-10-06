import styles from './content.module.css';

/**
 * A reading column. Wrap plain HTML — headings, paragraphs, lists, links, code,
 * quotes — and it is typeset for reading: about 68 characters wide, 1.8 line
 * height, the display serif for headings and a red marker on list bullets.
 */
export default function Prose({ children, as: Tag = 'div', className }) {
  return <Tag className={`${styles.prose} ${className || ''}`}>{children}</Tag>;
}
