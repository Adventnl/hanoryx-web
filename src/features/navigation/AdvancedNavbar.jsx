import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { navGroups } from '../../app/routeConfig';
import { company } from '../../data/company';
import { brandLogo } from '../../utils/assetResolver';
import { AudioSignalButton } from '../audio/AudioSignalButton';
import { RadialMegaMenu } from './RadialMegaMenu';
import { useNavIntent } from './useNavIntent';
import { useDismissableLayer } from './useDismissableLayer';
import styles from './AdvancedNavbar.module.css';

/**
 * Primary navigation with an intentional hover-intent controller and a true
 * radial deploy menu. The menu opens only on a deliberate dwell and closes on
 * every dismissal path: route change, link click, outside pointer, Escape,
 * scroll, window blur, focus-out, and the mobile menu opening. Single-child
 * groups (Timeline / Contact) never deploy a panel — they are plain links.
 */
export function AdvancedNavbar({ menuOpen, onToggleMenu }) {
  const [scrolled, setScrolled] = useState(false);
  const [anchorX, setAnchorX] = useState(null);
  const { pathname } = useLocation();

  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const groupRefs = useRef({});

  const {
    activeGroup,
    openGroup,
    closeGroup,
    scheduleOpen,
    scheduleClose,
    cancelClose,
    trackVelocity,
  } = useNavIntent({ openDelay: 150, closeDelay: 130 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // Guaranteed close-on-scroll (no-op when nothing is open).
      closeGroup({ immediate: true });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [closeGroup]);

  // BUG FIX: stale activeGroup must never survive a navigation.
  useEffect(() => {
    closeGroup({ immediate: true });
  }, [pathname, closeGroup]);

  // BUG FIX: opening the mobile menu must dismiss the desktop panel.
  useEffect(() => {
    if (menuOpen) closeGroup({ immediate: true });
  }, [menuOpen, closeGroup]);

  // Anchor the deploy under the active group so it "emerges" from the item.
  useLayoutEffect(() => {
    if (!activeGroup) return;
    const el = groupRefs.current[activeGroup];
    if (el) {
      const r = el.getBoundingClientRect();
      setAnchorX(r.left + r.width / 2);
    }
  }, [activeGroup]);

  const open = navGroups.find((g) => g.id === activeGroup) || null;
  const openMulti = open && open.children.length > 1 ? open : null;

  // Dismissal layer (only armed when a panel is showing).
  const handleDismiss = useCallback(() => closeGroup({ immediate: true }), [closeGroup]);
  useDismissableLayer(!!openMulti, handleDismiss, [headerRef, menuRef]);

  const isGroupActive = (g) => pathname === g.to || pathname.startsWith(`${g.to}/`);

  const onGroupEnter = (g, e) => {
    if (e) trackVelocity(e);
    if (g.children.length > 1) scheduleOpen(g.id);
    else scheduleClose(); // hovering a single-link group dismisses any open panel
  };
  const onGroupKeyDown = (g, e) => {
    if (g.children.length <= 1) return;
    if (e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      openGroup(g.id);
    }
  };

  return (
    <header
      ref={headerRef}
      data-chrome
      className={clsx(styles.nav, scrolled && styles.scrolled, openMulti && styles.menuActive)}
      onMouseMove={trackVelocity}
      onMouseLeave={() => scheduleClose()}
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
                ref={(el) => {
                  groupRefs.current[g.id] = el;
                }}
                data-cursor="nav"
                className={clsx(styles.group, isGroupActive(g) && styles.active, activeGroup === g.id && styles.groupOpen)}
                onMouseEnter={(e) => onGroupEnter(g, e)}
                onMouseLeave={() => scheduleClose()}
                onFocus={() => (multi ? openGroup(g.id) : closeGroup({ immediate: true }))}
                onKeyDown={(e) => onGroupKeyDown(g, e)}
                onClick={() => closeGroup({ immediate: true })}
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
        ref={menuRef}
        group={openMulti}
        anchorX={anchorX}
        onMouseEnter={cancelClose}
        onMouseLeave={() => scheduleClose()}
        onNavigate={() => closeGroup({ immediate: true })}
      />
    </header>
  );
}

export default AdvancedNavbar;
