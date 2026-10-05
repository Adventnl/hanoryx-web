import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hover-intent controller for the primary nav. Solves the two reported bugs:
 *   1. menus that open on an accidental pass-through  -> openDelay gate
 *   2. menus that stay stuck after a click/route change -> immediate close API
 *
 *   scheduleOpen(id) — opens after `openDelay`, but switches instantly if a
 *                      menu is already open (smooth item-to-item travel).
 *   scheduleClose()  — closes after `closeDelay` (covers the nav→panel gap so
 *                      the menu doesn't flicker while crossing the bridge).
 *   cancelClose()    — call when the pointer enters the panel safe area.
 *   openGroup(id)    — open now (keyboard focus).
 *   closeGroup({immediate}) — close now or after the close delay.
 *   pageMoved()      — the page just scrolled (or is still easing to a stop).
 *                      An open panel closes; a hover that is still waiting to
 *                      open is kept and held until the page has been still for
 *                      `settleDelay`.
 *
 * A pointer-velocity guard lengthens the open delay when the cursor is sweeping
 * fast across the bar, so quick traversals never pop a panel.
 *
 * Why pageMoved() exists: smooth scrolling keeps emitting scroll events for
 * about a second after the last wheel tick. They used to go through
 * closeGroup(), which also throws away a pending open — so a pointer that
 * arrived on a link during that tail never got its menu (no new "enter" ever
 * comes while it rests there) until it left and came back.
 */
export function useNavIntent({ openDelay = 140, closeDelay = 130, settleDelay = 170 } = {}) {
  const [activeGroup, setActiveGroup] = useState(null);
  const activeRef = useRef(null);
  const openTimer = useRef(0);
  const closeTimer = useRef(0);
  // The group whose open is waiting on `openTimer` (null when nothing is pending).
  const pendingRef = useRef(null);

  // pointer velocity sampling for hover-intent
  const last = useRef({ x: 0, y: 0, t: 0, v: 0 });

  useEffect(() => {
    activeRef.current = activeGroup;
  }, [activeGroup]);

  const clearOpen = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = 0;
    }
    pendingRef.current = null;
  };
  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = 0;
    }
  };

  // Start (or restart) the countdown that opens `id`.
  const armOpen = (id, delay) => {
    pendingRef.current = id;
    openTimer.current = setTimeout(() => {
      openTimer.current = 0;
      pendingRef.current = null;
      setActiveGroup(id);
    }, delay);
  };

  const trackVelocity = useCallback((e) => {
    const now = e.timeStamp || performance.now();
    const prev = last.current;
    const dt = now - prev.t;
    if (dt > 0 && dt < 200) {
      const dist = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
      // smoothed px/ms
      last.current.v = last.current.v * 0.6 + (dist / dt) * 0.4;
    }
    last.current.x = e.clientX;
    last.current.y = e.clientY;
    last.current.t = now;
  }, []);

  const openGroup = useCallback((id) => {
    clearOpen();
    clearClose();
    setActiveGroup(id);
  }, []);

  const closeGroup = useCallback(
    (opts = {}) => {
      clearOpen();
      if (opts.immediate) {
        clearClose();
        setActiveGroup(null);
        return;
      }
      clearClose();
      closeTimer.current = setTimeout(() => {
        closeTimer.current = 0;
        setActiveGroup(null);
      }, closeDelay);
    },
    [closeDelay]
  );

  const scheduleOpen = useCallback(
    (id) => {
      clearClose();
      // Already showing a panel — switch immediately, no re-gate.
      if (activeRef.current) {
        clearOpen();
        setActiveGroup(id);
        return;
      }
      clearOpen();
      // Fast sweep across the bar => require a longer dwell before opening.
      const fast = last.current.v > 1.1; // px/ms
      const delay = fast ? openDelay + 160 : openDelay;
      armOpen(id, delay);
    },
    [openDelay]
  );

  const pageMoved = useCallback(() => {
    // Nothing open: keep the hover that is waiting, and make it wait for stillness.
    if (!activeRef.current) {
      const id = pendingRef.current;
      if (id !== null) {
        clearOpen();
        armOpen(id, settleDelay);
      }
      return;
    }
    closeGroup({ immediate: true });
  }, [closeGroup, settleDelay]);

  const scheduleClose = useCallback(() => closeGroup(), [closeGroup]);
  const cancelClose = useCallback(() => clearClose(), []);

  useEffect(
    () => () => {
      clearOpen();
      clearClose();
    },
    []
  );

  return {
    activeGroup,
    openGroup,
    closeGroup,
    scheduleOpen,
    scheduleClose,
    cancelClose,
    pageMoved,
    trackVelocity,
  };
}

export default useNavIntent;
