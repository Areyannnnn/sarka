import { Router } from 'express';
import {
  adminConfigured,
  clearFailures,
  issueToken,
  loginAttemptsAllowed,
  passwordMatches,
  recordFailure,
  requireAdmin,
} from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  if (!adminConfigured()) return res.status(503).json({ error: 'Admin password is not configured on the server' });
  if (!loginAttemptsAllowed(req.ip)) {
    return res.status(429).json({ error: 'Too many attempts. Please wait 15 minutes and try again.' });
  }
  if (!passwordMatches(req.body?.password)) {
    recordFailure(req.ip);
    return res.status(401).json({ error: 'That password is not right' });
  }
  clearFailures(req.ip);
  res.json(issueToken());
});

// Lets the dashboard check a saved token on load.
router.get('/session', requireAdmin, (req, res) => res.json({ ok: true }));

export default router;
