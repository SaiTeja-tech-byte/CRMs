const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("admin"), payrollController.createPayroll);
router.get("/mine", protect, authorize("employee"), payrollController.getMyPayrolls);
router.get("/", protect, authorize("admin"), payrollController.getAllPayrolls);
router.patch("/:id", protect, authorize("admin"), payrollController.updatePayroll);

module.exports = router;