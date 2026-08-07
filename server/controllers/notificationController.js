const Notification = require("../models/Notification");
const { parsePagination, buildPaginationMeta } = require("../utils/pagination");

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    // The notification bell/list fetches its own full working set and does
    // client-side pagination on top of it, so `?limit=all` bypasses the
    // normal page size cap entirely instead of silently truncating to
    // parsePagination's default of 5.
    if (String(req.query.limit).toLowerCase() === "all") {
      const rows = await Notification.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        success: true,
        notifications: rows,
        pagination: { page: 1, limit: rows.length || 1, total: rows.length, totalPages: 1 },
      });
    }

    const { page, limit, offset, order } = parsePagination(req.query, {
      sortableFields: ["createdAt"],
      defaultSort: "createdAt",
      defaultOrder: "DESC",
    });
    const { rows, count } = await Notification.findAndCountAll({
      where: { userId: req.user.id },
      order,
      limit,
      offset,
    });
    return res.status(200).json({ success: true, notifications: rows, pagination: buildPaginationMeta(count, page, limit) });
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
// Optional ?type= only marks that section's notifications read (e.g. the
// Documents page clears just its own badge, not the whole bell count).
const markAllNotificationsRead = async (req, res) => {
  try {
    const where = { userId: req.user.id, read: false };
    if (req.query.type) where.type = req.query.type;

    await Notification.update({ read: true }, { where });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ success: false, message: "Server error updating notifications" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const where = { userId: req.user.id, read: false };
    if (req.query.type) where.type = req.query.type;

    const count = await Notification.count({ where });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Get unread notification count error:", error);
    return res.status(500).json({ success: false, message: "Server error counting notifications" });
  }
};

module.exports = { getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount };
