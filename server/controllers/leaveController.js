const { Op } = require("sequelize");
const LeaveRequest = require("../models/LeaveRequest");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { emitToUser, emitToAdmins } = require("../utils/socket");

const ANNUAL_LEAVE_ENTITLEMENT = 24;

const daysBetweenInclusive = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 1;
};

const createLeaveRequest = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "startDate and endDate are required" });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: "endDate can't be before startDate" });
    }

    const leaveRequest = await LeaveRequest.create({
      employeeId: req.user.id,
      employeeName: req.user.fullName,
      type: type || "Casual Leave",
      startDate,
      endDate,
      days: daysBetweenInclusive(startDate, endDate),
      reason: reason || null,
      status: "Pending",
    });

    const admins = await User.findAll({ where: { role: "admin" }, attributes: ["id"] });
    const text = `${req.user.fullName} requested ${leaveRequest.type} (${leaveRequest.days} day${leaveRequest.days > 1 ? "s" : ""}) from ${startDate} to ${endDate}`;
    await Promise.all(
      admins.map((admin) =>
        Notification.create({ userId: admin.id, text, icon: "bi-calendar-x" })
      )
    );
    emitToAdmins("leave:new", { leaveRequest });
    emitToAdmins("notification:new", { text });

    return res.status(201).json({ success: true, leaveRequest });
  } catch (error) {
    console.error("Create leave request error:", error);
    return res.status(500).json({ success: false, message: "Server error submitting leave request" });
  }
};

const getMyLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.findAll({
      where: { employeeId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, leaveRequests });
  } catch (error) {
    console.error("Get my leave requests error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching leave requests" });
  }
};

const getMyLeaveBalance = async (req, res) => {
  try {
    const yearStart = `${new Date().getFullYear()}-01-01`;
    const yearEnd = `${new Date().getFullYear()}-12-31`;

    const approved = await LeaveRequest.findAll({
      where: {
        employeeId: req.user.id,
        status: "Approved",
        startDate: { [Op.between]: [yearStart, yearEnd] },
      },
      attributes: ["days"],
    });

    const usedLeave = approved.reduce((sum, r) => sum + (r.days || 0), 0);

    return res.status(200).json({
      success: true,
      balance: {
        earnedLeave: ANNUAL_LEAVE_ENTITLEMENT,
        usedLeave,
        remainingLeave: Math.max(ANNUAL_LEAVE_ENTITLEMENT - usedLeave, 0),
      },
    });
  } catch (error) {
    console.error("Get leave balance error:", error);
    return res.status(500).json({ success: false, message: "Server error computing leave balance" });
  }
};

const getAllLeaveRequests = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const leaveRequests = await LeaveRequest.findAll({ where, order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, leaveRequests });
  } catch (error) {
    console.error("Get all leave requests error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching leave requests" });
  }
};

const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "status must be Approved or Rejected" });
    }

    const leaveRequest = await LeaveRequest.findByPk(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }

    leaveRequest.status = status;
    leaveRequest.reviewedById = req.user.id;
    leaveRequest.reviewedByName = req.user.fullName;
    leaveRequest.reviewNote = reviewNote || null;
    await leaveRequest.save();

    const text = `Your ${leaveRequest.type} request (${leaveRequest.startDate} to ${leaveRequest.endDate}) was ${status.toLowerCase()}${reviewNote ? `: ${reviewNote}` : ""}`;
    await Notification.create({
      userId: leaveRequest.employeeId,
      text,
      icon: status === "Approved" ? "bi-calendar-check" : "bi-calendar-x",
    });
    emitToUser(leaveRequest.employeeId, "leave:updated", { leaveRequest });
    emitToUser(leaveRequest.employeeId, "notification:new", { text });

    return res.status(200).json({ success: true, leaveRequest });
  } catch (error) {
    console.error("Update leave request error:", error);
    return res.status(500).json({ success: false, message: "Server error updating leave request" });
  }
};

module.exports = {
  createLeaveRequest,
  getMyLeaveRequests,
  getMyLeaveBalance,
  getAllLeaveRequests,
  updateLeaveRequestStatus,
};
