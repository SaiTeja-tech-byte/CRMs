import React, { useState, useEffect } from "react";
import attendanceService from "../../services/attendanceService";

const AttendanceWidget = ({ profile }) => {
  const [attendance, setAttendance] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        attendanceService.getToday(),
        attendanceService.getHistory()
      ]);
      if (todayRes.success) {
        setAttendance(todayRes.record);
      }
      if (historyRes.success) {
        setHistoryRecords(historyRes.records || []);
        setSummary(historyRes.summary || null);
      }
    } catch (err) {
      console.error("Failed to load attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTapIn = async () => {
    try {
      const res = await attendanceService.tapIn();
      if (res.success) {
        setAttendance(res.record);
        fetchData(); // Refresh history
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
        setAttendance(res.record);
        fetchData(); // Refresh history
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to tap out");
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
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "--:--";
    }
  };
  
  const formatTotalHours = (hoursFloat) => {
    if (!hoursFloat) return "0h 0m";
    const h = Math.floor(hoursFloat);
    const m = Math.round((hoursFloat - h) * 60);
    return `${h}h ${m}m`;
  };

  const status = attendance?.status || "Not Checked In";
  const tapInTimeStr = formatTimeStr(attendance?.timeIn);
  const tapOutTimeStr = formatTimeStr(attendance?.timeOut);
  
  // Calculate live working hours if currently working
  let workingHours = formatTotalHours(attendance?.totalHours);
  if (status === "Working" && attendance?.timeIn) {
     const [inH, inM] = attendance.timeIn.split(":").map(Number);
     const now = new Date();
     const currentH = now.getHours();
     const currentM = now.getMinutes();
     const currentTotal = Math.max(0, (currentH * 60 + currentM - (inH * 60 + inM)) / 60);
     workingHours = formatTotalHours(currentTotal) + " (Live)";
  }

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
                  Attendance Completed
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

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-around", fontSize: "13px", padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#64748b", fontWeight: "500" }}>Time In</span>
              <span style={{ fontWeight: "700", color: "#0f172a" }}>{tapInTimeStr}</span>
            </div>
            <div style={{ width: "1px", background: "#e2e8f0" }}></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#64748b", fontWeight: "500" }}>Time Out</span>
              <span style={{ fontWeight: "700", color: "#0f172a" }}>{tapOutTimeStr}</span>
            </div>
          </div>
          
          {/* Today's Timeline */}
          {attendance && (
            <div style={{ marginTop: "24px" }}>
              <h6 style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Today's Timeline</h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {attendance.timeIn && (
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}><strong style={{ color: "#0f172a" }}>{tapInTimeStr}</strong> Checked In</span>
                  </div>
                )}
                {attendance.timeOut && (
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }}></span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}><strong style={{ color: "#0f172a" }}>{tapOutTimeStr}</strong> Checked Out</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Summary Cards */}
      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[
            { label: "Present Days", value: summary.presentDays },
            { label: "Absent Days", value: summary.absentDays },
            { label: "Late Arrivals", value: summary.lateArrivals },
            { label: "Attendance %", value: summary.attendancePercent + "%" }
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
          <button style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>View All</button>
        </div>
        
        {historyRecords.length > 0 ? (
          <div className="table-responsive">
            <table className="table ew-table mb-0" style={{ fontSize: "13.5px" }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>In</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Out</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Hours</th>
                  <th style={{ padding: "12px 24px", color: "#64748b", fontWeight: "600" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {historyRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ fontWeight: "600", color: "#0f172a" }}>{new Date(record.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{formatTimeStr(record.timeIn)}</td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{formatTimeStr(record.timeOut)}</td>
                    <td style={{ padding: "16px 24px", fontWeight: "600", color: "#0f172a" }}>{formatTotalHours(record.totalHours)}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "4px", 
                        fontSize: "12px", 
                        fontWeight: "600",
                        background: record.status === "Completed" ? "#eff6ff" : (record.status === "Absent" ? "#f1f5f9" : "#fffbeb"),
                        color: record.status === "Completed" ? "#2563eb" : (record.status === "Absent" ? "#64748b" : "#d97706")
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
