const { Op } = require("sequelize");
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
const { parsePagination, buildPaginationMeta } = require("../utils/pagination");


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
// Supports ?page=&limit=&sortBy=&sortDir= plus the existing Team UI filters:
// ?search= (name/email), ?department=, ?role=, ?employmentStatus=
const listUsers = async (req, res) => {
  try {
    const { page, limit, offset, order } = parsePagination(req.query, {
      sortableFields: ["fullName", "email", "department", "role", "employmentStatus", "createdAt"],
      defaultSort: "createdAt",
      defaultOrder: "ASC",
    });

    const where = {};
    if (req.query.department) where.department = req.query.department;
    if (req.query.role) where.role = req.query.role;
    if (req.query.employmentStatus) where.employmentStatus = req.query.employmentStatus;
    if (req.query.search) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${req.query.search}%` } },
        { email: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password", "otpCode", "otpExpiresAt", "resetToken", "resetTokenExpiresAt"] },
      order,
      limit,
      offset,
    });

    return res.status(200).json({ success: true, users: rows, pagination: buildPaginationMeta(count, page, limit) });
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
    const { firstName, lastName, email, phone, employeeId, department, designation, role, manager, officeLocation, salary, workMode } = req.body;

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
      isEmailVerified: true, 
      employeeId,
      designation,
      department,
      officeLocation,
      phoneNumber: phone,
      reportingManager: manager,
      employmentStatus: "Active",
      salary: salary || null,
      workMode: workMode || "Office",
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

    // Fields any admin can edit for a team member. This includes the
    // handful of "admin-only" fields (employeeId, joiningDate, etc.) that
    // are intentionally read-only on the employee's own Me page — an
    // employee can't set their own Employee ID or joining date, only an
    // admin can, from the Team page.
    const editable = [
      "fullName", "role", "employmentStatus", "designation", "department",
      "officeLocation", "reportingManager", "employeeId", "phoneNumber",
      "employmentType", "joiningDate", "officialEmail", "salary", "workMode"
    ];
    for (const field of editable) {
      if (req.body[field] !== undefined) {
        // Empty-string dates blow up Postgres DATEONLY columns — store as null instead.
        user[field] = req.body[field] === "" && field === "joiningDate" ? null : req.body[field];
      }
    }

    // "company" comes in from the frontend form but is stored as companyName.
    if (req.body.company !== undefined) {
      user.companyName = req.body.company;
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

// GET /api/admin/tasks — every employee's tasks. Supports ?page=&limit=&
// sortBy=&sortDir= and ?search= (title/assignee name).
const getAllTasks = async (req, res) => {
  try {
    const { page, limit, offset, order } = parsePagination(req.query, {
      sortableFields: ["title", "priority", "status", "dueDate", "createdAt"],
      defaultSort: "createdAt",
      defaultOrder: "DESC",
    });

    const where = {};
    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { assignedTo: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }
    if (req.query.status) where.status = req.query.status;
    if (req.query.priority) where.priority = req.query.priority;
    if (req.query.employeeId) where.ownerId = req.query.employeeId;
    // Task rows don't store department directly, so filtering by department
    // means filtering by the set of employees in that department first.
    if (req.query.department) {
      const deptUsers = await User.findAll({
        where: { department: req.query.department },
        attributes: ["id"],
      });
      where.ownerId = { [Op.in]: deptUsers.map((u) => u.id) };
    }

    const { rows, count } = await Task.findAndCountAll({ where, order, limit, offset });
    return res.status(200).json({ success: true, tasks: rows, pagination: buildPaginationMeta(count, page, limit) });
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

// GET /api/admin/employees/:id - Employee full profile with cross-module aggregates
const getEmployeeProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "otpCode", "otpExpiresAt", "resetToken", "resetTokenExpiresAt"] }
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Fetch related modules natively or pseudo-aggregate if models exist.
    // In this basic version we will just return the user as the overview,
    // and let the frontend make specific calls for the other tabs,
    // or aggregate basic ones.
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get Employee Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching profile" });
  }
};

// PUT /api/admin/users/bulk - Bulk actions on multiple employees
const bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, updateData } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "userIds array is required" });
    }

    const allowedUpdates = ["department", "reportingManager", "employmentStatus", "role"];
    const payload = {};
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) payload[key] = updateData[key];
    }

    await User.update(payload, { where: { id: { [Op.in]: userIds } } });

    // Broadcast updates
    userIds.forEach(id => {
      emitToUser(id, "profile:updated", { user: payload }); // Partial update alert
    });
    emitToAdmins("team:bulk_updated", { count: userIds.length });

    return res.status(200).json({ success: true, message: `Successfully updated ${userIds.length} employees.` });
  } catch (error) {
    console.error("Bulk update users error:", error);
    return res.status(500).json({ success: false, message: "Server error in bulk update" });
  }
};

module.exports = {
  listUsers, createUser, updateUser, getAdminStats,
  getAllTasks, assignTask, deleteAnyTask,
  getAllEvents, assignEvent, deleteAnyEvent,
  getEmployeeProfile, bulkUpdateUsers
};
