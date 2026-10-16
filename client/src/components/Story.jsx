import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { PiAirplaneTiltLight } from 'react-icons/pi';
import { Heart, SectionHeading } from './Ornaments';
import Lightbox from './Lightbox';
import { STORY_CHAPTERS } from '../data/content';
import { splitNames } from '../lib/format';

const EASE = [0.22, 1, 0.36, 1];
const TILTS = { tall: [-3, 3.5, -2], pair: [-2, 4] };
const TAPES = ['left-1/2 -translate-x-1/2 rotate-[-4deg]', 'left-6 rotate-[-8deg]', 'right-6 rotate-[7deg]'];

const STORY_PHOTOS = STORY_CHAPTERS.flatMap((c) =>
  (c.collage?.photos ?? []).map((p) => ({ ...p, caption: `${c.title} — ${p.alt}` }))
);
const PHOTO_OFFSETS = STORY_CHAPTERS.reduce(
  (acc, c, i) => [...acc, acc[i] + (c.collage?.photos.length ?? 0)],
  [0]
);

// A real polaroid: thick bottom edge with a handwritten note, held on with a strip of washi tape.
function Polaroid({ photo, tilt, aspect, index = 0, className = '', captionClassName = 'text-center', delay = 0, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className={`group relative block cursor-zoom-in bg-white p-2 pb-9 shadow-photo sm:p-2.5 sm:pb-12 ${className}`}
      initial={{ opacity: 0, y: 60, rotate: tilt * 2.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 20 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.95, ease: EASE, delay }}
      aria-label={`View photo: ${photo.alt}`}
    >
      <span
        aria-hidden="true"
        className={`absolute -top-3 z-10 h-6 w-16 bg-[repeating-linear-gradient(45deg,rgba(239,223,186,0.85)_0_6px,rgba(244,211,201,0.75)_6px_12px)] shadow-sm ${TAPES[index % TAPES.length]}`}
      />
      <span className={`block overflow-hidden bg-ivory-200 ${aspect}`}>
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          style={{ objectPosition: photo.focus }}
        />
      </span>
      {photo.note && (
        <span
          className={`absolute inset-x-3 bottom-1.5 truncate font-hand text-[1.2rem] leading-none text-ink-700 sm:bottom-3 sm:text-[1.5rem] ${captionClassName}`}
          style={{ rotate: `${-tilt * 0.35}deg` }}
        >
          {photo.note}
        </span>
      )}
    </motion.button>
  );
}

function Collage({ collage, onOpen }) {
  const tilt = TILTS[collage.layout];
  const [a, b, c] = collage.photos;
  return (
    <figure>
      {/* On phones the collage spans the full width, so the caption steps past the timeline line. */}
      <figcaption className="mb-7 pl-[76px] font-script text-[1.8rem] leading-tight text-gold-600 sm:pl-0 sm:text-[2.4rem]">
        {collage.caption}
      </figcaption>
      {collage.layout === 'tall' ? (
        <div className="grid grid-cols-[1.15fr_1fr] items-center gap-4 sm:gap-6">
          <Polaroid photo={a} index={0} tilt={tilt[0]} aspect="aspect-[3/4.2]" className="row-span-2" onOpen={() => onOpen(0)} />
          <Polaroid photo={b} index={1} tilt={tilt[1]} aspect="aspect-square" delay={0.12} onOpen={() => onOpen(1)} />
          <Polaroid photo={c} index={2} tilt={tilt[2]} aspect="aspect-[4/3]" className="-ml-8 sm:-ml-12" delay={0.24} onOpen={() => onOpen(2)} />
        </div>
      ) : (
        <div className="relative pb-2">
          <Polaroid photo={a} index={0} tilt={tilt[0]} aspect="aspect-[3/2]" className="w-[88%]" captionClassName="pr-[42%] text-left" onOpen={() => onOpen(0)} />
          <Polaroid photo={b} index={2} tilt={tilt[1]} aspect="aspect-[4/3]" className="-mt-16 ml-auto w-[54%] sm:-mt-24" delay={0.15} onOpen={() => onOpen(1)} />
        </div>
      )}
    </figure>
  );
}

