const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const rateLimitMiddleware = require('../middleware/rateLimit');
const { analyzeCode } = require('../services/openai');

const router = express.Router();

// POST /api/review — Submit code for analysis
router.post('/', authMiddleware, rateLimitMiddleware, async (req, res) => {
  try {
    const { code, language = 'auto' } = req.body;

    if (!code || code.trim().length === 0) {
      return res.status(400).json({ error: 'Code is required.' });
    }

    if (code.length > 10000) {
      return res.status(400).json({ error: 'Code must be under 10,000 characters.' });
    }

    // Call OpenAI
    const feedback = await analyzeCode(code, language);

    // Persist to DB
    const result = db
      .prepare(
        'INSERT INTO reviews (user_id, language, code_snippet, ai_feedback, score) VALUES (?, ?, ?, ?, ?)'
      )
      .run(
        req.user.id,
        feedback.language || language,
        code,
        JSON.stringify(feedback),
        feedback.score || null
      );

    // Return today's usage info
    const today = new Date().toISOString().slice(0, 10);
    const usage = db.prepare('SELECT * FROM usage WHERE user_id = ?').get(req.user.id);
    const usedToday = usage && usage.day === today ? usage.review_count : 0;

    return res.json({
      reviewId: result.lastInsertRowid,
      feedback,
      usedToday,
      dailyLimit: req.user.tier === 'pro' ? null : 5,
    });
  } catch (err) {
    console.error('Review error:', err);

    // JSON parse error from OpenAI response
    if (err instanceof SyntaxError) {
      return res.status(502).json({ error: 'AI returned an unexpected response. Please try again.' });
    }

    // OpenAI API error
    if (err?.status === 401) {
      return res.status(500).json({ error: 'OpenAI API key is invalid. Please check server configuration.' });
    }

    return res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

// GET /api/review/history — Get user's review history
router.get('/history', authMiddleware, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const offset = (page - 1) * limit;

    const reviews = db
      .prepare(
        `SELECT id, language, code_snippet, ai_feedback, score, created_at
         FROM reviews WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
      .all(req.user.id, limit, offset);

    const total = db
      .prepare('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?')
      .get(req.user.id).count;

    return res.json({
      reviews: reviews.map((r) => ({
        ...r,
        ai_feedback: JSON.parse(r.ai_feedback),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('History error:', err);
    return res.status(500).json({ error: 'Failed to load history.' });
  }
});

// GET /api/review/:id — Get a single review
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const review = db
      .prepare(
        'SELECT * FROM reviews WHERE id = ? AND user_id = ?'
      )
      .get(req.params.id, req.user.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    return res.json({
      ...review,
      ai_feedback: JSON.parse(review.ai_feedback),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load review.' });
  }
});

module.exports = router;
