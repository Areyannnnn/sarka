import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monogram } from './Ornaments';
import { lockScroll, scrollToId } from '../lib/scroll';

const LINKS = [
  { id: 'story', label: 'Our story' },
  { id: 'events', label: 'Celebrations' },
  { id: 'travel', label: 'Travel' },
  { id: 'venue', label: 'Venue' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'explore', label: 'Explore' },
];

// idsKey is a comma-joined string so the observer is only rebuilt when the set of sections changes.
function useActiveSection(idsKey) {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ['hero', ...idsKey.split(',')].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [idsKey]);
  return active;
}

export default function Navbar({ settings, revealed }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = LINKS;
  const active = useActiveSection(links.map((l) => l.id).join(','));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const release = lockScroll();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      release();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={revealed ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
          scrolled ? 'bg-ivory-100/95 shadow-[0_1px_0_rgba(184,138,62,0.25)]' : 'bg-transparent'
        }`}
        aria-label="Invitation sections"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
          <button
            onClick={() => go('hero')}
            className="text-[1.75rem] text-forest-900 transition hover:text-forest-700"
            aria-label="Back to top"
          >
            <Monogram names={settings?.coupleNames || 'S & A'} beat />
          </button>

          <ul className="hidden items-center gap-7 xl:flex">
            {links.map((link) => (
              <li key={link.id} className="relative">
                <button
                  onClick={() => go(link.id)}
                  className={`eyebrow py-2 text-[0.66rem] transition-colors ${
                    active === link.id ? 'text-forest-900' : 'text-ink-500 hover:text-forest-800'
                  }`}
                  aria-current={active === link.id ? 'true' : undefined}
                >
                  {link.label}
                </button>
                {active === link.id && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => go('rsvp')}
              className="hidden rounded-full bg-forest-800 px-5 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-ivory-50 transition hover:bg-forest-900 sm:inline-block"
            >
              Kindly RSVP
            </button>
            <button
              className="relative h-10 w-10 text-forest-900 xl:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <span className="absolute left-2 top-[15px] h-px w-6 bg-current" />
              <span className="absolute left-2 top-[21px] h-px w-6 bg-current" />
              <span className="absolute left-4 top-[27px] h-px w-4 bg-current" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[70] flex flex-col bg-ivory-100 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="absolute inset-0 bg-paper" />
            <div className="relative flex items-center justify-between px-5 py-3.5">
              <span className="text-[1.75rem] text-forest-900">
                <Monogram names={settings?.coupleNames || 'S & A'} />
              </span>
              <button
                className="relative h-10 w-10 text-forest-900"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <span className="absolute left-2 top-5 h-px w-6 rotate-45 bg-current" />
                <span className="absolute left-2 top-5 h-px w-6 -rotate-45 bg-current" />
              </button>
            </div>
            <ul className="relative flex flex-1 flex-col items-center justify-center gap-4">
              {links.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => go(link.id)}
                    className={`font-display text-[2.6rem] font-light leading-tight ${
                      active === link.id ? 'italic text-forest-700' : 'text-ink-900'
                    }`}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <p className="eyebrow relative pb-10 text-center text-gold-600">{settings?.coupleNames}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
