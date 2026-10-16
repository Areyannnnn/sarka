import { motion, useReducedMotion } from 'framer-motion';
import { PiAirplaneLandingLight, PiArrowRightLight, PiCarProfileLight } from 'react-icons/pi';
import { ArchEdge, SectionHeading } from './Ornaments';
import { TRAVEL_STEPS } from '../data/content';

const ROUTE = 'M110 150 C 320 10, 680 10, 890 150';
const EASE = [0.22, 1, 0.36, 1];

function RouteMap({ steps }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mt-14 max-w-4xl" aria-hidden="true">
      <svg viewBox="0 0 1000 230" className="w-full overflow-visible">
        <path d={ROUTE} fill="none" stroke="rgba(247,238,219,0.22)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
        <motion.path
          d={ROUTE}
          fill="none"
          stroke="#cfa75e"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 2.2, ease: EASE }}
        />
        {[110, 890].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="150" r="22" fill="none" stroke="#cfa75e" strokeOpacity="0.35">
              {!reduce && <animate attributeName="r" values="14;30;14" dur="3s" begin={`${i * 1.5}s`} repeatCount="indefinite" />}
              {!reduce && (
                <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="3s" begin={`${i * 1.5}s`} repeatCount="indefinite" />
              )}
            </circle>
            <circle cx={x} cy="150" r="9" fill="#cfa75e" />
            <circle cx={x} cy="150" r="3.5" fill="#133a2b" />
          </g>
        ))}
        {!reduce && (
          <g>
            <g transform="translate(0 -10)">
              <rect x="-15" y="-7" width="30" height="11" rx="5" fill="#efdfba" />
              <path d="M-9 -7 L-5 -14 H6 L10 -7Z" fill="#efdfba" />
              <rect x="-4" y="-12" width="8" height="5" rx="1" fill="#133a2b" opacity="0.5" />
              <circle cx="-8" cy="4" r="3.4" fill="#133a2b" stroke="#efdfba" strokeWidth="1.6" />
              <circle cx="8" cy="4" r="3.4" fill="#133a2b" stroke="#efdfba" strokeWidth="1.6" />
            </g>
            <animateMotion
              dur="7s"
              repeatCount="indefinite"
              rotate="auto"
              path={ROUTE}
              keyPoints="0;1;1"
              keyTimes="0;0.8;1"
              calcMode="spline"
              keySplines="0.45 0 0.55 1; 0 0 1 1"
            />
          </g>
        )}
      </svg>
      {/* Labels sit under the two route pins, which are drawn at x = 11% and 89% of the viewBox. */}
      <div className="relative mt-1 h-16 sm:h-20">
        {steps.map((step, i) => (
          <div
            key={step.code}
            className={`absolute top-0 -translate-x-1/2 whitespace-nowrap text-center ${i === 0 ? 'left-[11%]' : 'left-[89%]'}`}
          >
            <p className="font-display text-3xl text-ivory-50 sm:text-4xl">{step.code}</p>
            <p className="eyebrow mt-1 text-[0.58rem] text-gold-300">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Travel() {
  return (
    <>
      {/* palace arches rising out of the paper into the dark section, and hanging back down below it */}
      <ArchEdge className="-mb-px text-forest-900" />
      <section id="travel" className="relative isolate overflow-hidden bg-forest-900 py-24 text-ivory-100 sm:py-32">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-jaali-light opacity-70" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(207,167,94,0.18),transparent_70%)]"
        />
        <SectionHeading
          tone="dark"
          kicker="How to travel"
          title={'Fly into Mumbai.\n*We’ll take it from there.*'}
        />

        <div className="mx-auto max-w-6xl px-6">
          <RouteMap steps={TRAVEL_STEPS} />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {TRAVEL_STEPS.map((step, i) => {
              const Icon = i === 0 ? PiAirplaneLandingLight : PiCarProfileLight;
              return (
                <motion.article
                  key={step.code}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 sm:p-10"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-300/40 text-2xl text-gold-200">
                      <Icon />
                    </span>
                    <p className="eyebrow text-[0.62rem] text-gold-300">
                      0{i + 1} · {step.label}
                    </p>
                  </div>
                  <h3 className="mt-6 font-display text-4xl font-light text-ivory-50">{step.title}</h3>
                  <p className="mt-4 max-w-md text-[1.05rem] leading-8 text-ivory-200/80">{step.body}</p>
                </motion.article>
              );
            })}
          </div>

          <p className="mt-12 text-center text-ivory-200/70">
            Tell us whether you’ll need the return transfer in your{' '}
            <a href="#rsvp" className="inline-flex items-center gap-1 text-gold-200 underline decoration-gold-300/40 underline-offset-4 transition hover:text-gold-100">
              RSVP <PiArrowRightLight />
            </a>
          </p>
        </div>
      </section>
      <ArchEdge direction="down" className="-mt-px text-forest-900" />
    </>
  );
}
