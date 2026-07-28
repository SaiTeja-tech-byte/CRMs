const Feedback = require("../models/Feedback");
const User = require("../models/User");
const { Op } = require("sequelize");

// Submit feedback (by any user, admin or employee)
exports.submitFeedback = async (req, res) => {
  try {
    const { feedbackType, chatType, reason, comments, deletedByRole, rating, conversationId } = req.body;
    const submittedBy = req.user.id;

    if (!feedbackType) {
      return res.status(400).json({ success: false, message: "Feedback type is required" });
    }

    const newFeedback = await Feedback.create({
      feedbackType,
      chatType,
      reason,
      comments,
      deletedByRole,
      rating,
      conversationId,
      submittedBy,
    });

    res.status(201).json({ success: true, feedback: newFeedback });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all feedback (Admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [
        {
          model: User,
          as: "submitter",
          attributes: ["id", "fullName", "email", "employeeId", "role", "avatarUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update feedback status (Admin only)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (status && !["New", "Reviewed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    if (status) feedback.status = status;
    if (adminNote !== undefined) feedback.adminNote = adminNote;
    
    await feedback.save();

    res.status(200).json({ success: true, feedback });
  } catch (err) {
    console.error("Error updating feedback status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
