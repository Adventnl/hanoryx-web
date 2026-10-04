/* Ref-counted scroll lock for overlays (search, shortcuts…) so two of them can
   be open at once without one unlocking the page under the other.
   `html.scroll-locked` is the reduced-motion / no-Lenis fallback; callers with
   a Lenis instance pass it so smooth scrolling is stopped too. */
let locks = 0;

export function lockScroll(lenis) {
  locks += 1;
  if (locks === 1) {
    document.documentElement.classList.add('scroll-locked');
    lenis?.stop?.();
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      document.documentElement.classList.remove('scroll-locked');
      lenis?.start?.();
    }
  };
}
