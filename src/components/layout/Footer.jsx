import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { footer } from '../../data/navigation';
import { company } from '../../data/company';
import { RevealGroup } from '@/animation/reveal/Reveal';
import styles from './Footer.module.css';

/**
 * Professional site footer: division identity, link columns, contact,
 * system-status telemetry, and a large dissolving wordmark. Decorative
 * scanning lines keep it quietly alive.
 */
export function Footer() {
  const year = 2026;

  return (
    <footer className={styles.footer}>
      <span className={styles.topLine} aria-hidden="true" />

      <div className={styles.inner}>
        <RevealGroup profile="settleDown" className={styles.lead} stagger={0.08}>
          <div className={styles.brandRow}>
            <span className={styles.brand}>Hanoryx Systems</span>
            <span className={styles.division}>// {company.division}</span>
          </div>
          <p className={styles.blurb}>{footer.blurb}</p>
          <Link to="/contact" className={styles.email}>
            {company.email}
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </Link>
        </RevealGroup>

        <RevealGroup as="nav" profile="riseRotate" className={styles.columns} stagger={0.1} aria-label="Footer">
          {footer.columns.map((col) => (
            <div key={col.id} className={styles.column}>
              <h4 className={styles.colTitle}>{col.title}</h4>
              <ul className={styles.colLinks}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <a href={l.href} className={styles.colLink}>{l.label}</a>
                    ) : (
                      <Link to={l.to} className={styles.colLink}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </RevealGroup>
      </div>

      <div className={styles.telemetry}>
        {footer.telemetry.map((t) => (
          <span key={t.k} className={styles.telItem}>
            <span className={styles.telKey}>{t.k}</span>
            <span className={styles.telVal}>{t.v}</span>
            <span className={styles.signal} />
          </span>
        ))}
      </div>

      <div className={styles.wordmarkWrap} aria-hidden="true">
        <span className={styles.wordmark}>HANORYX</span>
      </div>

      <div className={styles.bottom}>
        <span className={styles.corner} aria-hidden="true">
          <span className={styles.dial} />
          NET.SYS_CONNECTED
        </span>
        <p className={styles.copy}>© {year} Hanoryx Systems. All rights reserved.</p>
        <span className={styles.corner} aria-hidden="true">
          DATA_STREAM_IDLE
          <span className={styles.signal} />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
