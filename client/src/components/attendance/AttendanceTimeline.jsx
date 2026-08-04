import React from "react";
import { useAttendance } from "../../context/AttendanceContext";

const AttendanceTimeline = () => {
  const { attendance } = useAttendance();

  // Convert HH:MM string to HH:MM AM/PM
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

  const tapInTimeStr = formatTimeStr(attendance?.morningCheckIn);
  const breakTimeStr = formatTimeStr(attendance?.lunchOut);
  const resumeTimeStr = formatTimeStr(attendance?.lunchResume);
  const tapOutTimeStr = formatTimeStr(attendance?.finalCheckOut);

  return (
    <div style={{ marginTop: "24px" }}>
      <h6 style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Today's Timeline</h6>
      {!attendance ? (
        <div style={{ fontSize: "12px", color: "#94a3b8" }}>No activity yet today.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {attendance.morningCheckIn && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
              <span style={{ fontSize: "12px", color: "#64748b" }}><strong style={{ color: "#0f172a" }}>{tapInTimeStr}</strong> Checked In</span>
            </div>
          )}
          {attendance.lunchOut && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b" }}></span>
              <span style={{ fontSize: "12px", color: "#64748b" }}><strong style={{ color: "#0f172a" }}>{breakTimeStr}</strong> Break</span>
            </div>
          )}
          {attendance.lunchResume && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" }}></span>
              <span style={{ fontSize: "12px", color: "#64748b" }}><strong style={{ color: "#0f172a" }}>{resumeTimeStr}</strong> Resume</span>
            </div>
          )}
          {attendance.finalCheckOut && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }}></span>
              <span style={{ fontSize: "12px", color: "#64748b" }}><strong style={{ color: "#0f172a" }}>{tapOutTimeStr}</strong> Checked Out</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceTimeline;
