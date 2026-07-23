const Task = require("../models/Task");
const { emitToAdmins } = require("../utils/socket");
const { parsePagination, buildPaginationMeta } = require("../utils/pagination");

// GET /api/tasks — every task assigned to (or created by) the logged-in
// employee, including ones an admin assigned to them.
// Pagination is opt-in here: the employee Tasks tab computes its
// Overdue/Pending/Today/etc. category counts from the full list client-side,
// so the default limit is intentionally high (500) rather than the normal
// 20 — pass ?limit=20&page=2 explicitly once that tab is rearchitected to
// fetch per-category from the server instead.
const getTasks = async (req, res) => {
  try {
    const { page, limit, offset, order } = parsePagination(req.query, {
      sortableFields: ["title", "priority", "status", "dueDate", "createdAt"],
      defaultSort: "createdAt",
      defaultOrder: "DESC",
    });
    const effectiveLimit = req.query.limit ? limit : 500;

    const { rows, count } = await Task.findAndCountAll({
      where: { ownerId: req.user.id },
      order,
      limit: effectiveLimit,
      offset,
    });
    return res.status(200).json({ success: true, tasks: rows, pagination: buildPaginationMeta(count, page, effectiveLimit) });
  } catch (error) {
    console.error("Get tasks error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching tasks" });
  }
};

// POST /api/tasks — an employee creating a task for themselves.
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, dueTime, category, notes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Task title is required" });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "Medium",
      dueDate,
      dueTime,
      category,
      notes,
      status: "Pending",
      completed: false,
      ownerId: req.user.id,
      assignedTo: req.user.fullName,
      createdById: req.user.id,
      createdBy: req.user.fullName,
    });

    return res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ success: false, message: "Server error creating task" });
  }
};

// PATCH /api/tasks/:id — edits, and the checkbox/status toggle.
// Scoped to the employee's own tasks (even ones an admin assigned them —
// the employee can still update status/notes on it).
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, ownerId: req.user.id } });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const { title, description, priority, dueDate, dueTime, category, notes, status } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (dueTime !== undefined) task.dueTime = dueTime;
    if (category !== undefined) task.category = category;
    if (notes !== undefined) task.notes = notes;
    if (status !== undefined) {
      task.status = status;
      task.completed = status === "Completed";
    }

    await task.save();

    // Let admins watching their dashboard see the status change live —
    // e.g. a task flipping to "Completed" — without waiting on a poll.
    emitToAdmins("task:updated", { task });

    return res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ success: false, message: "Server error updating task" });
  }
};

// DELETE /api/tasks/:id — an employee can delete their own tasks
// (including admin-assigned ones). Admins deleting ANY employee's task
// goes through DELETE /api/admin/tasks/:id instead.
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, ownerId: req.user.id } });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.destroy();
    emitToAdmins("task:deleted", { id: req.params.id, ownerId: req.user.id });

    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting task" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
