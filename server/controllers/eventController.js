const Event = require("../models/Event");
const { emitToAdmins } = require("../utils/socket");

// GET /api/events — every event on the logged-in employee's calendar,
// including ones an admin scheduled/assigned to them.
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { ownerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Get events error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching events" });
  }
};

// POST /api/events — an employee scheduling an event for themselves.
const createEvent = async (req, res) => {
  try {
    const { title, description, type, date, startTime, endTime, location, priority, color } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Event title is required" });
    }

    const event = await Event.create({
      title, description, type, date, startTime, endTime, location, color,
      priority: priority || "Medium",
      status: "Pending",
      ownerId: req.user.id,
      assignedTo: req.user.fullName,
      department: req.user.department,
      createdById: req.user.id,
      createdBy: req.user.fullName,
    });

    return res.status(201).json({ success: true, event });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ success: false, message: "Server error creating event" });
  }
};

// PATCH /api/events/:id — scoped to the employee's own events (even
// admin-assigned ones — they can still update status/details on it).
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id, ownerId: req.user.id } });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const fields = ["title", "description", "type", "date", "startTime", "endTime", "location", "priority", "status", "color"];
    for (const field of fields) {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    }

    await event.save();
    emitToAdmins("event:updated", { event });
    return res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("Update event error:", error);
    return res.status(500).json({ success: false, message: "Server error updating event" });
  }
};

// DELETE /api/events/:id — an employee deleting their own event.
// Admins deleting ANY employee's event goes through DELETE /api/admin/events/:id.
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id, ownerId: req.user.id } });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    await event.destroy();
    emitToAdmins("event:deleted", { id: req.params.id, ownerId: req.user.id });
    return res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("Delete event error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting event" });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
