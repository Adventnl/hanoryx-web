import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { directory } from '../../app/routeConfig';
import { company } from '../../data/company';
import { brandLogo } from '../../utils/assetResolver';
import { useLenis } from '../../app/providers/lenis-context';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { ProximityText } from '../fx/ProximityText';
import { VelocityMarquee } from '../fx/VelocityMarquee';
import { ArrowLink } from '../fx/ArrowLink';
import { KeyCap } from '../fx/KeyCap';
import { fx } from '../../utils/fx';
import styles from './Footer.module.css';

const MARQUEE = ['MUSEBASE', 'YK ENGINE', 'CUSTOMER PRODUCT', 'INTERNAL CRM', 'SYSTEMS', 'INTERFACES'];
const RING_R = 20;

/** Back to top: a ring that fills with page scroll progress. Written straight to
 *  the SVG on scroll (no React state), clicking glides home through Lenis. */
function BackToTop() {
  const arcRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (arcRef.current) arcRef.current.style.strokeDashoffset = String(1 - p);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <button type="button" className={styles.top} onClick={() => lenis.scrollTo(0, { duration: 1.6 })} aria-label="Back to top" {...fx('footer.back-to-top-ring')}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className={styles.topTrack} cx="24" cy="24" r={RING_R} pathLength="1" />
        <circle ref={arcRef} className={styles.topArc} cx="24" cy="24" r={RING_R} pathLength="1" />
      </svg>
      <ArrowUp className={styles.topArrow} size={16} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

/** The visitor's own local time, ticking once a minute. */
function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);
  const label = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  return (
    <span className={styles.time} {...fx('footer.local-time')}>
      <span className={styles.timeKey}>YOUR LOCAL TIME</span>
      <span className={styles.timeVal}>{label}</span>
    </span>
  );
}

/**
 * Site footer: a real directory (every link is a real page, Contact included), a
 * marquee that scroll velocity pushes, a link column "lens", a back-to-top ring
 * that fills as you read, the visitor's local time, and a wordmark whose letters
 * answer the pointer.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const total = directory.reduce((n, col) => n + col.links.length, 0);

  return (
    <footer className={styles.footer}>
      <span className={styles.topLine} aria-hidden="true" />

      <div className={styles.marquee} {...fx('footer.velocity-marquee')}>
        <VelocityMarquee items={MARQUEE} speed={38} direction={-1} itemClassName={styles.marqueeText} />
      </div>

      <div className={styles.inner}>
        <RevealGroup profile="settleDown" className={styles.lead} stagger={0.08}>
          <div className={styles.brandRow}>
            <img className={styles.logo} src={brandLogo} alt="" />
            <span className={styles.brand}>Hanoryx Systems</span>
          </div>
          <span className={styles.division}>// {company.division}</span>
          <p className={styles.blurb}>Online systems, software platforms and digital operating environments.</p>
          <ArrowLink to="/contact" tone="red">Contact</ArrowLink>
          <span className={styles.live}>
            <span className={styles.liveDot} aria-hidden="true" />
            {company.status}
          </span>
        </RevealGroup>

        <RevealGroup as="nav" profile="riseRotate" className={styles.columns} stagger={0.09} aria-label="Footer">
          {directory.map((col, ci) => (
            <div key={col.id} className={styles.column} {...fx(`footer.column-${col.id}`)}>
              <h2 className={styles.colTitle}>
                <span className={styles.colNum}>{String(ci + 1).padStart(2, '0')}</span>
                {col.title}
              </h2>
              <ul className={styles.colLinks}>
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={styles.colLink}>
                      <span className={styles.colText}>{l.label}</span>
                      <ArrowUpRight className={styles.colArrow} size={13} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </RevealGroup>
      </div>

      <div className={styles.meta}>
        <LocalTime />
        <span className={styles.hint}>
          Press <KeyCap>?</KeyCap> for shortcuts · <KeyCap>⌘</KeyCap><KeyCap>K</KeyCap> to search
        </span>
        <span className={styles.count}>{total} pages</span>
        <BackToTop />
      </div>

      <div className={styles.wordmarkWrap} {...fx('footer.pointer-wordmark')}>
        <ProximityText text="HANORYX" by="char" radius={260} as="span" className={styles.wordmark} />
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© {year} Hanoryx Systems. All rights reserved.</p>
        <span className={styles.corner} aria-hidden="true">
          HANORYX SYSTEMS
          <span className={styles.signal} />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