function BoardingPass({ names }) {
  const [him, her] = names;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -7 }}
      whileInView={{ opacity: 1, y: 0, rotate: -2.5 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.1, ease: EASE }}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-ivory-50 shadow-[0_34px_60px_-30px_rgba(19,58,43,0.6)] ring-1 ring-gold-300/70"
    >
      <div className="flex items-center justify-between bg-forest-900 px-6 py-3 text-ivory-100">
        <span className="eyebrow text-[0.58rem] text-gold-200">Boarding pass</span>
        <span className="font-display text-lg italic text-ivory-100/90">Long-distance air</span>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 pt-6">
        <div>
          <p className="eyebrow text-[0.56rem] text-ink-400">From</p>
          <p className="font-display text-4xl text-ink-900">East</p>
          <p className="text-xs text-ink-500">the other coast</p>
        </div>
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gold-400" />
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 text-xl text-forest-700"
            animate={{ left: ['0%', '82%'] }}
            transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
          >
            <PiAirplaneTiltLight />
          </motion.span>
        </div>
        <div className="text-right">
          <p className="eyebrow text-[0.56rem] text-ink-400">To</p>
          <p className="font-display text-4xl text-ink-900">SFO</p>
          <p className="text-xs text-ink-500">San Francisco</p>
        </div>
      </div>
      <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-dashed border-gold-300 px-6 py-5">
        <span aria-hidden="true" className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-ivory-100 ring-1 ring-gold-300/70" />
        <span aria-hidden="true" className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-ivory-100 ring-1 ring-gold-300/70" />
        {[
          ['Passenger', her],
          ['Purpose', 'Borrowed weekends'],
          ['Seat', him ? `Next to ${him}` : 'By the window'],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="eyebrow text-[0.52rem] text-ink-400">{label}</p>
            <p className="mt-1 font-display text-lg leading-tight text-ink-900">{value}</p>
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="mx-6 mb-6 h-10 bg-[repeating-linear-gradient(90deg,#16201c_0_2px,transparent_2px_5px,#16201c_5px_6px,transparent_6px_9px,#16201c_9px_12px,transparent_12px_14px)] opacity-80"
      />
    </motion.div>
  );
}

function DistanceMeter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const miles = useMotionValue(2500);
  const label = useTransform(miles, (v) => Math.round(v).toLocaleString('en-US'));
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(miles, 0, {
      duration: 2.8,
      delay: 0.3,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setArrived(true),
    });
    return () => controls.stop();
  }, [inView, miles]);

  const travel = { duration: 2.8, delay: 0.3, ease: [0.65, 0, 0.35, 1] };

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-md rounded-[1.75rem] border border-gold-300/70 bg-ivory-50/90 px-7 py-9 text-center shadow-[0_30px_60px_-34px_rgba(19,58,43,0.55)]"
    >
      <p className="eyebrow text-[0.6rem] text-ink-400">Miles between us</p>
      <p className="mt-2 font-display text-7xl font-light tabular-nums text-ink-900">
        <motion.span>{label}</motion.span>
      </p>
      <div className="relative mx-2 mt-8 h-12">
        <div className="absolute inset-x-0 top-1/2 h-px bg-[repeating-linear-gradient(90deg,#cfa75e_0_6px,transparent_6px_12px)]" />
        <motion.span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-700 ring-4 ring-forest-100"
          initial={{ left: '0%' }}
          animate={inView ? { left: '44%' } : { left: '0%' }}
          transition={travel}
        />
        <motion.span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500 ring-4 ring-gold-100"
          initial={{ left: '100%' }}
          animate={inView ? { left: '56%' } : { left: '100%' }}
          transition={travel}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blush-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={arrived ? { scale: [0, 1.5, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Heart className="h-7 w-7" />
        </motion.span>
      </div>
      <div className="mt-1 flex justify-between text-xs text-ink-500">
        <span>Philadelphia</span>
        <span>California</span>
      </div>
      <motion.p
        className="mt-6 font-display text-2xl italic text-forest-800"
        initial={{ opacity: 0, y: 8 }}
        animate={arrived ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.8 }}
      >
        Finally, the same place.
      </motion.p>
    </div>
  );
}

