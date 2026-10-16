// Express 4 does not catch rejected promises from async handlers; without this, a single
// invalid request (e.g. an RSVP missing its name) becomes an unhandled rejection and kills the server.
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const CLIENT_ERRORS = new Set(['ValidationError', 'CastError', 'MulterError']);

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = CLIENT_ERRORS.has(err.name) ? 400 : err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Something went wrong' : err.message });
}
