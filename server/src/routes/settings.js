import { Router } from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

router.get('/', asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json(settings);
}));

router.put('/', asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
}));

router.post('/hero-image', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'A file is required' });
  const settings = await getOrCreateSettings();
  settings.heroImageUrl = `/uploads/${req.file.filename}`;
  await settings.save();
  res.json(settings);
}));

router.post('/map-file', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'A file is required' });
  const settings = await getOrCreateSettings();
  settings.mapFileUrl = `/uploads/${req.file.filename}`;
  await settings.save();
  res.json(settings);
}));

export default router;
