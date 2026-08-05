const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getAttendanceReport } = require("../controllers/reportController");

router.use(requireAuth);

// Role-based inside the controller: employees get only their own rows,
// admins can pass ?employeeId=&name=&department=&from=&to=&format=csv
router.get("/attendance", getAttendanceReport);

module.exports = router;
