import { Fragment, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function getTimeLeft(targetDate) {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    done: diff === 0,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digits({ value, className }) {
  return (
    <span className={`relative inline-flex h-[1.15em] items-center justify-center overflow-hidden lining-nums tabular-nums ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '-90%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '90%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Countdown({ targetDate, variant = 'full' }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate));
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (timeLeft.done) {
    return <p className="font-display text-2xl italic text-forest-800">The celebrations have begun</p>;
  }

  const units = [
    { label: 'Days', short: 'days', value: timeLeft.days },
    { label: 'Hours', short: 'hrs', value: timeLeft.hours },
    { label: 'Minutes', short: 'min', value: timeLeft.minutes },
    { label: 'Seconds', short: 'sec', value: timeLeft.seconds },
  ];

  if (variant === 'pill') {
    return (
      <div
        className="flex items-center gap-3 whitespace-nowrap rounded-full border border-gold-300/80 bg-ivory-50/95 px-5 py-2.5 shadow-soft sm:gap-4 sm:px-6 sm:py-3"
        role="timer"
        aria-live="off"
        aria-label={`${timeLeft.days} days until the celebrations begin`}
      >
        {units.map((unit, i) => (
          <Fragment key={unit.label}>
            {i > 0 && <span aria-hidden="true" className="h-5 w-px bg-gold-300/70" />}
            <span className="flex items-baseline gap-1">
              <Digits value={unit.value} className="font-display text-[1.45rem] leading-none text-ink-900 sm:text-[1.65rem]" />
              <span className="text-[0.56rem] font-medium uppercase tracking-[0.14em] text-gold-600">{unit.short}</span>
            </span>
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 divide-x divide-gold-300/60" role="timer" aria-live="off">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center px-3 sm:px-8">
          <Digits value={unit.value} className="w-full font-display text-[2.4rem] font-light leading-none text-ink-900 sm:text-[3.4rem]" />
          <span className="eyebrow mt-2 text-[0.6rem] text-gold-600">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
