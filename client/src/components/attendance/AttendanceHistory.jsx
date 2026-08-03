import React, { useState, useEffect } from "react";
import attendanceService from "../../services/attendanceService";
import { PaginationBar, SortableHeader } from "../PaginationBar";

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [sort, setSort] = useState({ sortBy: "date", sortDir: "desc" });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await attendanceService.getHistory();
        if (res.success) {
          setHistory(res.history);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSort = (newSort) => {
    setSort(newSort);
  };

  const sortedHistory = [...history].sort((a, b) => {
    let aVal = a[sort.sortBy] || "";
    let bVal = b[sort.sortBy] || "";
    if (aVal < bVal) return sort.sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sort.sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage) || 1;
  const currentData = sortedHistory.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Working": return <span className="badge bg-primary">Working</span>;
      case "Completed": return <span className="badge bg-success">Completed</span>;
      case "Absent": return <span className="badge bg-secondary">Absent</span>;
      case "Late": return <span className="badge bg-warning text-dark">Late</span>;
      default: return <span className="badge bg-light text-dark border">{status}</span>;
    }
  };

  return (
    <div className="ew-card mt-4 mb-4">
      <div className="card-header bg-white border-bottom p-4">
        <h5 className="mb-0 fw-bold" style={{ color: "#0f172a" }}>Attendance History</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{ fontSize: "14px" }}>
          <thead className="bg-light">
            <tr>
              <SortableHeader label="Date" field="date" sort={sort} onSort={handleSort} />
              <SortableHeader label="Tap In" field="tapInTime" sort={sort} onSort={handleSort} />
              <SortableHeader label="Tap Out" field="tapOutTime" sort={sort} onSort={handleSort} />
              <SortableHeader label="Work Hours" field="workingHours" sort={sort} onSort={handleSort} />
              <SortableHeader label="Break Time" field="breakTime" sort={sort} onSort={handleSort} />
              <SortableHeader label="Status" field="status" sort={sort} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">Loading history...</td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No attendance records found.</td>
              </tr>
            ) : (
              currentData.map(record => (
                <tr key={record.id}>
                  <td className="fw-medium">{record.date}</td>
                  <td>{formatTime(record.tapInTime)}</td>
                  <td>{formatTime(record.tapOutTime)}</td>
                  <td className="fw-bold text-dark">{record.workingHours || "--"}</td>
                  <td>{record.breakTime || "--"}</td>
                  <td>{getStatusBadge(record.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {history.length > 0 && (
        <div className="card-footer bg-white border-top p-3">
          <PaginationBar 
            pagination={{ page, totalPages, total: history.length, limit: itemsPerPage }} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
