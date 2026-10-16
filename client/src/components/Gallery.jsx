import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from './Ornaments';
import Lightbox from './Lightbox';

export default function Gallery({ photos }) {
  const [active, setActive] = useState(null);
  const items = photos.map((p) => ({ src: p.url, alt: p.caption || 'Wedding photo', caption: p.caption }));

  return (
    <section id="gallery" className="relative py-28 sm:py-36">
      <SectionHeading
        kicker="Moments"
        title="A few *favourite* frames"
      />

      <div className="mx-auto mt-16 max-w-6xl columns-2 gap-4 px-5 sm:columns-3 sm:gap-6 sm:px-6 [&>*]:mb-4 sm:[&>*]:mb-6">
        {photos.map((photo, i) => (
          <motion.button
            key={photo._id}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (i % 6) * 0.06 }}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-ivory-200 shadow-[0_24px_44px_-28px_rgba(22,32,28,0.6)]"
            aria-label={`View photo${photo.caption ? `: ${photo.caption}` : ''}`}
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Wedding photo'}
              loading="lazy"
              decoding="async"
              className="w-full object-cover transition duration-700 group-hover:scale-105"
            />
            {photo.caption && (
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-forest-950/80 to-transparent px-4 pb-3 pt-10 text-left font-display text-lg italic text-ivory-50 transition-transform duration-500 group-hover:translate-y-0">
                {photo.caption}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <Lightbox items={items} index={active} onClose={() => setActive(null)} onIndex={setActive} />
    </section>
  );
}
