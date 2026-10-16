import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Countdown from './Countdown';
import { FloralArch, Mandala } from './Ornaments';
import { formatDayRange, splitNames, venueCity } from '../lib/format';

const EASE = [0.22, 1, 0.36, 1];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

function Letters({ text, className = '', delay = 0 }) {
  return (
    <motion.span
      className={`block ${className}`}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
      aria-hidden="true"
    >
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: '0.3em' },
            show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } },
          }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Two gold lines that trace the arch, drawn in once the page is revealed (viewBox matches the 4:5 photo).
function ArchOutline({ ready }) {
  const arch = (r) => `M ${200 - r} 500 V 200 A ${r} ${r} 0 0 1 ${200 + r} 200 V 500`;
  return (
    <svg viewBox="0 0 400 500" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible will-change-transform" aria-hidden="true">
      {[226, 238].map((r, i) => (
        <motion.path
          key={r}
          d={arch(r)}
          fill="none"
          stroke="#cfa75e"
          strokeWidth={i ? 0.8 : 1.2}
          strokeOpacity={i ? 0.5 : 0.85}
          initial={{ pathLength: 0 }}
          animate={ready ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2.6, ease: [0.65, 0, 0.35, 1], delay: 0.4 + i * 0.25 }}
        />
      ))}
    </svg>
  );
}

export default function Hero({ settings, events, revealed, settled = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '9%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const ready = Boolean(revealed && settings);
  const names = splitNames(settings?.coupleNames);
  const dateLine = formatDayRange(events, settings?.weddingDate);
  const city = venueCity(settings?.venueAddress);

  return (
    <section id="hero" ref={ref} className="relative isolate overflow-hidden bg-paper">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-jaali opacity-40 [mask-image:radial-gradient(60%_55%_at_72%_42%,black,transparent)]"
      />

      <motion.div
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
        variants={stagger}
        className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-16 px-6 pb-24 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pb-20"
      >
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="text-center lg:text-left">
          <motion.p variants={rise} lang="hi" className="font-deva text-xl text-gold-600 [word-spacing:0.45em]">
            ॥ शुभ विवाह ॥
          </motion.p>
          <motion.p variants={rise} className="mt-4 font-display text-xl italic text-forest-700">
            Together with their families
          </motion.p>

          <h1 className="mt-4 font-display text-[clamp(4.3rem,12.5vw,9rem)] font-light leading-[0.86] text-ink-900">
            <span className="sr-only">{settings?.coupleNames}</span>
            {names.length === 2 ? (
              <>
                <Letters text={names[0]} />
                <motion.span
                  aria-hidden="true"
                  className="text-foil block text-[0.62em] font-normal italic leading-[1.1] lg:pl-[1.15em]"
                  variants={{
                    hidden: { opacity: 0, scale: 0.5, rotate: -14 },
                    show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.3, ease: EASE, delay: 0.55 } },
                  }}
                >
                  &amp;
                </motion.span>
                <Letters text={names[1]} className="lg:pl-[1.55em]" delay={0.75} />
              </>
            ) : (
              <Letters text={settings?.coupleNames || ''} />
            )}
          </h1>

          {settings?.tagline && (
            <motion.p
              variants={rise}
              className="mx-auto mt-8 max-w-md text-balance font-display text-[1.65rem] italic leading-snug text-ink-700 lg:mx-0"
            >
              {settings.tagline}
            </motion.p>
          )}

          {dateLine && (
            <motion.div variants={rise} className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
              <span className="h-px w-8 bg-gold-400 sm:w-12" />
              <p className="eyebrow text-ink-900">{dateLine}</p>
              <span className="h-px w-8 bg-gold-400 sm:w-12" />
            </motion.div>
          )}
          {settings?.venueName && (
            <motion.p variants={rise} className="mt-3 font-display text-xl text-ink-500">
              {[settings.venueName, city].filter(Boolean).join(', ')}
            </motion.p>
          )}

          <motion.div variants={rise} className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            <a
              href="#rsvp"
              className="rounded-full bg-forest-800 px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-ivory-50 shadow-[0_14px_30px_-14px_rgba(19,58,43,0.8)] transition hover:-translate-y-0.5 hover:bg-forest-900"
            >
              Kindly RSVP
            </a>
            <a
              href="#welcome"
              className="font-display text-xl italic text-forest-800 underline decoration-gold-400/70 decoration-1 underline-offset-[6px] transition hover:text-forest-600 hover:decoration-gold-500"
            >
              Read our note to you
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.96 },
            show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: EASE, delay: 0.25 } },
          }}
          className="relative mx-auto w-full max-w-[min(420px,74vw)] lg:max-w-[440px]"
        >
          {/* Own layer (will-change) so the frame lines and ticking countdown beside it never force it to repaint */}
          <Mandala className="pointer-events-none absolute left-1/2 top-[40%] -z-10 w-[165%] max-w-none -translate-x-1/2 -translate-y-1/2 text-gold-400/25 will-change-transform" />
          <ArchOutline ready={ready} />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-ivory-200 shadow-[0_50px_90px_-45px_rgba(19,58,43,0.7)]">
            {settings?.heroImageUrl && (
              <motion.img
                src={settings.heroImageUrl}
                alt={settings.coupleNames}
                fetchPriority="high"
                decoding="async"
                style={{ y: imageY }}
                initial={{ scale: 1.2 }}
                animate={ready ? { scale: 1.06 } : { scale: 1.2 }}
                transition={{ duration: 7, ease: 'easeOut' }}
                className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover object-[36%_60%] will-change-transform"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(12,39,28,0.3))]" />
            <div className="absolute inset-3 rounded-t-full border border-ivory-50/45" />
          </div>
          {ready && settled && <FloralArch />}

          {settings?.weddingDate && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 1, ease: EASE, delay: 2 }}
              className="absolute -bottom-7 left-1/2 z-10 -translate-x-1/2 will-change-transform"
            >
              <Countdown targetDate={settings.weddingDate} variant="pill" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.6, duration: 1 }}
      >
        <span className="font-display text-sm italic text-ink-400">scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-gold-300/40">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gold-500"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}
