const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { listTeam } = require("../controllers/teamController");

router.get("/", requireAuth, listTeam);

module.exports = router;
