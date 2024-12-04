export default function securityMiddleware(req, res, next) {
  // Set X-Frame-Options header to prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  next();
}
