const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  createLeaveRequest,
  getMyLeaveRequests,
  getMyLeaveBalance,
  getAllLeaveRequests,
  updateLeaveRequestStatus,
} = require("../controllers/leaveController");

router.use(requireAuth);

// Employee: submit a request, view own requests/balance.
router.post("/", createLeaveRequest);
router.get("/mine", getMyLeaveRequests);
router.get("/balance", getMyLeaveBalance);

// Admin: see every request, approve/reject.
router.get("/", requireAdmin, getAllLeaveRequests);
router.patch("/:id", requireAdmin, updateLeaveRequestStatus);

module.exports = router;
