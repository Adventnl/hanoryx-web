import { AlertTriangle, Info, Lightbulb, OctagonAlert } from 'lucide-react';
import styles from './content.module.css';

const TONES = {
  note: { icon: Info, word: 'Note' },
  tip: { icon: Lightbulb, word: 'Tip' },
  warning: { icon: AlertTriangle, word: 'Warning' },
  danger: { icon: OctagonAlert, word: 'Danger' },
};

/**
 * A remark that is set apart from the text around it: a note, a tip, a warning.
 * The kind is written out as a word as well as shown by colour and icon. It is
 * part of the reading flow — a `note` role, not a landmark and not an alert.
 */
export default function Callout({ tone = 'note', title, children, className }) {
  const { icon: Icon, word } = TONES[tone] || TONES.note;
  return (
    <div className={`${styles.callout} ${className || ''}`} data-tone={tone} role="note">
      <Icon size={17} aria-hidden="true" />
      <div>
        <p className={styles.calloutTitle}>{title || word}</p>
        <div className={styles.calloutBody}>{children}</div>
      </div>
    </div>
  );
}
