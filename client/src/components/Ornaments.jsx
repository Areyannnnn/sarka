import { Fragment, useId, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { initials } from '../lib/format';

const EASE = [0.22, 1, 0.36, 1];

// Looping ornaments pause while off screen, so the page can idle and scrolling stays light.
// Children read the state through `[animation-play-state:var(--play)]`.
function usePlayWhenVisible() {
  const ref = useRef(null);
  const visible = useInView(ref, { margin: '120px' });
  return [ref, { '--play': visible ? 'running' : 'paused' }];
}

export function Heart({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21c-.3 0-.6-.1-.8-.3C6.7 17 3 13.9 3 9.6 3 7 5 5 7.5 5c1.8 0 3.3 1 4.5 2.6C13.2 6 14.7 5 16.5 5 19 5 21 7 21 9.6c0 4.3-3.7 7.4-8.2 11.1-.2.2-.5.3-.8.3z"
      />
    </svg>
  );
}

// "S ♥ A", echoing the illustrated monogram on the printed invitation.
export function Monogram({ names, className = '', heartClassName = 'text-gold-500', beat = false }) {
  const [a, b] = initials(names);
  if (!a) return null;
  return (
    <span className={`inline-flex items-center font-display leading-none ${className}`} aria-label={names}>
      <span aria-hidden="true">{a}</span>
      <Heart className={`mx-[0.18em] h-[0.5em] w-[0.5em] ${beat ? 'animate-heartbeat' : ''} ${heartClassName}`} />
      <span aria-hidden="true">{b}</span>
    </span>
  );
}

// A garden rose seen from above: rings of broad petals, shaded darker toward the heart.
const ROSE_RINGS = [
  [5, 11.2, 0, 1],
  [5, 8.4, 36, 0.9],
  [4, 5.8, 10, 0.85],
  [3, 3.6, 70, 0.8],
];
const roundPetal = (r, w) =>
  `M0 0 C ${0.9 * r * w} ${-0.08 * r}, ${0.98 * r * w} ${-0.92 * r}, 0 ${-r} C ${-0.98 * r * w} ${-0.92 * r}, ${-0.9 * r * w} ${-0.08 * r}, 0 0 Z`;
const ROSES = {
  blush: { stops: ['#c9705f', '#e2958a', '#efb7aa', '#fbe3db'], edge: '#b9604f', core: '#a8503f' },
  ivory: { stops: ['#cfae74', '#ead6b2', '#f6ecd9', '#fffaf1'], edge: '#b8935a', core: '#9a7330' },
};
const JASMINE_PETAL = 'M0 0 C 2.9 -3 2.8 -8.6 0 -10.8 C -2.8 -8.6 -2.9 -3 0 0 Z';
const LEAF = 'M8 0 C 15 8, 15 22, 8 34 C 1 22, 1 8, 8 0 Z';

// Shared <symbol>s and gradients, rendered once at the app root, so a garland of dozens of
// flowers stays a handful of DOM nodes.
export function OrnamentDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(ROSES).map(([name, { stops, edge, core }]) => (
          <Fragment key={name}>
            <radialGradient id={`rose-${name}-shade`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="11.5">
              {stops.map((color, i) => (
                <stop key={color} offset={[0, 0.35, 0.7, 1][i]} stopColor={color} />
              ))}
            </radialGradient>
            <symbol id={`rose-${name}`} viewBox="-12 -12 24 24">
              <g fill={`url(#rose-${name}-shade)`} stroke={edge} strokeWidth="0.35" strokeOpacity="0.55">
                {ROSE_RINGS.flatMap(([count, r, offset, w]) =>
                  Array.from({ length: count }, (_, i) => (
                    <path key={`${r}-${i}`} d={roundPetal(r, w)} transform={`rotate(${offset + (i * 360) / count})`} />
                  ))
                )}
              </g>
              <path
                d="M0.5 -0.4 C 1.4 -1.5 -0.5 -2.3 -1.4 -1.1 C -2.3 0.1 -1 1.8 0.7 1.6 C 2.2 1.4 2.5 -0.7 1.5 -1.8"
                fill="none"
                stroke={core}
                strokeWidth="0.55"
                strokeLinecap="round"
                opacity="0.8"
              />
            </symbol>
          </Fragment>
        ))}
        <symbol id="jasmine" viewBox="-12 -12 24 24">
          <g fill="#fffdf8" stroke="#e5d5b7" strokeWidth="0.4">
            {[0, 72, 144, 216, 288].map((deg) => (
              <path key={deg} d={JASMINE_PETAL} transform={`rotate(${deg})`} />
            ))}
          </g>
          <circle r="1.7" fill="#e2c78f" />
          <circle r="0.7" fill="#b88a3e" />
        </symbol>
        <symbol id="jasmine-bud" viewBox="-6 -10 12 20">
          <path d="M0 -9.5 C 3.8 -6.5 3.8 2.5 0 6 C -3.8 2.5 -3.8 -6.5 0 -9.5 Z" fill="#fffdf8" stroke="#e3d2b4" strokeWidth="0.6" />
          <path d="M-2.4 4.6 Q 0 9.5 2.4 4.6 Q 0 6.4 -2.4 4.6 Z" fill="#8fa98a" />
        </symbol>
        <symbol id="sage-leaf" viewBox="0 0 16 34">
          <path d={LEAF} fill="#8fa98a" />
          <path d="M8 2 L8 31" stroke="#6f8d6c" strokeWidth="0.8" />
        </symbol>
        <symbol id="gold-leaf" viewBox="0 0 16 34">
          <path d={LEAF} fill="#d9b978" />
          <path d="M8 2 L8 31" stroke="#b88a3e" strokeWidth="0.8" />
        </symbol>
        <radialGradient id="petal-rose" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fdf1ed" />
          <stop offset="55%" stopColor="#f0b8ab" />
          <stop offset="100%" stopColor="#d97c6d" />
        </radialGradient>
        <radialGradient id="petal-ivory" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="70%" stopColor="#f6ead6" />
          <stop offset="100%" stopColor="#e6cfa6" />
        </radialGradient>
        <radialGradient id="petal-gold" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fbf3df" />
          <stop offset="100%" stopColor="#c9a05a" />
        </radialGradient>
      </defs>
    </svg>
  );
}

