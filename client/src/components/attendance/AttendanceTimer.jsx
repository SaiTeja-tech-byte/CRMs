import React, { useState, useEffect } from "react";
import { useAttendance } from "../../context/AttendanceContext";

const formatTotalHours = (minutesTotal) => {
  if (!minutesTotal || minutesTotal < 0) return "0h 0m";
  const h = Math.floor(minutesTotal / 60);
  const m = Math.floor(minutesTotal % 60);
  return `${h}h ${m}m`;
};

const AttendanceTimer = () => {
  const { attendance } = useAttendance();
  const [liveMinutes, setLiveMinutes] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      if (!attendance) {
        setLiveMinutes(0);
        return;
      }
      
      if (attendance.status === "Completed") {
        setLiveMinutes(attendance.totalWorkingMinutes || 0);
        return;
      }

      if (attendance.status === "On Break" && attendance.lunchOut) {
        // Frozen at the time they took a break
        const [inH, inM] = attendance.morningCheckIn.split(":").map(Number);
        const [outH, outM] = attendance.lunchOut.split(":").map(Number);
        const grossMinutes = (outH * 60 + outM) - (inH * 60 + inM);
        setLiveMinutes(Math.max(0, grossMinutes - (attendance.totalBreakMinutes || 0)));
        return;
      }

      if (attendance.status === "Working" && attendance.morningCheckIn) {
        // Ticking live
        const [inH, inM] = attendance.morningCheckIn.split(":").map(Number);
        const now = new Date();
        const currentH = now.getHours();
        const currentM = now.getMinutes();
        const grossMinutes = (currentH * 60 + currentM) - (inH * 60 + inM);
        setLiveMinutes(Math.max(0, grossMinutes - (attendance.totalBreakMinutes || 0)));
      } else {
        setLiveMinutes(0);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [attendance]);

  return (
    <div style={{ flex: 1, padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
      <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600" }}>Working Time</span>
      <span style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
        {formatTotalHours(liveMinutes)}
      </span>
    </div>
  );
};

export default AttendanceTimer;
