const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getNotifications, markNotificationRead } = require("../controllers/notificationController");

router.use(requireAuth);
router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);

module.exports = router;
