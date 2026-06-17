import { PageTransition } from '../components/layout/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SectionScene } from '../components/scenes/SectionScene';
import { ContactSection } from '@/features/contact/ContactSection';
import styles from './Contact.module.css';

/**
 * Contact — the full ContactSection (hero header, direct-email row, inquiry
 * cards, animated form) over a live signal-wave field.
 */
export default function Contact() {
  useDocumentTitle('Contact');

  return (
    <PageTransition>
      <SectionScene as="div" scene="audio-signal-wall" intensity="high" className={styles.page}>
        <ContactSection variant="full" />
      </SectionScene>
    </PageTransition>
  );
}
