/**
 * Ergonomic helper for declaring a cursor state on an element.
 *   const cursor = useCursorState();
 *   <a {...cursor('link')}>...</a>
 * Resolves to a `data-cursor` attribute the HanoryxCursor reads via event
 * delegation (no React state, no re-render on hover).
 */
export function useCursorState() {
  return (type) => (type ? { 'data-cursor': type } : {});
}

export default useCursorState;
