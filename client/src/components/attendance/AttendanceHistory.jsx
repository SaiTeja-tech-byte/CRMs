import React from "react";
import { useAttendance } from "../../context/AttendanceContext";

const AttendanceHistory = () => {
  const { history } = useAttendance();

  const formatTotalHours = (minutesTotal) => {
    if (!minutesTotal || minutesTotal < 0) return "0h 0m";
    const h = Math.floor(minutesTotal / 60);
    const m = Math.floor(minutesTotal % 60);
    return `${h}h ${m}m`;
  };

  const formatTimeStr = (timeStr) => {
    if (!timeStr) return "--:--";
    try {
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "--:--";
    }
  };

  return (
    <div style={{ marginTop: "24px", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Recent Attendance</h3>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "12px 20px", fontWeight: "600", color: "#64748b" }}>Date</th>
              <th style={{ padding: "12px 20px", fontWeight: "600", color: "#64748b" }}>Check In</th>
              <th style={{ padding: "12px 20px", fontWeight: "600", color: "#64748b" }}>Break</th>
              <th style={{ padding: "12px 20px", fontWeight: "600", color: "#64748b" }}>Resume</th>
              <th style={{ padding: "12px 20px", fontWeight: "600", color: "#64748b" }}>Check Out</th>
              <th style={{ padding: "12px 20px", fontWeight: "600", color: "#64748b" }}>Working</th>
              <th style={{ padding: "12px 20px", fontWeight: "600", color: "#64748b" }}>Break Time</th>
              <th style={{ padding: "12px 20px", fontWeight: "600", color: "#64748b" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(!history || history.length === 0) ? (
              <tr>
                <td colSpan="8" style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>No records found.</td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 20px", color: "#0f172a", fontWeight: "500" }}>
                    {new Date(record.attendanceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </td>
                  <td style={{ padding: "12px 20px", color: "#475569" }}>{formatTimeStr(record.morningCheckIn)}</td>
                  <td style={{ padding: "12px 20px", color: "#475569" }}>{formatTimeStr(record.lunchOut)}</td>
                  <td style={{ padding: "12px 20px", color: "#475569" }}>{formatTimeStr(record.lunchResume)}</td>
                  <td style={{ padding: "12px 20px", color: "#475569" }}>{formatTimeStr(record.finalCheckOut)}</td>
                  <td style={{ padding: "12px 20px", color: "#0f172a", fontWeight: "600" }}>{formatTotalHours(record.totalWorkingMinutes)}</td>
                  <td style={{ padding: "12px 20px", color: "#64748b" }}>{formatTotalHours(record.totalBreakMinutes)}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: "4px", 
                      fontSize: "11px", 
                      fontWeight: "600",
                      background: record.status === "Completed" ? "#eff6ff" : (record.status === "Working" ? "#fef3c7" : "#f1f5f9"),
                      color: record.status === "Completed" ? "#3b82f6" : (record.status === "Working" ? "#d97706" : "#64748b")
                    }}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistory;
