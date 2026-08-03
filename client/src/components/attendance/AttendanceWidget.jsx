import React, { useState, useEffect } from "react";
import attendanceService from "../../services/attendanceService";
import { onSocketEvent, connectSocket } from "../../services/socketService";

const AttendanceWidget = ({ profile }) => {
  const [sessions, setSessions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historySummary, setHistorySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        attendanceService.getToday(),
        attendanceService.getHistory(),
      ]);
      if (todayRes.success) {
        setSessions(todayRes.sessions || []);
        setSummary(todayRes.summary || null);
      }
      if (historyRes.success) {
        setHistoryRecords(historyRes.records || []);
        setHistorySummary(historyRes.summary || null);
      }
    } catch (err) {
      console.error("Failed to load attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    connectSocket();
    const unsub = onSocketEvent("attendanceUpdated", (payload) => {
      if (payload?.sessions) {
        setSessions(payload.sessions);
        setSummary(payload.summary);
      }
    });
    return unsub;
  }, []);

  const handleTapIn = async () => {
    setError("");
    setActing(true);
    try {
      const res = await attendanceService.tapIn();
      if (res.success) {
        setSessions(res.sessions || []);
        setSummary(res.summary || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to tap in");
    } finally {
      setActing(false);
    }
  };

  const handleTapOut = async () => {
    setError("");
    setActing(true);
    try {
      const res = await attendanceService.tapOut();
      if (res.success) {
        setSessions(res.sessions || []);
        setSummary(res.summary || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to tap out");
    } finally {
      setActing(false);
    }
  };

  // Convert HH:MM string to HH:MM AM/PM
  const formatTimeStr = (timeStr) => {
    if (!timeStr) return "--:--";
    try {
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "--:--";
    }
  };

  const formatMinutes = (mins) => {
    if (!mins) return "0h 0m";
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}h ${m}m`;
  };

  const status = summary?.status || "Not Checked In";
  const openSession = sessions.find((s) => !s.timeOut);
  const maxSessions = summary?.maxSessions ?? 2;
  const canTapInAgain = status !== "Working" && sessions.length < maxSessions;

  // Live working/break minutes tick every second between fetches.
  let liveWorkingMinutes = summary?.workingMinutes || 0;
  let liveBreakMinutes = summary?.breakMinutes || 0;
  if (status === "Working" && openSession) {
    const [inH, inM] = openSession.timeIn.split(":").map(Number);
    const now = currentTime;
    const elapsed = Math.max(0, (now.getHours() * 60 + now.getMinutes() - (inH * 60 + inM)));
    const closedMinutes = sessions.filter((s) => s.timeOut).reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    liveWorkingMinutes = closedMinutes + elapsed;
  } else if (status === "On Break") {
    const lastClosed = sessions[sessions.length - 1];
    if (lastClosed?.timeOut) {
      const [outH, outM] = lastClosed.timeOut.split(":").map(Number);
      const now = currentTime;
      const elapsedSinceLastOut = Math.max(0, now.getHours() * 60 + now.getMinutes() - (outH * 60 + outM));
      // breakMinutes from prior (already-closed) gaps between sessions, plus live break so far.
      const priorGapMinutes = sessions.slice(0, -1).reduce((sum, s, idx) => {
        const next = sessions[idx + 1];
        if (s.timeOut && next) {
          return sum + Math.max(0, (parseInt(next.timeIn.split(":")[0]) * 60 + parseInt(next.timeIn.split(":")[1])) - (parseInt(s.timeOut.split(":")[0]) * 60 + parseInt(s.timeOut.split(":")[1])));
        }
        return sum;
      }, 0);
      liveBreakMinutes = priorGapMinutes + elapsedSinceLastOut;
    }
  }

  const getStatusColor = (s) => {
    switch (s) {
      case "Working": return "#f59e0b";
      case "On Break": return "#f97316";
      case "Completed": return "#3b82f6";
      case "Absent": return "#64748b";
      default: return "#94a3b8";
    }
  };

  const buttonLabel = () => {
    if (status === "Not Checked In") return sessions.length === 0 ? "Tap In" : "Resume Work";
    if (status === "Working") return openSession?.sessionNo >= 2 ? "Tap Out" : "Tap Out (Break)";
    if (status === "On Break") return "Resume Work";
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="ew-card" style={{ display: "flex", flexWrap: "wrap", overflow: "hidden" }}>
        {/* Left Section: Employee Info */}
        <div style={{ flex: "1 1 300px", padding: "24px", borderRight: "1px solid #f1f5f9", background: "#f8fafc" }}>
          <h5 style={{ fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>Today's Attendance</h5>

          {profile ? (
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                {profile.firstName} {profile.lastName}
              </div>
              <div style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600", marginBottom: "16px" }}>
                {profile.designation || "Employee"}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#64748b", fontWeight: "500" }}>Department</span>
                  <span style={{ color: "#0f172a", fontWeight: "600" }}>{profile.department || "N/A"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#64748b", fontWeight: "500" }}>Work Mode</span>
                  <span style={{ color: "#0f172a", fontWeight: "600" }}>{profile.workMode || "Office"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#64748b", fontWeight: "500" }}>Employee ID</span>
                  <span style={{ color: "#0f172a", fontWeight: "600" }}>{profile.employeeId || "N/A"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "13px", color: "#64748b" }}>Loading employee info...</div>
          )}
        </div>

        {/* Right Section: Attendance Action */}
        <div style={{ flex: "2 1 400px", padding: "24px", display: "flex", flexDirection: "column" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <i className="bi bi-clock" style={{ fontSize: "20px", color: "#64748b" }}></i>
                <h4 style={{ margin: 0, fontWeight: "800", color: "#0f172a" }}>
                  {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </h4>
              </div>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              {status === "Completed" ? (
                <button
                  disabled
                  style={{ padding: "10px 28px", borderRadius: "8px", background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", fontWeight: "600", fontSize: "14px", cursor: "not-allowed" }}
                >
                  Done for Today
                </button>
              ) : (
                <button
                  onClick={status === "Working" ? handleTapOut : handleTapIn}
                  disabled={loading || acting || (status === "Not Checked In" && !canTapInAgain)}
                  style={{
                    padding: "10px 28px", borderRadius: "8px",
                    background: status === "Working" ? "#ef4444" : "#2563eb",
                    color: "#fff", border: "none", fontWeight: "600", fontSize: "14px",
                    cursor: acting ? "wait" : "pointer", transition: "all 0.2s",
                  }}
                >
                  {acting ? "..." : buttonLabel()}
                </button>
              )}
            </div>
          </div>

          {error && <div className="alert alert-danger py-1 px-3 mb-3 small">{error}</div>}

          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600" }}>Working Time</span>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>{formatMinutes(liveWorkingMinutes)}</span>
            </div>

            <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600" }}>Break Time</span>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>{formatMinutes(liveBreakMinutes)}</span>
            </div>

            <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600" }}>Status</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: getStatusColor(status) }}></span>
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>{status}</span>
              </div>
            </div>
          </div>

          {/* Session breakdown */}
          <div style={{ marginTop: "24px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {Array.from({ length: maxSessions }).map((_, idx) => {
              const s = sessions[idx];
              const label = idx === 0 ? "Morning Session" : "Afternoon Session";
              return (
                <div key={idx} style={{ flex: "1 1 200px", padding: "14px 16px", background: "#f8fafc", borderRadius: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "6px" }}>{label}</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: s ? "#0f172a" : "#cbd5e1" }}>
                    {s ? `${formatTimeStr(s.timeIn)} → ${formatTimeStr(s.timeOut)}` : "--:-- → --:--"}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Summary Cards */}
      {historySummary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[
            { label: "Present Days", value: historySummary.presentDays },
            { label: "Absent Days", value: historySummary.absentDays },
            { label: "Late Arrivals", value: historySummary.lateArrivals },
            { label: "Attendance %", value: historySummary.attendancePercent + "%" },
          ].map((item, idx) => (
            <div key={idx} className="ew-card" style={{ padding: "20px", textAlign: "center", background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <span style={{ display: "block", fontSize: "13px", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>{item.label}</span>
              <span style={{ display: "block", fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* History Table */}
      <div className="ew-card" style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
          <h5 style={{ fontWeight: "700", margin: 0, color: "#0f172a" }}>Recent Attendance</h5>
        </div>

        {historyRecords.length > 0 ? (
          <div className="table-responsive">
            <table className="table ew-table mb-0" style={{ fontSize: "13.5px" }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Morning In</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Lunch Out</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Resume In</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Final Out</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Working</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Break</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {historyRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ fontWeight: "600", color: "#0f172a" }}>{new Date(record.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{formatTimeStr(record.sessions?.[0]?.timeIn)}</td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{formatTimeStr(record.sessions?.[0]?.timeOut)}</td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{formatTimeStr(record.sessions?.[1]?.timeIn)}</td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{formatTimeStr(record.sessions?.[1]?.timeOut)}</td>
                    <td style={{ padding: "16px 24px", fontWeight: "600", color: "#0f172a" }}>{formatMinutes(record.workingMinutes)}</td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{formatMinutes(record.breakMinutes)}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: record.status === "Completed" ? "#eff6ff" : (record.status === "Absent" ? "#f1f5f9" : "#fffbeb"),
                        color: record.status === "Completed" ? "#2563eb" : (record.status === "Absent" ? "#64748b" : "#d97706"),
                      }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "14px" }}>
            No recent attendance records found.
          </div>
        )}
      </div>

    </div>
  );
};

export default AttendanceWidget;
