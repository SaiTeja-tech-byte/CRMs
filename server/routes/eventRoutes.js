const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController");

router.use(requireAuth);
router.get("/", getEvents);
router.post("/", createEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
