import catalogUrl from './pageCatalog.generated.json?url';

let cached = null;

/** Lightweight title, intro and reading metadata, generated from page data. */
export function loadPageCatalog() {
  if (!cached) {
    cached = fetch(catalogUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Page catalog: HTTP ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        cached = null;
        throw error;
      });
  }
  return cached;
}
