const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getProfile, updateProfile, deleteAccount } = require("../controllers/profileController");

router.use(requireAuth);
router.get("/", getProfile);
router.patch("/", updateProfile);
router.delete("/", deleteAccount);

module.exports = router;
