import styles from './content.module.css';

/**
 * Reserves a box of a fixed shape (`ratio="16 / 9"`) and fills it with its child, so
 * an image, a video or a chart has its room before it loads and nothing below it
 * jumps when it arrives.
 */
export default function AspectRatio({ ratio = '16 / 9', children, className }) {
  return <div className={`${styles.ratio} ${className || ''}`} style={{ '--ratio': ratio }}>{children}</div>;
}
