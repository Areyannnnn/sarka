import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CornerFlourish, Mandala, PetalBurst, Seal } from './Ornaments';
import { lockScroll } from '../lib/scroll';

const EASE = [0.7, 0, 0.2, 1];

function Door({ side, opening, reduce }) {
  const left = side === 'left';
  return (
    <motion.div
      className={`absolute top-0 h-full w-1/2 overflow-hidden bg-forest-900 ${
        left ? 'left-0 origin-left' : 'right-0 origin-right'
      }`}
      style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
      animate={opening ? (reduce ? { opacity: 0 } : { rotateY: left ? -104 : 104 }) : { rotateY: 0 }}
      transition={{ duration: reduce ? 0.4 : 1.6, ease: EASE, delay: reduce ? 0 : 0.35 }}
    >
      <div className="absolute inset-0 bg-jaali-light opacity-80" />
      <div
        className={`absolute inset-0 ${
          left
            ? 'bg-[linear-gradient(90deg,rgba(0,0,0,0.28),transparent_30%,transparent_78%,rgba(0,0,0,0.4))]'
            : 'bg-[linear-gradient(270deg,rgba(0,0,0,0.28),transparent_30%,transparent_78%,rgba(0,0,0,0.4))]'
        }`}
      />
      {/* carved arch panel with a mandala medallion */}
      <div
        className={`absolute bottom-[7%] top-[9%] w-[64%] rounded-t-full border border-gold-400/50 ${
          left ? 'right-[12%]' : 'left-[12%]'
        }`}
      >
        <div className="absolute inset-3 rounded-t-full border border-gold-400/25" />
        <Mandala className="absolute left-1/2 top-[38%] w-[78%] max-w-56 -translate-x-1/2 -translate-y-1/2 text-gold-400/30" />
        <CornerFlourish className="absolute -bottom-px -left-px h-10 w-10 -scale-y-100 text-gold-400/50" />
        <CornerFlourish className="absolute -bottom-px -right-px h-10 w-10 -scale-100 text-gold-400/50" />
      </div>
      <div className={`absolute top-1/2 h-24 w-px bg-gold-400/40 ${left ? 'right-3' : 'left-3'}`} />
      <div className={`absolute top-1/2 mt-16 h-3 w-3 rounded-full border border-gold-400/70 ${left ? 'right-5' : 'left-5'}`} />
    </motion.div>
  );
}

// onReveal fires as the doors start to swing so the page can animate in behind them;
// onOpen fires once they are out of the way and the gate can unmount.
export default function IntroGate({ settings, dateLine, onReveal, onOpen }) {
  const [opening, setOpening] = useState(false);
  const reduce = useReducedMotion();
  const sealRef = useRef(null);

  const open = () => {
    if (opening) return;
    setOpening(true);
    // The hero starts once the doors are mostly open, so its animations don't compete with the swing.
    setTimeout(onReveal, reduce ? 100 : 1100);
    setTimeout(onOpen, reduce ? 450 : 1900);
  };

  useEffect(() => {
    const release = lockScroll({ color: '#133a2b' });
    sealRef.current?.focus({ preventScroll: true });
    return release;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') open();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation"
      className="fixed inset-0 z-[100] overflow-hidden [perspective:2000px]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* warm light spilling through the seam as the doors part */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-[140vw] -translate-x-1/2 will-change-[transform,opacity] bg-[radial-gradient(50%_60%_at_50%_50%,rgba(255,240,200,0.95),rgba(239,223,186,0.55)_45%,transparent_75%)]"
        initial={{ opacity: 0, scaleX: 0.02 }}
        animate={opening && !reduce ? { opacity: [0, 1, 0], scaleX: [0.02, 0.6, 1] } : { opacity: 0, scaleX: 0.02 }}
        transition={{ duration: 1.9, ease: 'easeOut', times: [0, 0.35, 1] }}
      />

      <Door side="left" opening={opening} reduce={reduce} />
      <Door side="right" opening={opening} reduce={reduce} />

      {!reduce && <PetalBurst play={opening} count={18} />}

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        animate={opening ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeIn' }}
      >
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-deva text-2xl text-gold-300 [word-spacing:0.45em]"
          lang="hi"
        >
          ॥ शुभ विवाह ॥
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 font-display text-xl italic text-gold-200/85"
        >
          you are warmly invited
        </motion.p>

        <div className="relative my-9">
          <Mandala className="pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 animate-spin-slower text-gold-300/25 sm:h-[27rem] sm:w-[27rem]" />
          <motion.button
            ref={sealRef}
            onClick={open}
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.55 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative block rounded-full"
            aria-label="Open the invitation"
          >
            <Seal names={settings?.coupleNames} className="h-36 w-36 sm:h-40 sm:w-40" textClassName="text-[2.6rem]" />
            <span className="absolute -inset-3 animate-ping rounded-full border border-gold-300/40 [animation-duration:2.6s]" />
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }}>
          <p className="font-display text-4xl font-light text-ivory-50 sm:text-5xl">{settings?.coupleNames}</p>
          {dateLine && <p className="eyebrow mt-4 text-gold-200/80">{dateLine}</p>}
          <p className="mt-10 font-display text-lg italic text-ivory-200/60">tap the seal to open</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
