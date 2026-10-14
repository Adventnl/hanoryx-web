import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { NodeMap } from './NodeMap';
import styles from './MegaPanel.module.css';
import { fx } from '../../utils/fx';

const EASE = [0.16, 1, 0.3, 1];
const INTENT_MS = 70; // a rail row must be rested on this long before it takes over

const sheetV = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE } },
};

/**
 * The wide menu: a full-width sheet that drops from the bar. On the left, the
 * group's categories as a rail (or, for a group with one category, its short
 * introduction); on the right, the open category's pages as a grid of cards —
 * a code, a name and a line saying what is there — so a group of fifty pages is
 * a few clicks across the screen rather than a column down it. A small orbit
 * diagram answers the card being pointed at.
 *
 * The rail is a vertical tab list (↑ ↓ Home End move and select), the cards are
 * ordinary links, Escape and every other dismissal live in the navbar's
 * useDismissableLayer. The category chosen is remembered with its group, so
 * moving to another group never inherits a stale one.
 */
const Sheet = forwardRef(function Sheet({ group, onMouseEnter, onMouseLeave, onNavigate }, ref) {
  const { pathname } = useLocation();
  const uid = useId();
  const intent = useRef(0);
  const tabRefs = useRef({});
  const [pick, setPick] = useState({ group: null, cat: null });
  const [hot, setHot] = useState({ cat: null, i: 0 });

  useEffect(() => {
    const timers = intent;
    return () => window.clearTimeout(timers.current);
  }, []);

  const cats = group.categories;
  // Open on the category the visitor is already in, else the first.
  const here = cats.find((c) => c.items.some((it) => it.to === pathname));
  const wanted = pick.group === group.id ? pick.cat : null;
  const cat = cats.find((c) => c.id === wanted) || here || cats[0];
  const hasRail = cats.length > 1;
  const hotIndex = hot.cat === cat.id ? hot.i : 0;

  const choose = useCallback((id) => { window.clearTimeout(intent.current); setPick({ group: group.id, cat: id }); }, [group]);
  const lean = useCallback((id) => { window.clearTimeout(intent.current); intent.current = window.setTimeout(() => choose(id), INTENT_MS); }, [choose]);
  const stay = useCallback(() => window.clearTimeout(intent.current), []);

  const onTabKeyDown = (event, index) => {
    const last = cats.length - 1;
    const to = event.key === 'ArrowDown' ? (index + 1) % cats.length : event.key === 'ArrowUp' ? (index + last) % cats.length : event.key === 'Home' ? 0 : event.key === 'End' ? last : null;
    if (to === null) return;
    event.preventDefault();
    choose(cats[to].id);
    tabRefs.current[cats[to].id]?.focus();
  };

  const tabId = (id) => `${uid}-tab-${id}`;
  const panelId = `${uid}-panel`;

  return (
    <motion.div
      ref={ref}
      id="mega-panel"
      className={styles.wrap}
      variants={sheetV}
      initial="hidden"
      animate="show"
      exit="exit"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.sheet} {...fx('menu.wide-sheet')}>
        <span className={styles.railBg} aria-hidden="true" />
        <div className={clsx(styles.inner, !hasRail && styles.solo)} key={group.id}>
          <span className={clsx(styles.corner, styles.tl)} aria-hidden="true" />
          <span className={clsx(styles.corner, styles.br)} aria-hidden="true" />

          <div className={styles.side} data-lenis-prevent>
            {hasRail ? (
              <>
                <Link to={group.lead.to} className={styles.lead} data-cursor="nav" onClick={onNavigate}>
                  <span className={styles.leadCode}>{group.lead.code}</span>
                  <span className={styles.leadLabel}>{group.lead.label}</span>
                  <ArrowRight className={styles.leadArrow} size={14} strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <div role="tablist" aria-orientation="vertical" aria-label={`${group.label} sections`} className={styles.rail} {...fx('menu.category-rail')}>
                  {cats.map((c, i) => {
                    const on = c.id === cat.id;
                    return (
                      <button
                        key={c.id}
                        ref={(el) => { tabRefs.current[c.id] = el; }}
                        id={tabId(c.id)}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-controls={panelId}
                        tabIndex={on ? 0 : -1}
                        className={styles.tab}
                        onMouseEnter={() => lean(c.id)}
                        onMouseLeave={stay}
                        onFocus={() => choose(c.id)}
                        onClick={() => choose(c.id)}
                        onKeyDown={(e) => onTabKeyDown(e, i)}
                        data-cursor="nav"
                      >
                        <span className={styles.tabCode}>{c.code}</span>
                        <span className={styles.tabLabel}>{c.label}</span>
                        <span className={styles.tabCount}>{c.items.length}</span>
                        <ArrowRight className={styles.tabArrow} size={13} strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className={styles.intro}>
                <h2 className={styles.introTitle}>{group.label}</h2>
                <p className={styles.introBlurb}>{group.blurb}</p>
                <Link to={group.lead.to} className={styles.lead} data-cursor="nav" onClick={onNavigate}>
                  <span className={styles.leadCode}>{group.lead.code}</span>
                  <span className={styles.leadLabel}>{group.lead.label}</span>
                  <ArrowRight className={styles.leadArrow} size={14} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          <div
            key={cat.id}
            id={panelId}
            role={hasRail ? 'tabpanel' : 'group'}
            aria-labelledby={hasRail ? tabId(cat.id) : undefined}
            aria-label={hasRail ? undefined : cat.label}
            className={styles.stage}
            data-lenis-prevent
          >
            <header className={styles.head}>
              <span className={clsx('mono', styles.headCode)}>{group.code} // NODE MAP</span>
              <h2 className={styles.headTitle}>{cat.label}</h2>
              <p className={styles.headBlurb}>{cat.blurb}</p>
            </header>
            <ul className={styles.grid} {...fx('menu.page-grid')}>
              {cat.items.map((item, i) => {
                const current = item.to === pathname;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      data-cursor="nav"
                      className={clsx(styles.card, current && styles.current, i === hotIndex && styles.hot)}
                      style={{ '--i': i }}
                      aria-current={current ? 'page' : undefined}
                      onMouseEnter={() => setHot({ cat: cat.id, i })}
                      onFocus={() => setHot({ cat: cat.id, i })}
                      onClick={onNavigate}
                    >
                      <span className={styles.cardTop}>
                        <span className={styles.cardCode}>{item.code}</span>
                        {current && <span className={styles.live} aria-hidden="true" />}
                        <ArrowUpRight className={styles.cardArrow} size={15} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className={styles.cardTitle}>{item.label}</span>
                      <span className={styles.cardDesc}>{item.desc}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.aside}>
            <NodeMap key={`${group.id}:${cat.id}`} count={cat.items.length} hot={hotIndex} code={group.code} />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/** The presence wrapper: the sheet stays mounted while a group is open, so moving
 *  from one group to the next swaps its contents instead of replaying the drop. */
export const MegaPanel = forwardRef(function MegaPanel({ group, ...rest }, ref) {
  return <AnimatePresence>{group && <Sheet key="sheet" ref={ref} group={group} {...rest} />}</AnimatePresence>;
});

export default MegaPanel;
