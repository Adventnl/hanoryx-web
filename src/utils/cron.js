/* A small reader for standard five-field cron expressions: minute, hour,
   day of month, month, day of week. It parses, describes and lists the next
   run times. It runs nothing. */

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FIELDS = [
  { key: 'minute', label: 'minute', min: 0, max: 59 },
  { key: 'hour', label: 'hour', min: 0, max: 23 },
  { key: 'dom', label: 'day-of-month', min: 1, max: 31 },
  { key: 'month', label: 'month', min: 1, max: 12, names: MONTHS, base: 1 },
  { key: 'dow', label: 'day-of-week', min: 0, max: 7, names: DAYS, base: 0 },
];

const MACROS = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

const pad = (n) => String(n).padStart(2, '0');
const last = (f) => (f.key === 'dow' ? 6 : f.max);

function readValue(token, f) {
  const up = token.toUpperCase();
  if (f.names && up.length === 3 && f.names.includes(up)) return f.names.indexOf(up) + f.base;
  if (/^\d+$/.test(token)) return Number(token);
  throw new Error(`“${token}” is not a valid value for the ${f.label} field`);
}

function parseField(text, f) {
  const set = new Set();
  for (const part of text.split(',')) {
    if (!part) throw new Error(`The ${f.label} field has an empty item`);
    const [range, stepText, extra] = part.split('/');
    if (extra !== undefined) throw new Error(`“${part}” has more than one slash`);
    let step = 1;
    if (stepText !== undefined) {
      step = Number(stepText);
      if (!Number.isInteger(step) || step < 1) throw new Error(`“${stepText}” is not a valid step in the ${f.label} field`);
    }
    let lo;
    let hi;
    if (range === '*') { lo = f.min; hi = last(f); }
    else if (range.includes('-')) {
      const [a, b] = range.split('-');
      lo = readValue(a, f);
      hi = readValue(b, f);
    } else {
      lo = readValue(range, f);
      hi = stepText !== undefined ? last(f) : lo;
    }
    if (lo < f.min || hi > f.max || lo > hi) throw new Error(`“${part}” is outside the ${f.label} field’s range (${f.min} to ${f.max})`);
    for (let v = lo; v <= hi; v += step) set.add(f.key === 'dow' && v === 7 ? 0 : v);
  }
  return set;
}

