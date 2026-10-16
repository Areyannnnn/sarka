import { ArchEdge, Laurel, Mandala, Monogram, Signature } from './Ornaments';
import { formatDayRange, venueCity } from '../lib/format';

export default function Footer({ settings, events = [] }) {
  const line = [venueCity(settings?.venueAddress), formatDayRange(events, settings?.weddingDate)]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <ArchEdge className="-mb-px text-forest-950" />
      <footer className="relative isolate overflow-hidden bg-forest-950 px-6 pb-14 pt-20 text-center text-ivory-200">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-jaali-light opacity-60" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(207,167,94,0.2),transparent_70%)]"
        />

        <div className="relative mx-auto w-fit">
          <Mandala className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[26rem] max-w-none -translate-x-1/2 -translate-y-1/2 text-gold-400/15" />
          <Laurel className="mx-auto h-8 w-44 text-gold-400/80" />
          {settings?.coupleNames && (
            <p className="mt-6 text-[clamp(3.6rem,10vw,6rem)] text-ivory-50">
              <Monogram names={settings.coupleNames} heartClassName="text-gold-400" beat />
            </p>
          )}
        </div>

        <p className="mt-10 font-display text-2xl italic text-ivory-200/80">with all our love,</p>
        {settings?.coupleNames && (
          <p className="mt-1">
            <Signature text={settings.coupleNames} className="text-[3.4rem] text-gold-200 sm:text-[4rem]" />
          </p>
        )}
        {line && <p className="eyebrow mt-6 text-gold-300/90">{line}</p>}
        {settings?.contactInfo && <p className="mt-6 text-ivory-200/70">{settings.contactInfo}</p>}

        <div className="mt-12">
          <a
            href="#hero"
            className="font-display text-lg italic text-ivory-100/80 underline decoration-gold-400/50 underline-offset-[6px] transition hover:text-ivory-50"
          >
            back to the beginning
          </a>
        </div>
      </footer>
    </>
  );
}
