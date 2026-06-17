import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { navGroups } from '../../app/routeConfig';
import { company } from '../../data/company';
import { brandLogo } from '../../utils/assetResolver';
import { Button } from '../ui/Button';
import { AudioSignalButton } from '../audio/AudioSignalButton';
import { RadialMegaMenu } from './RadialMegaMenu';
import styles from './AdvancedNavbar.module.css';

/**
 * Primary navigation. Brand · grouped routes (multi-child groups deploy the
 * radial mega-menu on hover/focus) · status core + live audio signal + a
 * single primary action ("Open Channel" — Contact is not duplicated).
 * Background shifts on scroll; active route is marked with an animated node.
 */
export function AdvancedNavbar({ menuOpen, onToggleMenu }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isGroupActive = (g) => pathname === g.to || pathname.startsWith(`${g.to}/`);
  const open = navGroups.find((g) => g.id === activeGroup) || null;
  const openMulti = open && open.children.length > 1 ? open : null;

  return (
    <header
      className={clsx(styles.nav, scrolled && styles.scrolled)}
      onMouseLeave={() => setActiveGroup(null)}
    >
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Hanoryx Systems — home" data-cursor="link">
          <span className={styles.mark}>
            <img src={brandLogo} alt="" />
          </span>
          <span className={styles.wordmark}>Hanoryx Systems</span>
        </Link>

        <nav className={styles.groups} aria-label="Primary">
          {navGroups.map((g) => {
            const multi = g.children.length > 1;
            return (
              <NavLink
                key={g.id}
                to={g.to}
                data-cursor="nav"
                className={clsx(styles.group, isGroupActive(g) && styles.active)}
                onMouseEnter={() => setActiveGroup(g.id)}
                onFocus={() => setActiveGroup(g.id)}
                aria-haspopup={multi || undefined}
                aria-expanded={multi ? activeGroup === g.id : undefined}
              >
                <span className={styles.groupLabel}>{g.label}</span>
                <span className={styles.groupCode}>{g.code}</span>
                <span className={styles.marker} aria-hidden="true" />
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.right}>
          <span className={styles.status} aria-hidden="true">
            <span className={styles.statusDot} />
            {company.status}
          </span>
          <AudioSignalButton className={styles.audio} />
          <Button to="/contact" variant="primary" size="sm" className={styles.cta} data-cursor="link">
            Open Channel
          </Button>
          <button
            type="button"
            className={clsx(styles.burger, menuOpen && styles.burgerOpen)}
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <RadialMegaMenu
        group={openMulti}
        onMouseEnter={() => setActiveGroup(open?.id)}
        onMouseLeave={() => setActiveGroup(null)}
      />
    </header>
  );
}

export default AdvancedNavbar;
