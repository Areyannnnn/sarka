import { useEffect, useMemo, useState } from 'react';
import { getRsvps, deleteRsvp } from '../lib/api';

// Quote every cell, and neutralise leading = + - @ so a guest's text can't run as a spreadsheet formula.
function csvCell(value) {
  const text = String(value ?? '');
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

function exportCsv(rsvps) {
  const header = ['Name', 'Email', 'Phone', 'Attending', 'Guests', 'Celebrations', 'Needs transport', 'Message', 'Received'];
  const rows = rsvps.map((r) => [
    r.guestName,
    r.email,
    r.phone,
    r.attending,
    r.attending === 'yes' ? r.numberOfGuests : 0,
    (r.events || []).join('; '),
    r.needsTransport,
    r.message,
    new Date(r.createdAt).toISOString(),
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Stat({ value, label }) {
  return (
    <div className="bg-gray-100 rounded-lg px-4 py-3 text-center min-w-28">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export default function AdminRsvps() {
  const [data, setData] = useState({
    rsvps: [],
    totalGuests: 0,
    transportGuests: 0,
    attendingCount: 0,
    totalResponses: 0,
  });

  const load = () => getRsvps().then(setData);

  useEffect(() => {
    load();
  }, []);

  const perEvent = useMemo(() => {
    const counts = {};
    data.rsvps
      .filter((r) => r.attending === 'yes')
      .forEach((r) => (r.events || []).forEach((title) => (counts[title] = (counts[title] || 0) + (r.numberOfGuests || 0))));
    return Object.entries(counts);
  }, [data.rsvps]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this RSVP?')) return;
    await deleteRsvp(id);
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">RSVPs</h2>
        <button
          onClick={() => exportCsv(data.rsvps)}
          disabled={!data.rsvps.length}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <Stat value={data.totalResponses} label="Total Responses" />
        <Stat value={data.attendingCount} label="Attending" />
        <Stat value={data.totalGuests} label="Total Guests" />
        <Stat value={data.transportGuests ?? 0} label="Guests Needing Transport" />
      </div>

      {perEvent.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {perEvent.map(([title, guests]) => (
            <span key={title} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              {title}: <strong>{guests}</strong> guests
            </span>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Attending</th>
              <th className="py-2 pr-4">Guests</th>
              <th className="py-2 pr-4">Celebrations</th>
              <th className="py-2 pr-4">Transport</th>
              <th className="py-2 pr-4">Message</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {data.rsvps.map((r) => (
              <tr key={r._id} className="border-b align-top">
                <td className="py-2 pr-4">{r.guestName}</td>
                <td className="py-2 pr-4">{r.email}</td>
                <td className="py-2 pr-4">{r.phone}</td>
                <td className="py-2 pr-4">{r.attending === 'yes' ? '✅' : '❌'}</td>
                <td className="py-2 pr-4">{r.attending === 'yes' ? r.numberOfGuests : '—'}</td>
                <td className="py-2 pr-4">{(r.events || []).join(', ') || '—'}</td>
                <td className="py-2 pr-4">{r.needsTransport === 'yes' ? 'Yes' : r.needsTransport === 'no' ? 'No' : '—'}</td>
                <td className="py-2 pr-4 max-w-xs truncate" title={r.message}>
                  {r.message}
                </td>
                <td className="py-2 pr-4">
                  <button onClick={() => handleDelete(r._id)} className="text-xs text-red-600 underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data.rsvps.length === 0 && (
              <tr>
                <td colSpan={9} className="py-4 text-center text-gray-400 italic">
                  No RSVPs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
