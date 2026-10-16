import { dayKey } from './format';

// Every celebration happens in Daman, so the free-text times ("1:00 to 4:00 pm") are IST.
const IST_OFFSET_MINUTES = 330;
const TIME_PATTERN = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi;

// "1:00 to 4:00 pm" -> [{ h: 13, m: 0 }, { h: 16, m: 0 }]; a time without am/pm borrows the next one's.
export function parseTimes(text = '') {
  const found = [...text.matchAll(TIME_PATTERN)]
    .filter((m) => m[2] || m[3])
    .slice(0, 2)
    .map((m) => ({ hour: Number(m[1]), minute: Number(m[2] || 0), meridiem: m[3]?.toLowerCase() }));

  let next;
  for (let i = found.length - 1; i >= 0; i--) {
    found[i].inherited = !found[i].meridiem;
    found[i].meridiem = found[i].meridiem || next;
    next = found[i].meridiem;
  }

  const times = found.map(({ hour, minute, meridiem }) => ({
    h: meridiem ? (hour % 12) + (meridiem === 'pm' ? 12 : 0) : hour,
    m: minute,
  }));

  // "11:00 to 2:00 pm" means 11 am, not 11 pm.
  if (times.length === 2 && found[0].inherited && times[0].h > times[1].h) times[0].h -= 12;
  return times;
}

function icsUtc(day, { h, m }) {
  const [y, mo, d] = day.split('-').map(Number);
  const ms = Date.UTC(y, mo - 1, d, h, m) - IST_OFFSET_MINUTES * 60_000;
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

const escapeText = (s = '') =>
  String(s).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1');

// RFC 5545 asks for lines of at most 75 octets.
function fold(line) {
  const parts = [];
  for (let i = 0; i < line.length; i += 60) parts.push(line.slice(i, i + 60));
  return parts.join('\r\n ');
}

export function buildIcs(events, settings) {
  const couple = settings?.coupleNames || 'Our wedding';
  const location = [settings?.venueName, settings?.venueAddress].filter(Boolean).join(', ');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${couple}//Wedding//EN`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];

  for (const event of events) {
    const day = dayKey(event.date);
    const times = parseTimes(event.time);
    lines.push('BEGIN:VEVENT', `UID:${event._id}@wedding-invitation`, `DTSTAMP:${stamp}`);
    if (times.length) {
      lines.push(`DTSTART:${icsUtc(day, times[0])}`);
      if (times[1]) lines.push(`DTEND:${icsUtc(day, times[1])}`);
    } else {
      const next = new Date(new Date(day).getTime() + 86_400_000).toISOString().slice(0, 10);
      lines.push(`DTSTART;VALUE=DATE:${day.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${next.replace(/-/g, '')}`);
    }
    const description = [event.description, event.time, event.dressCode && `Wardrobe: ${event.dressCode}`]
      .filter(Boolean)
      .join('\n\n');
    lines.push(
      `SUMMARY:${escapeText(`${event.title} · ${couple}`)}`,
      `LOCATION:${escapeText(event.location && event.location !== settings?.venueName ? event.location : location)}`,
      `DESCRIPTION:${escapeText(description)}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n');
}

export function downloadIcs(events, settings) {
  const blob = new Blob([buildIcs(events, settings)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(settings?.coupleNames || 'wedding').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
