import { Router } from 'express';
import Rsvp from '../models/Rsvp.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// The guest list (names, emails, phones) is admin-only; guests can only submit.
router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const rsvps = await Rsvp.find().sort({ createdAt: -1 });
  const attending = rsvps.filter((r) => r.attending === 'yes');
  const totalGuests = attending.reduce((sum, r) => sum + (r.numberOfGuests || 0), 0);
  const transportGuests = attending
    .filter((r) => r.needsTransport === 'yes')
    .reduce((sum, r) => sum + (r.numberOfGuests || 0), 0);
  res.json({
    rsvps,
    totalGuests,
    transportGuests,
    attendingCount: attending.length,
    totalResponses: rsvps.length,
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const rsvp = await Rsvp.create(req.body);
  res.status(201).json(rsvp);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await Rsvp.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

export default router;
