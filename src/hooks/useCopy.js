import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from '../utils/clipboard';

/**
 * Copy-to-clipboard with a short "copied" state for the button label.
 *
 *   const [copied, copy] = useCopy();
 *   <button onClick={() => copy(text)}>{copied ? 'Copied' : 'Copy'}</button>
 *
 * `copied` holds the last thing copied for ~1.8 s (or false), so one hook can
 * serve a list of buttons: compare `copied === value`.
 */
export function useCopy(duration = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text) => {
      const ok = await copyText(text);
      if (!ok) return false;
      setCopied(text);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), duration);
      return true;
    },
    [duration]
  );

  return [copied, copy];
}

export default useCopy;
