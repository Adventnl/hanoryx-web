import { useId } from 'react';
import { Plus } from 'lucide-react';
import { useControllable } from './useControllable';
import styles from './content.module.css';

/**
 * One section that opens and closes — a question and its answer, a "more detail".
 * The heading holds a button that says whether the section is open; the closed
 * body is out of the tab order and the reading order, not only out of sight.
 * Several in a row make an accordion; the fx/Accordion adds numbering and motion.
 */
export default function Disclosure({ title, children, open, defaultOpen = false, onChange, as: Heading = 'h3', className }) {
  const id = useId().replace(/:/g, '');
  const [isOpen, setOpen] = useControllable({ value: open, defaultValue: defaultOpen, onChange });
  return (
    <div className={`${styles.disclosure} ${className || ''}`}>
      <Heading className={styles.discHead}>
        <button type="button" className={styles.discBtn} aria-expanded={isOpen} aria-controls={`${id}-body`} onClick={() => setOpen(!isOpen)}>
          <span>{title}</span>
          <Plus size={16} aria-hidden="true" />
        </button>
      </Heading>
      <div id={`${id}-body`} className={styles.discBody} data-open={isOpen ? '' : undefined}>
        <div><div>{children}</div></div>
      </div>
    </div>
  );
}
