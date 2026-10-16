import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import settingsRouter from './routes/settings.js';
import eventsRouter from './routes/events.js';
import rsvpsRouter from './routes/rsvps.js';
import commentsRouter from './routes/comments.js';
import adminRouter from './routes/admin.js';
import { errorHandler } from './middleware/asyncHandler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
// Render (and most hosts) sit behind a proxy; this makes req.ip the visitor's address for the login limiter.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/settings', settingsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/rsvps', rsvpsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/admin', adminRouter);

// For uptime monitors: answers quickly and touches the database, which keeps both the free
// Render instance and the free Atlas cluster from going to sleep.
app.get('/api/health', async (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  let database = connected;
  if (connected) {
    try {
      await mongoose.connection.db.admin().ping();
    } catch {
      database = false;
    }
  }
  res.status(database ? 200 : 503).json({ ok: database, uptime: Math.round(process.uptime()) });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const KEEP_ALIVE_MINUTES = 10;

// With KEEP_ALIVE_URL set (e.g. https://sarka.onrender.com/api/health) the server pings its own
// public address every few minutes, so Render's free tier doesn't put it to sleep between
// visitors. A sleeping server can't wake itself, so an external monitor is the primary safeguard.
function keepAwake() {
  const url = process.env.KEEP_ALIVE_URL;
  if (!url) return;
  setInterval(() => {
    fetch(url).catch((err) => console.error('Keep-alive ping failed:', err.message));
  }, KEEP_ALIVE_MINUTES * 60 * 1000);
  console.log(`Keep-alive: pinging ${url} every ${KEEP_ALIVE_MINUTES} minutes`);
}
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedding';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    keepAwake();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
