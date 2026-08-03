const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { getIO } = require("../utils/socket");
const { Op } = require("sequelize");

const calculateWorkingHours = (tapInTime, tapOutTime) => {
  const diffInMs = new Date(tapOutTime) - new Date(tapInTime);
  const totalMinutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

exports.tapIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role || "employee";
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD local timezone approximation depending on server time

    let attendance = await Attendance.findOne({
      where: { userId, date: todayStr }
    });

    if (attendance) {
      if (attendance.status === "Working") {
        return res.status(400).json({ success: false, message: "Already checked in." });
      }
      if (attendance.status === "Completed") {
        return res.status(400).json({ success: false, message: "Attendance already completed for today." });
      }
    }

    attendance = await Attendance.create({
      userId,
      role,
      date: todayStr,
      tapInTime: new Date(),
      status: "Working",
    });

    const io = getIO();
    if (io) {
      io.emit("attendance:updated");
    }

    res.status(201).json({ success: true, attendance, message: "Successfully checked in." });
  } catch (error) {
    console.error("Error tapping in:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.tapOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      where: { userId, date: todayStr, status: "Working" }
    });

    if (!attendance) {
      return res.status(400).json({ success: false, message: "No active check-in found for today." });
    }

    attendance.tapOutTime = new Date();
    attendance.workingHours = calculateWorkingHours(attendance.tapInTime, attendance.tapOutTime);
    attendance.status = "Completed";

    await attendance.save();

    const io = getIO();
    if (io) {
      io.emit("attendance:updated");
    }

    res.json({ success: true, attendance, message: "Successfully checked out." });
  } catch (error) {
    console.error("Error tapping out:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split("T")[0];

    let attendance = await Attendance.findOne({
      where: { userId, date: todayStr }
    });

    res.json({ success: true, attendance });
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Attendance.findAll({
      where: { userId },
      order: [["date", "DESC"]],
      limit: 100
    });
    res.json({ success: true, history });
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const { date, role, department } = req.query;
    let whereClause = {};
    if (date) whereClause.date = date;
    if (role) whereClause.role = role;

    // Fetch attendances along with User info for department/name filtering
    const attendances = await Attendance.findAll({
      where: whereClause,
      order: [["date", "DESC"], ["createdAt", "DESC"]]
    });

    // We'll map User data manually or use table join. Since they aren't linked via Sequelize associations explicitly, we'll fetch users.
    const userIds = [...new Set(attendances.map(a => a.userId))];
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "fullName", "department", "employeeId"]
    });

    const userMap = {};
    users.forEach(u => { userMap[u.id] = u; });

    let finalData = attendances.map(a => {
      const u = userMap[a.userId];
      return {
        ...a.toJSON(),
        employeeName: u ? u.fullName : "Unknown",
        department: u ? (u.department || "General") : "Unknown",
        employeeCode: u ? u.employeeId : "N/A"
      };
    });

    if (department) {
      finalData = finalData.filter(d => d.department === department);
    }

    res.json({ success: true, attendances: finalData });
  } catch (error) {
    console.error("Error fetching all attendance:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
