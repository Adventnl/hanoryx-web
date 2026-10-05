import { Inbox } from 'lucide-react';
import styles from './feedback.module.css';

/**
 * What a list or a page says when there is nothing in it: why it is empty, and
 * the one thing to do next. An empty state with no way forward is a dead end.
 */
export default function EmptyState({ icon: Icon = Inbox, title, children, action, className }) {
  return (
    <div className={`${styles.empty} ${className || ''}`}>
      <Icon size={30} strokeWidth={1.2} aria-hidden="true" />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
