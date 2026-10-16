import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiCheckLight,
  PiEnvelopeSimpleLight,
  PiHeartLight,
  PiMinusLight,
  PiPlusLight,
} from 'react-icons/pi';
import { CornerFlourish, Heart, Seal, SectionHeading } from './Ornaments';
import { createRsvp } from '../lib/api';
import { firstName, formatDay } from '../lib/format';

const EASE = [0.22, 1, 0.36, 1];
const MAX_GUESTS = 10;

const initialForm = {
  guestName: '',
  email: '',
  phone: '',
  attending: '',
  numberOfGuests: 1,
  events: null, // null until the guest changes it: every celebration is selected by default
  needsTransport: '',
  message: '',
};

const inputClass =
  'mt-2 block w-full rounded-none border-0 border-b border-gold-300 bg-transparent px-0 py-2 font-display text-[1.35rem] text-ink-900 placeholder:text-ink-400/50 transition-[border-color,box-shadow] focus:border-forest-700 focus:shadow-[0_1px_0_0_var(--color-forest-700)] focus:outline-none focus-visible:outline-none';

function Label({ children, optional }) {
  return (
    <span className="eyebrow text-[0.6rem] text-ink-500">
      {children}
      {optional && <span className="ml-1 normal-case tracking-normal text-ink-400">(optional)</span>}
    </span>
  );
}

