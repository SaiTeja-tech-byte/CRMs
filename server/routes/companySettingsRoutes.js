const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { getCompanySettings, updateCompanySettings } = require("../controllers/companySettingsController");

router.get("/", requireAuth, getCompanySettings);
router.put("/", requireAuth, requireAdmin, updateCompanySettings);

module.exports = router;
