import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiChatCircleTextLight } from 'react-icons/pi';
import { getComments, createComment } from '../lib/api';

const TONES = {
  light: {
    toggle: 'text-ink-500 hover:text-forest-800',
    bubble: 'bg-white/70 text-ink-700',
    name: 'text-forest-800',
    empty: 'text-ink-400',
    input:
      'border-black/10 bg-white/70 text-ink-900 placeholder:text-ink-400 focus:border-forest-600 focus:ring-forest-600/20',
    button: 'bg-forest-800 text-ivory-50 hover:bg-forest-900',
  },
  dark: {
    toggle: 'text-ivory-200/70 hover:text-ivory-50',
    bubble: 'bg-white/8 text-ivory-200/90',
    name: 'text-magenta-300',
    empty: 'text-ivory-200/50',
    input:
      'border-white/15 bg-white/5 text-ivory-50 placeholder:text-ivory-200/40 focus:border-magenta-400 focus:ring-magenta-400/20',
    button: 'bg-magenta-500 text-white hover:bg-magenta-600',
  },
};

export default function CommentSection({ eventId, tone = 'light' }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const t = TONES[tone];

  const loadComments = () => getComments(eventId).then(setComments);

  useEffect(() => {
    if (open) loadComments();
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await createComment({ eventId, guestName, message });
      setMessage('');
      await loadComments();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex w-full items-center justify-center gap-2 py-2 font-display text-lg italic transition-colors ${t.toggle}`}
        aria-expanded={open}
      >
        <PiChatCircleTextLight className="text-lg not-italic" />
        {open ? 'Close the notes' : `Leave a note for this celebration${comments.length ? ` (${comments.length})` : ''}`}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto overscroll-contain pr-1">
              {comments.map((c) => (
                <li key={c._id} className={`rounded-2xl px-4 py-2.5 text-left text-sm leading-6 ${t.bubble}`}>
                  <span className={`font-medium ${t.name}`}>{c.guestName}</span> · {c.message}
                </li>
              ))}
              {comments.length === 0 && (
                <li className={`text-center text-sm italic ${t.empty}`}>Be the first to leave a note!</li>
              )}
            </ul>

            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                maxLength={80}
                className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-4 ${t.input}`}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A song request, a wish, a question…"
                aria-label="Your note"
                rows={2}
                maxLength={600}
                className={`resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-4 ${t.input}`}
              />
              <button
                type="submit"
                disabled={submitting || !guestName.trim() || !message.trim()}
                className={`self-end rounded-full px-5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] transition disabled:opacity-40 ${t.button}`}
              >
                {submitting ? 'Posting…' : 'Post note'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
