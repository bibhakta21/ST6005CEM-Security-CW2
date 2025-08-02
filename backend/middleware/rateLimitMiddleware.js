const rateLimit = require("express-rate-limit");

// Limit login attempts= 15 requests per 15 minutes
exports.loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
