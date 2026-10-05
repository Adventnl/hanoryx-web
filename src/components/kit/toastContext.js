import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/**
 * `const toast = useToast();  toast({ title: 'Saved', body: 'Draft kept.', tone: 'success' })`
 * Returns a no-op outside a ToastProvider, so a component that toasts never
 * has to know whether one is mounted.
 */
export function useToast() {
  return useContext(ToastContext) || (() => {});
}
