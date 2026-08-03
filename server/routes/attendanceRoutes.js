const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/auth");

router.post("/tap-in", protect, attendanceController.tapIn);
router.put("/tap-out", protect, attendanceController.tapOut);
router.get("/today", protect, attendanceController.getTodayAttendance);
router.get("/history", protect, attendanceController.getAttendanceHistory);
router.get("/all", protect, authorize("admin"), attendanceController.getAllAttendance);

module.exports = router;
