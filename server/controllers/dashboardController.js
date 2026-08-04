const { Op, fn, col } = require("sequelize");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const ActivityLog = require("../models/ActivityLog");
const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const todayStr = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      openDealsCount,
      activeLeadsCount,
      customersAssigned,
      pendingTasksCount,
      meetingsTodayCount,
      revenueResult,
      recentActivityCount,
      leaveRequestsToday,
    ] = await Promise.all([
      Deal.count({ where: { ownerId, stage: { [Op.notIn]: ["Won", "Lost"] } } }),
      Deal.count({ where: { ownerId, stage: "Leads" } }),
      Deal.count({ where: { ownerId }, distinct: true, col: "title" }),
      Task.count({ where: { ownerId, completed: false } }),
      // No reliable "today" field on Meeting yet (meetingTime is free text),
      // so this counts active/upcoming meetings rather than strictly today's.
      Meeting.count({ where: { ownerId, status: { [Op.notIn]: ["Completed", "Cancelled"] } } }),
      Deal.findOne({
        where: { ownerId, stage: "Won" },
        attributes: [[fn("SUM", col("value")), "totalRevenue"]],
        raw: true,
      }),
      ActivityLog.count({ where: { actorId: ownerId, createdAt: { [Op.gte]: sevenDaysAgo } } }),
      // Anyone (not just this user) currently on an approved leave that covers today —
      // narrowed down to the same department below.
      LeaveRequest.findAll({
        where: {
          status: "Approved",
          startDate: { [Op.lte]: todayStr },
          endDate: { [Op.gte]: todayStr },
          employeeId: { [Op.ne]: ownerId },
        },
        attributes: ["employeeId", "employeeName", "type"],
      }),
    ]);

    // Narrow "on leave today" down to colleagues in the requester's own department.
    let teamOnLeave = [];
    if (req.user.department && leaveRequestsToday.length) {
      const colleagueIds = [...new Set(leaveRequestsToday.map((r) => r.employeeId))];
      const colleagues = await User.findAll({
        where: { id: colleagueIds, department: req.user.department },
        attributes: ["id"],
      });
      const sameDeptIds = new Set(colleagues.map((c) => c.id));
      teamOnLeave = leaveRequestsToday
        .filter((r) => sameDeptIds.has(r.employeeId))
        .map((r) => ({ id: r.employeeId, name: r.employeeName, type: r.type }));
    }

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
        recentActivity: recentActivityCount,
        teamOnLeave,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return res.status(500).json({ success: false, message: "Server error computing stats" });
  }
};

module.exports = { getDashboardStats };
