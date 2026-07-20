const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getDeals, createDeal, updateDeal, deleteDeal } = require("../controllers/dealController");

router.use(requireAuth);
router.get("/", getDeals);
router.post("/", createDeal);
router.patch("/:id", updateDeal);
router.delete("/:id", deleteDeal);

module.exports = router;
