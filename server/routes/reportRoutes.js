const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getAttendanceReport } = require("../controllers/reportController");

router.use(requireAuth);


router.get("/attendance", getAttendanceReport);

module.exports = router;
