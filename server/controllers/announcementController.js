const Announcement = require("../models/Announcement");
const { emitToAll } = require("../utils/socket");
const { parsePagination, buildPaginationMeta } = require("../utils/pagination");

// GET /api/news — supports ?page=&limit=&sortBy=&sortDir=, defaults to newest first
const getAnnouncements = async (req, res) => {
  try {
    const { page, limit, offset, order } = parsePagination(req.query, {
      sortableFields: ["title", "department", "createdAt"],
      defaultSort: "createdAt",
      defaultOrder: "DESC",
    });
    const { rows, count } = await Announcement.findAndCountAll({ order, limit, offset });
    return res.status(200).json({ success: true, announcements: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (error) {
    console.error("Get announcements error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching announcements" });
  }
};

// POST /api/news  — create a new announcement (admin only in future)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, authorName, authorAvatar, department } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }
    const announcement = await Announcement.create({
      title,
      content,
      authorName: authorName || req.user?.fullName || "Admin",
      authorAvatar: authorAvatar || null,
      department: department || "General",
    });
    emitToAll("news:new", { announcement });
    return res.status(201).json({ success: true, announcement });
  } catch (error) {
    console.error("Create announcement error:", error);
    return res.status(500).json({ success: false, message: "Server error creating announcement" });
  }
};

// DELETE /api/news/:id  — delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    await announcement.destroy();
    emitToAll("news:deleted", { id });
    return res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting announcement" });
  }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
