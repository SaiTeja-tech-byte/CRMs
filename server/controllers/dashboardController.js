const { Op, fn, col } = require("sequelize");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");

// GET /api/dashboard/stats
// Computes the stat cards live from real rows instead of storing precomputed
// numbers — always accurate, and needs no extra table.
const getDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const openDealsCount = await Deal.count({
      where: { ownerId, stage: { [Op.notIn]: ["Won", "Lost"] } },
    });

    const activeLeadsCount = await Deal.count({
      where: { ownerId, stage: "Leads" },
    });

    // Distinct companies with a deal = a rough stand-in for "customers assigned"
    const customersAssigned = await Deal.count({
      where: { ownerId },
      distinct: true,
      col: "title",
    });

    const pendingTasksCount = await Task.count({
      where: { ownerId, completed: false },
    });

    const meetingsTodayCount = await Meeting.count({
      where: { ownerId },
    });

    const revenueResult = await Deal.findOne({
      where: { ownerId, stage: "Won" },
      attributes: [[fn("SUM", col("value")), "totalRevenue"]],
      raw: true,
    });

    const revenueGenerated = Number(revenueResult?.totalRevenue || 0);

    return res.status(200).json({
      success: true,
      stats: {
        customersAssigned,
        activeLeads: activeLeadsCount,
        openDeals: openDealsCount,
        pendingTasks: pendingTasksCount,
        meetingsToday: meetingsTodayCount,
        revenueGenerated,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return res.status(500).json({ success: false, message: "Server error computing stats" });
  }
};

module.exports = { getDashboardStats };
