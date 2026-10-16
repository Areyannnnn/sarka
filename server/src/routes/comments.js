import { Router } from 'express';
import Comment from '../models/Comment.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const filter = req.query.eventId ? { eventId: req.query.eventId } : {};
  const comments = await Comment.find(filter).sort({ createdAt: -1 });
  res.json(comments);
}));

router.post('/', asyncHandler(async (req, res) => {
  const comment = await Comment.create(req.body);
  res.status(201).json(comment);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

export default router;