function ChoiceCard({ name, value, checked, onChange, icon: Icon, children }) {
  return (
    <label
      className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-center transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500 ${
        checked
          ? 'border-forest-800 bg-forest-800 text-ivory-50 shadow-[0_18px_30px_-18px_rgba(19,58,43,0.9)]'
          : 'border-gold-300 bg-white/50 text-ink-700 hover:border-forest-600'
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {Icon && <Icon className={`text-2xl ${checked ? 'text-gold-200' : 'text-gold-600'}`} />}
      <span className="font-display text-xl leading-tight">{children}</span>
    </label>
  );
}

const PETAL_COLORS = ['#df8f84', '#cfa75e', '#fffaf1', '#2f7254', '#eab2a6'];

function Burst() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-14" aria-hidden="true">
      {Array.from({ length: 26 }, (_, i) => {
        const angle = (i / 26) * Math.PI * 2;
        const distance = 90 + (i % 5) * 26;
        return (
          <motion.span
            key={i}
            className="absolute h-3 w-2 rounded-full"
            style={{ background: PETAL_COLORS[i % PETAL_COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.3, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance + 70,
              opacity: 0,
              scale: 1.1,
              rotate: (i * 67) % 360,
            }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          />
        );
      })}
    </div>
  );
}

export default function RsvpForm({ events, settings }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  const titles = events.map((e) => e.title);
  const selectedEvents = form.events ?? titles;
  const attending = form.attending === 'yes';
  const deadline = settings?.rsvpDeadline && formatDay(settings.rsvpDeadline, { day: 'numeric', month: 'long' });

  const set = (key, value) => {
    setError('');
    setForm((f) => ({ ...f, [key]: value }));
  };
  const update = (key) => (e) => set(key, e.target.value);

  const toggleEvent = (title) =>
    set(
      'events',
      selectedEvents.includes(title) ? selectedEvents.filter((t) => t !== title) : [...selectedEvents, title]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.attending) return setError('Please let us know whether you can join us.');
    if (attending && titles.length && selectedEvents.length === 0) {
      return setError('Please choose at least one celebration.');
    }
    if (attending && !form.needsTransport) return setError('Please tell us whether you need the return transfer.');

    setSubmitting(true);
    try {
      await createRsvp({
        guestName: form.guestName,
        email: form.email,
        phone: form.phone,
        attending: form.attending,
        numberOfGuests: attending ? Number(form.numberOfGuests) : 0,
        events: attending ? selectedEvents : [],
        needsTransport: attending ? form.needsTransport : '',
        message: form.message,
      });
      setDone({ name: firstName(form.guestName), attending });
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong while sending your RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative isolate overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(244,211,201,0.55),transparent_70%),radial-gradient(50%_40%_at_80%_90%,rgba(226,242,241,0.7),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative rounded-[2.25rem] bg-ivory-50 p-2 shadow-lift"
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 160, damping: 13, delay: 0.3 }}
            className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <Seal names={settings?.coupleNames} className="h-20 w-20 sm:h-24 sm:w-24" textClassName="text-[1.35rem] sm:text-[1.6rem]" />
          </motion.div>
          <div className="relative rounded-[1.9rem] border border-gold-300/80 px-5 pb-12 pt-16 sm:px-12 sm:pb-16 sm:pt-20">
            <CornerFlourish className="absolute left-3 top-3 h-14 w-14 text-gold-400" />
            <CornerFlourish className="absolute right-3 top-3 h-14 w-14 -scale-x-100 text-gold-400" />
            <CornerFlourish className="absolute bottom-3 left-3 h-14 w-14 -scale-y-100 text-gold-400" />
            <CornerFlourish className="absolute bottom-3 right-3 h-14 w-14 -scale-100 text-gold-400" />

            <SectionHeading
              className="px-0!"
              kicker="Kindly respond"
              title="Will you *join* us?"
              lede={`${deadline ? `Please respond by ${deadline}. ` : ''}We cannot wait to celebrate with you.`}
            />

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="relative mt-12 text-center"
                  role="status"
                >
                  {done.attending && <Burst />}
                  <motion.div
                    initial={{ scale: 0, rotate: -25 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 12, delay: 0.1 }}
                    className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-forest-800 text-gold-200"
                  >
                    <Heart className="h-9 w-9" />
                  </motion.div>
                  <p className="mt-8 font-display text-4xl font-light text-ink-900 sm:text-5xl">
                    Thank you{done.name ? `, ${done.name}` : ''}!
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-[1.05rem] leading-8 text-ink-500">
                    {done.attending
                      ? 'Your RSVP is in. We can’t wait to celebrate with you.'
                      : 'We’ll miss you, and we’re so grateful you let us know.'}
                  </p>
                  <button
                    onClick={() => setDone(null)}
                    className="mt-8 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-forest-800 underline decoration-gold-400 underline-offset-8 transition hover:text-forest-600"
                  >
                    Send another response
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="mt-12 space-y-9"
                >
                  <div className="grid gap-8 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <Label>Full name</Label>
                      <input required autoComplete="name" value={form.guestName} onChange={update('guestName')} className={inputClass} placeholder="Your name" />
                    </label>
                    <label className="block">
                      <Label>Email</Label>
                      <input required type="email" autoComplete="email" value={form.email} onChange={update('email')} className={inputClass} placeholder="you@example.com" />
                    </label>
                    <label className="block">
                      <Label optional>Phone</Label>
                      <input type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} className={inputClass} placeholder="+1 · +91" />
                    </label>
                  </div>

                  <fieldset>
                    <legend>
                      <Label>Will you be joining us?</Label>
                    </legend>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <ChoiceCard name="attending" value="yes" checked={form.attending === 'yes'} onChange={update('attending')} icon={PiHeartLight}>
                        Joyfully accepts
                      </ChoiceCard>
                      <ChoiceCard name="attending" value="no" checked={form.attending === 'no'} onChange={update('attending')} icon={PiEnvelopeSimpleLight}>
                        Regretfully declines
                      </ChoiceCard>
                    </div>
                  </fieldset>

                  <AnimatePresence initial={false}>
                    {attending && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-9 pt-1">
                          <div>
                            <Label>Number of guests</Label>
                            <div className="mt-3 flex items-center gap-4">
                              <div className="inline-flex items-center rounded-full border border-gold-300 bg-white/60">
                                <button
                                  type="button"
                                  onClick={() => set('numberOfGuests', Math.max(1, form.numberOfGuests - 1))}
                                  disabled={form.numberOfGuests <= 1}
                                  aria-label="Fewer guests"
                                  className="grid h-11 w-11 place-items-center rounded-full text-lg text-forest-800 transition hover:bg-forest-50 disabled:opacity-30"
                                >
                                  <PiMinusLight />
                                </button>
                                <output className="w-10 text-center font-display text-2xl tabular-nums text-ink-900" aria-live="polite">
                                  {form.numberOfGuests}
                                </output>
                                <button
                                  type="button"
                                  onClick={() => set('numberOfGuests', Math.min(MAX_GUESTS, form.numberOfGuests + 1))}
                                  disabled={form.numberOfGuests >= MAX_GUESTS}
                                  aria-label="More guests"
                                  className="grid h-11 w-11 place-items-center rounded-full text-lg text-forest-800 transition hover:bg-forest-50 disabled:opacity-30"
                                >
                                  <PiPlusLight />
                                </button>
                              </div>
                              <span className="text-sm text-ink-400">including you</span>
                            </div>
                          </div>

                          {titles.length > 0 && (
                            <fieldset>
                              <legend>
                                <Label>Celebrations you will attend</Label>
                              </legend>
                              <div className="mt-4 flex flex-wrap gap-2.5">
                                {titles.map((title) => {
                                  const on = selectedEvents.includes(title);
                                  return (
                                    <button
                                      type="button"
                                      key={title}
                                      aria-pressed={on}
                                      onClick={() => toggleEvent(title)}
                                      className={`inline-flex items-center gap-2.5 rounded-full border py-2 pl-2.5 pr-4 font-display text-lg transition ${
                                        on
                                          ? 'border-forest-800 bg-forest-800 text-ivory-50'
                                          : 'border-gold-300 bg-white/50 text-ink-700 hover:border-forest-600'
                                      }`}
                                    >
                                      <span
                                        className={`grid h-5 w-5 place-items-center rounded-full text-xs ${
                                          on ? 'bg-gold-300 text-forest-900' : 'border border-gold-400'
                                        }`}
                                      >
                                        {on && <PiCheckLight />}
                                      </span>
                                      {title}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          )}

                          <fieldset>
                            <legend className="max-w-md">
                              <Label>Will you need the arranged Mumbai to Daman return transport?</Label>
                            </legend>
                            <div className="mt-4 grid max-w-sm grid-cols-2 gap-3">
                              <ChoiceCard name="needsTransport" value="yes" checked={form.needsTransport === 'yes'} onChange={update('needsTransport')}>
                                Yes, please
                              </ChoiceCard>
                              <ChoiceCard name="needsTransport" value="no" checked={form.needsTransport === 'no'} onChange={update('needsTransport')}>
                                No, thanks
                              </ChoiceCard>
                            </div>
                          </fieldset>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <label className="block">
                    <Label optional>A note for the couple</Label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={update('message')}
                      maxLength={2000}
                      className={`${inputClass} resize-none text-[1.2rem]`}
                      placeholder="Wishes, dietary notes, a favourite song…"
                    />
                  </label>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                        className="rounded-xl bg-blush-100 px-4 py-3 text-center text-sm text-[#8a3a2c]"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-full bg-forest-800 px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-ivory-50 shadow-[0_18px_34px_-18px_rgba(19,58,43,0.9)] transition-colors hover:bg-forest-900 disabled:opacity-60"
                  >
                    {submitting ? 'Sending…' : 'Send RSVP'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
