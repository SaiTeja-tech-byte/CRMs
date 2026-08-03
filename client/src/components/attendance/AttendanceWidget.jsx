import React, { useState, useEffect } from "react";
import attendanceService from "../../services/attendanceService";

const AttendanceWidget = ({ profile }) => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await attendanceService.getToday();
      if (res.success) {
        setAttendance(res.attendance);
      }
    } catch (err) {
      console.error("Failed to load today's attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const handleTapIn = async () => {
    try {
      const res = await attendanceService.tapIn();
      if (res.success) {
        setAttendance(res.attendance);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to tap in");
    }
  };

  const handleTapOut = async () => {
    if (!window.confirm("Are you sure you want to tap out? This completes your attendance for today.")) return;
    try {
      const res = await attendanceService.tapOut();
      if (res.success) {
        setAttendance(res.attendance);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to tap out");
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const status = attendance?.status || "Not Checked In";
  const tapInTimeStr = formatTime(attendance?.tapInTime);
  const tapOutTimeStr = formatTime(attendance?.tapOutTime);
  const workingHours = attendance?.workingHours || "0h 0m";

  const getStatusColor = (s) => {
    switch (s) {
      case "Working": return "#f59e0b";
      case "Completed": return "#3b82f6";
      case "Absent": return "#64748b";
      case "Late": return "#f97316";
      case "Present": return "#10b981";
      default: return "#94a3b8";
    }
  };

  return (
    <div className="ew-card mb-4" style={{ display: "flex", flexWrap: "wrap", overflow: "hidden" }}>
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
                onClick={handleTapIn} 
                disabled={loading}
                style={{ padding: "10px 28px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}
              >
                Tap In
              </button>
            )}
            {status === "Working" && (
              <button 
                onClick={handleTapOut} 
                disabled={loading}
                style={{ padding: "10px 28px", borderRadius: "8px", background: "#ef4444", color: "#fff", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}
              >
                Tap Out
              </button>
            )}
            {status === "Completed" && (
              <button 
                disabled
                style={{ padding: "10px 28px", borderRadius: "8px", background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", fontWeight: "600", fontSize: "14px", cursor: "not-allowed" }}
              >
                Completed
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
            <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600" }}>Working Hours</span>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>{workingHours}</span>
          </div>
          
          <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
            <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600" }}>Status</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: getStatusColor(status) }}></span>
              <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>{status}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-around", fontSize: "13px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ color: "#64748b", fontWeight: "500" }}>Tap In Time</span>
            <span style={{ fontWeight: "700", color: "#0f172a" }}>{tapInTimeStr}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ color: "#64748b", fontWeight: "500" }}>Tap Out Time</span>
            <span style={{ fontWeight: "700", color: "#0f172a" }}>{tapOutTimeStr}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceWidget;
