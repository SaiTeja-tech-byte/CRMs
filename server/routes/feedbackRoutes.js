const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  updateFeedbackStatus,
} = require("../controllers/feedbackController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Any authenticated user can submit feedback
router.post("/", protect, submitFeedback);

// Only admins can view and manage feedback
router.get("/", protect, adminOnly, getAllFeedback);
router.patch("/:id/status", protect, adminOnly, updateFeedbackStatus);

module.exports = router;