const LAUREL_LEAVES = [
  [14, -1, -28],
  [26, -4, -22],
  [38, -8, -18],
  [50, -12, -14],
  [62, -16, -10],
  [74, -19, -6],
];

function Branch() {
  return (
    <g>
      <path d="M2 0 C 30 -2, 58 -10, 88 -22" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {LAUREL_LEAVES.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 0 C 3 -6, 10 -8, 14 -7 C 11 -2, 5 1, 0 0 Z" fill="currentColor" />
          <path d="M0 0 C 3 6, 10 8, 14 7 C 11 2, 5 -1, 0 0 Z" fill="currentColor" opacity="0.75" />
        </g>
      ))}
      <circle cx="90" cy="-23" r="2.2" fill="currentColor" />
    </g>
  );
}

export function Laurel({ className = '' }) {
  return (
    <svg viewBox="-96 -32 192 40" className={className} aria-hidden="true">
      <Branch />
      <g transform="scale(-1 1)">
        <Branch />
      </g>
    </svg>
  );
}

export function Divider({ className = 'text-gold-500', tone = 'light', align = 'center' }) {
  const line = tone === 'dark' ? 'bg-gold-300/40' : 'bg-gold-400/60';
  return (
    <div
      className={`flex items-center gap-4 ${align === 'left' ? 'justify-start' : 'justify-center'} ${className}`}
      aria-hidden="true"
    >
      {align !== 'left' && (
        <motion.span
          className={`h-px w-14 origin-right ${line}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
        />
      )}
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
      >
        <Laurel className="h-5 w-24" />
      </motion.span>
      <motion.span
        className={`h-px w-14 origin-left ${line}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
      />
    </div>
  );
}

// "The long *way* home" -> lines of words, with *starred* words set in italics.
function tokenize(text) {
  return text.split('\n').map((line) =>
    line
      .split(/(\*[^*]+\*)/)
      .filter(Boolean)
      .flatMap((part) => {
        const em = /^\*[^*]+\*$/.test(part);
        return (em ? part.slice(1, -1) : part)
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => ({ word, em }));
      })
  );
}

// Words rise into place from behind a mask, one after another.
export function RevealWords({ text, delay = 0, stagger = 0.07, animate }) {
  const lines = tokenize(text);
  let n = 0;
  const trigger = animate === undefined ? { whileInView: 'show', viewport: { once: true, amount: 0.5 } } : { animate };
  return (
    <>
      <span className="sr-only">{text.replace(/\*/g, '').replace(/\n/g, ' ')}</span>
      <motion.span aria-hidden="true" className="block" initial="hidden" {...trigger}>
        {lines.map((words, li) => (
          <span key={li} className="block">
            {words.map(({ word, em }, wi) => {
              const i = n++;
              const Tag = em ? 'em' : 'span';
              return (
                <span key={wi}>
                  <span className="-mx-[0.1em] -mb-[0.18em] inline-block overflow-hidden px-[0.1em] pb-[0.18em] align-bottom">
                    <motion.span
                      className="inline-block origin-bottom-left"
                      variants={{
                        hidden: { y: '115%', rotate: 5 },
                        show: { y: '0%', rotate: 0, transition: { duration: 1.05, ease: EASE, delay: delay + i * stagger } },
                      }}
                    >
                      <Tag>{word}</Tag>
                    </motion.span>
                  </span>
                  {wi < words.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </>
  );
}

export function SectionHeading({ kicker, title, lede, tone = 'light', align = 'center', className = '' }) {
  const dark = tone === 'dark';
  const left = align === 'left';
  return (
    <header className={`${left ? 'text-left' : 'mx-auto max-w-3xl px-6 text-center'} ${className}`}>
      {kicker && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1, ease: EASE }}
          className={`font-script text-4xl sm:text-5xl ${dark ? 'text-gold-300' : 'text-gold-600'}`}
        >
          {kicker}
        </motion.p>
      )}
      <h2
        className={`mt-3 font-display text-[clamp(2.6rem,6vw,4.4rem)] font-light leading-[1.04] [&_em]:font-normal [&_em]:italic ${
          dark ? 'text-ivory-50 [&_em]:text-gold-300' : 'text-ink-900 [&_em]:text-forest-700'
        }`}
      >
        {typeof title === 'string' ? <RevealWords text={title} delay={0.15} /> : title}
      </h2>
      <Divider className={`mt-7 ${dark ? 'text-gold-300' : 'text-gold-500'}`} tone={tone} align={align} />
      {lede && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          className={`${left ? '' : 'mx-auto'} mt-7 max-w-xl text-balance whitespace-pre-line font-display text-[1.45rem] italic leading-snug sm:text-[1.6rem] ${
            dark ? 'text-ivory-200/85' : 'text-ink-700'
          }`}
        >
          {lede}
        </motion.p>
      )}
    </header>
  );
}

const polar = (count, offset = 0) => Array.from({ length: count }, (_, i) => (360 / count) * i + offset);

// A rangoli-style mandala drawn from rings of petals, arches and dots.
export function Mandala({ className = '', strokeWidth = 0.45 }) {
  const dot = (deg, r, size) => {
    const a = (deg * Math.PI) / 180;
    return <circle key={`${r}-${deg}`} cx={Math.sin(a) * r} cy={-Math.cos(a) * r} r={size} fill="currentColor" stroke="none" />;
  };
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        <circle r="99" />
        {polar(72).map((deg) => dot(deg, 96.6, 0.55))}
        {polar(36).map((deg) => (
          <path key={`a${deg}`} transform={`rotate(${deg}) translate(0 -82)`} d="M0 0 C 3.4 -4 3.4 -9.5 0 -13.5 C -3.4 -9.5 -3.4 -4 0 0 Z" />
        ))}
        <circle r="81" />
        {polar(24).map((deg) => (
          <path key={`b${deg}`} transform={`rotate(${deg}) translate(0 -69.5)`} d="M-9.1 0 Q 0 -12.5 9.1 0" />
        ))}
        {polar(48).map((deg) => dot(deg, 66, 0.8))}
        <circle r="62" />
        {polar(16).map((deg) => (
          <g key={`c${deg}`} transform={`rotate(${deg}) translate(0 -38)`}>
            <path d="M0 0 C 9 -6 9 -17 0 -23.5 C -9 -17 -9 -6 0 0 Z" />
            <path d="M0 -3 V -19" />
          </g>
        ))}
        {polar(16, 11.25).map((deg) => (
          <path key={`d${deg}`} transform={`rotate(${deg}) translate(0 -42)`} d="M0 0 C 4.5 -4 4.5 -10 0 -14 C -4.5 -10 -4.5 -4 0 0 Z" />
        ))}
        <circle r="36" />
        {polar(40).map((deg) => dot(deg, 33.4, 0.6))}
        {polar(8, 22.5).map((deg) => (
          <path key={`e${deg}`} transform={`rotate(${deg}) translate(0 -13)`} d="M0 0 C 6 -5 6 -13 0 -18 C -6 -13 -6 -5 0 0 Z" />
        ))}
        <circle r="12" />
        {polar(12).map((deg) => dot(deg, 7.5, 1))}
        <circle r="3.2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

// ---- The floral arch over the hero photo (viewBox 400 x 500; the arch's top semicircle is centred
// at 200,200 with radius 200). A sage vine traces the curve, with clusters of blush and ivory roses
// and jasmine at the crown and the two shoulders, and jasmine strings hanging at the sides.
const onArch = (deg, r = 200) => {
  const t = (deg * Math.PI) / 180;
  return [200 + r * Math.cos(t), 200 + r * Math.sin(t)];
};
// How long after the reveal each piece blooms: the crown first, then outward along the vine.
const bloomDelay = (deg) => 0.15 + (Math.abs(deg - 270) / 90) * 1.1;

const VINE_LEAVES = Array.from({ length: 26 }, (_, i) => {
  const deg = 184 + i * 6.8;
  const [x, y] = onArch(deg, 203);
  return { x, y, rotate: deg - 90 + (i % 2 ? 38 : -38), gold: i % 4 === 1, delay: bloomDelay(deg) };
});
const VINE_JASMINE = [194, 216, 232, 248, 292, 308, 326, 340].map((deg) => {
  const [x, y] = onArch(deg, 201);
  return { x, y, size: 15, delay: bloomDelay(deg) + 0.1 };
});
// [angle, radius, size, colour]
const ROSE_CLUSTERS = [
  [270, 195, 58, 'blush'],
  [258, 203, 39, 'ivory'],
  [282, 203, 37, 'blush'],
  [247, 208, 26, 'blush'],
  [293, 208, 28, 'ivory'],
  [264, 216, 19, 'ivory'],
  [277, 215, 17, 'blush'],
  [197, 200, 44, 'blush'],
  [209, 206, 31, 'ivory'],
  [186, 197, 27, 'ivory'],
  [203, 213, 18, 'blush'],
  [343, 200, 38, 'ivory'],
  [354, 204, 27, 'blush'],
  [333, 207, 21, 'blush'],
].map(([deg, r, size, color]) => {
  const [x, y] = onArch(deg, r);
  return { x, y, size, color, spin: (deg * 7) % 360, delay: bloomDelay(deg) + 0.05 };
});
const CLUSTER_LEAVES = [
  [252, 222, -70],
  [288, 222, 70],
  [266, 226, -20],
  [276, 226, 25],
  [190, 222, -150],
  [212, 220, -110],
  [338, 220, 110],
].map(([deg, r, rotate]) => {
  const [x, y] = onArch(deg, r);
  return { x, y, rotate, delay: bloomDelay(deg) };
});
const JASMINE_STRINGS = [0, 400].flatMap((x) =>
  Array.from({ length: 6 }, (_, k) => ({ x, y: 252 + k * 15, delay: 1.25 + k * 0.08 }))
);

function Bloom({ x, y, rotate = 0, delay, children }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className="animate-bloom" style={{ animationDelay: `${delay}s` }}>
        {children}
      </g>
    </g>
  );
}

// Mounted when the page is revealed, so the CSS bloom plays once from the crown outward.
export function FloralArch({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M -1 262 V 200 A 201 201 0 0 1 401 200 V 262"
        fill="none"
        stroke="#8fa98a"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength="1"
        className="animate-draw"
      />
      {JASMINE_STRINGS.map((bud, i) => (
        <Bloom key={`s${i}`} x={bud.x} y={bud.y} delay={bud.delay}>
          <use href="#jasmine-bud" x="-5" y="-8.5" width="10" height="17" />
        </Bloom>
      ))}
      {[...VINE_LEAVES, ...CLUSTER_LEAVES].map((leaf, i) => (
        <Bloom key={`l${i}`} x={leaf.x} y={leaf.y} rotate={leaf.rotate} delay={leaf.delay}>
          <use href={leaf.gold ? '#gold-leaf' : '#sage-leaf'} x="-5" y="0" width="10" height="21" />
        </Bloom>
      ))}
      {VINE_JASMINE.map((j, i) => (
        <Bloom key={`j${i}`} x={j.x} y={j.y} rotate={i * 40} delay={j.delay}>
          <use href="#jasmine" x={-j.size / 2} y={-j.size / 2} width={j.size} height={j.size} />
        </Bloom>
      ))}
      {ROSE_CLUSTERS.map((rose, i) => (
        <Bloom key={`r${i}`} x={rose.x} y={rose.y} rotate={rose.spin} delay={rose.delay}>
          <use href={`#rose-${rose.color}`} x={-rose.size / 2} y={-rose.size / 2} width={rose.size} height={rose.size} />
        </Bloom>
      ))}
    </svg>
  );
}

// A row of palace arches used where a dark section meets the paper.
export function ArchEdge({ className = '', direction = 'up' }) {
  const id = `arches-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg
      className={`block h-9 w-full sm:h-11 ${direction === 'down' ? 'rotate-180' : ''} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={id} width="56" height="44" patternUnits="userSpaceOnUse" y="0">
          <path d="M0 44 V28 C0 17 10 9.5 20 6.5 C24 5.3 27 2.8 28 0 C29 2.8 32 5.3 36 6.5 C46 9.5 56 17 56 28 V44 Z" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function Seal({ names, className = 'h-24 w-24', textClassName = 'text-[1.75rem]' }) {
  return (
    <span
      className={`relative grid place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7eedb_0%,#cfa75e_40%,#9a7330_100%)] text-forest-900 shadow-[0_16px_34px_-12px_rgba(0,0,0,0.5),inset_0_2px_6px_rgba(255,255,255,0.6),inset_0_-6px_12px_rgba(125,92,36,0.6)] ${className}`}
    >
      <span className="absolute inset-[7%] rounded-full border border-forest-900/25" />
      <span className="absolute inset-[12%] rounded-full border border-dashed border-forest-900/20" />
      <Monogram names={names || 'S & A'} className={textClassName} heartClassName="text-forest-800" />
    </span>
  );
}

const PETAL = 'M0 -9 C 5 -5, 5 4, 0 9 C -5 4, -5 -5, 0 -9 Z';
const PETAL_FILLS = ['url(#petal-rose)', 'url(#petal-ivory)', 'url(#petal-gold)', 'url(#petal-rose)'];

// Rose and jasmine petals thrown outward from the centre as the invitation doors open.
export function PetalBurst({ play, count = 36 }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.14;
        const distance = 170 + ((i * 53) % 7) * 46;
        return (
          <motion.svg
            key={i}
            viewBox="-6 -10 12 20"
            className="absolute -ml-2 -mt-3 h-6 w-4"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
            animate={
              play
                ? {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance + 160,
                    opacity: [0, 1, 1, 0],
                    scale: 0.8 + (i % 4) * 0.2,
                    rotate: ((i * 97) % 540) - 270,
                  }
                : {}
            }
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 + (i % 5) * 0.025 }}
          >
            <path d={PETAL} fill={PETAL_FILLS[i % PETAL_FILLS.length]} />
          </motion.svg>
        );
      })}
    </div>
  );
}

// A signature that appears as if being written, left to right.
export function Signature({ text, className = '' }) {
  return (
    <motion.span
      className={`-mx-8 inline-block px-8 py-3 font-signature leading-none ${className}`}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, amount: 0.9 }}
      transition={{ duration: 2.6, ease: [0.45, 0, 0.25, 1], delay: 0.35 }}
    >
      {text}
    </motion.span>
  );
}

