const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  createExpense,
  getMyExpenses,
  getAllExpenses,
  updateExpenseStatus,
} = require("../controllers/expenseController");

router.use(requireAuth);

// Employee: submit a request, view own requests.
router.post("/", createExpense);
router.get("/mine", getMyExpenses);

// Admin: see every request
router.get("/", requireAdmin, getAllExpenses);

// Both: Employee can withdraw (patch own to Withdrawn), Admin can Approve/Reject.
router.patch("/:id", updateExpenseStatus);

module.exports = router;
