const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  createRegularizationRequest,
  getMyRegularizationRequests,
  getMyAttendance,
  getAllRegularizationRequests,
  updateRegularizationStatus,
} = require("../controllers/plannerController");

router.use(requireAuth);


router.post("/request", createRegularizationRequest);
router.get("/mine", getMyRegularizationRequests);
router.get("/attendance", getMyAttendance);

// Admin: see every request, approve/reject.
router.get("/", requireAdmin, getAllRegularizationRequests);
router.patch("/:id", requireAdmin, updateRegularizationStatus);

module.exports = router;
