import { motion } from 'framer-motion';
import { PiArrowUpRightLight } from 'react-icons/pi';
import { SectionHeading } from './Ornaments';
import { EXPLORE, mapsUrl } from '../data/content';

const EASE = [0.22, 1, 0.36, 1];

export default function Explore() {
  return (
    <section id="explore" className="relative pb-32 pt-12 sm:pb-40">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.85fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            kicker="While you are here"
            title={'A little time\n*by the coast*'}
            lede="A few places to wander before or after the celebrations."
          />
        </div>

        <div className="grid gap-14 sm:grid-cols-2 sm:gap-10">
          {EXPLORE.map((group, gi) => (
            <motion.div
              key={group.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: EASE, delay: gi * 0.12 }}
            >
              <p className="font-script text-3xl text-gold-600">{group.note}</p>
              <h3 className="mt-1 font-display text-6xl font-light italic leading-none text-forest-900">{group.city}</h3>
              <ol className="mt-6 border-t border-gold-300/70">
                {group.places.map((place, i) => (
                  <li key={place.name} className="border-b border-gold-200/80">
                    <a
                      href={mapsUrl(place.query)}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-4 py-6"
                    >
                      <span className="w-7 font-display text-3xl italic leading-none text-gold-400">{i + 1}</span>
                      <span className="flex-1">
                        <span className="flex items-center gap-2 font-display text-2xl leading-tight text-ink-900 transition-colors group-hover:text-forest-700">
                          {place.name}
                          <PiArrowUpRightLight className="text-base text-gold-500 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                        </span>
                        <span className="mt-1.5 block text-pretty leading-7 text-ink-500">{place.note}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
