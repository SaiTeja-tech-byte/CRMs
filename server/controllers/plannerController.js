const { Op } = require("sequelize");
const AttendanceRegularization = require("../models/AttendanceRegularization");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { emitToUser, emitToAdmins } = require("../utils/socket");


const createRegularizationRequest = async (req, res) => {
  try {
    const { date, timeIn, timeOut, reason } = req.body;

    if (!date || !timeIn || !timeOut) {
      return res.status(400).json({ success: false, message: "date, timeIn and timeOut are required" });
    }

    const existingAttendance = await Attendance.findOne({ where: { employeeId: req.user.id, date } });
    if (existingAttendance) {
      return res.status(400).json({ success: false, message: "Attendance already exists for this date" });
    }

    const existingPending = await AttendanceRegularization.findOne({
      where: { employeeId: req.user.id, date, status: "Pending" },
    });
    if (existingPending) {
      return res.status(400).json({ success: false, message: "A regularization request for this date is already pending" });
    }

    const request = await AttendanceRegularization.create({
      employeeId: req.user.id,
      employeeName: req.user.fullName,
      date,
      timeIn,
      timeOut,
      reason: reason || null,
      status: "Pending",
    });

    const admins = await User.findAll({ where: { role: "admin" }, attributes: ["id"] });
    const text = `${req.user.fullName} requested attendance regularization for ${date}`;
    await Promise.all(
      admins.map((admin) =>
        Notification.create({ userId: admin.id, text, icon: "bi-clock-history", type: "attendance" })
      )
    );
    emitToAdmins("attendance:new", { request });
    emitToAdmins("notification:new", { text });

    return res.status(201).json({ success: true, request });
  } catch (error) {
    console.error("Create regularization request error:", error);
    return res.status(500).json({ success: false, message: "Server error submitting regularization request" });
  }
};

// Employee: their own regularization requests (any status).
const getMyRegularizationRequests = async (req, res) => {
  try {
    const requests = await AttendanceRegularization.findAll({
      where: { employeeId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Get my regularization requests error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching regularization requests" });
  }
};

// Employee: attendance rows for the Planner calendar (a given month), from
// the single shared Attendance table — automatic taps and approved
// regularizations look identical here.
const getMyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    const where = { employeeId: req.user.id };

    if (month && year) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10); // 1-12
      const start = `${y}-${String(m).padStart(2, "0")}-01`;
      const lastDay = new Date(y, m, 0).getDate();
      const end = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      where.date = { [Op.between]: [start, end] };
    }

    const records = await Attendance.findAll({ where, order: [["date", "ASC"]] });

    // Pending/rejected requests too, so the Planner can show a status badge
    // on days the employee already asked to regularize.
    const pendingWhere = { employeeId: req.user.id };
    if (where.date) pendingWhere.date = where.date;
    const pendingRequests = await AttendanceRegularization.findAll({
      where: { ...pendingWhere, status: "Pending" },
    });

    return res.status(200).json({ success: true, records, pendingRequests });
  } catch (error) {
    console.error("Get my attendance error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching attendance" });
  }
};

// Admin: every regularization request, optionally filtered by status.
const getAllRegularizationRequests = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const requests = await AttendanceRegularization.findAll({ where, order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Get all regularization requests error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching regularization requests" });
  }
};

// Admin: approve or reject. Approval is the only place that writes into
// the shared Attendance/Timesheet table.
const updateRegularizationStatus = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "status must be Approved or Rejected" });
    }

    const request = await AttendanceRegularization.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Regularization request not found" });
    }
    if (request.status !== "Pending") {
      return res.status(400).json({ success: false, message: "This request has already been reviewed" });
    }

    request.status = status;
    request.reviewedById = req.user.id;
    request.reviewedByName = req.user.fullName;
    request.reviewNote = reviewNote || null;
    await request.save();

    if (status === "Approved") {
      const [inH, inM] = request.timeIn.split(":").map(Number);
      const [outH, outM] = request.timeOut.split(":").map(Number);
      const totalHours = Math.max(0, (outH * 60 + outM - (inH * 60 + inM)) / 60);

      await Attendance.create({
        employeeId: request.employeeId,
        employeeName: request.employeeName,
        date: request.date,
        timeIn: request.timeIn,
        timeOut: request.timeOut,
        totalHours,
        status: "Approved",
        source: "regularization",
        regularizationId: request.id,
      });
    }

    const text = `Your attendance regularization for ${request.date} was ${status.toLowerCase()}${reviewNote ? `: ${reviewNote}` : ""}`;
    await Notification.create({
      userId: request.employeeId,
      text,
      icon: status === "Approved" ? "bi-calendar-check" : "bi-calendar-x",
      type: "attendance",
    });
    emitToUser(request.employeeId, "attendance:updated", { request });
    emitToUser(request.employeeId, "notification:new", { text });

    return res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Update regularization request error:", error);
    return res.status(500).json({ success: false, message: "Server error updating regularization request" });
  }
};

module.exports = {
  createRegularizationRequest,
  getMyRegularizationRequests,
  getMyAttendance,
  getAllRegularizationRequests,
  updateRegularizationStatus,
};
