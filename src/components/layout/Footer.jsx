import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUp, ArrowUpRight, Plus, Search } from 'lucide-react';
import { footerColumns, footerLegalRow, pageRouteKeys, routePath, siteSections } from '../../app/routeConfig';
import { company } from '../../data/company';
import { latestReleases } from '../../data/releases';
import { brandLogo } from '../../utils/assetResolver';
import { useLenis } from '../../app/providers/lenis-context';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { RevealGroup } from '@/animation/reveal/Reveal';
import { ProximityText } from '../fx/ProximityText';
import { VelocityMarquee } from '../fx/VelocityMarquee';
import { ArrowLink } from '../fx/ArrowLink';
import { KeyCap } from '../fx/KeyCap';
import { fx } from '../../utils/fx';
import styles from './Footer.module.css';

const MARQUEE = ['MUSEBASE', 'YK ENGINE', 'CUSTOMER PRODUCT', 'INTERNAL CRM', 'SYSTEMS', 'INTERFACES', 'INSIGHTS', 'TOOLS'];
const RING_R = 20;

/* Only link to pages that exist, so the footer model can be written ahead of
   the pages it points at. Computed once. */
const KNOWN = new Set(pageRouteKeys.map(routePath));
const COLUMNS = footerColumns
  .map((col) => ({ ...col, groups: col.groups.map((g) => ({ ...g, links: g.links.filter((l) => KNOWN.has(l.to)) })).filter((g) => g.links.length) }))
  .filter((col) => col.groups.length);
const SECTIONS = siteSections.map((s) => ({ ...s, count: pageRouteKeys.filter(s.test).length })).filter((s) => s.count > 0 && KNOWN.has(s.to));
const LEGAL_ROW = footerLegalRow.filter((l) => KNOWN.has(l.to));

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

/** One column of the directory. On a wide screen it is a plain list under its
 *  title; on a phone the title becomes a disclosure (as in a large retailer's
 *  footer) so the page doesn't end in a mile of links. */
