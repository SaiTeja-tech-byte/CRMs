const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const Task = require("../models/Task");
const Event = require("../models/Event");
const Meeting = require("../models/Meeting");
const Announcement = require("../models/Announcement");
const Document = require("../models/Document");
const Notification = require("../models/Notification");
const { emitToUser, emitToDepartment, emitToAll, emitToAdmins } = require("../utils/socket");

// Resolves a { targetType, employeeId, department } body into the actual
// list of User rows the action applies to. Shared by task and event
// assignment so "specific employee / department / everyone" works
// identically in both places.
const resolveTargets = async (body) => {
  const { targetType, employeeId, department } = body;

  if (targetType === "department") {
    if (!department) throw new Error("department is required when targetType is 'department'");
    return User.findAll({ where: { department, role: "employee" } });
  }

  if (targetType === "all") {
    return User.findAll({ where: { role: "employee" } });
  }

  // Default: a single specific employee (also covers omitted targetType
  // for backward compatibility with the original single-employee flow).
  if (!employeeId) throw new Error("employeeId is required when targeting a specific employee");
  const employee = await User.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");
  return [employee];
};

// GET /api/admin/users — list every employee/admin account for the Team tab.
const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "otpCode", "otpExpiresAt", "resetToken", "resetTokenExpiresAt"] },
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Admin list users error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching users" });
  }
};

// POST /api/admin/users — "Add Member": creates a real, login-capable
// employee account (not just a local UI row). Generates a temporary
// password and returns it once in the response so the admin can share it
// with the new hire — it is never stored in plaintext or shown again.
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, employeeId, department, designation, role, manager, officeLocation } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: "firstName, lastName, and email are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const tempPassword = crypto.randomBytes(6).toString("base64url"); // e.g. "aB3dK9pQ"
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      password: hashedPassword,
      isEmailVerified: true, // admin-created accounts are trusted, skip OTP verification
      employeeId,
      designation,
      department,
      officeLocation,
      phoneNumber: phone,
      reportingManager: manager,
      employmentStatus: "Active",
      role: role === "admin" || role === "Admin" ? "admin" : "employee",
    });

    const { password, otpCode, otpExpiresAt, resetToken, resetTokenExpiresAt, ...safeUser } = user.toJSON();
    emitToAdmins("team:updated", { user: safeUser });
    return res.status(201).json({ success: true, user: safeUser, tempPassword });
  } catch (error) {
    console.error("Admin create user error:", error);
    return res.status(500).json({ success: false, message: "Server error creating the account" });
  }
};

// PATCH /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id && req.body.role && req.body.role !== "admin") {
      return res.status(400).json({ success: false, message: "You can't remove your own admin access." });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const editable = ["role", "employmentStatus", "designation", "department", "officeLocation", "reportingManager"];
    for (const field of editable) {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    }

    if (req.body.role && !["employee", "admin"].includes(req.body.role)) {
      return res.status(400).json({ success: false, message: "role must be 'employee' or 'admin'" });
    }

    await user.save();

    const { password, otpCode, otpExpiresAt, resetToken, resetTokenExpiresAt, ...safeUser } = user.toJSON();
    emitToUser(user.id, "profile:updated", { user: safeUser });
    emitToAdmins("team:updated", { user: safeUser });
    return res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Admin update user error:", error);
    return res.status(500).json({ success: false, message: "Server error updating user" });
  }
};

// GET /api/admin/stats — company-wide numbers for AdminHome's summary grid.
const getAdminStats = async (req, res) => {
  try {
    const [totalEmployees, activeEmployees, pendingTasks, upcomingEvents, newsPosts, documentsCount, notificationsCount] =
      await Promise.all([
        User.count(),
        User.count({ where: { employmentStatus: "Active" } }),
        Task.count({ where: { completed: false } }),
        Event.count(),
        Announcement.count(),
        Document.count(),
        Notification.count(),
      ]);

    return res.status(200).json({
      success: true,
      stats: { totalEmployees, activeEmployees, pendingTasks, upcomingEvents, newsPosts, documents: documentsCount, notifications: notificationsCount },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ success: false, message: "Server error computing admin stats" });
  }
};

// GET /api/admin/tasks — every employee's tasks.
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Admin get all tasks error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching tasks" });
  }
};

