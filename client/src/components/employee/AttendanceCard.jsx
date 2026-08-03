import React, { useState, useEffect, useCallback } from "react";
import { tapIn, tapOut, getMyTodayAttendance } from "../../services/attendanceApi";
import { onSocketEvent, connectSocket } from "../../services/socketService";

const AttendanceCard = () => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    getMyTodayAttendance()
      .then((r) => setRecord(r))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    connectSocket();
    // Own-room event — keeps this card (and any other open tab/device)
    // in sync the instant a tap happens, no refresh needed.
    const unsub = onSocketEvent("attendanceUpdated", ({ record: updated }) => {
      if (updated?.date === new Date().toISOString().slice(0, 10)) setRecord(updated);
    });
    return unsub;
  }, [load]);

  const handleTap = async () => {
    setError("");
    setActing(true);
    try {
      const updated = record ? await tapOut() : await tapIn();
      setRecord(updated);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setActing(false);
    }
  };

  const isTappedIn = record && !record.timeOut;
  const isCompleted = record && record.timeOut;

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
              {record.timeIn} → {record.timeOut}
            </div>
          ) : isTappedIn ? (
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
              <span className="badge bg-warning text-dark me-2">Working</span>
              Time In: {record.timeIn}
            </div>
          ) : (
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#94a3b8", marginTop: "2px" }}>Not tapped in yet</div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>Time In</div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: record?.timeIn ? "#0f172a" : "#cbd5e1" }}>{record?.timeIn || "--:--"}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>Time Out</div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: record?.timeOut ? "#0f172a" : "#cbd5e1" }}>{record?.timeOut || "--:--"}</div>
        </div>

        {loading ? (
          <button className="btn btn-sm btn-light border" disabled style={{ width: "110px" }}>...</button>
        ) : isCompleted ? (
          <button className="btn btn-sm btn-light border" disabled style={{ width: "110px", fontWeight: 700 }}>Done for today</button>
        ) : (
          <button
            className={`btn btn-sm ${isTappedIn ? "btn-danger" : "btn-primary"}`}
            style={{ width: "110px", fontWeight: 700 }}
            onClick={handleTap}
            disabled={acting}
          >
            {acting ? "..." : isTappedIn ? "Tap Out" : "Tap In"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger py-1 px-3 mb-0 small" style={{ width: "100%" }}>{error}</div>}
    </div>
  );
};

export default AttendanceCard;
