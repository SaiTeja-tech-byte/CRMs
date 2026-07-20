const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getActivity } = require("../controllers/activityController");

router.use(requireAuth);
router.get("/", getActivity);

module.exports = router;
