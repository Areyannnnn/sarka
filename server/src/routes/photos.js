import { Router } from 'express';
import Photo from '../models/Photo.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.json(photos);
}));

router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'An image file is required' });
  const photo = await Photo.create({
    url: `/uploads/${req.file.filename}`,
    caption: req.body.caption || '',
    category: req.body.category || 'gallery',
  });
  res.status(201).json(photo);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await Photo.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

export default router;
