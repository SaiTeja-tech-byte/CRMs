import React from "react";
import { AttendanceProvider, useAttendance } from "../../context/AttendanceContext";
import AttendanceCard from "./AttendanceCard";
import AttendanceTimeline from "./AttendanceTimeline";
import AttendanceSummary from "./AttendanceSummary";
import AttendanceHistory from "./AttendanceHistory";
import "./AttendanceWidget.css";

const AttendanceWidgetContent = ({ profile }) => {
  const { loading } = useAttendance();

  if (loading) {
    return (
      <div className="ew-widget-container">
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          Loading attendance data...
        </div>
      </div>
    );
  }

  return (
    <div className="ew-widget-container" style={{ marginBottom: "24px" }}>
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex" }}>
        
        {/* Left Section - User Profile (Similar to Shnoor) */}
        <div style={{ width: "300px", borderRight: "1px solid #e2e8f0", padding: "24px", display: "flex", flexDirection: "column" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f1f5f9", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "700", color: "#64748b" }}>
              {profile?.fullName?.charAt(0) || "U"}
            </div>
            <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{profile?.fullName}</h3>
            <span style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600", display: "inline-block", background: "#eff6ff", padding: "4px 12px", borderRadius: "20px", marginBottom: "8px" }}>
              {profile?.role || "Employee"}
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <span style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Department</span>
              <span style={{ fontSize: "14px", color: "#334155", fontWeight: "500" }}>{profile?.department || "N/A"}</span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Work Mode</span>
              <span style={{ fontSize: "14px", color: "#334155", fontWeight: "500" }}>Office</span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Employee ID</span>
              <span style={{ fontSize: "14px", color: "#334155", fontWeight: "500" }}>{profile?.employeeId || "N/A"}</span>
            </div>
          </div>
          
          <AttendanceTimeline />
        </div>

        {/* Right Section - Attendance Card */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <AttendanceCard />
        </div>
      </div>

      {/* Summary Cards */}
      <AttendanceSummary />

      {/* History Table */}
      <AttendanceHistory />
    </div>
  );
};

export default function AttendanceWidget({ profile }) {
  return (
    <AttendanceProvider>
      <AttendanceWidgetContent profile={profile} />
    </AttendanceProvider>
  );
}
