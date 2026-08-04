import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import attendanceService from "../services/attendanceService";

const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAttendanceData = useCallback(async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        attendanceService.getToday(),
        attendanceService.getHistory()
      ]);
      if (todayRes.success) {
        setAttendance(todayRes.record);
      }
      if (historyRes.success) {
        setHistory(historyRes.records || []);
        setSummary(historyRes.summary || null);
      }
    } catch (err) {
      console.error("Failed to load attendance data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleAction = async (actionFn, confirmMessage = null) => {
    if (actionLoading) return;
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setActionLoading(true);
    try {
      const res = await actionFn();
      if (res.success) {
        setAttendance(res.record);
        // Refresh history to update the latest records table
        fetchAttendanceData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const tapIn = () => handleAction(attendanceService.tapIn);
  const takeBreak = () => handleAction(attendanceService.takeBreak);
  const resume = () => handleAction(attendanceService.resume);
  const tapOut = () => handleAction(attendanceService.tapOut, "Are you sure you want to tap out? This completes your attendance for today.");

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        history,
        summary,
        loading,
        actionLoading,
        tapIn,
        takeBreak,
        resume,
        tapOut,
        refresh: fetchAttendanceData
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