function Column({ col, index, narrow, open, onToggle, here }) {
  const listId = `footer-${col.id}`;
  const title = (
    <>
      <span className={styles.colNum} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <span className={styles.colName}>{col.title}</span>
    </>
  );
  return (
    <div className={clsx(styles.column, narrow && styles.accordion, open && styles.open)} {...fx(`footer.column-${col.id}`)}>
      <h2 className={styles.colTitle}>
        {narrow ? (
          <button type="button" className={styles.colToggle} aria-expanded={open} aria-controls={listId} onClick={onToggle} {...fx('footer.accordion-toggle')}>
            {title}
            <Plus className={styles.plus} size={16} strokeWidth={1.4} aria-hidden="true" />
          </button>
        ) : (
          title
        )}
      </h2>
      <div id={listId} className={styles.colBody}>
        <div className={styles.colInner}>
          {col.groups.map((g) => (
            <div key={g.heading} className={styles.group}>
              <h3 className={styles.groupHeading}>{g.heading}</h3>
              <ul className={styles.colLinks}>
                {g.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={styles.colLink} aria-current={here === l.to ? 'page' : undefined}>
                      <span className={styles.colText}>{l.label}</span>
                      <ArrowUpRight className={styles.colArrow} size={13} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Site footer — a directory of the whole site, not a second navigation bar.
 * The primary menu carries Work, Systems, Development and Company; this leads to
 * the rest: how the company works, the guides, the tools, the trust material and
 * the legal documents. Six columns with named groups, a search field, a row of
 * the site's sections with live page counts, a strip of what is new, a legal
 * row, a marquee that scroll velocity pushes, a back-to-top ring that fills as
 * you read, the visitor's local time, and a wordmark whose letters answer the
 * pointer. Columns fold into disclosures on a phone.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  const narrow = useMediaQuery('(max-width: 900px)');
  const [openCol, setOpenCol] = useState(null);

  return (
    <footer className={styles.footer}>
      <span className={styles.topLine} aria-hidden="true" />

      <div className={styles.marquee} {...fx('footer.velocity-marquee')}>
        <VelocityMarquee items={MARQUEE} speed={38} direction={-1} itemClassName={styles.marqueeText} />
      </div>

      <div className={styles.head}>
        <RevealGroup profile="settleDown" className={styles.lead} stagger={0.08}>
          <div className={styles.brandRow}>
            <img className={styles.logo} src={brandLogo} alt="" />
            <span className={styles.brand}>Hanoryx Systems</span>
          </div>
          <span className={styles.division}>// {company.division}</span>
          <p className={styles.blurb}>Online systems, software platforms and digital operating environments.</p>
          <div className={styles.leadLinks}>
            <ArrowLink to="/contact" tone="red" {...fx('footer.contact-link')}>Contact</ArrowLink>
            <Link to="/trust/status" className={styles.live} data-cursor="link" {...fx('footer.live-status')}>
              <span className={styles.liveDot} aria-hidden="true" />
              {company.status} · status
            </Link>
          </div>
        </RevealGroup>

        <div className={styles.find}>
          <button type="button" className={styles.search} onClick={() => window.dispatchEvent(new Event('hanoryx:search'))} {...fx('footer.search-field')}>
            <Search size={18} strokeWidth={1.5} aria-hidden="true" />
            <span className={styles.searchText}>Search pages, guides, tools and policies</span>
            <span className={styles.searchKeys} aria-hidden="true"><KeyCap>⌘</KeyCap><KeyCap>K</KeyCap></span>
            <span className="sr-only">Open the site search</span>
          </button>

          <nav className={styles.sections} aria-label="Sections of the site" {...fx('footer.section-row')}>
            <span className={styles.sectionsLabel}>Browse</span>
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <Link to={s.to} className={styles.sectionLink} aria-current={pathname === s.to ? 'page' : undefined} data-cursor="link">
                    {s.label}<i>{s.count}</i>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className={styles.news} {...fx('footer.news-strip')}>
        <span className={styles.newsLabel}><span className={styles.newsDot} aria-hidden="true" />New on the site</span>
        <ul>
          {latestReleases.map((r) => (
            <li key={r.id}>
              <Link to={r.to || '/resources/changelog'} className={styles.newsItem} data-cursor="link">
                <span className={styles.newsNum}>Ch. {r.chapter}</span>
                <span className={styles.newsTitle}>{r.title}</span>
                <span className={styles.newsLede}>{r.lede}</span>
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <nav className={styles.columns} aria-label="Footer" {...fx('footer.directory')}>
        {COLUMNS.map((col, i) => (
          <Column
            key={col.id}
            col={col}
            index={i}
            narrow={narrow}
            open={openCol === col.id}
            onToggle={() => setOpenCol((cur) => (cur === col.id ? null : col.id))}
            here={pathname}
          />
        ))}
      </nav>

      <div className={styles.meta}>
        <LocalTime />
        <span className={styles.hint} {...fx('footer.key-hints')}>
          Press <KeyCap>?</KeyCap> for shortcuts · <KeyCap>⌘</KeyCap><KeyCap>K</KeyCap> to search
        </span>
        <span className={styles.count}>{pageRouteKeys.length} pages</span>
        <BackToTop />
      </div>

      <div className={styles.wordmarkWrap} {...fx('footer.pointer-wordmark')}>
        <ProximityText text="HANORYX" by="char" radius={260} as="span" className={styles.wordmark} />
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© {year} Hanoryx Systems. All rights reserved.</p>
        <ul className={styles.legalRow} aria-label="Legal" {...fx('footer.legal-row')}>
          {LEGAL_ROW.map((l) => (
            <li key={l.to}><Link to={l.to} aria-current={pathname === l.to ? 'page' : undefined}>{l.label}</Link></li>
          ))}
        </ul>
        <span className={styles.corner} aria-hidden="true" {...fx('footer.signal-corner')}>
          HANORYX SYSTEMS
          <span className={styles.signal} />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
