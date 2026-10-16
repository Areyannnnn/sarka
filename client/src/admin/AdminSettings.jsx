import { useEffect, useState } from 'react';
import { getSettings, updateSettings, uploadHeroImage, uploadMapFile } from '../lib/api';

const FIELDS = [
  { key: 'coupleNames', label: 'Couple Names', type: 'text' },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'weddingDate', label: 'Countdown To (your local date & time)', type: 'datetime-local' },
  { key: 'rsvpDeadline', label: 'RSVP Deadline', type: 'date' },
  { key: 'venueName', label: 'Venue Name', type: 'text' },
  { key: 'venueAddress', label: 'Venue Address', type: 'text' },
  { key: 'lat', label: 'Venue Latitude', type: 'number' },
  { key: 'lng', label: 'Venue Longitude', type: 'number' },
  { key: 'contactInfo', label: 'Contact Info', type: 'text' },
];

function toInputValue(type, value) {
  if (value === null || value === undefined || value === '') return '';
  if (type === 'date') return new Date(value).toISOString().slice(0, 10);
  if (type === 'datetime-local') {
    const d = new Date(value);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  return value;
}

// datetime-local values have no zone; convert here so the server doesn't read them in its own zone.
const fromInputValue = (type, value) => (type === 'datetime-local' && value ? new Date(value).toISOString() : value);

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  if (!settings) return <p>Loading...</p>;

  const update = (field) => (e) =>
    setSettings((s) => ({ ...s, [field.key]: fromInputValue(field.type, e.target.value) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await updateSettings(settings);
      setSettings(saved);
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const saved = await uploadHeroImage(file);
    setSettings(saved);
  };

  const handleMapUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const saved = await uploadMapFile(file);
    setSettings(saved);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-2xl">
      <h2 className="text-lg font-semibold mb-2">Site Settings</h2>

      {FIELDS.map((f) => (
        <label key={f.key} className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">{f.label}</span>
          <input
            type={f.type}
            step={f.type === 'number' ? 'any' : undefined}
            value={toInputValue(f.type, settings[f.key])}
            onChange={update(f)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </label>
      ))}

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">
          Welcome Letter (shown under the hero, signed with the couple's names; leave a blank line between paragraphs)
        </span>
        <textarea
          rows={7}
          value={settings.welcomeNote ?? ''}
          onChange={update({ key: 'welcomeNote', type: 'text' })}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Our Story (introduction above the timeline)</span>
        <textarea
          rows={5}
          value={settings.story ?? ''}
          onChange={update({ key: 'story', type: 'text' })}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Hero Image (shown in the arch)</span>
          <input type="file" accept="image/*" onChange={handleHeroUpload} />
          {settings.heroImageUrl && (
            <img src={settings.heroImageUrl} alt="Hero" className="mt-2 h-24 rounded-lg object-cover" />
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Downloadable Map (image/PDF)</span>
          <input type="file" accept="image/*,application/pdf" onChange={handleMapUpload} />
          {settings.mapFileUrl && (
            <a href={settings.mapFileUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 mt-2 underline">
              View current map file
            </a>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="self-start mt-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
      {savedAt && <p className="text-xs text-green-600">Saved at {savedAt.toLocaleTimeString()}</p>}
    </form>
  );
}
