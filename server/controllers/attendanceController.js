const { Op } = require("sequelize");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { emitToAdmins, emitToUser } = require("../utils/socket");


const MAX_SESSIONS_PER_DAY = 2;

const todayDateOnly = () => new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Build the daily summary (working/break minutes + overall status) from a
// list of session rows for one employee/day, ordered by sessionNo.
const summarize = (sessions) => {
  let workingMinutes = 0;
  let breakMinutes = 0;

  sessions.forEach((s, idx) => {
    if (s.timeOut) {
      workingMinutes += s.durationMinutes ?? Math.max(0, toMinutes(s.timeOut) - toMinutes(s.timeIn));
    } else {
      // Open session — count minutes worked so far, live.
      workingMinutes += Math.max(0, toMinutes(nowHHMM()) - toMinutes(s.timeIn));
    }
    const next = sessions[idx + 1];
    if (s.timeOut && next) {
      breakMinutes += Math.max(0, toMinutes(next.timeIn) - toMinutes(s.timeOut));
    } else if (s.timeOut && !next && idx === sessions.length - 1) {
      // On break right now (tapped out of last session, hasn't tapped back in).
    }
  });

  const lastSession = sessions[sessions.length - 1];
  let status = "Not Checked In";
  if (lastSession) {
    if (!lastSession.timeOut) status = "Working";
    else if (sessions.length >= MAX_SESSIONS_PER_DAY) status = "Completed";
    else status = "On Break";
  }

  // If currently on break, add live break minutes too.
  if (status === "On Break" && lastSession?.timeOut) {
    breakMinutes += Math.max(0, toMinutes(nowHHMM()) - toMinutes(lastSession.timeOut));
  }

  return {
    status,
    workingMinutes: Math.round(workingMinutes),
    breakMinutes: Math.round(breakMinutes),
    sessionsCount: sessions.length,
    maxSessions: MAX_SESSIONS_PER_DAY,
  };
};

// Employee: tap in — starts a new session (morning, or after a break).
const tapIn = async (req, res) => {
  try {
    const date = todayDateOnly();

    const sessions = await Attendance.findAll({
      where: { employeeId: req.user.id, date },
      order: [["sessionNo", "ASC"]],
    });

    const openSession = sessions.find((s) => !s.timeOut);
    if (openSession) {
      return res.status(400).json({ success: false, message: "You've already tapped in — tap out first" });
    }
    if (sessions.length >= MAX_SESSIONS_PER_DAY) {
      return res.status(400).json({ success: false, message: `You've completed all ${MAX_SESSIONS_PER_DAY} tap-ins for today` });
    }

    const record = await Attendance.create({
      employeeId: req.user.id,
      employeeName: req.user.fullName,
      date,
      sessionNo: sessions.length + 1,
      timeIn: nowHHMM(),
      timeOut: null,
      totalHours: null,
      status: "Working",
      source: "tap",
    });

    const allSessions = [...sessions, record];
    const summary = summarize(allSessions);
    const payload = { record, sessions: allSessions, summary, department: req.user.department };
    emitToAdmins("attendance:tapIn", payload);
    emitToAdmins("attendanceCreated", payload);
    emitToUser(req.user.id, "attendanceUpdated", payload);

    return res.status(201).json({ success: true, record, sessions: allSessions, summary });
  } catch (error) {
    console.error("Tap in error:", error);
    return res.status(500).json({ success: false, message: "Server error tapping in" });
  }
};

// Employee: tap out — closes the currently open session (lunch break or EOD).
const tapOut = async (req, res) => {
  try {
    const date = todayDateOnly();

    const sessions = await Attendance.findAll({
      where: { employeeId: req.user.id, date },
      order: [["sessionNo", "ASC"]],
    });

    const record = sessions.find((s) => !s.timeOut);
    if (!record) {
      return res.status(400).json({ success: false, message: "You haven't tapped in yet" });
    }

    const timeOut = nowHHMM();
    const durationMinutes = Math.max(0, toMinutes(timeOut) - toMinutes(record.timeIn));

    record.timeOut = timeOut;
    record.durationMinutes = durationMinutes;
    record.totalHours = durationMinutes / 60;
    record.status = "Completed";
    await record.save();

    const summary = summarize(sessions);
    const payload = { record, sessions, summary, department: req.user.department };
    emitToAdmins("attendance:tapOut", payload);
    emitToAdmins("attendanceUpdated", payload);
    emitToUser(req.user.id, "attendanceUpdated", payload);

    return res.status(200).json({ success: true, record, sessions, summary });
  } catch (error) {
    console.error("Tap out error:", error);
    return res.status(500).json({ success: false, message: "Server error tapping out" });
  }
};

