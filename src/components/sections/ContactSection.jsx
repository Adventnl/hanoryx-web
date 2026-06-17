import { useState } from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { contact } from '../../data/company';
import { SectionHeader } from '../ui/SectionHeader';
import { DataPanel } from '../ui/DataPanel';
import { Button } from '../ui/Button';
import { Pill } from '../ui/Pill';
import { ScrollReveal } from '../animation/ScrollReveal';
import { SystemGrid } from '../animation/SystemGrid';
import styles from './ContactSection.module.css';

/* Single channel — kept in-file, never exported. */
const CONTACT_EMAIL = 'contact@hanoryx.com';
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;

/**
 * ContactSection — the channel.
 *
 *   variant="cta"   compact, centered CTA band reused at the bottom of pages.
 *   variant="full"  the Contact page: header, email row, inquiry cards, form.
 */
export function ContactSection({ variant = 'cta' }) {
  // Controlled form state. setState is only ever called from event handlers.
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: contact.inquiryTypes[0]?.title ?? '',
    message: '',
  });

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = `Inquiry // ${form.type || 'General'}`;
    const body = [
      `From: ${form.name}`,
      `Reply: ${form.email}`,
      `Type: ${form.type}`,
      '',
      form.message,
    ].join('\n');
    const href = `${CONTACT_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  /* ---------------------------------------------------------------- CTA --- */
  if (variant === 'cta') {
    return (
      <section className={clsx('section', styles.band)}>
        <SystemGrid nodes={4} className={styles.bandGrid} />

        <div className={clsx('container', styles.bandInner)}>
          <SectionHeader
            eyebrow={contact.eyebrow}
            title={contact.title}
            size="display"
            align="center"
            className={styles.bandHeader}
          />

          <ScrollReveal as="div" className={clsx('stack stack-6', styles.bandBody)}>
            <p className={clsx('lead', styles.bandLead)}>{contact.body}</p>

            <a href={CONTACT_HREF} className={clsx('font-serif', styles.bigEmail)}>
              {CONTACT_EMAIL}
            </a>

            <div className={clsx('cluster', styles.bandActions)}>
              <Button href={CONTACT_HREF} variant="primary" icon={ArrowUpRight}>
                Email Hanoryx
              </Button>
              <Button to="/contact" variant="outline">
                Contact page
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  /* --------------------------------------------------------------- FULL --- */
  return (
    <section className={clsx('section', styles.full)}>
      <div className="container">
        {/* 1 — Header */}
        <SectionHeader
          eyebrow={contact.eyebrow}
          title={contact.title}
          intro={contact.body}
          size="hero"
        />

        {/* 2 — Large email CTA row */}
        <ScrollReveal as="div" className={clsx(styles.emailRow)}>
          <div className={styles.emailLead}>
            <span className={clsx('eyebrow', styles.emailLabel)}>Direct channel</span>
            <a href={CONTACT_HREF} className={clsx('font-serif', styles.bigEmail)}>
              {CONTACT_EMAIL}
            </a>
          </div>
          <Button href={CONTACT_HREF} variant="primary" icon={ArrowUpRight}>
            Email Hanoryx
          </Button>
        </ScrollReveal>

        {/* 3 — Inquiry type cards */}
        <ScrollReveal
          as="div"
          className={clsx('grid', 'grid--auto', styles.inquiries)}
          stagger={0.1}
        >
          {contact.inquiryTypes.map((type) => (
            <DataPanel key={type.id} label={type.code} className={styles.inquiry}>
              <h3 className={clsx('heading-3', styles.inquiryTitle)}>{type.title}</h3>
              <p className={clsx('body-sm', styles.inquiryBody)}>{type.body}</p>
            </DataPanel>
          ))}
        </ScrollReveal>

        {/* 4 — Contact form */}
        <ScrollReveal as="div" className={styles.formWrap}>
          <div className={styles.formHead}>
            <Pill variant="red" dot>
              FORM // OPEN
            </Pill>
            <span className={clsx('mono', styles.formCode)}>TX.COMPOSE</span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="contact-name" className={clsx('data-label', styles.fieldLabel)}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={styles.input}
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                />
                <span className={styles.underline} aria-hidden="true" />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email" className={clsx('data-label', styles.fieldLabel)}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={styles.input}
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                />
                <span className={styles.underline} aria-hidden="true" />
              </div>
            </div>

            {/* Inquiry type — segmented control of real buttons. */}
            <fieldset className={styles.segmentField}>
              <legend className={clsx('data-label', styles.fieldLabel)}>Inquiry type</legend>
              <div className={styles.segments} role="radiogroup" aria-label="Inquiry type">
                {contact.inquiryTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    role="radio"
                    aria-checked={form.type === type.title}
                    className={clsx(
                      'mono',
                      styles.segment,
                      form.type === type.title && styles.segmentActive
                    )}
                    onClick={() => setForm((prev) => ({ ...prev, type: type.title }))}
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className={clsx(styles.field, styles.fieldMessage)}>
              <label htmlFor="contact-message" className={clsx('data-label', styles.fieldLabel)}>
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className={clsx(styles.input, styles.textarea)}
                value={form.message}
                onChange={handleChange('message')}
                required
              />
              <span className={styles.underline} aria-hidden="true" />
            </div>

            <div className={clsx('cluster', 'cluster--between', styles.formFoot)}>
              <span className={clsx('mono', styles.footNote)}>
                Composes a local mail draft — no data is stored.
              </span>
              <Button type="submit" variant="primary" icon={ArrowRight}>
                Compose inquiry
              </Button>
            </div>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default ContactSection;
