import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PiArrowRightLight,
  PiCalendarPlusLight,
  PiClockLight,
  PiCoatHangerLight,
  PiMapPinLight,
} from 'react-icons/pi';
import CommentSection from './CommentSection';
import { DriftingPetals, SectionHeading, Sparkles, Toran } from './Ornaments';
import { WARDROBE, outfitSrc } from '../data/content';
import { themeFor } from '../data/themes';
import { dayKey, dayLabel, formatDay, uniqueDays } from '../lib/format';
import { downloadIcs } from '../lib/calendar';

const EASE = [0.22, 1, 0.36, 1];

export function Swatches({ guide, dark = false, size = 'h-6 w-6' }) {
  const ring = dark ? 'ring-midnight-900' : 'ring-white';
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex -space-x-1.5">
        {guide.swatches.map((s) => (
          <span
            key={s.hex}
            title={s.name}
            className={`${size} rounded-full shadow-sm ring-2 ${ring}`}
            style={{ background: s.hex }}
          />
        ))}
      </div>
      {guide.avoid?.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className={`text-[0.62rem] font-medium uppercase tracking-[0.18em] ${dark ? 'text-ivory-200/60' : 'text-ink-400'}`}>
            Not
          </span>
          {guide.avoid.map((s) => (
            <span
              key={s.hex}
              title={`Please avoid ${s.name.toLowerCase()}`}
              className={`relative ${size} overflow-hidden rounded-full opacity-90 ring-2 ${ring}`}
              style={{ background: s.hex }}
            >
              <span className="absolute left-1/2 top-1/2 h-[2px] w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-ink-900" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function OutfitStage({ slug, guide, theme, className = 'h-72' }) {
  return (
    <div className={`relative overflow-hidden rounded-t-full ${theme.window} ${className}`}>
      {theme.decor === 'petals' && <DriftingPetals />}
      {theme.decor === 'sparkles' && <Sparkles count={18} />}
      {theme.decor === 'jaali' && <div className="absolute inset-0 bg-jaali opacity-60" />}
      <div aria-hidden="true" className="absolute inset-x-10 bottom-1 h-6 rounded-[50%] bg-black/20 blur-md" />
      {guide && (
        <div className="absolute inset-x-0 bottom-0 flex h-[94%] items-end justify-center">
          {guide.featured.map((id, i) => (
            <img
              key={id}
              src={outfitSrc(slug, id)}
              alt=""
              loading="lazy"
              decoding="async"
              className={`h-full w-auto object-contain drop-shadow-[0_12px_14px_rgba(0,0,0,0.2)] transition-transform duration-700 ease-out group-hover:-translate-y-1.5 ${
                i === 0 ? '-mr-12 group-hover:-rotate-1' : '-ml-12 group-hover:rotate-1'
              }`}
            />
          ))}
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-2.5 rounded-t-full border border-white/50" />
    </div>
  );
}

function EventCard({ event, index, dayIndex }) {
  const theme = themeFor(event.wardrobe);
  const guide = WARDROBE[event.wardrobe];
  const dark = theme.tone === 'dark';

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.12 }}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[2rem] border transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] ${theme.card}`}
    >
      {/* a soft sheen that sweeps across the card on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 -translate-x-full bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.28)_50%,transparent_65%)] transition-transform duration-[1400ms] ease-out group-hover:translate-x-full"
      />
      <span
        aria-hidden="true"
        className={`absolute right-6 top-5 z-10 font-display text-6xl italic leading-none ${dark ? 'text-white/15' : 'text-black/10'}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="px-5 pt-5">
        {guide ? (
          <OutfitStage slug={event.wardrobe} guide={guide} theme={theme} />
        ) : (
          <div className={`relative h-72 overflow-hidden rounded-t-full ${theme.window}`}>
            {event.imageUrl ? (
              <img src={event.imageUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-jaali opacity-60" />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-7 pb-6 pt-6">
        <p className={`eyebrow text-[0.62rem] ${theme.accent}`}>
          {dayIndex >= 0 && `${dayLabel(dayIndex)} · `}
          {formatDay(event.date, { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
          <h3 className={`font-display text-[2.6rem] font-light leading-none ${theme.title}`}>{event.title}</h3>
          {event.theme && (
            <span className={`rounded-full px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] ${theme.chip}`}>
              {event.theme}
            </span>
          )}
        </div>
        {event.description && <p className={`mt-4 leading-7 ${theme.body}`}>{event.description}</p>}

        {(event.time || event.location) && (
          <ul className={`mt-5 space-y-2 border-y py-4 text-[0.95rem] ${theme.rule} ${theme.body}`}>
            {event.time && (
              <li className="flex items-center gap-3">
                <PiClockLight className={`shrink-0 text-xl ${theme.accent}`} />
                {event.time}
              </li>
            )}
            {event.location && (
              <li className="flex items-center gap-3">
                <PiMapPinLight className={`shrink-0 text-xl ${theme.accent}`} />
                {event.location}
              </li>
            )}
          </ul>
        )}

        {(guide || event.dressCode) && (
          <div className="mt-5">
            <p className={`eyebrow text-[0.58rem] ${theme.muted}`}>Wardrobe guide</p>
            {guide && (
              <div className="mt-3">
                <Swatches guide={guide} dark={dark} />
              </div>
            )}
            {event.dressCode && (
              <p className={`mt-3 font-display text-[1.35rem] italic leading-snug ${theme.title}`}>{event.dressCode}</p>
            )}
          </div>
        )}

        <div className="mt-auto pt-6">
          {guide && (
            <Link
              to={`/wardrobe/${event.wardrobe}`}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] transition ${theme.button}`}
            >
              <PiCoatHangerLight className="text-lg" />
              View wardrobe planner
              <PiArrowRightLight className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
          <CommentSection eventId={event._id} tone={theme.tone} />
        </div>
      </div>
    </motion.article>
  );
}

export default function Events({ events, settings }) {
  const days = uniqueDays(events);
  const sharedVenue = events.length > 0 && events.every((e) => e.location && e.location === events[0].location);
  const lede = sharedVenue
    ? `Every celebration takes place at ${events[0].location}. Come dressed for the mood and ready to dance.`
    : 'Come dressed for the mood and ready to dance.';

  return (
    <section
      id="events"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f4ecdd_0%,#f4ecdd_82%,#fbf7ef_100%)] pb-28 sm:pb-36"
    >
      <Toran />
      <SectionHeading
        className="pt-16 sm:pt-20"
        kicker="The celebration"
        title="What to wear, *where* to be"
        lede={lede}
      />

      {events.length > 0 && (
        <div className="mt-8 flex justify-center px-6">
          <button
            onClick={() => downloadIcs(events, settings)}
            className="inline-flex items-center gap-2 rounded-full border border-forest-800/25 bg-white/40 px-5 py-2.5 text-[0.66rem] font-medium uppercase tracking-[0.22em] text-forest-900 transition hover:border-forest-800 hover:bg-white/80"
          >
            <PiCalendarPlusLight className="text-lg" />
            Add the dates to your calendar
          </button>
        </div>
      )}

      <div className="mx-auto mt-16 flex max-w-7xl flex-wrap justify-center gap-8 px-5 sm:px-6">
        {events.map((event, i) => (
          <EventCard key={event._id} event={event} index={i} dayIndex={days.indexOf(dayKey(event.date))} />
        ))}
        {events.length === 0 && <p className="italic text-ink-500">Celebration details are coming soon.</p>}
      </div>
    </section>
  );
}
