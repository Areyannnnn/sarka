import { Suspense, lazy, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PiArrowUpRightLight, PiCalendarPlusLight, PiDownloadSimpleLight } from 'react-icons/pi';
import { VENUE_BLURB, mapsUrl } from '../data/content';
import { dayKey, formatDay, formatDayRange, uniqueDays } from '../lib/format';
import { Laurel, Mandala } from './Ornaments';
import { downloadIcs } from '../lib/calendar';

const EASE = [0.22, 1, 0.36, 1];

// Leaflet is the heaviest dependency on the page; load it only when the venue section renders.
const VenueMap = lazy(() => import('./VenueMap'));

export default function Venue({ settings, events }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const hasCoords = Boolean(settings?.lat && settings?.lng);
  const position = hasCoords ? [settings.lat, settings.lng] : [20.5937, 78.9629];
  const mapQuery = [settings?.venueName, settings?.venueAddress].filter(Boolean).join(', ');
  const dateLine = formatDayRange(events, settings?.weddingDate);

  return (
    <section id="venue" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] bg-forest-950 shadow-[0_50px_100px_-50px_rgba(19,58,43,0.8)] sm:rounded-[2.5rem]"
        >
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/8.5]">
            <motion.img
              src="/images/venue-lakeside.webp"
              alt="Illustrated view of the lakeside wedding venue at sunset"
              loading="lazy"
              decoding="async"
              style={{ y: imageY }}
              className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(12,39,28,0.88)_0%,rgba(12,39,28,0.55)_38%,transparent_70%)] md:block" />
          </div>

          <div className="relative px-7 py-10 text-ivory-50 sm:px-12 md:absolute md:inset-y-0 md:left-0 md:flex md:max-w-[34rem] md:flex-col md:justify-center md:py-12">
            <p className="font-script text-4xl text-gold-200">The venue</p>
            <h2 className="mt-2 font-display text-5xl font-light leading-[1.02] sm:text-6xl lg:text-7xl">
              {settings?.venueName || 'Venue to be announced'}
            </h2>
            {settings?.venueAddress && <p className="eyebrow mt-4 text-gold-200/90">{settings.venueAddress}</p>}
            <p className="mt-6 max-w-sm text-[1.05rem] leading-8 text-ivory-200/85">{VENUE_BLURB}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {mapQuery && (
                <a
                  href={mapsUrl(mapQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ivory-50 px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-forest-900 transition hover:bg-gold-100"
                >
                  Open in Maps <PiArrowUpRightLight className="text-base" />
                </a>
              )}
              {settings?.mapFileUrl && (
                <a
                  href={settings.mapFileUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-ivory-50/40 px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ivory-50 transition hover:bg-white/10"
                >
                  <PiDownloadSimpleLight className="text-base" /> Offline map
                </a>
              )}
              {dateLine && <span className="eyebrow ml-1 text-[0.62rem] text-ivory-200/70">{dateLine}</span>}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="isolate h-80 overflow-hidden rounded-[2rem] border border-gold-300/50 bg-lake-100 shadow-[0_30px_60px_-40px_rgba(19,58,43,0.6)] sm:h-96"
          >
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-lake-100" />}>
              <VenueMap position={position} zoom={hasCoords ? 14 : 5} label={hasCoords ? settings.venueName : ''} />
            </Suspense>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="relative isolate flex flex-col justify-center overflow-hidden rounded-[2rem] bg-ivory-50/70 px-8 py-12 text-center sm:px-12"
          >
            <Mandala className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 text-gold-300/20" />
            <p className="font-script text-4xl text-gold-600">The programme</p>
            <Laurel className="mx-auto mt-3 h-4 w-20 text-gold-400" />
            {uniqueDays(events).map((day) => (
              <div key={day} className="mt-8">
                <p className="font-display text-xl italic text-forest-700">
                  {formatDay(day, { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {events
                    .filter((e) => dayKey(e.date) === day)
                    .map((event) => (
                      <li key={event._id} className="flex flex-col items-center gap-0.5 sm:flex-row sm:items-baseline sm:gap-3 sm:text-left">
                        <span className="font-display text-[1.4rem] leading-tight text-ink-900">{event.title}</span>
                        <span aria-hidden="true" className="hidden min-w-6 flex-1 -translate-y-1 border-b border-dotted border-gold-400/80 sm:block" />
                        <span className="shrink-0 font-display text-lg italic text-ink-500">{event.time}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            {events.length > 0 && (
              <button
                onClick={() => downloadIcs(events, settings)}
                className="mx-auto mt-10 inline-flex items-center gap-2 font-display text-lg italic text-forest-800 underline decoration-gold-400/70 underline-offset-[6px] transition hover:text-forest-600"
              >
                <PiCalendarPlusLight className="text-xl not-italic" /> add every celebration to your calendar
              </button>
            )}
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
