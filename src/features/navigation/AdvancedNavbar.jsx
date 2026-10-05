import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { navGroups } from '../../app/routeConfig';
import { company } from '../../data/company';
import { brandLogo } from '../../utils/assetResolver';
import { AudioSignalButton } from '../audio/AudioSignalButton';
import { RadialMegaMenu } from './RadialMegaMenu';
import { useNavIntent } from './useNavIntent';
import { useDismissableLayer } from './useDismissableLayer';
import styles from './AdvancedNavbar.module.css';
import { fx } from '../../utils/fx';

const INK_SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 };

/**
 * Primary navigation with an intentional hover-intent controller and a true
 * radial deploy menu. The menu opens only on a deliberate dwell and closes on
 * every dismissal path: route change, link click, outside pointer, Escape,
 * scroll, window blur, focus-out, and the mobile menu opening. Single-child
 * groups never deploy a panel — they are plain links.
 *
 * Flow details:
 *  - `revealed` (set by the shell as the intro lifts) glides the bar, then its
 *    parts, into place — the navbar is on screen the moment the site is.
 *  - the scrolled background is a layer whose OPACITY eases in (gradients cannot
 *    be transitioned, which is what made it jump), with the hairline drawing
 *    out from the centre.
 *  - one ink indicator springs between links instead of each link toggling its
 *    own underline.
 */
export function AdvancedNavbar({ menuOpen, onToggleMenu, revealed = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [anchorX, setAnchorX] = useState(null);
  const { pathname } = useLocation();
  // The hovered link is remembered with the path it was hovered on, so a stale
  // hover can never survive a navigation (derived, not reset in an effect).
  const [hover, setHover] = useState({ id: null, path: pathname });
  const hoverId = hover.path === pathname ? hover.id : null;
  const setHoverId = useCallback((id) => setHover({ id, path: pathname }), [pathname]);
  // `placed` flips on after the first measurement so the ink is positioned
  // there instantly and only SLIDES between links afterwards.
  const [ink, setInk] = useState({ x: 0, w: 0, on: false, placed: false });

  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const groupsRef = useRef(null);
  const groupRefs = useRef({});

  const {
    activeGroup,
    openGroup,
    closeGroup,
    scheduleOpen,
    scheduleClose,
    cancelClose,
    pageMoved,
    trackVelocity,
  } = useNavIntent({ openDelay: 150, closeDelay: 130 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // A moving page closes an open panel. A hover that is still waiting to
      // open is NOT dropped: smooth scrolling keeps emitting scroll events for
      // about a second after the last wheel tick, and cancelling the intent
      // there left a pointer resting on a link with no menu until it re-entered.
      pageMoved();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pageMoved]);

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

  const isGroupActive = useCallback((g) => pathname === g.to || pathname.startsWith(`${g.to}/`), [pathname]);
  const routeGroup = navGroups.find(isGroupActive);
  const inkId = hoverId || routeGroup?.id || null;

  // Measure the link the ink should sit under.
  const measureInk = useCallback(() => {
    const el = inkId ? groupRefs.current[inkId] : null;
    if (!el) {
      setInk((prev) => (prev.on ? { ...prev, on: false } : prev));
      return;
    }
    setInk((prev) => ({ x: el.offsetLeft + 14, w: Math.max(0, el.offsetWidth - 28), on: true, placed: prev.placed || prev.on }));
  }, [inkId]);

  useLayoutEffect(() => {
    measureInk();
  }, [measureInk]);

  useEffect(() => {
    const host = groupsRef.current;
    if (!host || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measureInk());
    ro.observe(host);
    document.fonts?.ready?.then(measureInk);
    return () => ro.disconnect();
  }, [measureInk]);

  const open = navGroups.find((g) => g.id === activeGroup) || null;
  const openMulti = open && open.children.length > 1 ? open : null;

  // Dismissal layer (only armed when a panel is showing).
  const handleDismiss = useCallback(() => closeGroup({ immediate: true }), [closeGroup]);
  useDismissableLayer(!!openMulti, handleDismiss, [headerRef, menuRef]);

  const onGroupEnter = (g, e) => {
    setHoverId(g.id);
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
      data-revealed={revealed ? 'true' : 'false'}
      data-scrolled={scrolled ? 'true' : 'false'}
      className={clsx(styles.nav, scrolled && styles.scrolled, openMulti && styles.menuActive)}
      onMouseMove={trackVelocity}
      onMouseLeave={() => scheduleClose()}
    >
      <span className={styles.plate} aria-hidden="true" />
      <span className={styles.hairline} aria-hidden="true" />

      <div className={styles.inner}>
        <Link to="/" className={clsx(styles.brand, styles.part)} aria-label="Hanoryx Systems — home" data-cursor="link" {...fx('nav.brand-sheen')}>
          <span className={styles.mark}>
            <img src={brandLogo} alt="" />
            <span className={styles.sheen} aria-hidden="true" />
          </span>
          <span className={styles.wordmark}>Hanoryx Systems</span>
        </Link>

        <nav
          ref={groupsRef}
          className={clsx(styles.groups, styles.part)}
          aria-label="Primary"
          onMouseLeave={() => setHoverId(null)}
          {...fx('nav.hover-intent')}
        >
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
                onFocus={() => {
                  setHoverId(g.id);
                  if (multi) openGroup(g.id);
                  else closeGroup({ immediate: true });
                }}
                onBlur={() => setHoverId(null)}
                onKeyDown={(e) => onGroupKeyDown(g, e)}
                onClick={() => closeGroup({ immediate: true })}
                aria-haspopup={multi || undefined}
                aria-expanded={multi ? activeGroup === g.id : undefined}
              >
                <span className={styles.groupLabel}>{g.label}</span>
                <span className={styles.groupCode}>{g.code}</span>
              </NavLink>
            );
          })}
          <motion.span
            className={styles.ink}
            aria-hidden="true"
            {...fx('nav.group-ink')}
            initial={false}
            animate={{ x: ink.x, width: ink.w, opacity: ink.on ? 1 : 0 }}
            transition={ink.placed ? INK_SPRING : { duration: 0 }}
          />
        </nav>

        <div className={clsx(styles.right, styles.part)}>
          <button type="button" className={styles.search} onClick={() => window.dispatchEvent(new Event('hanoryx:search'))} aria-label="Search site" {...fx('nav.search-chip')}><Search size={17} /><span>⌘ K</span></button>
          <span className={styles.status} aria-hidden="true" {...fx('nav.live-status')}>
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
