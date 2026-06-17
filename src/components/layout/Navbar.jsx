import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { navLinks } from '../../data/navigation';
import { company } from '../../data/company';
import { brandLogo } from '../../utils/assetResolver';
import { Button } from '../ui/Button';
import { AudioControl } from '../animation/AudioControl';
import { MegaMenu } from './MegaMenu';
import styles from './Navbar.module.css';

/**
 * Fixed primary navigation. Desktop: brand, route links with a hover
 * mega-menu preview, live status, audio toggle, contact CTA. Mobile:
 * brand + animated hamburger that drives the full-screen MobileNav.
 */
export function Navbar({ isPlaying, onToggleAudio, menuOpen, onToggleMenu }) {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(styles.nav, scrolled && styles.scrolled)}
      onMouseLeave={() => setHovered(null)}
    >
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Hanoryx Systems — home">
          <img src={brandLogo} alt="" className={styles.logo} />
          <span className={styles.wordmark}>Hanoryx Systems</span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
              onMouseEnter={() => setHovered(link.to)}
            >
              <span className={styles.linkLabel}>{link.label}</span>
              <span className={styles.linkCode}>{link.code}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          <span className={styles.status}>
            <span className={styles.statusDot} />
            {company.status}
          </span>
          <AudioControl isPlaying={isPlaying} onToggle={onToggleAudio} className={styles.audio} />
          <Button to="/contact" variant="primary" size="sm" className={styles.cta}>
            Contact
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

      <MegaMenu
        activeKey={hovered}
        onMouseEnter={() => setHovered(hovered)}
        onMouseLeave={() => setHovered(null)}
      />
    </header>
  );
}

export default Navbar;
