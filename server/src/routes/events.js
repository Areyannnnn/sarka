import { Router } from 'express';
import Event from '../models/Event.js';
import Comment from '../models/Comment.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ sortIndex: 1, date: 1 });
  res.json(events);
}));

router.post('/', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
  const event = await Event.create(data);
  res.status(201).json(event);
}));

router.put('/:id', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
  const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json(event);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ eventId: req.params.id });
  res.json({ ok: true });
}));

export default router;
