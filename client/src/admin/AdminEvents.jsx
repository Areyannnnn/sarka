import { useEffect, useState } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../lib/api';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  theme: '',
  dressCode: '',
  wardrobe: '',
  sortIndex: 0,
};

const WARDROBES = [
  { value: '', label: 'No wardrobe planner' },
  { value: 'haldi', label: 'Haldi (yellow theme)' },
  { value: 'sangeet', label: 'Sangeet (midnight theme)' },
  { value: 'wedding', label: 'Baraat & Wedding (royal theme)' },
];

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => getEvents().then(setEvents);

  useEffect(() => {
    load();
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const startEdit = (event) => {
    setEditingId(event._id);
    setForm({
      title: event.title,
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 10) : '',
      time: event.time || '',
      location: event.location || '',
      theme: event.theme || '',
      dressCode: event.dressCode || '',
      wardrobe: event.wardrobe || '',
      sortIndex: event.sortIndex || 0,
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await updateEvent(editingId, data);
      } else {
        await createEvent(data);
      }
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event? This also removes its comments.')) return;
    await deleteEvent(id);
    await load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Event' : 'Add Event'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={update('title')}
            className="border rounded-lg px-3 py-2"
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={update('description')}
            className="border rounded-lg px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="date"
              value={form.date}
              onChange={update('date')}
              className="border rounded-lg px-3 py-2"
            />
            <input
              placeholder="Time (e.g. 6:00 PM)"
              value={form.time}
              onChange={update('time')}
              className="border rounded-lg px-3 py-2"
            />
          </div>
          <input
            placeholder="Location"
            value={form.location}
            onChange={update('location')}
            className="border rounded-lg px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Theme (e.g. Carnival)"
              value={form.theme}
              onChange={update('theme')}
              className="border rounded-lg px-3 py-2"
            />
            <select value={form.wardrobe} onChange={update('wardrobe')} className="border rounded-lg px-3 py-2">
              {WARDROBES.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
          <input
            placeholder="Dress code (e.g. Wear joyful shades of yellow.)"
            value={form.dressCode}
            onChange={update('dressCode')}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Sort order"
            value={form.sortIndex}
            onChange={update('sortIndex')}
            className="border rounded-lg px-3 py-2"
          />
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            Event Image
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Event' : 'Add Event'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg bg-gray-200 text-sm">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Events</h2>
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event._id} className="border rounded-lg p-3 flex gap-3 items-start">
              {event.imageUrl && (
                <img src={event.imageUrl} alt="" className="w-16 h-16 object-cover rounded-md" />
              )}
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(event.date).toLocaleDateString(undefined, { timeZone: 'UTC' })} {event.time}
                </p>
                {(event.theme || event.wardrobe) && (
                  <p className="text-xs text-gray-400">
                    {[event.theme, event.wardrobe && `wardrobe: ${event.wardrobe}`].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => startEdit(event)} className="text-xs text-blue-600 underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(event._id)} className="text-xs text-red-600 underline">
                  Delete
                </button>
              </div>
            </li>
          ))}
          {events.length === 0 && <p className="text-sm text-gray-400 italic">No events yet.</p>}
        </ul>
      </div>
    </div>
  );
}
