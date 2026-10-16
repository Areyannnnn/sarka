import { useState } from 'react';
import AdminSettings from './AdminSettings';
import AdminEvents from './AdminEvents';
import AdminRsvps from './AdminRsvps';
import AdminComments from './AdminComments';

const TABS = [
  { id: 'settings', label: 'Site Settings' },
  { id: 'events', label: 'Events' },
  { id: 'rsvps', label: 'RSVPs' },
  { id: 'comments', label: 'Comments' },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('settings');

  return (
    <div className="min-h-screen bg-gray-100 font-normal text-gray-900">
      <header className="bg-forest-900 text-ivory-50 px-6 py-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Wedding Admin Dashboard</h1>
        <a href="/" target="_blank" rel="noreferrer" className="text-sm text-gold-200 underline underline-offset-4">
          View site ↗
        </a>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <nav className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="bg-white rounded-xl shadow p-6">
          {tab === 'settings' && <AdminSettings />}
          {tab === 'events' && <AdminEvents />}
          {tab === 'rsvps' && <AdminRsvps />}
          {tab === 'comments' && <AdminComments />}
        </div>
      </div>
    </div>
  );
}
