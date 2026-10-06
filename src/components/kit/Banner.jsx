import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import styles from './feedback.module.css';

/**
 * A notice that runs the width of its container, for something about the whole
 * page or site rather than one field. It may carry one action (a link or a
 * button) and may be dismissed; dismissing it is remembered only until reload.
 */
export default function Banner({ title, children, action, dismissible = true, className }) {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <div className={`${styles.banner} ${className || ''}`} role="group" aria-label={title || 'Notice'}>
      <p className={styles.bannerText}>{title && <b>{title} </b>}{children}</p>
      {action && (action.to
        ? <Link to={action.to} className={styles.bannerAction} data-cursor="link">{action.label}</Link>
        : <button type="button" className={styles.bannerAction} onClick={action.onClick}>{action.label}</button>)}
      {dismissible && <button type="button" className={styles.dismiss} onClick={() => setGone(true)} aria-label="Dismiss this notice"><X size={14} aria-hidden="true" /></button>}
    </div>
  );
}
