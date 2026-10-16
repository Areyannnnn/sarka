// Event days are stored as calendar dates at UTC midnight. Formatting them in UTC keeps a guest
// in California from seeing "16 January" for a celebration on the 17th.
export function formatDay(date, options = { day: 'numeric', month: 'long' }) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', { ...options, timeZone: 'UTC' });
}

export function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function uniqueDays(events) {
  return [...new Set(events.map((e) => dayKey(e.date)))].sort();
}

function joinList(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} & ${items.at(-1)}`;
}

// "17 & 18 January 2027" from the events, or the countdown date when there are none yet.
export function formatDayRange(events, fallbackDate) {
  const days = uniqueDays(events).map((d) => new Date(d));
  if (!days.length) {
    return fallbackDate ? formatDay(fallbackDate, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  }
  const first = days[0];
  const sameMonth = days.every(
    (d) => d.getUTCMonth() === first.getUTCMonth() && d.getUTCFullYear() === first.getUTCFullYear()
  );
  if (sameMonth) {
    return `${joinList(days.map((d) => d.getUTCDate()))} ${formatDay(first, { month: 'long', year: 'numeric' })}`;
  }
  return joinList(days.map((d) => formatDay(d, { day: 'numeric', month: 'long', year: 'numeric' })));
}

export function splitNames(coupleNames = '') {
  return coupleNames
    .split(/\s*(?:&|\band\b)\s*/i)
    .map((n) => n.trim())
    .filter(Boolean);
}

export function initials(coupleNames) {
  return splitNames(coupleNames).map((n) => n[0]?.toUpperCase() ?? '');
}

// "Kachigam, Daman, India" -> "Daman"
export function venueCity(address = '') {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  return parts.length > 1 ? parts.at(-2) : parts[0] || '';
}

export const firstName = (fullName = '') => fullName.trim().split(/\s+/)[0] || '';

const ORDINALS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
export const dayLabel = (index) => `Day ${ORDINALS[index] ?? index + 1}`;
