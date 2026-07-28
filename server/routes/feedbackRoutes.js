const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  updateFeedbackStatus,
} = require("../controllers/feedbackController");
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

// Any authenticated user can submit feedback
router.post("/", requireAuth, submitFeedback);

// Only admins can view and manage feedback
router.get("/", requireAuth, requireAdmin, getAllFeedback);
router.patch("/:id/status", requireAuth, requireAdmin, updateFeedbackStatus);

module.exports = router;
