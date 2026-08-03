import React, { useState, useEffect, useCallback } from "react";
import {
  createRegularizationRequest,
  getMyRegularizationRequests,
  getMyAttendance,
} from "../../services/plannerService";
import { onSocketEvent } from "../../services/socketService";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad2 = (n) => String(n).padStart(2, "0");
const toDateKey = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`;

const PlannerPage = () => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-12

  const [records, setRecords] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [form, setForm] = useState({ timeIn: "", timeOut: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [attendanceRes, requests] = await Promise.all([
        getMyAttendance(viewMonth, viewYear),
        getMyRegularizationRequests(),
      ]);
      setRecords(attendanceRes.records || []);
      setPendingRequests(attendanceRes.pendingRequests || []);
      setMyRequests(requests || []);
    } catch (err) {
      console.error("Error loading planner data:", err);
    } finally {
      setLoading(false);
    }
  }, [viewMonth, viewYear]);

  useEffect(() => {
    load();
    const unsubUpdated = onSocketEvent("attendance:updated", load);
    return () => unsubUpdated && unsubUpdated();
  }, [load]);

  const recordsByDate = {};
  records.forEach((r) => { recordsByDate[r.date] = r; });
  const pendingByDate = {};
  pendingRequests.forEach((r) => { pendingByDate[r.date] = r; });

  const goPrevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const openModalForDate = (dateKey) => {
    setModalDate(dateKey);
    setForm({ timeIn: "", timeOut: "", reason: "" });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.timeIn || !form.timeOut) {
      setFormError("Time In and Time Out are required.");
      return;
    }
    setSubmitting(true);
    try {
      await createRegularizationRequest({
        date: modalDate,
        timeIn: form.timeIn,
        timeOut: form.timeOut,
        reason: form.reason,
      });
      setModalOpen(false);
      await load();
      setToast("Regularization request sent to admin for approval.");
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      setFormError(err?.response?.data?.message || "Couldn't submit this request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0=Sun
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isFutureDate = (dateKey) => dateKey > toDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const statusBadgeClass = (status) =>
    status === "Approved" || status === "Completed" ? "bg-success"
      : status === "Rejected" ? "bg-danger"
      : "bg-warning text-dark";

  return (
    <div className="dashboard-card-flat" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-0"><i className="bi bi-calendar3 me-2"></i>Planner</h5>
          <p className="text-muted small mb-0">Your daily Tap In / Tap Out log. Missing a day? Request regularization and admin will review it.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-light border" onClick={goPrevMonth}><i className="bi bi-chevron-left"></i></button>
          <span className="fw-semibold text-dark small" style={{ minWidth: "140px", textAlign: "center" }}>
            {MONTH_NAMES[viewMonth - 1]} {viewYear}
          </span>
          <button className="btn btn-sm btn-light border" onClick={goNextMonth}><i className="bi bi-chevron-right"></i></button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted py-5">Loading planner…</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered mb-0" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr className="text-center small text-muted">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <th key={d} className="fw-semibold py-2">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, rowIdx) => (
                  <tr key={rowIdx} style={{ height: "78px" }}>
                    {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                      if (!day) return <td key={colIdx} className="bg-light"></td>;
                      const dateKey = toDateKey(viewYear, viewMonth, day);
                      const record = recordsByDate[dateKey];
                      const pending = pendingByDate[dateKey];
                      const future = isFutureDate(dateKey);
                      return (
                        <td key={colIdx} className="align-top p-2" style={{ verticalAlign: "top" }}>
                          <div className="small text-muted mb-1">{day}</div>
                          {record ? (
                            <div className="small">
                              <div className="fw-medium text-dark">{record.timeIn} - {record.timeOut || "…"}</div>
                              <span className={`badge ${statusBadgeClass(record.status)}`} style={{ fontSize: "10px" }}>{record.status}</span>
                            </div>
                          ) : pending ? (
                            <div className="small">
                              <div className="text-muted">{pending.timeIn} - {pending.timeOut}</div>
                              <span className="badge bg-warning text-dark" style={{ fontSize: "10px" }}>Pending</span>
                            </div>
                          ) : !future ? (
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              style={{ width: "26px", height: "26px", padding: 0, lineHeight: 1 }}
                              title="Request attendance regularization"
                              onClick={() => openModalForDate(dateKey)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h6 className="fw-bold text-dark small text-uppercase" style={{ letterSpacing: "0.5px" }}>My Regularization Requests</h6>
            {myRequests.length === 0 ? (
              <p className="text-muted small mb-0">No regularization requests yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0" style={{ fontSize: "13.5px" }}>
                  <thead>
                    <tr>
                      <th className="text-secondary fw-semibold border-bottom">Date</th>
                      <th className="text-secondary fw-semibold border-bottom">Time In</th>
                      <th className="text-secondary fw-semibold border-bottom">Time Out</th>
                      <th className="text-secondary fw-semibold border-bottom">Reason</th>
                      <th className="text-secondary fw-semibold border-bottom">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.map((r) => (
                      <tr key={r.id}>
                        <td>{r.date}</td>
                        <td>{r.timeIn}</td>
                        <td>{r.timeOut}</td>
                        <td className="text-secondary">{r.reason || "—"}</td>
                        <td><span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Timesheet Modal */}
      {modalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 px-4">
                <h5 className="modal-title fw-bold text-dark mb-0">Timesheet</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted text-uppercase">Date</label>
                    <input type="text" className="form-control" value={modalDate} disabled />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">Time In</label>
                      <input
                        type="time"
                        className="form-control"
                        value={form.timeIn}
                        onChange={(e) => setForm((f) => ({ ...f, timeIn: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">Time Out</label>
                      <input
                        type="time"
                        className="form-control"
                        value={form.timeOut}
                        onChange={(e) => setForm((f) => ({ ...f, timeOut: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-1">
                    <label className="form-label small fw-semibold text-muted text-uppercase">Comments / Reason</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="e.g. CRM Maintenance — couldn't tap in/out"
                      value={form.reason}
                      onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                    />
                  </div>
                  {formError && <div className="alert alert-danger py-2 small mt-3 mb-0">{formError}</div>}
                </div>
                <div className="modal-footer border-top p-3 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light btn-sm px-4 rounded-2 border fw-medium text-dark" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm px-4 rounded-2 fw-medium" disabled={submitting}>
                    {submitting ? "Sending…" : "Save & Send to Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <div className="toast show align-items-center text-white bg-success border-0 rounded-3 shadow" role="alert">
            <div className="d-flex">
              <div className="toast-body fw-medium"><i className="bi bi-check-circle me-2"></i>{toast}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast("")}></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerPage;
