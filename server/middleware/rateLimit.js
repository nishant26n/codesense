const db = require("../db/database");

const FREE_DAILY_LIMIT = 5;

module.exports = function rateLimitMiddleware(req, res, next) {
  const userId = req.user.id;
  const tier = req.user.tier;

  // Pro users have unlimited access
  if (tier === "pro") {
    return next();
  }

  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  // Get or create usage record for today
  const existing = db
    .prepare("SELECT * FROM usage WHERE user_id = ?")
    .get(userId);

  if (!existing) {
    // First review ever
    db.prepare(
      "INSERT INTO usage (user_id, day, review_count) VALUES (?, ?, 1)",
    ).run(userId, today);
    return next();
  }

  if (existing.day !== today) {
    // New day — reset counter
    db.prepare(
      "UPDATE usage SET day = ?, review_count = 1 WHERE user_id = ?",
    ).run(today, userId);
    return next();
  }

  if (existing.review_count >= FREE_DAILY_LIMIT) {
    return res.status(429).json({
      error: `Daily limit reached. Free accounts are limited to ${FREE_DAILY_LIMIT} reviews per day.`,
      limit: FREE_DAILY_LIMIT,
      used: existing.review_count,
      upgradeRequired: true,
    });
  }

  // Increment counter and continue
  db.prepare(
    "UPDATE usage SET review_count = review_count + 1 WHERE user_id = ?",
  ).run(userId);

  next();
};
