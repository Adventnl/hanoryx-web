/* Time zone arithmetic with nothing but Intl: what a wall clock reads at an
   instant, where a zone's clocks change in a year, and what a given wall-clock
   time does on those days (never happens, happens once, happens twice). */

const cache = new Map();

function formatter(zone) {
  if (!cache.has(zone)) {
    cache.set(zone, new Intl.DateTimeFormat('en-GB', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }
  return cache.get(zone);
}

/** The wall-clock reading of an instant in a zone, as milliseconds-since-epoch of the same digits in UTC. */
export function wallOf(ms, zone) {
  const p = {};
  formatter(zone).formatToParts(ms).forEach((part) => { p[part.type] = part.value; });
  return Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour) % 24, Number(p.minute), Number(p.second));
}

/** The zone's offset from UTC at an instant, in minutes. */
export const offsetAt = (ms, zone) => Math.round((wallOf(ms, zone) - Math.floor(ms / 1000) * 1000) / 60000);

export function offsetLabel(minutes) {
  const sign = minutes < 0 ? '−' : '+';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}

/** How many distinct instants show this wall-clock time in the zone: 0, 1 or 2. */
export function instantsFor(wall, zone) {
  const found = new Set();
  for (let off = -14 * 60; off <= 14 * 60; off += 15) {
    const candidate = wall - off * 60000;
    if (wallOf(candidate, zone) === wall) found.add(candidate);
  }
  return found.size;
}

/** Every clock change a zone makes in a year, found by watching the offset day by day.
 *  Each result: { at, before, after, y, m, d } where y/m/d is the local date of the change. */
export function changesIn(zone, year) {
  const out = [];
  let prev = offsetAt(Date.UTC(year, 0, 1, 12), zone);
  for (let day = 1; day <= 366; day += 1) {
    const t = Date.UTC(year, 0, 1 + day, 12);
    if (new Date(t).getUTCFullYear() !== year) break;
    const now = offsetAt(t, zone);
    if (now !== prev) {
      let lo = t - 86400000;
      let hi = t;
      while (hi - lo > 60000) {
        const mid = Math.floor((lo + hi) / 2);
        if (offsetAt(mid, zone) === prev) lo = mid; else hi = mid;
      }
      const wall = new Date(wallOf(hi, zone));
      out.push({ at: hi, before: prev, after: now, y: wall.getUTCFullYear(), m: wall.getUTCMonth(), d: wall.getUTCDate() });
      prev = now;
    }
  }
  return out;
}

/** What `HH:MM` does on the local day of a clock change: 0 = it never happens, 1 = once, 2 = twice. */
export const effectOn = (change, hh, mm, zone) => instantsFor(Date.UTC(change.y, change.m, change.d, hh, mm), zone);
