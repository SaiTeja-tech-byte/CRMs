const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { tapIn, tapOut, getMyTodayAttendance, getAllAttendance } = require("../controllers/attendanceController");

router.use(requireAuth);


router.post("/tap-in", tapIn);
router.post("/tap-out", tapOut);
router.get("/today", getMyTodayAttendance);


router.get("/", requireAdmin, getAllAttendance);

module.exports = router;
