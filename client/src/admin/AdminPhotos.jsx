import { useEffect, useState } from 'react';
import { getPhotos, uploadPhoto, deletePhoto } from '../lib/api';

export default function AdminPhotos() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => getPhotos().then(setPhotos);

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      await uploadPhoto(file, caption);
      setFile(null);
      setCaption('');
      e.target.reset();
      await load();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    await deletePhoto(id);
    await load();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Gallery Photos</h2>

      <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-3 mb-6">
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          Photo
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          Caption (optional)
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={uploading}
          className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {photos.map((p) => (
          <div key={p._id} className="relative group">
            <img src={p.url} alt={p.caption} className="w-full h-28 object-cover rounded-lg" />
            <button
              onClick={() => handleDelete(p._id)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
        {photos.length === 0 && <p className="text-sm text-gray-400 italic">No photos yet.</p>}
      </div>
    </div>
  );
}
