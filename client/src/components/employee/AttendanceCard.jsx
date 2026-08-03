import React, { useState, useEffect, useCallback } from "react";
import attendanceService from "../../services/attendanceService";
import { onSocketEvent, connectSocket } from "../../services/socketService";

const AttendanceCard = () => {
  const [sessions, setSessions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    attendanceService
      .getToday()
      .then((res) => {
        if (res.success) {
          setSessions(res.sessions || []);
          setSummary(res.summary || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    connectSocket();
    const unsub = onSocketEvent("attendanceUpdated", (payload) => {
      if (payload?.sessions) {
        setSessions(payload.sessions);
        setSummary(payload.summary);
      }
    });
    return unsub;
  }, [load]);

  const status = summary?.status || "Not Checked In";
  const openSession = sessions.find((s) => !s.timeOut);
  const maxSessions = summary?.maxSessions ?? 2;
  const canTapInAgain = status !== "Working" && sessions.length < maxSessions;

  const handleTap = async () => {
    setError("");
    setActing(true);
    try {
      const res = status === "Working" ? await attendanceService.tapOut() : await attendanceService.tapIn();
      if (res.success) {
        setSessions(res.sessions || []);
        setSummary(res.summary || null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setActing(false);
    }
  };

  const buttonLabel = () => {
    if (status === "Working") return openSession?.sessionNo >= 2 ? "Tap Out" : "Tap Out (Break)";
    if (status === "On Break") return "Resume Work";
    return sessions.length === 0 ? "Tap In" : "Resume Work";
  };

  const isCompleted = status === "Completed";

  return (
    <div className="ew-card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "50%",
          background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <i className="bi bi-clock-history" style={{ color: "#2563eb", fontSize: "18px" }}></i>
        </div>
        <div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
          {isCompleted ? (
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
              <span className="badge bg-success me-2">Completed</span>
              {sessions[0]?.timeIn} → {sessions[sessions.length - 1]?.timeOut}
            </div>
          ) : status === "Working" ? (
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
              <span className="badge bg-warning text-dark me-2">Working</span>
              Time In: {openSession?.timeIn}
            </div>
          ) : status === "On Break" ? (
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
              <span className="badge bg-info text-dark me-2">On Break</span>
              Tap in to resume
            </div>
          ) : (
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#94a3b8", marginTop: "2px" }}>Not tapped in yet</div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>Session {sessions.length + (openSession ? 0 : 1) || 1}</div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
            {sessions.length}/{maxSessions}
          </div>
        </div>

        {loading ? (
          <button className="btn btn-sm btn-light border" disabled style={{ width: "130px" }}>...</button>
        ) : isCompleted ? (
          <button className="btn btn-sm btn-light border" disabled style={{ width: "130px", fontWeight: 700 }}>Done for today</button>
        ) : (
          <button
            className={`btn btn-sm ${status === "Working" ? "btn-danger" : "btn-primary"}`}
            style={{ width: "130px", fontWeight: 700 }}
            onClick={handleTap}
            disabled={acting || (status !== "Working" && !canTapInAgain)}
          >
            {acting ? "..." : buttonLabel()}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger py-1 px-3 mb-0 small" style={{ width: "100%" }}>{error}</div>}
    </div>
  );
};

export default AttendanceCard;
