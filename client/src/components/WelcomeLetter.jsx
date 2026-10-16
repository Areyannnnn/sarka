import { motion } from 'framer-motion';
import { Laurel, Mandala, Monogram, PressedRose, Signature } from './Ornaments';

const EASE = [0.22, 1, 0.36, 1];

// Deterministic jitter so the paper looks hand-torn but stays the same on every render.
function deckle(points = 26, depth = 5) {
  const edge = (i, salt) => ((Math.sin(i * 12.9898 + salt) * 43758.5453) % 1 + 1) % 1;
  const side = (from, to, fixed, salt, horizontal) =>
    Array.from({ length: points + 1 }, (_, i) => {
      const t = from + ((to - from) * i) / points;
      const off = (edge(i, salt) * depth).toFixed(1);
      return horizontal ? `${t}% calc(${fixed} ${fixed === '0%' ? '+' : '-'} ${off}px)` : `calc(${fixed} ${fixed === '0%' ? '+' : '-'} ${off}px) ${t}%`;
    });
  return `polygon(${[
    ...side(0, 100, '0%', 1, true),
    ...side(0, 100, '100%', 2, false),
    ...side(100, 0, '100%', 3, true),
    ...side(100, 0, '0%', 4, false),
  ].join(', ')})`;
}

const PAPER_EDGE = deckle();

export default function WelcomeLetter({ settings }) {
  if (!settings?.welcomeNote) return null;
  const paragraphs = settings.welcomeNote.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <section id="welcome" className="relative px-5 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -3 }}
        whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.3, ease: EASE }}
        className="relative mx-auto max-w-2xl"
      >
        {/* A pre-softened shadow behind the paper. (A CSS drop-shadow would follow the torn edge too,
            but it is recomputed whenever anything inside the letter animates, which costs frames.) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[4%] -bottom-8 top-10 -z-10 rounded-[40%] bg-[radial-gradient(closest-side,rgba(19,58,43,0.3),rgba(19,58,43,0.12)_62%,transparent)]"
        />
        <article
          className="relative overflow-hidden bg-ivory-50 px-8 pb-16 pt-14 sm:px-16 sm:pb-20 sm:pt-16"
          style={{ clipPath: PAPER_EDGE }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_0%,rgba(244,236,221,0.9),transparent_60%),radial-gradient(70%_60%_at_100%_100%,rgba(244,211,201,0.35),transparent_60%)]" />
          <Mandala className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 text-gold-300/30" />

          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <p className="text-[2.4rem] text-forest-900">
                <Monogram names={settings.coupleNames} beat />
              </p>
              <Laurel className="mt-3 h-5 w-24 text-gold-400" />
            </div>

            <p className="mt-10 font-display text-[1.9rem] italic leading-none text-forest-800">Dear family &amp; friends,</p>

            <div className="mt-7 space-y-5 font-display text-[1.32rem] leading-[1.65] text-ink-700 sm:text-[1.42rem]">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-pretty ${
                    i === 0
                      ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.6rem] first-letter:font-normal first-letter:leading-[0.78] first-letter:text-gold-600'
                      : ''
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>

            <p className="mt-12 font-display text-xl italic text-ink-500">With all our love,</p>
            <p className="mt-1">
              <Signature text={settings.coupleNames} className="text-[3.6rem] text-forest-800 sm:text-[4.4rem]" />
            </p>
          </div>

          <PressedRose className="pointer-events-none absolute -bottom-3 right-6 h-24 w-24 rotate-12 opacity-95 sm:right-12" />
        </article>
      </motion.div>
    </section>
  );
}
