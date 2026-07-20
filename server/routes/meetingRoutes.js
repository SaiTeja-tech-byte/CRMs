const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getMeetings, createMeeting, updateMeeting } = require("../controllers/meetingController");

router.use(requireAuth);
router.get("/", getMeetings);
router.post("/", createMeeting);
router.patch("/:id", updateMeeting);

module.exports = router;
