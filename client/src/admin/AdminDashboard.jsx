import { useEffect, useState } from 'react';
import AdminSettings from './AdminSettings';
import AdminEvents from './AdminEvents';
import AdminRsvps from './AdminRsvps';
import AdminComments from './AdminComments';
import { adminLogin, adminLogout, checkAdminSession, hasAdminSession } from '../lib/api';

const TABS = [
  { id: 'settings', label: 'Site Settings' },
  { id: 'events', label: 'Events' },
  { id: 'rsvps', label: 'RSVPs' },
  { id: 'comments', label: 'Comments' },
];

function SignIn({ onSignedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminLogin(password);
      onSignedIn();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-normal text-gray-900 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Wedding Admin</h1>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Password</span>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('settings');
  // 'checking' while a saved token is verified, then 'in' or 'out'.
  const [session, setSession] = useState(() => (hasAdminSession() ? 'checking' : 'out'));

  useEffect(() => {
    if (session === 'checking') {
      checkAdminSession()
        .then(() => setSession('in'))
        .catch(() => setSession('out'));
    }
  }, [session]);

  useEffect(() => {
    const signedOut = () => setSession('out');
    window.addEventListener('admin-signed-out', signedOut);
    return () => window.removeEventListener('admin-signed-out', signedOut);
  }, []);

  if (session === 'checking') return null;
  if (session === 'out') return <SignIn onSignedIn={() => setSession('in')} />;

  const signOut = () => {
    adminLogout();
    setSession('out');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-normal text-gray-900">
      <header className="bg-forest-900 text-ivory-50 px-6 py-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Wedding Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noreferrer" className="text-sm text-gold-200 underline underline-offset-4">
            View site ↗
          </a>
          <button onClick={signOut} className="text-sm text-ivory-50/80 hover:text-ivory-50">
            Sign out
          </button>
        </div>
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
