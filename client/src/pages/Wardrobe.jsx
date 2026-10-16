import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PiArrowLeftLight, PiArrowRightLight } from 'react-icons/pi';
import { DriftingPetals, Monogram, Sparkles } from '../components/Ornaments';
import { OutfitStage, Swatches } from '../components/Events';
import { WARDROBE, WARDROBE_ORDER, outfitSrc } from '../data/content';
import { themeFor } from '../data/themes';
import { getEvents, getSettings } from '../lib/api';
import { formatDay } from '../lib/format';
import { scrollToY } from '../lib/scroll';

const EASE = [0.22, 1, 0.36, 1];

export default function Wardrobe() {
  const { slug } = useParams();
  const guide = WARDROBE[slug];
  const theme = themeFor(slug);
  const dark = theme.tone === 'dark';
  const [event, setEvent] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    scrollToY(0);
    getEvents()
      .then((list) => setEvent(list.find((e) => e.wardrobe === slug) || null))
      .catch(() => setEvent(null));
  }, [slug]);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (guide) document.title = `${guide.title} Wardrobe${settings?.coupleNames ? ` · ${settings.coupleNames}` : ''}`;
  }, [guide, settings]);

  if (!guide) return <Navigate to="/" replace />;

  const others = WARDROBE_ORDER.filter((s) => s !== slug);
  const next = WARDROBE_ORDER[(WARDROBE_ORDER.indexOf(slug) + 1) % WARDROBE_ORDER.length];
  // Keep "2:00 pm" on one line when the eyebrow wraps on phones.
  const time = event?.time?.replace(/(\d) (am|pm)/gi, '$1 $2');
  const when = event ? [formatDay(event.date), time, event.theme].filter(Boolean).join(' · ') : 'Wardrobe planner';

  return (
    <div className={`min-h-screen ${dark ? 'bg-midnight-950 text-ivory-100' : 'bg-ivory-100 text-ink-700'}`}>
      <header className={`relative isolate overflow-hidden ${theme.hero}`}>
        {theme.decor === 'petals' && <DriftingPetals count={18} />}
        {theme.decor === 'sparkles' && <Sparkles count={26} />}
        {theme.decor === 'jaali' && <div aria-hidden="true" className="absolute inset-0 -z-10 bg-jaali opacity-50" />}

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/#events" className="eyebrow inline-flex items-center gap-2 text-[0.62rem] opacity-80 transition hover:opacity-100">
            <PiArrowLeftLight className="text-base" /> Invitation
          </Link>
          <Link to="/" className="text-[1.6rem]" aria-label="Home">
            <Monogram names={settings?.coupleNames || 'S & A'} heartClassName={dark ? 'text-magenta-400' : 'text-gold-500'} />
          </Link>
          <Link
            to="/#rsvp"
            className={`rounded-full px-5 py-2.5 text-[0.62rem] font-medium uppercase tracking-[0.24em] transition ${theme.button}`}
          >
            RSVP
          </Link>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mx-auto max-w-4xl px-6 pb-20 pt-14 text-center sm:pb-28 sm:pt-20"
        >
          <p className="eyebrow text-balance">{when}</p>
          <h1 className="mt-5 font-display text-[clamp(3.6rem,11vw,8rem)] font-light leading-[0.95]">{guide.title}</h1>
          <p className="mx-auto mt-6 max-w-xl font-display text-2xl italic leading-snug opacity-85 sm:text-[1.7rem]">
            {guide.intro}
          </p>
          <div className="mt-9 flex justify-center">
            <Swatches guide={guide} dark={dark} size="h-8 w-8" />
          </div>
        </motion.div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 lg:grid-cols-3">
          {guide.outfits.map((outfit, i) => (
            <motion.figure
              key={outfit.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: EASE, delay: (i % 3) * 0.1 }}
              className="group"
            >
              <div className={`relative aspect-[3/4] overflow-hidden rounded-t-full ${theme.stage}`}>
                <div aria-hidden="true" className="absolute inset-x-[22%] bottom-2 h-5 rounded-[50%] bg-black/25 blur-md" />
                <img
                  src={outfitSrc(slug, outfit.id)}
                  alt={`${outfit.name}: ${outfit.note}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto object-contain transition duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]"
                />
                <div aria-hidden="true" className="absolute inset-2.5 rounded-t-full border border-white/40" />
              </div>
              <figcaption className="mt-5 flex gap-3 sm:gap-4">
                <span className={`font-display text-2xl italic leading-tight ${theme.accent}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className={`block font-display text-[1.45rem] leading-tight sm:text-2xl ${dark ? 'text-ivory-50' : 'text-ink-900'}`}>
                    {outfit.name}
                  </span>
                  <span className={`mt-1 block text-[0.95rem] leading-6 ${dark ? 'text-ivory-200/70' : 'text-ink-500'}`}>
                    {outfit.note}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className={`mt-24 rounded-[2rem] border px-6 py-12 text-center sm:px-12 ${theme.panel}`}
        >
          <p className={`eyebrow ${theme.accent}`}>Color note</p>
          <p className={`mx-auto mt-5 max-w-2xl font-display text-3xl italic leading-snug sm:text-4xl ${dark ? 'text-ivory-50' : 'text-ink-900'}`}>
            {guide.colorNote}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/#rsvp"
              className={`rounded-full px-7 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.24em] transition ${theme.button}`}
            >
              RSVP now
            </Link>
            <Link
              to={`/wardrobe/${next}`}
              className={`inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.24em] transition ${
                dark ? 'border-white/20 text-ivory-50 hover:bg-white/10' : 'border-ink-900/20 text-ink-900 hover:bg-black/5'
              }`}
            >
              Next: {WARDROBE[next].title} <PiArrowRightLight />
            </Link>
          </div>
        </motion.section>

        <section className="mt-24">
          <p className={`eyebrow text-center ${dark ? 'text-ivory-200/60' : 'text-ink-500'}`}>Plan the other celebrations</p>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            {others.map((other) => {
              const otherTheme = themeFor(other);
              return (
                <Link
                  key={other}
                  to={`/wardrobe/${other}`}
                  className={`group block overflow-hidden rounded-[1.75rem] border p-4 transition hover:-translate-y-1 ${otherTheme.card}`}
                >
                  <OutfitStage slug={other} guide={WARDROBE[other]} theme={otherTheme} className="h-56" />
                  <div className="flex items-center justify-between px-2 pb-1 pt-4">
                    <span className={`font-display text-3xl font-light ${otherTheme.title}`}>{WARDROBE[other].title}</span>
                    <PiArrowRightLight className={`text-xl transition group-hover:translate-x-1 ${otherTheme.accent}`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <footer className={`border-t py-10 text-center ${dark ? 'border-white/10' : 'border-gold-300/50'}`}>
        <p className="text-3xl">
          <Monogram names={settings?.coupleNames || 'S & A'} heartClassName={dark ? 'text-magenta-400' : 'text-gold-500'} />
        </p>
        <p className={`eyebrow mt-3 text-[0.6rem] ${dark ? 'text-ivory-200/50' : 'text-ink-400'}`}>{settings?.coupleNames}</p>
      </footer>
    </div>
  );
}
