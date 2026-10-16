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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedding';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
