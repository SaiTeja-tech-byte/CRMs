import React from "react";
import { useAttendance } from "../../context/AttendanceContext";

const AttendanceSummary = () => {
  const { summary } = useAttendance();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "24px" }}>
      <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center" }}>
        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>Present Days</div>
        <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{summary?.presentDays || 0}</div>
      </div>
      <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center" }}>
        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>Absent Days</div>
        <div style={{ fontSize: "24px", fontWeight: "800", color: "#ef4444" }}>{summary?.absentDays || 0}</div>
      </div>
      <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center" }}>
        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>Late Arrivals</div>
        <div style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b" }}>{summary?.lateArrivals || 0}</div>
      </div>
      <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center" }}>
        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>Attendance %</div>
        <div style={{ fontSize: "24px", fontWeight: "800", color: "#10b981" }}>{summary?.attendancePercent || 0}%</div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
