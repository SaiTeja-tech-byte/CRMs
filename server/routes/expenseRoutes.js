const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  createExpense,
  getMyExpenses,
  getAllExpenses,
  getExpenseById,
  updateExpenseStatus,
} = require("../controllers/expenseController");

router.use(requireAuth);


router.post("/", createExpense);
router.get("/mine", getMyExpenses);


router.get("/", requireAdmin, getAllExpenses);

router.get("/:id", getExpenseById);


router.patch("/:id", updateExpenseStatus);

module.exports = router;
