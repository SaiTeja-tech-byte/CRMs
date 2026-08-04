const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  listUsers, createUser, updateUser, getAdminStats,
  getAllTasks, assignTask, deleteAnyTask,
  getAllEvents, assignEvent, deleteAnyEvent,
  getEmployeeProfile, bulkUpdateUsers
} = require("../controllers/adminController");

// Every route below requires a valid token AND role === "admin".
router.use(requireAuth, requireAdmin);

router.get("/users", listUsers);
router.post("/users", createUser);
router.put("/users/bulk", bulkUpdateUsers);
router.patch("/users/:id", updateUser);
router.get("/users/:id", getEmployeeProfile);
router.get("/stats", getAdminStats);

router.get("/tasks", getAllTasks);
router.post("/tasks", assignTask);
router.delete("/tasks/:id", deleteAnyTask);

router.get("/events", getAllEvents);
router.post("/events", assignEvent);
router.delete("/events/:id", deleteAnyEvent);

module.exports = router;