// POST /api/admin/tasks — assign a task to a specific employee, a whole
// department, or everyone. body: { targetType: "employee"|"department"|"all",
// employeeId, department, title, description, priority, dueDate, dueTime, category, notes }
// Fans out one Task row per matching employee (ownerId = that employee), so
// each person's normal GET /api/tasks (scoped to req.user.id) picks it up —
// and each of them gets a live Socket.IO push + notification immediately.
const assignTask = async (req, res) => {
  try {
    const { targetType, title, description, priority, dueDate, dueTime, category, notes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "title is required" });
    }

    let targets;
    try {
      targets = await resolveTargets(req.body);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (targets.length === 0) {
      return res.status(404).json({ success: false, message: "No matching employees found for that target" });
    }

    const created = await Promise.all(
      targets.map((employee) =>
        Task.create({
          title, description, dueDate, dueTime, category, notes,
          priority: priority || "Medium",
          status: "Pending",
          completed: false,
          ownerId: employee.id,
          assignedTo: employee.fullName,
          createdById: req.user.id,
          createdBy: req.user.fullName,
        })
      )
    );

    await Promise.all(
      targets.map((employee) =>
        Notification.create({
          userId: employee.id,
          text: `${req.user.fullName} assigned you a new task: "${title}"`,
          icon: "bi-plus-check",
        })
      )
    );

    // Live push — this is what makes it show up on the employee side
    // instantly instead of waiting for their next poll/refresh.
    created.forEach((task) => {
      emitToUser(task.ownerId, "task:new", { task });
      emitToUser(task.ownerId, "notification:new", { text: `${req.user.fullName} assigned you a new task: "${title}"` });
    });
    emitToAdmins("task:new", { count: created.length, targetType: targetType || "employee" });

    return res.status(201).json({ success: true, count: created.length, tasks: created, task: created[0] });
  } catch (error) {
    console.error("Admin assign task error:", error);
    return res.status(500).json({ success: false, message: "Server error assigning task" });
  }
};

// DELETE /api/admin/tasks/:id — admin can delete ANY employee's task.
const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    const ownerId = task.ownerId;
    await task.destroy();
    emitToUser(ownerId, "task:deleted", { id: req.params.id });
    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Admin delete task error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting task" });
  }
};

// GET /api/admin/events — every employee's calendar events.
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Admin get all events error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching events" });
  }
};

// POST /api/admin/events — schedule an event onto a specific employee's,
// a department's, or everyone's calendar. Same targeting/fan-out pattern as assignTask.
const assignEvent = async (req, res) => {
  try {
    const { targetType, title, description, type, date, startTime, endTime, location, priority, color } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "title is required" });
    }

    let targets;
    try {
      targets = await resolveTargets(req.body);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (targets.length === 0) {
      return res.status(404).json({ success: false, message: "No matching employees found for that target" });
    }

    const created = await Promise.all(
      targets.map((employee) =>
        Event.create({
          title, description, type, date, startTime, endTime, location, color,
          priority: priority || "Medium",
          status: "Pending",
          ownerId: employee.id,
          assignedTo: employee.fullName,
          department: employee.department,
          createdById: req.user.id,
          createdBy: req.user.fullName,
        })
      )
    );

    await Promise.all(
      targets.map((employee) =>
        Notification.create({
          userId: employee.id,
          text: `${req.user.fullName} scheduled a new event: "${title}"${date ? ` on ${date}` : ""}`,
          icon: "bi-calendar-plus",
        })
      )
    );

    created.forEach((event) => {
      emitToUser(event.ownerId, "event:new", { event });
      emitToUser(event.ownerId, "notification:new", { text: `${req.user.fullName} scheduled a new event: "${title}"` });
    });
    emitToAdmins("event:new", { count: created.length, targetType: targetType || "employee" });

    return res.status(201).json({ success: true, count: created.length, events: created, event: created[0] });
  } catch (error) {
    console.error("Admin assign event error:", error);
    return res.status(500).json({ success: false, message: "Server error scheduling event" });
  }
};

// DELETE /api/admin/events/:id — admin can delete ANY employee's event.
const deleteAnyEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    const ownerId = event.ownerId;
    await event.destroy();
    emitToUser(ownerId, "event:deleted", { id: req.params.id });
    return res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("Admin delete event error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting event" });
  }
};

module.exports = {
  listUsers, createUser, updateUser, getAdminStats,
  getAllTasks, assignTask, deleteAnyTask,
  getAllEvents, assignEvent, deleteAnyEvent,
};
