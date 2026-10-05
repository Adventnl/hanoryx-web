import { AlertTriangle, CheckCircle2, Info, OctagonAlert, X } from 'lucide-react';
import styles from './feedback.module.css';

const TONES = {
  info: { icon: Info, role: 'status' },
  success: { icon: CheckCircle2, role: 'status' },
  warning: { icon: AlertTriangle, role: 'alert' },
  danger: { icon: OctagonAlert, role: 'alert' },
};

/**
 * A message in the flow of the page. Information and success speak politely
 * (`role="status"`); warnings and errors interrupt (`role="alert"`). The tone is
 * never carried by colour alone — it has an icon and a title.
 */
export default function Alert({ tone = 'info', title, children, onDismiss, className }) {
  const { icon: Icon, role } = TONES[tone] || TONES.info;
  return (
    <div className={`${styles.alert} ${className || ''}`} data-tone={tone} role={role}>
      <Icon size={17} aria-hidden="true" />
      <div className={styles.alertBody}>
        {title && <b>{title}</b>}
        {children && <p>{children}</p>}
      </div>
      {onDismiss ? <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss this message"><X size={14} aria-hidden="true" /></button> : <span />}
    </div>
  );
}
