/* 1 … 4 5 [6] 7 8 … 20 — the first, the last, the current and its neighbours. */
export function pageWindow(page, pages, siblings = 1) {
  const keep = new Set([1, pages, page]);
  for (let d = 1; d <= siblings; d += 1) { keep.add(page - d); keep.add(page + d); }
  const sorted = [...keep].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i && n - sorted[i - 1] > 1 ? [n - sorted[i - 1] === 2 ? n - 1 : '…', n] : [n]));
}
