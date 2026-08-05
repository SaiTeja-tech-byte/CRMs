const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");

router.use(requireAuth);
router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
