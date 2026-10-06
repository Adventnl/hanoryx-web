/** A rough, honest estimate: length first, then variety, with the common
 *  patterns that make a long password weak taken off. It is a nudge, not a
 *  guarantee, and the password never leaves the page. */
export function strength(password) {
  if (password.length < 8) return password ? 0 : -1;
  let points = 0;
  if (password.length >= 12) points += 1;
  if (password.length >= 16) points += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) points += 1;
  if (/^(.)\1+$/.test(password) || /^(password|qwerty|letmein|123456|admin)/i.test(password)) points = 0;
  return Math.min(4, Math.max(1, points));
}
