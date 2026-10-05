import { useEffect, useRef } from 'react';

/**
 * Global dismiss controller for an open transient layer (mega-menu, popover).
 * While `active` is true it closes the layer on every gesture that should
 * dismiss it — without forcing the user to "move the mouse out of the way":
 *
 *   • pointerdown outside the safe-area refs   -> 'outside'
 *   • Escape                                   -> 'escape'
 *   • the page scrolling                       -> 'scroll'
 *   • window blur (tab/app switch)             -> 'blur'
 *   • focus moving outside the safe area       -> 'focus'
 *
 * Only a scroll that actually moves the page dismisses. Raw `wheel` and
 * `touchmove` do not: on a page that cannot move (already at the top, or short)
 * a trackpad's momentum keeps firing wheel events for a second or more after
 * the gesture, and they used to slam shut a menu the visitor had just opened.
 *
 * `refs` is an array of element refs that together form the safe area (e.g.
 * the nav header + the menu panel). Stored in a ref so callers can pass a
 * fresh array each render without re-binding listeners.
 */
export function useDismissableLayer(active, onDismiss, refs = []) {
  const cbRef = useRef(onDismiss);
  const refsRef = useRef(refs);

  // Keep latest callback/refs without re-binding global listeners each render.
  useEffect(() => {
    cbRef.current = onDismiss;
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!active) return undefined;

    const inside = (target) =>
      refsRef.current.some((r) => r && r.current && r.current.contains(target));

    const dismiss = (reason) => cbRef.current && cbRef.current(reason);

    const onPointerDown = (e) => {
      if (!inside(e.target)) dismiss('outside');
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') dismiss('escape');
    };
    const onScroll = () => dismiss('scroll');
    const onBlur = () => dismiss('blur');
    const onFocusIn = (e) => {
      if (!inside(e.target)) dismiss('focus');
    };

    // Capture phase: outside clicks close even before inner handlers run,
    // while clicks on inner links still navigate normally.
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('blur', onBlur);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [active]);
}

export default useDismissableLayer;
