const { Op } = require("sequelize");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { emitToAdmins, emitToUser } = require("../utils/socket");

const todayDateOnly = () => new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};


const tapIn = async (req, res) => {
  try {
    const date = todayDateOnly();

    const existing = await Attendance.findOne({ where: { employeeId: req.user.id, date } });
    if (existing) {
      return res.status(400).json({ success: false, message: "You've already tapped in today" });
    }

    const record = await Attendance.create({
      employeeId: req.user.id,
      employeeName: req.user.fullName,
      date,
      timeIn: nowHHMM(),
      timeOut: null,
      totalHours: null,
      status: "Working",
      source: "tap",
    });

    const payload = { record, department: req.user.department };
    emitToAdmins("attendance:tapIn", payload);
    emitToAdmins("attendanceCreated", payload);
    emitToUser(req.user.id, "attendanceUpdated", { record });

    return res.status(201).json({ success: true, record });
  } catch (error) {
    console.error("Tap in error:", error);
    return res.status(500).json({ success: false, message: "Server error tapping in" });
  }
};

// Employee: tap out — closes today's open "Working" row.
const tapOut = async (req, res) => {
  try {
    const date = todayDateOnly();

    const record = await Attendance.findOne({ where: { employeeId: req.user.id, date } });
    if (!record) {
      return res.status(400).json({ success: false, message: "You haven't tapped in today" });
    }
    if (record.timeOut) {
      return res.status(400).json({ success: false, message: "You've already tapped out today" });
    }

    const timeOut = nowHHMM();
    const [inH, inM] = record.timeIn.split(":").map(Number);
    const [outH, outM] = timeOut.split(":").map(Number);
    const totalHours = Math.max(0, (outH * 60 + outM - (inH * 60 + inM)) / 60);

    record.timeOut = timeOut;
    record.totalHours = totalHours;
    record.status = "Completed";
    await record.save();

    const payload = { record, department: req.user.department };
    emitToAdmins("attendance:tapOut", payload);
    emitToAdmins("attendanceUpdated", payload);
    emitToUser(req.user.id, "attendanceUpdated", { record });

    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error("Tap out error:", error);
    return res.status(500).json({ success: false, message: "Server error tapping out" });
  }
};

// Employee: today's own attendance status, for the Tap In/Out card to
// restore its state on page load/refresh.
const getMyTodayAttendance = async (req, res) => {
  try {
    const record = await Attendance.findOne({ where: { employeeId: req.user.id, date: todayDateOnly() } });
    return res.status(200).json({ success: true, record: record || null });
  } catch (error) {
    console.error("Get today attendance error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching today's attendance" });
  }
};

// Admin: live attendance sheet — every employee's tap in/out, newest first,
// optionally filtered by date/employee/department.
const getAllAttendance = async (req, res) => {
  try {
    const { date, employeeId, department } = req.query;
    const where = {};
    if (date) where.date = date;
    if (employeeId) where.employeeId = employeeId;

    const records = await Attendance.findAll({ where, order: [["date", "DESC"], ["createdAt", "DESC"]] });

    const employeeIds = [...new Set(records.map((r) => r.employeeId))];
    const users = await User.findAll({ where: { id: employeeIds }, attributes: ["id", "department"] });
    const departmentById = {};
    users.forEach((u) => { departmentById[u.id] = u.department || "—"; });

    let rows = records.map((r) => ({ ...r.toJSON(), department: departmentById[r.employeeId] || "—" }));
    if (department) rows = rows.filter((r) => r.department === department);

    return res.status(200).json({ success: true, records: rows });
  } catch (error) {
    console.error("Get all attendance error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching attendance" });
  }
};

// Employee: history and summary stats
const getMyHistory = async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: { employeeId: req.user.id },
      order: [["date", "DESC"]],
      limit: 5
    });

    const d = new Date();
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
    const todayStr = d.toISOString().slice(0, 10);

    const monthRecords = await Attendance.findAll({
      where: {
        employeeId: req.user.id,
        date: { [Op.gte]: firstDay, [Op.lte]: todayStr }
      }
    });

    const totalDaysInMonthSoFar = d.getDate();
    let presentDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;

    monthRecords.forEach(r => {
      if (r.status === "Completed" || r.status === "Working") presentDays++;
      else if (r.status === "Absent") absentDays++;
      else if (r.status === "Late") lateArrivals++;
    });

    const attendancePercent = totalDaysInMonthSoFar > 0 ? Math.round((presentDays / totalDaysInMonthSoFar) * 100) : 0;

    const summary = {
      presentDays,
      absentDays: absentDays || (totalDaysInMonthSoFar - presentDays - monthRecords.filter(r=>r.status==="Late").length), // Basic fallback
      lateArrivals,
      attendancePercent
    };

    // Ensure absentDays isn't negative due to weekends etc, this is just a mockup metric
    if (summary.absentDays < 0) summary.absentDays = 0;

    return res.status(200).json({ success: true, records, summary });
  } catch (error) {
    console.error("Get my history error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching history" });
  }
};

module.exports = { tapIn, tapOut, getMyTodayAttendance, getAllAttendance, getMyHistory };
