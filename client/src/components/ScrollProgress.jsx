import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Heart } from './Ornaments';

// A hairline of gold across the top of the page, with a small heart riding its tip.
export default function ScrollProgress({ visible }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const heartX = useTransform(progress, (v) => `${v * 100}vw`);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <motion.div className="h-full origin-left bg-gradient-to-r from-gold-300 via-gold-500 to-blush-400" style={{ scaleX: progress }} />
      <motion.span className="absolute left-0 top-0 -ml-[5px] -mt-[4px] block text-blush-400" style={{ x: heartX }}>
        <Heart className="h-2.5 w-2.5" />
      </motion.span>
    </div>
  );
}
