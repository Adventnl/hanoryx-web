import { useCallback, useState } from 'react';

/**
 * One value that is owned either by the caller (`value` + `onChange`) or by the
 * component itself (`defaultValue`). Every input in the kit uses it, so each one
 * can be dropped in controlled or uncontrolled without changing how it works.
 *
 *   const [value, setValue] = useControllable({ value, defaultValue: '', onChange });
 */
export function useControllable({ value, defaultValue, onChange }) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = useCallback(
    (next) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange]
  );
  return [controlled ? value : inner, set];
}

export default useControllable;
