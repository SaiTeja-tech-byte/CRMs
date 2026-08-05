const { Op } = require("sequelize");
const Attendance = require("../models/Attendance");
const Payroll = require("../models/Payroll");
const Expense = require("../models/Expense");
const Ticket = require("../models/Ticket");
const Task = require("../models/Task");
const User = require("../models/User");

// Helpers
const buildDateWhere = (from, to, dateField) => {
  const where = {};
  if (from && to) where[dateField] = { [Op.between]: [from, to] };
  else if (from) where[dateField] = { [Op.gte]: from };
  else if (to) where[dateField] = { [Op.lte]: to };
  return where;
};

const minutesToHrsMin = (mins = 0) => {
  const total = mins || 0;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${m}m`;
};

const applyAdminFilters = (rows, req) => {
  if (req.user.role !== "admin") return rows;
  let filtered = rows;
  const { employeeId, name, department, status, category, priority } = req.query;

  if (employeeId) {
    filtered = filtered.filter((r) => r.employeeId && r.employeeId.toLowerCase() === String(employeeId).toLowerCase());
  }
  if (name) {
    const s = String(name).toLowerCase();
    filtered = filtered.filter((r) => r.employeeName && r.employeeName.toLowerCase().includes(s));
  }
  if (department) {
    filtered = filtered.filter((r) => r.department && r.department.toLowerCase() === String(department).toLowerCase());
  }
  if (status) {
    filtered = filtered.filter((r) => r.status && r.status.toLowerCase() === String(status).toLowerCase());
  }
  if (category) {
    filtered = filtered.filter((r) => r.category && r.category.toLowerCase() === String(category).toLowerCase());
  }
  if (priority) {
    filtered = filtered.filter((r) => r.priority && r.priority.toLowerCase() === String(priority).toLowerCase());
  }
  return filtered;
};

// --- Attendance Report ---
const getAttendanceReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = buildDateWhere(from, to, "attendanceDate");
    if (req.user.role === "employee") where.employeeId = req.user.id;

    const records = await Attendance.findAll({
      where,
      order: [["attendanceDate", "DESC"], ["employeeName", "ASC"]],
    });

    const employeeUuids = [...new Set(records.map((r) => r.employeeId))];
    const users = await User.findAll({
      where: { id: employeeUuids },
      attributes: ["id", "employeeId", "department"],
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
        checkOut: r.finalCheckOut || "-",
        workingHours: minutesToHrsMin(r.totalWorkingMinutes),
        breakTime: minutesToHrsMin(r.totalBreakMinutes),
        status: r.status,
      };
    });

    rows = applyAdminFilters(rows, req);
    return res.status(200).json({ success: true, rows });
  } catch (error) {
    console.error("Attendance report error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- Payroll Report ---
const getPayrollReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const where = {};
    if (month) where.payPeriodMonth = month;
    if (year) where.payPeriodYear = year;
    if (req.user.role === "employee") where.employeeId = req.user.id;

    const records = await Payroll.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    let rows = records.map((r) => ({
      id: r.id,
      employeeUuid: r.employeeId,
      employeeName: r.employeeName,
      department: r.department || "—",
      month: r.payPeriodMonth,
      year: r.payPeriodYear,
      basicSalary: r.basicSalary,
      allowances: (r.hra || 0) + (r.allowances || 0) + (r.bonus || 0) + (r.incentives || 0),
      deductions: (r.tax || 0) + (r.pf || 0) + (r.esi || 0) + (r.professionalTax || 0) + (r.otherDeductions || 0),
      netSalary: r.netSalary,
      status: r.status,
    }));

    rows = applyAdminFilters(rows, req);
    return res.status(200).json({ success: true, rows });
  } catch (error) {
    console.error("Payroll report error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- Expenses Report ---
const getExpensesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = buildDateWhere(from, to, "date");
    if (req.user.role === "employee") where.employeeId = req.user.id;

    const records = await Expense.findAll({
      where,
      order: [["date", "DESC"]],
    });

    let rows = records.map((r) => ({
      id: r.id,
      employeeUuid: r.employeeId,
      employeeName: r.employeeName,
      department: r.department || "—",
      title: r.title,
      category: r.category,
      amount: r.amount,
      date: r.date,
      status: r.status,
    }));

    rows = applyAdminFilters(rows, req);
    return res.status(200).json({ success: true, rows });
  } catch (error) {
    console.error("Expenses report error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- Help Center Report ---
const getHelpCenterReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = buildDateWhere(from, to, "createdAt");
    if (req.user.role === "employee") where.employeeId = req.user.id;

    const records = await Ticket.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    let rows = records.map((r) => ({
      id: r.id,
      employeeUuid: r.employeeId,
      employeeName: r.employeeName,
      department: r.department || "—",
      subject: r.subject,
      category: r.category,
      priority: r.priority,
      status: r.status,
      createdDate: new Date(r.createdAt).toISOString().slice(0, 10),
      closedDate: r.status === "Closed" || r.status === "Resolved" ? new Date(r.updatedAt).toISOString().slice(0, 10) : "-",
    }));

    rows = applyAdminFilters(rows, req);
    return res.status(200).json({ success: true, rows });
  } catch (error) {
    console.error("Help Center report error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- Tasks Report ---
const getTasksReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = buildDateWhere(from, to, "createdAt"); // Optional: filter by dueDate instead
    
    // For tasks, employees see tasks assigned to them or created by them
    if (req.user.role === "employee") {
      where[Op.or] = [
        { ownerId: req.user.id },
        { createdById: req.user.id }
      ];
    }

    const records = await Task.findAll({
      where,
      order: [["dueDate", "ASC"]],
    });

    let rows = records.map((r) => ({
      id: r.id,
      employeeName: r.assignedTo || "Unassigned",
      title: r.title,
      category: r.category || "—",
      priority: r.priority,
      dueDate: r.dueDate || "—",
      status: r.status,
      completion: r.completed ? "100%" : "0%",
    }));

    rows = applyAdminFilters(rows, req);
    return res.status(200).json({ success: true, rows });
  } catch (error) {
    console.error("Tasks report error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAttendanceReport,
  getPayrollReport,
  getExpensesReport,
  getHelpCenterReport,
  getTasksReport
};
