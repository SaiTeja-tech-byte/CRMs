const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  submitQuery,
  getQueries,
  getUnreadCount,
  markQueryRead,
  assignQuery,
  replyToQuery,
  closeQuery,
} = require("../controllers/contactController");

// Public - no login required, this is the landing page "Get in Touch" form
router.post("/", submitQuery);

// Everything below is admin-only
router.get("/", requireAuth, requireAdmin, getQueries);
router.get("/unread-count", requireAuth, requireAdmin, getUnreadCount);
router.patch("/:id/read", requireAuth, requireAdmin, markQueryRead);
router.patch("/:id/assign", requireAuth, requireAdmin, assignQuery);
router.patch("/:id/reply", requireAuth, requireAdmin, replyToQuery);
router.patch("/:id/close", requireAuth, requireAdmin, closeQuery);

module.exports = router;
