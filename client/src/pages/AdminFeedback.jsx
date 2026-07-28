import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getAllFeedback, updateFeedbackStatus } from "../services/feedbackService";
import { PaginationBar } from "../components/PaginationBar";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  
  // Modal State
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination (client-side)
  const [page, setPage] = useState(1);
  const limit = 15;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllFeedback();
      setFeedbacks(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load feedback records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Summary Stats
  const stats = useMemo(() => {
    const total = feedbacks.length;
    let newCount = 0;
    let reviewedCount = 0;
    let thisMonthCount = 0;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    feedbacks.forEach(f => {
      if (f.status === "New") newCount++;
      if (f.status === "Reviewed") reviewedCount++;
      
      const created = new Date(f.createdAt);
      if (created.getMonth() === currentMonth && created.getFullYear() === currentYear) {
        thisMonthCount++;
      }
    });

    return { total, newCount, reviewedCount, thisMonthCount };
  }, [feedbacks]);

  // Filtering
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f => {
      const matchStatus = statusFilter === "All" || f.status === statusFilter;
      const matchType = typeFilter === "All" || f.feedbackType === typeFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch = term === "" || 
        f.submitter?.fullName?.toLowerCase().includes(term) ||
        f.submitter?.email?.toLowerCase().includes(term) ||
        f.reason?.toLowerCase().includes(term) ||
        f.comments?.toLowerCase().includes(term);
      return matchStatus && matchType && matchSearch;
    });
  }, [feedbacks, statusFilter, typeFilter, searchTerm]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [statusFilter, typeFilter, searchTerm]);

  // Pagination slice
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredFeedbacks.slice(start, start + limit);
  }, [filteredFeedbacks, page]);

  // Unique Feedback Types for filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = new Set(feedbacks.map(f => f.feedbackType).filter(Boolean));
    return ["All", ...Array.from(types)];
  }, [feedbacks]);

  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState("New");

  const handleView = (f) => {
    setSelectedFeedback(f);
    setEditNote(f.adminNote || "");
    setEditStatus(f.status || "New");
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedFeedback) return;
    try {
      const res = await fetch(`${(import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "")}/feedback/${selectedFeedback.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: editStatus, adminNote: editNote }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      const updated = data.feedback;
      setFeedbacks(prev => prev.map(f => f.id === updated.id ? updated : f));
      setSelectedFeedback(updated);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "100%", padding: "4px 0" }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: "20px", letterSpacing: "-0.01em", color: "var(--crm-dark)" }}>
            Feedback
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
            View and manage feedback submitted by employees.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-2">
        {[
          { label: "TOTAL FEEDBACK", value: stats.total },
          { label: "NEW FEEDBACK", value: stats.newCount },
          { label: "REVIEWED", value: stats.reviewedCount },
          { label: "THIS MONTH", value: stats.thisMonthCount },
        ].map((card, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div className="bg-white rounded-2 px-3 py-2" style={{ border: "1px solid var(--crm-border)", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <div className="text-muted fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>{card.label}</div>
              <div className="fw-bold text-dark mt-1" style={{ fontSize: "18px", lineHeight: 1 }}>
                {loading ? "--" : card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="d-flex gap-2 flex-wrap align-items-center mt-2">
        <div className="flex-fill" style={{ minWidth: "200px" }}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-sm border-start-0 ps-0"
                style={{ height: "36px" }}
                placeholder="Search by employee, reason, or comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div style={{ minWidth: "140px" }}>
            <select className="form-select form-select-sm" style={{ height: "36px" }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type === "All" ? "All Types" : type}</option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: "140px" }}>
            <select className="form-select form-select-sm" style={{ height: "36px" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>
        </div>

      {/* TABLE */}
      <div className="bg-white rounded-3 flex-fill d-flex flex-column" style={{ border: "1px solid var(--crm-border)", minHeight: "350px" }}>
        {loading ? (
          <div className="flex-fill d-flex align-items-center justify-content-center text-muted" style={{ fontSize: "13px" }}>
            <div className="spinner-border spinner-border-sm me-2" /> Loading feedback...
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="flex-fill d-flex flex-column align-items-center justify-content-center text-muted p-4">
            <h6 className="fw-medium text-dark mb-1">No feedback available</h6>
            <p className="small mb-0">Employee feedback will appear here.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table crm-table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="text-muted fw-semibold small py-3 px-4 border-0">EMPLOYEE</th>
                    <th className="text-muted fw-semibold small py-3 border-0">CATEGORY</th>
                    <th className="text-muted fw-semibold small py-3 border-0">CHAT TYPE</th>
                    <th className="text-muted fw-semibold small py-3 border-0">RATING</th>
                    <th className="text-muted fw-semibold small py-3 border-0">SUBMITTED</th>
                    <th className="text-muted fw-semibold small py-3 border-0">STATUS</th>
                    <th className="text-muted fw-semibold small py-3 px-4 border-0 text-end">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {paginatedData.map(f => (
                    <tr key={f.id} style={{ transition: "background 0.2s" }} className="hover-bg-light">
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          {f.submitter?.avatarUrl ? (
                            <img src={f.submitter.avatarUrl} alt="Avatar" className="rounded-circle object-fit-cover" width="32" height="32" />
                          ) : (
                            <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "12px" }}>
                              {(f.submitter?.fullName || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="fw-medium text-dark" style={{ fontSize: "14px" }}>{f.submitter?.fullName || "Unknown"}</div>
                            <div className="text-muted" style={{ fontSize: "12px" }}>{f.submitter?.email || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge bg-secondary bg-opacity-10 text-secondary border">
                          {f.reason || f.feedbackType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-dark text-capitalize" style={{ fontSize: "14px" }}>
                        {f.chatType || "--"}
                      </td>
                      <td className="py-3 text-dark text-nowrap" style={{ fontSize: "14px" }}>
                        {f.rating ? `${f.rating}/5` : "--"}
                      </td>
                      <td className="py-3 text-muted" style={{ fontSize: "14px" }}>
                        {new Date(f.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <span className={`badge rounded-pill ${f.status === "New" ? "bg-warning text-dark" : "bg-success"} bg-opacity-10 border border-${f.status === "New" ? "warning" : "success"}-subtle`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button className="btn btn-sm btn-light border shadow-sm" onClick={() => handleView(f)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Component - same one used elsewhere */}
            {filteredFeedbacks.length > limit && (
              <div className="p-3 border-top d-flex justify-content-center bg-white mt-auto">
                <PaginationBar
                  currentPage={page}
                  totalPages={Math.ceil(filteredFeedbacks.length / limit)}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* DETAILS MODAL */}
      {showModal && selectedFeedback && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(15,23,42,0.4)", zIndex: 1050 }} onClick={closeModal}>
          <div className="bg-white rounded-3 shadow-lg d-flex flex-column" style={{ width: "500px", maxWidth: "95%" }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="fw-bold mb-0">Feedback Details</h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="p-4" style={{ overflowY: "auto", maxHeight: "60vh" }}>
              
              <div className="d-flex align-items-center gap-3 mb-4">
                {selectedFeedback.submitter?.avatarUrl ? (
                  <img src={selectedFeedback.submitter.avatarUrl} alt="Avatar" className="rounded-circle object-fit-cover shadow-sm border" width="48" height="48" />
                ) : (
                  <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold shadow-sm border border-primary-subtle" style={{ width: "48px", height: "48px", fontSize: "16px" }}>
                    {(selectedFeedback.submitter?.fullName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="fw-bold fs-6 text-dark">{selectedFeedback.submitter?.fullName || "Unknown"}</div>
                  <div className="text-muted small">{selectedFeedback.submitter?.email || ""}</div>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted fw-bold small text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>Category</label>
                <div className="text-dark fw-medium">
                  {selectedFeedback.reason || selectedFeedback.feedbackType.replace("_", " ")}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted fw-bold small text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>Chat Type</label>
                <div className="text-dark text-capitalize fw-medium">
                  {selectedFeedback.chatType || "--"}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted fw-bold small text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>Rating</label>
                <div className="text-dark fw-medium">
                  {selectedFeedback.rating ? `${selectedFeedback.rating} / 5` : "--"}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted fw-bold small text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>Submitted</label>
                <div className="text-dark">
                  {new Date(selectedFeedback.createdAt).toLocaleString()}
                </div>
              </div>

              {selectedFeedback.comments && (
                <div className="mb-3">
                  <label className="text-muted fw-bold small text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>Employee Feedback</label>
                  <div className="bg-light p-3 rounded text-dark border" style={{ whiteSpace: "pre-wrap" }}>
                    {selectedFeedback.comments}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="text-muted fw-bold small text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>Admin Note</label>
                <textarea
                  className="form-control text-dark"
                  rows="3"
                  placeholder="Add an internal note..."
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="text-muted fw-bold small text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>Status</label>
                <select className="form-select text-dark" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="New">New</option>
                  <option value="Reviewed">Reviewed</option>
                </select>
              </div>

            </div>
            <div className="p-3 border-top d-flex justify-content-end gap-2 bg-light rounded-bottom">
              <button className="btn btn-outline-secondary px-4 fw-medium" onClick={closeModal}>Close</button>
              <button className="btn btn-primary px-4 fw-medium shadow-sm" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