// ---- Toran: strings of jasmine buds with a rose here and there, each ending in a small gold bell.
const STRAND_PATTERN = [6, 4, 5, 3, 5, 4, 6, 4, 5, 3, 5, 4, 6];
const BUD_GAP = 20;

function Strand({ length, index }) {
  const height = length * BUD_GAP + 30;
  return (
    <svg
      viewBox={`0 0 26 ${height}`}
      width="26"
      height={height}
      className="shrink-0 origin-top animate-sway [animation-play-state:var(--play,running)]"
      style={{ animationDelay: `${-index * 0.45}s`, animationDuration: `${4.5 + (index % 3) * 0.7}s` }}
      aria-hidden="true"
    >
      <line x1="13" y1="0" x2="13" y2={length * BUD_GAP + 6} stroke="#b8935a" strokeWidth="0.8" />
      {Array.from({ length }, (_, k) => {
        const y = 12 + k * BUD_GAP;
        const rose = k === length - 1 || k === 2;
        return rose ? (
          <use key={k} href={`#rose-${(index + k) % 2 ? 'ivory' : 'blush'}`} x="0" y={y - 13} width="26" height="26" />
        ) : (
          <use key={k} href="#jasmine-bud" x="7" y={y - 10} width="12" height="20" />
        );
      })}
      <path d={`M13 ${length * BUD_GAP + 10} l-4.5 8 a4.5 4.5 0 0 0 9 0z`} fill="#cfa75e" stroke="#9a7330" strokeWidth="0.7" />
    </svg>
  );
}

