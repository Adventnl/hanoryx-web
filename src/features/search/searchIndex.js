/* Built from the same page data as the site, and fetched only when search opens.
   A single hashed JSON asset avoids importing and parsing 86 route modules. */
import indexUrl from './searchDocuments.generated.json?url';

let cached = null;

export function getSearchDocuments() {
  if (!cached) {
    cached = fetch(indexUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Search index: HTTP ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        cached = null;
        throw error;
      });
  }
  return cached;
}
