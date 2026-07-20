const Notification = require("../models/Notification");

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching notifications" });
  }
};

// PATCH /api/notifications/:id/read
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ success: false, message: "Server error updating notification" });
  }
};

// PATCH /api/notifications/read-all — used by the "Mark all read" button and
// to clear the sidebar badge in one shot instead of one request per row.
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id, read: false } }
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ success: false, message: "Server error updating notifications" });
  }
};

// GET /api/notifications/unread-count — powers the badge shown next to the
// "Notifications" tab from anywhere in the app (sidebar, not just the tab
// itself), the same way the Chat tab's unread badge works.
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({ where: { userId: req.user.id, read: false } });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Get unread notification count error:", error);
    return res.status(500).json({ success: false, message: "Server error counting notifications" });
  }
};

module.exports = { getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount };
