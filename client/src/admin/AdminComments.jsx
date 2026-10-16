import { useEffect, useState } from 'react';
import { getEvents, getComments, deleteComment } from '../lib/api';

export default function AdminComments() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const load = async () => {
    if (selectedEvent === 'all') {
      const all = await Promise.all(events.map((e) => getComments(e._id)));
      setComments(
        all.flatMap((list, i) => list.map((c) => ({ ...c, eventTitle: events[i].title })))
      );
    } else {
      const list = await getComments(selectedEvent);
      const eventTitle = events.find((e) => e._id === selectedEvent)?.title;
      setComments(list.map((c) => ({ ...c, eventTitle })));
    }
  };

  useEffect(() => {
    if (events.length) load();
  }, [events, selectedEvent]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return;
    await deleteComment(id);
    await load();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Comments &amp; Suggestions</h2>

      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-4"
      >
        <option value="all">All Events</option>
        {events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.title}
          </option>
        ))}
      </select>

      <ul className="flex flex-col gap-2">
        {comments.map((c) => (
          <li key={c._id} className="border rounded-lg p-3 flex justify-between items-start gap-4">
            <div>
              <p className="text-xs text-gray-500">{c.eventTitle}</p>
              <p className="font-medium">{c.guestName}</p>
              <p className="text-sm">{c.message}</p>
            </div>
            <button onClick={() => handleDelete(c._id)} className="text-xs text-red-600 underline whitespace-nowrap">
              Delete
            </button>
          </li>
        ))}
        {comments.length === 0 && <p className="text-sm text-gray-400 italic">No comments yet.</p>}
      </ul>
    </div>
  );
}