function Marker({ number }) {
  return (
    <motion.div
      className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-gold-400 bg-ivory-100 font-display text-xl italic text-forest-800 shadow-[0_0_0_8px_var(--color-ivory-100)]"
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 15 }}
    >
      {number}
      <span aria-hidden="true" className="absolute -inset-1.5 rounded-full border border-gold-300/50" />
    </motion.div>
  );
}

function Chapter({ chapter, flip, names, onOpen }) {
  let media = null;
  if (chapter.collage) media = <Collage collage={chapter.collage} onOpen={onOpen} />;
  else if (chapter.feature === 'boarding-pass') media = <BoardingPass names={names} />;
  else if (chapter.feature === 'distance') media = <DistanceMeter />;

  return (
    <li className="grid grid-cols-[56px_1fr] gap-x-5 gap-y-12 lg:grid-cols-[1fr_96px_1fr] lg:gap-x-12">
      <div className="col-start-1 row-start-1 flex justify-center lg:col-start-2">
        <Marker number={chapter.number} />
      </div>
      <motion.div
        className={`col-start-2 row-start-1 pt-1 ${flip ? 'lg:col-start-3' : 'lg:col-start-1 lg:text-right'}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="eyebrow text-gold-600">
          {chapter.number} · {chapter.place}
        </p>
        <h3 className="mt-3 font-display text-[2.5rem] font-light leading-[1.05] text-ink-900 sm:text-5xl">
          {chapter.title}
        </h3>
        <p className={`mt-5 max-w-md text-[1.05rem] leading-8 text-ink-700 ${flip ? '' : 'lg:ml-auto'}`}>
          {chapter.body}
        </p>
      </motion.div>
      {media && (
        <div
          className={`col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-2 lg:row-start-1 lg:self-center ${
            flip ? 'lg:col-start-1' : 'lg:col-start-3'
          }`}
        >
          {media}
        </div>
      )}
    </li>
  );
}

export default function Story({ settings }) {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 65%', 'end 65%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  // Moved with a transform (percent of the track's own height) rather than `top`, so it stays on the GPU.
  const heartY = useTransform(progress, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);
  const heartOpacity = useTransform(progress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  const [lightbox, setLightbox] = useState(null);
  const names = splitNames(settings?.coupleNames);

  return (
    <section id="story" className="relative py-28 sm:py-36">
      <SectionHeading kicker="Our story" title="The long *way* home" lede={settings?.story} />

      <div ref={timelineRef} className="relative mx-auto mt-20 max-w-6xl px-5 sm:mt-24 sm:px-6">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[48px] top-0 w-px -translate-x-1/2 bg-gold-300/50 sm:left-[52px] lg:left-1/2"
        />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: progress }}
          className="absolute bottom-0 left-[48px] top-0 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-gold-400 via-forest-600 to-gold-500 sm:left-[52px] lg:left-1/2"
        />
        {/* A small heart that travels down the timeline as the story is read, passing behind the
            photos and markers. The clipped track keeps the translated layer from adding scroll height. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-5 left-[48px] w-24 -translate-x-1/2 overflow-hidden sm:left-[52px] lg:left-1/2"
        >
          <motion.div style={{ y: heartY, opacity: heartOpacity }} className="absolute inset-x-0 bottom-5 top-5">
            <span className="absolute left-1/2 top-0 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory-50 shadow-[0_0_0_6px_rgba(251,247,239,0.92),0_10px_22px_-6px_rgba(223,143,132,0.9)] ring-1 ring-blush-300">
              <Heart className="h-4 w-4 animate-heartbeat text-blush-400" />
            </span>
          </motion.div>
        </div>
        <ol className="relative z-10 space-y-24 sm:space-y-32">
          {STORY_CHAPTERS.map((chapter, i) => (
            <Chapter
              key={chapter.number}
              chapter={chapter}
              flip={i % 2 === 1}
              names={names}
              onOpen={(k) => setLightbox(PHOTO_OFFSETS[i] + k)}
            />
          ))}
        </ol>
      </div>

      <Lightbox items={STORY_PHOTOS} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </section>
  );
}
