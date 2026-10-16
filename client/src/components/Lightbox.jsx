import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiCaretLeftLight, PiCaretRightLight, PiXLight } from 'react-icons/pi';
import { lockScroll } from '../lib/scroll';

// items: [{ src, alt }]
export default function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null && index >= 0;
  const closeRef = useRef(null);
  const item = open ? items[index] : null;

  // Lock the page and move focus once per opening, not on every photo change.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    const release = lockScroll({ color: '#0c271c' });
    return () => {
      release();
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const step = (delta) => onIndex((index + delta + items.length) % items.length);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, items.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-forest-950/95 p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-2xl text-ivory-100 transition hover:bg-white/10"
            aria-label="Close"
          >
            <PiXLight />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex((index - 1 + items.length) % items.length);
                }}
                className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-3xl text-ivory-100 transition hover:bg-white/10 sm:left-6"
                aria-label="Previous photo"
              >
                <PiCaretLeftLight />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex((index + 1) % items.length);
                }}
                className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-3xl text-ivory-100 transition hover:bg-white/10 sm:right-6"
                aria-label="Next photo"
              >
                <PiCaretRightLight />
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.figure
              key={item.src}
              className="flex max-h-full flex-col items-center"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="max-h-[80vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
              />
            </motion.figure>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
