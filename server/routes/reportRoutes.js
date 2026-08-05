const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const {
  getAttendanceReport,
  getPayrollReport,
  getExpensesReport,
  getHelpCenterReport,
  getTasksReport
} = require("../controllers/reportController");

router.use(requireAuth);

router.get("/attendance", getAttendanceReport);
router.get("/payroll", getPayrollReport);
router.get("/expenses", getExpensesReport);
router.get("/help-center", getHelpCenterReport);
router.get("/tasks", getTasksReport);

module.exports = router;
