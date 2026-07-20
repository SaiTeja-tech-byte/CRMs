const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

router.use(requireAuth);
router.get("/stats", getDashboardStats);

module.exports = router;
