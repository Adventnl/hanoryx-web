import { useCallback, useEffect, useState } from 'react';
import { ShortcutsOverlay } from './ShortcutsOverlay';
import { BlueprintLayer } from './BlueprintLayer';

function isEditable(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

/**
 * Site-wide single-key shortcuts that belong to no one page:
 *   ?  opens the shortcuts panel
 *   B  switches blueprint mode (outlines and names the marked parts of a page)
 * Search (Ctrl/⌘ K and /) lives with the search itself. Nothing fires while you
 * are typing, while a modifier is held, or before the intro has finished — and
 * the single-key ones can be switched off in the display preferences (WCAG 2.1.4).
 */
export function GlobalKeys({ enabled }) {
  const [help, setHelp] = useState(false);
  const [blueprint, setBlueprint] = useState(false);
  const closeHelp = useCallback(() => setHelp(false), []);

  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      if (document.documentElement.dataset.keys === 'off') return; // turned off in the display preferences
      if (isEditable(document.activeElement) || isEditable(event.target)) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return; // something else owns the keyboard
      if (event.key === '?') {
        event.preventDefault();
        setHelp(true);
      } else if (event.key === 'b' || event.key === 'B') {
        event.preventDefault();
        setBlueprint((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);

  return (
    <>
      <ShortcutsOverlay open={help} onClose={closeHelp} />
      <BlueprintLayer active={blueprint} />
    </>
  );
}

export default GlobalKeys;
