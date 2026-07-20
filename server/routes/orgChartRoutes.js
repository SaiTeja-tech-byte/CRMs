const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { getOrgChart, createNode, updateNode, deleteNode } = require("../controllers/orgChartController");

router.use(requireAuth);

// Any logged-in user (employee or admin) can view the chart.
router.get("/", getOrgChart);

// Only admins can add, edit, move, or remove nodes.
router.post("/", requireAdmin, createNode);
router.patch("/:id", requireAdmin, updateNode);
router.delete("/:id", requireAdmin, deleteNode);

module.exports = router;
