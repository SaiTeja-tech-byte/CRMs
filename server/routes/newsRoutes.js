const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require("../controllers/announcementController");

// GET is open to any logged-in user; posting/deleting news is admin-only.
router.get("/", requireAuth, getAnnouncements);
router.post("/", requireAuth, requireAdmin, createAnnouncement);
router.delete("/:id", requireAuth, requireAdmin, deleteAnnouncement);

module.exports = router;
