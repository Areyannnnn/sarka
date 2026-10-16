import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealWords } from './Ornaments';
import { formatDayRange, venueCity } from '../lib/format';

const EASE = [0.22, 1, 0.36, 1];

// A full-bleed pause between the story and the celebrations. The photo rises out of the paper
// above and dissolves into the celebrations band below, so there is no hard edge either way.
// The words sit on that lower fade, clear of the couple's faces.
export default function Interlude({ settings, events }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const line = [formatDayRange(events, settings?.weddingDate), venueCity(settings?.venueAddress)].filter(Boolean).join(' · ');

  return (
    <section ref={ref} aria-label="We’re getting married" className="relative isolate h-[92svh] min-h-[560px] overflow-hidden">
      <motion.img
        src="/images/story/california-heart-wide.webp"
        alt="Saurav and Alka making a heart with their hands"
        loading="lazy"
        decoding="async"
        style={{ y }}
        className="absolute inset-x-0 -top-[10%] -z-10 h-[120%] w-full object-cover object-[50%_25%] will-change-transform"
      />
      {/* paper above, celebrations band below */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fbf7ef_0%,rgba(251,247,239,0.55)_10%,transparent_24%,transparent_52%,rgba(244,236,221,0.72)_70%,rgba(244,236,221,0.94)_82%,#f4ecdd_100%)]" />

      <div className="flex h-full flex-col items-center justify-end px-6 pb-[7svh] text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: EASE }}
          className="font-script text-5xl text-gold-600 sm:text-6xl"
        >
          and so,
        </motion.p>
        <h2 className="mt-2 font-display text-[clamp(3.2rem,9vw,7.5rem)] font-light leading-[0.95] text-ink-900 [&_em]:italic [&_em]:text-forest-700">
          <RevealWords text="we’re getting *married*" delay={0.25} stagger={0.12} />
        </h2>
        {line && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="eyebrow mt-6 text-ink-700"
          >
            {line}
          </motion.p>
        )}
      </div>
    </section>
  );
}
