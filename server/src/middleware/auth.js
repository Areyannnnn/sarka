import crypto from 'crypto';

// Admin access is a single shared password (ADMIN_PASSWORD). Logging in returns a signed token
// that expires after TOKEN_DAYS; the signing key is derived from the password, so changing the
// password signs everyone out.
const TOKEN_DAYS = 7;

const password = () => process.env.ADMIN_PASSWORD || '';
const signingKey = () => crypto.createHash('sha256').update(`wedding-admin:${password()}`).digest();
const sign = (payload) => crypto.createHmac('sha256', signingKey()).update(payload).digest('base64url');

// Hash both sides first so the comparison is constant-time regardless of length.
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export const adminConfigured = () => password().length > 0;

export const passwordMatches = (candidate) => adminConfigured() && safeEqual(String(candidate ?? ''), password());

export function issueToken() {
  const expires = String(Date.now() + TOKEN_DAYS * 24 * 60 * 60 * 1000);
  return { token: `${expires}.${sign(expires)}`, expires: Number(expires) };
}

function tokenValid(token) {
  const [expires, signature] = String(token || '').split('.');
  if (!expires || !signature || !adminConfigured()) return false;
  return safeEqual(signature, sign(expires)) && Number(expires) > Date.now();
}

// Fails closed: with no ADMIN_PASSWORD set, admin routes are refused rather than left open.
export function requireAdmin(req, res, next) {
  if (!adminConfigured()) return res.status(503).json({ error: 'Admin password is not configured on the server' });
  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!tokenValid(token)) return res.status(401).json({ error: 'Please sign in to the admin dashboard' });
  next();
}

// A small in-memory brake on password guessing: 10 failed attempts per IP per 15 minutes.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;
const failures = new Map();

export function loginAttemptsAllowed(ip) {
  const entry = failures.get(ip);
  if (!entry || Date.now() - entry.since > WINDOW_MS) return true;
  return entry.count < MAX_FAILURES;
}

export function recordFailure(ip) {
  const entry = failures.get(ip);
  if (!entry || Date.now() - entry.since > WINDOW_MS) failures.set(ip, { count: 1, since: Date.now() });
  else entry.count += 1;
}

export const clearFailures = (ip) => failures.delete(ip);
