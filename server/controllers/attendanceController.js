const { Op } = require("sequelize");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { emitToAdmins, emitToUser } = require("../utils/socket");

const todayDateOnly = () => new Date().toISOString().slice(0, 10);
const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const getDiffMinutes = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
};

const getMyTodayAttendance = async (req, res) => {
  try {
    const record = await Attendance.findOne({ where: { employeeId: req.user.id, attendanceDate: todayDateOnly() } });
    return res.status(200).json({ success: true, record: record || null });
  } catch (error) {
    console.error("Get today attendance error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching today's attendance" });
  }
};

const tapIn = async (req, res) => {
  try {
    const attendanceDate = todayDateOnly();
    const existing = await Attendance.findOne({ where: { employeeId: req.user.id, attendanceDate } });
    if (existing) {
      return res.status(400).json({ success: false, message: "You've already checked in today" });
    }

    const record = await Attendance.create({
      employeeId: req.user.id,
      employeeName: req.user.fullName,
      attendanceDate,
      morningCheckIn: nowHHMM(),
      status: "Working",
      source: "tap",
    });

    emitToAdmins("attendanceCreated", { record, department: req.user.department });
    emitToUser(req.user.id, "attendanceUpdated", { record });

    return res.status(201).json({ success: true, record });
  } catch (error) {
    console.error("Tap in error:", error);
    return res.status(500).json({ success: false, message: "Server error checking in" });
  }
};

const takeBreak = async (req, res) => {
  try {
    const record = await Attendance.findOne({ where: { employeeId: req.user.id, attendanceDate: todayDateOnly() } });
    if (!record) return res.status(400).json({ success: false, message: "No attendance record today" });
    if (record.status !== "Working") return res.status(400).json({ success: false, message: "Cannot take a break right now" });
    if (record.lunchOut) return res.status(400).json({ success: false, message: "You already took a break today" });

    record.lunchOut = nowHHMM();
    record.status = "On Break";
    await record.save();

    emitToAdmins("attendanceUpdated", { record, department: req.user.department });
    emitToUser(req.user.id, "attendanceUpdated", { record });

    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error("Take break error:", error);
    return res.status(500).json({ success: false, message: "Server error taking break" });
  }
};

const resumeWork = async (req, res) => {
  try {
    const record = await Attendance.findOne({ where: { employeeId: req.user.id, attendanceDate: todayDateOnly() } });
    if (!record) return res.status(400).json({ success: false, message: "No attendance record today" });
    if (record.status !== "On Break") return res.status(400).json({ success: false, message: "You are not on a break" });
    if (record.lunchResume) return res.status(400).json({ success: false, message: "You already resumed work today" });

    record.lunchResume = nowHHMM();
    record.totalBreakMinutes = getDiffMinutes(record.lunchOut, record.lunchResume);
    record.status = "Working";
    await record.save();

    emitToAdmins("attendanceUpdated", { record, department: req.user.department });
    emitToUser(req.user.id, "attendanceUpdated", { record });

    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error("Resume work error:", error);
    return res.status(500).json({ success: false, message: "Server error resuming work" });
  }
};

const tapOut = async (req, res) => {
  try {
    const record = await Attendance.findOne({ where: { employeeId: req.user.id, attendanceDate: todayDateOnly() } });
    if (!record) return res.status(400).json({ success: false, message: "You haven't checked in today" });
    if (record.status !== "Working") return res.status(400).json({ success: false, message: "Cannot check out unless you are working" });
    if (record.finalCheckOut) return res.status(400).json({ success: false, message: "You've already checked out today" });

    record.finalCheckOut = nowHHMM();
    const grossWorkingMins = getDiffMinutes(record.morningCheckIn, record.finalCheckOut);
    record.totalWorkingMinutes = Math.max(0, grossWorkingMins - (record.totalBreakMinutes || 0));
    record.status = "Completed";
    await record.save();

    emitToAdmins("attendanceUpdated", { record, department: req.user.department });
    emitToUser(req.user.id, "attendanceUpdated", { record });

    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error("Tap out error:", error);
    return res.status(500).json({ success: false, message: "Server error tapping out" });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const { date, employeeId, department } = req.query;
    const where = {};
    if (date) where.attendanceDate = date;
    if (employeeId) where.employeeId = employeeId;

    const records = await Attendance.findAll({ where, order: [["attendanceDate", "DESC"], ["createdAt", "DESC"]] });
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

const getMyHistory = async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: { employeeId: req.user.id },
      order: [["attendanceDate", "DESC"]],
      limit: 5
    });

    const d = new Date();
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
    const todayStr = d.toISOString().slice(0, 10);

    const monthRecords = await Attendance.findAll({
      where: {
        employeeId: req.user.id,
        attendanceDate: { [Op.gte]: firstDay, [Op.lte]: todayStr }
      }
    });

    const totalDaysInMonthSoFar = d.getDate();
    let presentDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;

    monthRecords.forEach(r => {
      if (r.status === "Completed" || r.status === "Working" || r.status === "On Break") presentDays++;
      else if (r.status === "Absent") absentDays++;
      else if (r.status === "Late") lateArrivals++;
    });

    const attendancePercent = totalDaysInMonthSoFar > 0 ? Math.round((presentDays / totalDaysInMonthSoFar) * 100) : 0;
    const summary = {
      presentDays,
      absentDays: absentDays || (totalDaysInMonthSoFar - presentDays - lateArrivals),
      lateArrivals,
      attendancePercent
    };
    if (summary.absentDays < 0) summary.absentDays = 0;

    return res.status(200).json({ success: true, records, summary });
  } catch (error) {
    console.error("Get my history error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching history" });
  }
};

module.exports = { tapIn, takeBreak, resumeWork, tapOut, getMyTodayAttendance, getAllAttendance, getMyHistory };
