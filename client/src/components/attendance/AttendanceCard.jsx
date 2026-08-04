import React, { useState, useEffect } from "react";
import { useAttendance } from "../../context/AttendanceContext";
import AttendanceTimer from "./AttendanceTimer";

const AttendanceCard = () => {
  const { attendance, tapIn, takeBreak, resume, tapOut, actionLoading, loading } = useAttendance();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTotalHours = (minutesTotal) => {
    if (!minutesTotal || minutesTotal < 0) return "0h 0m";
    const h = Math.floor(minutesTotal / 60);
    const m = Math.floor(minutesTotal % 60);
    return `${h}h ${m}m`;
  };

  const status = attendance?.status || "Not Checked In";
  
  const getStatusColor = (s) => {
    switch (s) {
      case "Working": return "#f59e0b";
      case "On Break": return "#6366f1";
      case "Completed": return "#3b82f6";
      case "Absent": return "#64748b";
      case "Late": return "#f97316";
      default: return "#94a3b8";
    }
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <i className="bi bi-clock" style={{ fontSize: "20px", color: "#64748b" }}></i>
            <h4 style={{ margin: 0, fontWeight: "800", color: "#0f172a" }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h4>
          </div>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {status === "Not Checked In" && (
            <button 
              onClick={tapIn} 
              disabled={loading || actionLoading}
              style={{ padding: "10px 28px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
            >
              {actionLoading ? "Saving..." : "Tap In"}
            </button>
          )}

          {status === "Working" && (
            <>
              <button 
                onClick={takeBreak} 
                disabled={actionLoading}
                style={{ padding: "10px 24px", borderRadius: "8px", background: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
              >
                {actionLoading ? "Saving..." : "Take Break"}
              </button>
              <button 
                onClick={tapOut} 
                disabled={actionLoading}
                style={{ padding: "10px 24px", borderRadius: "8px", background: "#ef4444", color: "#fff", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
              >
                {actionLoading ? "Saving..." : "Tap Out"}
              </button>
            </>
          )}

          {status === "On Break" && (
            <button 
              onClick={resume} 
              disabled={actionLoading}
              style={{ padding: "10px 28px", borderRadius: "8px", background: "#10b981", color: "#fff", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
            >
              {actionLoading ? "Saving..." : "Resume Work"}
            </button>
          )}

          {status === "Completed" && (
            <button 
              disabled
              style={{ padding: "10px 28px", borderRadius: "8px", background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", fontWeight: "600", fontSize: "14px", cursor: "not-allowed" }}
            >
              Attendance Completed
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        <AttendanceTimer />
        
        <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
          <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600" }}>Break Time</span>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
            {formatTotalHours(attendance?.totalBreakMinutes || 0)}
          </span>
        </div>

        <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
          <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600" }}>Status</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: getStatusColor(status) }}></span>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
