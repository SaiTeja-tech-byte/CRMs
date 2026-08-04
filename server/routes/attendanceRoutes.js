const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { tapIn, tapOut, takeBreak, resumeWork, getMyTodayAttendance, getAllAttendance, getMyHistory } = require("../controllers/attendanceController");

router.use(requireAuth);

router.post("/tap-in", tapIn);
router.put("/tap-out", tapOut);
router.put("/break", takeBreak);
router.put("/resume", resumeWork);
router.get("/today", getMyTodayAttendance);
router.get("/history", getMyHistory);

router.get("/all", requireAdmin, getAllAttendance); 

module.exports = router;
