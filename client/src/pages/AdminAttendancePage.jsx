import React, { useState, useEffect } from "react";
import attendanceService from "../services/attendanceService";
import { onSocketEvent } from "../services/socketService";
import { PaginationBar, SortableHeader } from "../components/PaginationBar";

const AdminAttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination and sorting
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [sort, setSort] = useState({ sortBy: "date", sortDir: "desc" });

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAllAttendance({ date: filterDate });
      if (res.success) {
        setAttendances(res.attendances);
      }
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
    const unsub = onSocketEvent("attendance:updated", loadAttendance);
    return () => unsub();
  }, [filterDate]);

  // Statistics
  const totalEmployees = attendances.length;
  const workingCount = attendances.filter(a => a.status === "Working").length;
  const completedCount = attendances.filter(a => a.status === "Completed").length;
  const absentCount = attendances.filter(a => a.status === "Absent").length;
  const presentCount = workingCount + completedCount;

  // Filter
  let filtered = attendances.filter(a => {
    const s = search.toLowerCase();
    return a.employeeName.toLowerCase().includes(s) || (a.department && a.department.toLowerCase().includes(s));
  });

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sort.sortBy] || "";
    let bVal = b[sort.sortBy] || "";
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sort.sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sort.sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSort = (newSort) => {
    setSort(newSort);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Working": return <span className="badge bg-primary rounded-pill">Working</span>;
      case "Completed": return <span className="badge bg-success rounded-pill">Completed</span>;
      case "Absent": return <span className="badge bg-secondary rounded-pill">Absent</span>;
      case "Late": return <span className="badge bg-warning text-dark rounded-pill">Late</span>;
      default: return <span className="badge bg-light text-dark border rounded-pill">{status}</span>;
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--crm-dark)" }}>Attendance Management</h3>
          <p className="text-muted mb-0">Monitor organization-wide attendance records</p>
        </div>
        <div>
          <input 
            type="date" 
            className="form-control form-control-sm border-0 shadow-sm rounded-3 px-3 py-2" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <span className="text-muted small fw-bold">TOTAL RECORDS</span>
            <h3 className="fw-bold text-dark mt-2 mb-0">{totalEmployees}</h3>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <span className="text-muted small fw-bold">PRESENT TODAY</span>
            <h3 className="fw-bold text-success mt-2 mb-0">{presentCount}</h3>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <span className="text-muted small fw-bold">CURRENTLY WORKING</span>
            <h3 className="fw-bold text-primary mt-2 mb-0">{workingCount}</h3>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <span className="text-muted small fw-bold">COMPLETED</span>
            <h3 className="fw-bold text-dark mt-2 mb-0">{completedCount}</h3>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <span className="text-muted small fw-bold">ABSENT</span>
            <h3 className="fw-bold text-secondary mt-2 mb-0">{absentCount}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white border-bottom p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Attendance Records</h5>
            <div className="input-group" style={{ width: "300px" }}>
              <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
              <input 
                type="text" 
                className="form-control bg-light border-0" 
                placeholder="Search employee or dept..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <SortableHeader label="Employee Name" field="employeeName" sort={sort} onSort={handleSort} />
                <SortableHeader label="Role" field="role" sort={sort} onSort={handleSort} />
                <SortableHeader label="Department" field="department" sort={sort} onSort={handleSort} />
                <SortableHeader label="Tap In" field="tapInTime" sort={sort} onSort={handleSort} />
                <SortableHeader label="Tap Out" field="tapOutTime" sort={sort} onSort={handleSort} />
                <SortableHeader label="Work Hours" field="workingHours" sort={sort} onSort={handleSort} />
                <SortableHeader label="Status" field="status" sort={sort} onSort={handleSort} />
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm me-2"></div> Loading...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No attendance records found for {filterDate}.
                  </td>
                </tr>
              ) : (
                currentData.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "12px" }}>
                          {a.employeeName.charAt(0)}
                        </div>
                        <span className="fw-medium text-dark">{a.employeeName}</span>
                      </div>
                    </td>
                    <td>
                      {a.role === "admin" ? <span className="badge bg-danger rounded-pill">Admin</span> : <span className="badge bg-secondary rounded-pill">Employee</span>}
                    </td>
                    <td className="text-muted small">{a.department}</td>
                    <td className="fw-medium">{formatTime(a.tapInTime)}</td>
                    <td className="fw-medium">{formatTime(a.tapOutTime)}</td>
                    <td className="fw-bold">{a.workingHours || "--"}</td>
                    <td>{getStatusBadge(a.status)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-light border text-muted px-3 rounded-pill"
                        onClick={() => { setSelectedAttendance(a); setShowModal(true); }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="card-footer bg-white border-top p-3">
            <PaginationBar 
              pagination={{ page, totalPages, total: filtered.length, limit: itemsPerPage }} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </div>

      {showModal && selectedAttendance && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Attendance Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4 me-3" style={{ width: "60px", height: "60px" }}>
                    {selectedAttendance.employeeName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">{selectedAttendance.employeeName}</h5>
                    <p className="text-muted mb-0 small">{selectedAttendance.department} • {selectedAttendance.role}</p>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <label className="text-muted small mb-1">Date</label>
                    <p className="fw-medium">{selectedAttendance.date}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small mb-1">Status</label>
                    <div>{getStatusBadge(selectedAttendance.status)}</div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small mb-1">Tap In</label>
                    <p className="fw-medium">{formatTime(selectedAttendance.tapInTime)}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small mb-1">Tap Out</label>
                    <p className="fw-medium">{formatTime(selectedAttendance.tapOutTime)}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small mb-1">Working Hours</label>
                    <p className="fw-bold text-primary">{selectedAttendance.workingHours || "0h 0m"}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small mb-1">Break Time</label>
                    <p className="fw-medium">{selectedAttendance.breakTime || "0h 0m"}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-medium" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendancePage;
