import { PageTransition } from '../components/layout/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ContactSection } from '../components/sections/ContactSection';
import styles from './Contact.module.css';

/**
 * Contact — thin page wrapper around the full ContactSection, which already
 * carries the hero header, direct-email row, inquiry cards, and the form.
 */
export default function Contact() {
  useDocumentTitle('Contact');

  return (
    <PageTransition>
      <div className={styles.page}>
        <ContactSection variant="full" />
      </div>
    </PageTransition>
  );
}
