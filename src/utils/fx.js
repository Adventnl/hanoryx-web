/* Marks a foreground detail so it can be inventoried and (in blueprint mode)
   labelled. `fx('home.orbit')` spreads `data-fx="home.orbit"` onto an element.
   It has no runtime cost beyond the attribute. qa/foreground-inventory.mjs
   loads every route and counts the distinct markers that actually render. */
export const fx = (id) => ({ 'data-fx': id });
