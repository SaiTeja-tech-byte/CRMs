const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getMessages } = require("../controllers/messageController");

router.use(requireAuth);
router.get("/", getMessages);

module.exports = router;