export function Toran({ className = '' }) {
  const id = `toran-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [ref, play] = usePlayWhenVisible();
  return (
    <div ref={ref} style={play} className={`pointer-events-none relative w-full ${className}`} aria-hidden="true">
      <div className="relative h-3 w-full bg-[linear-gradient(180deg,#b8935a,#e2c78f_45%,#9a7330)] shadow-[0_2px_6px_rgba(0,0,0,0.12)]" />
      <svg className="absolute left-0 top-1.5 h-8 w-full" aria-hidden="true">
        <defs>
          <pattern id={id} width="26" height="30" patternUnits="userSpaceOnUse">
            <use href="#sage-leaf" x="7" y="0" width="12" height="26" />
          </pattern>
        </defs>
        <rect width="100%" height="30" fill={`url(#${id})`} />
      </svg>
      <div className="mx-auto flex max-w-7xl justify-between px-3 sm:px-8">
        {STRAND_PATTERN.map((length, i) => (
          <div key={i} className={i % 2 === 1 ? 'hidden sm:block' : ''}>
            <Strand length={length} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

const SPARKLE_PATH = 'M0 -10 C1.2 -2.4 2.4 -1.2 10 0 C2.4 1.2 1.2 2.4 0 10 C-1.2 2.4 -2.4 1.2 -10 0 C-2.4 -1.2 -1.2 -2.4 0 -10Z';

export function Sparkle({ className = '', style }) {
  return (
    <svg viewBox="-10 -10 20 20" className={className} style={style} aria-hidden="true">
      <path d={SPARKLE_PATH} fill="currentColor" />
    </svg>
  );
}

// Deterministic scatter (no Math.random) so the layout is stable between renders.
export function Sparkles({ count = 16, className = 'text-gold-200' }) {
  const [ref, play] = usePlayWhenVisible();
  return (
    <div ref={ref} style={play} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const size = 6 + ((i * 7) % 4) * 3;
        return (
          <Sparkle
            key={i}
            className={`absolute animate-twinkle [animation-play-state:var(--play,running)] ${i % 4 === 0 ? 'text-magenta-300' : className}`}
            style={{
              left: `${(i * 37) % 96}%`,
              top: `${(i * 53) % 70}%`,
              width: size,
              height: size,
              animationDelay: `${(i * 0.37) % 3}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// Soft petals drifting in the Haldi windows.
export function DriftingPetals({ count = 12 }) {
  const [ref, play] = usePlayWhenVisible();
  return (
    <div ref={ref} style={play} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          viewBox="-6 -10 12 20"
          className="absolute animate-float [animation-play-state:var(--play,running)]"
          style={{
            left: `${(i * 41) % 94}%`,
            top: `${(i * 29) % 62}%`,
            width: 9 + (i % 3) * 3,
            rotate: `${(i * 47) % 360}deg`,
            animationDelay: `${-(i * 0.8)}s`,
            animationDuration: `${6 + (i % 4)}s`,
          }}
        >
          <path d={PETAL} fill={['#fffaf1', '#f7e3b0', '#fbe3db', '#efdfba'][i % 4]} opacity="0.9" />
        </svg>
      ))}
    </div>
  );
}

// A small pressed rose with jasmine and leaves, tucked into a corner of the letter.
export function PressedRose({ className = '' }) {
  return (
    <svg viewBox="-40 -40 80 80" className={className} aria-hidden="true">
      <use href="#sage-leaf" x="-6" y="-2" width="12" height="28" transform="rotate(-55)" />
      <use href="#sage-leaf" x="-5" y="-2" width="11" height="26" transform="rotate(38)" />
      <use href="#gold-leaf" x="-4" y="-2" width="9" height="20" transform="rotate(150)" />
      <use href="#rose-blush" x="-18" y="-18" width="36" height="36" />
      <use href="#jasmine" x="6" y="-27" width="20" height="20" />
    </svg>
  );
}

export function CornerFlourish({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M4 76 V30 C4 14 14 4 30 4 H76" />
        <path d="M12 76 V34 C12 22 22 12 34 12 H76" opacity="0.6" />
        <path d="M22 40 C22 30 30 22 40 22" />
      </g>
      <circle cx="30" cy="30" r="3" fill="currentColor" />
      <path
        d="M30 30 C 36 22, 46 20, 52 22 C 46 26, 38 30, 30 30 Z M30 30 C 22 36, 20 46, 22 52 C 26 46, 30 38, 30 30 Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}