// Employee: today's own attendance status, for the Tap In/Out card to
// restore its state on page load/refresh.
const getMyTodayAttendance = async (req, res) => {
  try {
    const sessions = await Attendance.findAll({
      where: { employeeId: req.user.id, date: todayDateOnly() },
      order: [["sessionNo", "ASC"]],
    });
    const summary = summarize(sessions);
    // "record" kept for backward compatibility with older frontend code —
    // it's the most recent (or currently open) session.
    const record = sessions[sessions.length - 1] || null;
    return res.status(200).json({ success: true, record, sessions, summary });
  } catch (error) {
    console.error("Get today attendance error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching today's attendance" });
  }
};

// Admin: live attendance sheet — every employee's sessions for a day,
// grouped into one row per employee, optionally filtered by employee/department.
const getAllAttendance = async (req, res) => {
  try {
    const { date, employeeId, department } = req.query;
    const where = { date: date || todayDateOnly() };
    if (employeeId) where.employeeId = employeeId;

    const records = await Attendance.findAll({ where, order: [["employeeId", "ASC"], ["sessionNo", "ASC"]] });

    const employeeIds = [...new Set(records.map((r) => r.employeeId))];
    const users = await User.findAll({ where: { id: employeeIds }, attributes: ["id", "department", "role"] });
    const userById = {};
    users.forEach((u) => { userById[u.id] = u; });

    const byEmployee = {};
    records.forEach((r) => {
      if (!byEmployee[r.employeeId]) byEmployee[r.employeeId] = [];
      byEmployee[r.employeeId].push(r);
    });

    let rows = Object.entries(byEmployee).map(([empId, sessions]) => {
      const summary = summarize(sessions);
      const user = userById[empId] || {};
      return {
        employeeId: empId,
        employeeName: sessions[0].employeeName,
        department: user.department || "—",
        role: user.role || "employee",
        date: sessions[0].date,
        sessions: sessions.map((s) => ({ sessionNo: s.sessionNo, timeIn: s.timeIn, timeOut: s.timeOut, durationMinutes: s.durationMinutes })),
        morningIn: sessions[0]?.timeIn || null,
        lunchOut: sessions[0]?.timeOut || null,
        resumeIn: sessions[1]?.timeIn || null,
        finalOut: sessions[1]?.timeOut || null,
        workingMinutes: summary.workingMinutes,
        breakMinutes: summary.breakMinutes,
        status: summary.status,
      };
    });

    if (department) rows = rows.filter((r) => r.department === department);

    return res.status(200).json({ success: true, records: rows, attendances: rows });
  } catch (error) {
    console.error("Get all attendance error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching attendance" });
  }
};

// Employee: history and summary stats (each day rolled up from its sessions)
const getMyHistory = async (req, res) => {
  try {
    const allRecords = await Attendance.findAll({
      where: { employeeId: req.user.id },
      order: [["date", "DESC"], ["sessionNo", "ASC"]],
      limit: 60,
    });

    const byDate = {};
    allRecords.forEach((r) => {
      if (!byDate[r.date]) byDate[r.date] = [];
      byDate[r.date].push(r);
    });

    const days = Object.keys(byDate)
      .sort((a, b) => (a < b ? 1 : -1))
      .slice(0, 5)
      .map((date) => {
        const sessions = byDate[date];
        const summary = summarize(sessions);
        return {
          id: sessions[0].id,
          date,
          timeIn: sessions[0]?.timeIn || null,
          timeOut: sessions[sessions.length - 1]?.timeOut || null,
          sessions: sessions.map((s) => ({ sessionNo: s.sessionNo, timeIn: s.timeIn, timeOut: s.timeOut })),
          totalHours: summary.workingMinutes / 60,
          workingMinutes: summary.workingMinutes,
          breakMinutes: summary.breakMinutes,
          status: summary.status === "Working" || summary.status === "On Break" ? "Working" : summary.status,
        };
      });

    const d = new Date();
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
    const todayStr = d.toISOString().slice(0, 10);
    const monthDates = Object.keys(byDate).filter((dt) => dt >= firstDay && dt <= todayStr);

    const totalDaysInMonthSoFar = d.getDate();
    const presentDays = monthDates.length;
    const lateArrivals = 0;
    const absentDays = Math.max(0, totalDaysInMonthSoFar - presentDays);
    const attendancePercent = totalDaysInMonthSoFar > 0 ? Math.round((presentDays / totalDaysInMonthSoFar) * 100) : 0;

    const summary = { presentDays, absentDays, lateArrivals, attendancePercent };

    return res.status(200).json({ success: true, records: days, summary });
  } catch (error) {
    console.error("Get my history error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching history" });
  }
};

module.exports = { tapIn, tapOut, getMyTodayAttendance, getAllAttendance, getMyHistory, MAX_SESSIONS_PER_DAY };
