const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { tapIn, tapOut, getMyTodayAttendance, getAllAttendance, getMyHistory } = require("../controllers/attendanceController");

router.use(requireAuth);

router.post("/tap-in", tapIn);
router.put("/tap-out", tapOut); // Changed to PUT to match frontend service
router.get("/today", getMyTodayAttendance);
router.get("/history", getMyHistory);

router.get("/all", requireAdmin, getAllAttendance); // Changed from "/" to "/all" to match frontend service

module.exports = router;