/** Parse an expression. Returns { ok: true, text, fields, sets, star } or { ok: false, error }. */
export function parseCron(input) {
  const raw = String(input).trim().replace(/\s+/g, ' ');
  if (!raw) return { ok: false, error: 'Type a schedule, for example 30 9 * * 1-5.' };
  const text = MACROS[raw.toLowerCase()] || raw;
  const fields = text.split(' ');
  if (fields.length === 6) return { ok: false, error: 'That has six fields. A seconds field is not part of standard cron; this explainer reads the usual five.' };
  if (fields.length !== 5) return { ok: false, error: `A cron schedule has five fields (minute, hour, day of month, month, day of week). You wrote ${fields.length}.` };
  try {
    const sets = {};
    FIELDS.forEach((f, i) => { sets[f.key] = parseField(fields[i], f); });
    return { ok: true, text, fields, sets, star: { dom: fields[2].startsWith('*'), dow: fields[4].startsWith('*') } };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

const sorted = (set) => [...set].sort((a, b) => a - b);
const joinWords = (arr) => (arr.length <= 1 ? arr.join('') : `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`);
const ordinal = (n) => { const s = ['th', 'st', 'nd', 'rd']; const v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

/** The values a field expands to, written for a person. */
export function expand(p, i) {
  const f = FIELDS[i];
  const vals = sorted(p.sets[f.key]);
  const fmt = (v) => (f.key === 'month' ? monthNames[v - 1] : f.key === 'dow' ? dayNames[v] : String(v));
  if (vals.length > 12) return `${vals.slice(0, 4).map(fmt).join(', ')} … ${fmt(vals[vals.length - 1])} (${vals.length} values)`;
  return vals.map(fmt).join(', ');
}

export const fieldLabels = FIELDS.map((f) => f.label);

/** One sentence that says when it runs. */
export function describe(p) {
  const m = sorted(p.sets.minute);
  const h = sorted(p.sets.hour);
  const stepOf = p.fields[0].match(/^\*\/(\d+)$/);
  let when;
  if (m.length === 60 && h.length === 24) when = 'every minute';
  else if (stepOf && h.length === 24) when = `every ${stepOf[1]} minutes`;
  else if (m.length === 1 && h.length === 24) when = m[0] === 0 ? 'every hour, on the hour' : `at minute ${m[0]} of every hour`;
  else if (m.length === 1) when = `at ${joinWords(h.map((x) => `${pad(x)}:${pad(m[0])}`))}`;
  else if (h.length === 24) when = `at minutes ${joinWords(m.map(String))} of every hour`;
  else when = `at minutes ${joinWords(m.map(String))} past hours ${joinWords(h.map(String))}`;

  const dom = sorted(p.sets.dom);
  const dow = sorted(p.sets.dow);
  const dowText = dow.length === 5 && dow[0] === 1 && dow[4] === 5 ? 'Monday to Friday' : dow.length === 2 && dow[0] === 0 && dow[1] === 6 ? 'Saturday and Sunday' : joinWords(dow.map((d) => dayNames[d]));
  const domText = `the ${joinWords(dom.map(ordinal))} of the month`;
  const domAny = p.fields[2] === '*';
  const dowAny = p.fields[4] === '*';
  let day;
  if (domAny && dowAny) day = 'every day';
  else if (domAny) day = `on ${dowText}`;
  else if (dowAny) day = `on ${domText}`;
  else if (p.star.dom || p.star.dow) day = `on ${domText}, when it falls on ${dowText}`;
  else day = `on ${domText}, or on ${dowText}`;

  const months = sorted(p.sets.month);
  const monthText = months.length === 12 ? '' : ` in ${joinWords(months.map((x) => monthNames[x - 1]))}`;
  const tail = day === 'every day' && when.startsWith('every') ? '' : ` ${day}`;
  return `Runs ${when}${tail}${monthText}.`;
}

/** Things worth knowing about this particular schedule. */
export function warnings(p) {
  const out = [];
  const m = sorted(p.sets.minute);
  const h = sorted(p.sets.hour);
  const perDay = m.length * h.length;
  if (m.length === 1 && m[0] === 0 && h.length < 24) out.push('It starts exactly on the hour. When many jobs share that minute they all start together; an off minute such as 07 or 43 spreads the load.');
  if (!p.star.dom && !p.star.dow) out.push('Both day-of-month and day-of-week are set. Standard cron runs when either matches, not only when both do.');
  const dom = sorted(p.sets.dom);
  if (!p.star.dom && dom[dom.length - 1] >= 29) out.push(`Not every month has a day ${dom[dom.length - 1]}, so the job will skip those months.`);
  if (perDay >= 288) out.push(`It runs about ${perDay} times a day. Make sure a run that takes longer than the gap cannot overlap the next one.`);
  if (h.some((x) => x >= 1 && x <= 3) && h.length < 24) out.push('It runs in the early hours, when daylight saving changes happen. In some time zones that time is skipped or repeated once a year.');
  return out;
}

/** The next `count` run times (as epoch milliseconds) after `fromMs`, in the local zone or in UTC. */
export function nextRuns(p, fromMs, count, utc) {
  const out = [];
  const minutes = sorted(p.sets.minute);
  const hours = sorted(p.sets.hour);
  const from = new Date(fromMs);
  const y0 = utc ? from.getUTCFullYear() : from.getFullYear();
  const m0 = utc ? from.getUTCMonth() : from.getMonth();
  const d0 = utc ? from.getUTCDate() : from.getDate();
  for (let i = 0; i < 366 * 8 && out.length < count; i += 1) {
    const day = utc ? new Date(Date.UTC(y0, m0, d0 + i)) : new Date(y0, m0, d0 + i);
    const Y = utc ? day.getUTCFullYear() : day.getFullYear();
    const M = (utc ? day.getUTCMonth() : day.getMonth()) + 1;
    const D = utc ? day.getUTCDate() : day.getDate();
    const W = utc ? day.getUTCDay() : day.getDay();
    if (!p.sets.month.has(M)) continue;
    const domOk = p.sets.dom.has(D);
    const dowOk = p.sets.dow.has(W);
    const dayOk = p.star.dom || p.star.dow ? domOk && dowOk : domOk || dowOk;
    if (!dayOk) continue;
    for (const h of hours) {
      for (const mi of minutes) {
        const t = utc ? Date.UTC(Y, M - 1, D, h, mi) : new Date(Y, M - 1, D, h, mi).getTime();
        if (t > fromMs) {
          out.push(t);
          if (out.length >= count) return out;
        }
      }
    }
  }
  return out;
}
