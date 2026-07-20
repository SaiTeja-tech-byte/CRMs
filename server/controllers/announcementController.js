const Announcement = require("../models/Announcement");
const { emitToAll } = require("../utils/socket");

// GET /api/news  — returns all announcements newest first
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, announcements });
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
