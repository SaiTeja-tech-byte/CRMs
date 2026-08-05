const { Op } = require("sequelize");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

const buildDateWhere = (from, to) => {
  const where = {};
  if (from && to) where.attendanceDate = { [Op.between]: [from, to] };
  else if (from) where.attendanceDate = { [Op.gte]: from };
  else if (to) where.attendanceDate = { [Op.lte]: to };
  return where;
};

const minutesToHrsMin = (mins = 0) => {
  const total = mins || 0;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${m}m`;
};

const toCsv = (rows) => {
  const header = [
    "Employee ID", "Employee Name", "Department", "Date", "Check In",
    "Break Out", "Break Resume", "Check Out", "Working Hours", "Break Time", "Status",
  ];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) => [
    r.employeeId, r.employeeName, r.department, r.date, r.checkIn,
    r.breakOut, r.breakResume, r.checkOut, r.workingHours, r.breakTime, r.status,
  ].map(escape).join(","));
  return [header.join(","), ...lines].join("\n");
};

// GET /api/reports/attendance
// Employees: only ever see their own records (employeeId/name/department query params are ignored).
// Admins: can filter by employeeId (human-readable, e.g. EMP001), name, or department.
const getAttendanceReport = async (req, res) => {
  try {
    const { from, to, employeeId, name, department, format } = req.query;
    const where = buildDateWhere(from, to);

    if (req.user.role === "employee") {
      where.employeeId = req.user.id;
    }

    const records = await Attendance.findAll({
      where,
      order: [["attendanceDate", "DESC"], ["employeeName", "ASC"]],
    });

    const employeeUuids = [...new Set(records.map((r) => r.employeeId))];
    const users = await User.findAll({
      where: { id: employeeUuids },
      attributes: ["id", "employeeId", "department", "fullName"],
    });
    const userById = {};
    users.forEach((u) => { userById[u.id] = u; });

    let rows = records.map((r) => {
      const u = userById[r.employeeId] || {};
      return {
        id: r.id,
        employeeUuid: r.employeeId,
        employeeId: u.employeeId || "—",
        employeeName: r.employeeName,
        department: u.department || "—",
        date: r.attendanceDate,
        checkIn: r.morningCheckIn || "-",
        breakOut: r.lunchOut || "-",
        breakResume: r.lunchResume || "-",
        checkOut: r.finalCheckOut || "-",
        workingHours: minutesToHrsMin(r.totalWorkingMinutes),
        breakTime: minutesToHrsMin(r.totalBreakMinutes),
        status: r.status,
      };
    });

    // Admin-only search filters — an employee can never widen their own query past their own id.
    if (req.user.role === "admin") {
      if (employeeId) {
        rows = rows.filter((r) => r.employeeId.toLowerCase() === String(employeeId).toLowerCase());
      }
      if (name) {
        const s = String(name).toLowerCase();
        rows = rows.filter((r) => r.employeeName.toLowerCase().includes(s));
      }
      if (department) {
        rows = rows.filter((r) => r.department.toLowerCase() === String(department).toLowerCase());
      }
    }

    const summary = {
      totalRecords: rows.length,
      present: rows.filter((r) => ["Working", "On Break", "Completed"].includes(r.status)).length,
      absent: rows.filter((r) => r.status === "Absent").length,
      late: rows.filter((r) => r.status === "Late").length,
    };

    if (format === "csv") {
      const csv = toCsv(rows);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="attendance-report-${Date.now()}.csv"`);
      return res.status(200).send(csv);
    }

    return res.status(200).json({ success: true, rows, summary });
  } catch (error) {
    console.error("Attendance report error:", error);
    return res.status(500).json({ success: false, message: "Server error generating attendance report" });
  }
};

module.exports = { getAttendanceReport };
