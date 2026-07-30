const { Op, fn, col } = require("sequelize");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");

const getDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [
      openDealsCount,
      activeLeadsCount,
      customersAssigned,
      pendingTasksCount,
      meetingsTodayCount,
      revenueResult,
    ] = await Promise.all([
      Deal.count({ where: { ownerId, stage: { [Op.notIn]: ["Won", "Lost"] } } }),
      Deal.count({ where: { ownerId, stage: "Leads" } }),
      Deal.count({ where: { ownerId }, distinct: true, col: "title" }),
      Task.count({ where: { ownerId, completed: false } }),
      Meeting.count({ where: { ownerId } }),
      Deal.findOne({
        where: { ownerId, stage: "Won" },
        attributes: [[fn("SUM", col("value")), "totalRevenue"]],
        raw: true,
      }),
    ]);

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
